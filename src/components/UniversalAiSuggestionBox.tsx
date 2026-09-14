import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Check, 
  Copy, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb, 
  TrendingUp, 
  Tag,
  ArrowRight
} from 'lucide-react';

export type AiSuggestionContext = 
  | 'publishing-metadata'
  | 'publishing-files'
  | 'publishing-pricing'
  | 'publishing-confirmation'
  | 'blog-editor'
  | 'blog-comments'
  | 'reels-upload'
  | 'reels-comments'
  | 'author-dashboard'
  | 'author-profile'
  | 'general';

interface UniversalAiSuggestionBoxProps {
  context: AiSuggestionContext;
  title?: string;
  category?: string;
  notes?: string;
  extraData?: Record<string, any>;
  onApply?: (suggestionText: string) => void;
  label?: string;
  compact?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

interface SuggestionData {
  context: string;
  headline: string;
  primarySuggestion: string;
  alternativeSuggestions: string[];
  quickTips: string[];
  suggestedTagsOrKeywords: string[];
  estimatedImpact: string;
}

export const UniversalAiSuggestionBox: React.FC<UniversalAiSuggestionBoxProps> = ({
  context,
  title = '',
  category = '',
  notes = '',
  extraData = {},
  onApply,
  label,
  compact = false,
  defaultExpanded = true,
  className = ''
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [appliedIndex, setAppliedIndex] = useState<number | null>(null);
  const [suggestions, setSuggestions] = useState<SuggestionData | null>(null);

  // Fetch or generate suggestions based on context
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/universal-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          context,
          title,
          category,
          notes,
          extraData
        })
      });
      const data = await response.json();
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.warn('AI suggestions fetch notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, [context]);

  const handleCopy = (text: string, index: number) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  const handleApplyAction = (text: string, index: number) => {
    if (onApply) {
      onApply(text);
      setAppliedIndex(index);
      setTimeout(() => setAppliedIndex(null), 2000);
    } else {
      handleCopy(text, index);
    }
  };

  const defaultLabel = label || 'Gemini AI Suggestions & Smart Optimization';

  return (
    <div className={`rounded-2xl border border-amber-300/80 bg-gradient-to-r from-amber-500/8 via-orange-500/8 to-amber-500/4 p-3.5 sm:p-4 text-xs shadow-xs transition-all ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-900 font-serif text-xs sm:text-sm">
                {defaultLabel}
              </span>
              <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                AI Copilot
              </span>
            </div>
            {suggestions?.estimatedImpact && (
              <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="w-3 h-3 text-amber-600" />
                <span>{suggestions.estimatedImpact}</span>
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={fetchSuggestions}
            disabled={loading}
            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-800 hover:bg-amber-100 transition cursor-pointer"
            title="Refresh AI suggestions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-600' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <span>{isExpanded ? 'Minimize' : 'Expand Suggestions'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Body when expanded */}
      {isExpanded && suggestions && (
        <div className="mt-3.5 pt-3 border-t border-amber-200/70 space-y-3 animate-in fade-in duration-200">
          
          {/* Primary Recommendation */}
          <div className="p-3 bg-white rounded-xl border border-amber-200/90 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span className="font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span>{suggestions.headline || 'Top Recommendation'}</span>
              </span>
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Optimized for 10 Dimensions
              </span>
            </div>

            <p className="text-xs sm:text-[13px] font-serif text-slate-800 leading-relaxed">
              "{suggestions.primarySuggestion}"
            </p>

            <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleCopy(suggestions.primarySuggestion, 0)}
                className="px-2.5 py-1 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedIndex === 0 ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedIndex === 0 ? 'Copied' : 'Copy'}</span>
              </button>

              {onApply && (
                <button
                  type="button"
                  onClick={() => handleApplyAction(suggestions.primarySuggestion, 0)}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-[11px] font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  {appliedIndex === 0 ? <Check className="w-3 h-3" /> : <Wand2 className="w-3 h-3" />}
                  <span>{appliedIndex === 0 ? 'Applied!' : 'Apply to Field'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Alternative Variations */}
          {suggestions.alternativeSuggestions && suggestions.alternativeSuggestions.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Alternative Angles & Hooks:
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {suggestions.alternativeSuggestions.map((alt, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white/80 hover:bg-white rounded-lg border border-amber-200/60 flex items-center justify-between gap-3 text-slate-800 transition group"
                  >
                    <span className="text-xs leading-snug line-clamp-2">{alt}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(alt, idx + 1)}
                        className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                        title="Copy this variation"
                      >
                        {copiedIndex === idx + 1 ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                      {onApply && (
                        <button
                          type="button"
                          onClick={() => handleApplyAction(alt, idx + 1)}
                          className="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[10px] transition cursor-pointer flex items-center gap-1"
                        >
                          {appliedIndex === idx + 1 ? 'Applied' : 'Use'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tips */}
          {suggestions.quickTips && suggestions.quickTips.length > 0 && (
            <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/60 space-y-1">
              <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-600" />
                <span>Publishing Pro-Tips:</span>
              </span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-700">
                {suggestions.quickTips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggested Hashtags or SEO Keywords */}
          {suggestions.suggestedTagsOrKeywords && suggestions.suggestedTagsOrKeywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                <Tag className="w-3 h-3" />
                <span>Suggested Tags:</span>
              </span>
              {suggestions.suggestedTagsOrKeywords.map((tag, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onApply ? onApply(tag) : handleCopy(tag, 99 + idx)}
                  className="px-2 py-0.5 rounded-md bg-white border border-amber-300/80 hover:border-amber-500 hover:bg-amber-50 text-slate-700 hover:text-slate-900 text-[10px] font-semibold transition cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

        </div>
      )}

      {isExpanded && !suggestions && loading && (
        <div className="py-6 flex items-center justify-center gap-2 text-slate-500">
          <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
          <span>Generating Gemini AI Suggestions...</span>
        </div>
      )}
    </div>
  );
};
