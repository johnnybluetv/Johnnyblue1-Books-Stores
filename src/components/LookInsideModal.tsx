import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Headphones, 
  Video, 
  PenTool, 
  Sparkles, 
  ShoppingCart, 
  Lock, 
  Maximize2,
  ZoomIn,
  ZoomOut,
  Type,
  Music,
  HardDrive,
  Layers,
  ChevronLeft,
  ChevronRight,
  Disc,
  FileCheck,
  Package,
  Cpu,
  Bookmark,
  Share2,
  Tablet,
  Download,
  Trash2,
  Edit3,
  Check,
  Clock,
  PlusCircle,
  Tag,
  Search,
  Copy,
  Sliders,
  AlignLeft,
  Eye,
  CloudRain,
  Flame,
  ListFilter,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType, AudioBookmark } from '../types';
import { soundService } from '../services/soundService';

export const LookInsideModal: React.FC = () => {
  const {
    lookInsideModal,
    closeLookInside,
    addToCart,
    buyNow,
    isBookPurchased,
    audioBookmarks,
    addAudioBookmark,
    deleteAudioBookmark,
    updateAudioBookmarkNote,
    getBookmarksForBook,
    initialAudioSeekSeconds,
    setInitialAudioSeekSeconds
  } = useStore();

  const { isOpen, book } = lookInsideModal;
  const [activeFormat, setActiveFormat] = useState<FormatType>(lookInsideModal.format || 'ebook');

  // Keep format synced when modal opens
  useEffect(() => {
    if (lookInsideModal.isOpen && lookInsideModal.format) {
      setActiveFormat(lookInsideModal.format);
    }
  }, [lookInsideModal.isOpen, lookInsideModal.format]);

  // Reader Settings (Font size & theme)
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark' | 'oled'>('sepia');
  const [readerFontSize, setReaderFontSize] = useState<number>(18);
  const [readerFontFamily, setReaderFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [readerLineHeight, setReaderLineHeight] = useState<'normal' | 'relaxed' | 'spacious'>('relaxed');
  const [readerWidth, setReaderWidth] = useState<'compact' | 'standard' | 'wide'>('standard');
  const [isReadingSettingsOpen, setIsReadingSettingsOpen] = useState(false);

  // Multi-chapter reader state
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [isTocOpen, setIsTocOpen] = useState(false);

  // Audio-synced Read-Along & Bionic flow
  const [isReadAlong, setIsReadAlong] = useState(false);
  const [readAlongActiveP, setReadAlongActiveP] = useState(0);
  const [readAlongSpeed, setReadAlongSpeed] = useState<number>(1.0);
  const [isBionicReading, setIsBionicReading] = useState(false);

  // In-reader keyword search
  const [previewSearchTerm, setPreviewSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Passage highlights & quote sharing
  const [activeHighlightColor, setActiveHighlightColor] = useState<'amber' | 'emerald' | 'blue' | 'purple'>('amber');
  const [readerHighlights, setReaderHighlights] = useState<Record<string, 'amber' | 'emerald' | 'blue' | 'purple'>>({});
  const [copiedQuoteToast, setCopiedQuoteToast] = useState<string | null>(null);

  // Ambient soundscape mode
  const [ambientMode, setAmbientMode] = useState<'off' | 'rain' | 'library'>('off');
  const ambientAudioRef = useRef<{ ctx: AudioContext | null; source: AudioNode | null } | null>(null);

  // Handle ambient soundscape using Web Audio API
  useEffect(() => {
    if (ambientMode === 'off') {
      if (ambientAudioRef.current) {
        try {
          (ambientAudioRef.current.source as any)?.stop?.();
          ambientAudioRef.current.ctx?.close?.();
        } catch {
          // ignore
        }
        ambientAudioRef.current = null;
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = 2 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      if (ambientMode === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.value = 900;
      } else {
        filter.type = 'bandpass';
        filter.frequency.value = 420;
        filter.Q.value = 1.4;
      }

      const gain = ctx.createGain();
      gain.gain.value = 0.12;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(0);

      ambientAudioRef.current = { ctx, source: whiteNoise };
    } catch {
      // Audio context may be restricted by autoplay policy until user interaction
    }

    return () => {
      if (ambientAudioRef.current) {
        try {
          (ambientAudioRef.current.source as any)?.stop?.();
          ambientAudioRef.current.ctx?.close?.();
        } catch {
          // ignore
        }
        ambientAudioRef.current = null;
      }
    };
  }, [ambientMode]);

  // Read-along autoscroll timer simulation
  useEffect(() => {
    let interval: number | null = null;
    if (isReadAlong) {
      interval = window.setInterval(() => {
        setReadAlongActiveP((prev) => {
          const next = prev + 1;
          const el = document.getElementById(`reader-paragraph-${next}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return next;
        });
      }, 4500 / readAlongSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isReadAlong, readAlongSpeed]);

  // Bionic reading text renderer
  const renderBionic = (text: string) => {
    return text.split(' ').map((word, wIdx) => {
      if (word.length <= 1) return <span key={wIdx}>{word} </span>;
      const mid = Math.ceil(word.length / 2);
      const start = word.slice(0, mid);
      const end = word.slice(mid);
      return (
        <span key={wIdx} className="inline">
          <strong className="font-extrabold">{start}</strong>
          <span>{end} </span>
        </span>
      );
    });
  };

  // Copy passage quote citation card
  const handleCopyQuote = (text: string) => {
    if (!book) return;
    const citation = `"${text}"\n\n— ${book.author}, "${book.title}" (Preview Edition)`;
    navigator.clipboard?.writeText(citation).catch(() => {});
    setCopiedQuoteToast('Quote card copied to clipboard!');
    setTimeout(() => setCopiedQuoteToast(null), 3000);
  };

  // Toggle paragraph highlight
  const handleToggleHighlight = (pKey: string) => {
    setReaderHighlights((prev) => {
      if (prev[pKey]) {
        const next = { ...prev };
        delete next[pKey];
        return next;
      }
      return { ...prev, [pKey]: activeHighlightColor };
    });
  };

  // Audio Player State (for Audiobook)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(45); // seconds
  const audioDuration = book?.audioSample?.sampleDurationSeconds || 312;
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const audioIntervalRef = useRef<number | null>(null);

  // Audio Bookmarks State
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [newBookmarkNote, setNewBookmarkNote] = useState('');
  const [bookmarkColorTag, setBookmarkColorTag] = useState<'amber' | 'emerald' | 'purple' | 'rose' | 'blue'>('amber');
  const [isBookmarkDrawerOpen, setIsBookmarkDrawerOpen] = useState(true);
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState('');

  // Automatically seek and start playback when user clicks a bookmark elsewhere in the app
  useEffect(() => {
    if (initialAudioSeekSeconds !== null && lookInsideModal.isOpen) {
      setAudioProgress(initialAudioSeekSeconds);
      setIsPlayingAudio(true);
      setActiveFormat('audiobook');
      setInitialAudioSeekSeconds(null);
    }
  }, [initialAudioSeekSeconds, lookInsideModal.isOpen, setInitialAudioSeekSeconds]);

  // Video Player State
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Handwritten Manuscript Viewer State
  const [handwrittenPageIdx, setHandwrittenPageIdx] = useState(0);
  const [showTranscription, setShowTranscription] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Musical Album Player State
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [isPlayingAlbum, setIsPlayingAlbum] = useState(false);
  const [albumTrackProgress, setAlbumTrackProgress] = useState(12);
  const albumAudioRef = useRef<HTMLAudioElement | null>(null);

  // Audio timer simulation for audiobook
  useEffect(() => {
    if (isPlayingAudio) {
      audioIntervalRef.current = window.setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= audioDuration) {
            setIsPlayingAudio(false);
            return audioDuration;
          }
          return prev + 1;
        });
      }, 1000 / audioSpeed);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [isPlayingAudio, audioSpeed, audioDuration]);

  // Musical album timer
  useEffect(() => {
    let timer: number | null = null;
    if (isPlayingAlbum) {
      timer = window.setInterval(() => {
        setAlbumTrackProgress((prev) => (prev >= 240 ? 0 : prev + 1));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlayingAlbum]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLookInside();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeLookInside]);

  if (!isOpen || !book) return null;

  const formatData = book.formats[activeFormat] || book.formats.ebook;
  const isPurchased = isBookPurchased(book.id, activeFormat);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAudioSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioProgress(Number(e.target.value));
  };

  const skipAudio = (seconds: number) => {
    setAudioProgress((prev) => Math.max(0, Math.min(audioDuration, prev + seconds)));
  };

  // Audio Bookmarks Helpers
  const bookBookmarks = book ? getBookmarksForBook(book.id) : [];

  const handleCreateBookmark = async () => {
    if (!book) return;
    const formatted = formatTime(audioProgress);
    await addAudioBookmark({
      bookId: book.id,
      bookTitle: book.title,
      bookCoverImage: book.coverImage,
      author: book.author,
      timestampSeconds: audioProgress,
      formattedTimestamp: formatted,
      chapterTitle: `${book.audioSample?.title || 'Audiobook'} (${formatted})`,
      note: newBookmarkNote.trim() || undefined,
      colorTag: bookmarkColorTag
    });
    setNewBookmarkNote('');
    setIsAddingBookmark(false);
    setIsBookmarkDrawerOpen(true);
  };

  const handleSaveEditedNote = async (id: string) => {
    if (!editingNoteText.trim()) return;
    await updateAudioBookmarkNote(id, editingNoteText.trim());
    setEditingBookmarkId(null);
    setEditingNoteText('');
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isPlayingVideo) {
        videoRef.current.pause();
        setIsPlayingVideo(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlayingVideo(true);
      }
    }
  };

  const handwrittenPages = book.manuscriptSample?.handwrittenNotebook?.scannedPages || [
    {
      pageNumber: 1,
      imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
      transcription: book.chapterOnePreview.content[0],
      authorAnnotation: 'Core concept penned in fountain pen.'
    }
  ];

  const currentScannedPage = handwrittenPages[handwrittenPageIdx] || handwrittenPages[0];
  const albumTracks = book.musicalAlbumSample?.tracks || [];
  const currentTrack = albumTracks[currentTrackIdx] || {
    id: 'sample',
    trackNumber: 1,
    title: 'Overture Theme',
    duration: '4:15',
    audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
    description: 'Ambient focus track'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-700 w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col overflow-hidden text-slate-900"
        role="dialog"
        aria-modal="true"
      >
        {/* ======================================================== */}
        {/* MODAL HEADER: Title, 8-Format Switcher & Close Button    */}
        {/* ======================================================== */}
        <div className="bg-[#131921] text-white px-4 py-3 flex items-center justify-between border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <div className="w-7 h-7 rounded bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0">
              KC
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                  Look Inside / Multi-Dimension Studio
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 font-semibold truncate hidden sm:inline">
                  {book.title}
                </span>
              </div>
              <div className="text-xs text-slate-400 truncate">
                by {book.author}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            id="modal-close-btn"
            onClick={closeLookInside}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 8-Format Selector Navigation Bar inside Modal */}
        <div className="bg-slate-900 text-slate-200 px-4 py-2 flex items-center gap-1.5 overflow-x-auto border-b border-slate-800 shrink-0 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">
            Dimension:
          </span>
          {[
            { key: 'ebook', label: 'eBook', icon: BookOpen },
            { key: 'audiobook', label: 'Audiobook', icon: Headphones },
            { key: 'videobook', label: '4K Video', icon: Video },
            { key: 'manuscript', label: 'Raw Manuscript', icon: PenTool },
            { key: 'hardcover', label: 'Hardcover', icon: Bookmark },
            { key: 'papercover', label: 'Paper Cover', icon: Layers },
            { key: 'pendrive_sd', label: 'Pendrive / SD', icon: HardDrive },
            { key: 'musical_album', label: 'Musical Album', icon: Music },
            { key: 'silk_cotton', label: 'Silk & Cotton', icon: Sparkles },
            { key: 'digital_device', label: 'Dedicated Device', icon: Tablet }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFormat(key as FormatType)}
              className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 cursor-pointer whitespace-nowrap transition ${
                activeFormat === key
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* ======================================================== */}
        {/* MODAL BODY: Format-Specific Interactive Player/Reader    */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto relative flex flex-col">
          
          {/* -------------------------------------------------------- */}
          {/* 1. AUDIOBOOK PLAYER MODE                                */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'audiobook' && (
            <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-6 flex flex-col items-center justify-center space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-8 max-w-2xl w-full">
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-xl shadow-2xl overflow-hidden shrink-0 border border-slate-700 bg-slate-800 relative group">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                    <span className="text-[10px] font-bold text-amber-400 bg-slate-900/80 px-2 py-0.5 rounded border border-amber-400/30">
                      Unabridged Audio Sample
                    </span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-3 w-full">
                  <div className="space-y-1">
                    <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                      Now Streaming Sample Preview
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                      {book.audioSample.title}
                    </h3>
                    <p className="text-sm text-slate-300">
                      Narrated by <span className="text-amber-300 font-semibold">{book.audioSample.narrator}</span>
                    </p>
                  </div>

                  {/* Dynamic Audio Visualizer Bars */}
                  <div className="flex items-end justify-center md:justify-start gap-1 h-12 py-1">
                    {[16, 28, 40, 22, 34, 18, 46, 32, 20, 38, 24, 42, 18, 30, 22, 36, 28, 44, 18, 32].map((height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'bg-amber-400 animate-pulse' : 'bg-slate-600'
                        }`}
                        style={{
                          height: isPlayingAudio ? `${Math.max(8, (height * ((i % 3) + 1)) % 44)}px` : '8px'
                        }}
                      />
                    ))}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-3">
                    <span>Master Quality: 320 kbps MP3</span>
                    <span>•</span>
                    <span>Sample Limit: 5 min 12 sec</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Seek with Interactive Bookmark Pips */}
              <div className="max-w-2xl w-full space-y-2">
                <div className="relative w-full">
                  <input
                    type="range"
                    min="0"
                    max={audioDuration}
                    value={audioProgress}
                    onChange={handleAudioSeek}
                    className="w-full accent-amber-400 h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer relative z-10"
                  />
                  {/* Bookmark Visual Pins on Audio Timeline */}
                  {bookBookmarks.map((bm) => {
                    const pct = Math.min(100, Math.max(0, (bm.timestampSeconds / audioDuration) * 100));
                    const colorBg = 
                      bm.colorTag === 'emerald' ? 'bg-emerald-400' :
                      bm.colorTag === 'purple' ? 'bg-purple-400' :
                      bm.colorTag === 'rose' ? 'bg-rose-400' :
                      bm.colorTag === 'blue' ? 'bg-blue-400' : 'bg-amber-400';
                    return (
                      <button
                        key={bm.id}
                        type="button"
                        onClick={() => {
                          setAudioProgress(bm.timestampSeconds);
                          setIsPlayingAudio(true);
                        }}
                        style={{ left: `${pct}%` }}
                        className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full ${colorBg} border-2 border-slate-900 shadow-md z-20 cursor-pointer hover:scale-150 hover:z-30 transition-transform`}
                        title={`Bookmark: ${bm.formattedTimestamp}${bm.note ? ' — ' + bm.note : ''}`}
                      />
                    );
                  })}
                </div>
                <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1 font-bold text-slate-200">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {formatTime(audioProgress)}
                  </span>
                  <span className="text-[11px] text-slate-400 font-sans">
                    {bookBookmarks.length} {bookBookmarks.length === 1 ? 'bookmark' : 'bookmarks'} in this track
                  </span>
                  <span>{formatTime(audioDuration)}</span>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <button
                  onClick={() => skipAudio(-15)}
                  className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer flex flex-col items-center"
                  title="Rewind 15 seconds"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">15s</span>
                </button>

                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="w-16 h-16 rounded-full bg-amber-400 hover:bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                  title={isPlayingAudio ? 'Pause' : 'Play'}
                >
                  {isPlayingAudio ? (
                    <Pause className="w-7 h-7 fill-current" />
                  ) : (
                    <Play className="w-7 h-7 fill-current translate-x-0.5" />
                  )}
                </button>

                <button
                  onClick={() => skipAudio(15)}
                  className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-full transition cursor-pointer flex flex-col items-center"
                  title="Forward 15 seconds"
                >
                  <RotateCw className="w-5 h-5" />
                  <span className="text-[10px] mt-0.5">15s</span>
                </button>

                {/* Speed Selector */}
                <div className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-full text-xs font-semibold">
                  {[0.75, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => setAudioSpeed(s)}
                      className={`px-1.5 py-0.5 rounded transition ${
                        audioSpeed === s ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Bookmark Current Time Button */}
                <button
                  type="button"
                  id="audio-add-bookmark-btn"
                  onClick={() => setIsAddingBookmark(!isAddingBookmark)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-full font-bold text-xs shadow-md transition transform hover:scale-105 cursor-pointer"
                  title="Bookmark Current Audio Timestamp"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                  <span>Bookmark ({formatTime(audioProgress)})</span>
                </button>
              </div>

              {/* Bookmark Composer Form (when user clicks Bookmark) */}
              {isAddingBookmark && (
                <div className="max-w-2xl w-full bg-slate-800/90 border border-amber-400/40 rounded-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        New Audio Bookmark at <span className="font-mono text-amber-300 font-bold">{formatTime(audioProgress)}</span>
                      </span>
                    </div>
                    <button
                      onClick={() => setIsAddingBookmark(false)}
                      className="text-slate-400 hover:text-white text-xs p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tag Color Selector */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 text-[11px] font-medium">Color Tag:</span>
                    {(['amber', 'emerald', 'purple', 'rose', 'blue'] as const).map((color) => {
                      const bgClasses = {
                        amber: 'bg-amber-400',
                        emerald: 'bg-emerald-400',
                        purple: 'bg-purple-400',
                        rose: 'bg-rose-400',
                        blue: 'bg-blue-400'
                      };
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setBookmarkColorTag(color)}
                          className={`w-5 h-5 rounded-full ${bgClasses[color]} transition transform cursor-pointer ${
                            bookmarkColorTag === color ? 'ring-2 ring-white scale-125' : 'opacity-70 hover:opacity-100'
                          }`}
                          title={`Select ${color} tag`}
                        />
                      );
                    })}
                  </div>

                  {/* Optional Note Input */}
                  <div className="space-y-1">
                    <input
                      type="text"
                      placeholder="Add an optional study note, key quote, or chapter annotation..."
                      value={newBookmarkNote}
                      onChange={(e) => setNewBookmarkNote(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateBookmark();
                        }
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400 outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingBookmark(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-700 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateBookmark}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 shadow transition cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Save Bookmark</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Saved Audio Bookmarks Section for this Book */}
              <div className="max-w-2xl w-full bg-slate-950/60 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200 tracking-wide">
                      Audio Bookmarks ({bookBookmarks.length})
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">
                    Click timestamp to jump & resume playback
                  </span>
                </div>

                {bookBookmarks.length === 0 ? (
                  <div className="py-4 text-center border border-dashed border-slate-800 rounded-lg text-xs text-slate-400 space-y-1">
                    <p>No audio bookmarks saved for this book yet.</p>
                    <p className="text-[11px] text-slate-500">
                      Click the <strong className="text-amber-400">"Bookmark ({formatTime(audioProgress)})"</strong> button above to save key ideas and timestamps.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {bookBookmarks.map((bm) => {
                      const isEditing = editingBookmarkId === bm.id;
                      const tagColorBadge = 
                        bm.colorTag === 'emerald' ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40' :
                        bm.colorTag === 'purple' ? 'bg-purple-950/60 text-purple-300 border-purple-500/40' :
                        bm.colorTag === 'rose' ? 'bg-rose-950/60 text-rose-300 border-rose-500/40' :
                        bm.colorTag === 'blue' ? 'bg-blue-950/60 text-blue-300 border-blue-500/40' :
                        'bg-amber-950/60 text-amber-300 border-amber-500/40';

                      return (
                        <div
                          key={bm.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition"
                        >
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Jump to Bookmark Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setAudioProgress(bm.timestampSeconds);
                                setIsPlayingAudio(true);
                              }}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold border transition cursor-pointer shrink-0 ${tagColorBadge} hover:brightness-125`}
                              title="Click to jump and play at this timestamp"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>{bm.formattedTimestamp}</span>
                            </button>

                            {/* Bookmark Details & Note */}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-200 truncate">
                                {bm.chapterTitle || 'Saved Timestamp'}
                              </div>
                              {isEditing ? (
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <input
                                    type="text"
                                    value={editingNoteText}
                                    onChange={(e) => setEditingNoteText(e.target.value)}
                                    className="px-2 py-1 bg-slate-950 border border-amber-400/50 rounded text-xs text-white focus:outline-none flex-1"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => handleSaveEditedNote(bm.id)}
                                    className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                                    title="Save note"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => setEditingBookmarkId(null)}
                                    className="p-1 text-slate-400 hover:bg-slate-800 rounded"
                                    title="Cancel"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : bm.note ? (
                                <p className="text-[11px] text-slate-300 italic mt-0.5 line-clamp-2">
                                  "{bm.note}"
                                </p>
                              ) : (
                                <span className="text-[10px] text-slate-500">No note added</span>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                            {!isEditing && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingBookmarkId(bm.id);
                                  setEditingNoteText(bm.note || '');
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition cursor-pointer"
                                title="Edit note"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteAudioBookmark(bm.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition cursor-pointer"
                              title="Delete bookmark"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 2. 4K VIDEO BOOK MODE                                    */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'videobook' && (
            <div className="flex-1 bg-black text-white flex flex-col">
              <div className="relative w-full aspect-video max-h-[500px] bg-slate-950 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  src={book.videoSample.videoUrl}
                  poster={book.coverImage}
                  className="w-full h-full object-contain"
                  controls
                  onPlay={() => setIsPlayingVideo(true)}
                  onPause={() => setIsPlayingVideo(false)}
                />
              </div>
              <div className="p-4 bg-slate-900 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-amber-400">{book.videoSample.title}</div>
                <div>{book.videoSample.companionNotesPreview}</div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 3. ENHANCED eBOOK READER MODE (Multi-chapter & interactive) */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'ebook' && (() => {
            const previewChapters = [
              {
                id: 'ch-1',
                number: 1,
                title: book.chapterOnePreview.title || 'Chapter 1: The Sovereign Spark',
                subheading: book.chapterOnePreview.subheading || 'The Genesis of Intentional Craft',
                readTime: '6 min read',
                content: book.chapterOnePreview.content
              },
              {
                id: 'ch-2',
                number: 2,
                title: 'Chapter 2: The Multi-Dimension Matrix',
                subheading: 'Why Literary Thought Requires Diverse Sensory Dimensions',
                readTime: '7 min read',
                content: [
                  `When I began formulating "${book.title}", the conventional advice was to deliver a standard 250-page text file and leave the rest to automated distribution engines. But deep human learning was never mono-sensory. The human mind retains ideas through interconnected sensory anchors—the acoustic rhythm of spoken cadence, the tactile weight of clothbound paper, and the intimate scrutiny of raw handwritten drafts.`,
                  `Consider how we remember great conversations: we remember the acoustic timbre of the voice, the cadence of the pauses, and the surrounding ambient atmosphere. By architecting this work across ten distinct physical and acoustic media, every concept is given multiple cognitive doorways.`,
                  `The reader who listens during evening transit absorbs emotional pacing. The reader who sits with fountain-pen scanned manuscripts observes the living struggle of early drafts—every crossed-out phrase a testament to intellectual refinement.`
                ]
              },
              {
                id: 'ch-3',
                number: 3,
                title: 'Chapter 3: Cognitive Flow & Deep Immersion',
                subheading: 'The Neuroscience of Distraction-Free Literary Focus',
                readTime: '5 min read',
                content: [
                  `In an era governed by algorithmic feeds engineered to fracture concentration, entering a sustained state of literary immersion is a deliberate act of cognitive sovereignty. Cognitive psychologists refer to this as 'deep reading'—an active neurobiological process where comprehension, empathy, and critical synthesis intersect.`,
                  `When reading without ambient distraction, our neurological alpha rhythms steady. The inner voice ceases its frantic hypervigilance and aligns with the tempo of the author's argument. Ideas cease to be external claims and become integrated insights that alter how we perceive our daily landscape.`
                ]
              },
              {
                id: 'ch-4',
                number: 4,
                title: "Epilogue & Author's Working Notes",
                subheading: 'Field Observations, Drafting Tools & Archival Integrity',
                readTime: '4 min read',
                content: [
                  `"I wrote these pages between midnight and dawn," notes ${book.author}. "Every sentence was tested against lived experience, verified through hard-won trial, and preserved across ten physical and digital editions."`,
                  `The handwritten notebooks scanned for this edition were drafted using archival Pelikan inks on acid-free paper to ensure fifty-year stability. The companion audio tracks were captured on vacuum-tube microphones to preserve harmonic resonance without artificial compression.`,
                  `As you conclude this introductory sample, remember that a book is not merely an object you purchase; it is a conversation between minds that spans across generations and geography.`
                ]
              }
            ];

            const currentChapter = previewChapters[currentChapterIdx] || previewChapters[0];
            const chapterProgressPct = Math.round(((currentChapterIdx + 1) / previewChapters.length) * 100);

            // Container theme styles
            const themeClasses = 
              readerTheme === 'light' ? 'bg-white text-slate-900 border-slate-200' :
              readerTheme === 'sepia' ? 'bg-[#fcf7ed] text-[#423321] border-[#eedcbb]' :
              readerTheme === 'dark' ? 'bg-[#181d24] text-[#e2e8f0] border-slate-700' :
              'bg-[#0a0a0c] text-[#d4d4d8] border-stone-800';

            const toolbarTheme =
              readerTheme === 'light' ? 'bg-slate-50/95 border-b border-slate-200 text-slate-800' :
              readerTheme === 'sepia' ? 'bg-[#f4ebd6]/95 border-b border-[#eedcbb] text-[#4a3b2c]' :
              readerTheme === 'dark' ? 'bg-[#13171d]/95 border-b border-slate-800 text-slate-200' :
              'bg-[#050507]/95 border-b border-stone-800 text-stone-200';

            const fontFamClass =
              readerFontFamily === 'serif' ? 'font-serif' :
              readerFontFamily === 'sans' ? 'font-sans' :
              'font-mono';

            const lineSpacingClass =
              readerLineHeight === 'normal' ? 'leading-normal' :
              readerLineHeight === 'relaxed' ? 'leading-relaxed' :
              'leading-loose';

            const widthClass =
              readerWidth === 'compact' ? 'max-w-xl' :
              readerWidth === 'standard' ? 'max-w-2xl' :
              'max-w-3xl';

            const handleNextChapter = () => {
              if (currentChapterIdx < previewChapters.length - 1) {
                setCurrentChapterIdx((prev) => prev + 1);
                soundService.playFlipSound();
                setReadAlongActiveP(0);
              }
            };

            const handlePrevChapter = () => {
              if (currentChapterIdx > 0) {
                setCurrentChapterIdx((prev) => prev - 1);
                soundService.playFlipSound();
                setReadAlongActiveP(0);
              }
            };

            return (
              <div className={`flex-1 flex flex-col relative overflow-hidden ${themeClasses}`}>
                
                {/* 1. Enhanced Reader Control Toolbar */}
                <div className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs backdrop-blur-md sticky top-0 z-20 ${toolbarTheme}`}>
                  {/* Left: TOC Button & Chapter Status */}
                  <div className="flex items-center gap-2">
                    <button
                      id="reader-toc-btn"
                      onClick={() => setIsTocOpen(!isTocOpen)}
                      className="px-2.5 py-1.5 rounded-lg border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 font-bold flex items-center gap-1.5 transition cursor-pointer"
                      title="Table of Contents"
                    >
                      <ListFilter className="w-3.5 h-3.5 text-amber-600" />
                      <span>Chapters ({currentChapterIdx + 1}/{previewChapters.length})</span>
                    </button>
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] opacity-75">
                      <span>•</span>
                      <span>{currentChapter.readTime}</span>
                      <span>•</span>
                      <div className="w-16 h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${chapterProgressPct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px]">{chapterProgressPct}%</span>
                    </div>
                  </div>

                  {/* Center: Ambient Soundscape Mode */}
                  <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg">
                    <button
                      onClick={() => setAmbientMode('off')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer ${ambientMode === 'off' ? 'bg-white dark:bg-slate-800 font-bold shadow-xs' : 'opacity-70'}`}
                      title="Silent reading"
                    >
                      Silent
                    </button>
                    <button
                      onClick={() => setAmbientMode('rain')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${ambientMode === 'rain' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold shadow-xs' : 'opacity-70'}`}
                      title="Gentle rain soundscape"
                    >
                      <CloudRain className="w-3 h-3 text-sky-500" />
                      <span>Rain</span>
                    </button>
                    <button
                      onClick={() => setAmbientMode('library')}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${ambientMode === 'library' ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold shadow-xs' : 'opacity-70'}`}
                      title="Cozy fireplace & library soundscape"
                    >
                      <Flame className="w-3 h-3 text-orange-500" />
                      <span>Cozy</span>
                    </button>
                  </div>

                  {/* Right: Read-Along, Bionic, Search & Typography Controls */}
                  <div className="flex items-center gap-1.5">
                    {/* Audio Read-Along Toggle */}
                    <button
                      id="reader-read-along-toggle"
                      onClick={() => setIsReadAlong(!isReadAlong)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                        isReadAlong
                          ? 'bg-amber-500 text-stone-950 ring-2 ring-amber-300'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                      title="Audio-synced Read-Along mode"
                    >
                      <Headphones className={`w-3.5 h-3.5 ${isReadAlong ? 'animate-bounce' : ''}`} />
                      <span className="hidden md:inline">Listen & Read</span>
                    </button>

                    {/* Bionic Reading Flow Toggle */}
                    <button
                      id="reader-bionic-toggle"
                      onClick={() => setIsBionicReading(!isBionicReading)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                        isBionicReading
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                      title="Bionic Reading Flow (focal anchors for faster reading)"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Bionic Flow</span>
                    </button>

                    {/* Search Toggle */}
                    <button
                      id="reader-search-toggle"
                      onClick={() => setIsSearchOpen(!isSearchOpen)}
                      className={`p-1.5 rounded-lg transition cursor-pointer ${
                        isSearchOpen || previewSearchTerm
                          ? 'bg-amber-100 text-amber-900 font-bold'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                      title="Search in Preview"
                    >
                      <Search className="w-3.5 h-3.5" />
                    </button>

                    {/* Typography & Appearance Drawer Toggle */}
                    <button
                      id="reader-settings-toggle"
                      onClick={() => setIsReadingSettingsOpen(!isReadingSettingsOpen)}
                      className={`p-1.5 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                        isReadingSettingsOpen
                          ? 'bg-amber-400 text-stone-950 font-bold'
                          : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10'
                      }`}
                      title="Adjust font, line spacing, themes, and width"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-bold hidden sm:inline">Aa</span>
                    </button>
                  </div>
                </div>

                {/* 2. In-Reader Search Bar Banner */}
                {isSearchOpen && (
                  <div className="px-4 py-2 bg-amber-50/95 dark:bg-stone-900/95 border-b border-amber-200 dark:border-stone-800 flex items-center gap-2 text-xs z-15">
                    <Search className="w-4 h-4 text-amber-600 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search text in this chapter (e.g. thesis, reader, dimension, focus)..."
                      value={previewSearchTerm}
                      onChange={(e) => setPreviewSearchTerm(e.target.value)}
                      className="flex-1 bg-white dark:bg-stone-800 border border-amber-300 dark:border-stone-700 rounded-lg px-3 py-1 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-amber-500"
                      autoFocus
                    />
                    {previewSearchTerm && (
                      <button
                        onClick={() => setPreviewSearchTerm('')}
                        className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 rounded bg-black/5 dark:bg-white/5"
                      >
                        Clear
                      </button>
                    )}
                    <button
                      onClick={() => { setIsSearchOpen(false); setPreviewSearchTerm(''); }}
                      className="text-xs text-amber-900 dark:text-amber-300 font-bold hover:underline px-2 py-1"
                    >
                      Done
                    </button>
                  </div>
                )}

                {/* 3. Typography & Appearance Drawer Popover */}
                {isReadingSettingsOpen && (
                  <div className="absolute right-4 top-12 z-30 w-80 p-4 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs text-slate-800 dark:text-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                      <span className="font-bold text-sm">Reading Preferences</span>
                      <button
                        onClick={() => setIsReadingSettingsOpen(false)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Themes */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Theme</label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { id: 'light', label: 'Light', bg: 'bg-white text-slate-900 border-slate-300' },
                          { id: 'sepia', label: 'Sepia', bg: 'bg-[#fcf7ed] text-[#423321] border-[#eedcbb]' },
                          { id: 'dark', label: 'Dark', bg: 'bg-[#181d24] text-white border-slate-700' },
                          { id: 'oled', label: 'OLED', bg: 'bg-black text-slate-200 border-stone-800' }
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setReaderTheme(t.id as any)}
                            className={`p-2 rounded-lg border text-center font-semibold transition cursor-pointer ${t.bg} ${readerTheme === t.id ? 'ring-2 ring-amber-500 font-bold' : 'opacity-80 hover:opacity-100'}`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Family */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Typography</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        <button
                          onClick={() => setReaderFontFamily('serif')}
                          className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 font-serif text-center transition cursor-pointer ${readerFontFamily === 'serif' ? 'bg-amber-100 dark:bg-amber-950 font-bold border-amber-400' : ''}`}
                        >
                          Serif
                        </button>
                        <button
                          onClick={() => setReaderFontFamily('sans')}
                          className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 font-sans text-center transition cursor-pointer ${readerFontFamily === 'sans' ? 'bg-amber-100 dark:bg-amber-950 font-bold border-amber-400' : ''}`}
                        >
                          Modern Sans
                        </button>
                        <button
                          onClick={() => setReaderFontFamily('mono')}
                          className={`p-2 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-center transition cursor-pointer ${readerFontFamily === 'mono' ? 'bg-amber-100 dark:bg-amber-950 font-bold border-amber-400' : ''}`}
                        >
                          Draft Mono
                        </button>
                      </div>
                    </div>

                    {/* Font Size & Line Spacing */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Size: {readerFontSize}px</label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setReaderFontSize((s) => Math.max(13, s - 1))}
                            className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 text-center"
                          >
                            A-
                          </button>
                          <button
                            onClick={() => setReaderFontSize((s) => Math.min(26, s + 1))}
                            className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold hover:bg-slate-200 text-center"
                          >
                            A+
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Line Height</label>
                        <div className="flex items-center gap-1">
                          {(['normal', 'relaxed', 'spacious'] as const).map((lh) => (
                            <button
                              key={lh}
                              onClick={() => setReaderLineHeight(lh)}
                              className={`flex-1 py-1.5 rounded-lg text-[10px] font-semibold transition cursor-pointer ${readerLineHeight === lh ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}
                            >
                              {lh === 'normal' ? '1.5' : lh === 'relaxed' ? '1.8' : '2.1'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column Width */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Margin Width</label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {(['compact', 'standard', 'wide'] as const).map((w) => (
                          <button
                            key={w}
                            onClick={() => setReaderWidth(w)}
                            className={`py-1.5 rounded-lg text-xs capitalize transition cursor-pointer ${readerWidth === w ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-slate-100 dark:bg-slate-800'}`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Highlight Color Palette */}
                    <div className="space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">Pen Highlighter Color</label>
                      <div className="flex items-center gap-2">
                        {(['amber', 'emerald', 'blue', 'purple'] as const).map((col) => {
                          const bg = 
                            col === 'amber' ? 'bg-amber-400' :
                            col === 'emerald' ? 'bg-emerald-400' :
                            col === 'blue' ? 'bg-sky-400' :
                            'bg-purple-400';
                          return (
                            <button
                              key={col}
                              onClick={() => setActiveHighlightColor(col)}
                              className={`w-6 h-6 rounded-full ${bg} transition transform cursor-pointer ${activeHighlightColor === col ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-white scale-110' : 'opacity-70 hover:opacity-100'}`}
                              title={`${col} highlighter`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Table of Contents Slide-Out Drawer */}
                {isTocOpen && (
                  <div className="absolute inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-30 flex flex-col">
                    <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-amber-600" />
                        <span className="font-bold text-sm">Table of Contents</span>
                      </div>
                      <button
                        onClick={() => setIsTocOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                      {previewChapters.map((ch, idx) => (
                        <button
                          key={ch.id}
                          onClick={() => {
                            setCurrentChapterIdx(idx);
                            soundService.playFlipSound();
                            setIsTocOpen(false);
                            setReadAlongActiveP(0);
                          }}
                          className={`w-full p-3 rounded-xl text-left transition cursor-pointer flex flex-col gap-1 border ${
                            currentChapterIdx === idx
                              ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 font-semibold shadow-xs'
                              : 'bg-slate-50/70 dark:bg-slate-800/40 border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold">Chapter {ch.number}</span>
                            <span className="text-[10px] text-slate-400">{ch.readTime}</span>
                          </div>
                          <span className="font-serif text-sm font-bold line-clamp-1">{ch.title}</span>
                          {ch.subheading && (
                            <span className="text-[11px] text-slate-500 italic line-clamp-1">{ch.subheading}</span>
                          )}
                        </button>
                      ))}
                    </div>

                    <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs space-y-2">
                      <div className="text-slate-500 text-[11px]">
                        Included with full purchase: Complete unabridged digital manuscript, high-res plates, and sync to all 10 formats.
                      </div>
                      <button
                        onClick={() => buyNow(book, 'ebook')}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-center transition cursor-pointer shadow-xs"
                      >
                        Purchase Complete Edition
                      </button>
                    </div>
                  </div>
                )}

                {/* 5. Main Reader Stage */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-10">
                  <div className={`${widthClass} mx-auto space-y-8`}>
                    
                    {/* Chapter Header */}
                    <div className="text-center space-y-2 border-b border-black/10 dark:border-white/10 pb-6">
                      <span className="text-xs uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">
                        {book.title} • Chapter {currentChapter.number}
                      </span>
                      <h2 className={`text-2xl sm:text-3xl font-bold ${fontFamClass} text-center`}>
                        {currentChapter.title}
                      </h2>
                      {currentChapter.subheading && (
                        <p className="text-sm italic opacity-75 font-serif max-w-lg mx-auto">
                          {currentChapter.subheading}
                        </p>
                      )}
                      <div className="flex items-center justify-center gap-3 pt-2 text-[11px] opacity-60">
                        <span>{book.author}</span>
                        <span>•</span>
                        <span>{currentChapter.readTime}</span>
                        <span>•</span>
                        <span>Font size: {readerFontSize}px</span>
                      </div>
                    </div>

                    {/* Chapter Paragraphs */}
                    <div 
                      className={`space-y-6 ${fontFamClass} ${lineSpacingClass}`} 
                      style={{ fontSize: `${readerFontSize}px` }}
                    >
                      {currentChapter.content.map((paragraph, pIdx) => {
                        const pKey = `${currentChapter.id}-p-${pIdx}`;
                        const isHighlighted = readerHighlights[pKey];
                        const isCurrentReadAlong = isReadAlong && readAlongActiveP === pIdx;

                        // Highlight background styles
                        const highlightBg = 
                          isHighlighted === 'amber' ? 'bg-amber-200/50 dark:bg-amber-900/40 rounded px-2 py-1' :
                          isHighlighted === 'emerald' ? 'bg-emerald-200/50 dark:bg-emerald-900/40 rounded px-2 py-1' :
                          isHighlighted === 'blue' ? 'bg-sky-200/50 dark:bg-sky-900/40 rounded px-2 py-1' :
                          isHighlighted === 'purple' ? 'bg-purple-200/50 dark:bg-purple-900/40 rounded px-2 py-1' :
                          '';

                        const readAlongStyle = isCurrentReadAlong 
                          ? 'ring-2 ring-amber-400/80 bg-amber-50/50 dark:bg-amber-950/40 rounded-xl p-3 shadow-md' 
                          : '';

                        return (
                          <div 
                            key={pIdx}
                            id={`reader-paragraph-${pIdx}`}
                            className={`group relative transition-all duration-300 ${highlightBg} ${readAlongStyle}`}
                          >
                            <p className="indent-6 text-justify">
                              {/* Search Highlight or Bionic or Plain */}
                              {previewSearchTerm ? (
                                paragraph.split(new RegExp(`(${previewSearchTerm})`, 'gi')).map((part, i) =>
                                  part.toLowerCase() === previewSearchTerm.toLowerCase() ? (
                                    <mark key={i} className="bg-amber-300 dark:bg-amber-700 text-stone-950 dark:text-white px-0.5 rounded font-bold">
                                      {part}
                                    </mark>
                                  ) : (
                                    <span key={i}>{part}</span>
                                  )
                                )
                              ) : isBionicReading ? (
                                renderBionic(paragraph)
                              ) : (
                                paragraph
                              )}
                            </p>

                            {/* Hover Utility Controls for Paragraph */}
                            <div className="hidden group-hover:flex items-center gap-1 absolute -top-3.5 right-2 bg-white dark:bg-slate-800 shadow-md border border-slate-200 dark:border-slate-700 rounded-full px-2 py-0.5 text-[10px] z-10 transition-opacity">
                              <button
                                onClick={() => handleToggleHighlight(pKey)}
                                className="hover:text-amber-600 flex items-center gap-0.5 font-medium px-1 cursor-pointer"
                                title="Toggle Highlight"
                              >
                                <span>Pen</span>
                              </button>
                              <span>|</span>
                              <button
                                onClick={() => handleCopyQuote(paragraph)}
                                className="hover:text-amber-600 flex items-center gap-0.5 font-medium px-1 cursor-pointer"
                                title="Copy Quote Citation Card"
                              >
                                <Copy className="w-2.5 h-2.5" />
                                <span>Quote</span>
                              </button>
                              <span>|</span>
                              <button
                                onClick={() => {
                                  setIsReadAlong(true);
                                  setReadAlongActiveP(pIdx);
                                }}
                                className="hover:text-amber-600 flex items-center gap-0.5 font-medium px-1 cursor-pointer"
                                title="Start Read-Along from here"
                              >
                                <span>Listen</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chapter Pagination Navigation */}
                    <div className="pt-8 pb-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-4">
                      <button
                        onClick={handlePrevChapter}
                        disabled={currentChapterIdx === 0}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          currentChapterIdx === 0
                            ? 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5'
                            : 'bg-black/10 dark:bg-white/10 hover:bg-black/15'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Previous Chapter</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {previewChapters.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCurrentChapterIdx(i);
                              soundService.playFlipSound();
                              setReadAlongActiveP(0);
                            }}
                            className={`w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                              currentChapterIdx === i
                                ? 'bg-amber-500 scale-125'
                                : 'bg-black/20 dark:bg-white/20 hover:bg-amber-400'
                            }`}
                            title={`Jump to Chapter ${i + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={handleNextChapter}
                        disabled={currentChapterIdx === previewChapters.length - 1}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                          currentChapterIdx === previewChapters.length - 1
                            ? 'opacity-40 cursor-not-allowed bg-black/5 dark:bg-white/5'
                            : 'bg-amber-500 hover:bg-amber-600 text-stone-950 shadow-xs'
                        }`}
                      >
                        <span>Next Chapter</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Multi-Dimension Quick-Jump Floating Bar */}
                    <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <span className="font-bold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
                        <Sparkles className="w-4 h-4" />
                        <span>Experience other dimensions for this book:</span>
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => setActiveFormat('audiobook')}
                          className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Headphones className="w-3 h-3" />
                          <span>Audio Narration</span>
                        </button>
                        <button
                          onClick={() => setActiveFormat('manuscript')}
                          className="px-2.5 py-1 rounded-lg bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <PenTool className="w-3 h-3" />
                          <span>Handwritten Manuscript</span>
                        </button>
                        <button
                          onClick={() => setActiveFormat('videobook')}
                          className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <Video className="w-3 h-3" />
                          <span>4K Masterclass</span>
                        </button>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Copied Quote Toast notification */}
                {copiedQuoteToast && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-stone-900 text-amber-300 px-4 py-2 rounded-xl text-xs font-bold shadow-xl border border-amber-500/40 flex items-center gap-2 z-50 animate-fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{copiedQuoteToast}</span>
                  </div>
                )}
              </div>
            );
          })()}

          {/* -------------------------------------------------------- */}
          {/* 4. RAW HANDWRITTEN MANUSCRIPT MODE (Upgraded with Scans) */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'manuscript' && (
            <div className="flex-1 bg-stone-900 text-white flex flex-col overflow-hidden">
              
              {/* Manuscript Control Toolbar */}
              <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-stone-200">
                    {book.manuscriptSample?.notebookType || 'Original Author Handwritten Moleskine Draft'}
                  </span>
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[10px] font-bold border border-amber-500/40">
                    600 DPI Archival Scan
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Page Navigation */}
                  <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded border border-stone-800">
                    <button
                      onClick={() => setHandwrittenPageIdx((p) => Math.max(0, p - 1))}
                      disabled={handwrittenPageIdx === 0}
                      className="p-1 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono text-stone-300 font-bold px-1">
                      Page {handwrittenPageIdx + 1} of {handwrittenPages.length}
                    </span>
                    <button
                      onClick={() => setHandwrittenPageIdx((p) => Math.min(handwrittenPages.length - 1, p + 1))}
                      disabled={handwrittenPageIdx >= handwrittenPages.length - 1}
                      className="p-1 text-stone-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-1 bg-stone-900 px-2 py-1 rounded border border-stone-800">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                      className="p-1 text-stone-400 hover:text-white cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono px-1">{Math.round(zoomLevel * 100)}%</span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(1.8, z + 0.2))}
                      className="p-1 text-stone-400 hover:text-white cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Toggle Transcription Panel */}
                  <button
                    onClick={() => setShowTranscription(!showTranscription)}
                    className={`px-3 py-1 rounded font-semibold cursor-pointer border text-xs ${
                      showTranscription
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    Transcription Side-by-Side
                  </button>
                </div>
              </div>

              {/* Split View: High-Res Handwritten Scan + Author Transcription */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Left: High-Res Scanned Page */}
                <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-center justify-center bg-stone-900">
                  <div 
                    className="relative max-w-2xl w-full shadow-2xl rounded-lg overflow-hidden border border-stone-700 transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel})` }}
                  >
                    <img
                      src={currentScannedPage.imageUrl}
                      alt={`Handwritten scan page ${currentScannedPage.pageNumber}`}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                    <div className="absolute top-3 right-3 bg-stone-950/80 px-2.5 py-1 rounded text-[11px] font-mono text-amber-400 border border-amber-400/30">
                      Original Ink Scan #{currentScannedPage.pageNumber}
                    </div>
                  </div>
                </div>

                {/* Right: Author Transcription & Margin Notes */}
                {showTranscription && (
                  <div className="w-full md:w-96 bg-stone-950 border-t md:border-t-0 md:border-l border-stone-800 p-5 overflow-y-auto space-y-4 text-xs">
                    <div className="border-b border-stone-800 pb-3">
                      <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                        Author Transcription & Notes
                      </span>
                      <h4 className="text-sm font-bold text-white font-serif mt-0.5">
                        Page {currentScannedPage.pageNumber} Transcript
                      </h4>
                      <p className="text-[11px] text-stone-400">
                        {book.manuscriptSample?.handwrittenNotebook?.medium || 'Archival Ink on 120gsm Paper'}
                      </p>
                    </div>

                    <div className="p-3.5 bg-stone-900 rounded-lg border border-stone-800 font-serif leading-relaxed text-stone-200 whitespace-pre-line text-xs">
                      {currentScannedPage.transcription}
                    </div>

                    {currentScannedPage.authorAnnotation && (
                      <div className="p-3 bg-amber-950/40 border border-amber-700/60 rounded-lg text-amber-200 space-y-1">
                        <span className="font-bold text-amber-400 block text-[11px]">
                          Author Diary Annotation:
                        </span>
                        <p className="italic text-[11px]">
                          "{currentScannedPage.authorAnnotation}"
                        </p>
                      </div>
                    )}

                    <div className="p-3 bg-stone-900 rounded-lg border border-stone-800 space-y-2 text-[11px] text-stone-400">
                      <span className="font-bold text-stone-300 block">Collector Raw Manuscript Rights:</span>
                      <p>
                        Unedited, unredacted scans including scratched-out paragraphs, rejected chapters, and high-resolution marginalia directly from the author’s personal journal.
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 5. PHYSICAL CLOTHBOUND HARDCOVER INSPECTION MODE        */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'hardcover' && (
            <div className="flex-1 bg-slate-100 p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-48 h-64 bg-slate-900 rounded-lg shadow-xl overflow-hidden shrink-0 border-4 border-slate-800 relative">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 p-2 text-center">
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">
                        Clothbound Foil Edition
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Physical Heirloom Edition
                    </span>
                    <h3 className="text-xl font-bold font-serif text-slate-900">
                      {book.formats.hardcover?.name || 'Smyth-Sewn Clothbound Hardcover'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Crafted for collectors and libraries. Features Smyth-sewn archival binding that allows the book to lay completely flat on a desk, stamped with real foil on durable European cloth.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Binding:</span>
                        <span className="font-semibold text-slate-900">{book.hardcoverDetails?.binding}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Foil Stamping:</span>
                        <span className="font-semibold text-slate-900">{book.hardcoverDetails?.foilStamping}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Ribbon Marker:</span>
                        <span className="font-semibold text-slate-900">{book.hardcoverDetails?.ribbonColor}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Shipping:</span>
                        <span className="font-semibold text-emerald-700">{book.hardcoverDetails?.shippingEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 flex items-center gap-3">
                  <Bookmark className="w-5 h-5 text-amber-700 shrink-0" />
                  <span>
                    <strong>Bonus Included:</strong> Free instant digital eBook synchronization is included immediately in your Knowledge Centa library upon purchase.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 6. PAPER COVER (PAPERBACK) INSPECTION MODE               */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'papercover' && (
            <div className="flex-1 bg-slate-100 p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-slate-200 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-44 h-60 bg-slate-900 rounded-lg shadow-md overflow-hidden shrink-0 border border-slate-300">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-3 flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                      Everyday Trade Paperback
                    </span>
                    <h3 className="text-xl font-bold font-serif text-slate-900">
                      {book.formats.papercover?.name || 'Deluxe Paper Cover'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Lightweight, portable, and durable. Printed on 60lb natural cream acid-free paper with velvet soft-touch cover lamination designed to resist fingerprints.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Paper Stock:</span>
                        <span className="font-semibold text-slate-900">{book.papercoverDetails?.paperStock}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Finish:</span>
                        <span className="font-semibold text-slate-900">{book.papercoverDetails?.finish}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Dimensions:</span>
                        <span className="font-semibold text-slate-900">{book.papercoverDetails?.dimensions}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Delivery:</span>
                        <span className="font-semibold text-emerald-700">{book.papercoverDetails?.shippingEstimate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 7. PENDRIVE / MEMORY CARD / SD-CARD VAULT MODE          */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'pendrive_sd' && (
            <div className="flex-1 bg-slate-950 text-white p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="max-w-3xl mx-auto bg-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-800 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-48 h-48 bg-slate-800 rounded-xl flex items-center justify-center p-6 border border-slate-700 shadow-inner shrink-0 relative">
                    <HardDrive className="w-20 h-20 text-purple-400 animate-pulse" />
                    <div className="absolute bottom-2 inset-x-0 text-center">
                      <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">
                        64GB DUAL USB-C / SD
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-800">
                      Air-Gapped Offline Media Vault
                    </span>
                    <h3 className="text-xl font-bold font-serif text-white">
                      64GB Dual USB-C Metal Key & Micro-SD Vault
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      The ultimate sovereign physical archive. Contains every high-resolution format (4K video masterclass, 24-bit lossless FLAC audiobook, 600 DPI handwritten notebook scans, and the complete musical soundtrack).
                    </p>
                    <div className="text-xs text-purple-300 font-medium">
                      Connector: {book.pendriveSdDetails?.connector}
                    </div>
                  </div>
                </div>

                {/* Preloaded Content Tree */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                    Preloaded Vault Directory (64GB High-Speed Flash):
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {(book.pendriveSdDetails?.preloadedContents || [
                      '4K Ultra-HD Video Masterclass (.mp4)',
                      '24-Bit / 96kHz Lossless Studio FLAC Audiobook',
                      '600 DPI High-Res Scanned Author Handwritten Notebooks',
                      'Original Book Musical Soundtrack Album (FLAC & MP3)',
                      'DRM-Free EPUB3 and Print-Quality PDFs'
                    ]).map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 8. MUSICAL ALBUM SOUNDTRACK MODE                         */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'musical_album' && (
            <div className="flex-1 bg-gradient-to-b from-slate-900 to-black text-white p-6 sm:p-8 flex flex-col justify-center items-center space-y-6 overflow-y-auto">
              <div className="max-w-3xl w-full flex flex-col md:flex-row items-center gap-8">
                
                {/* Rotating Vinyl Turntable Graphic */}
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-slate-950 border-4 border-stone-800 shadow-2xl flex items-center justify-center overflow-hidden shrink-0 group">
                  <div className={`w-full h-full rounded-full flex items-center justify-center ${isPlayingAlbum ? 'animate-spin' : ''}`} style={{ animationDuration: '8s' }}>
                    <Disc className="w-40 h-40 text-stone-600 opacity-60" />
                    <div className="absolute w-20 h-20 rounded-full overflow-hidden border-2 border-stone-400">
                      <img
                        src={book.musicalAlbumSample?.coverUrl || book.coverImage}
                        alt="Album Cover"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                {/* Track Details */}
                <div className="space-y-3 flex-1 text-center md:text-left">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Original Book Soundtrack & Ambient Score
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-white">
                    {book.musicalAlbumSample?.albumTitle || 'Original Book Soundtrack'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Composed by <strong className="text-emerald-400">{book.musicalAlbumSample?.composer}</strong>
                  </p>

                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-xs space-y-1">
                    <div className="font-bold text-amber-400">
                      Track {currentTrack.trackNumber}: {currentTrack.title}
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {currentTrack.description}
                    </div>
                  </div>

                  {/* Album Player Controls */}
                  <div className="flex items-center justify-center md:justify-start gap-4 pt-1">
                    <button
                      onClick={() => setIsPlayingAlbum(!isPlayingAlbum)}
                      className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-full text-xs flex items-center gap-2 shadow-lg transition cursor-pointer"
                    >
                      {isPlayingAlbum ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                      <span>{isPlayingAlbum ? 'Pause Score' : 'Play Soundtrack'}</span>
                    </button>
                    <span className="text-xs font-mono text-slate-400">
                      {formatTime(albumTrackProgress)} / {currentTrack.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Album Tracklist Selection */}
              <div className="max-w-3xl w-full border-t border-slate-800 pt-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Select Album Track to Stream:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {albumTracks.map((tr, idx) => (
                    <button
                      key={tr.id}
                      onClick={() => {
                        setCurrentTrackIdx(idx);
                        setIsPlayingAlbum(true);
                      }}
                      className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between text-xs cursor-pointer ${
                        currentTrackIdx === idx
                          ? 'bg-emerald-950/60 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      <div className="truncate">
                        <span className="font-bold mr-2 text-emerald-400">{tr.trackNumber}.</span>
                        <span>{tr.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">{tr.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 9. SILK OR COTTON MATERIAL WOVEN HEIRLOOM EDITION         */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'silk_cotton' && (
            <div className="flex-1 bg-amber-950/20 p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md border border-amber-200 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  <div className="w-48 h-64 bg-gradient-to-br from-amber-900 to-stone-900 rounded-lg shadow-xl overflow-hidden shrink-0 border-4 border-amber-700/60 relative p-3 flex flex-col justify-between text-white">
                    <div className="text-[10px] uppercase font-mono tracking-widest text-amber-300 font-bold">
                      Artisanal Weave
                    </div>
                    {/* Woven Fabric Texture Pattern */}
                    <div className="h-32 rounded border border-amber-500/40 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:8px_8px] flex items-center justify-center p-3 text-center">
                      <span className="font-serif italic text-amber-100 text-sm drop-shadow">
                        Pure Mulberry Silk & Long-Staple Cotton
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider">
                        Hand-Bound Heirloom
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1 w-fit">
                      <Sparkles className="w-3 h-3 text-amber-700" />
                      <span>Natural Textile Art Edition</span>
                    </span>
                    <h3 className="text-xl font-bold font-serif text-slate-900">
                      {book.silkCottonDetails?.editionName || 'Artisanal Mulberry Silk & Organic Cotton Woven Edition'}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Woven on heritage Jacquard looms using pure Japanese mulberry silk warp and unbleached Egyptian long-staple cotton weft. Each copy is hand-bound by master bookbinders and arrives in a linen-lined archival protective slipcase.
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-700 pt-1">
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Textile Blend:</span>
                        <span className="font-semibold text-slate-900">{book.silkCottonDetails?.materialBlend || '70% Mulberry Silk / 30% Egyptian Cotton'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Thread Density:</span>
                        <span className="font-semibold text-slate-900">{book.silkCottonDetails?.threadCount || '600 Threads per Inch'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Weaving Atelier:</span>
                        <span className="font-semibold text-slate-900">{book.silkCottonDetails?.weavingAtelier || 'Heritage Kyoto & Como Guilds'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Archival Life:</span>
                        <span className="font-semibold text-amber-800 font-bold">{book.silkCottonDetails?.archivalDurability || '300+ Years Acid-Free Certification'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-100">
                        <span className="text-slate-500 font-medium">Delivery & Slipcase:</span>
                        <span className="font-semibold text-emerald-700">{book.silkCottonDetails?.shippingEstimate || 'White-Glove Insured Delivery (3-5 Days)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-900">
                    <Sparkles className="w-4 h-4 text-amber-700" />
                    <span>Includes Dual Cloud Access & High-Resolution Digital Plate Scans</span>
                  </div>
                  <p className="text-amber-800 text-[11px]">
                    Every silk/cotton purchase instantly activates permanent lifetime access to the eBook, Audiobook, and 4K Video dimensions in your Knowledge Centa cloud library.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* -------------------------------------------------------- */}
          {/* 10. DEDICATED DIGITAL DEVICE (CARRIES ALL 9 DIMENSIONS)   */}
          {/* -------------------------------------------------------- */}
          {activeFormat === 'digital_device' && (
            <div className="flex-1 bg-slate-950 text-white p-6 sm:p-10 overflow-y-auto space-y-6">
              <div className="max-w-3xl mx-auto bg-slate-900 p-6 sm:p-8 rounded-xl shadow-2xl border border-indigo-900/60 space-y-6">
                <div className="flex flex-col sm:flex-row gap-6 items-center">
                  {/* Dedicated Tablet Device Bezel Visual */}
                  <div className="w-52 h-72 bg-slate-950 rounded-2xl p-3 border-2 border-indigo-500/50 shadow-2xl flex flex-col justify-between shrink-0 relative group">
                    <div className="flex items-center justify-between text-[9px] font-mono text-indigo-300 border-b border-slate-800 pb-1">
                      <span>KNOWLEDGE CENTA OS</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        100%
                      </span>
                    </div>

                    {/* Simulated E-Ink Display */}
                    <div className="bg-[#f4efe6] text-slate-900 p-3 rounded-lg flex-1 my-1.5 flex flex-col justify-between shadow-inner overflow-hidden font-serif">
                      <div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          Dedicated Sovereign Device
                        </div>
                        <div className="text-xs font-bold text-slate-950 mt-1 line-clamp-2">
                          {book.title}
                        </div>
                        <div className="text-[10px] text-slate-600 italic">
                          {book.author}
                        </div>
                      </div>

                      <div className="border-t border-stone-300 pt-1 text-[9px] font-mono text-stone-700 space-y-0.5">
                        <div className="font-bold text-indigo-950">
                          ALL 9 DIMENSIONS EMBEDDED
                        </div>
                        <div className="text-slate-500">
                          Zero-distraction dedicated hardware
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                      <span>7.8" 300 PPI Carta</span>
                      <span>USB-C / 32GB</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center gap-1">
                        <Tablet className="w-3 h-3 text-indigo-400" />
                        <span>Dedicated Hardware Carrier</span>
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950">
                        Carries Remaining 9 Dimensions
                      </span>
                    </div>

                    <h3 className="text-xl font-bold font-serif text-white">
                      {book.digitalDeviceDetails?.deviceName || 'Knowledge Centa Dedicated Sovereign Literary Device'}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {book.digitalDeviceDetails?.specialFeature || 'Hardware custom engineered exclusively for this title. Contains no social media, web browsers, or notifications. Ships with all 9 other dimensions preloaded and permanently playable offline.'}
                    </p>

                    <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Display:</span>
                        <span className="font-semibold text-white">{book.digitalDeviceDetails?.screenSpecs || '7.8" E-Ink Carta 1200 (300 PPI, Warm/Cool Glow)'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Battery Life:</span>
                        <span className="font-semibold text-emerald-400">{book.digitalDeviceDetails?.batteryLife || '8 Weeks on a Single Charge'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Storage & Audio:</span>
                        <span className="font-semibold text-white">{book.digitalDeviceDetails?.storageCapacity || '32GB Ultra-Fast SSD + Studio DAC & 3.5mm/BT'}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800">
                        <span className="text-slate-400">Shipping:</span>
                        <span className="font-semibold text-amber-300">{book.digitalDeviceDetails?.shippingEstimate || 'Ships in custom laser-engraved bamboo box (2-4 days)'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* The 9 Dimensions Preloaded Inside Callout */}
                <div className="border-t border-slate-800 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>All 9 Dimensions Embedded in This Device:</span>
                    </h4>
                    <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                      Zero Setup Required
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {(book.digitalDeviceDetails?.dimensionsCarried || [
                      '1. Full eBook (EPUB3)',
                      '2. Studio Audiobook (Narrated)',
                      '3. 4K Video Masterclass',
                      '4. Raw Handwritten Manuscript',
                      '5. Clothbound Hardcover Digital Plates',
                      '6. Paper Cover Edition Layout',
                      '7. 64GB Flash Drive Vault Clone',
                      '8. Original Musical Soundtrack Score',
                      '9. Woven Silk & Cotton Archival Monograph'
                    ]).map((dim, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded bg-slate-800/80 border border-slate-700/80 text-slate-200">
                        <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="text-[11px] truncate">{dim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ======================================================== */}
        {/* MODAL FOOTER: "Unlock Full Version" CTA Button           */}
        {/* ======================================================== */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-700 flex items-center gap-2">
            <span className="font-bold text-slate-900">{formatData.name}:</span>
            <span className="text-base font-extrabold text-slate-950">
              ${formatData.price.toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
              Instant Cloud Delivery & Sync
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isPurchased ? (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                ✓ Already in your Library
              </span>
            ) : (
              <>
                <button
                  id="modal-add-cart-btn"
                  onClick={() => {
                    addToCart(book, activeFormat);
                    closeLookInside();
                  }}
                  className="flex-1 sm:flex-initial py-2 px-4 bg-white hover:bg-slate-50 text-slate-900 rounded-full font-semibold text-xs border border-slate-300 shadow-sm transition cursor-pointer"
                >
                  Add to Cart
                </button>

                <button
                  id="modal-unlock-cta-btn"
                  onClick={() => {
                    buyNow(book, activeFormat);
                    closeLookInside();
                  }}
                  className="flex-1 sm:flex-initial py-2 px-6 bg-[#FFA41C] hover:bg-[#FA8900] text-slate-950 rounded-full font-bold text-xs tracking-wide shadow-md border border-[#FF8F00] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Unlock Full {formatData.name.split(' ')[0]}</span>
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
