import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  ShoppingCart, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Library, 
  ChevronDown,
  Feather,
  Heart,
  User,
  HardDrive,
  Mic,
  Plus,
  X,
  Tag,
  Globe,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  BarChart3,
  Newspaper,
  LogIn,
  LogOut,
  Headphones,
  Bookmark,
  Volume2,
  VolumeX,
  Briefcase,
  SlidersHorizontal,
  Menu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { VoiceSearchModal } from './VoiceSearchModal';
import { PredictiveSearchDropdown } from './PredictiveSearchDropdown';
import { SUPPORTED_LANGUAGES, LanguageCode } from '../services/i18n';
import { soundService } from '../services/soundService';
import { NaturalLanguageParsedQuery } from '../services/naturalLanguageSearchService';
import { getPersonalizedGreeting, setReaderNickname } from '../services/greetingService';

interface HeaderProps {
  onOpenSoundDialog?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSoundDialog }) => {
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Dropdown states
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(soundService.isEnabled());

  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const {
    cart,
    library,
    wishlist,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    addCategory,
    currentView,
    setCurrentView,
    setCartDrawerOpen,
    setApiInspectorOpen,
    theme,
    toggleTheme,
    currentLanguage,
    setLanguage,
    t,
    offlineBooks,
    setOfflineModalOpen,
    user,
    openAuthModal,
    signOutUser,
    setActiveBook,
    audioBookmarks,
    openAudiobookAtBookmark,
    setSelectedFormatFilter
  } = useStore();

  const [nicknameVersion, setNicknameVersion] = useState(0);
  const [customNicknameInput, setCustomNicknameInput] = useState('');
  const personalizedGreeting = getPersonalizedGreeting(user, currentLanguage);

  const [isPredictiveOpen, setIsPredictiveOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Subscribe to sound toggle state
  useEffect(() => {
    return soundService.subscribe((enabled) => {
      setIsSoundOn(enabled);
    });
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsPredictiveOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(e.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const offlineCount = Object.keys(offlineBooks).length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('store');
    setIsPredictiveOpen(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsAddCategoryOpen(true);
    } else {
      setSelectedCategory(val);
      setCurrentView('store');
    }
  };

  const handleSaveNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName('');
    setIsAddCategoryOpen(false);
    setCurrentView('store');
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = soundService.toggle();
    setIsSoundOn(next);
  };

  const handleApplyNaturalLanguageFilter = (parsed: NaturalLanguageParsedQuery) => {
    if (parsed.detectedFormat) {
      setSelectedFormatFilter(parsed.detectedFormat);
    }
    if (parsed.detectedCategory) {
      setSelectedCategory(parsed.detectedCategory);
    }
    setCurrentView('store');
    setIsPredictiveOpen(false);
  };

  return (
    <header className="relative bg-[#131921] text-white select-none border-b border-slate-800">
      {/* Top Main Navigation Bar */}
      <div className="flex items-center justify-between px-3 py-2 gap-2 md:gap-4 max-w-[1600px] mx-auto text-sm">
        
        {/* Brand / Logo + Quick Blog Pill */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            id="mobile-menu-toggle-btn"
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:text-white transition cursor-pointer"
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            id="brand-home-button"
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-2 sm:gap-2.5 p-1 rounded-lg hover:ring-1 hover:ring-white transition group text-left cursor-pointer"
            title="Johnnyblue1 Books Stores & Knowledge Centa"
          >
            <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0">
              <img 
                src="/logo.svg" 
                alt="Johnnyblue1 Knowledge Centa Logo" 
                className="w-full h-full rounded-xl object-contain border border-amber-400/50 shadow-md bg-[#0f172a] group-hover:scale-105 transition-transform" 
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900" title="Online & Sovereign" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-black tracking-wider text-sm sm:text-base md:text-lg text-white font-serif">
                  JOHNNYBLUE1
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-tight bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded uppercase">
                  Books
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] text-emerald-400 font-semibold tracking-wide">
                <Sparkles className="w-3 h-3 text-amber-400 inline" />
                <span className="text-amber-300">KNOWLEDGE CENTA</span>
              </div>
            </div>
          </button>

          {/* Quick Blog Shortcut Pill */}
          <button
            id="header-blog-button-direct"
            onClick={() => setCurrentView('blog')}
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition cursor-pointer border border-amber-300/40"
            title="Open Johnnyblue1 Blog"
          >
            <Newspaper className="w-3.5 h-3.5 text-slate-950" />
            <span>Blog</span>
          </button>
        </div>

        {/* Global Search Box with Category Dropdown & AI Predictive Dropdown */}
        <div ref={searchContainerRef} className="relative flex flex-1 max-w-xl lg:max-w-2xl xl:max-w-3xl">
          <form 
            onSubmit={handleSearchSubmit} 
            className="flex w-full items-center h-9 sm:h-10 rounded-md overflow-hidden bg-white focus-within:ring-2 sm:focus-within:ring-3 focus-within:ring-amber-500 shadow-sm"
          >
            {/* Category Dropdown */}
            <div className="relative shrink-0 hidden lg:block">
              <select
                id="header-category-select"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="h-10 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium px-3 pr-7 border-r border-slate-300 outline-none cursor-pointer appearance-none transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'All Categories' ? t('all_categories') : cat}
                  </option>
                ))}
                <option disabled className="text-slate-400">──────────</option>
                <option value="__ADD_NEW__" className="font-bold text-amber-700 bg-amber-50">
                  + {t('add_category_btn')}...
                </option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-600 absolute right-2 top-3.5 pointer-events-none" />
            </div>

            {/* Natural Language & Search Input */}
            <input
              id="global-search-input"
              type="text"
              placeholder="Search books, authors, genres, or ask in natural language..."
              value={searchQuery}
              onFocus={() => setIsPredictiveOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (!isPredictiveOpen) setIsPredictiveOpen(true);
              }}
              className="w-full h-full px-2.5 sm:px-3 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-sans"
              autoComplete="off"
            />

            {/* Clear Input Button */}
            {searchQuery && (
              <button
                type="button"
                id="header-search-clear-btn"
                onClick={() => {
                  setSearchQuery('');
                  setIsPredictiveOpen(false);
                }}
                className="h-full px-2 text-slate-400 hover:text-slate-600 transition cursor-pointer flex items-center"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* AI Voice Search Button */}
            <button
              id="global-voice-search-btn"
              type="button"
              onClick={() => setIsVoiceModalOpen(true)}
              className="h-full px-2 sm:px-2.5 text-slate-500 hover:text-amber-600 transition cursor-pointer flex items-center gap-1 shrink-0 border-l border-slate-200 bg-slate-50/60 hover:bg-amber-50/50"
              title={t('ai_voice_search')}
              aria-label={t('ai_voice_search')}
            >
              <Mic className="w-4 h-4 hover:scale-110 transition-transform text-slate-700 hover:text-amber-600" />
              <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1 rounded font-mono hidden sm:inline">
                AI
              </span>
            </button>

            {/* Submit Button */}
            <button
              id="global-search-submit"
              type="submit"
              aria-label="Search"
              className="h-full px-3 sm:px-4 bg-amber-400 hover:bg-amber-500 text-slate-900 flex items-center justify-center transition cursor-pointer shrink-0"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </form>

          {/* Real-time Predictive & Natural Language Search Dropdown */}
          <PredictiveSearchDropdown
            query={searchQuery}
            isOpen={isPredictiveOpen}
            onClose={() => setIsPredictiveOpen(false)}
            onSelectQuery={(q) => {
              setSearchQuery(q);
              setCurrentView('store');
            }}
            onSelectBook={(book) => {
              setActiveBook(book);
              setCurrentView('book-detail');
            }}
            onSelectAuthor={(author) => {
              setSearchQuery(author);
              setCurrentView('store');
            }}
            onSelectGenre={(genre) => {
              setSelectedCategory(genre);
              setSearchQuery('');
              setCurrentView('store');
            }}
            onApplyNaturalLanguageFilter={handleApplyNaturalLanguageFilter}
          />
        </div>

        {/* Right Consolidated Controls (Dropdowns to simplify UI) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Direct Quick Page Flip Sound Toggle */}
          <button
            id="header-sound-flip-toggle-btn"
            type="button"
            onClick={handleToggleSound}
            className={`p-1.5 sm:p-2 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
              isSoundOn
                ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 hover:bg-amber-400/30'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={`Page Flip Sound Effect: ${isSoundOn ? 'ON (Click to mute)' : 'MUTED (Click to enable)'}`}
            aria-label="Toggle Page Flip Sound Effect"
          >
            {isSoundOn ? (
              <Volume2 className="w-4 h-4 text-amber-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
            <span className="text-[11px] font-bold hidden xl:inline">
              {isSoundOn ? 'Sound: ON' : 'Muted'}
            </span>
          </button>

          {/* Consolidated Dropdown 1: Creator & Tools */}
          <div ref={toolsDropdownRef} className="relative hidden md:block">
            <button
              id="header-tools-dropdown-btn"
              type="button"
              onClick={() => {
                setIsToolsDropdownOpen(!isToolsDropdownOpen);
                setIsAccountDropdownOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isToolsDropdownOpen || ['publish', 'author-dashboard', 'author-profile'].includes(currentView)
                  ? 'bg-slate-800 text-amber-300 border-amber-400/40 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Creator & Tools</span>
              <span className="lg:hidden">Tools</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isToolsDropdownOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
            </button>

            {isToolsDropdownOpen && (
              <div 
                id="header-tools-menu"
                className="absolute top-full right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-200 py-1 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1"
              >
                <div className="px-3.5 py-1.5 bg-slate-950/70 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Author & Sovereign Tools
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('publish');
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-amber-400" />
                      <div>
                        <div className="font-semibold text-white">Publish Studio</div>
                        <div className="text-[10px] text-slate-400">Release 10-format editions</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('author-dashboard');
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <BarChart3 className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">Author Dashboard</div>
                      <div className="text-[10px] text-slate-400">Sales trends & analytics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('author-profile');
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-semibold text-white">Creator Profile</div>
                      <div className="text-[10px] text-slate-400">Public sovereign page</div>
                    </div>
                  </button>
                </div>

                <div className="px-3.5 py-1.5 bg-slate-950/70 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  Storage & Reading Vaults
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      if (audioBookmarks.length > 0) {
                        openAudiobookAtBookmark(audioBookmarks[0]);
                      } else {
                        setCurrentView('library');
                      }
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Headphones className="w-4 h-4 text-amber-300" />
                      <div>
                        <div className="font-semibold text-white">Audio Bookmarks</div>
                        <div className="text-[10px] text-slate-400">Saved timestamps & notes</div>
                      </div>
                    </div>
                    {audioBookmarks.length > 0 && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                        {audioBookmarks.length}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setApiInspectorOpen(true);
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-semibold text-white">Drive & Firebase Vault</div>
                      <div className="text-[10px] text-slate-400">Native sovereign storage</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setOfflineModalOpen(true);
                      setIsToolsDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <WifiOff className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold text-white">Offline Vault</div>
                        <div className="text-[10px] text-slate-400">Read without internet</div>
                      </div>
                    </div>
                    {offlineCount > 0 && (
                      <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-full">
                        {offlineCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Consolidated Dropdown 2: Account & Settings */}
          <div ref={accountDropdownRef} className="relative">
            <button
              id="header-account-dropdown-btn"
              type="button"
              onClick={() => {
                setIsAccountDropdownOpen(!isAccountDropdownOpen);
                setIsToolsDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-xs text-white border border-slate-700 transition cursor-pointer"
              title="Account, Library & Settings"
            >
              {user ? (
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-bold flex items-center justify-center text-[10px]">
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
              ) : (
                <User className="w-4 h-4 text-amber-400" />
              )}
              <div className="hidden sm:block text-left leading-tight">
                <span className="text-[9px] text-amber-300 font-semibold block truncate max-w-[95px]" title={personalizedGreeting.fullGreeting}>
                  {personalizedGreeting.fullGreeting}
                </span>
                <span className="font-bold text-white text-[11px] flex items-center gap-0.5">
                  Account <ChevronDown className="w-2.5 h-2.5 inline" />
                </span>
              </div>
              <ChevronDown className="w-3 h-3 sm:hidden text-slate-400" />
            </button>

            {isAccountDropdownOpen && (
              <div 
                id="header-account-menu"
                className="absolute top-full right-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-200 py-1 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1"
              >
                {/* User Session Info & Personalized Greeting */}
                <div className="p-3 bg-slate-950/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                        <span className="truncate">{personalizedGreeting.salutation}, {personalizedGreeting.name}!</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {user ? `Authenticated via ${user.authProvider}` : 'Free Sovereign Reader'}
                      </div>
                    </div>
                    {user ? (
                      <button
                        onClick={() => {
                          signOutUser();
                          setIsAccountDropdownOpen(false);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-rose-900/50 text-rose-300 text-xs font-semibold rounded transition cursor-pointer"
                      >
                        Sign Out
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          openAuthModal('Sign in to access your personal Cloud Library');
                          setIsAccountDropdownOpen(false);
                        }}
                        className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded transition cursor-pointer"
                      >
                        Sign In
                      </button>
                    )}
                  </div>

                  {/* Nickname personalization input */}
                  <div className="pt-1.5 flex items-center gap-1.5 border-t border-slate-800/80">
                    <input
                      type="text"
                      placeholder={user ? "Reader nickname..." : "Personalize your reader name..."}
                      value={customNicknameInput}
                      onChange={(e) => setCustomNicknameInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customNicknameInput.trim()) {
                          setReaderNickname(customNicknameInput);
                          setNicknameVersion(v => v + 1);
                          setCustomNicknameInput('');
                        }
                      }}
                      className="flex-1 bg-slate-800/80 border border-slate-700 focus:border-amber-400 rounded px-2.5 py-1 text-[11px] text-white placeholder:text-slate-500 outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customNicknameInput.trim()) {
                          setReaderNickname(customNicknameInput);
                          setNicknameVersion(v => v + 1);
                          setCustomNicknameInput('');
                        }
                      }}
                      className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold rounded transition cursor-pointer"
                      title="Update your personalized greeting name"
                    >
                      Save
                    </button>
                  </div>
                </div>

                {/* Library & Favorites */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('library');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Library className="w-4 h-4 text-amber-400" />
                      <span>{t('nav_library')}</span>
                    </div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-1.5 py-0.5 rounded">
                      {library.length} items
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('wishlist');
                      setIsAccountDropdownOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-rose-400" />
                      <span>{t('wish_list')}</span>
                    </div>
                    {wishlist.length > 0 && (
                      <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Multi-Language Selection inside Dropdown */}
                <div className="p-3 bg-slate-950/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <Globe className="w-3 h-3 text-amber-400" />
                    <span>Language / Idioma</span>
                  </div>
                  <select
                    id="dropdown-language-select"
                    value={currentLanguage}
                    onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                    className="w-full bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 outline-none cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                        {lang.flag} {lang.nativeLabel} ({lang.code.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Theme & Page Flip Sound Toggle */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
                      <span>Theme: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">Toggle</span>
                  </button>

                  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition">
                    <div className="flex items-center gap-2">
                      {isSoundOn ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
                      <span>Page Flip Sound</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => soundService.testSound()}
                        className="text-[10px] px-1.5 py-0.5 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 rounded text-amber-300 transition cursor-pointer"
                        title="Sample sound"
                      >
                        Test
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const next = soundService.toggle();
                          setIsSoundOn(next);
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                          isSoundOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isSoundOn ? 'ON' : 'OFF'}
                      </button>
                    </div>
                  </div>

                  {onOpenSoundDialog && (
                    <button
                      type="button"
                      onClick={() => {
                        onOpenSoundDialog();
                        setIsAccountDropdownOpen(false);
                      }}
                      className="w-full text-left text-[11px] text-amber-400 hover:underline px-2.5 py-1"
                    >
                      Configure sound popup preferences &rarr;
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Direct Header Button */}
          <button
            id="header-wishlist-direct-btn"
            onClick={() => setCurrentView('wishlist')}
            className={`flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg transition relative cursor-pointer border ${
              currentView === 'wishlist'
                ? 'bg-rose-950/70 border-rose-400 text-rose-300 ring-1 ring-rose-400/50'
                : 'hover:ring-1 hover:ring-white border-transparent text-white'
            }`}
            title={`Wish List (${wishlist.length} saved)`}
            aria-label="Personal Wish List"
          >
            <div className="relative">
              <Heart className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${wishlist.length > 0 ? 'text-rose-400 fill-rose-500/30' : 'text-slate-300'}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-rose-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full min-w-[17px] text-center shadow animate-in zoom-in">
                  {wishlist.length}
                </span>
              )}
            </div>
            <span className="hidden lg:inline font-bold text-xs mt-0.5">{t('wish_list')}</span>
          </button>

          {/* Cart with Gold Badge */}
          <button
            id="header-cart-btn"
            onClick={() => setCartDrawerOpen(true)}
            className="flex items-center gap-1 p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg hover:ring-1 hover:ring-white transition relative cursor-pointer"
            title="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-950 font-black text-xs px-1.5 py-0.2 rounded-full min-w-[18px] text-center shadow">
                {cart.length}
              </span>
            </div>
            <span className="hidden lg:inline font-bold text-white text-xs mt-0.5">{t('cart')}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-Down Drawer (Extremely clean & mobile friendly) */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          id="mobile-navigation-drawer"
          className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-3 divide-y divide-slate-800 text-slate-200 animate-in slide-in-from-top duration-200"
        >
          {/* Personalized Greeting on Mobile Drawer */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-white block">{personalizedGreeting.fullGreeting}!</span>
                <span className="text-[10px] text-amber-300">Knowledge Centa Reader</span>
              </div>
            </div>
            {!user && (
              <button
                onClick={() => {
                  openAuthModal('Sign in to access your personal Cloud Library');
                  setIsMobileMenuOpen(false);
                }}
                className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold text-[10px] rounded-lg cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Fast Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                setCurrentView('store');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                currentView === 'store' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Catalogue</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('library');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                currentView === 'library' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-200'
              }`}
            >
              <Library className="w-4 h-4" />
              <span>Library ({library.length})</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('reels');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                currentView === 'reels' ? 'bg-pink-600 text-white font-bold' : 'bg-slate-800 text-pink-300'
              }`}
            >
              <span>Reels & Shorts</span>
            </button>

            <button
              onClick={() => {
                setCurrentView('blog');
                setIsMobileMenuOpen(false);
              }}
              className={`p-2 rounded-lg text-left text-xs font-semibold flex items-center gap-2 ${
                currentView === 'blog' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-amber-300'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              <span>Johnnyblue1 Blog</span>
            </button>
          </div>

          {/* Author & Publisher section on mobile */}
          <div className="pt-2 space-y-1">
            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Creator & Author Tools
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => {
                  setCurrentView('publish');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-800 text-left text-xs hover:bg-slate-700 flex items-center gap-2 text-amber-300"
              >
                <Feather className="w-4 h-4" />
                <span>Publish Studio</span>
              </button>

              <button
                onClick={() => {
                  setCurrentView('author-dashboard');
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-800 text-left text-xs hover:bg-slate-700 flex items-center gap-2 text-amber-300"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
            </div>
          </div>

          {/* Sound & Appearance */}
          <div className="pt-2 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleToggleSound}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold ${
                isSoundOn ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
              }`}
            >
              {isSoundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>Flip Sound: {isSoundOn ? 'ON' : 'MUTED'}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 flex items-center gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Voice Search Modal Dialog */}
      <VoiceSearchModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />

      {/* Custom Category Creation Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 text-slate-900 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Add Custom Category</h3>
                  <p className="text-xs text-slate-500">Create a personalized literary category for Johnnyblue1 Books</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCategory} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Afro-Futurism, Cybernetics, Spiritual Poetry..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCategoryName.trim()}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg shadow transition cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Category</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
