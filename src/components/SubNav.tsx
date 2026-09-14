import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, 
  BookText, 
  Headphones, 
  Video, 
  PenTool, 
  Bookmark, 
  Layers, 
  HardDrive, 
  Music, 
  Sparkles,
  Tablet, 
  User, 
  Heart, 
  BarChart3, 
  Film, 
  Newspaper,
  ChevronDown,
  Volume2,
  VolumeX,
  Compass,
  Briefcase
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType } from '../types';
import { soundService } from '../services/soundService';

interface DimensionItem {
  id: 'all' | FormatType;
  labelKey: string;
  defaultLabel: string;
  icon: React.ReactNode;
  badge?: string;
}

const DIMENSIONS_LIST: DimensionItem[] = [
  { id: 'all', labelKey: 'all_10_dimensions', defaultLabel: 'All 10 Dimensions', icon: <Menu className="w-3.5 h-3.5 text-slate-300" /> },
  { id: 'ebook', labelKey: 'format_ebook', defaultLabel: '1. eBook (EPUB3 / PDF)', icon: <BookText className="w-3.5 h-3.5 text-blue-400" />, badge: 'Digital' },
  { id: 'audiobook', labelKey: 'format_audiobook', defaultLabel: '2. Audiobook (320kbps MP3)', icon: <Headphones className="w-3.5 h-3.5 text-emerald-400" />, badge: 'Audio' },
  { id: 'videobook', labelKey: 'format_videobook', defaultLabel: '3. 4K Video Book (Cinema)', icon: <Video className="w-3.5 h-3.5 text-purple-400" />, badge: 'Visual' },
  { id: 'manuscript', labelKey: 'format_manuscript', defaultLabel: '4. Raw Manuscript Scans', icon: <PenTool className="w-3.5 h-3.5 text-amber-400" />, badge: 'Archival' },
  { id: 'hardcover', labelKey: 'format_hardcover', defaultLabel: '5. Clothbound Hardcover', icon: <Bookmark className="w-3.5 h-3.5 text-blue-300" />, badge: 'Print' },
  { id: 'papercover', labelKey: 'format_papercover', defaultLabel: '6. Trade Paper Cover', icon: <Layers className="w-3.5 h-3.5 text-slate-300" />, badge: 'Print' },
  { id: 'pendrive_sd', labelKey: 'format_pendrive', defaultLabel: '7. Pendrive / SD Vault (64GB)', icon: <HardDrive className="w-3.5 h-3.5 text-purple-300" />, badge: 'Physical Media' },
  { id: 'musical_album', labelKey: 'format_musical_album', defaultLabel: '8. Musical Soundtrack Album', icon: <Music className="w-3.5 h-3.5 text-emerald-300" />, badge: 'Audio' },
  { id: 'silk_cotton', labelKey: 'format_silk_cotton', defaultLabel: '9. Silk & Cotton Artisan', icon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />, badge: 'Luxury' },
  { id: 'digital_device', labelKey: 'format_digital_device', defaultLabel: '10. Dedicated Digital Device', icon: <Tablet className="w-3.5 h-3.5 text-indigo-400" />, badge: 'Hardware' },
];

export const SubNav: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedFormatFilter,
    setSelectedFormatFilter,
    t
  } = useStore();

  const [isDimensionsOpen, setIsDimensionsOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(soundService.isEnabled());

  const dimensionsRef = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const publisherRef = useRef<HTMLDivElement>(null);

  // Subscribe to sound state
  useEffect(() => {
    return soundService.subscribe((enabled) => {
      setIsSoundOn(enabled);
    });
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dimensionsRef.current && !dimensionsRef.current.contains(e.target as Node)) {
        setIsDimensionsOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setIsExploreOpen(false);
      }
      if (publisherRef.current && !publisherRef.current.contains(e.target as Node)) {
        setIsPublisherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleFormatClick = (format: 'all' | FormatType) => {
    setSelectedFormatFilter(format);
    setCurrentView('store');
    setIsDimensionsOpen(false);
  };

  const handleToggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = soundService.toggle();
    setIsSoundOn(next);
  };

  const activeDimension = DIMENSIONS_LIST.find((d) => d.id === selectedFormatFilter) || DIMENSIONS_LIST[0];

  return (
    <nav 
      id="subnav-10-dimensions-bar" 
      className="bg-[#232f3e] text-slate-200 text-xs border-b border-slate-700/80 select-none transition-colors"
    >
      <div className="max-w-[1600px] mx-auto px-3 py-1.5 flex items-center justify-between gap-2 md:gap-4">
        
        {/* Left Side: Consolidated Dimensions Dropdown & Quick Access Pills */}
        <div className="flex items-center gap-2">
          
          {/* Dropdown 1: 10 Multi-Format Dimensions */}
          <div ref={dimensionsRef} className="relative">
            <button
              id="subnav-dimensions-dropdown-btn"
              type="button"
              onClick={() => {
                setIsDimensionsOpen(!isDimensionsOpen);
                setIsExploreOpen(false);
                setIsPublisherOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                isDimensionsOpen || (selectedFormatFilter !== 'all' && currentView === 'store')
                  ? 'bg-slate-700 text-amber-300 border-amber-400/50 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700/80 text-white border-slate-600/60'
              }`}
              title="Filter by 10 Multi-Format Dimensions"
            >
              <div className="flex items-center gap-1.5">
                {activeDimension.icon}
                <span className="truncate max-w-[130px] sm:max-w-[180px]">
                  {selectedFormatFilter === 'all' 
                    ? t('all_10_dimensions') 
                    : activeDimension.defaultLabel.split(' (')[0]}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDimensionsOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
            </button>

            {/* Dropdown Menu for 10 Dimensions */}
            {isDimensionsOpen && (
              <div 
                id="subnav-dimensions-menu"
                className="absolute top-full left-0 mt-1.5 w-72 sm:w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-200 py-1 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1"
              >
                <div className="px-3.5 py-2 bg-slate-950/70 flex items-center justify-between text-[11px] font-bold text-amber-400">
                  <span className="uppercase tracking-wider">Select Dimension (10 Formats)</span>
                  <span className="text-slate-500 font-normal">Physical & Digital</span>
                </div>

                <div className="max-h-80 overflow-y-auto py-1">
                  {DIMENSIONS_LIST.map((dim) => {
                    const isSelected = selectedFormatFilter === dim.id && currentView === 'store';
                    return (
                      <button
                        key={dim.id}
                        id={`subnav-dim-item-${dim.id}`}
                        type="button"
                        onClick={() => handleFormatClick(dim.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs transition cursor-pointer hover:bg-slate-800 ${
                          isSelected ? 'bg-amber-400/15 text-amber-300 font-bold' : 'text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1 rounded bg-slate-800 shrink-0">
                            {dim.icon}
                          </div>
                          <span className="truncate">{dim.defaultLabel}</span>
                        </div>
                        {dim.badge && (
                          <span className="text-[10px] font-semibold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded shrink-0 ml-2">
                            {dim.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Quick Format Shortcuts on Tablet & Desktop */}
          <div className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => handleFormatClick('all')}
              className={`px-2.5 py-1 rounded text-xs transition cursor-pointer font-medium ${
                selectedFormatFilter === 'all' && currentView === 'store'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFormatClick('ebook')}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                selectedFormatFilter === 'ebook' && currentView === 'store'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookText className="w-3 h-3 text-blue-400" />
              <span>eBook</span>
            </button>
            <button
              onClick={() => handleFormatClick('audiobook')}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                selectedFormatFilter === 'audiobook' && currentView === 'store'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Headphones className="w-3 h-3 text-emerald-400" />
              <span>Audiobook</span>
            </button>
            <button
              onClick={() => handleFormatClick('hardcover')}
              className={`px-2 py-1 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                selectedFormatFilter === 'hardcover' && currentView === 'store'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3 h-3 text-blue-300" />
              <span>Hardcover</span>
            </button>
          </div>
        </div>

        {/* Right Side: Consolidated Explore Dropdown, Publisher Dropdown & Page Flip Sound Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-300">
          
          {/* Dropdown 2: Explore & Community */}
          <div ref={exploreRef} className="relative">
            <button
              id="subnav-explore-dropdown-btn"
              type="button"
              onClick={() => {
                setIsExploreOpen(!isExploreOpen);
                setIsDimensionsOpen(false);
                setIsPublisherOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isExploreOpen || ['reels', 'blog', 'waitlist', 'wishlist'].includes(currentView)
                  ? 'bg-slate-700 text-pink-300 border-pink-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden sm:inline">Explore & Community</span>
              <span className="sm:hidden">Explore</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isExploreOpen ? 'rotate-180 text-pink-400' : 'text-slate-400'}`} />
            </button>

            {isExploreOpen && (
              <div 
                id="subnav-explore-menu"
                className="absolute top-full right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-200 py-1 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1"
              >
                <div className="px-3.5 py-1.5 bg-slate-950/70 text-[10px] font-bold text-pink-400 uppercase tracking-wider">
                  Community & Media
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('reels');
                      setIsExploreOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'reels' ? 'bg-pink-500/20 text-pink-300 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-pink-400" />
                      <span>{t('subnav_reels')}</span>
                    </div>
                    <span className="text-[9px] bg-pink-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase">
                      {t('subnav_shorts')}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('blog');
                      setIsExploreOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'blog' ? 'bg-amber-400/20 text-amber-300 font-bold' : ''
                    }`}
                  >
                    <Newspaper className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('subnav_blog')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('waitlist');
                      setIsExploreOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'waitlist' ? 'bg-amber-400/20 text-amber-300 font-bold' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Tablet className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t('subnav_waitlist')}</span>
                    </div>
                    <span className="text-[9px] bg-stone-800 text-amber-300 font-bold px-1.5 py-0.5 rounded border border-amber-400/30">
                      4 Dims
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('wishlist');
                      setIsExploreOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'wishlist' ? 'bg-rose-500/20 text-rose-300 font-bold' : ''
                    }`}
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>{t('wish_list')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown 3: Publisher & Creator Hub */}
          <div ref={publisherRef} className="relative">
            <button
              id="subnav-publisher-dropdown-btn"
              type="button"
              onClick={() => {
                setIsPublisherOpen(!isPublisherOpen);
                setIsDimensionsOpen(false);
                setIsExploreOpen(false);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer border ${
                isPublisherOpen || ['author-dashboard', 'author-profile', 'publish'].includes(currentView)
                  ? 'bg-slate-700 text-amber-300 border-amber-400/40'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Author & Publisher</span>
              <span className="sm:hidden">Creator</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isPublisherOpen ? 'rotate-180 text-amber-400' : 'text-slate-400'}`} />
            </button>

            {isPublisherOpen && (
              <div 
                id="subnav-publisher-menu"
                className="absolute top-full right-0 mt-1.5 w-60 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 text-slate-200 py-1 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-1"
              >
                <div className="px-3.5 py-1.5 bg-slate-950/70 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Publishing & Analytics
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      setCurrentView('author-dashboard');
                      setIsPublisherOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'author-dashboard' ? 'bg-amber-400/20 text-amber-300 font-bold' : ''
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('nav_dashboard')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('publish');
                      setIsPublisherOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'publish' ? 'bg-amber-400/20 text-amber-300 font-bold' : ''
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('subnav_publish')}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('author-profile');
                      setIsPublisherOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3.5 py-2 text-left text-xs hover:bg-slate-800 transition cursor-pointer ${
                      currentView === 'author-profile' ? 'bg-amber-400/20 text-amber-300 font-bold' : ''
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t('subnav_author_hub')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Book Page Flip Sound Quick Pill / Indicator */}
          <button
            id="subnav-sound-toggle-btn"
            type="button"
            onClick={handleToggleSound}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
              isSoundOn
                ? 'bg-amber-400/15 text-amber-300 border-amber-400/40 hover:bg-amber-400/25'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title={`Page Flip Sound Effect: ${isSoundOn ? 'ON (Click to mute)' : 'MUTED (Click to enable)'}`}
          >
            {isSoundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Flip Sound: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden md:inline">Flip Sound: OFF</span>
              </>
            )}
          </button>

        </div>

      </div>
    </nav>
  );
};
