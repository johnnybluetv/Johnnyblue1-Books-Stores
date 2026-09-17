import React, { useState } from 'react';
import { 
  Library, 
  BookOpen, 
  Headphones, 
  Video, 
  FileText, 
  DownloadCloud, 
  Play, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Bookmark,
  Trash2,
  Clock,
  Search,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType, LibraryItem } from '../types';
import { requestBookAccess } from '../services/secureDeliveryApi';

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
            className="bg-amber-300 text-slate-950 font-bold px-0.5 rounded"
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

export const CloudLibraryView: React.FC = () => {
  const {
    library,
    openLookInside,
    setActiveBook,
    setCurrentView,
    purchasedSet,
    setApiInspectorOpen,
    audioBookmarks,
    deleteAudioBookmark,
    openAudiobookAtBookmark
  } = useStore();

  const [activeTab, setActiveTab] = useState<'items' | 'bookmarks'>('items');
  const [filterFormat, setFilterFormat] = useState<'all' | FormatType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  const filteredLibrary = library.filter((item) => {
    const matchesFormat = filterFormat === 'all' || item.format === filterFormat;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || 
      (item.book.title && item.book.title.toLowerCase().includes(query)) ||
      (item.book.author && item.book.author.toLowerCase().includes(query));
    return matchesFormat && matchesSearch;
  });

  const handleDownloadFullMedia = async (item: LibraryItem) => {
    setDownloadingId(item.id);
    try {
      const response = await requestBookAccess(
        {
          bookId: item.bookId,
          format: item.format,
          isSampleOnly: false,
          userId: 'usr_kc_verified_884'
        },
        purchasedSet
      );

      if (response.success) {
        setDownloadSuccessMessage(`Generated 15-min Cloudflare R2 signed link: ${response.tokenSignature.slice(0, 16)}...`);
        setTimeout(() => setDownloadSuccessMessage(null), 5000);
      }
    } finally {
      setDownloadingId(null);
    }
  };

  const getFormatBadge = (format: FormatType) => {
    switch (format) {
      case 'ebook':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">eBook (EPUB/PDF)</span>;
      case 'audiobook':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Audiobook (MP3)</span>;
      case 'videobook':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">Video Book (4K)</span>;
      case 'manuscript':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Raw Manuscript (DOCX)</span>;
      case 'hardcover':
        return <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded">Clothbound Hardcover</span>;
      case 'papercover':
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Paper Cover</span>;
      case 'pendrive_sd':
        return <span className="bg-purple-100 text-purple-900 text-[10px] font-bold px-2 py-0.5 rounded">Pendrive / SD (64GB)</span>;
      case 'musical_album':
        return <span className="bg-teal-100 text-teal-900 text-[10px] font-bold px-2 py-0.5 rounded">Musical Album</span>;
      case 'silk_cotton':
        return <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">Silk & Cotton Edition</span>;
      case 'digital_device':
        return <span className="bg-indigo-100 text-indigo-900 text-[10px] font-bold px-2 py-0.5 rounded">Dedicated Digital Device</span>;
    }
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-900 py-8 px-4 sm:px-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Header Banner */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Library className="w-5 h-5 text-amber-600" />
              <h1 className="text-2xl font-bold font-serif text-slate-900">
                Your Knowledge Centa Cloud Library
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Access your permanently owned multi-format titles, synchronized reading progress, and signed offline downloads.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setApiInspectorOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 transition cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Inspect Signed Delivery API</span>
            </button>

            <button
              onClick={() => setCurrentView('store')}
              className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              Browse Bookstore
            </button>
          </div>
        </div>

        {/* Download notification */}
        {downloadSuccessMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{downloadSuccessMessage}</span>
            </div>
            <button
              onClick={() => setApiInspectorOpen(true)}
              className="underline font-bold hover:text-emerald-700 cursor-pointer"
            >
              View in API Inspector
            </button>
          </div>
        )}

        {/* Navigation Tabs: Purchased Titles vs Audio Bookmarks */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('items')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'items'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Library className="w-4 h-4 text-amber-600" />
            <span>Purchased Titles ({library.length})</span>
          </button>

          <button
            type="button"
            id="library-audio-bookmarks-tab"
            onClick={() => setActiveTab('bookmarks')}
            className={`flex items-center gap-2 pb-2 px-1 text-sm font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'border-amber-500 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-600" />
            <span>Audio Bookmarks ({audioBookmarks.length})</span>
          </button>
        </div>

        {activeTab === 'bookmarks' ? (
          /* Audio Bookmarks Gallery */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-amber-500" />
                  <span>Saved Audio Timestamps & Study Notes</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Click any saved audio bookmark to immediately jump back to that timestamp with seamless playback.
                </p>
              </div>
            </div>

            {audioBookmarks.length === 0 ? (
              <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
                <div className="w-14 h-14 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-600">
                  <Bookmark className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-base">No audio bookmarks yet</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    While listening to any audiobook sample or full audiobook, click the <strong className="text-amber-600 font-semibold">"Bookmark"</strong> button to capture timestamps and personal notes.
                  </p>
                </div>
                <button
                  onClick={() => setCurrentView('store')}
                  className="py-2 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow cursor-pointer transition"
                >
                  Listen to Audiobook Samples
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audioBookmarks.map((bm) => {
                  const tagColor = 
                    bm.colorTag === 'emerald' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                    bm.colorTag === 'purple' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                    bm.colorTag === 'rose' ? 'bg-rose-50 text-rose-800 border-rose-300' :
                    bm.colorTag === 'blue' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                    'bg-amber-50 text-amber-800 border-amber-300';

                  return (
                    <div
                      key={bm.id}
                      className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-3"
                    >
                      <div className="flex gap-3 items-start">
                        <img
                          src={bm.bookCoverImage}
                          alt={bm.bookTitle}
                          className="w-16 h-20 object-cover rounded shadow-sm shrink-0 border border-slate-200"
                        />
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border font-mono ${tagColor}`}>
                            <Clock className="w-3 h-3" />
                            {bm.formattedTimestamp}
                          </span>
                          <h4 className="font-bold text-sm text-slate-900 truncate" title={bm.bookTitle}>
                            {bm.bookTitle}
                          </h4>
                          <p className="text-[11px] text-slate-500 truncate">
                            by {bm.author}
                          </p>
                          {bm.note && (
                            <p className="text-xs text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-100 line-clamp-2 mt-1">
                              "{bm.note}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => openAudiobookAtBookmark(bm)}
                          className="flex-1 py-1.5 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Resume at {bm.formattedTimestamp}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteAudioBookmark(bm.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                          title="Delete audio bookmark"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
        {/* Search Bar & Media Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
          {/* Format Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
            <span className="text-slate-500 font-bold shrink-0">Filter:</span>
            {(['all', 'ebook', 'audiobook', 'videobook', 'manuscript', 'hardcover', 'papercover', 'pendrive_sd', 'musical_album', 'silk_cotton', 'digital_device'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => setFilterFormat(fmt)}
                className={`px-3 py-1 rounded-full font-semibold capitalize whitespace-nowrap transition cursor-pointer ${
                  filterFormat === fmt
                    ? 'bg-[#131921] text-amber-400 shadow'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {fmt === 'all' 
                  ? `All (${library.length})` 
                  : fmt === 'pendrive_sd' ? 'Pendrive / SD'
                  : fmt === 'musical_album' ? 'Musical Album'
                  : fmt === 'silk_cotton' ? 'Silk & Cotton'
                  : fmt === 'digital_device' ? 'Dedicated Device'
                  : fmt}
              </button>
            ))}
          </div>

          {/* Real-time search input */}
          <div className="relative sm:w-72 md:w-80 shrink-0">
            <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors ${
              searchQuery ? 'text-amber-600' : 'text-slate-400'
            }`} />
            <input
              id="cloud-library-realtime-search-input"
              type="text"
              placeholder="Filter by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-amber-500 rounded-xl pl-9 pr-20 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none transition focus:ring-2 focus:ring-amber-500/20"
              aria-label="Filter cloud library by title or author name"
            />
            {searchQuery.trim() && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300/60">
                  {filteredLibrary.length}
                </span>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200 transition cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Active Search Banner */}
        {searchQuery.trim() && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span>
              Searching library for <strong className="text-amber-950">"{searchQuery}"</strong> (title or author): found <strong>{filteredLibrary.length}</strong> of {library.length} book{library.length === 1 ? '' : 's'}.
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-amber-800 hover:underline font-bold text-xs cursor-pointer flex items-center gap-1"
            >
              <span>Clear Filter</span>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Library Items Grid */}
        {filteredLibrary.length === 0 ? (
          searchQuery.trim() ? (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-600">
                <Search className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">No books matching "{searchQuery}"</h3>
                <p className="text-xs text-slate-500">
                  No titles or author names matched your search term in your purchased library.
                </p>
              </div>
              <button
                onClick={() => setSearchQuery('')}
                className="py-2 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs cursor-pointer transition"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center space-y-4 max-w-md mx-auto">
              <div className="w-14 h-14 bg-amber-50 rounded-full mx-auto flex items-center justify-center text-amber-600">
                <Library className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">Your collection is empty in this view</h3>
                <p className="text-xs text-slate-500">
                  Explore Johnnyblue1 Books Stores and add multi-format books to your library.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('store')}
                className="py-2 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow cursor-pointer transition"
              >
                Browse Catalogue
              </button>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLibrary.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-20 h-28 object-cover rounded shadow shrink-0 cursor-pointer"
                    onClick={() => {
                      setActiveBook(item.book);
                      setCurrentView('book-detail');
                    }}
                  />

                  {/* Details */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div>{getFormatBadge(item.format)}</div>
                    <h3 
                      onClick={() => {
                        setActiveBook(item.book);
                        setCurrentView('book-detail');
                      }}
                      className="font-bold text-sm text-slate-900 line-clamp-2 hover:text-amber-700 cursor-pointer font-serif"
                    >
                      {highlightMatch(item.book.title, searchQuery)}
                    </h3>
                    <p className="text-xs text-slate-500">
                      by {highlightMatch(item.book.author, searchQuery)}
                    </p>
                    <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Full Access Unlocked</span>
                    </div>
                  </div>
                </div>

                {/* Media Playback Actions */}
                <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                  <button
                    onClick={() => openLookInside(item.book, item.format)}
                    className="w-full py-2 px-3 bg-[#131921] hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>Launch {item.format.toUpperCase()} Media</span>
                  </button>

                  <button
                    onClick={() => handleDownloadFullMedia(item)}
                    disabled={downloadingId === item.id}
                    className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <DownloadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {downloadingId === item.id ? 'Presigning R2 URL...' : 'Get 15-Min Signed Download URL'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
          </>
        )}

      </div>
    </div>
  );
};
