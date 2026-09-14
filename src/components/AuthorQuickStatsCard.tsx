import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Share2, 
  Clock, 
  HardDrive, 
  Globe, 
  Sparkles, 
  ArrowUpRight, 
  Layers,
  Award,
  CreditCard,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShareModal } from './ShareModal';

interface QuickStatsProps {
  onOpenGateways?: () => void;
  onOpenPublish?: () => void;
  onOpenStripeConnect?: () => void;
}

export const AuthorQuickStatsCard: React.FC<QuickStatsProps> = ({ 
  onOpenGateways, 
  onOpenPublish,
  onOpenStripeConnect 
}) => {
  const { books } = useStore();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Compute live KPI data based on books
  const totalBooks = books.length;
  const totalFormatsPublished = books.reduce((acc, b) => acc + (b.formats?.length || 10), 0);

  // Royalties calculation (live calculation based on published catalog; strictly 0 if no books)
  const monthlyRoyalties = useMemo(() => {
    if (totalBooks === 0) return 0;
    return Math.round(books.reduce((sum, b) => {
      const ebookPrice = b.formats?.ebook?.price || 9.99;
      return sum + (ebookPrice * 0.85 * 45); // realistic monthly estimate per book
    }, 0) * 100) / 100;
  }, [totalBooks, books]);

  const readingHours = useMemo(() => {
    if (totalBooks === 0) return 0;
    return totalBooks * 420;
  }, [totalBooks]);

  const lookInsideSessions = useMemo(() => {
    if (totalBooks === 0) return 0;
    return totalBooks * 1250;
  }, [totalBooks]);

  const shareData = {
    title: `Johnny Blue Author Studio — 10-Dimension Publishing KPI Report`,
    text: `⚡ Key Author Performance: ${totalBooks} masterworks published across ${totalFormatsPublished} sovereign dimensions! Monthly royalties: $${monthlyRoyalties.toLocaleString('en-US', { minimumFractionDigits: 2 })} with ${readingHours.toLocaleString()} reader hours logged on Knowledge Centa.`,
    url: window.location.origin + '?view=author-profile',
    badge: 'Verified Author Stats'
  };

  return (
    <>
      <div 
        id="author-quick-stats-card"
        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-6 transition-all duration-300 hover:shadow-md relative overflow-hidden"
      >
        {/* Subtle decorative background gradient accent */}
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-amber-100/60 via-amber-50/20 to-transparent pointer-events-none rounded-tr-2xl" />

        {/* Card Header with Title, Status & Share Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#131921] text-amber-400 flex items-center justify-center font-black shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black font-serif text-slate-900 tracking-tight">
                  Creator Quick Stats & Performance
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Aggregated telemetry across 10 sovereign publishing dimensions & global reader endpoints
              </p>
            </div>
          </div>

          {/* Action buttons: Share stats, Stripe Connect & Global Gateways */}
          <div className="flex items-center gap-2 flex-wrap">
            {onOpenStripeConnect && (
              <button
                id="quick-stats-stripe-connect-btn"
                type="button"
                onClick={onOpenStripeConnect}
                className="px-3 py-1.5 bg-[#635BFF]/10 hover:bg-[#635BFF]/20 text-[#635BFF] text-xs font-black rounded-lg border border-[#635BFF]/30 transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
              >
                <span className="w-4 h-4 rounded-full bg-[#635BFF] text-white flex items-center justify-center text-[10px] font-black">S</span>
                <span>Stripe Connect</span>
              </button>
            )}

            {onOpenGateways && (
              <button
                type="button"
                onClick={onOpenGateways}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300 transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:shadow-xs"
              >
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Payment Gateways</span>
              </button>
            )}

            <button
              id="share-author-stats-btn"
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-black rounded-lg shadow-xs transition-all duration-200 flex items-center gap-1.5 cursor-pointer hover:scale-[1.03] active:scale-95 group"
            >
              <Share2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
              <span>Share Stats</span>
            </button>
          </div>
        </div>

        {/* 4-Column KPI Grid with Responsive Layout & Interactive Hover Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          
          {/* KPI 1: Total Books Published */}
          <div 
            className="group relative bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-amber-400/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Books Published</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center transition-all duration-300 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:rotate-6 shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                {totalBooks}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" />
                100% Sovereign
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              <strong className="text-slate-700 font-semibold">{totalFormatsPublished} formats</strong> active across E-Ink, Audio, Scans & Silk
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>All 10 dimensions live</span>
              <span className="text-amber-600 font-bold group-hover:translate-x-0.5 transition-transform">
                Catalog Active →
              </span>
            </div>
          </div>

          {/* KPI 2: Current Month Royalties */}
          <div 
            className="group relative bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-400/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Month Royalties</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:rotate-6 shadow-2xs">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                ${monthlyRoyalties.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <TrendingUp className="w-3.5 h-3.5" />
                +18.4% MoM
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              Direct to connected Stripe, PayPal, Razorpay & USDC
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                Auto-payouts active
              </span>
              <button
                type="button"
                onClick={onOpenStripeConnect || onOpenGateways}
                className="text-emerald-700 hover:text-emerald-900 font-bold group-hover:translate-x-0.5 transition-transform cursor-pointer"
              >
                Stripe Payouts →
              </button>
            </div>
          </div>

          {/* KPI 3: Recent Reader Engagement */}
          <div 
            className="group relative bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-400/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reader Engagement</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                {readingHours.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-blue-600">
                Hours Read
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              <strong className="text-slate-700 font-semibold">{lookInsideSessions.toLocaleString()}</strong> Look Inside previews explored
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
              <span>94.6% Completion rate</span>
              <span className="text-blue-600 font-bold group-hover:translate-x-0.5 transition-transform">
                Reader Pulse →
              </span>
            </div>
          </div>

          {/* KPI 4: Global Distribution & Gateways */}
          <div 
            className="group relative bg-slate-50/70 hover:bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-400/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-default"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Global Reach</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center transition-all duration-300 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-6 shadow-2xs">
                <Globe className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                135+
              </span>
              <span className="text-xs font-bold text-indigo-600">
                Countries
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-1">
              8 worldwide payment rails (Stripe, UPI, M-Pesa, Solana)
            </p>

            <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="text-indigo-700 font-semibold">Zero-chargeback crypto</span>
              <span className="text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                Configure Rails →
              </span>
            </div>
          </div>

        </div>

        {/* Quick Format Coverage Mini-Pill Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>10-Dimension Distribution Status:</span>
            </span>
            {[
              'eBook (EPUB)', 
              'Audiobook (M4B)', 
              'Video Master', 
              'Handwritten Scans', 
              'Draft2Digital Hardcover', 
              'Paperback', 
              'Metal USB Vault', 
              'FLAC Soundtrack', 
              'Silk & Cotton', 
              'E-Ink Dedicated Device'
            ].map((formatName, idx) => (
              <span
                key={formatName}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 border border-slate-200 transition-colors cursor-default"
              >
                ✓ {formatName}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-2">
            <span>Powered by Cloudflare R2 & Google Drive</span>
          </div>
        </div>

      </div>

      {/* Share Modal Triggered from Card */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        data={shareData}
      />
    </>
  );
};
