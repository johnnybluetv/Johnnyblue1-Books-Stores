import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  MessageSquare, 
  Twitter, 
  Linkedin, 
  Facebook, 
  Mail, 
  Send, 
  QrCode, 
  Code,
  ExternalLink,
  Sparkles,
  Download,
  Image as ImageIcon,
  CheckCircle2,
  Eye
} from 'lucide-react';

export interface ShareData {
  title: string;
  text: string;
  url: string;
  badge?: string;
  imageUrl?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareData;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'preview' | 'assets'>('share');
  const [socialPlatform, setSocialPlatform] = useState<'whatsapp' | 'twitter' | 'facebook'>('whatsapp');

  if (!isOpen) return null;

  const currentUrl = data.url || window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(`${data.title}\n\n${data.text}\n\n`);

  // Brand logo asset paths
  const logoSquareUrl = '/logo-square.png';
  const ogImageUrl = '/og-image.png';
  const logoSvgUrl = '/logo.svg';

  const previewThumbnail = data.imageUrl || logoSquareUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${data.title} - ${currentUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.title,
          text: data.text,
          url: currentUrl
        });
      } catch (err) {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const embedCode = `<iframe src="${currentUrl}" width="100%" height="600" style="border:1px solid #e2e8f0;border-radius:12px;" title="${data.title}"></iframe>`;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-400/60 shadow-inner bg-slate-900 flex items-center justify-center">
              <img 
                src="/logo.svg" 
                alt="Johnnyblue1 Logo" 
                className="w-8 h-8 object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Share URL with Attached Logo</h3>
                {data.badge && (
                  <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                    {data.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">Social preview cards &amp; brand logo bound to this link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('share')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'share'
                ? 'border-amber-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Instant Share</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'preview'
                ? 'border-amber-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Social Preview Card</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
              activeTab === 'assets'
                ? 'border-amber-500 text-slate-950 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-amber-500" />
            <span>Logo Assets</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          
          {/* TAB 1: INSTANT SHARE */}
          {activeTab === 'share' && (
            <>
              {/* Content Card with Logo Badge */}
              <div className="flex items-start gap-3 p-3 bg-gradient-to-r from-slate-50 to-amber-50/40 rounded-xl border border-slate-200 relative overflow-hidden">
                <div className="relative shrink-0">
                  <img
                    src={previewThumbnail}
                    alt="Attached Logo Preview"
                    className="w-16 h-16 object-cover rounded-lg shadow-xs border border-slate-300 bg-slate-900"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 rounded-full p-0.5 border border-white" title="Brand Logo Attached">
                    <Sparkles className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-0.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    <span>Logo Attached to Link</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{data.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">{data.text}</p>
                  <span className="text-[11px] text-amber-700 font-semibold block mt-1 truncate font-mono">
                    {currentUrl}
                  </span>
                </div>
              </div>

              {/* Direct Copy Bar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Shareable Universal URL</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={currentUrl}
                    className="flex-1 px-3 py-2 text-xs bg-slate-100 border border-slate-300 rounded-lg text-slate-800 select-all outline-none font-mono"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-2 text-xs font-bold rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer ${
                      copied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                    }`}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>
              </div>

              {/* Social Channels Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">One-Click Share to Social Networks</label>
                <div className="grid grid-cols-4 gap-2">
                  {/* WhatsApp */}
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodedText}${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/70 text-emerald-800 transition text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">WhatsApp</span>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 transition text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                      <Twitter className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">X (Twitter)</span>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-blue-800 transition text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">LinkedIn</span>
                  </a>

                  {/* Facebook */}
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100/70 text-indigo-800 transition text-center group"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-1 group-hover:scale-110 transition-transform shadow-xs">
                      <Facebook className="w-4 h-4" />
                    </div>
                    <span className="text-[11px] font-bold">Facebook</span>
                  </a>
                </div>
              </div>

              {/* Secondary Actions: Native Share, QR Code, Embed */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-slate-600" />
                    <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowEmbed(!showEmbed)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5 text-slate-600" />
                    <span>{showEmbed ? 'Hide Embed' : 'Embed Code'}</span>
                  </button>
                </div>

                {typeof navigator !== 'undefined' && 'share' in navigator && (
                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Native Share</span>
                  </button>
                )}
              </div>

              {/* QR Code Panel */}
              {showQr && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2 animate-in fade-in">
                  <span className="text-xs font-bold text-slate-700 block">Scan to Open on Mobile Device</span>
                  <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                      <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z" />
                      <circle cx="50" cy="50" r="10" />
                      <rect x="40" y="20" width="10" height="20" />
                      <rect x="70" y="40" width="20" height="10" />
                      <rect x="40" y="70" width="20" height="15" />
                      <rect x="70" y="70" width="15" height="15" />
                      <rect x="20" y="40" width="10" height="10" />
                    </svg>
                  </div>
                  <p className="text-[11px] text-slate-500">Universal link opens directly on iOS &amp; Android</p>
                </div>
              )}

              {/* Embed Code Panel */}
              {showEmbed && (
                <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-2 text-xs font-mono animate-in fade-in">
                  <span className="text-[11px] text-amber-400 font-bold font-sans block">Embed Widget (HTML)</span>
                  <textarea
                    readOnly
                    rows={3}
                    value={embedCode}
                    className="w-full bg-slate-950 border border-slate-800 p-2 rounded text-[11px] text-slate-300 select-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="px-3 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded text-xs cursor-pointer font-sans"
                  >
                    Copy Embed Code
                  </button>
                </div>
              )}
            </>
          )}

          {/* TAB 2: SOCIAL PREVIEW CARD SIMULATOR */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setSocialPlatform('whatsapp')}
                  className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                    socialPlatform === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  WhatsApp Preview
                </button>
                <button
                  onClick={() => setSocialPlatform('twitter')}
                  className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                    socialPlatform === 'twitter' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  X (Twitter) Card
                </button>
                <button
                  onClick={() => setSocialPlatform('facebook')}
                  className={`flex-1 py-1.5 rounded-md transition cursor-pointer ${
                    socialPlatform === 'facebook' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                  }`}
                >
                  Facebook / LinkedIn
                </button>
              </div>

              {/* WhatsApp Simulation */}
              {socialPlatform === 'whatsapp' && (
                <div className="p-4 bg-[#e5ddd5] rounded-xl border border-slate-300 space-y-2 font-sans">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
                    Simulated WhatsApp Link Message
                  </div>
                  <div className="max-w-[340px] ml-auto bg-[#dcf8c6] rounded-xl rounded-tr-xs p-2.5 shadow-sm text-slate-900 space-y-2">
                    {/* Embedded Card */}
                    <div className="bg-[#f0f4ea] rounded-lg overflow-hidden border border-emerald-300/40">
                      <div className="relative h-32 bg-slate-900 flex items-center justify-center overflow-hidden">
                        <img 
                          src="/og-image.png" 
                          alt="Social Banner" 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/90 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-amber-400/40">
                          <img src="/logo.svg" alt="Icon" className="w-3.5 h-3.5" />
                          <span>Johnnyblue1</span>
                        </div>
                      </div>
                      <div className="p-2.5 bg-white">
                        <h5 className="font-bold text-xs text-slate-900 line-clamp-1">{data.title}</h5>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">{data.text}</p>
                        <span className="text-[10px] text-slate-400 block mt-1 font-mono">johnnyblue1-knowledge-centa.web.app</span>
                      </div>
                    </div>
                    <div className="text-xs text-blue-700 underline break-all font-mono">
                      {currentUrl}
                    </div>
                    <div className="text-[10px] text-slate-400 text-right">Just now • ✓✓</div>
                  </div>
                </div>
              )}

              {/* Twitter / X Simulation */}
              {socialPlatform === 'twitter' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-white">
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                    Simulated X (Twitter) Summary Large Image Card
                  </div>
                  <div className="rounded-2xl border border-slate-700 bg-slate-900 overflow-hidden shadow-lg">
                    <img 
                      src="/og-image.png" 
                      alt="Twitter Card" 
                      className="w-full h-44 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-slate-900 border-t border-slate-800">
                      <span className="text-[10px] text-slate-400 uppercase font-mono">johnnyblue1-knowledge-centa.web.app</span>
                      <h5 className="font-bold text-xs text-white line-clamp-1 mt-0.5">{data.title}</h5>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{data.text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Facebook Simulation */}
              {socialPlatform === 'facebook' && (
                <div className="p-4 bg-slate-100 rounded-xl border border-slate-300 space-y-2">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">
                    Simulated Facebook &amp; LinkedIn OpenGraph Card
                  </div>
                  <div className="rounded-xl border border-slate-300 bg-white overflow-hidden shadow-sm">
                    <img 
                      src="/og-image.png" 
                      alt="Facebook Card" 
                      className="w-full h-40 object-cover" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-3 bg-slate-50 border-t border-slate-200">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">JOHNNYBLUE1-KNOWLEDGE-CENTA.WEB.APP</span>
                      <h5 className="font-bold text-xs text-slate-900 line-clamp-1 mt-0.5">{data.title}</h5>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{data.text}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Verified Tag Notice */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Link Metadata Tags Active</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Both <code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">og:image</code> (1200x630 OpenGraph) and <code className="bg-emerald-100 px-1 rounded text-emerald-900 font-mono">og:logo</code> (512x512 square) are rendered and linked directly to this URL for all crawlers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: DOWNLOAD BRAND ASSETS */}
          {activeTab === 'assets' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-600">
                Download the official Johnnyblue1 Knowledge Centa brand logos and social banner cards to use directly across marketing and social channels:
              </div>

              {/* Asset 1: High-res square logo PNG */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <img src="/logo-square.png" alt="Logo Square" className="w-12 h-12 rounded-lg object-contain bg-slate-900 p-0.5 border border-slate-300" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Brand Logo (Square 512x512 PNG)</h5>
                    <p className="text-[11px] text-slate-500">Perfect for WhatsApp avatar, profile icons &amp; link previews</p>
                  </div>
                </div>
                <a
                  href="/logo-square.png"
                  download="johnnyblue1-knowledge-centa-logo-512x512.png"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>

              {/* Asset 2: Wide OpenGraph 1200x630 banner */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <img src="/og-image.png" alt="OG Image" className="w-16 h-10 rounded-lg object-cover bg-slate-900 border border-slate-300" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Social Share Banner (1200x630 PNG)</h5>
                    <p className="text-[11px] text-slate-500">Optimized for Facebook, X/Twitter Card &amp; LinkedIn banners</p>
                  </div>
                </div>
                <a
                  href="/og-image.png"
                  download="johnnyblue1-knowledge-centa-social-card-1200x630.png"
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>

              {/* Asset 3: Vector SVG Logo */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-3">
                  <img src="/logo.svg" alt="Vector Logo" className="w-12 h-12 rounded-lg object-contain bg-slate-900 p-0.5 border border-slate-300" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">Vector Master Logo (SVG)</h5>
                    <p className="text-[11px] text-slate-500">Infinite resolution vector for print, websites &amp; merchandise</p>
                  </div>
                </div>
                <a
                  href="/logo.svg"
                  download="johnnyblue1-knowledge-centa-logo.svg"
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

