import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Wand2,
  Download,
  Check,
  X,
  Palette,
  Layers,
  Image as ImageIcon,
  RefreshCw,
  Sliders,
  Copy,
  ExternalLink,
  BookOpen,
  Feather,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import confetti from 'canvas-confetti';

interface AuthorCoverGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTitle?: string;
  initialSubtitle?: string;
  initialAuthor?: string;
  initialCategory?: string;
  onApplyCover?: (coverUrl: string) => void;
}

export interface GeneratedCoverConcept {
  conceptName: string;
  artDirectionSummary: string;
  colorPalette: string[];
  foilEffect: string;
  typography: {
    titleFont: string;
    subtitleFont: string;
    letterSpacing: string;
  };
  dimensionBadgeText: string;
  artworkUrl: string;
  alternativeArtworks: string[];
  previewUrl: string;
  variations: Array<{
    name: string;
    gradient: string;
    accentColor: string;
    tagline: string;
  }>;
}

const AESTHETIC_STYLES = [
  { id: 'minimalist_gold_foil', label: 'Minimalist Gold Foil', desc: 'Embossed gold on dark obsidian leather' },
  { id: 'silk_cotton_weave', label: 'Handloom Silk & Cotton', desc: 'Organic woven textile with gold thread' },
  { id: 'classical_oil', label: 'Classical Oil & Gilded', desc: 'Museum fine art canvas with ornate framing' },
  { id: 'cosmic_geometry', label: 'Cosmic & Sacred Geometry', desc: 'Astronomical celestial charts with gold foil' },
  { id: 'raw_manuscript', label: 'Raw Manuscript & Ink', desc: 'Fountain pen ink, vellum & aged parchment' },
  { id: 'cyberpunk_neon', label: 'Cyberpunk & E-Ink', desc: 'High-contrast circuit matrix for dedicated tablets' }
];

export const AuthorCoverGeneratorModal: React.FC<AuthorCoverGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialTitle = 'The Sovereign Creator',
  initialSubtitle = 'A Definitive Manual for Digital Architects',
  initialAuthor = 'Johnny Blue',
  initialCategory = 'Philosophy & Knowledge',
  onApplyCover
}) => {
  const { showNotification } = useStore() as any;

  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle);
  const [author, setAuthor] = useState(initialAuthor);
  const [genre, setGenre] = useState(initialCategory);
  const [selectedStyle, setSelectedStyle] = useState('minimalist_gold_foil');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState(0);

  // Generated Cover Concept state
  const [generatedConcept, setGeneratedConcept] = useState<GeneratedCoverConcept>({
    conceptName: 'Obsidian & Gilded Folio',
    artDirectionSummary: 'A high-contrast book cover framed in dark obsidian cloth with embossed gold foil typography, designed for timeless presence across all 10 publishing dimensions.',
    colorPalette: ['#0f172a', '#f59e0b', '#d97706', '#f8fafc'],
    foilEffect: 'gold',
    typography: {
      titleFont: 'Cinzel / Cormorant Garamond',
      subtitleFont: 'Plus Jakarta Sans',
      letterSpacing: 'tracking-widest'
    },
    dimensionBadgeText: 'Sovereign 10-Dimension Edition',
    artworkUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1200&auto=format&fit=crop',
    alternativeArtworks: [
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop'
    ],
    previewUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=1200&auto=format&fit=crop',
    variations: [
      {
        name: 'Classical Gold Leaf',
        gradient: 'from-slate-950 via-stone-900 to-amber-950',
        accentColor: '#f59e0b',
        tagline: 'Embossed Gold Foil on Obsidian Cloth'
      },
      {
        name: 'Handloom Silk Weave',
        gradient: 'from-[#1a1412] via-[#2a1d17] to-[#3d271d]',
        accentColor: '#d97706',
        tagline: 'Organic Silk & Cotton Texture'
      },
      {
        name: 'High-Tech Architect',
        gradient: 'from-[#0d131a] via-[#16202c] to-[#1f2937]',
        accentColor: '#38bdf8',
        tagline: 'Precision Vector for Dedicated Hardware'
      }
    ]
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      if (initialTitle) setTitle(initialTitle);
      if (initialSubtitle) setSubtitle(initialSubtitle);
      if (initialAuthor) setAuthor(initialAuthor);
      if (initialCategory) setGenre(initialCategory);
    }
  }, [isOpen, initialTitle, initialSubtitle, initialAuthor, initialCategory]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle,
          author,
          genre,
          style: selectedStyle,
          customPrompt
        })
      });

      const data = await res.json();
      if (data.success && data.coverArt) {
        setGeneratedConcept(data.coverArt);
        setSelectedVariationIndex(0);
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      console.error('Error generating cover art:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    const selectedUrl = generatedConcept.artworkUrl || generatedConcept.previewUrl;
    if (onApplyCover) {
      onApplyCover(selectedUrl);
    }
    onClose();
  };

  const handleDownloadPng = () => {
    // Generate a high-resolution 1200x1800 publication-ready PNG using Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1800;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = generatedConcept.artworkUrl;

    img.onload = () => {
      // Draw background image
      ctx.drawImage(img, 0, 0, 1200, 1800);

      // Dark elegant gradient vignette
      const gradient = ctx.createLinearGradient(0, 0, 0, 1800);
      gradient.addColorStop(0, 'rgba(10, 15, 25, 0.7)');
      gradient.addColorStop(0.5, 'rgba(10, 15, 25, 0.3)');
      gradient.addColorStop(0.7, 'rgba(10, 15, 25, 0.6)');
      gradient.addColorStop(1, 'rgba(5, 8, 15, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1200, 1800);

      // Subtle gold inner border
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.strokeRect(60, 60, 1080, 1680);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.strokeRect(74, 74, 1052, 1652);

      // Top Badge
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('JOHNNYBLUE1 • KNOWLEDGE CENTA', 600, 180);

      // Book Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 72px Georgia, serif';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;

      // Multi-line wrap title
      const words = title.toUpperCase().split(' ');
      let line = '';
      let y = 620;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 950 && n > 0) {
          ctx.fillText(line.trim(), 600, y);
          line = words[n] + ' ';
          y += 90;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 600, y);

      // Subtitle
      if (subtitle) {
        ctx.fillStyle = '#fcd34d';
        ctx.font = '30px sans-serif';
        ctx.shadowBlur = 4;
        ctx.fillText(subtitle, 600, y + 80);
      }

      // Author Name at bottom
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 44px Georgia, serif';
      ctx.fillText(author.toUpperCase(), 600, 1540);

      // 10 Dimensions Badge
      ctx.fillStyle = '#f59e0b';
      ctx.font = '22px sans-serif';
      ctx.fillText('SOVEREIGN 10-DIMENSION EDITION', 600, 1620);

      // Download
      const link = document.createElement('a');
      link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_cover_art.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };

    img.onerror = () => {
      // Fallback download direct url
      window.open(generatedConcept.artworkUrl, '_blank');
    };
  };

  const currentVariation = generatedConcept.variations[selectedVariationIndex] || generatedConcept.variations[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-[#131921] text-white p-4 sm:p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold font-serif text-white tracking-tight">
                  Auto-Generate Book Cover Art
                </h3>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  AI Studio
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Synthesize publication-ready cover designs with embossed gold foil & multi-dimension formatting
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Left Controls, Right Real-time Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Form & Style Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Title & Subtitle */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                  Book Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Sovereign Creator"
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Subtitle / Tagline
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g., A Definitive Manual"
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Author Byline
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g., Johnny Blue"
                    className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Aesthetic Style Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Artistic & Dimension Style</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                  10 Dimensions Ready
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {AESTHETIC_STYLES.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer text-xs ${
                      selectedStyle === st.id
                        ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-400/40'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white leading-tight">{st.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-normal">
                      {st.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Artist Direction Prompt */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1">
                <span>Custom Visual Direction (Optional)</span>
                <Wand2 className="w-3 h-3 text-amber-500" />
              </label>
              <textarea
                rows={2}
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g. Minimalist golden labyrinth on black velvet, deep celestial shadows, foil letterpress typography..."
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Primary Generate Button */}
            <div className="pt-2">
              <button
                id="modal-run-generate-cover-btn"
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Synthesizing Cover Art with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Auto-Generate Cover Art with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Variations Pill Selector */}
            {generatedConcept.variations.length > 0 && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Visual Concept Variations:</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">1-Click Preview</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {generatedConcept.variations.map((v, idx) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => {
                        setSelectedVariationIndex(idx);
                        if (generatedConcept.alternativeArtworks[idx]) {
                          setGeneratedConcept(prev => ({
                            ...prev,
                            artworkUrl: prev.alternativeArtworks[idx]
                          }));
                        }
                      }}
                      className={`p-2 rounded-lg text-left border transition cursor-pointer ${
                        selectedVariationIndex === idx
                          ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-500 ring-1 ring-amber-400 font-bold'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <div className="text-[11px] text-slate-900 dark:text-white truncate">{v.name}</div>
                      <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">{v.tagline}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Live Book Wrap Preview & Actions (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-100 dark:bg-slate-950/70 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            
            <div className="text-center">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                {generatedConcept.conceptName}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Live 3D Book Jacket Simulation
              </span>
            </div>

            {/* 3D Book Visual Mockup */}
            <div className="relative w-52 sm:w-60 h-76 sm:h-84 rounded-r-xl rounded-l-xs overflow-hidden shadow-2xl border-r-2 border-b-2 border-slate-900/40 transform transition hover:scale-[1.02] duration-300 group">
              
              {/* Spine edge shadow for realistic 3D book depth */}
              <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/70 via-black/30 to-transparent z-20 pointer-events-none" />
              <div className="absolute top-0 bottom-0 left-3 w-px bg-white/20 z-20 pointer-events-none" />

              {/* Background Artwork */}
              <img
                src={generatedConcept.artworkUrl}
                alt="Cover Artwork"
                className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-700 group-hover:scale-105"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/70 z-10" />

              {/* Gold Filigree Border */}
              <div className="absolute inset-3 border border-amber-400/40 rounded-r-lg z-15 pointer-events-none" />
              <div className="absolute inset-4 border border-amber-500/20 rounded-r-md z-15 pointer-events-none" />

              {/* Book Cover Typography Layer */}
              <div className="relative z-20 h-full flex flex-col justify-between p-4 text-center select-none">
                
                {/* Publisher Header Badge */}
                <div>
                  <div className="text-[8px] tracking-[3px] text-amber-300 font-bold uppercase">
                    Johnnyblue1 • Sovereign
                  </div>
                  <div className="w-8 h-px bg-amber-400/60 mx-auto mt-1" />
                </div>

                {/* Book Title & Subtitle */}
                <div className="my-auto space-y-1 px-1">
                  <h4 className="text-sm sm:text-base font-black font-serif text-white uppercase tracking-wider drop-shadow-md leading-tight line-clamp-3">
                    {title}
                  </h4>
                  {subtitle && (
                    <p className="text-[9px] text-amber-200 font-sans tracking-tight line-clamp-2">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Author Byline & Dimension Badge */}
                <div className="space-y-1">
                  <div className="w-12 h-px bg-amber-400/60 mx-auto" />
                  <div className="text-[10px] font-bold text-white font-serif tracking-widest uppercase">
                    {author}
                  </div>
                  <div className="text-[7px] text-amber-400 font-mono tracking-tight bg-black/50 px-1.5 py-0.5 rounded-full inline-block border border-amber-400/30">
                    10 Dimensions Master Edition
                  </div>
                </div>

              </div>

            </div>

            {/* Art Direction Notes */}
            <div className="w-full text-center px-2">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed italic line-clamp-2">
                "{generatedConcept.artDirectionSummary}"
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="w-full space-y-2 pt-1">
              <button
                id="apply-generated-cover-btn"
                type="button"
                onClick={handleApply}
                className="w-full py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-sm transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4 text-slate-950" />
                <span>Apply This Cover Art to Book</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-[11px] transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High-Res (PNG)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedConcept.artworkUrl);
                    showNotification?.('Cover Art URL copied to clipboard!');
                  }}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition cursor-pointer"
                  title="Copy direct artwork URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
