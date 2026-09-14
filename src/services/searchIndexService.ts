import { 
  Book, 
  FormatType, 
  PredictiveSuggestions, 
  PredictiveSearchBookItem, 
  PredictiveSearchAuthorItem, 
  PredictiveSearchGenreItem 
} from '../types';

export interface SearchMatch {
  book: Book;
  score: number;
  matchedFields: string[];
  snippet: string;
}

export interface SearchIndexStats {
  totalBooksIndexed: number;
  totalUniqueTokens: number;
  totalPostings: number;
  lastIndexedAt: string;
}

// Inverted Index: token -> Set of { bookId, weight, field }
interface IndexPosting {
  bookId: string;
  weight: number;
  field: string;
}

class SearchIndexService {
  private invertedIndex: Map<string, IndexPosting[]> = new Map();
  private booksMap: Map<string, Book> = new Map();
  private lastIndexedAt: string = new Date().toISOString();

  private stopWords = new Set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at',
    'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
    'could', 'did', 'do', 'does', 'doing', 'down', 'during',
    'each', 'few', 'for', 'from', 'further',
    'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
    'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself',
    'me', 'more', 'most', 'my', 'myself',
    'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own',
    'same', 'she', 'should', 'so', 'some', 'such',
    'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too',
    'under', 'until', 'up', 'very',
    'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would',
    'you', 'your', 'yours', 'yourself', 'yourselves'
  ]);

  private tokenize(text: string): string[] {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s\d-]/g, ' ')
      .split(/\s+/)
      .map(t => t.trim())
      .filter(t => t.length >= 2);
  }

  public indexBooks(books: Book[]) {
    this.invertedIndex.clear();
    this.booksMap.clear();

    for (const book of books) {
      this.booksMap.set(book.id, book);

      const fields: { name: string; weight: number; text: string }[] = [
        { name: 'title', weight: 12, text: book.title },
        { name: 'subtitle', weight: 8, text: book.subtitle || '' },
        { name: 'author', weight: 10, text: book.author },
        { name: 'category', weight: 7, text: book.category },
        { name: 'isbn', weight: 15, text: book.isbn || '' },
        { name: 'tags', weight: 6, text: (book.tags || []).join(' ') },
        { name: 'formats', weight: 5, text: Object.values(book.formats).map(f => `${f.type} ${f.name} ${f.badge}`).join(' ') },
        { name: 'description', weight: 3, text: book.description || '' },
        { name: 'publisher', weight: 4, text: book.publisher || '' }
      ];

      for (const field of fields) {
        const tokens = this.tokenize(field.text);
        const seenInField = new Set<string>();

        for (const token of tokens) {
          if (seenInField.has(token)) continue;
          seenInField.add(token);

          // Full token
          this.addPosting(token, {
            bookId: book.id,
            weight: field.weight,
            field: field.name
          });

          // Prefix indexing for auto-complete (min 3 chars)
          if (token.length >= 4) {
            for (let len = 3; len < token.length; len++) {
              const prefix = token.slice(0, len);
              this.addPosting(prefix, {
                bookId: book.id,
                weight: Math.max(1, Math.round(field.weight * 0.4)),
                field: `${field.name}:prefix`
              });
            }
          }
        }
      }
    }

    this.lastIndexedAt = new Date().toISOString();
  }

  private addPosting(token: string, posting: IndexPosting) {
    if (!this.invertedIndex.has(token)) {
      this.invertedIndex.set(token, []);
    }
    this.invertedIndex.get(token)!.push(posting);
  }

  public search(
    query: string,
    options?: {
      category?: string;
      format?: FormatType | 'all';
      minPrice?: number;
      maxPrice?: number;
    }
  ): { results: SearchMatch[]; executionTimeMs: number; totalIndexed: number } {
    const startTime = performance.now();
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      // Return all books with optional filters
      let matchedBooks = Array.from(this.booksMap.values());
      if (options?.category && options.category !== 'All Categories') {
        matchedBooks = matchedBooks.filter(b => b.category === options.category);
      }
      if (options?.format && options.format !== 'all') {
        matchedBooks = matchedBooks.filter(b => Object.values(b.formats).some(f => f.type === options.format));
      }
      const results: SearchMatch[] = matchedBooks.map(b => ({
        book: b,
        score: 1,
        matchedFields: ['all'],
        snippet: b.description ? b.description.slice(0, 160) + '...' : ''
      }));
      return {
        results,
        executionTimeMs: Math.round((performance.now() - startTime) * 100) / 100,
        totalIndexed: this.booksMap.size
      };
    }

    // Accumulate scores for each book
    const scoreMap = new Map<string, { score: number; matchedFields: Set<string> }>();

    for (const token of queryTokens) {
      const postings = this.invertedIndex.get(token);
      if (postings) {
        for (const post of postings) {
          const entry = scoreMap.get(post.bookId) || { score: 0, matchedFields: new Set<string>() };
          entry.score += post.weight;
          entry.matchedFields.add(post.field.replace(':prefix', ''));
          scoreMap.set(post.bookId, entry);
        }
      }
    }

    // Bonus for multi-token matches
    const multiTokenBonus = queryTokens.length > 1;

    let searchResults: SearchMatch[] = [];

    for (const [bookId, data] of scoreMap.entries()) {
      const book = this.booksMap.get(bookId);
      if (!book) continue;

      // Filter by category
      if (options?.category && options.category !== 'All Categories' && book.category !== options.category) {
        continue;
      }

      // Filter by format
      if (options?.format && options.format !== 'all' && !Object.values(book.formats).some(f => f.type === options.format)) {
        continue;
      }

      // Compute highlight snippet
      let snippet = book.description ? book.description.slice(0, 160) + '...' : '';
      if (book.subtitle && queryTokens.some(q => book.subtitle?.toLowerCase().includes(q))) {
        snippet = `"${book.subtitle}" — ${snippet}`;
      }

      let finalScore = data.score;
      if (multiTokenBonus) {
        const queryLower = query.toLowerCase();
        if (book.title.toLowerCase().includes(queryLower)) {
          finalScore += 25; // Exact phrase match bonus
        }
      }

      searchResults.push({
        book,
        score: finalScore,
        matchedFields: Array.from(data.matchedFields),
        snippet
      });
    }

    // Sort descending by score
    searchResults.sort((a, b) => b.score - a.score);

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    return {
      results: searchResults,
      executionTimeMs,
      totalIndexed: this.booksMap.size
    };
  }

  public getStats(): SearchIndexStats {
    let totalPostings = 0;
    for (const list of this.invertedIndex.values()) {
      totalPostings += list.length;
    }

    return {
      totalBooksIndexed: this.booksMap.size,
      totalUniqueTokens: this.invertedIndex.size,
      totalPostings,
      lastIndexedAt: this.lastIndexedAt
    };
  }

  public getPredictiveSuggestions(query: string, fallbackBooks: Book[] = []): PredictiveSuggestions {
    // Ensure booksMap is populated
    if (this.booksMap.size === 0 && fallbackBooks.length > 0) {
      this.indexBooks(fallbackBooks);
    }

    const allBooks = Array.from(this.booksMap.values());
    const q = query.trim().toLowerCase();

    // Helper to get book starting price
    const getBookMinPrice = (b: Book): number => {
      const prices = Object.values(b.formats).map(f => f.price).filter(p => typeof p === 'number' && p > 0);
      return prices.length > 0 ? Math.min(...prices) : 9.99;
    };

    // Helper to format book item
    const toBookItem = (b: Book): PredictiveSearchBookItem => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      author: b.author,
      category: b.category,
      coverImage: b.coverImage,
      rating: b.rating,
      price: getBookMinPrice(b),
      formats: Object.keys(b.formats) as FormatType[]
    });

    // 1. EMPTY / INITIAL STATE: Return trending popular books, top authors & genres
    if (!q) {
      const popularBooks = [...allBooks]
        .sort((a, b) => (b.reviewCount * b.rating) - (a.reviewCount * a.rating))
        .slice(0, 4)
        .map(toBookItem);

      // Unique authors
      const authorMap = new Map<string, { bookCount: number; primaryCategory: string; sampleCoverImage: string }>();
      allBooks.forEach(b => {
        const existing = authorMap.get(b.author);
        if (existing) {
          existing.bookCount += 1;
        } else {
          authorMap.set(b.author, {
            bookCount: 1,
            primaryCategory: b.category,
            sampleCoverImage: b.coverImage
          });
        }
      });
      const topAuthors: PredictiveSearchAuthorItem[] = Array.from(authorMap.entries())
        .map(([name, data]) => ({
          id: `author-${name.toLowerCase().replace(/\s+/g, '-')}`,
          name,
          bookCount: data.bookCount,
          primaryCategory: data.primaryCategory,
          sampleCoverImage: data.sampleCoverImage
        }))
        .slice(0, 4);

      // Categories
      const categoryMap = new Map<string, number>();
      allBooks.forEach(b => {
        categoryMap.set(b.category, (categoryMap.get(b.category) || 0) + 1);
      });
      const topGenres: PredictiveSearchGenreItem[] = Array.from(categoryMap.entries())
        .map(([name, count]) => ({
          id: `genre-${name.toLowerCase().replace(/\s+/g, '-')}`,
          name,
          bookCount: count
        }))
        .sort((a, b) => b.bookCount - a.bookCount)
        .slice(0, 5);

      return {
        books: popularBooks,
        authors: topAuthors,
        genres: topGenres,
        popularQueries: [
          'The Sovereign Creator',
          'Marcus Sterling',
          'AI Architecture',
          'Audiobook 320kbps',
          'Decentralized Publishing',
          'Physical Hardcovers'
        ],
        totalMatches: allBooks.length
      };
    }

    // 2. QUERY MATCHING STATE
    const queryTokens = this.tokenize(q);

    // Score and filter books
    const scoredBooks: { book: Book; score: number }[] = [];

    for (const book of allBooks) {
      const titleLower = book.title.toLowerCase();
      const authorLower = book.author.toLowerCase();
      const categoryLower = book.category.toLowerCase();
      const subtitleLower = (book.subtitle || '').toLowerCase();
      const tags = (book.tags || []).map(t => t.toLowerCase());

      let score = 0;

      // Exact title match / startsWith
      if (titleLower.startsWith(q)) score += 80;
      else if (titleLower.includes(q)) score += 50;

      // Author match
      if (authorLower.startsWith(q)) score += 60;
      else if (authorLower.includes(q)) score += 40;

      // Category match
      if (categoryLower.startsWith(q)) score += 45;
      else if (categoryLower.includes(q)) score += 30;

      // Subtitle & tag match
      if (subtitleLower.includes(q)) score += 20;
      if (tags.some(t => t.includes(q))) score += 15;

      // Token-based matching
      for (const token of queryTokens) {
        if (titleLower.includes(token)) score += 15;
        if (authorLower.includes(token)) score += 12;
        if (categoryLower.includes(token)) score += 10;
      }

      if (score > 0) {
        scoredBooks.push({ book, score });
      }
    }

    scoredBooks.sort((a, b) => b.score - a.score);
    const matchedBookItems = scoredBooks.slice(0, 5).map(s => toBookItem(s.book));

    // Matching Authors
    const matchedAuthorsMap = new Map<string, { bookCount: number; primaryCategory: string; sampleCoverImage: string }>();
    allBooks.forEach(b => {
      const authorLower = b.author.toLowerCase();
      if (authorLower.includes(q) || queryTokens.some(t => authorLower.includes(t))) {
        const existing = matchedAuthorsMap.get(b.author);
        if (existing) {
          existing.bookCount += 1;
        } else {
          matchedAuthorsMap.set(b.author, {
            bookCount: 1,
            primaryCategory: b.category,
            sampleCoverImage: b.coverImage
          });
        }
      }
    });
    // If no direct author match, include author of the top-scored book
    if (matchedAuthorsMap.size === 0 && scoredBooks.length > 0) {
      const topB = scoredBooks[0].book;
      matchedAuthorsMap.set(topB.author, {
        bookCount: allBooks.filter(b => b.author === topB.author).length,
        primaryCategory: topB.category,
        sampleCoverImage: topB.coverImage
      });
    }

    const matchedAuthors: PredictiveSearchAuthorItem[] = Array.from(matchedAuthorsMap.entries())
      .slice(0, 3)
      .map(([name, data]) => ({
        id: `author-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        bookCount: data.bookCount,
        primaryCategory: data.primaryCategory,
        sampleCoverImage: data.sampleCoverImage
      }));

    // Matching Genres / Categories
    const categoryCountMap = new Map<string, number>();
    allBooks.forEach(b => {
      categoryCountMap.set(b.category, (categoryCountMap.get(b.category) || 0) + 1);
    });

    const matchedGenres: PredictiveSearchGenreItem[] = Array.from(categoryCountMap.entries())
      .filter(([catName]) => {
        const catLower = catName.toLowerCase();
        return catLower.includes(q) || queryTokens.some(t => catLower.includes(t));
      })
      .slice(0, 4)
      .map(([name, count]) => ({
        id: `genre-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        bookCount: count
      }));

    // Dynamic phrase completions
    const dynamicQueries: string[] = [];
    matchedBookItems.forEach(b => {
      if (b.title.toLowerCase().startsWith(q) && !dynamicQueries.includes(b.title)) {
        dynamicQueries.push(b.title);
      }
    });
    matchedAuthors.forEach(a => {
      if (!dynamicQueries.includes(a.name)) dynamicQueries.push(a.name);
    });
    matchedGenres.forEach(g => {
      if (!dynamicQueries.includes(g.name)) dynamicQueries.push(g.name);
    });

    // Fallback if empty
    if (dynamicQueries.length === 0 && q.length >= 2) {
      dynamicQueries.push(query);
    }

    return {
      books: matchedBookItems,
      authors: matchedAuthors,
      genres: matchedGenres,
      popularQueries: dynamicQueries.slice(0, 4),
      totalMatches: scoredBooks.length + matchedAuthors.length + matchedGenres.length
    };
  }
}

export const searchIndex = new SearchIndexService();
