import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Clock, 
  ListMusic, 
  Sparkles, 
  Check, 
  Save, 
  ChevronRight,
  Headphones,
  Sliders
} from 'lucide-react';
import { Book, FormatType } from '../types';
import { useStore } from '../context/StoreContext';

interface AudioMediaControlsProps {
  book: Book;
  format: FormatType;
}

export const AudioMediaControls: React.FC<AudioMediaControlsProps> = ({ book, format }) => {
  const { 
    saveAudioBookmark, 
    audioBookmarks, 
    showNotification,
    soundService
  } = useStore() as any;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180); // 3 minutes for sample chapter
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showChapterDrawer, setShowChapterDrawer] = useState(false);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [bookmarkColor, setBookmarkColor] = useState('amber');
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerSecondsRemaining, setSleepTimerSecondsRemaining] = useState<number | null>(null);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);

  // Audio chapter content
  const chapterContent = book.chapterOnePreview?.content || [
    'Knowledge transcends the boundaries of traditional parchment.',
    'Every word resonated across the ancient corridors of the academy.',
    'As the reader listens closely, the narrative unfolds across multiple sensory dimensions.',
    'In this state of focused absorption, mastery becomes a natural progression of thought.',
    'Turn the page in your mind, and let the voice guide your contemplation.'
  ];

  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timerIntervalRef = useRef<any>(null);
  const sleepTimerIntervalRef = useRef<any>(null);

  // Chapter playlist
  const chapters = book.audioSample?.chapterList && book.audioSample.chapterList.length > 0
    ? book.audioSample.chapterList
    : [
        { name: 'Prologue: The Sovereign Horizon', duration: '03:15' },
        { name: 'Chapter 1: The First Dimension Unveiled', duration: '05:42' },
        { name: 'Chapter 2: Resonance and Soundscapes', duration: '04:18' },
        { name: 'Chapter 3: The Archival Manuscripts', duration: '06:30' }
      ];

  // Speech synthesis narration engine
  const startNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();
    const fullText = chapterContent.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = playbackRate;
    utterance.volume = isMuted ? 0 : volume;
    utterance.pitch = 1.0;

    // Pick a natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Premium') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Samantha'))) || voices[0];
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.onboundary = (event) => {
      if (event.name === 'sentence' || event.name === 'word') {
        const charIdx = event.charIndex;
        let cumulative = 0;
        for (let i = 0; i < chapterContent.length; i++) {
          cumulative += chapterContent[i].length + 1;
          if (charIdx <= cumulative) {
            setActiveSentenceIndex(i);
            break;
          }
        }
      }
    };

    utterance.onend = () => {
      setIsPlaying(false);
      if (activeChapterIndex < chapters.length - 1) {
        setActiveChapterIndex(prev => prev + 1);
        setCurrentTime(0);
      }
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const pauseNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    setIsPlaying(false);
  };

  const resumeNarration = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else {
        startNarration();
      }
    }
    setIsPlaying(true);
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (isPlaying) {
      pauseNarration();
    } else {
      resumeNarration();
    }
  };

  // Skip time
  const handleSkip = (seconds: number) => {
    const next = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(next);
    // Recalculate sentence index roughly
    const ratio = next / duration;
    const sIndex = Math.min(chapterContent.length - 1, Math.floor(ratio * chapterContent.length));
    setActiveSentenceIndex(sIndex);
  };

  // Seek slider
  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime);
    const ratio = newTime / duration;
    const sIndex = Math.min(chapterContent.length - 1, Math.floor(ratio * chapterContent.length));
    setActiveSentenceIndex(sIndex);
  };

  // Speed change
  const handleSpeedChange = (rate: number) => {
    setPlaybackRate(rate);
    if (speechUtteranceRef.current && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const wasPlaying = isPlaying;
      window.speechSynthesis.cancel();
      if (wasPlaying) {
        setTimeout(startNarration, 100);
      }
    }
  };

  // Sleep timer setup
  const setSleepTimer = (mins: number | null) => {
    setSleepTimerMinutes(mins);
    if (mins === null) {
      setSleepTimerSecondsRemaining(null);
      if (sleepTimerIntervalRef.current) clearInterval(sleepTimerIntervalRef.current);
      return;
    }
    setSleepTimerSecondsRemaining(mins * 60);
  };

  // Sleep timer countdown
  useEffect(() => {
    if (sleepTimerSecondsRemaining === null) return;
    if (sleepTimerSecondsRemaining <= 0) {
      pauseNarration();
      setSleepTimerMinutes(null);
      setSleepTimerSecondsRemaining(null);
      if (showNotification) showNotification('🌙 Sleep timer finished: Audio playback paused.');
      return;
    }

    sleepTimerIntervalRef.current = setInterval(() => {
      setSleepTimerSecondsRemaining(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(sleepTimerIntervalRef.current);
  }, [sleepTimerSecondsRemaining]);

  // Track timer increment when playing
  useEffect(() => {
    if (isPlaying) {
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isPlaying, duration, playbackRate]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Bookmark save
  const handleSaveBookmark = () => {
    if (saveAudioBookmark) {
      saveAudioBookmark({
        bookId: book.id,
        bookTitle: book.title,
        bookCoverImage: book.coverImage,
        author: book.author,
        timestampSeconds: currentTime,
        formattedTimestamp: formatTime(currentTime),
        chapterTitle: chapters[activeChapterIndex]?.name || 'Chapter 1',
        note: bookmarkNote.trim() || `Bookmark at ${formatTime(currentTime)}`,
        colorTag: bookmarkColor
      });
    }
    setShowBookmarkModal(false);
    setBookmarkNote('');
  };

  return (
    <div id="audio-media-player-container" className="bg-stone-900 text-white rounded-2xl p-4 sm:p-6 border border-amber-500/30 shadow-2xl space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-md shrink-0">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-full h-full object-cover rounded-[10px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wide flex items-center gap-1">
                <Headphones className="w-3 h-3" />
                {format === 'musical_album' ? 'Musical Album (FLAC)' : 'Audiobook (320kbps MP3)'}
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Hi-Res In-Browser Streaming
              </span>
            </div>
            <h3 className="font-serif font-bold text-base text-stone-100 line-clamp-1">
              {book.title}
            </h3>
            <p className="text-xs text-stone-400">
              Narrated by {book.audioSample?.narrator || book.author} • Chapter: {chapters[activeChapterIndex]?.name}
            </p>
          </div>
        </div>

        {/* Quick Toolbar: Playlist & Bookmark & Sleep */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            id="audio-chapter-playlist-btn"
            onClick={() => setShowChapterDrawer(!showChapterDrawer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
              showChapterDrawer 
                ? 'bg-amber-400 text-stone-950 border-amber-400' 
                : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-700'
            }`}
            title="Tracklist & Chapters"
          >
            <ListMusic className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chapters</span>
          </button>

          <button
            id="audio-create-bookmark-btn"
            onClick={() => setShowBookmarkModal(true)}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-300 border border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer hover:text-amber-300"
            title="Add timestamp bookmark"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Bookmark</span>
          </button>

          <div className="relative group">
            <button
              id="audio-sleep-timer-btn"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition cursor-pointer ${
                sleepTimerMinutes !== null
                  ? 'bg-indigo-600/40 text-indigo-300 border-indigo-400/50'
                  : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-700'
              }`}
              title="Sleep Timer"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>
                {sleepTimerSecondsRemaining !== null 
                  ? `${Math.ceil(sleepTimerSecondsRemaining / 60)}m` 
                  : 'Sleep'}
              </span>
            </button>
            <div className="absolute right-0 top-full mt-1.5 hidden group-hover:flex flex-col bg-stone-950 border border-stone-800 rounded-xl shadow-xl py-1 text-xs z-30 min-w-[120px]">
              <button onClick={() => setSleepTimer(null)} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-400">Off</button>
              <button onClick={() => setSleepTimer(15)} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-200">15 minutes</button>
              <button onClick={() => setSleepTimer(30)} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-200">30 minutes</button>
              <button onClick={() => setSleepTimer(45)} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-200">45 minutes</button>
              <button onClick={() => setSleepTimer(60)} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-200">60 minutes</button>
            </div>
          </div>
        </div>
      </div>

      {/* Synchronized Transcript Stage with Real-Time Highlighting */}
      <div className="bg-stone-950/80 rounded-xl p-4 border border-stone-800/80 space-y-2">
        <div className="flex items-center justify-between text-[11px] text-stone-400 border-b border-stone-800/60 pb-1.5">
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Synchronized Read-Along Karaoke Narration
          </span>
          <span className="text-stone-500">Live Browser SpeechSynthesis Engine</span>
        </div>
        <div className="space-y-2 max-h-36 overflow-y-auto pr-1 text-sm leading-relaxed">
          {chapterContent.map((sentence, idx) => (
            <p 
              key={idx}
              className={`transition-all duration-300 rounded px-2 py-1 ${
                idx === activeSentenceIndex && isPlaying
                  ? 'bg-amber-400/20 text-amber-200 font-medium border-l-2 border-amber-400'
                  : 'text-stone-400 hover:text-stone-300'
              }`}
            >
              {sentence}
            </p>
          ))}
        </div>
      </div>

      {/* Waveform Visualization Animation */}
      <div className="flex items-center justify-center gap-1 h-8 px-4">
        {Array.from({ length: 36 }).map((_, i) => {
          const height = isPlaying 
            ? Math.max(6, Math.sin((i + currentTime * 3) * 0.4) * 26 + 10)
            : 6;
          return (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-150 ${
                isPlaying ? 'bg-amber-400/90' : 'bg-stone-700'
              }`}
              style={{ height: `${height}px` }}
            />
          );
        })}
      </div>

      {/* Scrubber Progress Bar */}
      <div className="space-y-1">
        <div className="relative group">
          <input
            id="audio-timeline-scrubber"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
        <div className="flex justify-between text-[11px] font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-stone-500">
            Remaining: -{formatTime(Math.max(0, duration - currentTime))}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Master Playback Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        {/* Playback Rate / Speed Selector */}
        <div className="flex items-center gap-1.5 text-xs text-stone-300">
          <Sliders className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] text-stone-400 mr-1">Speed:</span>
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition cursor-pointer ${
                playbackRate === rate
                  ? 'bg-amber-400 text-stone-950 shadow-xs'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>

        {/* Primary Buttons: Rewind 15s, Play/Pause, Forward 15s */}
        <div className="flex items-center justify-center gap-4">
          <button
            id="audio-rewind-15-btn"
            onClick={() => handleSkip(-15)}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer hover:text-amber-300 active:scale-95"
            title="Rewind 15 seconds"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            id="audio-play-pause-btn"
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold flex items-center justify-center shadow-lg transition transform active:scale-90 cursor-pointer"
            title={isPlaying ? 'Pause Audio' : 'Play Audio'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-stone-950" />
            ) : (
              <Play className="w-6 h-6 fill-stone-950 ml-0.5" />
            )}
          </button>

          <button
            id="audio-forward-15-btn"
            onClick={() => handleSkip(15)}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer hover:text-amber-300 active:scale-95"
            title="Fast forward 15 seconds"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* Volume & Mute Control */}
        <div className="flex items-center gap-2 text-stone-300 min-w-[120px] justify-end">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-400 hover:text-amber-400 transition cursor-pointer"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-red-400" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              setIsMuted(false);
            }}
            className="w-20 h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Chapters Drawer if opened */}
      {showChapterDrawer && (
        <div className="mt-4 p-3 bg-stone-950 rounded-xl border border-stone-800 divide-y divide-stone-850 animate-in fade-in">
          <div className="text-xs font-bold text-amber-400 pb-2 flex items-center justify-between">
            <span>Audiobook Tracklist & Chapters</span>
            <span className="text-[10px] text-stone-400">{chapters.length} tracks available</span>
          </div>
          <div className="divide-y divide-stone-850 max-h-48 overflow-y-auto">
            {chapters.map((ch, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveChapterIndex(idx);
                  setCurrentTime(0);
                  if (isPlaying) {
                    pauseNarration();
                    setTimeout(startNarration, 100);
                  }
                }}
                className={`w-full flex items-center justify-between py-2 px-2 text-left text-xs transition cursor-pointer hover:bg-stone-900 rounded ${
                  idx === activeChapterIndex ? 'bg-amber-400/10 text-amber-300 font-bold' : 'text-stone-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-stone-500 w-4">{idx + 1}.</span>
                  <span>{ch.name}</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">{ch.duration}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bookmark Modal */}
      {showBookmarkModal && (
        <div className="p-4 bg-stone-950 rounded-xl border border-amber-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              Create Audio Bookmark at {formatTime(currentTime)}
            </span>
            <button 
              onClick={() => setShowBookmarkModal(false)}
              className="text-stone-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>
          <input
            type="text"
            placeholder="Add note or study quote for this timestamp..."
            value={bookmarkNote}
            onChange={(e) => setBookmarkNote(e.target.value)}
            className="w-full bg-stone-900 border border-stone-700 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 focus:border-amber-400 outline-none"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-stone-400">Tag:</span>
              {['amber', 'emerald', 'blue', 'purple', 'rose'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBookmarkColor(c)}
                  className={`w-4 h-4 rounded-full border ${
                    c === 'amber' ? 'bg-amber-400' :
                    c === 'emerald' ? 'bg-emerald-400' :
                    c === 'blue' ? 'bg-blue-400' :
                    c === 'purple' ? 'bg-purple-400' : 'bg-rose-400'
                  } ${bookmarkColor === c ? 'ring-2 ring-white' : 'border-stone-600'}`}
                />
              ))}
            </div>
            <button
              onClick={handleSaveBookmark}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Bookmark</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
