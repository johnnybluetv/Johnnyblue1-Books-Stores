import React, { useState, useEffect } from 'react';
import { 
  WifiOff, 
  Wifi, 
  Download, 
  Trash2, 
  BookOpen, 
  CheckCircle2, 
  X, 
  HardDrive, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';

interface OfflineReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBookReader?: (book: Book) => void;
}

export const OfflineReadingModal: React.FC<OfflineReadingModalProps> = ({
  isOpen,
  onClose,
  onOpenBookReader
}) => {
  const { books, offlineBooks, toggleOfflineBook, isBookOffline, openLookInside } = useStore();
  const [isOnline, setIsOnline] = useState(typeof window !== 'undefined' ? window.navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOpen) return null;

  const downloadedList = books.filter(b => isBookOffline(b.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isOnline ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-slate-950'
            }`}>
              {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base font-serif text-white">
                  Offline Reading Vault
                </h3>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                }`}>
                  {isOnline ? 'Online Sync Active' : 'Offline Mode Enabled'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cache full chapters & audiobooks directly in local storage for air-gapped reading
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700">
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>
                <strong className="font-bold text-slate-900">{downloadedList.length}</strong> of {books.length} titles stored locally in browser sandbox
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Permanent Storage
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Available Titles for Offline Reading:
            </h4>

            {books.map(book => {
              const isDownloaded = isBookOffline(book.id);

              return (
                <div 
                  key={book.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-amber-300 transition bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-10 h-14 object-cover rounded shadow-xs shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate text-xs">
                        {book.title}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {book.author} • {book.pages} pages
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">
                          {book.category}
                        </span>
                        {isDownloaded && (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                            Offline Ready
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isDownloaded && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          openLookInside(book, 'ebook');
                        }}
                        className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Read</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleOfflineBook(book.id)}
                      className={`p-2 rounded-lg transition cursor-pointer text-xs flex items-center gap-1 ${
                        isDownloaded 
                          ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600'
                          : 'bg-[#131921] hover:bg-slate-800 text-white font-semibold'
                      }`}
                      title={isDownloaded ? 'Remove from Offline Storage' : 'Download for Offline Reading'}
                    >
                      {isDownloaded ? (
                        <Trash2 className="w-3.5 h-3.5" />
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          <span>Cache</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Stored via browser CacheStorage & LocalState
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
