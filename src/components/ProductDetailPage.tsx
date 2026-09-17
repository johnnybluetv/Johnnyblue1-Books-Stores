import React, { useState } from 'react';
import { 
  Star, 
  BookOpen, 
  Headphones, 
  Video, 
  PenTool, 
  ShieldCheck, 
  Lock, 
  DownloadCloud, 
  Share2, 
  Check, 
  ChevronRight, 
  ChevronDown,
  Award, 
  Play, 
  Sparkles,
  Info,
  Clock,
  HardDrive,
  Users,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Layers,
  Music,
  Heart,
  Truck,
  Disc,
  Tablet,
  ArrowRight,
  MessageSquare,
  Bell,
  BellRing,
  Bot,
  BarChart3,
  Activity,
  Volume2,
  Printer,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book, FormatType } from '../types';
import { CustomerReviews } from './CustomerReviews';
import { BookChatAssistant } from './BookChatAssistant';
import { BookReadingAnalytics } from './BookReadingAnalytics';
import { AdSenseSlot } from './AdSenseSlot';
import { BookShareModal } from './BookShareModal';
import { BookPrintDossier } from './BookPrintDossier';
import { getPersonalizedGreeting } from '../services/greetingService';

export const ProductDetailPage: React.FC = () => {
  const {
    activeBook,
    activeFormat,
    setActiveFormat,
    addToCart,
    buyNow,
    openLookInside,
    openInCustomerLibrary,
    isBookPurchased,
    setCurrentView,
    setApiInspectorOpen,
    isInWishlist,
    toggleWishlist,
    setSelectedWaitlistDimension,
    isFollowingAuthor,
    toggleFollowAuthor,
    openAuthorSocialModal,
    getAuthorFollowedSocialCount,
    t,
    formatPrice,
    user,
    currentLanguage,
    showNotification
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'toc' | 'specs' | 'reviews' | 'ai-assistant' | 'analytics'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);
  const [selectedPreviewChapter, setSelectedPreviewChapter] = useState(0);

  const personalizedGreeting = getPersonalizedGreeting(user, currentLanguage);

  // Format click handlers adhering to user specifications:
  // 1. Hardcover & Paperback -> Draft2Digital book page of the author
  const handleOpenDraft2Digital = () => {
    const d2dUrl = activeBook.draft2DigitalUrl || 'https://www.draft2digital.com/book/';
    window.open(d2dUrl, '_blank');
  };

  // 2. Handwritten & Silk/Cotton -> Author WhatsApp pre-order
  const handlePreOrderWhatsApp = (formatName: string) => {
    const rawPhone = activeBook.authorWhatsapp || '+233555414967';
    const cleanPhone = rawPhone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `Hello ${activeBook.author}, I would like to pre-order the ${formatName} edition of your book "${activeBook.title}" on Knowledge Centa. Please let me know the reservation details.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  // 3. Musical Album & Digital Device -> Waiting list page for 4 dimensions
  const handleJoinWaitingList = (dimensionKey: string) => {
    setSelectedWaitlistDimension(dimensionKey);
    setCurrentView('waitlist');
  };

  const handleFormatSelect = (fmtKey: FormatType) => {
    setActiveFormat(fmtKey);
    if (!activeBook) return;
    if (fmtKey === 'hardcover' || fmtKey === 'papercover') {
      handleOpenDraft2Digital();
    } else if (fmtKey === 'manuscript' || fmtKey === 'silk_cotton') {
      handlePreOrderWhatsApp(activeBook.formats[fmtKey]?.name || fmtKey);
    } else if (fmtKey === 'musical_album' || fmtKey === 'digital_device') {
      handleJoinWaitingList(fmtKey);
    }
  };

  if (!activeBook) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4 shadow-sm border border-amber-200">
          <BookOpen className="w-8 h-8 text-amber-700" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">No Book Selected</h2>
        <p className="text-sm text-slate-600 max-w-md mb-6 leading-relaxed">
          The catalog is currently cleared for authors and readers to publish and stream real 10-dimension publications.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setCurrentView('publish')}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm rounded-full shadow transition flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish a Book Now</span>
          </button>
          <button
            onClick={() => setCurrentView('store')}
            className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm rounded-full border border-slate-300 transition cursor-pointer"
          >
            Go to Storefront
          </button>
        </div>
      </div>
    );
  }

  const formatData = activeBook.formats[activeFormat] || activeBook.formats.ebook;
  const isPurchased = isBookPurchased(activeBook.id, activeFormat);
  const inWishlist = isInWishlist(activeBook.id);

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = `${activeBook.title} by ${activeBook.author}`;
    const shareText = `Discover "${activeBook.title}" by ${activeBook.author} on Johnnyblue1 Books Stores & Knowledge Centa. Available across 10 physical and digital dimensions!`;

    // Attempt Web Share API first
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        showNotification('✓ Book shared successfully!');
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') {
          return; // User dismissed share sheet
        }
      }
    }

    // Fallback to rich Social Share dialog
    setIsShareModalOpen(true);
  };

  const handlePrint = () => {
    showNotification(`Preparing print-friendly dossier for "${activeBook.title}"...`);
    // Brief timeout allows any UI focus or tooltip to settle cleanly before print dialog triggers
    setTimeout(() => {
      try {
        window.print();
      } catch (err) {
        console.warn('Direct print failed, opening on-screen print preview:', err);
        setIsPrintPreviewOpen(true);
      }
    }, 150);
  };

  const getFormatIcon = (format: FormatType) => {
    switch (format) {
      case 'ebook':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'audiobook':
        return <Headphones className="w-4 h-4 text-emerald-600" />;
      case 'videobook':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'manuscript':
        return <PenTool className="w-4 h-4 text-amber-600" />;
      case 'hardcover':
        return <Bookmark className="w-4 h-4 text-blue-800" />;
      case 'papercover':
        return <Layers className="w-4 h-4 text-slate-700" />;
      case 'pendrive_sd':
        return <HardDrive className="w-4 h-4 text-purple-700" />;
      case 'musical_album':
        return <Music className="w-4 h-4 text-emerald-700" />;
      case 'silk_cotton':
        return <Sparkles className="w-4 h-4 text-amber-700" />;
      case 'digital_device':
        return <Tablet className="w-4 h-4 text-indigo-600" />;
    }
  };

  const isPhysicalFormat = ['hardcover', 'papercover', 'pendrive_sd', 'silk_cotton', 'digital_device'].includes(activeFormat);

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 pb-20">
      
      {/* ======================================================== */}
      {/* DEDICATED PRINT-FRIENDLY SPECIFICATION & ARCHIVAL VIEW   */}
      {/* Activated automatically when window.print() is triggered */}
      {/* ======================================================== */}
      <BookPrintDossier
        book={activeBook}
        activeFormat={activeFormat}
        formatPrice={formatPrice}
      />

      <div className="screen-only">
        {/* Category Breadcrumbs & Personalized Reader Greeting */}
        <div className="max-w-[1600px] mx-auto px-4 py-2.5 text-xs text-slate-500 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1.5 shrink-0">
          <button 
            onClick={() => setCurrentView('store')}
            className="hover:underline hover:text-amber-700 cursor-pointer"
          >
            Books
          </button>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="hover:underline hover:text-amber-700 cursor-pointer">
            {activeBook.category}
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-800 font-medium truncate max-w-md">
            {activeBook.title}
          </span>
        </div>

        {/* Personalized Reader Greeting Pill */}
        <div className="hidden sm:flex items-center gap-1.5 bg-amber-50/90 border border-amber-200/80 text-amber-900 px-3 py-1 rounded-full text-xs font-semibold shrink-0 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
          <span>{personalizedGreeting.salutation}, {personalizedGreeting.name}!</span>
        </div>
      </div>

      {/* Main 3-Column Product Detail Layout */}
      <div className="max-w-[1600px] mx-auto px-4 py-3 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* COLUMN 1: LEFT COLUMN - High-res Book Cover & Sample CTA */}
        {/* ======================================================== */}
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-24 space-y-4">
          <div className="relative group bg-white p-3 rounded-lg shadow-sm border border-slate-200">
            
            {/* Book Cover Container with 3D perspective shadow */}
            <div className="relative aspect-[1/1.4] w-full max-w-[340px] mx-auto overflow-hidden rounded-md shadow-xl bg-slate-900 flex items-center justify-center">
              <img
                src={activeBook.coverImage}
                alt={activeBook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="eager"
              />

              {/* Amazon-style "Look Inside / Sample" overlay trigger */}
              <button
                id="book-look-inside-cover-btn"
                onClick={() => openLookInside(activeBook, activeFormat)}
                className="absolute top-3 left-3 bg-[#131921]/90 hover:bg-[#131921] text-white backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-lg border border-amber-400/40 flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer z-10"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Look Inside / 10-Dimension Studio</span>
              </button>

              {/* Active Format Pill on Cover */}
              <div className="absolute bottom-3 right-3 bg-slate-950/85 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded text-[11px] font-bold border border-slate-700 flex items-center gap-1">
                {getFormatIcon(activeFormat)}
                <span className="capitalize">{activeFormat.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Quick Sample Action Button below cover */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col gap-2">
              <button
                id="book-sample-cta-btn"
                onClick={() => openLookInside(activeBook, activeFormat)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md font-semibold text-xs border border-slate-300 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-600 text-amber-600" />
                <span>Experience {formatData.name} ({formatData.sampleLength || 'Preview'})</span>
              </button>

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  id="book-share-link-btn"
                  onClick={handleShare}
                  className="py-1.5 px-2 text-slate-700 hover:text-amber-900 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded transition"
                  title="Quick share via Web Share API & Social Platforms"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Share</span>
                </button>

                <button
                  id="book-print-btn"
                  onClick={handlePrint}
                  className="py-1.5 px-2 text-slate-700 hover:text-amber-900 text-[11px] font-semibold flex items-center justify-center gap-1 cursor-pointer border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 rounded transition"
                  title="Print book specification dossier (print-friendly layout)"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Print</span>
                </button>

                {/* Wishlist quick toggle */}
                <button
                  id="left-col-wishlist-toggle-btn"
                  onClick={() => toggleWishlist(activeBook)}
                  className={`py-1.5 px-2 rounded border text-[11px] flex items-center justify-center gap-1 cursor-pointer transition ${
                    inWishlist 
                      ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title={inWishlist ? 'Saved in Wish List' : 'Add to Wish List'}
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                  <span>{inWishlist ? 'Saved' : 'Wish List'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Author Profile Quick Teaser Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600" />
                <span>Author Profile</span>
              </h4>
              <button
                onClick={() => setCurrentView('author-profile')}
                className="text-amber-700 font-bold hover:underline flex items-center gap-0.5 text-[11px]"
              >
                <span>View Full Profile</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center text-sm shadow-sm shrink-0">
                {activeBook.author.slice(0, 1)}
              </div>
              <div className="space-y-0.5">
                <div 
                  onClick={() => setCurrentView('author-profile')}
                  className="font-bold text-slate-900 text-xs hover:text-amber-800 hover:underline cursor-pointer"
                >
                  {activeBook.author}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1">
                  {activeBook.authorBio}
                </div>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <Award className="w-3 h-3 text-amber-600" />
                Verified Sovereign Creator
              </span>
              <button
                id="pdp-sidebar-social-bio-btn"
                type="button"
                onClick={() => openAuthorSocialModal(activeBook.author)}
                className="text-pink-700 font-bold hover:underline flex items-center gap-1"
                title="View 6 social media handles & bio-data"
              >
                <Share2 className="w-3 h-3 text-pink-600" />
                <span>6 Socials & Bio ({getAuthorFollowedSocialCount(activeBook.author)}/6)</span>
              </button>
            </div>
          </div>

          {/* Publication Metadata Card */}
          <div className="bg-white p-4 rounded-lg border border-slate-200 text-xs space-y-2.5">
            <h4 className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Publication Metadata</span>
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Publisher</span>
                <span className="font-medium text-slate-800">{activeBook.publisher}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Release Date</span>
                <span className="font-medium text-slate-800">{activeBook.publishedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Print Pages</span>
                <span className="font-medium text-slate-800">{activeBook.pages} pages</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Standard ISBN</span>
                <span className="font-mono text-slate-800">{activeBook.isbn}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 2: CENTER COLUMN - Title, Author, 8 Dimensions    */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 xl:col-span-6 space-y-5">
          
          {/* Header Title Section */}
          <div className="space-y-1.5">
            {activeBook.bestSellerCategory && (
              <div className="inline-flex items-center gap-1 bg-amber-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded shadow-sm">
                <span>{activeBook.bestSellerCategory}</span>
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif leading-tight">
              {activeBook.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 font-medium">
              {activeBook.subtitle}
            </p>

            {/* Author Link & Star Rating */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">{t('by_author')}</span>
                <button
                  onClick={() => setCurrentView('author-profile')}
                  className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                >
                  {activeBook.author}
                </button>
                <button
                  id="pdp-follow-author-btn"
                  onClick={() => toggleFollowAuthor(activeBook.author)}
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer ml-1.5 ${
                    isFollowingAuthor(activeBook.author)
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  }`}
                  title={isFollowingAuthor(activeBook.author) ? 'Following author for release alerts' : 'Follow author for release alerts'}
                >
                  {isFollowingAuthor(activeBook.author) ? (
                    <>
                      <BellRing className="w-3 h-3 text-emerald-600 animate-pulse" />
                      <span>{t('following_author')}</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3 h-3 text-amber-700" />
                      <span>+ {t('follow_author')}</span>
                    </>
                  )}
                </button>
              </div>

              <span className="text-slate-300">•</span>

              {/* Star Rating scroll anchor */}
              <a
                href="#customer-reviews-section"
                className="flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer"
              >
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(activeBook.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-amber-100 text-amber-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-800 text-xs">
                  {activeBook.rating.toFixed(1)}
                </span>
                <span className="text-slate-500 hover:text-amber-700 hover:underline text-xs">
                  ({activeBook.reviewCount.toLocaleString()} ratings)
                </span>
              </a>

              <span className="text-slate-300">•</span>

              {/* Web Share & Social Sharing Button */}
              <button
                id="pdp-top-web-share-btn"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 text-xs font-semibold border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
                title="Share this book via Web Share API & Social Platforms"
              >
                <Share2 className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Share</span>
              </button>

              {/* Print Button - Triggers Print-Friendly Layout View */}
              <button
                id="pdp-top-print-btn"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-950 text-xs font-semibold border border-slate-200 hover:border-amber-300 transition-all cursor-pointer shadow-2xs group"
                title="Print book details and archival specification sheet"
              >
                <Printer className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Dynamic 8-Format Selector Tiles (Amazon-Style format boxes) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Available Dimension (10 Multi-Format Editions)
              </span>
              <span className="text-xs text-slate-500">
                Active: <span className="font-bold text-slate-900 capitalize">{activeFormat.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Mobile Dropdown for Dimension Selection (Ultra Clean on Phones) */}
            <div className="sm:hidden relative">
              <div className="relative">
                <select
                  id="pdp-mobile-format-select"
                  value={activeFormat}
                  onChange={(e) => handleFormatSelect(e.target.value as FormatType)}
                  className="w-full h-11 pl-3 pr-8 bg-amber-50/70 border-2 border-amber-400 rounded-xl text-xs font-bold text-slate-900 outline-none cursor-pointer appearance-none shadow-xs"
                >
                  {(Object.keys(activeBook.formats) as FormatType[]).map((fmtKey) => {
                    const fmt = activeBook.formats[fmtKey];
                    if (!fmt) return null;
                    return (
                      <option key={fmtKey} value={fmtKey}>
                        {fmt.name} — ${fmt.price.toFixed(2)}
                      </option>
                    );
                  })}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-700 absolute right-3 top-3.5 pointer-events-none" />
              </div>
            </div>

            <div className="hidden sm:grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(Object.keys(activeBook.formats) as FormatType[]).map((fmtKey) => {
                const fmt = activeBook.formats[fmtKey];
                if (!fmt) return null;
                const isSelected = activeFormat === fmtKey;
                const owned = isBookPurchased(activeBook.id, fmtKey);
                const isAvailable = fmt.available !== false;

                const isDraft2Digital = fmtKey === 'hardcover' || fmtKey === 'papercover';
                const isWhatsappOrder = fmtKey === 'manuscript' || fmtKey === 'silk_cotton';
                const isWaitlist = fmtKey === 'musical_album' || fmtKey === 'digital_device';

                return (
                  <button
                    key={fmtKey}
                    id={`format-tile-${fmtKey}`}
                    onClick={() => handleFormatSelect(fmtKey)}
                    className={`relative p-3 text-left rounded-lg transition-all border cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-400 shadow-sm'
                        : isAvailable
                          ? 'bg-white hover:bg-slate-50 border-slate-300 hover:border-slate-400'
                          : 'bg-slate-100/70 border-slate-200 opacity-65'
                    }`}
                  >
                    {/* Format Badge */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <div className="p-1 rounded bg-slate-100">
                        {getFormatIcon(fmtKey)}
                      </div>
                      {!isAvailable ? (
                        <span className="text-[9px] font-bold bg-slate-200 text-slate-700 px-1 py-0.5 rounded border border-slate-300">
                          In Vault
                        </span>
                      ) : owned ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-300">
                          Owned
                        </span>
                      ) : isDraft2Digital ? (
                        <span className="text-[9px] font-bold bg-blue-100 text-blue-800 px-1 py-0.5 rounded border border-blue-200">
                          D2D Print ↗
                        </span>
                      ) : isWhatsappOrder ? (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded border border-emerald-200">
                          WhatsApp ↗
                        </span>
                      ) : isWaitlist ? (
                        <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1 py-0.5 rounded border border-amber-300">
                          Waitlist ↗
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-500 bg-slate-100 px-1 py-0.5 rounded truncate max-w-[80px]">
                          {fmt.badge}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="font-bold text-slate-900 text-xs truncate">
                        {fmt.name.split(' (')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {fmt.fileFormat.split(' ')[0]}
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-slate-200/70 flex items-baseline gap-1">
                      <span className="text-sm font-extrabold text-slate-950">
                        ${fmt.price.toFixed(2)}
                      </span>
                      {fmt.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ${fmt.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Specialized Routing Action Callout for User Specific Actions */}
            {(activeFormat === 'hardcover' || activeFormat === 'papercover') && (
              <div className="p-3 bg-blue-50 border border-blue-300 rounded-lg flex items-center justify-between gap-3 text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-700 shrink-0" />
                  <span>
                    <strong>Draft2Digital Print Edition:</strong> Hardcover & Paperback copies are distributed worldwide via Draft2Digital.
                  </span>
                </div>
                <button
                  id="d2d-direct-action-btn"
                  onClick={handleOpenDraft2Digital}
                  className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-md shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>Go to Draft2Digital</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {(activeFormat === 'manuscript' || activeFormat === 'silk_cotton') && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg flex items-center justify-between gap-3 text-xs text-emerald-950">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                  <span>
                    <strong>Artisanal & Archival Pre-Order:</strong> Reserve raw handwritten scans and handloom Silk & Cotton editions directly with the author.
                  </span>
                </div>
                <button
                  id="whatsapp-direct-action-btn"
                  onClick={() => handlePreOrderWhatsApp(formatData.name)}
                  className="px-3 py-1.5 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold rounded-md shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span>WhatsApp Author</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {(activeFormat === 'musical_album' || activeFormat === 'digital_device') && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2">
                  <Tablet className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Collector Waiting List:</strong> Join other visitors on the queue for the Dedicated Hardware Tablet (carrying all 9 dimensions) or Musical Soundtrack FLAC key.
                  </span>
                </div>
                <button
                  id="waitlist-direct-action-btn"
                  onClick={() => handleJoinWaitingList(activeFormat)}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-black text-amber-300 font-bold rounded-md shadow-xs flex items-center gap-1 shrink-0 cursor-pointer border border-amber-400/40"
                >
                  <span>Join Waiting List</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Format-Specific Feature Highlight Bar */}
            <div className="p-3 bg-amber-50/50 border border-amber-200/80 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{formatData.name} Specifications:</span>
                </span>
                <button
                  onClick={() => openLookInside(activeBook, activeFormat)}
                  className="text-amber-800 font-bold underline hover:text-amber-950 cursor-pointer"
                >
                  Inspect Edition Sample &rarr;
                </button>
              </div>

              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-slate-700">
                {formatData.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
                <li className="flex items-center gap-1.5 text-slate-500">
                  <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Payload / Size: {formatData.fileSize}</span>
                </li>
                {formatData.duration && (
                  <li className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Runtime: {formatData.duration}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Description Tabs */}
          <div className="space-y-4">
            {/* Mobile Tab Select Dropdown */}
            <div className="sm:hidden relative">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                View Section:
              </label>
              <div className="relative">
                <select
                  id="pdp-mobile-tab-select"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value as any)}
                  className="w-full h-10 pl-3 pr-8 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 outline-none cursor-pointer appearance-none shadow-xs"
                >
                  <option value="overview">📖 Book Overview</option>
                  <option value="analytics">📊 Reading Analytics (Recharts)</option>
                  <option value="toc">✍️ Sample Excerpt & Manuscript Scans</option>
                  <option value="specs">💾 Google Drive Vault & Cloud Security</option>
                  <option value="ai-assistant">🤖 Ask AI Book Scholar (Gemini 3.8)</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Tablet & Desktop Tab Bar */}
            <div className="hidden sm:flex border-b border-slate-200 gap-4 text-xs font-bold overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 transition cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Book Overview
              </button>
              <button
                id="pdp-analytics-tab-btn"
                onClick={() => setActiveTab('analytics')}
                className={`pb-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'analytics'
                    ? 'border-b-2 border-amber-600 text-amber-950 font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-amber-600" />
                <span>Reading Analytics</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                  Visual Stats
                </span>
              </button>
              <button
                onClick={() => setActiveTab('toc')}
                className={`pb-2 transition cursor-pointer ${
                  activeTab === 'toc'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sample Excerpt & Manuscript Scans
              </button>
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-2 transition cursor-pointer ${
                  activeTab === 'specs'
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Google Drive Vault & Cloud Security
              </button>
              <button
                id="pdp-ai-assistant-tab-btn"
                onClick={() => setActiveTab('ai-assistant')}
                className={`pb-2 transition cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ai-assistant'
                    ? 'border-b-2 border-amber-600 text-amber-950 font-bold'
                    : 'text-amber-800 hover:text-amber-950 font-medium'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-600" />
                <span>Ask AI Book Scholar</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300 flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                  Gemini 3.8
                </span>
              </button>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="prose prose-sm text-slate-700 leading-relaxed space-y-4">
                {/* Interactive AI Assistant Teaser Banner */}
                <div className="p-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white rounded-xl border border-amber-500/30 space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Conversational AI Book Assistant</span>
                          <span className="px-1.5 py-0.2 bg-amber-400/20 text-amber-300 text-[10px] rounded-full border border-amber-400/30 font-semibold">
                            Gemini 3.8 Flash
                          </span>
                        </span>
                        <p className="text-[11px] text-stone-300">
                          Ask literary questions about themes, {activeBook.author}'s thesis, or 10-dimension craft
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('ai-assistant')}
                      className="text-xs font-bold text-amber-300 hover:text-white underline cursor-pointer shrink-0"
                    >
                      Chat with AI &rarr;
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {[
                      'What is the core philosophical thesis?',
                      'Who is the ideal reader for this book?',
                      'Explain the 10 physical & digital editions',
                      'Key insights from Chapter 1'
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveTab('ai-assistant')}
                        className="px-2.5 py-1 rounded-full bg-stone-800/90 hover:bg-stone-750 text-amber-200 text-[11px] border border-amber-500/20 transition cursor-pointer"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="whitespace-pre-line text-sm text-slate-800">
                  {activeBook.description}
                </p>

                {/* Author Bio Snippet with Follow Feature */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2.5">
                  <div className="font-bold text-slate-900 flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-amber-600" />
                      <span className="text-sm">About the Author: {activeBook.author}</span>
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        id="pdp-author-social-bio-btn"
                        type="button"
                        onClick={() => openAuthorSocialModal(activeBook.author)}
                        className="px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:from-pink-700 hover:to-amber-700 text-white active:scale-95"
                        title="Display Instagram, TikTok, YouTube, Facebook, LinkedIn, X handles & Bio-Data"
                      >
                        <Share2 className="w-3 h-3 text-amber-200" />
                        <span>Social Handles (6) & Bio-Data</span>
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white">
                          {getAuthorFollowedSocialCount(activeBook.author)}/6
                        </span>
                      </button>
                      <button
                        id="follow-author-detail-btn"
                        onClick={() => toggleFollowAuthor(activeBook.author)}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          isFollowingAuthor(activeBook.author)
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                            : 'bg-amber-600 hover:bg-amber-700 text-white'
                        }`}
                        title={isFollowingAuthor(activeBook.author) ? 'Following author (click to unfollow)' : 'Follow author for release alerts'}
                      >
                        {isFollowingAuthor(activeBook.author) ? (
                          <>
                            <BellRing className="w-3 h-3 text-emerald-600 animate-pulse" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <Bell className="w-3 h-3" />
                            <span>Follow Author</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setCurrentView('author-profile')}
                        className="text-amber-700 font-bold hover:underline text-xs"
                      >
                        Visit Author Profile &rarr;
                      </button>
                    </div>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{activeBook.authorBio}</p>
                  {isFollowingAuthor(activeBook.author) && (
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Release notifications active: You will receive toast alerts when {activeBook.author} releases new assets.</span>
                    </div>
                  )}
                </div>

                {/* Visual Reading Analytics Teaser Card inside Overview */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white border border-amber-500/30 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shrink-0">
                        <BarChart3 className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>Live Reading Analytics & Reader Telemetry</span>
                          <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 text-[10px] rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Live
                          </span>
                        </span>
                        <p className="text-[11px] text-stone-300">
                          Inspect readers per day, format immersion hours, and retention curves.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-stone-950 font-bold text-xs transition cursor-pointer flex items-center gap-1 self-start sm:self-auto shadow-xs"
                    >
                      <span>Explore Graphs & Stats</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-stone-800 text-[11px]">
                    <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Avg Daily Readers</span>
                      <span className="font-bold text-white font-mono">320+ readers</span>
                    </div>
                    <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Avg Session</span>
                      <span className="font-bold text-amber-300 font-mono">42 min</span>
                    </div>
                    <div className="bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                      <span className="text-stone-400 block text-[10px]">Completion</span>
                      <span className="font-bold text-emerald-400 font-mono">87.4%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reading Analytics (Recharts Visual Dashboard) */}
            {activeTab === 'analytics' && (
              <div className="space-y-4">
                <BookReadingAnalytics book={activeBook} />
              </div>
            )}

            {/* Tab 2: Sample Excerpt & Manuscript Scans (Enhanced Preview) */}
            {activeTab === 'toc' && (
              <div 
                id="pdp-sample-preview"
                data-book-preview="true"
                className="bg-white p-5 rounded-xl border border-slate-200 space-y-5 text-xs book-preview-content"
              >
                {/* Header & Quick Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                        Sample Reader & Codex Preview
                      </span>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80 font-medium inline-flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-amber-600" />
                        Quick Lookup: Double-click any word for definition
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-base font-serif mt-0.5">
                      {activeBook.chapterOnePreview.title}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openLookInside(activeBook, 'ebook')}
                      className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Open Full Immersive Reader</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => openLookInside(activeBook, 'audiobook')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                      title="Play Narration Sample"
                    >
                      <Headphones className="w-3.5 h-3.5" />
                      <span>Audiobook Sample</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Selector Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 shrink-0">Sample Chapters:</span>
                  {[
                    { title: activeBook.chapterOnePreview.title || 'Chapter 1: The Sovereign Spark', length: '6 min read' },
                    { title: 'Chapter 2: The Multi-Dimension Matrix', length: '7 min read' },
                    { title: 'Chapter 3: Cognitive Flow & Deep Immersion', length: '5 min read' },
                    { title: "Epilogue & Author's Working Field Notes", length: '4 min read' }
                  ].map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedPreviewChapter(idx)}
                      className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition cursor-pointer whitespace-nowrap ${
                        selectedPreviewChapter === idx
                          ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                    >
                      <span>{ch.title.split(':')[0]}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({ch.length})</span>
                    </button>
                  ))}
                </div>

                {/* Selected Chapter Content */}
                {selectedPreviewChapter === 0 ? (
                  <div className="space-y-3">
                    {activeBook.chapterOnePreview.subheading && (
                      <div className="text-amber-800 italic font-medium bg-amber-50/60 px-3 py-1.5 rounded border-l-2 border-amber-500">
                        {activeBook.chapterOnePreview.subheading}
                      </div>
                    )}
                    <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-3 border-l-2 border-amber-300 pl-4 py-1">
                      {activeBook.chapterOnePreview.content.map((p, i) => (
                        <p key={i} className="indent-4 text-justify">{p}</p>
                      ))}
                    </div>
                  </div>
                ) : selectedPreviewChapter === 1 ? (
                  <div className="space-y-3">
                    <div className="text-amber-800 italic font-medium bg-amber-50/60 px-3 py-1.5 rounded border-l-2 border-amber-500">
                      Why Great Books Transcend a Single Flat Medium
                    </div>
                    <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-3 border-l-2 border-amber-300 pl-4 py-1">
                      <p className="indent-4 text-justify">
                        When {activeBook.author} embarked upon writing "{activeBook.title}", it became immediately evident that the core thesis could not reside comfortably in black ink alone. Words carry intellectual precision; human voice conveys resonant emotional warmth; tactile handwritten manuscripts preserve the raw struggle of early draft genesis.
                      </p>
                      <p className="indent-4 text-justify">
                        Each dimension is not a mere marketing repackage—it is an independent sensory frequency. The auditory traveler absorbs pacing differently from the physical paper reader. The collector who examines calligraphed plates in fountain pen touches the living pulse of human labor.
                      </p>
                    </div>
                  </div>
                ) : selectedPreviewChapter === 2 ? (
                  <div className="space-y-3">
                    <div className="text-amber-800 italic font-medium bg-amber-50/60 px-3 py-1.5 rounded border-l-2 border-amber-500">
                      The Neuroscience of Distraction-Free Reading
                    </div>
                    <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-3 border-l-2 border-amber-300 pl-4 py-1">
                      <p className="indent-4 text-justify">
                        Modern attention spans are fragmented by continuous notifications and infinite algorithmic scrolls. Yet when a reader enters a state of deep literary immersion, alpha brainwave oscillations stabilize, fostering deep structural comprehension.
                      </p>
                      <p className="indent-4 text-justify">
                        By integrating dedicated audio soundscapes and visual manuscripts alongside clean typographic prose, the mind transitions from frantic skimming to deliberate contemplation.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-amber-800 italic font-medium bg-amber-50/60 px-3 py-1.5 rounded border-l-2 border-amber-500">
                      Drafting Margins, Studio Reflections & Looking Ahead
                    </div>
                    <div className="font-serif text-slate-800 text-sm leading-relaxed space-y-3 border-l-2 border-amber-300 pl-4 py-1">
                      <p className="indent-4 text-justify">
                        "I wrote these pages in solitude between midnight and dawn," notes {activeBook.author}. "Every sentence was tested against lived experience, verified through hard-won trial, and refined across ten distinct physical and acoustic media."
                      </p>
                      <p className="indent-4 text-justify">
                        As you conclude this introductory sample, remember that a book is not merely an object you purchase; it is a conversation between minds that spans across generations and geography.
                      </p>
                    </div>
                  </div>
                )}

                {/* Raw Handwritten Manuscript Preview Callout */}
                <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-950 flex items-center gap-2">
                      <PenTool className="w-4 h-4 text-amber-700" />
                      <span>Raw Handwritten Manuscript & Scanned Notebooks:</span>
                    </span>
                    <button
                      onClick={() => openLookInside(activeBook, 'manuscript')}
                      className="text-xs font-bold text-amber-800 hover:text-amber-950 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inspect 600 DPI Scans</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {activeBook.manuscriptSample?.handwrittenNotebook?.medium || 'Pelikan Fountain Pen on 120gsm Archival Paper'}. Includes high-resolution scans with raw author margin annotations, cross-outs, and initial ink formulations.
                  </p>
                </div>
              </div>
            )}

            {/* Tab 3: Specs & Google Drive Vault */}
            {activeTab === 'specs' && (
              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-slate-900 text-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-amber-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Native Google Drive Storage & Cloudflare R2 Delivery</span>
                    </span>
                    <button
                      onClick={() => setApiInspectorOpen(true)}
                      className="text-xs text-amber-300 underline hover:text-amber-200 cursor-pointer"
                    >
                      Test Signed URL API
                    </button>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Raw materials (handwritten manuscript scans, uncompressed audio stems, and 4K masters) are archived natively to Google Drive via OAuth and mirrored with expiring signed URLs for instantaneous web streaming.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">Audio Narration</span>
                    <span className="text-slate-500">{activeBook.audioSample.narrator}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">Video Masterclass</span>
                    <span className="text-slate-500">{activeBook.videoSample.resolution}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">Hardcover Binding</span>
                    <span className="text-slate-500">{activeBook.hardcoverDetails?.binding || 'Smyth-sewn clothbound'}</span>
                  </div>
                  <div className="p-2.5 bg-white border border-slate-200 rounded">
                    <span className="font-bold block text-slate-900">Pendrive Storage</span>
                    <span className="text-slate-500">{activeBook.pendriveSdDetails?.storageCapacity || '64GB Dual USB-C Key'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Conversational Gemini AI Book Scholar */}
            {activeTab === 'ai-assistant' && (
              <div className="space-y-3">
                <BookChatAssistant 
                  book={activeBook} 
                  onSelectDimension={(dim) => handleFormatSelect(dim as FormatType)}
                />
              </div>
            )}
          </div>
        </div>

        {/* ======================================================== */}
        {/* COLUMN 3: RIGHT COLUMN - The Amazon Buy Box (Sticky)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-3 xl:col-span-3 lg:sticky lg:top-24">
          <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-4 space-y-4">
            
            {/* Price Display */}
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">
                {formatData.name}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-slate-950">
                  {formatPrice(formatData.price)}
                </span>
                {formatData.originalPrice && (
                  <span className="text-xs text-slate-400 line-through">
                    {formatPrice(formatData.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            {/* Delivery Type Badge */}
            {isPhysicalFormat ? (
              <div className="p-2.5 bg-blue-50 rounded border border-blue-200 text-xs text-blue-900 space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                  <span>Physical Tracked Delivery</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Priority shipping in 2-4 business days. Free instant digital eBook sync included immediately.
                </p>
              </div>
            ) : (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                <div className="font-bold flex items-center gap-1.5">
                  <DownloadCloud className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Instant Digital Delivery</span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  Immediately syncs to your Knowledge Centa Cloud Library upon purchase.
                </p>
              </div>
            )}

            {/* Format In Stock Indicator */}
            <div className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>In Stock • Ready for Delivery</span>
            </div>

            {/* Quantity Selector (1) */}
            <div className="text-xs text-slate-600 flex items-center justify-between border-y border-slate-100 py-2">
              <span>Quantity:</span>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                1
              </span>
            </div>

            {/* Purchase CTA Buttons (Amazon Gold & Orange) */}
            <div className="space-y-2.5 pt-1">
              {isPurchased ? (
                <div className="space-y-2">
                  <div className="w-full py-2.5 px-4 bg-emerald-600 text-white rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>You Own This Edition</span>
                  </div>
                  <button
                    id="buybox-access-library-btn"
                    onClick={() => openInCustomerLibrary(activeBook, activeFormat)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-full font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 border border-amber-400/30 shadow-xs"
                  >
                    <span>Stream in /my-library</span>
                    <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                </div>
              ) : activeFormat === 'hardcover' || activeFormat === 'papercover' ? (
                <>
                  <button
                    id="buybox-draft2digital-btn"
                    onClick={handleOpenDraft2Digital}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-full font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition cursor-pointer hover:shadow"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Order Print on Draft2Digital</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    Worldwide print-on-demand fulfillment via Draft2Digital network
                  </p>
                </>
              ) : activeFormat === 'manuscript' || activeFormat === 'silk_cotton' ? (
                <>
                  <button
                    id="buybox-whatsapp-preorder-btn"
                    onClick={() => handlePreOrderWhatsApp(formatData.name)}
                    className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition cursor-pointer hover:shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Pre-Order on Author's WhatsApp</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    Direct author contact for numbered editions & custom calligraphed plates
                  </p>
                </>
              ) : activeFormat === 'musical_album' || activeFormat === 'digital_device' ? (
                <>
                  <button
                    id="buybox-waitlist-btn"
                    onClick={() => handleJoinWaitingList(activeFormat)}
                    className="w-full py-3 px-4 bg-stone-900 hover:bg-black text-amber-300 rounded-full font-bold text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 transition cursor-pointer hover:shadow border border-amber-400/40"
                  >
                    <Tablet className="w-4 h-4 text-amber-400" />
                    <span>Join Priority Waiting List</span>
                  </button>
                  <p className="text-[11px] text-center text-slate-500">
                    Hardware device carrying all 9 dimensions or Studio FLAC Key
                  </p>
                </>
              ) : (
                <>
                  {/* Amazon Gold "Add to Cart" Button */}
                  <button
                    id="buybox-add-to-cart-btn"
                    onClick={() => addToCart(activeBook, activeFormat)}
                    className="w-full py-2.5 px-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-slate-950 rounded-full font-semibold text-xs tracking-wide shadow-sm border border-[#FCD200] transition cursor-pointer hover:shadow"
                  >
                    {t('btn_add_to_cart')}
                  </button>

                  {/* Amazon Orange "Buy Now" Button */}
                  <button
                    id="buybox-buy-now-btn"
                    onClick={() => buyNow(activeBook, activeFormat)}
                    className="w-full py-2.5 px-4 bg-[#FFA41C] hover:bg-[#FA8900] active:bg-[#E87A00] text-slate-950 rounded-full font-bold text-xs tracking-wide shadow-sm border border-[#FF8F00] transition cursor-pointer hover:shadow"
                  >
                    {t('btn_buy_now')}
                  </button>
                </>
              )}

              {/* Sample / Inspect Button */}
              <button
                id="buybox-play-sample-btn"
                onClick={() => openLookInside(activeBook, activeFormat)}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-full font-medium text-xs border border-slate-300 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3 h-3 fill-slate-700" />
                <span>{t('btn_sample_preview')}</span>
              </button>

              {/* Add to Wishlist Button in Buy Box */}
              <button
                id="buybox-wishlist-toggle-btn"
                onClick={() => toggleWishlist(activeBook)}
                className={`w-full py-2 px-4 rounded-full font-medium text-xs border flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-300 text-rose-700 font-bold'
                    : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{inWishlist ? t('btn_in_wishlist') : t('btn_add_wishlist')}</span>
              </button>
            </div>

            {/* Security Trust Badges */}
            <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>Secure transaction (256-Bit SSL)</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Native Google Drive & Firestore synced</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>30-Day satisfaction guarantee</span>
              </div>
            </div>

            {/* Direct Author Studio Promotion */}
            <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <span className="font-bold block">Are you an author?</span>
              <p className="text-amber-800 text-[10px]">
                Distribute all 8 dimensions: eBooks, Audio, Video, Raw Handwritten Manuscripts, Print & Soundtracks.
              </p>
              <button
                onClick={() => setCurrentView('publish')}
                className="text-amber-900 font-bold underline hover:text-amber-700 cursor-pointer block mt-1"
              >
                Open Creator Publishing Studio &rarr;
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* ======================================================== */}
      {/* GOOGLE ADSENSE RESPONSIVE UNIT                           */}
      {/* ======================================================== */}
      <div className="max-w-[1600px] mx-auto px-4 mt-6">
        <AdSenseSlot 
          slotId="pdp-mid-horizontal-leaderboard" 
          format="horizontal" 
          label="Sponsored Cultural & Literary Dispatch" 
        />
      </div>

      {/* ======================================================== */}
      {/* CUSTOMER REVIEWS COMPONENT (With Star-Rating Form & Sort) */}
      {/* ======================================================== */}
      <div className="max-w-[1600px] mx-auto px-4 mt-6">
        <CustomerReviews book={activeBook} />
      </div>

      {/* Social & Web Share Modal Dialog */}
      <BookShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        book={activeBook}
        onNativeShare={handleShare}
        canNativeShare={typeof navigator !== 'undefined' && typeof navigator.share === 'function'}
      />

      {/* On-Screen Print Preview Modal */}
      {isPrintPreviewOpen && (
        <div 
          id="pdp-print-preview-modal"
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto no-print"
        >
          <div className="bg-slate-100 w-full max-w-5xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center">
                  <Printer className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Print Preview • Archival Specification Sheet
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    High-contrast layout optimized for standard A4 / US-Letter printing and PDF export
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="print-preview-now-btn"
                  onClick={handlePrint}
                  className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now / Save PDF</span>
                </button>
                <button
                  id="close-print-preview-btn"
                  onClick={() => setIsPrintPreviewOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                  title="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Render BookPrintDossier with isScreenPreview */}
            <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-200">
              <BookPrintDossier
                book={activeBook}
                activeFormat={activeFormat}
                formatPrice={formatPrice}
                isScreenPreview={true}
              />
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
