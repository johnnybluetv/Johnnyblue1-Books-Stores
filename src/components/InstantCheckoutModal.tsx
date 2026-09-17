import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Headphones, 
  Film, 
  BookOpen, 
  FileText, 
  Coins, 
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType } from '../types';

export const InstantCheckoutModal: React.FC = () => {
  const { 
    checkoutState, 
    cancelCheckout, 
    completeCheckout, 
    formatPrice 
  } = useStore() as any;

  const [paymentMethod, setPaymentMethod] = useState<'1click' | 'card' | 'wallet'>('1click');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!checkoutState?.isOpen || !checkoutState?.book || !checkoutState?.format) {
    return null;
  }

  const { book, format } = checkoutState;
  const price = book.formats[format as FormatType]?.price || 19.99;

  const formatLabels: Record<string, { label: string; icon: any; color: string; desc: string }> = {
    ebook: { label: 'eBook (EPUB3 & PDF)', icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', desc: 'In-browser dual-page reader + downloadable DRM-free EPUB/PDF' },
    audiobook: { label: 'Master Audiobook (320kbps MP3)', icon: Headphones, color: 'bg-amber-500/10 text-amber-600 border-amber-500/20', desc: 'In-browser streaming with synced karaoke transcript & chapters' },
    video_book: { label: '4K Cinema Video Book', icon: Film, color: 'bg-purple-500/10 text-purple-600 border-purple-500/20', desc: '4K Ultra HD HDR in-browser stream + multilingual subtitles' },
    musical_album: { label: 'Musical Score & Album (FLAC)', icon: Headphones, color: 'bg-rose-500/10 text-rose-600 border-rose-500/20', desc: 'Studio master 24-bit lossless playback + digital liner notes' },
    manuscript: { label: 'Archival Manuscript (Raw Scans)', icon: FileText, color: 'bg-blue-500/10 text-blue-600 border-blue-500/20', desc: 'High-res archival facsimile viewer with margin notations' }
  };

  const currentFormatMeta = formatLabels[format] || {
    label: `${format.toUpperCase()} Edition`,
    icon: Sparkles,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    desc: 'Full digital license with instant in-browser streaming'
  };

  const FormatIcon = currentFormatMeta.icon;

  const handleConfirmPurchase = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      setIsAuthorizing(false);
      completeCheckout(book, format);
    }, 600);
  };

  return (
    <div 
      id="instant-checkout-modal-overlay"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in"
    >
      <div 
        id="instant-checkout-modal-content"
        className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-6 py-4 text-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-stone-950" />
            <span className="font-extrabold text-sm tracking-wide uppercase">
              Secure 1-Click Checkout
            </span>
          </div>
          <button
            onClick={cancelCheckout}
            disabled={isAuthorizing}
            className="p-1 rounded-full hover:bg-black/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Details Body */}
        <div className="p-6 space-y-5">
          {/* Book Summary Card */}
          <div className="flex gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-850/80 border border-stone-200 dark:border-stone-800">
            <img 
              src={book.coverImage} 
              alt={book.title} 
              className="w-20 h-28 object-cover rounded-xl shadow-md shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0 space-y-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${currentFormatMeta.color}`}>
                <FormatIcon className="w-3.5 h-3.5" />
                {currentFormatMeta.label}
              </span>
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100 line-clamp-1">
                {book.title}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                By {book.author}
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-400 leading-snug">
                {currentFormatMeta.desc}
              </p>
            </div>
          </div>

          {/* Transparent Order Summary Breakdown */}
          <div className="space-y-2 p-4 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700/60 text-xs">
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>{currentFormatMeta.label}</span>
              <span className="font-mono font-semibold">{formatPrice(price)}</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Instant In-Browser Streaming License</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">FREE</span>
            </div>
            <div className="flex justify-between text-stone-600 dark:text-stone-300">
              <span>Author Direct Settlement (100% Royalty)</span>
              <span className="text-stone-500 font-mono">Included</span>
            </div>
            <div className="border-t border-stone-200 dark:border-stone-700 pt-2 flex justify-between font-bold text-sm text-stone-900 dark:text-stone-100">
              <span>Total Due:</span>
              <span className="text-amber-600 dark:text-amber-400 font-mono text-base">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Select Payment Method
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('1click')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === '1click'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs">1-Click Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-400'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Card / G-Pay</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                  paymentMethod === 'wallet'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold'
                    : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-850 text-stone-600 dark:text-stone-400'
                }`}
              >
                <Coins className="w-4 h-4 text-emerald-500" />
                <span className="text-xs">Reader Wallet</span>
              </button>
            </div>
          </div>

          {/* Instant Delivery Badge */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200">
            <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Instant Library Landing: </span>
              Completing this purchase instantly activates the in-browser media player in your{' '}
              <strong className="underline">Customer Digital Library (/my-library)</strong> with full audio, video, or PDF reading controls.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={cancelCheckout}
              disabled={isAuthorizing}
              className="px-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              id="confirm-checkout-and-stream-btn"
              type="button"
              onClick={handleConfirmPurchase}
              disabled={isAuthorizing}
              className="flex-1 py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/25 transition transform active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {isAuthorizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>Authorizing Media Token...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Stream in /my-library</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
