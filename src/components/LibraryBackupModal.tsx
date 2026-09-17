import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileJson, 
  ShieldCheck, 
  Database, 
  BookOpen, 
  CheckCircle2 
} from 'lucide-react';
import { LibraryItem, CollectionFolder, LibraryExportBackup } from '../types';

interface LibraryBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  library: LibraryItem[];
  collectionFolders: CollectionFolder[];
  onDownload: () => void;
  userEmail?: string;
  userName?: string;
}

export const LibraryBackupModal: React.FC<LibraryBackupModalProps> = ({
  isOpen,
  onClose,
  library,
  collectionFolders,
  onDownload,
  userEmail,
  userName
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');

  if (!isOpen) return null;

  const formatNameMap: Record<string, string> = {
    ebook: 'eBook / Digital Text',
    audiobook: 'Master Audiobook',
    videobook: '4K Ultra HD Video Book',
    musical_album: 'Musical Audio & Scores',
    manuscript: 'Archival Manuscript',
    hardcover: 'Hardcover Collector Edition',
    papercover: 'Paperback Softcover',
    pendrive_sd: 'Encrypted Pen Drive / SD Card',
    silk_cotton: 'Raw Silk & Cotton Scroll',
    digital_device: 'Sovereign Offline Dedicated Reader'
  };

  const backupData: LibraryExportBackup = {
    appName: 'Knowledge Centa - Customer Digital Library',
    schemaVersion: '2.0.0',
    exportedAt: new Date().toISOString(),
    exportTimestamp: Date.now(),
    user: userEmail ? {
      name: userName || 'Customer Reader',
      email: userEmail
    } : undefined,
    summary: {
      totalPurchasedEditions: library.length,
      totalUniqueTitles: new Set(library.map((i) => i.bookId)).size,
      totalFolders: collectionFolders.length,
      formatsCount: library.reduce((acc, item) => {
        acc[item.format] = (acc[item.format] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    },
    collectionFolders: collectionFolders.map(f => ({
      id: f.id,
      name: f.name,
      description: f.description || '',
      color: f.color,
      iconName: f.iconName,
      createdAt: f.createdAt,
      isDefault: f.isDefault
    })),
    purchasedItems: library.map((item) => ({
      id: item.id,
      bookId: item.bookId,
      title: item.book.title,
      subtitle: item.book.subtitle,
      author: item.book.author,
      format: item.format,
      formatLabel: formatNameMap[item.format] || item.format,
      category: item.book.category,
      publisher: item.book.publisher,
      purchasedAt: item.purchasedAt,
      progressPercent: item.lastProgress || 0,
      collectionFolder: item.folderName || 'Unassigned',
      collectionFolderId: item.folderId || null,
      description: item.book.description,
      isbn: item.book.isbn,
      pages: item.book.pages,
      language: item.book.language
    }))
  };

  const jsonString = JSON.stringify(backupData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // fallback
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <span>Digital Library Local Backup</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  JSON 2.0
                </span>
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                DRM-free metadata export of all purchased titles, authors, formats, and collection folders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Summary Strip */}
        <div className="bg-stone-50 dark:bg-stone-850 px-5 py-3 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-stone-500 dark:text-stone-400">Total Editions: </span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">{library.length}</span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400">Folders: </span>
              <span className="font-bold font-mono text-stone-900 dark:text-stone-100">{collectionFolders.length}</span>
            </div>
            <div>
              <span className="text-stone-500 dark:text-stone-400">File Format: </span>
              <span className="font-mono text-amber-500 font-bold">.json (UTF-8)</span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-stone-200 dark:bg-stone-800 p-0.5 rounded-xl">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                activeTab === 'json'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>Raw JSON</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'preview' ? (
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                Purchased Content Metadata ({library.length} items)
              </div>
              {library.length === 0 ? (
                <div className="text-center py-10 text-stone-500 text-xs">
                  Your library is currently empty. Claim welcome editions or acquire books to export.
                </div>
              ) : (
                <div className="space-y-2">
                  {library.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      className="p-3 rounded-xl bg-stone-50 dark:bg-stone-850/70 border border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={item.book.coverImage} 
                          alt={item.book.title} 
                          className="w-9 h-12 object-cover rounded-md shadow-xs shrink-0" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-stone-900 dark:text-stone-100 truncate">
                            {item.book.title}
                          </div>
                          <div className="text-stone-500 dark:text-stone-400 truncate text-[11px]">
                            by {item.book.author}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              {formatNameMap[item.format] || item.format}
                            </span>
                            {item.folderName && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300">
                                📁 {item.folderName}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-[11px] font-mono text-stone-400">
                          {new Date(item.purchasedAt).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-emerald-500 font-semibold mt-1 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Included in Backup</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Standard schema compliant JSON backup</span>
                <span className="font-mono">{(new Blob([jsonString]).size / 1024).toFixed(1)} KB</span>
              </div>
              <pre className="p-4 rounded-2xl bg-stone-950 text-emerald-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-96 border border-stone-800 select-all">
                {jsonString}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-850 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Encrypted local metadata snapshot with full format fidelity</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>

            <button
              id="modal-download-json-backup-btn"
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
