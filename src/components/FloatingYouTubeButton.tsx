import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Move, 
  Play, 
  ExternalLink, 
  Search, 
  Sparkles, 
  Film, 
  CheckCircle, 
  Maximize2, 
  Volume2, 
  Tv, 
  Layers,
  ChevronRight,
  Clock
} from 'lucide-react';
import { AuthorYouTubeVideo } from '../types';
import { AUTHOR_YOUTUBE_CHANNEL, INITIAL_YOUTUBE_VIDEOS } from '../data/mockYouTubeVideos';

export const FloatingYouTubeButton: React.FC = () => {
  // Position state (default positioned on the left side, or above WhatsApp)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return {
      x: isMobile ? 18 : 28,
      y: typeof window !== 'undefined' ? window.innerHeight - (isMobile ? 140 : 130) : 550
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<AuthorYouTubeVideo>(INITIAL_YOUTUBE_VIDEOS[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Videos');
  const [searchFilter, setSearchFilter] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Screen resize handler
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const maxX = window.innerWidth - 76;
        const maxY = window.innerHeight - 76;
        return {
          x: Math.min(Math.max(16, prev.x), maxX),
          y: Math.min(Math.max(60, prev.y), maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- TOUCH HANDLERS (for finger dragging on mobile screen) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.startX;
    const deltaY = touch.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      setHasMoved(true);
    }

    const maxX = window.innerWidth - 68;
    const maxY = window.innerHeight - 68;
    const newX = Math.min(Math.max(12, dragStartRef.current.posX + deltaX), maxX);
    const newY = Math.min(Math.max(50, dragStartRef.current.posY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!hasMoved) {
      setIsOpen(prev => !prev);
    }
  };

  // --- MOUSE HANDLERS (for dragging on desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        setHasMoved(true);
      }

      const maxX = window.innerWidth - 76;
      const maxY = window.innerHeight - 76;
      const newX = Math.min(Math.max(16, dragStartRef.current.posX + deltaX), maxX);
      const newY = Math.min(Math.max(50, dragStartRef.current.posY + deltaY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!hasMoved) {
      setIsOpen(prev => !prev);
    }
  };

  // Categories list
  const categories = [
    'All Videos',
    'Book Trailers',
    'Behind The Scenes',
    'Masterclasses',
    'Audiobook Excerpts',
    '10 Dimensions',
    'Podcasts'
  ];

  // Filter videos
  const filteredVideos = INITIAL_YOUTUBE_VIDEOS.filter((v) => {
    const matchesCategory = selectedCategory === 'All Videos' || v.category === selectedCategory;
    const matchesSearch = !searchFilter.trim() || 
      v.title.toLowerCase().includes(searchFilter.toLowerCase()) || 
      v.description.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      {/* Draggable YouTube Floating Button */}
      <div
        id="floating-movable-youtube-container"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9998,
          touchAction: 'none'
        }}
        className="select-none"
      >
        <div className="relative group">
          {/* Tooltip on hover (desktop) */}
          <div className="hidden sm:group-hover:flex absolute left-full ml-3 top-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg pointer-events-none transition-opacity">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              Watch Author YouTube Channel
            </span>
            <span className="text-stone-400 font-normal text-[10px] flex items-center gap-0.5 border-l border-stone-700 pl-1.5">
              <Move className="h-2.5 w-2.5" /> Drag anywhere
            </span>
          </div>

          <button
            id="floating-youtube-btn"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            aria-label="Watch Author YouTube Channel"
            className={`flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-xl hover:shadow-2xl transition-all active:scale-95 ${
              isDragging ? 'scale-105 shadow-2xl cursor-grabbing ring-4 ring-[#FF0000]/40' : 'cursor-grab'
            }`}
          >
            {/* Official YouTube Play Icon */}
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-2xs">
              <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>

            {/* Draggable Grip Indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-white shadow text-[9px]">
              <Move className="h-2.5 w-2.5" />
            </span>

            {/* Red Pulse Dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-white ring-2 ring-[#FF0000] animate-ping opacity-75" />
          </button>
        </div>
      </div>

      {/* In-Platform Author YouTube Channel Hub Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-5xl rounded-2xl bg-zinc-950 text-white shadow-2xl border border-zinc-800 overflow-hidden flex flex-col max-h-[94vh]">
            
            {/* Modal Channel Bar */}
            <div className="bg-zinc-900 p-3 sm:p-4 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <img
                  src={AUTHOR_YOUTUBE_CHANNEL.avatarUrl}
                  alt={AUTHOR_YOUTUBE_CHANNEL.channelName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-red-600"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                      {AUTHOR_YOUTUBE_CHANNEL.channelName}
                    </h3>
                    {AUTHOR_YOUTUBE_CHANNEL.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-zinc-400 fill-zinc-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    {AUTHOR_YOUTUBE_CHANNEL.handle} • {AUTHOR_YOUTUBE_CHANNEL.subscriberCount} • {AUTHOR_YOUTUBE_CHANNEL.videoCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsSubscribed(!isSubscribed)}
                  className={`px-3 sm:px-4 py-1.5 text-xs font-bold rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                    isSubscribed
                      ? 'bg-zinc-700 text-zinc-300'
                      : 'bg-white text-zinc-950 hover:bg-zinc-200'
                  }`}
                >
                  <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                </button>

                <a
                  href={AUTHOR_YOUTUBE_CHANNEL.customUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  title="Open on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Active Video Player + Video Catalogue */}
            <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row">
              
              {/* Left Main Stage: Embedded YouTube Player */}
              <div className="flex-1 p-3 sm:p-5 flex flex-col space-y-4">
                
                {/* 16:9 Video Container */}
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
                  <iframe
                    key={activeVideo.youtubeId}
                    src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>

                {/* Active Video Title & Details */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-600 text-white uppercase tracking-wider">
                      {activeVideo.category}
                    </span>
                    <span className="text-xs text-zinc-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {activeVideo.duration}
                    </span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400">{activeVideo.views}</span>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-400">{activeVideo.uploadDate}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {activeVideo.title}
                  </h2>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80">
                    {activeVideo.description}
                  </p>
                </div>

                {/* Finger drag notice for users */}
                <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-2 border-t border-zinc-900">
                  <span className="flex items-center gap-1">
                    <Move className="w-3 h-3" />
                    Movable YouTube Bubble: drag with your finger anywhere on the screen!
                  </span>
                  <span className="text-red-400 font-medium">Plays inside Knowledge Centa</span>
                </div>
              </div>

              {/* Right Playlist & Video Explorer Sidebar */}
              <div className="w-full lg:w-96 bg-zinc-900/90 border-t lg:border-t-0 lg:border-l border-zinc-800 p-3 sm:p-4 flex flex-col space-y-3">
                
                {/* Search in channel */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search videos in channel..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedCategory === cat
                          ? 'bg-white text-zinc-950 font-bold'
                          : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Video Playlist Cards */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[420px] lg:max-h-[520px]">
                  {filteredVideos.map((video) => {
                    const isCurrent = video.id === activeVideo.id;
                    return (
                      <div
                        key={video.id}
                        onClick={() => setActiveVideo(video)}
                        className={`p-2 rounded-xl transition cursor-pointer flex gap-3 group ${
                          isCurrent
                            ? 'bg-zinc-800/90 border border-red-500/80 ring-1 ring-red-500/30'
                            : 'hover:bg-zinc-800/50 border border-transparent'
                        }`}
                      >
                        {/* Thumbnail with duration */}
                        <div className="relative w-28 h-18 rounded-lg overflow-hidden shrink-0 bg-black">
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 text-[10px] font-mono px-1 py-0.2 rounded text-zinc-200">
                            {video.duration}
                          </span>
                          {isCurrent && (
                            <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                              <Play className="w-5 h-5 text-white fill-white animate-pulse" />
                            </div>
                          )}
                        </div>

                        {/* Video metadata */}
                        <div className="min-w-0 flex-1">
                          <h4 className={`text-xs font-bold line-clamp-2 leading-snug ${
                            isCurrent ? 'text-red-400' : 'text-zinc-200 group-hover:text-white'
                          }`}>
                            {video.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 block mt-1">
                            {video.views} • {video.uploadDate}
                          </span>
                          <span className="text-[9px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded inline-block mt-1">
                            {video.category}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {filteredVideos.length === 0 && (
                    <div className="p-6 text-center text-xs text-zinc-500">
                      No videos matched your filter.
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
};
