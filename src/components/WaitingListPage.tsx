import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Cpu, 
  Disc3, 
  ScrollText, 
  Sparkles, 
  Tablet, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Share2, 
  MessageSquare, 
  ChevronRight, 
  BookOpen, 
  UserCheck, 
  Flame,
  ArrowRight,
  Send
} from 'lucide-react';

interface WaitingListPageProps {
  initialDimension?: string;
}

export const WaitingListPage: React.FC<WaitingListPageProps> = ({ initialDimension }) => {
  const { 
    books, 
    activeBook, 
    waitlist, 
    addToWaitlist, 
    setCurrentView, 
    setActiveBook,
    selectedWaitlistDimension,
    setSelectedWaitlistDimension 
  } = useStore();

  const [selectedBookId, setSelectedBookId] = useState<string>(activeBook?.id || books[0]?.id || '');
  const [activeDimension, setActiveDimension] = useState<string>(
    initialDimension || selectedWaitlistDimension || 'dedicated_tablet_all9'
  );

  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [submittedEntry, setSubmittedEntry] = useState<{ queueNumber: number; dimensionLabel: string } | null>(null);
  const [filterDimension, setFilterDimension] = useState<string>('all');

  const DIMENSIONS_CONFIG = [
    {
      id: 'dedicated_tablet_all9',
      title: 'Dedicated Hardware Tablet (Carrying All 9 Dimensions)',
      shortTitle: 'Dedicated Hardware Tablet',
      icon: Tablet,
      accentColor: 'from-amber-600 to-amber-700',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      tagline: 'A bespoke standalone device engineered solely for this single book, preloaded offline with all 9 remaining dimensions.',
      specs: [
        'Pre-loaded with eBook, Audiobook, 4K Video, Manuscript Scans, Print Layouts, Musical Soundtrack, & Silk Archives',
        '7.8" 300 PPI glare-free Carta 1200 E-Ink paper screen',
        'Distraction-free Sovereign OS with zero apps, notifications, or trackers',
        'Dual 3.5mm hi-res headphone jack + Bluetooth 5.3 LDAC lossless audio'
      ],
      estimatedBatch: 'Batch 02: Shipping Mid-2026',
      priceEstimate: '$299 – $349'
    },
    {
      id: 'musical_album',
      title: 'Original Composed Musical Album (FLAC & Dual USB-C Key)',
      shortTitle: 'Original Musical Album',
      icon: Disc3,
      accentColor: 'from-purple-600 to-indigo-700',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      tagline: 'Custom cinematic score and acoustic focus audio beds composed specifically to accompany the book chapters.',
      specs: [
        'Studio Master 24-bit / 96kHz Lossless FLAC & WAV files',
        'Encased on weighted dual USB-C / Micro-SD physical metal key',
        'Includes full orchestral stems and ambient acoustic reading loops',
        'Mastered by top audio engineers for immersive headphone listening'
      ],
      estimatedBatch: 'Batch 03: Shipping in 4 weeks',
      priceEstimate: '$29 – $39'
    },
    {
      id: 'manuscript',
      title: 'Raw Handwritten Manuscript Scans & Archival Notebook',
      shortTitle: 'Raw Handwritten Manuscript',
      icon: ScrollText,
      accentColor: 'from-emerald-600 to-teal-700',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      tagline: 'Inspect the author raw fountain-pen notebooks, unedited margin notes, sketches, and struck-through thoughts.',
      specs: [
        'Ultra-high resolution 600 DPI color archival digital scans',
        'Side-by-side author transcription and contextual marginalia',
        'Option for limited hand-numbered facsimile print notebook',
        'Personal author dedication and watermark authentication'
      ],
      estimatedBatch: 'Batch 01: Immediate Access + Physical Printing in 3 weeks',
      priceEstimate: '$49 – $75'
    },
    {
      id: 'silk_cotton',
      title: 'Artisanal Mulberry Silk & Combed Egyptian Cotton Edition',
      shortTitle: 'Silk & Cotton Heirloom',
      icon: Sparkles,
      accentColor: 'from-rose-600 to-pink-700',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      tagline: 'A museum-grade heirloom volume bound in 100% natural Mulberry silk spine and heavyweight combed cotton cloth.',
      specs: [
        'Hand-sewn Smyth binding with 24k gold leaf gilded page edges',
        'Includes silk-lined Solander presentation box and numbered bookplate',
        'Limited run of 200 copies worldwide per title',
        'Directly supports heritage master bookbinders'
      ],
      estimatedBatch: 'Batch 01: Strictly Limited to 200 Handcrafted Volumes',
      priceEstimate: '$95 – $145'
    },
    {
      id: 'digital_device',
      title: 'Dedicated Digital Device (E-Ink Terminal)',
      shortTitle: 'Digital Device Terminal',
      icon: Cpu,
      accentColor: 'from-blue-600 to-cyan-700',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      tagline: 'Pure, distraction-free digital e-paper terminal designed for continuous deep cognitive reading.',
      specs: [
        'Instant single-purpose boot directly to the book cover and text',
        'Adjustable warm amber front-light with auto ambient color temperature',
        'Physical brass page-turn buttons with tactile mechanical microswitches',
        'Up to 10 weeks battery life on a single charge'
      ],
      estimatedBatch: 'Batch 02: Early Pre-Orders Open',
      priceEstimate: '$249 – $299'
    }
  ];

  const currentDimensionConfig = DIMENSIONS_CONFIG.find(d => d.id === activeDimension) || DIMENSIONS_CONFIG[0];
  const selectedBook = books.find(b => b.id === selectedBookId) || activeBook || books[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !whatsappNumber.trim()) {
      alert('Please provide your name and WhatsApp contact number.');
      return;
    }

    const newEntry = addToWaitlist({
      fullName: fullName.trim(),
      contact: whatsappNumber.trim(),
      bookId: selectedBook.id,
      bookTitle: selectedBook.title,
      authorName: selectedBook.author,
      dimension: activeDimension as any,
      dimensionLabel: currentDimensionConfig.title,
      notes: notes.trim() || undefined
    });

    setSubmittedEntry({
      queueNumber: newEntry.priorityQueueNumber,
      dimensionLabel: currentDimensionConfig.title
    });

    // Reset fields
    setNotes('');
  };

  const filteredWaitlist = waitlist.filter(item => {
    if (filterDimension === 'all') return true;
    return item.dimension === filterDimension;
  });

  const handleShareOnWhatsApp = (itemDimensionLabel: string) => {
    const text = encodeURIComponent(
      `I just joined the priority waiting list for "${selectedBook?.title}" (${itemDimensionLabel}) on Knowledge Centa! Join the waiting list here: ${window.location.origin}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleContactAuthorOnWhatsApp = () => {
    const phone = selectedBook?.authorWhatsapp || '+233555414967';
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(
      `Hello ${selectedBook?.author}, I am inquiring about pre-ordering the "${currentDimensionConfig.title}" for your book "${selectedBook?.title}". Could you share production timing and custom options?`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 pb-24">
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <button 
                id="waitlist-back-store-btn"
                onClick={() => setCurrentView('store')}
                className="hover:text-stone-900 font-medium transition-colors"
              >
                Storefront
              </button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <button 
                id="waitlist-back-book-btn"
                onClick={() => {
                  if (selectedBook) {
                    setActiveBook(selectedBook);
                    setCurrentView('book-detail');
                  }
                }}
                className="hover:text-stone-900 transition-colors"
              >
                {selectedBook?.title || 'Book Details'}
              </button>
              <ChevronRight className="h-4 w-4 text-stone-400" />
              <span className="font-semibold text-stone-900">4-Dimension Waiting List</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Priority Queue Active ({waitlist.length + 42} Collectors)
              </span>
              <button
                id="contact-author-whatsapp-top-btn"
                onClick={handleContactAuthorOnWhatsApp}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#20ba5a] transition-all"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat Author on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-stone-900 py-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#383838_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-800 px-3 py-1 text-xs font-medium text-amber-400 border border-stone-700 mb-4">
              <Flame className="h-3.5 w-3.5" />
              Limited Artisan & Hardware Dimension Queue
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl font-serif">
              Reserve Sovereign Dimensions
            </h1>
            <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed">
              Experience books beyond ordinary paper and glass. Join fellow collectors, audiophiles, and readers in reserving raw handwritten manuscripts, studio soundtrack albums, artisanal silk editions, and dedicated hardware tablets carrying all 9 dimensions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Dimension Selection Cards Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-stone-900">
              Select Dimension to Reserve:
            </h2>
            <span className="text-xs text-stone-500">
              Click any dimension to view specs & join queue
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {DIMENSIONS_CONFIG.map((dim) => {
              const Icon = dim.icon;
              const isSelected = activeDimension === dim.id;

              return (
                <button
                  key={dim.id}
                  id={`select-dimension-card-${dim.id}`}
                  onClick={() => {
                    setActiveDimension(dim.id);
                    setSelectedWaitlistDimension(dim.id);
                  }}
                  className={`text-left p-4 rounded-xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-white border-stone-900 shadow-md ring-2 ring-stone-900'
                      : 'bg-white/80 border-stone-200 hover:border-stone-400 hover:bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${isSelected ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      {isSelected && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                      {dim.shortTitle}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                      {dim.tagline}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">{dim.priceEstimate}</span>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${dim.badgeBg}`}>
                      Queue Open
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dimension Active Overview & Reservation Form Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left Column: Dimension Detail & Selected Book (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Active Dimension Spotlight Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="p-3.5 rounded-xl bg-stone-900 text-amber-400 shadow-sm">
                  {React.createElement(currentDimensionConfig.icon, { className: 'h-7 w-7' })}
                </div>
                <div>
                  <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 border ${currentDimensionConfig.badgeBg}`}>
                    {currentDimensionConfig.estimatedBatch}
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-serif">
                    {currentDimensionConfig.title}
                  </h3>
                  <p className="text-sm text-stone-600 mt-1">
                    {currentDimensionConfig.tagline}
                  </p>
                </div>
              </div>

              {/* Specs List */}
              <div className="mt-6 rounded-xl bg-stone-50 p-4 border border-stone-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
                  Dimension Specifications & Craft Details
                </h4>
                <ul className="space-y-2.5">
                  {currentDimensionConfig.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Author Direct Pre-Order on WhatsApp Option */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div>
                  <h4 className="text-sm font-semibold text-emerald-900">
                    Direct Pre-Order via Author WhatsApp
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Prefer direct one-on-one communication with {selectedBook?.author}? Chat now for bespoke allocations.
                  </p>
                </div>
                <button
                  id="direct-whatsapp-preorder-action-btn"
                  onClick={handleContactAuthorOnWhatsApp}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#20ba5a] transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  Pre-Order on WhatsApp
                </button>
              </div>
            </div>

            {/* Selected Book Context */}
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Target Masterwork for Reservation
                </span>
                <span className="text-xs text-stone-400">
                  Select any book from the catalog
                </span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={selectedBook?.coverImage}
                  alt={selectedBook?.title}
                  className="h-20 w-14 object-cover rounded-md shadow-sm border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-bold text-stone-900 truncate font-serif">
                    {selectedBook?.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    By <span className="font-semibold text-stone-700">{selectedBook?.author}</span> • {selectedBook?.category}
                  </p>

                  <div className="mt-2">
                    <select
                      id="waitlist-select-book-dropdown"
                      value={selectedBookId}
                      onChange={(e) => {
                        setSelectedBookId(e.target.value);
                        const b = books.find(item => item.id === e.target.value);
                        if (b) setActiveBook(b);
                      }}
                      className="block w-full max-w-sm rounded-lg border border-stone-300 bg-stone-50 px-3 py-1.5 text-xs text-stone-800 shadow-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                    >
                      {books.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.title} — {b.author}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Join Waiting List Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="sticky top-20 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
              {submittedEntry ? (
                <div className="text-center py-6">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-300 mb-2">
                    Priority Queue #{submittedEntry.queueNumber} Confirmed
                  </span>
                  <h3 className="text-xl font-bold text-stone-900 font-serif">
                    You Are on the Waiting List!
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    We have reserved your priority position for the <strong>{submittedEntry.dimensionLabel}</strong> of <em>{selectedBook?.title}</em>. The author and manufacturing studio will reach out on WhatsApp as soon as production allocation commences.
                  </p>

                  <div className="mt-6 flex flex-col gap-2.5">
                    <button
                      id="share-whatsapp-queue-btn"
                      onClick={() => handleShareOnWhatsApp(submittedEntry.dimensionLabel)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#20ba5a] transition-all"
                    >
                      <Share2 className="h-4 w-4" />
                      Share on WhatsApp
                    </button>
                    <button
                      id="join-another-dimension-btn"
                      onClick={() => setSubmittedEntry(null)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-100 px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-200 transition-colors"
                    >
                      Join Another Dimension Waiting List
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-stone-900 font-serif">
                      Join Priority Waiting List
                    </h3>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Zero Cost to Join
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mb-5 leading-relaxed">
                    No payment is collected now. Joining places you in the verified queue for batch manufacturing, custom dedication, and early access.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        id="waitlist-input-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. David Sterling Vance"
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        WhatsApp Number * (With Country Code)
                      </label>
                      <div className="relative">
                        <input
                          id="waitlist-input-whatsapp"
                          type="tel"
                          required
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          placeholder="e.g. +1 415 890 2194 or +44 7700 900382"
                          className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                      <span className="text-[11px] text-stone-400 mt-1 block">
                        Used exclusively for production notifications and direct author pre-order confirmation.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Selected Dimension
                      </label>
                      <select
                        id="waitlist-input-dimension-select"
                        value={activeDimension}
                        onChange={(e) => {
                          setActiveDimension(e.target.value);
                          setSelectedWaitlistDimension(e.target.value);
                        }}
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm text-stone-900 bg-white shadow-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900 font-medium"
                      >
                        {DIMENSIONS_CONFIG.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.shortTitle}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Collector Notes / Custom Requests (Optional)
                      </label>
                      <textarea
                        id="waitlist-input-notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g., Specific edition number request, calligraphy title inscription, audio gear specs..."
                        className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-xs text-stone-900 shadow-sm focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
                      />
                    </div>

                    <button
                      id="submit-waitlist-btn"
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-black transition-all"
                    >
                      <Send className="h-4 w-4 text-amber-400" />
                      Join Priority Waiting List (Queue #{waitlist.length + 42})
                    </button>
                  </form>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-stone-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Your privacy is encrypted. No spam or commercial resell.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Public Waiting List Roster */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div>
              <h3 className="text-xl font-bold text-stone-900 font-serif flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-600" />
                Live Waiting List Roster ({waitlist.length + 42} Collectors)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Real-time queue of verified collectors and readers awaiting artisan and hardware dimensions.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                id="filter-waitlist-all-btn"
                onClick={() => setFilterDimension('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  filterDimension === 'all'
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                All Dimensions
              </button>
              {DIMENSIONS_CONFIG.map(d => (
                <button
                  key={d.id}
                  id={`filter-waitlist-dim-${d.id}`}
                  onClick={() => setFilterDimension(d.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    filterDimension === d.id
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {d.shortTitle}
                </button>
              ))}
            </div>
          </div>

          {/* Table / List */}
          <div className="mt-6 divide-y divide-stone-100">
            {filteredWaitlist.map((item, index) => {
              // Mask contact partially for privacy like: +1 (415) •••-2194
              const contactParts = item.contact.split(' ');
              const maskedContact = item.contact.length > 8 
                ? item.contact.slice(0, 4) + ' ••• ' + item.contact.slice(-4)
                : item.contact;

              return (
                <div key={item.id} className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-stone-50/70 px-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-stone-100 text-stone-900 font-bold text-xs shrink-0">
                      #{item.priorityQueueNumber}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-stone-900 truncate">
                          {item.fullName}
                        </h4>
                        <span className="text-[11px] text-stone-400 font-mono">
                          ({maskedContact})
                        </span>
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          Priority
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 truncate mt-0.5">
                        <span className="font-medium text-stone-800">{item.dimensionLabel}</span> for <em>{item.bookTitle}</em>
                      </p>
                      {item.notes && (
                        <p className="text-[11px] text-stone-400 italic mt-0.5 line-clamp-1">
                          "{item.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-stone-400">
                      {item.joinedAt}
                    </span>
                    <button
                      onClick={() => handleShareOnWhatsApp(item.dimensionLabel)}
                      title="Share waiting list on WhatsApp"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#25D366] hover:bg-emerald-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
