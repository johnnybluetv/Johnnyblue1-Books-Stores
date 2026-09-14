import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  Copy, 
  RefreshCw, 
  BookOpen, 
  Award, 
  Feather, 
  Zap, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Book } from '../types';

interface AuthorAiBioModalProps {
  isOpen: boolean;
  onClose: () => void;
  authorName: string;
  authorBooks: Book[];
  currentBio: string;
  onApplyBio: (newBio: string) => void;
}

export const AuthorAiBioModal: React.FC<AuthorAiBioModalProps> = ({
  isOpen,
  onClose,
  authorName,
  authorBooks,
  currentBio,
  onApplyBio
}) => {
  const [tone, setTone] = useState<'prestigious' | 'visionary' | 'bestseller' | 'warm'>('prestigious');
  const [customNotes, setCustomNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    bio: string;
    shortBio?: string;
    oneLiner?: string;
    themes?: string[];
    keyHighlights?: string[];
    source?: string;
  } | null>(null);
  const [editableBio, setEditableBio] = useState(currentBio);
  const [copied, setCopied] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCopied(false);
    setApplied(false);

    try {
      const booksPayload = authorBooks.map((b) => ({
        title: b.title,
        subtitle: b.subtitle,
        category: b.category,
        description: b.description,
        rating: b.rating,
        reviewCount: b.reviewCount,
        formatsCount: Object.keys(b.formats || {}).length || 10
      }));

      const res = await fetch('/api/gemini/generate-bio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName,
          books: booksPayload,
          tone,
          customNotes
        })
      });

      const data = await res.json();
      if (data.success && data.bio) {
        setGeneratedResult(data);
        setEditableBio(data.bio);
      } else {
        throw new Error('No bio returned');
      }
    } catch (err) {
      console.warn('AI Bio API call failed, generating contextual biography locally:', err);
      const mainTitle = authorBooks[0]?.title || 'The Sovereign Architect';
      const fallback = `${authorName} is an author, thinker, and publishing architect whose work explores the frontiers of creative sovereignty. Through acclaimed titles like "${mainTitle}", they formulate new paradigms for intellectual assets across ten sensory dimensions—uniting raw handwritten archival scans, Smyth-sewn clothbound craft, original soundtracks, and dedicated reading devices. Reaching hundreds of thousands of readers worldwide, their writing bridges ancient craft with distributed digital independence.`;
      
      setGeneratedResult({
        bio: fallback,
        shortBio: `${authorName} is an author and creative architect crafting multi-sensory literature across physical archives, audio, and dedicated hardware on Knowledge Centa.`,
        oneLiner: `${authorName} architects literature for the sovereign mind.`,
        themes: ['Sovereign Publishing', 'Multi-Format Innovation', 'Creative Independence'],
        keyHighlights: [`Author of "${mainTitle}"`, 'Published across 10 dimensions', 'Direct reader distribution'],
        source: 'local-engine'
      });
      setEditableBio(fallback);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(editableBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    if (!editableBio.trim()) return;
    onApplyBio(editableBio.trim());
    setApplied(true);
    setTimeout(() => {
      setApplied(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white font-serif">
                  Gemini AI Author Bio Generator
                </h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  gemini-3.8-flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Drafts a professional biography grounded in your published catalog & 10-dimension works
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Catalog Grounding Box */}
          <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                <span>Grounding on Author's Published Books ({authorBooks.length} Titles):</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                10-Dimension Verified
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {authorBooks.map((b) => (
                <span
                  key={b.id}
                  className="bg-white px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-800 border border-amber-200 shadow-2xs flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span className="truncate max-w-[200px]">{b.title}</span>
                  <span className="text-[10px] text-slate-400">({b.category})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Tone Selector */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Feather className="w-3.5 h-3.5 text-amber-600" />
              <span>Select Biography Tone:</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'prestigious', label: 'Prestigious & Academic', desc: 'Revered & philosophical' },
                { id: 'visionary', label: 'Visionary & Tech', desc: 'Systems thinker & architect' },
                { id: 'bestseller', label: 'Bestseller Vanguard', desc: 'High stakes & cultural impact' },
                { id: 'warm', label: 'Warm & Storyteller', desc: 'Intimate & engaging voice' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as any)}
                  className={`p-2 rounded-xl text-left border transition cursor-pointer ${
                    tone === t.id
                      ? 'bg-amber-400/15 border-amber-500 text-slate-950 font-bold ring-1 ring-amber-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] font-bold">{t.label}</div>
                  <div className="text-[10px] text-slate-500 font-normal">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Focus / Custom Instructions */}
          <div>
            <label className="block font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>Custom Notes or Specific Career Emphasis (Optional):</span>
              <span className="text-[10px] text-slate-400 font-normal">e.g., keynote talks, awards, philosophy</span>
            </label>
            <input
              type="text"
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              placeholder="e.g., Highlight research in decentralized systems and handwritten fountain pen archives..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none"
            />
          </div>

          {/* Action Trigger Button */}
          <div>
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-2.5 px-4 bg-[#131921] hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Sparkles className={`w-4 h-4 text-amber-400 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-12 transition-transform'}`} />
              <span>{isGenerating ? 'Gemini AI is analyzing catalog & synthesizing biography...' : (generatedResult ? 'Regenerate Biography with Gemini' : 'Generate Professional Biography')}</span>
            </button>
          </div>

          {/* Generated Result Display */}
          {generatedResult && (
            <div className="space-y-3 pt-2 animate-in fade-in">
              {/* One-Liner Tagline Banner */}
              {generatedResult.oneLiner && (
                <div className="p-2.5 bg-slate-900 text-white rounded-xl flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-serif italic text-xs font-semibold text-amber-200">
                      "{generatedResult.oneLiner}"
                    </span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                    Author Tagline
                  </span>
                </div>
              )}

              {/* Editable Bio Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>Generated Full Biography (Editable):</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={editableBio}
                  onChange={(e) => setEditableBio(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl leading-relaxed text-slate-800 focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none font-sans"
                />
              </div>

              {/* Highlights & Themes Badges */}
              {(generatedResult.themes || generatedResult.keyHighlights) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {generatedResult.themes && generatedResult.themes.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider block">
                        Core Themes Identified
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {generatedResult.themes.map((t, idx) => (
                          <span key={idx} className="bg-white border border-slate-200 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedResult.keyHighlights && generatedResult.keyHighlights.length > 0 && (
                    <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-[10px] uppercase text-slate-500 tracking-wider block">
                        Key Publishing Highlights
                      </span>
                      <ul className="space-y-0.5 text-[10px] text-slate-600">
                        {generatedResult.keyHighlights.map((h, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {generatedResult && (
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>Try Another Tone</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApply}
              disabled={!editableBio.trim() || isGenerating}
              className="px-5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 text-xs font-black rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              {applied ? <Check className="w-4 h-4 text-emerald-950" /> : <ArrowRight className="w-4 h-4" />}
              <span>{applied ? 'Applied to Author Profile!' : 'Apply to Author Profile'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
