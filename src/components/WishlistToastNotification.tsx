import React, { useEffect, useState, useRef } from 'react';
import { 
  Heart, 
  Check, 
  ArrowRight, 
  X, 
  RotateCcw, 
  BookMarked,
  Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WishlistToastNotification: React.FC = () => {
  const { 
    wishlistToast, 
    dismissWishlistToast, 
    undoWishlistToast, 
    setCurrentView 
  } = useStore();

  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const durationMs = 4500;
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!wishlistToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const startTime = Date.now();

    intervalRef.current = window.setInterval(() => {
      if (isPaused) return;

      const elapsed = Date.now() - startTime;
      const remainingPct = Math.max(0, 100 - (elapsed / durationMs) * 100);
      setProgress(remainingPct);

      if (remainingPct <= 0) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        dismissWishlistToast();
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [wishlistToast?.id, isPaused, dismissWishlistToast]);

  if (!wishlistToast) return null;

  const { type, book, itemCount } = wishlistToast;
  const isAdded = type === 'added';

  return (
    <div
      id="wishlist-visual-toast"
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-20 right-4 sm:right-6 z-[9999] max-w-sm sm:max-w-md w-full bg-slate-900/95 text-white rounded-2xl shadow-2xl border border-rose-500/40 backdrop-blur-md overflow-hidden animate-in slide-in-from-top-4 duration-300 ring-2 ring-rose-500/20"
    >
      <div className="p-3.5 sm:p-4">
        <div className="flex items-start gap-3">
          
          {/* Book Cover Thumbnail with Heart Floating Badge */}
          <div className="relative w-14 h-20 sm:w-16 sm:h-22 rounded-lg bg-slate-800 shrink-0 overflow-hidden shadow-md border border-slate-700">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div 
              className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center shadow-lg ${
                isAdded ? 'bg-rose-600 text-white ring-2 ring-slate-900 animate-pulse' : 'bg-slate-700 text-slate-300 ring-2 ring-slate-900'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isAdded ? 'fill-white' : ''}`} />
            </div>
          </div>

          {/* Toast Message & Content */}
          <div className="flex-1 min-w-0 pr-1">
            
            {/* Status Header Badge */}
            <div className="flex items-center gap-1.5 mb-1">
              {isAdded ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 uppercase tracking-wider">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>Added to Wish List</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <span>Removed from Wish List</span>
                </span>
              )}
            </div>

            {/* Book Title & Author */}
            <h4 className="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1 leading-snug">
              {book.title}
            </h4>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              by <span className="text-slate-300 font-medium">{book.author}</span>
            </p>

            {/* Quick Stats or Category */}
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-amber-300 font-medium">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{itemCount} {itemCount === 1 ? 'book' : 'books'} saved</span>
              </span>
              <span>•</span>
              <span className="truncate max-w-[120px]">{book.category}</span>
            </div>

            {/* Action Buttons Row */}
            <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/80">
              {isAdded ? (
                <>
                  <button
                    id="toast-view-wishlist-btn"
                    onClick={() => {
                      setCurrentView('wishlist');
                      dismissWishlistToast();
                    }}
                    className="flex-1 py-1.5 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
                  >
                    <BookMarked className="w-3 h-3 text-slate-950" />
                    <span>View Wish List</span>
                    <ArrowRight className="w-3 h-3 text-slate-950" />
                  </button>

                  <button
                    id="toast-undo-wishlist-btn"
                    onClick={undoWishlistToast}
                    className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition flex items-center gap-1 cursor-pointer"
                    title="Undo addition"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                </>
              ) : (
                <button
                  id="toast-undo-removal-btn"
                  onClick={undoWishlistToast}
                  className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo - Add Back</span>
                </button>
              )}
            </div>

          </div>

          {/* Close Button */}
          <button
            id="toast-close-btn"
            onClick={dismissWishlistToast}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer shrink-0 -mt-1 -mr-1"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* Countdown Progress Bar */}
      <div className="w-full h-1 bg-slate-800 overflow-hidden">
        <div 
          className={`h-full transition-all duration-75 ${
            isAdded ? 'bg-gradient-to-r from-rose-500 to-amber-400' : 'bg-slate-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
