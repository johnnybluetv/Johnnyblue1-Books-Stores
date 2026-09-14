/**
 * Natural Language Search & AI Query Understanding Service
 * Analyzes conversational reader requests, extracts intent, formats, categories, and price limits.
 */

import { Book, FormatType } from '../types';

export interface NaturalLanguageParsedQuery {
  isNaturalLanguage: boolean;
  originalQuery: string;
  cleanedKeyword: string;
  detectedFormat?: FormatType;
  detectedFormatLabel?: string;
  detectedCategory?: string;
  maxPrice?: number;
  minRating?: number;
  tags: string[];
  summaryBadge: string;
  explanation: string;
}

export interface AISuggestedQuery {
  id: string;
  label: string;
  query: string;
  categoryTag: string;
  format?: FormatType;
  icon: string;
}

export const CURATED_AI_SEARCH_SUGGESTIONS: AISuggestedQuery[] = [
  {
    id: 'ai-audiobooks-tech',
    label: 'Audiobooks on AI, Leverage & Digital Wealth',
    query: 'audiobooks on artificial intelligence and digital wealth',
    categoryTag: 'Business & Philosophy',
    format: 'audiobook',
    icon: '🎧'
  },
  {
    id: 'ai-hardcovers-under-30',
    label: 'Hardcover Collector Editions under $30',
    query: 'clothbound hardcover books under $30',
    categoryTag: 'All Categories',
    format: 'hardcover',
    icon: '📚'
  },
  {
    id: 'ai-manuscripts-african',
    label: 'Raw Handwritten Author Manuscripts & Sketches',
    query: 'african literature with handwritten author manuscripts',
    categoryTag: 'African Literature',
    format: 'manuscript',
    icon: '✍️'
  },
  {
    id: 'ai-videobooks-cinema',
    label: '4K Cinematic Video Books with Motion Typography',
    query: '4k videobooks for visual readers',
    categoryTag: 'Science & Philosophy',
    format: 'videobook',
    icon: '🎬'
  },
  {
    id: 'ai-top-rated-ebooks',
    label: 'Best-selling Philosophy eBooks with 4.8+ Stars',
    query: 'top rated philosophy ebooks',
    categoryTag: 'Philosophy',
    format: 'ebook',
    icon: '⭐'
  },
  {
    id: 'ai-musical-albums',
    label: 'Original Orchestral Soundtracks for Reading',
    query: 'musical album soundtracks to accompany books',
    categoryTag: 'Music & Art',
    format: 'musical_album',
    icon: '🎵'
  }
];

// Format synonym dictionary
const FORMAT_SYNONYMS: Record<string, FormatType> = {
  'audiobook': 'audiobook',
  'audiobooks': 'audiobook',
  'audio': 'audiobook',
  'listen': 'audiobook',
  'listening': 'audiobook',
  'narration': 'audiobook',
  'spoken': 'audiobook',

  'ebook': 'ebook',
  'ebooks': 'ebook',
  'e-book': 'ebook',
  'e-books': 'ebook',
  'kindle': 'ebook',
  'epub': 'ebook',
  'pdf': 'ebook',
  'digital': 'ebook',

  'videobook': 'videobook',
  'videobooks': 'videobook',
  'video book': 'videobook',
  'video': 'videobook',
  'cinema': 'videobook',
  'film': 'videobook',
  '4k': 'videobook',

  'manuscript': 'manuscript',
  'manuscripts': 'manuscript',
  'handwritten': 'manuscript',
  'fountain pen': 'manuscript',
  'handwriting': 'manuscript',
  'raw notebook': 'manuscript',
  'author draft': 'manuscript',

  'hardcover': 'hardcover',
  'hardcovers': 'hardcover',
  'hardback': 'hardcover',
  'clothbound': 'hardcover',
  'casebound': 'hardcover',

  'papercover': 'papercover',
  'papercovers': 'papercover',
  'paperback': 'papercover',
  'paperbacks': 'papercover',
  'trade paper': 'papercover',

  'pendrive': 'pendrive_sd',
  'pendrive_sd': 'pendrive_sd',
  'usb': 'pendrive_sd',
  'sd card': 'pendrive_sd',
  'memory card': 'pendrive_sd',
  'flash drive': 'pendrive_sd',

  'musical album': 'musical_album',
  'musical_album': 'musical_album',
  'music': 'musical_album',
  'soundtrack': 'musical_album',
  'orchestra': 'musical_album',
  'album': 'musical_album',
  'songs': 'musical_album',

  'silk': 'silk_cotton',
  'cotton': 'silk_cotton',
  'silk_cotton': 'silk_cotton',
  'woven': 'silk_cotton',
  'textile': 'silk_cotton',
  'handloom': 'silk_cotton',

  'device': 'digital_device',
  'digital_device': 'digital_device',
  'e-ink': 'digital_device',
  'eink': 'digital_device',
  'tablet': 'digital_device',
  'reader slab': 'digital_device'
};

// Conversational filler phrases to strip
const FILLER_PHRASES = [
  /^find\s+(me\s+)?/i,
  /^show\s+(me\s+)?/i,
  /^give\s+(me\s+)?/i,
  /^looking\s+for\s+/i,
  /^i\s+want\s+(to\s+read\s+|to\s+buy\s+|to\s+find\s+)?/i,
  /^i\s+need\s+/i,
  /^recommend\s+(me\s+)?/i,
  /^what\s+are\s+(some\s+|the\s+best\s+)?/i,
  /^can\s+you\s+(find|show|give)\s+(me\s+)?/i,
  /^search\s+(for\s+)?/i,
  /^browse\s+/i,
  /^where\s+can\s+i\s+find\s+/i,
  /\bbooks?\s+about\b/i,
  /\bbooks?\s+on\b/i,
  /\btitles?\s+on\b/i
];

class NaturalLanguageSearchService {
  /**
   * Parse a natural language reader query into structured search intent
   */
  public parseQuery(query: string, availableCategories: string[] = []): NaturalLanguageParsedQuery {
    const raw = query.trim();
    if (!raw) {
      return {
        isNaturalLanguage: false,
        originalQuery: '',
        cleanedKeyword: '',
        tags: [],
        summaryBadge: '',
        explanation: ''
      };
    }

    const lower = raw.toLowerCase();
    let isNL = false;
    const tags: string[] = [];

    // 1. Detect Format
    let detectedFormat: FormatType | undefined;
    let detectedFormatLabel: string | undefined;

    for (const [term, fmt] of Object.entries(FORMAT_SYNONYMS)) {
      // Use word boundary check
      const regex = new RegExp(`\\b${term.replace(/\s+/g, '\\s+')}\\b`, 'i');
      if (regex.test(lower)) {
        detectedFormat = fmt;
        detectedFormatLabel = this.formatToDisplayLabel(fmt);
        isNL = true;
        tags.push(`Format: ${detectedFormatLabel}`);
        break;
      }
    }

    // 2. Detect Price Constraints ("under $20", "under 15 dollars", "less than 25", "below $30", "cheap")
    let maxPrice: number | undefined;
    const priceMatch = lower.match(/(?:under|less than|below|max|cheaper than)\s+\$?(\d+(?:\.\d{1,2})?)/i) ||
                       lower.match(/\$?(\d+(?:\.\d{1,2})?)\s*(?:dollars|usd|bucks)?\s*(?:or less|budget|max)/i);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
      isNL = true;
      tags.push(`Under $${maxPrice}`);
    } else if (/\b(cheap|budget-friendly|affordable|low price)\b/i.test(lower)) {
      maxPrice = 15;
      isNL = true;
      tags.push('Budget (< $15)');
    }

    // 3. Detect Rating / Quality Constraints ("best", "top rated", "5 stars", "above 4")
    let minRating: number | undefined;
    if (/\b(best|top rated|highest rated|top-rated|favorite|critically acclaimed)\b/i.test(lower)) {
      minRating = 4.5;
      isNL = true;
      tags.push('Top Rated (4.5★+)');
    } else if (/\b(5 stars?|5-star)\b/i.test(lower)) {
      minRating = 4.8;
      isNL = true;
      tags.push('5 Stars (4.8★+)');
    }

    // 4. Detect Category
    let detectedCategory: string | undefined;
    for (const cat of availableCategories) {
      if (cat === 'All Categories') continue;
      const catLower = cat.toLowerCase();
      // Test full category or major words
      if (lower.includes(catLower)) {
        detectedCategory = cat;
        isNL = true;
        tags.push(`Category: ${cat}`);
        break;
      }
    }

    // Fallback category matching for common genres
    if (!detectedCategory) {
      const categoryMap: Record<string, string> = {
        'african': 'African Literature',
        'africa': 'African Literature',
        'business': 'Business & Economics',
        'wealth': 'Business & Economics',
        'money': 'Business & Economics',
        'entrepreneurship': 'Business & Economics',
        'philosophy': 'Philosophy',
        'philosophical': 'Philosophy',
        'science': 'Science & Technology',
        'technology': 'Science & Technology',
        'ai': 'Science & Technology',
        'fiction': 'Fiction',
        'novel': 'Fiction',
        'novels': 'Fiction',
        'history': 'History',
        'historical': 'History',
        'poetry': 'Poetry',
        'poem': 'Poetry',
        'poems': 'Poetry',
        'spirituality': 'Religion & Spirituality',
        'spiritual': 'Religion & Spirituality'
      };

      for (const [kw, catName] of Object.entries(categoryMap)) {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(lower)) {
          detectedCategory = catName;
          isNL = true;
          tags.push(`Category: ${catName}`);
          break;
        }
      }
    }

    // 5. Clean query keywords by removing conversational noise and detected modifier words
    let cleaned = raw;

    // Remove filler phrases
    for (const phraseRegex of FILLER_PHRASES) {
      cleaned = cleaned.replace(phraseRegex, '');
    }

    // If format was detected, remove the format word from keywords so search isn't bloated
    if (detectedFormat) {
      for (const term of Object.keys(FORMAT_SYNONYMS)) {
        cleaned = cleaned.replace(new RegExp(`\\b${term}\\b`, 'gi'), '');
      }
    }

    // Remove price mentions
    cleaned = cleaned.replace(/(?:under|less than|below|max|cheaper than)\s+\$?\d+(?:\.\d{1,2})?/gi, '');
    cleaned = cleaned.replace(/\$?\d+(?:\.\d{1,2})?\s*(?:dollars|usd|bucks)?\s*(?:or less|budget|max)/gi, '');
    cleaned = cleaned.replace(/\b(cheap|budget-friendly|affordable|low price)\b/gi, '');

    // Remove rating mentions
    cleaned = cleaned.replace(/\b(best|top rated|highest rated|top-rated|favorite|5 stars?|5-star)\b/gi, '');

    // Remove "books", "book", "editions"
    cleaned = cleaned.replace(/\b(books|book|titles|editions|read|reading|listen|listening)\b/gi, '');

    // Clean whitespace
    cleaned = cleaned.replace(/\s+/g, ' ').trim();

    // Check if query was conversational
    if (raw.split(/\s+/).length >= 3 && (detectedFormat || maxPrice || minRating || detectedCategory || cleaned !== raw)) {
      isNL = true;
    }

    const summaryParts: string[] = [];
    if (detectedFormatLabel) summaryParts.push(detectedFormatLabel);
    if (detectedCategory) summaryParts.push(detectedCategory);
    if (maxPrice) summaryParts.push(`<$${maxPrice}`);
    if (minRating) summaryParts.push(`${minRating}★+`);
    if (cleaned) summaryParts.push(`"${cleaned}"`);

    const summaryBadge = summaryParts.join(' • ');

    let explanation = '';
    if (isNL && summaryParts.length > 0) {
      explanation = `AI parsed intent: looking for ${summaryBadge}`;
    }

    return {
      isNaturalLanguage: isNL,
      originalQuery: raw,
      cleanedKeyword: cleaned,
      detectedFormat,
      detectedFormatLabel,
      detectedCategory,
      maxPrice,
      minRating,
      tags,
      summaryBadge,
      explanation
    };
  }

  /**
   * Filter and score books according to natural language parsed constraints
   */
  public filterBooksWithNaturalLanguage(
    books: Book[],
    parsed: NaturalLanguageParsedQuery
  ): Book[] {
    if (!parsed.isNaturalLanguage && !parsed.cleanedKeyword) {
      return books;
    }

    const kwLower = parsed.cleanedKeyword.toLowerCase();

    return books.filter((book) => {
      // 1. Format match
      if (parsed.detectedFormat) {
        const fmtObj = book.formats[parsed.detectedFormat];
        if (!fmtObj || !fmtObj.available) {
          return false;
        }
      }

      // 2. Category match
      if (parsed.detectedCategory && parsed.detectedCategory !== 'All Categories') {
        const bookCatLower = book.category.toLowerCase();
        const parsedCatLower = parsed.detectedCategory.toLowerCase();
        if (!bookCatLower.includes(parsedCatLower) && !parsedCatLower.includes(bookCatLower)) {
          return false;
        }
      }

      // 3. Price constraint
      if (parsed.maxPrice !== undefined) {
        let priceToCheck = book.formats.ebook?.price || 0;
        if (parsed.detectedFormat && book.formats[parsed.detectedFormat]) {
          priceToCheck = book.formats[parsed.detectedFormat]!.price;
        }
        if (priceToCheck > parsed.maxPrice) {
          return false;
        }
      }

      // 4. Rating constraint
      if (parsed.minRating !== undefined) {
        if (book.rating < parsed.minRating) {
          return false;
        }
      }

      // 5. Keyword match (if any core keywords remain)
      if (kwLower) {
        const titleMatch = book.title.toLowerCase().includes(kwLower);
        const authorMatch = book.author.toLowerCase().includes(kwLower);
        const descMatch = (book.description || '').toLowerCase().includes(kwLower);
        const tagMatch = (book.tags || []).some(t => t.toLowerCase().includes(kwLower));
        const catMatch = book.category.toLowerCase().includes(kwLower);

        if (!titleMatch && !authorMatch && !descMatch && !tagMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }

  private formatToDisplayLabel(format: FormatType): string {
    switch (format) {
      case 'ebook': return 'eBook';
      case 'audiobook': return 'Audiobook';
      case 'videobook': return '4K Video Book';
      case 'manuscript': return 'Raw Manuscript';
      case 'hardcover': return 'Clothbound Hardcover';
      case 'papercover': return 'Paper Cover';
      case 'pendrive_sd': return 'Pendrive & SD Vault';
      case 'musical_album': return 'Musical Album Soundtrack';
      case 'silk_cotton': return 'Silk & Cotton Edition';
      case 'digital_device': return 'Dedicated Digital Device';
      default: return format;
    }
  }
}

export const naturalLanguageSearchService = new NaturalLanguageSearchService();
