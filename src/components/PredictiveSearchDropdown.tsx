import React, { useEffect, useMemo, useState, useRef } from 'react';
import { 
  Search, 
  BookOpen, 
  User, 
  Layers, 
  TrendingUp, 
  Headphones, 
  Star, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  Bot,
  Filter
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { searchIndex } from '../services/searchIndexService';
import { 
  naturalLanguageSearchService, 
  CURATED_AI_SEARCH_SUGGESTIONS,
  NaturalLanguageParsedQuery 
} from '../services/naturalLanguageSearchService';
import { Book, PredictiveSuggestions, FormatType } from '../types';

interface PredictiveSearchDropdownProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectQuery: (query: string) => void;
  onSelectBook: (book: Book) => void;
  onSelectAuthor: (authorName: string) => void;
  onSelectGenre: (genreName: string) => void;
  onApplyNaturalLanguageFilter?: (parsed: NaturalLanguageParsedQuery) => void;
}

export const PredictiveSearchDropdown: React.FC<PredictiveSearchDropdownProps> = ({
  query,
  isOpen,
  onClose,
  onSelectQuery,
  onSelectBook,
  onSelectAuthor,
  onSelectGenre,
  onApplyNaturalLanguageFilter
}) => {
  const { books, formatPrice, categories, setSelectedFormatFilter, setSelectedCategory } = useStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  // Compute predictive suggestions in real time
  const suggestions: PredictiveSuggestions = useMemo(() => {
    return searchIndex.getPredictiveSuggestions(query, books);
  }, [query, books]);

  // Parse natural language in real-time
  const nlParsed: NaturalLanguageParsedQuery = useMemo(() => {
    return naturalLanguageSearchService.parseQuery(query, categories);
  }, [query, categories]);

  // Flatten items for keyboard navigation
  const flatItems = useMemo(() => {
    const items: Array<{
      type: 'ai' | 'query' | 'book' | 'author' | 'genre';
      id: string;
      label: string;
      data: any;
    }> = [];

    // AI suggestions if short or empty
    if (!query.trim()) {
      CURATED_AI_SEARCH_SUGGESTIONS.slice(0, 4).forEach((ai) => {
        items.push({ type: 'ai', id: `ai-${ai.id}`, label: ai.label, data: ai });
      });
    }

    // Dynamic phrase suggestions
    suggestions.popularQueries.slice(0, 3).forEach((q) => {
      items.push({ type: 'query', id: `query-${q}`, label: q, data: q });
    });

    // Books
    suggestions.books.forEach((b) => {
      items.push({ type: 'book', id: `book-${b.id}`, label: b.title, data: b });
    });

    // Authors
    suggestions.authors.forEach((a) => {
      items.push({ type: 'author', id: `author-${a.name}`, label: a.name, data: a });
    });

    // Genres
    suggestions.genres.forEach((g) => {
      items.push({ type: 'genre', id: `genre-${g.name}`, label: g.name, data: g });
    });

    return items;
  }, [suggestions, query]);

  // Reset selected index on query change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Keyboard navigation handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < flatItems.length) {
          e.preventDefault();
          const selected = flatItems[selectedIndex];
          executeSelection(selected);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatItems, selectedIndex]);

  const executeSelection = (item: { type: 'ai' | 'query' | 'book' | 'author' | 'genre'; data: any }) => {
    if (item.type === 'ai') {
      onSelectQuery(item.data.query);
      if (item.data.format) {
        setSelectedFormatFilter(item.data.format);
      }
    } else if (item.type === 'query') {
      onSelectQuery(item.data);
    } else if (item.type === 'book') {
      const fullBook = books.find((b) => b.id === item.data.id);
      if (fullBook) {
        onSelectBook(fullBook);
      }
    } else if (item.type === 'author') {
      onSelectAuthor(item.data.name);
    } else if (item.type === 'genre') {
      onSelectGenre(item.data.name);
    }
    onClose();
  };

  const handleApplyAIFilter = () => {
    if (nlParsed.detectedFormat) {
      setSelectedFormatFilter(nlParsed.detectedFormat);
    }
    if (nlParsed.detectedCategory) {
      setSelectedCategory(nlParsed.detectedCategory);
    }
    if (nlParsed.cleanedKeyword) {
      onSelectQuery(nlParsed.cleanedKeyword);
    } else {
      onSelectQuery(query);
    }
    if (onApplyNaturalLanguageFilter) {
      onApplyNaturalLanguageFilter(nlParsed);
    }
    onClose();
  };

  if (!isOpen) return null;

  const isSearching = query.trim().length > 0;

  // Helper to highlight matching text
  const highlightMatch = (text: string, q: string) => {
    if (!q.trim()) return text;
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark key={i} className="bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      ref={dropdownRef}
      id="predictive-search-dropdown"
      className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 text-slate-900 dark:text-slate-100 max-h-[82vh] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 transition-all duration-150 animate-in fade-in slide-in-from-top-1"
    >
      {/* Header Status Bar with AI Search Notification */}
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium truncate">
          {isSearching ? (
            <>
              <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
              <span className="truncate">
                {nlParsed.isNaturalLanguage ? (
                  <span className="text-amber-700 dark:text-amber-400 font-bold">
                    Natural Language AI Search Active
                  </span>
                ) : (
                  <>
                    Suggestions for <strong className="text-slate-800 dark:text-slate-200">"{query}"</strong>
                  </>
                )}
              </span>
            </>
          ) : (
            <>
              <Bot className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>AI Search Suggestions & Popular Queries across Knowledge Centa</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-slate-400 font-mono hidden sm:inline shrink-0 ml-2">
          ↑↓ navigate • ↵ select • esc close
        </span>
      </div>

      {/* AI Natural Language Interpretation Card (When user types conversational queries) */}
      {isSearching && nlParsed.isNaturalLanguage && (
        <div 
          id="ai-search-interpretation-card"
          className="p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border-b border-amber-300/40 dark:border-amber-500/20"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Reader Intent Detected</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                {nlParsed.explanation}
              </p>
              {/* Intent Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                {nlParsed.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/70 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60"
                  >
                    <Filter className="w-2.5 h-2.5" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="button"
              id="apply-ai-search-intent-btn"
              onClick={handleApplyAIFilter}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1 active:scale-95"
            >
              <span>Apply AI Filter</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Curated AI Suggestions (Shown when query is empty or short) */}
      {(!isSearching || query.trim().length < 3) && (
        <div className="p-3.5 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Suggested Natural Language Queries</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CURATED_AI_SEARCH_SUGGESTIONS.map((aiItem) => (
              <button
                key={aiItem.id}
                id={`ai-suggestion-${aiItem.id}`}
                type="button"
                onClick={() => {
                  onSelectQuery(aiItem.query);
                  if (aiItem.format) setSelectedFormatFilter(aiItem.format);
                  onClose();
                }}
                className="text-left p-2 rounded-lg bg-white dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-slate-200 dark:border-slate-700 hover:border-amber-400 transition-all cursor-pointer group flex items-start gap-2.5"
              >
                <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                  {aiItem.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-amber-700 dark:group-hover:text-amber-300">
                    {aiItem.label}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    "{aiItem.query}"
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Search Phrases */}
      {suggestions.popularQueries.length > 0 && (
        <div className="p-3 bg-white dark:bg-slate-900">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Search className="w-3 h-3 text-slate-400" />
            <span>Dynamic Query Matches</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.popularQueries.map((pq) => (
              <button
                key={pq}
                id={`predictive-query-${pq.replace(/\s+/g, '-').toLowerCase()}`}
                type="button"
                onClick={() => {
                  onSelectQuery(pq);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs rounded-full border border-slate-200/60 dark:border-slate-700 transition cursor-pointer hover:text-amber-900 dark:hover:text-amber-200 hover:border-amber-300"
              >
                <Search className="w-3 h-3 text-slate-400" />
                <span>{highlightMatch(pq, query)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matching Books Section */}
      {suggestions.books.length > 0 && (
        <div className="p-3">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-amber-500" />
              <span>{isSearching ? 'Matching Books & Multi-Format Editions' : 'Featured Knowledge Centa Titles'}</span>
            </span>
            <span className="text-[10px] text-slate-400">{suggestions.books.length} titles</span>
          </div>
          <div className="space-y-1.5">
            {suggestions.books.map((b) => {
              const fullBook = books.find((orig) => orig.id === b.id);
              return (
                <div
                  key={b.id}
                  id={`predictive-book-${b.id}`}
                  onClick={() => {
                    if (fullBook) {
                      onSelectBook(fullBook);
                    }
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition group border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <img
                    src={b.coverImage}
                    alt={b.title}
                    className="w-10 h-14 object-cover rounded shadow-sm shrink-0 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-amber-600 dark:group-hover:text-amber-400">
                      {highlightMatch(b.title, query)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-2 mt-0.5">
                      <span>by {highlightMatch(b.author, query)}</span>
                      <span>•</span>
                      <span className="text-slate-400 dark:text-slate-500">{b.category}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-current text-amber-400 mr-0.5" />
                        <span>{b.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
                        from {formatPrice(b.price)}
                      </span>
                      {b.formats.includes('audiobook') && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                          <Headphones className="w-2.5 h-2.5" />
                          <span>Audio</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Matching Authors Section */}
      {suggestions.authors.length > 0 && (
        <div className="p-3 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Authors & Sovereigns</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {suggestions.authors.map((author) => (
              <div
                key={author.id}
                id={`predictive-${author.id}`}
                onClick={() => {
                  onSelectAuthor(author.name);
                  onClose();
                }}
                className="flex items-center gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700/80 cursor-pointer transition border border-slate-200/80 dark:border-slate-700 group"
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  {author.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate group-hover:text-amber-700 dark:group-hover:text-amber-400">
                    {highlightMatch(author.name, query)}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {author.bookCount} title{author.bookCount > 1 ? 's' : ''} in {author.primaryCategory}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Matching Genres / Dimensions Section */}
      {suggestions.genres.length > 0 && (
        <div className="p-3">
          <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Categories & Themes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.genres.map((genre) => (
              <button
                key={genre.id}
                id={`predictive-${genre.id}`}
                type="button"
                onClick={() => {
                  onSelectGenre(genre.name);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg transition cursor-pointer"
              >
                <span>{highlightMatch(genre.name, query)}</span>
                <span className="text-[10px] opacity-70">({genre.bookCount})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer view all results */}
      {isSearching && (
        <div className="p-2.5 bg-slate-100 dark:bg-slate-950 text-center">
          <button
            type="button"
            onClick={() => {
              onSelectQuery(query);
              onClose();
            }}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View all catalogue results for "{query}"</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
