import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Headphones, 
  Film, 
  FileText, 
  Sparkles, 
  Download, 
  Play, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck, 
  ArrowLeft, 
  SlidersHorizontal,
  CloudCheck,
  Award,
  Layers,
  HardDrive,
  Gamepad2,
  Folder,
  FolderPlus,
  FolderOpen,
  FolderCheck,
  Edit2,
  FileJson,
  Plus,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType, LibraryItem, Book, CollectionFolder } from '../types';
import { AudioMediaControls } from './AudioMediaControls';
import { VideoMediaControls } from './VideoMediaControls';
import { PdfEbookReaderControls } from './PdfEbookReaderControls';
import { LibraryBackupModal } from './LibraryBackupModal';
import { CollectionFolderModal } from './CollectionFolderModal';
import { AssignFolderModal } from './AssignFolderModal';

// Helper to highlight matching text in title or author in real time
const highlightMatch = (text: string, query: string) => {
  if (!query.trim()) return text;
  const q = query.trim();
  const escapedQuery = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return (
    <>
      {parts.map((part, index) => 
        part.toLowerCase() === q.toLowerCase() ? (
          <mark 
            key={index} 
            className="bg-amber-300/90 dark:bg-amber-500/40 text-stone-950 dark:text-amber-200 font-bold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};

export const CustomerDigitalLibrary: React.FC = () => {
  const { 
    library, 
    activeLibraryItem, 
    setActiveLibraryItem, 
    setCurrentView,
    claimWelcomeReaderPass,
    formatPrice,
    collectionFolders = [],
    createCollectionFolder,
    updateCollectionFolder,
    deleteCollectionFolder,
    assignItemToFolder,
    exportLibraryBackupJson,
    user
  } = useStore() as any;

  const [activeFormatFilter, setActiveFormatFilter] = useState<'all' | FormatType>('all');
  const [selectedFolderId, setSelectedFolderId] = useState<'all' | string>('all');
  const [librarySearchQuery, setLibrarySearchQuery] = useState('');
  const [playerFormatOverride, setPlayerFormatOverride] = useState<FormatType | null>(null);
  
  // Modals state
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
  const [folderToEdit, setFolderToEdit] = useState<CollectionFolder | null>(null);
  const [itemToAssignFolder, setItemToAssignFolder] = useState<LibraryItem | null>(null);

  const playerStageRef = useRef<HTMLDivElement>(null);

  // Auto-select the first library item if none is currently selected
  useEffect(() => {
    if (!activeLibraryItem && library && library.length > 0) {
      setActiveLibraryItem(library[0]);
    }
  }, [library, activeLibraryItem, setActiveLibraryItem]);

  // If active item changed, reset format override
  useEffect(() => {
    if (activeLibraryItem) {
      setPlayerFormatOverride(activeLibraryItem.format);
    }
  }, [activeLibraryItem]);

  // Filtered items
  const filteredLibrary = library.filter((item: LibraryItem) => {
    const matchesFormat = activeFormatFilter === 'all' || item.format === activeFormatFilter;
    const matchesFolder = selectedFolderId === 'all' || item.folderId === selectedFolderId;
    const matchesSearch = !librarySearchQuery.trim() || 
      item.book.title.toLowerCase().includes(librarySearchQuery.toLowerCase()) ||
      item.book.author.toLowerCase().includes(librarySearchQuery.toLowerCase());
    return matchesFormat && matchesFolder && matchesSearch;
  });

  const activeItem: LibraryItem | null = activeLibraryItem || (library.length > 0 ? library[0] : null);
  const currentStreamFormat: FormatType = playerFormatOverride || activeItem?.format || 'ebook';

  const handleSelectBookForStreaming = (item: LibraryItem) => {
    setActiveLibraryItem(item);
    setPlayerFormatOverride(item.format);
    // Smooth scroll up to player stage
    playerStageRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatLabels: Record<string, { label: string; icon: any; color: string }> = {
    ebook: { label: 'eBook / PDF', icon: BookOpen, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' },
    audiobook: { label: 'Audiobook', icon: Headphones, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
    videobook: { label: '4K Video Book', icon: Film, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    video_book: { label: '4K Video Book', icon: Film, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
    musical_album: { label: 'Musical Score', icon: Headphones, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20' },
    manuscript: { label: 'Archival Manuscript', icon: FileText, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
    handheld_console: { label: 'Hardware Console', icon: Gamepad2, color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20' },
    leather_bound: { label: 'Leather Edition', icon: Award, color: 'bg-amber-600/10 text-amber-700 dark:text-amber-300 border-amber-600/20' },
    hardcover: { label: 'Hardcover', icon: BookOpen, color: 'bg-stone-500/10 text-stone-600 dark:text-stone-300 border-stone-500/20' },
    paperback: { label: 'Paperback', icon: BookOpen, color: 'bg-stone-500/10 text-stone-600 dark:text-stone-300 border-stone-500/20' }
  };

  const folderColorClasses: Record<string, { dot: string; badge: string }> = {
    amber: { dot: 'bg-amber-500', badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30' },
    emerald: { dot: 'bg-emerald-500', badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' },
    purple: { dot: 'bg-purple-500', badge: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30' },
    indigo: { dot: 'bg-indigo-500', badge: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' },
    rose: { dot: 'bg-rose-500', badge: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30' },
    teal: { dot: 'bg-teal-500', badge: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/30' },
    sky: { dot: 'bg-sky-500', badge: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30' },
    stone: { dot: 'bg-stone-500', badge: 'bg-stone-500/10 text-stone-700 dark:text-stone-300 border-stone-500/30' }
  };

  const currentFolder = collectionFolders.find((f: CollectionFolder) => f.id === selectedFolderId);

  return (
    <div id="customer-digital-library-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Top Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-200 dark:border-stone-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={() => setCurrentView('store')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-stone-500 hover:text-amber-600 dark:text-stone-400 dark:hover:text-amber-400 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Bookstore</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700">•</span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Direct In-Browser Streaming Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-3">
            <span>Customer Digital Library</span>
            <span className="text-xs font-sans font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
              /my-library
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-2xl">
            Stream your purchased audio, video, and PDF editions with zero latency. Organize your titles into Collection Folders and export local JSON backups at any time.
          </p>
        </div>

        {/* Action Controls: Export Backup & Stats */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Backup Export Button */}
          <div className="flex items-center gap-1.5">
            <button
              id="export-library-json-btn"
              onClick={exportLibraryBackupJson}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer"
              title="Export purchased content metadata (titles, authors, formats) as local JSON backup"
            >
              <Download className="w-4 h-4" />
              <span>Export Backup (JSON)</span>
            </button>

            <button
              id="preview-library-json-btn"
              onClick={() => setIsBackupModalOpen(true)}
              className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition cursor-pointer"
              title="Inspect Raw Backup JSON"
            >
              <FileJson className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />

          {/* Stats Chips */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center min-w-[76px]">
              <div className="text-base font-bold font-mono text-amber-600 dark:text-amber-400">
                {library.length}
              </div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400 uppercase font-semibold">
                Editions
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center min-w-[76px]">
              <div className="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">
                {collectionFolders.length}
              </div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400 uppercase font-semibold">
                Folders
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-center min-w-[76px]">
              <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>R2</span>
              </div>
              <div className="text-[9px] text-stone-500 dark:text-stone-400 uppercase font-semibold">
                Vault
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main In-Browser Media Player Stage */}
      {activeItem ? (
        <div ref={playerStageRef} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-100 dark:bg-stone-850 p-4 rounded-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={activeItem.book.coverImage} 
                alt={activeItem.book.title} 
                className="w-12 h-16 object-cover rounded-lg shadow-sm shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-500 text-stone-950">
                    Now Playing / Reading
                  </span>
                  <span className="text-xs text-stone-500 dark:text-stone-400 font-mono">
                    Purchased on {new Date(activeItem.purchasedAt).toLocaleDateString()}
                  </span>

                  {/* Folder assignment tag on active player */}
                  <button
                    onClick={() => setItemToAssignFolder(activeItem)}
                    className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-stone-200 hover:bg-stone-300 dark:bg-stone-700 dark:hover:bg-stone-650 text-stone-700 dark:text-stone-200 transition cursor-pointer"
                    title="Change or set collection folder for this title"
                  >
                    <Folder className="w-3 h-3 text-amber-500" />
                    <span>{activeItem.folderName || 'Assign Folder'}</span>
                  </button>
                </div>
                <h2 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 truncate">
                  {activeItem.book.title}
                </h2>
                <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                  By {activeItem.book.author}
                </p>
              </div>
            </div>

            {/* In-Player Format Switcher Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
              <span className="text-[11px] font-semibold text-stone-500 mr-1 hidden md:inline">
                Player Mode:
              </span>
              {(['ebook', 'audiobook', 'videobook', 'manuscript'] as FormatType[]).map((fmt) => {
                const meta = formatLabels[fmt] || formatLabels.ebook;
                const Icon = meta.icon;
                const isSelected = currentStreamFormat === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => setPlayerFormatOverride(fmt)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-sm'
                        : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active In-Browser Player Component */}
          <div className="w-full">
            {currentStreamFormat === 'audiobook' || currentStreamFormat === 'musical_album' ? (
              <AudioMediaControls book={activeItem.book} format={currentStreamFormat} />
            ) : currentStreamFormat === 'videobook' ? (
              <VideoMediaControls book={activeItem.book} format={currentStreamFormat} />
            ) : currentStreamFormat === 'manuscript' ? (
              <PdfEbookReaderControls book={activeItem.book} format="manuscript" />
            ) : (
              <PdfEbookReaderControls book={activeItem.book} format="ebook" />
            )}
          </div>
        </div>
      ) : (
        /* Empty Library Welcome Banner */
        <div className="text-center py-16 px-6 rounded-3xl bg-stone-50 dark:bg-stone-900 border-2 border-dashed border-stone-300 dark:border-stone-800 space-y-5">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              Your Customer Digital Library is Ready
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              When you click "Buy Now" on any title in the bookstore, it lands here instantly with full audio, video, and PDF reader controls functioning directly in-browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                if (claimWelcomeReaderPass) claimWelcomeReaderPass();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Free Welcome Reader Pass</span>
            </button>
            <button
              onClick={() => setCurrentView('store')}
              className="px-5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold text-xs transition cursor-pointer"
            >
              Browse Bookstore Catalog
            </button>
          </div>
        </div>
      )}

      {/* Collection Folders Bar Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <h2 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
              Collection Folders
            </h2>
            <span className="text-xs text-stone-400">
              ({collectionFolders.length})
            </span>
          </div>

          <button
            id="create-collection-folder-btn"
            onClick={() => {
              setFolderToEdit(null);
              setIsCreateFolderModalOpen(true);
            }}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1.5 transition cursor-pointer py-1 px-2 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/30"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>+ New Folder</span>
          </button>
        </div>

        {/* Folders horizontal scroller */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {/* All Editions tab */}
          <button
            onClick={() => setSelectedFolderId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
              selectedFolderId === 'all'
                ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-xs'
                : 'bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <span>All Editions</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              selectedFolderId === 'all' ? 'bg-stone-950/20 text-stone-950' : 'bg-stone-200 dark:bg-stone-750 text-stone-600 dark:text-stone-400'
            }`}>
              {library.length}
            </span>
          </button>

          {/* Folder tabs */}
          {collectionFolders.map((folder: CollectionFolder) => {
            const isSelected = selectedFolderId === folder.id;
            const count = library.filter((i: LibraryItem) => i.folderId === folder.id).length;
            const col = folderColorClasses[folder.color] || folderColorClasses.amber;

            return (
              <div key={folder.id} className="relative group shrink-0 flex items-center">
                <button
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 border-stone-900 dark:border-stone-100 shadow-xs'
                      : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shrink-0`} />
                  <span>{folder.name}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                    isSelected 
                      ? 'bg-white/20 dark:bg-black/20 text-white dark:text-stone-900' 
                      : 'bg-stone-200 dark:bg-stone-750 text-stone-600 dark:text-stone-400'
                  }`}>
                    {count}
                  </span>
                </button>

                {/* Edit folder button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFolderToEdit(folder);
                    setIsCreateFolderModalOpen(true);
                  }}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 ml-0.5 opacity-0 group-hover:opacity-100 transition cursor-pointer"
                  title={`Edit "${folder.name}" folder`}
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Library Shelf Section */}
      <div className="space-y-4 pt-2 border-t border-stone-200 dark:border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
                {currentFolder ? `${currentFolder.name} Shelf` : 'Your Purchased Shelf'}
              </h2>
              <span className="text-xs font-mono text-stone-500 font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800">
                {filteredLibrary.length} item{filteredLibrary.length === 1 ? '' : 's'}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              {currentFolder?.description || 'Click "Stream Now" on any edition to load it into the active in-browser player above.'}
            </p>
          </div>

          {/* Real-time search bar within library */}
          <div className="relative flex-1 sm:w-80 md:w-96 max-w-md">
            <div className="relative flex items-center">
              <Search className={`w-4 h-4 absolute left-3 transition-colors pointer-events-none ${
                librarySearchQuery ? 'text-amber-500' : 'text-stone-400'
              }`} />
              <input
                id="library-realtime-search-input"
                type="text"
                placeholder="Filter by title or author name..."
                value={librarySearchQuery}
                onChange={(e) => setLibrarySearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setLibrarySearchQuery('');
                }}
                className="w-full bg-stone-100 dark:bg-stone-850 hover:bg-stone-50 dark:hover:bg-stone-800/80 focus:bg-white dark:focus:bg-stone-900 border border-stone-300 dark:border-stone-700 focus:border-amber-500 dark:focus:border-amber-500 rounded-xl pl-9 pr-24 py-2 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 outline-none transition shadow-inner focus:ring-2 focus:ring-amber-500/20"
                aria-label="Filter library by title or author name in real-time"
              />
              
              {/* Right controls inside input: counter badge and clear button */}
              <div className="absolute right-2 flex items-center gap-1.5">
                {librarySearchQuery.trim() && (
                  <>
                    <span 
                      id="search-match-count-badge"
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold transition-all ${
                        filteredLibrary.length > 0 
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/50'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300/50'
                      }`}
                    >
                      {filteredLibrary.length} {filteredLibrary.length === 1 ? 'match' : 'matches'}
                    </span>
                    <button
                      id="clear-library-search-btn"
                      type="button"
                      onClick={() => setLibrarySearchQuery('')}
                      className="p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-750 transition cursor-pointer"
                      title="Clear search (Esc)"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Real-time search banner when query is active */}
        {librarySearchQuery.trim() && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="text-stone-800 dark:text-stone-200">
                Filtered by <strong className="text-amber-700 dark:text-amber-400">"{librarySearchQuery}"</strong> (title or author):
                showing <strong className="font-mono">{filteredLibrary.length}</strong> of {library.length} book{library.length === 1 ? '' : 's'}
              </span>
            </div>
            <button
              onClick={() => setLibrarySearchQuery('')}
              className="text-xs text-amber-700 dark:text-amber-300 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Clear search filter</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Format Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All Formats' },
            { id: 'ebook', label: 'eBooks & PDFs' },
            { id: 'audiobook', label: 'Audiobooks' },
            { id: 'videobook', label: '4K Video Books' },
            { id: 'musical_album', label: 'Musical Scores' },
            { id: 'manuscript', label: 'Archival Manuscripts' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setActiveFormatFilter(pill.id as any)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                activeFormatFilter === pill.id
                  ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold'
                  : 'bg-stone-100 dark:bg-stone-850 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Library Items Grid or Empty Folder State */}
        {filteredLibrary.length === 0 ? (
          librarySearchQuery.trim() ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-stone-50 dark:bg-stone-850/50 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <div className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  No books matching "{librarySearchQuery}"
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  We could not find any titles or author names matching your search query in your library.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <button
                  id="empty-state-clear-search-btn"
                  onClick={() => setLibrarySearchQuery('')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear Search Filter</span>
                </button>
                {activeFormatFilter !== 'all' && (
                  <button
                    onClick={() => setActiveFormatFilter('all')}
                    className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold text-xs transition cursor-pointer"
                  >
                    Reset Format Filter
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-stone-50 dark:bg-stone-850/50 border border-stone-200 dark:border-stone-800 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-400 mx-auto flex items-center justify-center">
                <Folder className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto space-y-1">
                <div className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                  {selectedFolderId !== 'all' ? `No editions in "${currentFolder?.name}" yet` : 'No editions found'}
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {selectedFolderId !== 'all' 
                    ? 'Switch back to "All Editions" to see your complete catalog and click the folder icon on any card to organize it here.'
                    : 'Try adjusting your search query or format filter.'}
                </p>
              </div>
              {selectedFolderId !== 'all' && (
                <button
                  onClick={() => setSelectedFolderId('all')}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition cursor-pointer"
                >
                  View All Editions ({library.length})
                </button>
              )}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLibrary.map((item: LibraryItem) => {
              const meta = formatLabels[item.format] || formatLabels.ebook;
              const Icon = meta.icon;
              const isCurrentlyPlaying = activeItem?.id === item.id;
              const itemFolder = item.folderId 
                ? collectionFolders.find((f: CollectionFolder) => f.id === item.folderId)
                : null;
              const folderCol = itemFolder ? (folderColorClasses[itemFolder.color] || folderColorClasses.amber) : null;

              return (
                <div 
                  key={item.id}
                  className={`rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                    isCurrentlyPlaying
                      ? 'bg-amber-500/5 dark:bg-amber-500/10 border-amber-500 shadow-md ring-1 ring-amber-500'
                      : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-amber-400/60'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <img 
                        src={item.book.coverImage} 
                        alt={item.book.title} 
                        className="w-16 h-24 object-cover rounded-xl shadow-sm shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.color}`}>
                            <Icon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        </div>
                        <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug">
                          {highlightMatch(item.book.title, librarySearchQuery)}
                        </h3>
                        <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                          {highlightMatch(item.book.author, librarySearchQuery)}
                        </p>
                      </div>
                    </div>

                    {/* Folder Assignment Badge & Progress */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <button
                        onClick={() => setItemToAssignFolder(item)}
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-medium border transition cursor-pointer truncate max-w-[180px] ${
                          itemFolder
                            ? folderCol?.badge || 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 border-dashed border-stone-300 dark:border-stone-700'
                        }`}
                        title="Click to organize this edition into a folder"
                      >
                        <Folder className="w-3 h-3 shrink-0 text-amber-500" />
                        <span className="truncate">{itemFolder?.name || '+ Assign Folder'}</span>
                      </button>

                      <div className="text-[10px] font-mono text-stone-400">
                        {item.lastProgress || 15}% read
                      </div>
                    </div>

                    {/* Reading / Listening Progress Bar */}
                    <div className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${item.lastProgress || 15}%` }}
                      />
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="pt-4 border-t border-stone-100 dark:border-stone-800/80 flex items-center gap-2">
                    <button
                      onClick={() => handleSelectBookForStreaming(item)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        isCurrentlyPlaying
                          ? 'bg-amber-500 text-stone-950 shadow-sm'
                          : 'bg-stone-900 hover:bg-stone-800 dark:bg-stone-800 dark:hover:bg-stone-700 text-white'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentlyPlaying ? 'Loaded in Player' : 'Stream Now'}</span>
                    </button>

                    <a
                      href={item.book.chapterOnePreview?.content ? '#' : '#'}
                      onClick={(e) => {
                        e.preventDefault();
                        alert(`Initiating verified DRM-Free token download for "${item.book.title}" (${meta.label}) via Cloudflare R2.`);
                      }}
                      className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 transition cursor-pointer"
                      title="Download DRM-Free Signed Copy"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <LibraryBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        library={library}
        collectionFolders={collectionFolders}
        onDownload={exportLibraryBackupJson}
        userEmail={user?.email}
        userName={user?.displayName}
      />

      <CollectionFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => {
          setIsCreateFolderModalOpen(false);
          setFolderToEdit(null);
        }}
        folderToEdit={folderToEdit}
        onSave={(name, color, description) => {
          if (folderToEdit) {
            updateCollectionFolder(folderToEdit.id, name, color);
          } else {
            createCollectionFolder(name, color, description);
          }
        }}
        onDelete={folderToEdit ? (id) => deleteCollectionFolder(id) : undefined}
      />

      <AssignFolderModal
        isOpen={!!itemToAssignFolder}
        onClose={() => setItemToAssignFolder(null)}
        item={itemToAssignFolder}
        folders={collectionFolders}
        onAssign={(itemId, folderId) => assignItemToFolder(itemId, folderId)}
        onCreateFolderClick={() => {
          setFolderToEdit(null);
          setIsCreateFolderModalOpen(true);
        }}
      />
    </div>
  );
};

