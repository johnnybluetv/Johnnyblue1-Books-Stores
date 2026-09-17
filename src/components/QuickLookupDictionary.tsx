import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Volume2, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Layers
} from 'lucide-react';
import { 
  DictionaryEntry, 
  lookupWordDefinition, 
  speakWord 
} from '../services/dictionaryService';

interface PopupPosition {
  top: number;
  left: number;
  placement: 'top' | 'bottom';
}

export const QuickLookupDictionary: React.FC = () => {
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState<PopupPosition | null>(null);
  const [copied, setCopied] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Helper to test if a target is inside any book preview container
  const isTargetInBookPreview = (node: Node | null): boolean => {
    if (!node) return false;
    const el = node.nodeType === Node.ELEMENT_NODE ? (node as HTMLElement) : node.parentElement;
    if (!el) return false;
    return !!el.closest(
      '[data-book-preview="true"], .book-preview-content, .book-preview-text, #reader-stage, #pdp-sample-preview, .reader-preview-area'
    );
  };

  const handleLookup = async (selectedText: string, rect: DOMRect) => {
    const cleanWord = selectedText
      .trim()
      .replace(/^[\s"“'‘(\[{«—]+|[\s"”'’)}\]»—.,;:!?]+$/g, '')
      .toLowerCase();

    // Only look up single words or hyphenated words (2 to 35 characters)
    if (!cleanWord || cleanWord.length < 2 || cleanWord.length > 35) {
      return;
    }

    if (!/^[a-z]+(-[a-z]+)*$/.test(cleanWord)) {
      return;
    }

    // Position popup relative to selection bounding rect
    const popupWidth = 320;
    const popupHeight = 220; // Estimated height

    let left = rect.left + rect.width / 2 - popupWidth / 2;
    // Clamp inside viewport
    left = Math.max(12, Math.min(window.innerWidth - popupWidth - 12, left));

    let top = 0;
    let placement: 'top' | 'bottom' = 'top';

    if (rect.top > popupHeight + 20) {
      top = rect.top - 12; // Placed above
      placement = 'top';
    } else {
      top = rect.bottom + 12; // Placed below
      placement = 'bottom';
    }

    setPosition({ top, left, placement });
    setActiveWord(cleanWord);
    setLoading(true);
    setCopied(false);

    try {
      const result = await lookupWordDefinition(cleanWord);
      setEntry(result);
    } catch {
      setEntry(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionProcess = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.rangeCount) {
      return;
    }

    const anchorNode = selection.anchorNode;
    if (!isTargetInBookPreview(anchorNode)) {
      return;
    }

    const rawText = selection.toString();
    const words = rawText.trim().split(/\s+/);
    // If the user selected a single word
    if (words.length === 1 && words[0].length >= 2) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        handleLookup(words[0], rect);
      }
    }
  };

  const handleDoubleClick = (e: MouseEvent) => {
    const target = e.target as Node;
    if (!isTargetInBookPreview(target)) {
      return;
    }

    // Double click selects word natively, let selection stabilize
    setTimeout(() => {
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed && selection.rangeCount > 0) {
        const text = selection.toString().trim();
        const words = text.split(/\s+/);
        if (words.length === 1 && words[0].length >= 2) {
          const range = selection.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            handleLookup(words[0], rect);
          }
        }
      }
    }, 40);
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      // If clicking inside the popup, do not dismiss or re-trigger
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        return;
      }
      handleSelectionProcess();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePopup();
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        const selection = window.getSelection();
        // If selection is collapsed or empty, close
        if (!selection || selection.isCollapsed) {
          closePopup();
        }
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const closePopup = () => {
    setActiveWord(null);
    setEntry(null);
    setPosition(null);
  };

  const handlePronounce = () => {
    if (!activeWord) return;
    if (entry?.audioUrl) {
      const audio = new Audio(entry.audioUrl);
      audio.play().catch(() => speakWord(activeWord));
    } else {
      speakWord(activeWord);
    }
  };

  const handleCopyDefinition = () => {
    if (!entry) return;
    const firstDef = entry.meanings[0]?.definitions[0]?.definition || '';
    const text = `${entry.word} (${entry.meanings[0]?.partOfSpeech || 'word'}): ${firstDef}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (!activeWord || !position) {
    return null;
  }

  const firstMeaning = entry?.meanings[0];
  const primaryDefinition = firstMeaning?.definitions[0];
  const secondaryDefinition = firstMeaning?.definitions[1];
  const synonyms = primaryDefinition?.synonyms || [];

  return (
    <div
      ref={popupRef}
      id="quick-lookup-dictionary-popup"
      role="dialog"
      aria-label={`Definition for ${activeWord}`}
      className="fixed z-[99999] w-[320px] bg-white dark:bg-stone-900 border border-amber-300 dark:border-amber-600/60 rounded-xl shadow-2xl overflow-hidden font-sans text-xs animate-in fade-in zoom-in-95 duration-150 text-slate-800 dark:text-slate-100"
      style={{
        top: position.placement === 'top' ? undefined : `${position.top}px`,
        bottom: position.placement === 'top' ? `${window.innerHeight - position.top}px` : undefined,
        left: `${position.left}px`,
      }}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 px-3.5 py-2 flex items-center justify-between select-none shadow-xs">
        <div className="flex items-center gap-1.5 font-bold">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-[11px] uppercase tracking-wider">Quick Dictionary</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePronounce}
            className="p-1 hover:bg-black/10 rounded-md transition cursor-pointer"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={closePopup}
            className="p-1 hover:bg-black/10 rounded-md transition cursor-pointer"
            title="Close dictionary (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5 max-h-[280px] overflow-y-auto">
        {loading ? (
          <div className="space-y-2 py-3">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Defining <strong className="text-slate-800 dark:text-white">"{activeWord}"</strong>...
              </span>
            </div>
            <div className="h-3 bg-slate-100 dark:bg-stone-800 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-stone-800 rounded animate-pulse w-5/6" />
          </div>
        ) : entry ? (
          <>
            {/* Word Title & Phonetic */}
            <div className="flex items-baseline justify-between gap-2 border-b border-slate-100 dark:border-stone-800 pb-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white capitalize font-serif">
                  {entry.word}
                </h4>
                {entry.phonetic && (
                  <span className="text-[11px] font-mono text-amber-700 dark:text-amber-400">
                    {entry.phonetic}
                  </span>
                )}
              </div>
              {firstMeaning && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {firstMeaning.partOfSpeech}
                </span>
              )}
            </div>

            {/* Definitions */}
            <div className="space-y-2">
              {primaryDefinition && (
                <div className="space-y-1">
                  <p className="text-[12px] leading-relaxed text-slate-700 dark:text-slate-200">
                    {primaryDefinition.definition}
                  </p>
                  {primaryDefinition.example && (
                    <p className="text-[11px] italic text-slate-500 dark:text-slate-400 pl-2 border-l-2 border-amber-300 dark:border-amber-600">
                      "{primaryDefinition.example}"
                    </p>
                  )}
                </div>
              )}

              {secondaryDefinition && (
                <div className="pt-1.5 border-t border-slate-100 dark:border-stone-800">
                  <p className="text-[11px] text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-500">2.</span> {secondaryDefinition.definition}
                  </p>
                </div>
              )}
            </div>

            {/* Synonyms Chips */}
            {synonyms.length > 0 && (
              <div className="pt-1.5 border-t border-slate-100 dark:border-stone-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Synonyms:
                </span>
                <div className="flex flex-wrap gap-1">
                  {synonyms.map((syn, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Quick lookup for clicked synonym
                        setActiveWord(syn);
                        setLoading(true);
                        lookupWordDefinition(syn)
                          .then(setEntry)
                          .catch(() => setEntry(null))
                          .finally(() => setLoading(false));
                      }}
                      className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-slate-600 dark:text-slate-300 hover:text-amber-900 dark:hover:text-amber-300 transition text-[10px] cursor-pointer"
                    >
                      {syn}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="py-2 text-center text-slate-500 dark:text-slate-400 space-y-1">
            <p className="font-medium text-xs">Definition unavailable for "{activeWord}".</p>
            <p className="text-[10px]">Try selecting another root word or term.</p>
          </div>
        )}
      </div>

      {/* Footer Utility Bar */}
      <div className="bg-slate-50 dark:bg-stone-950 px-3 py-1.5 border-t border-slate-100 dark:border-stone-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Double-click any word</span>
        {entry && (
          <button
            onClick={handleCopyDefinition}
            className="text-amber-700 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
