import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  BookOpen, 
  Sparkles, 
  Star, 
  ArrowRight, 
  Award, 
  Play, 
  X,
  Newspaper,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  Filter,
  ArrowUpDown,
  Heart,
  Layers,
  Briefcase,
  Brain,
  Cpu,
  Feather,
  Music,
  Archive,
  Tablet,
  Search,
  TrendingUp,
  Tag,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { Book, FormatType } from '../types';
import { naturalLanguageSearchService } from '../services/naturalLanguageSearchService';
import { searchIndex } from '../services/searchIndexService';
import { AmazonBestSellerFlippingBookCard } from './AmazonBestSellerFlippingBookCard';
import { getPersonalizedGreeting } from '../services/greetingService';

const getCategoryIcon = (catName: string) => {
  switch (catName) {
    case 'All Categories': return <Layers className="w-3.5 h-3.5" />;
    case 'Business & Technology': return <Briefcase className="w-3.5 h-3.5" />;
    case 'Psychology & Leadership': return <Brain className="w-3.5 h-3.5" />;
    case 'Computer Science & AI': return <Cpu className="w-3.5 h-3.5" />;
    case 'Philosophy & Essays': return <BookOpen className="w-3.5 h-3.5" />;
    case 'Raw Handwritten Manuscripts': return <Feather className="w-3.5 h-3.5" />;
    case 'Musical Albums & Scores': return <Music className="w-3.5 h-3.5" />;
    case 'Collector Physical Media': return <Archive className="w-3.5 h-3.5" />;
    case 'Artisanal Silk & Cotton Editions': return <Sparkles className="w-3.5 h-3.5" />;
    case 'Dedicated Digital Devices': return <Tablet className="w-3.5 h-3.5" />;
    default: return <Tag className="w-3.5 h-3.5" />;
  }
};

const CATEGORY_META: Record<string, { desc: string; tags: string[] }> = {
  'Business & Technology': {
    desc: 'Digital wealth architecture, decentralized publishing, sovereign creator leverage, and venture blueprints.',
    tags: ['Decentralized Media', 'AI Leverage', 'Digital Wealth', 'Royalties', 'Backlists']
  },
  'Psychology & Leadership': {
    desc: 'Cognitive resilience, deep work protocols, stoic fortitude, and navigating algorithmic environments.',
    tags: ['Cognitive Resilience', 'Deep Work', 'Strategic Mastery', 'Focus', 'Mental Clarity']
  },
  'Computer Science & AI': {
    desc: 'Autonomous intelligence, neural architectures, distributed computing systems, and hardware design.',
    tags: ['Neural Networks', 'Distributed Systems', 'Autonomous Agents', 'CUDA & Silicon', 'Architecture']
  },
  'Philosophy & Essays': {
    desc: 'Ancient systems wisdom, ethics of technology, contemplative literature, and sovereign mindfulness.',
    tags: ['Stoicism', 'Digital Ethics', 'Systems Theory', 'Meditation', 'Human Freedom']
  },
  'Raw Handwritten Manuscripts': {
    desc: '600 DPI uncompressed archival folios, author drafts, marginalia, and original fountain pen ink recipes.',
    tags: ['600 DPI Scans', 'Deckled Paper', 'Fountain Pen', 'Author Marginalia', 'First Drafts']
  },
  'Musical Albums & Scores': {
    desc: '24-bit 96kHz spatial orchestral recordings, conductor scores, and acoustic ambient focus soundscapes.',
    tags: ['24-Bit FLAC', 'Conductor Scores', 'Spatial Audio', 'Orchestral', 'Ambient Focus']
  },
  'Collector Physical Media': {
    desc: 'Five centuries of typography, letterpress monographs, leatherbound folios, and cold storage hardware.',
    tags: ['Incunabula', 'Letterpress', 'Clothbound', 'Metal USB Vaults', 'Antiquarian']
  },
  'Artisanal Silk & Cotton Editions': {
    desc: 'Kyoto silk thread Watoji bookbinding, organic unbleached cotton paper, and botanical essays.',
    tags: ['Watoji Binding', 'Kyoto Silk', 'Indigo Dyeing', 'Kozo Mulberry', 'Handmade']
  },
  'Dedicated Digital Devices': {
    desc: 'Calm technology manifesto, distraction-free E-Ink reading hardware, and sovereign firmware.',
    tags: ['Carta 1200 E-Ink', 'Calm Hardware', 'Zero Notifications', 'Open Firmware', 'Long Battery']
  }
};

const POPULAR_SEARCH_SUGGESTIONS = [
  'Dr. Marcus Sterling',
  'Decentralized Publishing',
  'Neural Networks',
  'Master Lucian Vane',
  'Audiobook 320kbps',
  '600 DPI Scans',
  'Kyoto Silk',
  'Sanctuary E-Ink'
];

export const Storefront: React.FC = () => {
  const {
    books,
    setActiveBook,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    addCategory,
    selectedFormatFilter,
    setSelectedFormatFilter,
    formatPrice,
    setCurrentView,
    openLookInside,
    isInWishlist,
    toggleWishlist,
    t,
    user,
    currentLanguage
  } = useStore();

  const personalizedGreeting = getPersonalizedGreeting(user, currentLanguage);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'rating' | 'price-low' | 'price-high' | 'reviews'>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-15' | '15-30' | '30-plus'>('all');
  const [minRatingFilter, setMinRatingFilter] = useState<number>(0);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { 'All Categories': books.length };
    books.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [books]);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setSelectedCategory(newCatName.trim());
    setNewCatName('');
    setIsAddingCategory(false);
  };

  // Natural language parsing of search query if entered
  const parsedNL = useMemo(() => {
    return naturalLanguageSearchService.parseQuery(searchQuery, categories);
  }, [searchQuery, categories]);

  // High-precision search & filtering
  const filteredBooks = useMemo(() => {
    let result: Book[] = [];

    const cleanQuery = searchQuery.trim();

    if (cleanQuery) {
      // Use inverted search index
      const searchResponse = searchIndex.search(cleanQuery, {
        category: selectedCategory === 'All Categories' ? undefined : selectedCategory,
        format: selectedFormatFilter === 'all' ? undefined : selectedFormatFilter
      });

      if (searchResponse.results.length > 0) {
        result = searchResponse.results.map((r) => r.book);
      } else {
        // Fallback multi-field text search
        const q = cleanQuery.toLowerCase();
        result = books.filter((book) => {
          const matchesCategory =
            selectedCategory === 'All Categories' || book.category === selectedCategory;
          const matchesFormat =
            selectedFormatFilter === 'all' || book.formats[selectedFormatFilter]?.available;

          if (!matchesCategory || !matchesFormat) return false;

          const titleMatch = book.title.toLowerCase().includes(q);
          const authorMatch = book.author.toLowerCase().includes(q);
          const descMatch = book.description?.toLowerCase().includes(q);
          const subtitleMatch = book.subtitle?.toLowerCase().includes(q);
          const isbnMatch = book.isbn?.toLowerCase().includes(q);
          const publisherMatch = book.publisher?.toLowerCase().includes(q);
          const tagMatch = book.tags?.some((t) => t.toLowerCase().includes(q));
          const formatMatch = Object.values(book.formats).some(
            (f) => {
              const fmt = f as { name?: string; badge?: string } | undefined;
              return (
                (fmt?.name && fmt.name.toLowerCase().includes(q)) ||
                (fmt?.badge && fmt.badge.toLowerCase().includes(q))
              );
            }
          );

          return (
            titleMatch ||
            authorMatch ||
            descMatch ||
            subtitleMatch ||
            isbnMatch ||
            publisherMatch ||
            tagMatch ||
            formatMatch
          );
        });

        // Natural language filter if still 0
        if (result.length === 0 && parsedNL.isNaturalLanguage) {
          result = naturalLanguageSearchService.filterBooksWithNaturalLanguage(books, parsedNL);
        }
      }
    } else {
      // No search query: filter by category and format
      result = books.filter((book) => {
        const matchesCategory =
          selectedCategory === 'All Categories' || book.category === selectedCategory;
        const matchesFormat =
          selectedFormatFilter === 'all' || book.formats[selectedFormatFilter]?.available;
        return matchesCategory && matchesFormat;
      });
    }

    // Apply Rating Filter
    if (minRatingFilter > 0) {
      result = result.filter((book) => book.rating >= minRatingFilter);
    }

    // Apply Price Filter (based on eBook / lowest format price)
    if (priceFilter !== 'all') {
      result = result.filter((book) => {
        const prices = Object.values(book.formats)
          .map((f) => f.price)
          .filter((p) => typeof p === 'number' && p > 0);
        const minPrice = prices.length > 0 ? Math.min(...prices) : 9.99;

        if (priceFilter === 'under-15') return minPrice < 15;
        if (priceFilter === '15-30') return minPrice >= 15 && minPrice <= 30;
        if (priceFilter === '30-plus') return minPrice > 30;
        return true;
      });
    }

    // Apply Sorting
    return [...result].sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviewCount - a.reviewCount;
      const priceA = a.formats.ebook?.price || 0;
      const priceB = b.formats.ebook?.price || 0;
      if (sortBy === 'price-low') return priceA - priceB;
      if (sortBy === 'price-high') return priceB - priceA;
      return 0; // featured default
    });
  }, [
    books,
    searchQuery,
    selectedCategory,
    selectedFormatFilter,
    parsedNL,
    sortBy,
    priceFilter,
    minRatingFilter
  ]);

  const handleSelectBook = (book: Book) => {
    setActiveBook(book);
    setCurrentView('book-detail');
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const clean = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${clean})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-amber-200 text-slate-950 font-bold px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="bg-[#eaeded] min-h-screen text-slate-900 pb-20">
      
      {/* Amazon-style Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#131921] via-[#1a2432] to-[#232f3e] text-white py-8 sm:py-10 px-4 sm:px-8 border-b border-slate-700 overflow-hidden">
        
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-2 bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('hero_ecosystem_badge')}</span>
              </div>
              <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-amber-400/40 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{personalizedGreeting.fullGreeting}!</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-serif leading-tight">
              {t('hero_title')}
            </h1>

            {/* Prominent Blog & Community Buttons */}
            <div className="pt-2 pb-1 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
              <button
                id="homepage-blog-button-main"
                onClick={() => setCurrentView('blog')}
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-xl hover:shadow-amber-400/30 transition-all duration-200 cursor-pointer border border-amber-300/50"
              >
                <div className="p-1 rounded bg-slate-950/10">
                  <Newspaper className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform" />
                </div>
                <span>{t('hero_blog_btn')}</span>
                <span className="bg-slate-950 text-amber-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI & Media
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-950 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentView('reels')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-pink-300 hover:text-pink-200 text-xs font-bold rounded-xl border border-pink-400/30 transition cursor-pointer"
              >
                <span>{t('hero_watch_reels')}</span>
              </button>

              <button
                onClick={() => setCurrentView('wishlist')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 text-xs font-bold rounded-xl border border-rose-400/40 transition cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
                <span>My Wish List</span>
              </button>

              <button
                onClick={() => setCurrentView('waitlist')}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                <span>4 Dimensions Waiting List &rarr;</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              {t('hero_welcome')}
            </p>
          </div>

          {/* Quick CTA Card */}
          <div className="bg-white/10 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 text-xs space-y-3 max-w-sm w-full md:w-auto shrink-0 text-left shadow-lg">
            <div className="flex items-center gap-2 text-amber-300 font-bold">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{t('hero_author_cta_title')}</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {t('hero_author_cta_desc')}
            </p>
            <button
              id="hero-author-publish-btn"
              onClick={() => setCurrentView('publish')}
              className="w-full py-2 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition shadow text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('hero_author_publish_btn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Top Amazon Official Best Sellers 3D Flipping Book Showcase (Below JOHNNYBLUE1 BOOKS STORES Header) */}
      <div id="top-amazon-bestsellers-showcase-container" className="max-w-[1600px] mx-auto px-3 sm:px-4 pt-6">
        <AmazonBestSellerFlippingBookCard instanceId="header-showcase" />
      </div>

      {/* Main Catalogue Section */}
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 py-6 space-y-4">
        
        {/* 1. Interactive Category Pill Strip */}
        <div className="bg-white p-3 rounded-2xl shadow-xs border border-slate-200/80">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span>Explore Categories & Genres</span>
            </div>
            <button
              onClick={() => setIsAddingCategory(!isAddingCategory)}
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          {/* Horizontal Category Scroll Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`cat-chip-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all duration-150 cursor-pointer shrink-0 border ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-xs ring-2 ring-amber-400/30'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className={isSelected ? 'text-slate-950' : 'text-amber-600'}>
                    {getCategoryIcon(cat)}
                  </span>
                  <span>{cat === 'All Categories' ? t('all_categories') : cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-slate-950 text-amber-300'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Inline Add Category Form */}
          {isAddingCategory && (
            <div className="mt-3 pt-3 border-t border-slate-100 animate-in fade-in">
              <form onSubmit={handleCreateCategory} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="New Category Name (e.g., Historical Fiction, Space Science)..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer shadow-xs"
                >
                  Save Category
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCategory(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>

        {/* 2. Category Detail Banner (When specific category is active) */}
        {selectedCategory !== 'All Categories' && (
          <div className="bg-gradient-to-r from-slate-900 to-[#1a2432] text-white p-4 sm:p-5 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  {getCategoryIcon(selectedCategory)}
                </div>
                <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                  {selectedCategory}
                </h2>
                <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {categoryCounts[selectedCategory] || 0} {categoryCounts[selectedCategory] === 1 ? 'Book' : 'Books'}
                </span>
              </div>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                {CATEGORY_META[selectedCategory]?.desc || 'Curated sovereign masterworks and collector editions in this genre.'}
              </p>

              {/* Sub-tags */}
              {CATEGORY_META[selectedCategory]?.tags && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1">
                    Related:
                  </span>
                  {CATEGORY_META[selectedCategory].tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300 px-2 py-0.5 rounded-md border border-slate-700 transition cursor-pointer"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedCategory('All Categories')}
              className="self-start md:self-center px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-lg border border-slate-600 transition flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              <span>View All Categories</span>
            </button>
          </div>
        )}

        {/* 3. Search & Quick Filters Bar */}
        <div className="bg-white p-3 sm:p-4 rounded-xl shadow-xs border border-slate-200/80 flex flex-col space-y-3">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            
            {/* Left: Results count & Active search tag */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-extrabold text-slate-800 text-sm">
                {t('showing_titles', { count: filteredBooks.length })}
              </span>

              {searchQuery && (
                <div className="flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-300 px-2.5 py-0.5 rounded-full font-medium text-xs">
                  <Search className="w-3 h-3 text-amber-600" />
                  <span>"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-amber-950 p-0.5 cursor-pointer ml-1"
                    title="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {selectedCategory !== 'All Categories' && searchQuery && (
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="text-xs text-amber-700 hover:underline font-semibold cursor-pointer"
                >
                  Search in All Categories &rarr;
                </button>
              )}
            </div>

            {/* Right: Dropdowns for Dimension & Sort */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full md:w-auto">
              
              {/* Dropdown 1: 10 Dimensions & Formats Filter */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <SlidersHorizontal className="w-2.5 h-2.5 text-amber-600" />
                  <span>Dimension / Format</span>
                </label>
                <div className="relative">
                  <select
                    id="storefront-format-dropdown"
                    value={selectedFormatFilter}
                    onChange={(e) => setSelectedFormatFilter(e.target.value as any)}
                    className="w-full h-9 pl-2.5 pr-8 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none cursor-pointer appearance-none transition"
                  >
                    <option value="all">All 10 Dimensions</option>
                    <option value="ebook">1. eBook (EPUB3 / PDF)</option>
                    <option value="audiobook">2. Audiobook (320kbps MP3)</option>
                    <option value="videobook">3. 4K Video Book (Cinema)</option>
                    <option value="manuscript">4. Raw Manuscript Scans</option>
                    <option value="hardcover">5. Clothbound Hardcover</option>
                    <option value="papercover">6. Trade Paper Cover</option>
                    <option value="pendrive_sd">7. Pendrive & SD Vault</option>
                    <option value="musical_album">8. Musical Album Soundtrack</option>
                    <option value="silk_cotton">9. Silk & Cotton Artisan</option>
                    <option value="digital_device">10. Dedicated Digital Device</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Dropdown 2: Sort By Filter */}
              <div className="relative">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <ArrowUpDown className="w-2.5 h-2.5 text-amber-600" />
                  <span>Sort By</span>
                </label>
                <div className="relative">
                  <select
                    id="storefront-sort-dropdown"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full h-9 pl-2.5 pr-8 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 outline-none cursor-pointer appearance-none transition"
                  >
                    <option value="featured">Featured Masterworks</option>
                    <option value="rating">Highest Rating (5★)</option>
                    <option value="reviews">Most Reviews</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>

            </div>
          </div>

          {/* Quick Filter Chips Row (Rating & Price) */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
            
            {/* Price Filter Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Price:</span>
              <button
                onClick={() => setPriceFilter('all')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  priceFilter === 'all'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setPriceFilter('under-15')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  priceFilter === 'under-15'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                Under $15
              </button>
              <button
                onClick={() => setPriceFilter('15-30')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  priceFilter === '15-30'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                $15 – $30
              </button>
              <button
                onClick={() => setPriceFilter('30-plus')}
                className={`px-2 py-0.5 rounded-md text-xs font-medium transition cursor-pointer ${
                  priceFilter === '30-plus'
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                $30+
              </button>
            </div>

            {/* Rating Filter Toggle */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Rating:</span>
              <button
                onClick={() => setMinRatingFilter(minRatingFilter === 4.5 ? 0 : 4.5)}
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium transition cursor-pointer border ${
                  minRatingFilter === 4.5
                    ? 'bg-amber-400 text-slate-950 font-bold border-amber-500'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>4.5★ & up</span>
              </button>
            </div>

          </div>

          {/* Popular Trending Search Chips */}
          <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-amber-600" />
              <span>Trending Searches:</span>
            </span>
            {POPULAR_SEARCH_SUGGESTIONS.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-600 border border-slate-200 hover:border-amber-300 transition cursor-pointer whitespace-nowrap shrink-0"
              >
                {term}
              </button>
            ))}
          </div>

        </div>

        {/* 4. Books Card Grid or Empty State */}
        {filteredBooks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8" />
            </div>
            
            <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
              No Books Match Your Search Criteria
            </h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              We couldn't find any titles matching "{searchQuery}" in{' '}
              <span className="font-semibold text-slate-700">{selectedCategory}</span>. Try adjusting your search query, or clear your filters to view all titles.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All Categories');
                  setSelectedFormatFilter('all');
                  setPriceFilter('all');
                  setMinRatingFilter(0);
                }}
                className="py-2 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow-xs transition cursor-pointer"
              >
                Reset All Filters & View All Books
              </button>
              {selectedCategory !== 'All Categories' && (
                <button
                  onClick={() => setSelectedCategory('All Categories')}
                  className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-full border border-slate-300 transition cursor-pointer"
                >
                  Search Across All Categories
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-2">
            {filteredBooks.map((book) => {
              const inWishlist = isInWishlist(book.id);

              return (
                <div
                  key={book.id}
                  id={`book-card-${book.id}`}
                  className="bg-white rounded-2xl shadow-xs hover:shadow-md border border-slate-200/80 overflow-hidden flex flex-col justify-between transition-all duration-200 group"
                >
                  <div>
                    {/* Book Cover Area */}
                    <div 
                      className="relative aspect-[1/1.3] bg-slate-900 overflow-hidden cursor-pointer"
                      onClick={() => handleSelectBook(book)}
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Look Inside Overlay Badge Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLookInside(book, 'ebook');
                        }}
                        className="absolute top-2.5 left-2.5 bg-[#131921]/90 hover:bg-[#131921] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 shadow border border-amber-400/30 transition hover:scale-105 cursor-pointer z-10"
                        title="Look Inside & Sample Reader"
                      >
                        <BookOpen className="w-3 h-3 text-amber-400" />
                        <span>{t('look_inside')}</span>
                      </button>

                      {/* Wishlist Heart Button (Immediate Visual Confirmation) */}
                      <button
                        id={`wishlist-btn-${book.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(book);
                        }}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-150 cursor-pointer z-10 ${
                          inWishlist
                            ? 'bg-rose-600 text-white ring-2 ring-white/90 scale-105'
                            : 'bg-slate-900/80 hover:bg-rose-600 text-white border border-white/30 hover:scale-110 active:scale-95'
                        }`}
                        title={inWishlist ? 'In your Wish List (click to remove)' : 'Add to Wish List'}
                        aria-label={inWishlist ? 'Remove from Wish List' : 'Add to Wish List'}
                      >
                        <Heart
                          className={`w-4 h-4 transition-transform ${
                            inWishlist ? 'fill-white text-white scale-110' : 'text-white'
                          }`}
                        />
                      </button>

                      {/* Best Seller Tag */}
                      {book.bestSellerCategory && (
                        <div className="absolute bottom-2.5 left-2.5 bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          {t('bestseller_badge')}
                        </div>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => setSelectedCategory(book.category)}
                        className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 hover:underline uppercase tracking-wide cursor-pointer text-left block"
                      >
                        {book.category}
                      </button>

                      <h3 
                        onClick={() => handleSelectBook(book)}
                        className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 hover:text-amber-700 cursor-pointer font-serif leading-snug"
                      >
                        {highlightMatch(book.title, searchQuery)}
                      </h3>

                      {book.subtitle && searchQuery && book.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 italic">
                          {highlightMatch(book.subtitle, searchQuery)}
                        </p>
                      )}

                      <div className="text-xs text-slate-500">
                        {t('by_author')}{' '}
                        <span className="font-semibold text-slate-800">
                          {highlightMatch(book.author, searchQuery)}
                        </span>
                      </div>

                      {/* Star Rating */}
                      <div className="flex items-center gap-1 pt-0.5">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.floor(book.rating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'fill-amber-100 text-amber-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {book.rating.toFixed(1)}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({book.reviewCount})
                        </span>
                      </div>

                      {/* 4 Formats Pricing Matrix */}
                      <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[11px]">
                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-500">{t('format_ebook')}</span>
                          <span className="font-bold text-slate-900">
                            {formatPrice(book.formats.ebook?.price ?? 9.99)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-500">{t('format_audiobook')}</span>
                          <span className="font-bold text-slate-900">
                            {formatPrice(book.formats.audiobook?.price ?? 14.99)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-500">{t('format_videobook')}</span>
                          <span className="font-bold text-slate-900">
                            {formatPrice(book.formats.videobook?.price ?? 19.99)}
                          </span>
                        </div>
                        <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="text-slate-500">{t('format_manuscript')}</span>
                          <span className="font-bold text-slate-900">
                            {formatPrice(book.formats.manuscript?.price ?? 24.99)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 pt-0 flex gap-2">
                    <button
                      onClick={() => openLookInside(book, 'ebook')}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium rounded-xl border border-slate-300 transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-slate-700" />
                      <span>{t('look_inside')}</span>
                    </button>

                    <button
                      onClick={() => handleSelectBook(book)}
                      className="flex-1 py-2 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <span>{t('btn_buy_now')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
