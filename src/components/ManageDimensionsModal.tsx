import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Headphones,
  Video,
  FileText,
  BookMarked,
  Layers,
  HardDrive,
  Music,
  Feather,
  Tablet,
  DollarSign,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Book, FormatType } from '../types';
import { useStore } from '../context/StoreContext';

interface ManageDimensionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

interface DimensionMeta {
  key: FormatType;
  number: number;
  name: string;
  category: 'Digital' | 'Physical' | 'Hardware & Artifact';
  icon: React.ElementType;
  description: string;
  defaultPrice: number;
  accentColor: string;
}

const ALL_DIMENSIONS: DimensionMeta[] = [
  {
    key: 'ebook',
    number: 1,
    name: 'eBook (EPUB / PDF)',
    category: 'Digital',
    icon: BookOpen,
    description: 'Instant DRM-free reading across all phones, tablets, and e-readers.',
    defaultPrice: 9.99,
    accentColor: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
  },
  {
    key: 'audiobook',
    number: 2,
    name: 'Audiobook (MP3 / M4B)',
    category: 'Digital',
    icon: Headphones,
    description: '320kbps studio master narration with synchronized chapter bookmarks.',
    defaultPrice: 19.99,
    accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
  },
  {
    key: 'videobook',
    number: 3,
    name: 'Video Book (4K MP4 / Masterclass)',
    category: 'Digital',
    icon: Video,
    description: 'Author masterclass video series, lecture modules, and companion slides.',
    defaultPrice: 29.99,
    accentColor: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
  },
  {
    key: 'manuscript',
    number: 4,
    name: 'Raw Handwritten Manuscript',
    category: 'Digital',
    icon: FileText,
    description: '600 DPI scans of original ink draft notebooks with author annotations.',
    defaultPrice: 39.99,
    accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    key: 'hardcover',
    number: 5,
    name: 'Clothbound Hardcover Print',
    category: 'Physical',
    icon: BookMarked,
    description: 'Archival smyth-sewn binding with 24k gold foil stamping on linen.',
    defaultPrice: 35.00,
    accentColor: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    key: 'papercover',
    number: 6,
    name: 'Trade Paper Cover (Paperback)',
    category: 'Physical',
    icon: Layers,
    description: 'Velvet soft-touch matte finish with acid-free natural cream pages.',
    defaultPrice: 18.99,
    accentColor: 'text-teal-500 bg-teal-500/10 border-teal-500/20'
  },
  {
    key: 'pendrive_sd',
    number: 7,
    name: 'Pendrive & Micro-SD Hardware Vault',
    category: 'Hardware & Artifact',
    icon: HardDrive,
    description: 'Dual USB-C metal key + Micro-SD preloaded with all uncompressed master files.',
    defaultPrice: 69.99,
    accentColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
  },
  {
    key: 'musical_album',
    number: 8,
    name: 'Musical Album (Soundtrack)',
    category: 'Digital',
    icon: Music,
    description: 'Original composed ambient soundtrack, cello beds, and focus music.',
    defaultPrice: 14.99,
    accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
  },
  {
    key: 'silk_cotton',
    number: 9,
    name: 'Silk / Cotton Material Edition',
    category: 'Hardware & Artifact',
    icon: Feather,
    description: 'Hand-bound Mulberry silk & combed Egyptian cotton with archival Solander box.',
    defaultPrice: 95.00,
    accentColor: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    key: 'digital_device',
    number: 10,
    name: 'Dedicated Digital Device (E-Reader)',
    category: 'Hardware & Artifact',
    icon: Tablet,
    description: 'Dedicated 7.8" E-Ink hardware tablet carrying all 9 other dimensions preloaded.',
    defaultPrice: 299.00,
    accentColor: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
  }
];

export const ManageDimensionsModal: React.FC<ManageDimensionsModalProps> = ({
  isOpen,
  onClose,
  book
}) => {
  const { addBookDimensions, formatPrice } = useStore();
  const [selectedDims, setSelectedDims] = useState<FormatType[]>([]);
  const [customPrices, setCustomPrices] = useState<Partial<Record<FormatType, number>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (book) {
      setSelectedDims([]);
      const prices: Partial<Record<FormatType, number>> = {};
      ALL_DIMENSIONS.forEach((dim) => {
        if (book.formats[dim.key]?.price) {
          prices[dim.key] = book.formats[dim.key].price;
        } else {
          prices[dim.key] = dim.defaultPrice;
        }
      });
      setCustomPrices(prices);
    }
  }, [book]);

  if (!isOpen || !book) return null;

  // Calculate current active dimensions
  const activeDims = ALL_DIMENSIONS.filter((dim) => book.formats[dim.key]?.available);
  const inactiveDims = ALL_DIMENSIONS.filter((dim) => !book.formats[dim.key]?.available);

  const toggleDimSelection = (dimKey: FormatType) => {
    if (book.formats[dimKey]?.available) return; // Already active
    setSelectedDims((prev) =>
      prev.includes(dimKey) ? prev.filter((d) => d !== dimKey) : [...prev, dimKey]
    );
  };

  const handlePriceChange = (dimKey: FormatType, val: number) => {
    setCustomPrices((prev) => ({
      ...prev,
      [dimKey]: Math.max(0.99, Number(val) || 0.99)
    }));
  };

  const handleSelectAllInactive = () => {
    const allInactiveKeys = inactiveDims.map((d) => d.key);
    setSelectedDims(allInactiveKeys);
  };

  const handleActivateDimensions = async () => {
    if (selectedDims.length === 0) return;
    setIsSubmitting(true);
    try {
      await addBookDimensions(book.id, selectedDims, customPrices);
      onClose();
    } catch (err) {
      console.error('Error adding dimensions:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 text-stone-100 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header Banner */}
          <div className="relative p-6 sm:p-8 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border-b border-stone-800">
            <button
              id="close-manage-dimensions-modal"
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-16 h-24 sm:w-20 sm:h-28 object-cover rounded-lg shadow-md border border-stone-700"
              />
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    Sovereign Bookshelf Expansion
                  </span>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {activeDims.length} of 10 Dimensions Active
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
                  Add Dimensions to "{book.title}"
                </h2>
                <p className="text-sm text-stone-400 mt-1 max-w-2xl">
                  Authors have complete sovereignty to publish 1, 2, 3, 4, 5, 6, 7, 8, 9, or all 10 dimensions at launch, and return anytime to activate new physical, digital, or artifact tiers.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Selection Toolbar */}
          {inactiveDims.length > 0 && (
            <div className="px-6 py-3 bg-stone-950/60 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-stone-400">
                <span className="font-semibold text-amber-400">{inactiveDims.length}</span> dimension(s) ready to be activated on your bookshelf.
              </span>
              <div className="flex items-center gap-2">
                <button
                  id="select-all-inactive-dimensions"
                  type="button"
                  onClick={handleSelectAllInactive}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
                >
                  Select All {inactiveDims.length} Remaining Dimensions
                </button>
                {selectedDims.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedDims([])}
                    className="px-3 py-1.5 rounded-lg bg-stone-800/50 hover:bg-stone-800 text-stone-400 transition-colors"
                  >
                    Clear Selection
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Dimensions Grid */}
          <div className="p-6 max-h-[55vh] overflow-y-auto space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ALL_DIMENSIONS.map((dim) => {
                const isActive = book.formats[dim.key]?.available;
                const isSelected = selectedDims.includes(dim.key);
                const Icon = dim.icon;
                const price = customPrices[dim.key] ?? dim.defaultPrice;

                return (
                  <div
                    key={dim.key}
                    id={`dimension-card-${dim.key}`}
                    onClick={() => !isActive && toggleDimSelection(dim.key)}
                    className={`relative p-4 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-stone-950/40 border-stone-800 opacity-80 cursor-default'
                        : isSelected
                        ? 'bg-amber-500/10 border-amber-500/60 shadow-lg shadow-amber-500/5 cursor-pointer ring-1 ring-amber-500/40'
                        : 'bg-stone-950/20 border-stone-800/80 hover:border-stone-700 hover:bg-stone-900/40 cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`p-2.5 rounded-xl border ${dim.accentColor}`}>
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-500/90">
                              #{dim.number}
                            </span>
                            <h4 className="font-semibold text-sm text-stone-100 truncate">
                              {dim.name}
                            </h4>
                          </div>

                          {isActive ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </span>
                          ) : isSelected ? (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30 shrink-0">
                              <Plus className="w-3 h-3" /> Ready to Add
                            </span>
                          ) : (
                            <span className="text-[11px] text-stone-500 px-2 py-0.5 rounded-md bg-stone-900 border border-stone-800 shrink-0">
                              Not Published
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                          {dim.description}
                        </p>

                        {/* Price Row */}
                        <div className="mt-3 pt-2.5 border-t border-stone-800/60 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-stone-400">
                            {isActive ? 'Current Retail Price:' : 'Launch Price (USD):'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-stone-400 font-mono">$</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0.99"
                              value={price}
                              disabled={isActive}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => handlePriceChange(dim.key, parseFloat(e.target.value))}
                              className="w-20 px-2 py-0.5 text-xs text-right bg-stone-900 border border-stone-700 rounded text-stone-200 focus:outline-none focus:border-amber-500 disabled:opacity-60 disabled:cursor-not-allowed font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 bg-stone-950 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              <span>
                {selectedDims.length > 0
                  ? `Adding ${selectedDims.length} new dimension(s) will bring this book to ${activeDims.length + selectedDims.length} of 10 total dimensions.`
                  : 'Select any dimensions above to publish and expand this title.'}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-stone-700 hover:bg-stone-800 text-stone-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>

              <button
                id="confirm-activate-dimensions-btn"
                type="button"
                disabled={selectedDims.length === 0 || isSubmitting}
                onClick={handleActivateDimensions}
                className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-stone-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <span>Publishing Dimensions...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Activate {selectedDims.length} Dimension(s) on Bookshelf</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
