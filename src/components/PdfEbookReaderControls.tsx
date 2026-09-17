import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Search, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  Sliders, 
  Type, 
  Menu, 
  X,
  FileText,
  RotateCcw,
  Sparkles,
  AlignLeft,
  Columns
} from 'lucide-react';
import { Book, FormatType } from '../types';
import { soundService } from '../services/soundService';

interface PdfEbookReaderControlsProps {
  book: Book;
  format: FormatType;
}

export const PdfEbookReaderControls: React.FC<PdfEbookReaderControlsProps> = ({ book, format }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.max(12, Math.min(48, Math.floor((book.pages || 240) / 10))));
  const [zoomLevel, setZoomLevel] = useState(100);
  const [spreadMode, setSpreadMode] = useState<'single' | 'dual'>('single');
  const [colorTheme, setColorTheme] = useState<'parchment' | 'white' | 'slate' | 'oled'>('parchment');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [fontSize, setFontSize] = useState(18);
  const [lineHeight, setLineHeight] = useState(1.7);
  const [showToc, setShowToc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMatchesCount, setSearchMatchesCount] = useState(0);
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [readingSentenceIndex, setReadingSentenceIndex] = useState<number | null>(null);

  const readerContainerRef = useRef<HTMLDivElement>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Chapter paragraphs from book data
  const rawParagraphs = book.chapterOnePreview?.content || [
    'The dawn broke over the horizon with the crisp clarity of aged vellum.',
    'Throughout history, civilizations preserved their deepest epiphanies through indelible marks.',
    'When knowledge is presented across multiple sensory dimensions, comprehension accelerates.',
    'Every page is an invitation to explore deeper layers of consciousness and sovereign mastery.',
    'The author penned these thoughts with archival fountain pen ink on pure cotton rag paper.'
  ];

  // Generate synthetic page contents from the book text
  const pagesData = Array.from({ length: totalPages }).map((_, i) => {
    const pageNum = i + 1;
    const startIndex = (i * 2) % rawParagraphs.length;
    const textSnippet = [
      rawParagraphs[startIndex % rawParagraphs.length],
      rawParagraphs[(startIndex + 1) % rawParagraphs.length],
      `The study of dimensional literature reveals principles of resonance, retention, and clarity. As documented in Section ${pageNum}.${(i % 3) + 1}, cognitive absorption flourishes when print, audio, and visual representations harmonize seamlessly.`,
      `Consider the relationship between thought and expression: Every sentence structured herein has been calibrated for deep intellectual immersion.`
    ];
    return {
      pageNum,
      chapter: `Chapter ${Math.floor(i / 4) + 1}: ${book.title} (Part ${Math.floor(i / 4) + 1})`,
      content: textSnippet
    };
  });

  const activePageData = pagesData[currentPage - 1] || pagesData[0];
  const secondPageData = spreadMode === 'dual' && currentPage < totalPages ? pagesData[currentPage] : null;

  // Sound & Page flipping
  const flipToPage = (target: number) => {
    const safeTarget = Math.max(1, Math.min(totalPages, target));
    if (safeTarget !== currentPage) {
      soundService.playFlipSound();
      setCurrentPage(safeTarget);
      if (isReadingAloud) stopReadAloud();
    }
  };

  const nextPage = () => {
    const increment = spreadMode === 'dual' ? 2 : 1;
    flipToPage(currentPage + increment);
  };

  const prevPage = () => {
    const decrement = spreadMode === 'dual' ? 2 : 1;
    flipToPage(currentPage - decrement);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages, spreadMode]);

  // Read Aloud Text-to-Speech
  const startReadAloud = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const fullPageText = activePageData.content.join(' ');
    const utterance = new SpeechSynthesisUtterance(fullPageText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha'))) || voices[0];
    if (voice) utterance.voice = voice;

    utterance.onboundary = (event) => {
      if (event.name === 'sentence') {
        const charIdx = event.charIndex;
        let cumulative = 0;
        for (let i = 0; i < activePageData.content.length; i++) {
          cumulative += activePageData.content[i].length + 1;
          if (charIdx <= cumulative) {
            setReadingSentenceIndex(i);
            break;
          }
        }
      }
    };

    utterance.onend = () => {
      setIsReadingAloud(false);
      setReadingSentenceIndex(null);
      if (currentPage < totalPages) {
        nextPage();
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  const stopReadAloud = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsReadingAloud(false);
    setReadingSentenceIndex(null);
  };

  const toggleReadAloud = () => {
    if (isReadingAloud) {
      stopReadAloud();
    } else {
      startReadAloud();
    }
  };

  // Search match count
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchMatchesCount(0);
      return;
    }
    const q = searchQuery.toLowerCase();
    let count = 0;
    activePageData.content.forEach(p => {
      const matches = p.toLowerCase().split(q).length - 1;
      count += matches;
    });
    setSearchMatchesCount(count);
  }, [searchQuery, currentPage]);

  // Color theme styling variables
  const themeStyles = {
    parchment: {
      bg: 'bg-[#fcf7ec]',
      text: 'text-[#2a1c12]',
      pageBg: 'bg-[#faf3e3] border-amber-200/80 shadow-md',
      metaText: 'text-[#7a6048]',
      highlight: 'bg-amber-300 text-stone-950'
    },
    white: {
      bg: 'bg-slate-100',
      text: 'text-slate-900',
      pageBg: 'bg-white border-slate-200 shadow-sm',
      metaText: 'text-slate-500',
      highlight: 'bg-yellow-200 text-black'
    },
    slate: {
      bg: 'bg-slate-950',
      text: 'text-slate-100',
      pageBg: 'bg-slate-900 border-slate-800 shadow-xl',
      metaText: 'text-slate-400',
      highlight: 'bg-amber-400/30 text-amber-200'
    },
    oled: {
      bg: 'bg-black',
      text: 'text-stone-200',
      pageBg: 'bg-stone-950 border-stone-850 shadow-2xl',
      metaText: 'text-stone-500',
      highlight: 'bg-amber-500/20 text-amber-300'
    }
  }[colorTheme];

  const fontClass = fontFamily === 'serif' ? 'font-serif' : fontFamily === 'sans' ? 'font-sans' : 'font-mono';

  return (
    <div 
      ref={readerContainerRef}
      id="pdf-ebook-reader-container" 
      className={`rounded-2xl border border-slate-300 dark:border-stone-800 overflow-hidden shadow-2xl transition-colors ${themeStyles.bg}`}
    >
      {/* Reader Control Header Bar */}
      <div className="px-4 py-2.5 bg-stone-900 text-stone-200 text-xs border-b border-stone-800 flex flex-wrap items-center justify-between gap-3 select-none">
        {/* Left: Table of Contents Toggle & Title */}
        <div className="flex items-center gap-2.5">
          <button
            id="reader-toc-toggle-btn"
            onClick={() => setShowToc(!showToc)}
            className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
              showToc ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold' : 'bg-stone-800 text-stone-300 border-stone-700 hover:bg-stone-750'
            }`}
            title="Table of Contents"
          >
            <Menu className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Index</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-blue-900/60 border border-blue-400/30 text-blue-300 text-[10px] font-bold">
              {format === 'manuscript' ? 'ARCHIVAL PDF' : 'EPUB3 / PDF READER'}
            </span>
            <span className="font-semibold text-stone-100 truncate max-w-[180px] sm:max-w-[280px]">
              {book.title}
            </span>
          </div>
        </div>

        {/* Center: Search In Book */}
        <div className="relative hidden md:flex items-center">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 pointer-events-none" />
          <input
            id="reader-in-book-search-input"
            type="text"
            placeholder="Search inside page text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-stone-800 text-white rounded-lg pl-8 pr-16 py-1 text-xs border border-stone-700 focus:border-amber-400 outline-none w-48 lg:w-64"
          />
          {searchQuery && (
            <span className="absolute right-2 text-[10px] text-amber-300 font-mono">
              {searchMatchesCount} matches
            </span>
          )}
        </div>

        {/* Right: Read Aloud, Zoom, Themes, Font Size */}
        <div className="flex items-center gap-2">
          {/* Read Aloud Button */}
          <button
            id="reader-read-aloud-toggle-btn"
            onClick={toggleReadAloud}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
              isReadingAloud 
                ? 'bg-amber-400 text-stone-950 border-amber-400 font-bold animate-pulse' 
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-amber-300'
            }`}
            title={isReadingAloud ? 'Stop Read Aloud' : 'Read Aloud with Text-to-Speech'}
          >
            {isReadingAloud ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
            <span className="hidden sm:inline">{isReadingAloud ? 'Reading' : 'Read Aloud'}</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-stone-800 rounded-lg border border-stone-700 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
              className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono px-1 text-stone-300 min-w-[34px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
              className="p-1 hover:bg-stone-700 rounded text-stone-400 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spread Mode Toggle (Single vs Dual) */}
          <button
            onClick={() => setSpreadMode(spreadMode === 'single' ? 'dual' : 'single')}
            className={`p-1.5 rounded-lg border transition cursor-pointer hidden sm:flex items-center ${
              spreadMode === 'dual' ? 'bg-amber-400/20 text-amber-300 border-amber-400/50' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title={spreadMode === 'dual' ? 'Switch to Single Page' : 'Switch to Dual Page Spread'}
          >
            <Columns className="w-3.5 h-3.5" />
          </button>

          {/* Color Themes */}
          <div className="flex items-center gap-1 bg-stone-800 rounded-lg border border-stone-700 p-1">
            <button
              onClick={() => setColorTheme('parchment')}
              className={`w-3.5 h-3.5 rounded-full bg-[#fbf0d9] border border-amber-600 transition cursor-pointer ${colorTheme === 'parchment' ? 'ring-2 ring-amber-400' : ''}`}
              title="Parchment Sepia"
            />
            <button
              onClick={() => setColorTheme('white')}
              className={`w-3.5 h-3.5 rounded-full bg-white border border-slate-400 transition cursor-pointer ${colorTheme === 'white' ? 'ring-2 ring-blue-400' : ''}`}
              title="Crisp White"
            />
            <button
              onClick={() => setColorTheme('slate')}
              className={`w-3.5 h-3.5 rounded-full bg-slate-800 border border-slate-600 transition cursor-pointer ${colorTheme === 'slate' ? 'ring-2 ring-white' : ''}`}
              title="Night Slate"
            />
            <button
              onClick={() => setColorTheme('oled')}
              className={`w-3.5 h-3.5 rounded-full bg-black border border-stone-700 transition cursor-pointer ${colorTheme === 'oled' ? 'ring-2 ring-amber-400' : ''}`}
              title="OLED Black"
            />
          </div>

          {/* Typography Controls */}
          <div className="flex items-center bg-stone-800 rounded-lg border border-stone-700 p-0.5">
            <button
              onClick={() => setFontSize(prev => Math.max(14, prev - 1))}
              className="px-1.5 py-0.5 text-[11px] font-bold text-stone-300 hover:text-white cursor-pointer"
              title="Decrease Font Size"
            >
              A-
            </button>
            <span className="text-[10px] font-mono text-amber-300 px-1">{fontSize}px</span>
            <button
              onClick={() => setFontSize(prev => Math.min(26, prev + 1))}
              className="px-1.5 py-0.5 text-[11px] font-bold text-stone-300 hover:text-white cursor-pointer"
              title="Increase Font Size"
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Main Reader Stage with Optional TOC Drawer */}
      <div className="relative min-h-[540px] flex overflow-hidden">
        {/* Table of Contents Drawer */}
        {showToc && (
          <div className="w-64 bg-stone-900 text-stone-200 border-r border-stone-800 p-4 space-y-3 z-30 shrink-0 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-amber-400">
                Table of Contents
              </span>
              <button onClick={() => setShowToc(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1 max-h-[460px] overflow-y-auto pr-1">
              {Array.from({ length: Math.ceil(totalPages / 4) }).map((_, cIdx) => {
                const targetPage = cIdx * 4 + 1;
                return (
                  <button
                    key={cIdx}
                    onClick={() => {
                      flipToPage(targetPage);
                      setShowToc(false);
                    }}
                    className={`w-full text-left py-2 px-2.5 rounded text-xs transition cursor-pointer flex items-center justify-between ${
                      currentPage >= targetPage && currentPage < targetPage + 4
                        ? 'bg-amber-400/20 text-amber-300 font-bold'
                        : 'hover:bg-stone-800 text-stone-300'
                    }`}
                  >
                    <span>Chapter {cIdx + 1}: Discourse</span>
                    <span className="font-mono text-[10px] text-stone-500">p. {targetPage}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Book Reading Area with Quick-Lookup Dictionary Enabled */}
        <div 
          data-book-preview="true"
          className="flex-1 p-6 sm:p-10 flex items-center justify-center relative overflow-auto"
        >
          {/* Previous Page Floating Button */}
          <button
            id="reader-prev-page-arrow-btn"
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition cursor-pointer disabled:opacity-20 disabled:pointer-events-none shadow-lg z-20"
            title="Previous Page (ArrowLeft)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Book Pages Canvas Container */}
          <div 
            className={`grid gap-6 transition-all duration-300 ${
              spreadMode === 'dual' ? 'grid-cols-1 md:grid-cols-2 max-w-5xl' : 'grid-cols-1 max-w-2xl'
            } w-full`}
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
          >
            {/* Page 1 (Current Active Page) */}
            <div className={`p-8 sm:p-12 rounded-xl border relative flex flex-col justify-between min-h-[500px] ${themeStyles.pageBg}`}>
              {/* Header Running Head */}
              <div className={`flex items-center justify-between text-[11px] border-b pb-2 mb-6 ${themeStyles.metaText}`}>
                <span className="font-serif italic">{book.title}</span>
                <span className="font-mono">Page {activePageData.pageNum}</span>
              </div>

              {/* Page Body Text with Dictionary Support & Sentence Highlight */}
              <div 
                className={`space-y-4 leading-relaxed ${fontClass} ${themeStyles.text}`}
                style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
              >
                {activePageData.content.map((paragraph, pIdx) => {
                  const isHighlighted = isReadingAloud && readingSentenceIndex === pIdx;
                  return (
                    <p 
                      key={pIdx}
                      className={`transition-colors duration-200 rounded px-1 ${
                        isHighlighted ? themeStyles.highlight : ''
                      }`}
                    >
                      {searchQuery ? (
                        paragraph.split(new RegExp(`(${searchQuery})`, 'gi')).map((part, i) => (
                          part.toLowerCase() === searchQuery.toLowerCase() ? (
                            <mark key={i} className="bg-amber-300 text-black px-0.5 rounded font-bold">{part}</mark>
                          ) : part
                        ))
                      ) : (
                        paragraph
                      )}
                    </p>
                  );
                })}
              </div>

              {/* Page Footer Foliage & Page Number */}
              <div className={`flex items-center justify-between text-[10px] pt-6 mt-6 border-t font-mono ${themeStyles.metaText}`}>
                <span>{book.author}</span>
                <span>{activePageData.pageNum} of {totalPages}</span>
              </div>
            </div>

            {/* Page 2 (Dual Spread Mode) */}
            {spreadMode === 'dual' && secondPageData && (
              <div className={`hidden md:flex p-8 sm:p-12 rounded-xl border flex-col justify-between min-h-[500px] ${themeStyles.pageBg}`}>
                <div className={`flex items-center justify-between text-[11px] border-b pb-2 mb-6 ${themeStyles.metaText}`}>
                  <span className="font-serif italic">{secondPageData.chapter}</span>
                  <span className="font-mono">Page {secondPageData.pageNum}</span>
                </div>

                <div 
                  className={`space-y-4 leading-relaxed ${fontClass} ${themeStyles.text}`}
                  style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
                >
                  {secondPageData.content.map((paragraph, pIdx) => (
                    <p key={pIdx}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className={`flex items-center justify-between text-[10px] pt-6 mt-6 border-t font-mono ${themeStyles.metaText}`}>
                  <span>Permanent DRM-Free Edition</span>
                  <span>{secondPageData.pageNum} of {totalPages}</span>
                </div>
              </div>
            )}
          </div>

          {/* Next Page Floating Button */}
          <button
            id="reader-next-page-arrow-btn"
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-xs transition cursor-pointer disabled:opacity-20 disabled:pointer-events-none shadow-lg z-20"
            title="Next Page (ArrowRight)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Reader Footer Navigation & Slider */}
      <div className="px-4 py-3 bg-stone-900 text-stone-200 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs select-none">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={currentPage <= 1}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 disabled:opacity-30 text-stone-300 font-semibold cursor-pointer"
          >
            Previous
          </button>
          <span className="font-mono text-stone-400">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 disabled:opacity-30 text-stone-300 font-semibold cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Page Jump Slider */}
        <div className="flex-1 max-w-md mx-auto w-full flex items-center gap-3">
          <input
            id="reader-page-slider"
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => flipToPage(Number(e.target.value))}
            className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
          <span className="font-mono text-[11px] text-amber-300 whitespace-nowrap">
            {Math.round((currentPage / totalPages) * 100)}% Read
          </span>
        </div>

        {/* Quick hint */}
        <div className="text-[11px] text-stone-500 hidden lg:block">
          Tip: Double-click any word for instant dictionary lookup
        </div>
      </div>
    </div>
  );
};
