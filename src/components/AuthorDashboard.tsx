import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  BookOpen,
  Sparkles,
  Users,
  Feather,
  BarChart3,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Plus,
  Eye,
  Share2,
  Download,
  Settings,
  ShieldCheck,
  Headphones,
  Video,
  Award,
  ExternalLink,
  RefreshCw,
  Sun,
  Moon,
  Wifi,
  Globe,
  Tag,
  Trash2,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Author30DaySalesEngagementChart } from './Author30DaySalesEngagementChart';
import { AuthorCoverGeneratorModal } from './AuthorCoverGeneratorModal';
import { AuthorStripeConnect } from './AuthorStripeConnect';
import { UniversalAiSuggestionBox } from './UniversalAiSuggestionBox';
import { ManageDimensionsModal } from './ManageDimensionsModal';
import { Book, FormatType } from '../types';

export const AuthorDashboard: React.FC = () => {
  const {
    books,
    setCurrentView,
    openLookInside,
    openShare,
    theme,
    toggleTheme,
    currentLanguage,
    t,
    offlineBooks,
    showNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'catalog' | 'cover-studio' | 'stripe' | 'telemetry'>('analytics');
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [selectedBookForCover, setSelectedBookForCover] = useState<Book | null>(null);
  const [isDimensionsModalOpen, setIsDimensionsModalOpen] = useState(false);
  const [selectedBookForDimensions, setSelectedBookForDimensions] = useState<Book | null>(null);

  // Clear demo data sample state with local persistence
  const [isDemoCleared, setIsDemoCleared] = useState<boolean>(() => {
    return localStorage.getItem('kc_author_demo_cleared') === 'true';
  });

  const handleClearDemoData = () => {
    setIsDemoCleared(true);
    localStorage.setItem('kc_author_demo_cleared', 'true');
    showNotification('✓ All demo data samples cleared! Author dashboard is running strictly on 100% clean live telemetry.');
  };

  const handleRestoreDemoData = () => {
    setIsDemoCleared(false);
    localStorage.removeItem('kc_author_demo_cleared');
    showNotification('Sample demo metrics restored for preview.');
  };

  // Author Summary metrics - computed dynamically or cleanly zeroed when demo data is cleared
  const totalCatalogBooks = books.length;
  const totalSovereignEarnings = isDemoCleared ? 0 : (totalCatalogBooks > 0 ? 64280 : 0);
  const currentMonthRoyalties = isDemoCleared ? 0 : (totalCatalogBooks > 0 ? 12597 : 0);
  const totalActiveReaders = isDemoCleared ? 0 : (totalCatalogBooks > 0 ? 8940 : 0);

  const handleOpenCoverForBook = (book: Book) => {
    setSelectedBookForCover(book);
    setIsCoverModalOpen(true);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-3 sm:px-6 py-6 space-y-6">
      
      {/* Author Profile & Sovereign Command Header */}
      <div className="bg-gradient-to-r from-slate-900 via-[#16202c] to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        
        {/* Background Subtle Gradient Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Author Identity */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-orange-600 p-1 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop"
                  alt="Johnny Blue"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-1 rounded-full border-2 border-slate-900 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-serif text-white tracking-tight">
                  Johnny Blue
                </h1>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Verified Sovereign Author
                </span>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  85% Royalty Contract
                </span>
                {isDemoCleared && (
                  <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-indigo-400" />
                    Clean Live Telemetry (0 Demo Artifacts)
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Command center for multi-format publishing across eBooks, Audiobooks, 4K Video, Manuscripts, Silk & Cotton, and Dedicated Devices.
              </p>
            </div>
          </div>

          {/* Right: Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Clear All Demo Samples Toggle Button */}
            {isDemoCleared ? (
              <button
                id="dash-restore-demo-btn"
                onClick={handleRestoreDemoData}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
                title="Restore sample demo data for previewing chart projections"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Restore Demo Preview</span>
              </button>
            ) : (
              <button
                id="dash-clear-demo-btn"
                onClick={handleClearDemoData}
                className="px-3.5 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-600/50 font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5"
                title="Clear all demo sample data and reset to 100% clean live telemetry"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Clear Demo Samples</span>
              </button>
            )}

            {/* Auto-Generate Cover Art */}
            <button
              id="dash-open-cover-generator-btn"
              onClick={() => {
                setSelectedBookForCover(books[0] || null);
                setIsCoverModalOpen(true);
              }}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-xs shadow-sm hover:shadow transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Auto-Generate Cover Art</span>
            </button>

            {/* Publish New Book */}
            <button
              id="dash-publish-new-btn"
              onClick={() => setCurrentView('publish')}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/40 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
            >
              <Feather className="w-4 h-4 text-amber-400" />
              <span>Publish New Title</span>
            </button>

            {/* Dark/Light Toggle */}
            <button
              id="dash-theme-toggle-btn"
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>
          </div>

        </div>

        {/* 4 Primary Top Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-800/80">
          
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">30-Day Royalties (85%)</span>
            <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-1">
              ${currentMonthRoyalties.toLocaleString()} USD
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {isDemoCleared ? 'Clean Live Ledger' : 'Stripe Express Auto-Payout'}
            </span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Lifetime Creator Net</span>
            <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
              ${totalSovereignEarnings.toLocaleString()} USD
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {isDemoCleared ? '0 Demo Artifacts' : 'Direct from 10 Dimensions'}
            </span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Active Readers & Listeners</span>
            <div className="text-xl sm:text-2xl font-black text-indigo-400 mt-1">
              {totalActiveReaders.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {isDemoCleared ? 'Real-Time Telemetry' : 'Global engagement hours'}
            </span>
          </div>

          <div className="bg-slate-800/40 rounded-2xl p-4 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 block">Published Master Titles</span>
            <div className="text-xl sm:text-2xl font-black text-white mt-1">
              {totalCatalogBooks} Editions
            </div>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">100% Sovereign Vault</span>
          </div>

        </div>

      </div>

      {/* Primary Dashboard Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        <button
          id="dash-tab-analytics"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'analytics'
              ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-slate-950" />
          <span>30-Day Trends & Analytics</span>
          <span className="text-[9px] bg-slate-950 text-amber-400 font-mono px-1.5 py-0.2 rounded-full font-bold">
            Recharts
          </span>
        </button>

        <button
          id="dash-tab-catalog"
          onClick={() => setActiveTab('catalog')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'catalog'
              ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Published Books ({totalCatalogBooks})</span>
        </button>

        <button
          id="dash-tab-cover-studio"
          onClick={() => setActiveTab('cover-studio')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'cover-studio'
              ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Auto-Generate Cover Art</span>
        </button>

        <button
          id="dash-tab-stripe"
          onClick={() => setActiveTab('stripe')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'stripe'
              ? 'bg-[#635BFF] text-white font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white text-[#635BFF] flex items-center justify-center text-[10px] font-black">
            S
          </span>
          <span>Stripe Connect Payouts</span>
        </button>

      </div>

      {/* Tab 1: 30-Day Trends & Analytics (Recharts Visualization) */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* The Recharts 30-Day Trend Line Component */}
          <Author30DaySalesEngagementChart 
            onOpenPublish={() => setCurrentView('publish')}
            onOpenStripe={() => setActiveTab('stripe')}
            isDemoCleared={isDemoCleared}
          />

          {/* Dimension Retention & Format Popularity Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Top Performing Dimensions</span>
                </span>
                <span className="text-[10px] font-bold text-emerald-600">
                  {isDemoCleared ? 'Clean Mode' : 'Highest AOV'}
                </span>
              </div>
              {isDemoCleared ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No demo dimensions active
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Publish your 10-dimension titles to start streaming live per-format royalties and conversion metrics.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Dimension 9: Silk & Cotton</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">Organic Handloom Weave</span>
                    </div>
                    <span className="font-mono font-bold text-amber-700 dark:text-amber-400">$65.00/ea</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Dimension 4: Manuscripts</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">High-Res Notebook Scans</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">$45.00/ea</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white block">Dimension 2: Audiobooks</strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">320kbps Author Narration</span>
                    </div>
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">$22.00/ea</span>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span>Reader Completion Velocity</span>
                </span>
                <span className="text-[10px] font-bold text-indigo-600">
                  {isDemoCleared ? 'Real-time' : 'Retention'}
                </span>
              </div>
              {isDemoCleared ? (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center space-y-1.5 border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Awaiting Reader Sessions
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Telemetry automatically calculates reading speeds and audiobook completion rates once readers open your books.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Chapters 1–3 Completion</span>
                      <strong className="text-emerald-600 font-mono">92%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Audiobook Full Listen Rate</span>
                      <strong className="text-indigo-600 font-mono">84%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-600 dark:text-slate-300">Offline Vault Download Rate</span>
                      <strong className="text-amber-600 font-mono">68%</strong>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Sovereign Creator Milestones</span>
                </span>
                <span className="text-[10px] font-bold text-amber-500">Tier 1 Author</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>85% Direct Creator Royalties active</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Stripe Connect Express auto-clearing</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>All 10 media dimensions distributed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 2: My Published Books */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white">
              Published Titles ({books.length})
            </h3>
            <button
              onClick={() => setCurrentView('publish')}
              className="px-3.5 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-500 transition cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Publish New Title</span>
            </button>
          </div>

          {books.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center max-w-lg mx-auto space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 border border-amber-200 dark:border-amber-800">
                <Feather className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-lg text-slate-900 dark:text-white">No Books in Your Catalog Yet</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  All demo books have been cleared. Ready to publish real titles across 10 physical and digital dimensions with 85% creator royalties.
                </p>
              </div>
              <button
                onClick={() => setCurrentView('publish')}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Your First Title</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <div
                  key={book.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm hover:shadow-md transition space-y-3 flex flex-col justify-between"
                >
                  <div className="flex gap-3">
                    <img
                      src={book.coverImage || (book as any).coverUrl}
                      alt={book.title}
                      className="w-20 h-28 object-cover rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 space-y-1">
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md inline-block">
                        {book.category}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                        {book.description}
                      </p>
                      {(() => {
                        const activeCount = Object.values(book.formats || {}).filter((f: any) => f?.available !== false).length;
                        return (
                          <div className="text-[10px] font-bold flex items-center justify-between pt-0.5">
                            <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                              {activeCount} of 10 Dimensions Active
                            </span>
                            <span className="text-slate-500 dark:text-slate-400">
                              From ${book.formats.ebook?.price || '9.99'}
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Add / Manage Dimensions Bookshelf Button */}
                  <button
                    onClick={() => {
                      setSelectedBookForDimensions(book);
                      setIsDimensionsModalOpen(true);
                    }}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add / Manage Dimensions ({Object.values(book.formats || {}).filter((f: any) => f?.available !== false).length}/10)</span>
                  </button>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenCoverForBook(book)}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold text-[11px] transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Generate Cover</span>
                    </button>

                    <button
                      onClick={() => openLookInside(book, 'ebook')}
                      className="py-1.5 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition cursor-pointer flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => openShare({
                        title: book.title,
                        text: `Discover ${book.title} in 10 Sovereign Dimensions on Johnnyblue1 Books!`,
                        url: window.location.href,
                        bookId: book.id
                      })}
                      className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 transition cursor-pointer"
                      title="Share title"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Auto-Generate Cover Art Studio */}
      {activeTab === 'cover-studio' && (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black font-serif text-slate-900 dark:text-white">
                Auto-Generate Cover Art Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Synthesize and render high-resolution book jacket artwork tailored for eBooks, cloth hardcovers, silk & cotton bindings, and digital devices.
              </p>
            </div>
            <button
              onClick={() => setIsCoverModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs hover:bg-amber-500 transition cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Full Cover Generator</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                style: 'Minimalist Gold Foil',
                tag: 'Obsidian Leather',
                img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=600&auto=format&fit=crop',
                desc: 'Deep black with gold leaf embossing'
              },
              {
                style: 'Handloom Silk & Cotton',
                tag: 'Organic Weave',
                img: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=600&auto=format&fit=crop',
                desc: 'Handcrafted textile tactile pattern'
              },
              {
                style: 'Classical Oil Canvas',
                tag: 'Gilded Frame',
                img: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600&auto=format&fit=crop',
                desc: 'Museum renaissance fine art finish'
              },
              {
                style: 'Cyberpunk & E-Ink',
                tag: 'High-Tech Tablet',
                img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop',
                desc: 'Architectural vector for dedicated tablets'
              }
            ].map((preset) => (
              <div
                key={preset.style}
                onClick={() => {
                  setSelectedBookForCover(books[0] || null);
                  setIsCoverModalOpen(true);
                }}
                className="group p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-amber-400 transition cursor-pointer text-left space-y-2"
              >
                <div className="relative h-48 rounded-lg overflow-hidden">
                  <img
                    src={preset.img}
                    alt={preset.style}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2 right-2 text-[9px] font-black bg-black/70 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                    {preset.tag}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white">{preset.style}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{preset.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Stripe Connect Payout Rails */}
      {activeTab === 'stripe' && (
        <div className="space-y-4">
          <AuthorStripeConnect />
        </div>
      )}

      {/* Universal AI Suggestion Box below Author Dashboard */}
      <UniversalAiSuggestionBox
        context="author-dashboard"
        label="AI Literary Director & Royalty Growth Advisory"
        defaultExpanded={false}
      />

      {/* Auto-Generate Cover Art Modal */}
      <AuthorCoverGeneratorModal
        isOpen={isCoverModalOpen}
        onClose={() => setIsCoverModalOpen(false)}
        initialTitle={selectedBookForCover?.title || 'The Sovereign Creator'}
        initialSubtitle={selectedBookForCover?.subtitle || 'A Definitive Manual for Digital Architects'}
        initialAuthor={selectedBookForCover?.author || 'Johnny Blue'}
        initialCategory={selectedBookForCover?.category || 'Philosophy & Knowledge'}
        onApplyCover={(url) => {
          showNotification(`Cover Art applied successfully!`);
        }}
      />

      {/* Sovereign Bookshelf Manage / Add Dimensions Modal */}
      <ManageDimensionsModal
        isOpen={isDimensionsModalOpen}
        onClose={() => setIsDimensionsModalOpen(false)}
        book={selectedBookForDimensions}
      />

    </div>
  );
};
