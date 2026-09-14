import React, { useState, useEffect } from 'react';
import { BookOpen, Volume2, VolumeX, Sparkles, X, Check } from 'lucide-react';
import { soundService } from '../services/soundService';

interface PageFlipSoundDialogProps {
  forceOpen?: boolean;
  onClose?: () => void;
}

export const PageFlipSoundDialog: React.FC<PageFlipSoundDialogProps> = ({
  forceOpen = false,
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTested, setHasTested] = useState(false);
  const [testCount, setTestCount] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      return;
    }

    // Check if user has answered before
    const pref = soundService.getPreference();
    if (pref === 'unprompted') {
      // Delay popup slightly so initial page render is calm and welcoming
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [forceOpen]);

  const handleTestSound = () => {
    soundService.testSound();
    setHasTested(true);
    setTestCount((prev) => prev + 1);
  };

  const handleEnableSound = () => {
    soundService.setPreference('enabled');
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleDisableSound = () => {
    soundService.setPreference('disabled');
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      id="page-flip-sound-dialog-backdrop"
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div 
        id="page-flip-sound-dialog-modal"
        className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-amber-300/40 max-w-md w-full p-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-500/15 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          id="close-sound-dialog-btn"
          onClick={handleDisableSound}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
          title="Dismiss for now"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3 h-3" />
              <span>Tactile Audio Experience</span>
            </div>
            <h3 className="text-lg font-extrabold font-serif leading-tight">
              Page Flip Sound Effects
            </h3>
          </div>
        </div>

        {/* Dialog Body Content */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          Do you like the realistic sound of a flipping page? We can play a gentle, tactile book-page flutter whenever you click buttons, explore dimensions, and read books.
        </p>

        {/* Interactive Audio Tester Preview */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/80 dark:border-slate-700/80 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300 flex items-center justify-center shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold block text-slate-800 dark:text-slate-200">
                Audio Sample
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                {hasTested ? `Tested ${testCount} time${testCount > 1 ? 's' : ''}` : 'Click to hear the page flip sound'}
              </span>
            </div>
          </div>

          <button
            id="test-flip-sound-btn"
            type="button"
            onClick={handleTestSound}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-xs hover:shadow transition-all duration-150 flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Test Sound</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            id="enable-flip-sound-btn"
            type="button"
            onClick={handleEnableSound}
            className="w-full sm:flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl shadow-md hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Yes, Enable Sound</span>
          </button>

          <button
            id="disable-flip-sound-btn"
            type="button"
            onClick={handleDisableSound}
            className="w-full sm:w-auto py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span>No, Keep Muted</span>
          </button>
        </div>

        {/* Subtle Re-assurance footer */}
        <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center mt-4">
          You can toggle or mute this sound effect at any time using the speaker icon in the top navigation.
        </p>
      </div>
    </div>
  );
};
