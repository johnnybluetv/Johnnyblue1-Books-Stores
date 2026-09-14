import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Send, 
  MessageCircle, 
  ExternalLink,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { Book } from '../types';

interface BookShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  onNativeShare?: () => void;
  canNativeShare?: boolean;
}

export const BookShareModal: React.FC<BookShareModalProps> = ({
  isOpen,
  onClose,
  book,
  onNativeShare,
  canNativeShare
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Discover "${book.title}" by ${book.author} on Johnnyblue1 Books Stores & Knowledge Centa. Available across 10 physical & digital dimensions!`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentUrl);
      } else {
        const input = document.createElement('input');
        input.value = currentUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.1-.477-.15-.678.15-.2.3-.778.98-.954 1.18-.176.2-.352.226-.653.076-.301-.15-1.272-.469-2.423-1.496-.896-.799-1.501-1.786-1.677-2.087-.176-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.176.2-.301.301-.502.1-.2.05-.376-.025-.527-.075-.15-.678-1.634-.929-2.238-.244-.588-.493-.509-.678-.518-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.511c0 1.481 1.079 2.911 1.23 3.112.15.2 2.124 3.243 5.145 4.549.719.311 1.281.497 1.719.636.723.23 1.381.197 1.901.12.579-.087 1.78-.728 2.031-1.431.251-.703.251-1.305.176-1.431-.075-.126-.276-.201-.577-.351zM12.04 2C6.52 2 2.03 6.49 2.03 12.01c0 1.98.58 3.82 1.58 5.37L2 22l4.82-1.57c1.49.92 3.24 1.47 5.22 1.47 5.52 0 10.01-4.49 10.01-10.01S17.56 2 12.04 2z"/>
        </svg>
      ),
      bg: 'bg-emerald-500 hover:bg-emerald-600 text-white',
      url: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`
    },
    {
      name: 'X (Twitter)',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      bg: 'bg-slate-900 hover:bg-black text-white',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.01-3.28 1.64 1.64 0 0 0 .01 3.28M5.07 18.5h2.79v-8.37H5.07v8.37z"/>
        </svg>
      ),
      bg: 'bg-[#0077b5] hover:bg-[#005f93] text-white',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
        </svg>
      ),
      bg: 'bg-[#1877f2] hover:bg-[#1565c0] text-white',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
    },
    {
      name: 'Telegram',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
        </svg>
      ),
      bg: 'bg-[#229ED9] hover:bg-[#1c87ba] text-white',
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Email',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
        </svg>
      ),
      bg: 'bg-stone-700 hover:bg-stone-800 text-white',
      url: `mailto:?subject=${encodeURIComponent(book.title)}&body=${encodeURIComponent(`${shareText}\n\nRead here: ${currentUrl}`)}`
    }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        id="book-share-dialog"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#1c2430] text-slate-100 p-4 sm:p-5 flex items-center justify-between border-b border-slate-700/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Share Sovereign Masterwork</span>
              </h3>
              <p className="text-[11px] text-amber-300">Quick share across social channels & Web Share API</p>
            </div>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Book Preview Card snippet */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center gap-3.5">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            referrerPolicy="no-referrer"
            className="w-14 h-20 object-cover rounded shadow-md border border-slate-300 shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider font-bold text-amber-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>10-Dimension Literary Architecture</span>
            </div>
            <h4 className="font-bold text-slate-900 text-sm truncate leading-tight mt-0.5">
              {book.title}
            </h4>
            <p className="text-xs text-slate-600 truncate mt-0.5">
              by {book.author}
            </p>
            <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Ready for Sovereign Delivery</span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4">
          
          {/* Native Web Share Button (if supported or available) */}
          {canNativeShare && onNativeShare && (
            <button
              id="native-web-share-trigger-btn"
              onClick={() => {
                onNativeShare();
                onClose();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer border border-amber-300"
            >
              <Smartphone className="w-4 h-4 text-slate-950" />
              <span>Open Device Native Share Sheet (Web Share API)</span>
            </button>
          )}

          {/* Social Platform 1-Click Tiles */}
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5">
              Share to Social Platforms
            </div>
            <div className="grid grid-cols-3 gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  id={`share-to-${item.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition-all shadow-xs hover:shadow hover:scale-[1.02] cursor-pointer ${item.bg}`}
                >
                  {item.icon}
                  <span className="text-[11px] font-bold">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Copy Direct URL Box */}
          <div className="space-y-1.5 pt-1">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
              Direct Book Link
            </label>
            <div className="flex items-center gap-2">
              <input
                id="share-direct-link-input"
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 select-all font-mono outline-hidden focus:ring-2 focus:ring-amber-500"
              />
              <button
                id="share-copy-link-btn"
                onClick={handleCopy}
                className={`py-2 px-3.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-[#232f3e] hover:bg-[#37475a] text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Johnnyblue1 Books Stores & Knowledge Centa • Sovereign Universal Reader Network
        </div>
      </div>
    </div>
  );
};
