import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Maximize, 
  Minimize, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Subtitles, 
  Settings, 
  Film, 
  Tv, 
  Sparkles, 
  Sliders, 
  Check, 
  PictureInPicture,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Book, FormatType } from '../types';

interface VideoMediaControlsProps {
  book: Book;
  format: FormatType;
}

export const VideoMediaControls: React.FC<VideoMediaControlsProps> = ({ book }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(240); // 4 minutes video book chapter
  const [resolution, setResolution] = useState<'4K' | '1080p' | '720p'>('4K');
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsLang, setCaptionsLang] = useState<'en' | 'es' | 'fr' | 'de' | 'off'>('en');
  const [audioTrack, setAudioTrack] = useState<'master' | 'commentary' | 'ambient'>('master');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<any>(null);

  const chapters = [
    { title: 'Act I: The Sovereign Awakening', time: 0, previewNote: 'Opening panoramic shot and narration introduction' },
    { title: 'Act II: The Multi-Sensory Horizon', time: 60, previewNote: 'Visual breakdown of the 10 dimensional publishing model' },
    { title: 'Act III: The Archival Codex', time: 135, previewNote: 'Fountain pen ink scans and high-resolution calligraphy' },
    { title: 'Act IV: The Synthesized Epilogue', time: 195, previewNote: 'Final synthesis and reader contemplation' }
  ];

  // Subtitles content
  const subtitlesMap: Record<string, string[]> = {
    en: [
      'In an era where knowledge is scattered across fragmented mediums...',
      'We bring forth the unified multi-dimensional literary experience.',
      'Every sentence is visually illuminated with cinematic depth.',
      'From parchment to cinema, narrative authority is reclaimed.',
      'Breathe in the prose; let the visual journey expand your comprehension.'
    ],
    es: [
      'En una era donde el conocimiento se dispersa en medios fragmentados...',
      'Presentamos la experiencia literaria multidimensional unificada.',
      'Cada frase se ilumina visualmente con profundidad cinematográfica.',
      'Del pergamino al cine, se recupera la autoridad narrativa.',
      'Respira la prosa; deja que el viaje visual expanda tu comprensión.'
    ],
    fr: [
      'À une époque où le savoir est dispersé sur des supports fragmentés...',
      'Nous inaugurons l’expérience littéraire multidimensionnelle unifiée.',
      'Chaque phrase est visuellement illuminée avec une profondeur cinématographique.',
      'Du parchemin au cinéma, l’autorité narrative est restaurée.',
      'Respirez la prose; laissez ce voyage visuel élargir votre esprit.'
    ],
    de: [
      'In einer Zeit, in der Wissen über fragmentierte Medien verstreut ist...',
      'Bringen wir die vereinte mehrdimensionale literarische Erfahrung hervor.',
      'Jeder Satz wird mit filmischer Tiefe visuell erleuchtet.',
      'Vom Pergament zum Kino wird die narrative Autorität zurückgewonnen.',
      'Atmen Sie die Prosa ein; lassen Sie die visuelle Reise Ihren Geist erweitern.'
    ]
  };

  const currentSubtitleIndex = Math.min(
    4,
    Math.floor((currentTime / duration) * 5)
  );

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSkip = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const togglePip = async () => {
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture?.().catch(() => {});
    }
  };

  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackRate);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, duration, playbackRate]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      ref={videoContainerRef} 
      id="video-media-player-container"
      className="bg-black text-white rounded-2xl overflow-hidden border border-purple-500/30 shadow-2xl relative select-none"
    >
      {/* 4K Cinema Screen Canvas */}
      <div className="relative aspect-video w-full bg-gradient-to-br from-stone-950 via-purple-950/40 to-stone-900 flex items-center justify-center overflow-hidden">
        {/* Atmospheric Dynamic Background with Ken Burns Motion Effect */}
        <div 
          className={`absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] opacity-40 mix-blend-screen filter saturate-150 ${
            isPlaying ? 'scale-110 translate-y-1' : 'scale-100'
          }`}
          style={{ backgroundImage: `url(${book.coverImage})` }}
        />

        {/* Ambient Film Grain & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none" />

        {/* 4K HDR Watermark Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <span className="px-2.5 py-1 bg-purple-600/90 text-white font-extrabold text-[10px] rounded-md tracking-wider flex items-center gap-1 shadow-md border border-purple-400/40">
            <Film className="w-3 h-3 text-purple-200" />
            <span>4K CINEMA EDITION</span>
          </span>
          <span className="px-2 py-0.5 bg-black/60 backdrop-blur-xs text-amber-300 font-mono text-[10px] rounded border border-white/10">
            {resolution} HDR • 60FPS
          </span>
        </div>

        {/* Central Overlay Cinematic Chapter Display */}
        <div className="relative z-10 text-center max-w-2xl px-6 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900/80 border border-purple-500/30 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{chapters[activeChapterIndex]?.title || 'Act I: Introduction'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-wide drop-shadow-md">
            {book.title}
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto line-clamp-2 leading-relaxed font-sans drop-shadow-sm">
            {chapters[activeChapterIndex]?.previewNote || book.subtitle}
          </p>

          {/* Central Play/Pause Action Ring */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="mt-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 hover:bg-purple-500 text-white shadow-2xl transition transform hover:scale-105 active:scale-95 cursor-pointer border-2 border-purple-300/40"
              title="Play 4K Video Book"
            >
              <Play className="w-8 h-8 fill-white ml-1" />
            </button>
          )}
        </div>

        {/* Subtitles Overlay Bar (Custom Cinema Captions) */}
        {captionsLang !== 'off' && subtitlesMap[captionsLang] && (
          <div className="absolute bottom-16 inset-x-8 z-20 flex justify-center text-center pointer-events-none">
            <div className="px-4 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-yellow-200 text-sm sm:text-base font-medium drop-shadow-lg max-w-2xl">
              {subtitlesMap[captionsLang][currentSubtitleIndex]}
            </div>
          </div>
        )}
      </div>

      {/* Video Scrubber & Playhead */}
      <div className="px-4 pt-3 pb-1 bg-stone-950 border-t border-stone-800 space-y-1">
        <div className="relative group">
          <input
            id="video-timeline-scrubber"
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={(e) => setCurrentTime(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
          {/* Chapter Markers along scrubber */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 flex justify-between pointer-events-none px-1">
            {chapters.map((ch, idx) => (
              <div 
                key={idx} 
                className="w-1.5 h-1.5 rounded-full bg-amber-400"
                style={{ left: `${(ch.time / duration) * 100}%` }}
                title={ch.title}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-stone-400">
          <span>{formatTime(currentTime)}</span>
          <span className="text-stone-500 text-[10px] uppercase font-sans">
            {chapters[activeChapterIndex]?.title}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Video Control Bar */}
      <div className="px-4 pb-3 pt-1 bg-stone-950 flex flex-wrap items-center justify-between gap-3 text-stone-300 text-xs">
        {/* Left: Play/Pause, Rewind, Forward */}
        <div className="flex items-center gap-3">
          <button
            id="video-play-toggle-btn"
            onClick={togglePlay}
            className="p-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>

          <button
            onClick={() => handleSkip(-15)}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
            title="Rewind 15s"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => handleSkip(15)}
            className="p-1.5 rounded hover:bg-stone-800 text-stone-400 hover:text-white transition cursor-pointer"
            title="Forward 15s"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          {/* Volume */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-stone-800">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-stone-400 hover:text-purple-400 transition cursor-pointer"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
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
              className="w-16 h-1 bg-stone-800 rounded appearance-none cursor-pointer accent-purple-500"
            />
          </div>
        </div>

        {/* Right: Subtitles, Resolution, Speed, Fullscreen */}
        <div className="flex items-center gap-2 relative">
          {/* Subtitles (CC) */}
          <div className="relative group">
            <button
              id="video-cc-btn"
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 cursor-pointer ${
                captionsLang !== 'off' 
                  ? 'bg-purple-600/30 text-purple-300 border-purple-500/50 font-bold' 
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
              title="Closed Captions / Subtitles"
            >
              <Subtitles className="w-3.5 h-3.5" />
              <span className="uppercase text-[10px]">{captionsLang}</span>
            </button>
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 text-xs z-30 min-w-[130px]">
              <div className="px-3 py-1 text-[10px] text-stone-400 font-bold uppercase">Subtitles</div>
              <button onClick={() => setCaptionsLang('en')} className="px-3 py-1 text-left hover:bg-stone-800 text-white">English</button>
              <button onClick={() => setCaptionsLang('es')} className="px-3 py-1 text-left hover:bg-stone-800 text-white">Español</button>
              <button onClick={() => setCaptionsLang('fr')} className="px-3 py-1 text-left hover:bg-stone-800 text-white">Français</button>
              <button onClick={() => setCaptionsLang('de')} className="px-3 py-1 text-left hover:bg-stone-800 text-white">Deutsch</button>
              <button onClick={() => setCaptionsLang('off')} className="px-3 py-1 text-left hover:bg-stone-800 text-stone-400">Off</button>
            </div>
          </div>

          {/* Resolution Selector */}
          <div className="relative group">
            <button
              id="video-resolution-btn"
              className="px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-purple-300 font-bold text-[11px] cursor-pointer hover:bg-stone-750"
              title="Stream Quality / Resolution"
            >
              {resolution}
            </button>
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 text-xs z-30 min-w-[140px]">
              <div className="px-3 py-1 text-[10px] text-stone-400 font-bold uppercase">Video Quality</div>
              <button onClick={() => setResolution('4K')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-purple-300 font-bold">4K Ultra HD (2160p)</button>
              <button onClick={() => setResolution('1080p')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-white">1080p Full HD</button>
              <button onClick={() => setResolution('720p')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-stone-300">720p High Def</button>
            </div>
          </div>

          {/* Audio Commentary Selector */}
          <div className="relative group hidden sm:block">
            <button
              className="px-2 py-1 rounded-lg bg-stone-800 border border-stone-700 text-stone-300 text-[11px] cursor-pointer"
              title="Audio Channel"
            >
              {audioTrack === 'master' ? 'Master' : audioTrack === 'commentary' ? 'Commentary' : 'Score'}
            </button>
            <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:flex flex-col bg-stone-900 border border-stone-800 rounded-xl shadow-xl py-1 text-xs z-30 min-w-[150px]">
              <div className="px-3 py-1 text-[10px] text-stone-400 font-bold uppercase">Audio Track</div>
              <button onClick={() => setAudioTrack('master')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-white">Studio Master</button>
              <button onClick={() => setAudioTrack('commentary')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-amber-300">Author Commentary</button>
              <button onClick={() => setAudioTrack('ambient')} className="px-3 py-1.5 text-left hover:bg-stone-800 text-emerald-300">Ambient Score Only</button>
            </div>
          </div>

          {/* Speed */}
          <button
            onClick={() => {
              const rates = [0.75, 1.0, 1.25, 1.5, 2.0];
              const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
              setPlaybackRate(rates[nextIdx]);
            }}
            className="px-2 py-1 rounded bg-stone-800 text-stone-300 hover:text-white font-mono text-[11px] cursor-pointer"
            title="Playback Speed"
          >
            {playbackRate}x
          </button>

          {/* Fullscreen */}
          <button
            id="video-fullscreen-toggle-btn"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
