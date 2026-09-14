import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Check, 
  ArrowRight, 
  RefreshCw, 
  Lightbulb, 
  Layers,
  BookOpen
} from 'lucide-react';
import { BlogAiSuggestions, BlogMediaItem } from '../types';

interface BlogAiSuggestionsPanelProps {
  currentCategory: string;
  mediaItems: BlogMediaItem[];
  onApplySuggestions: (suggestions: BlogAiSuggestions) => void;
}

export const BlogAiSuggestionsPanel: React.FC<BlogAiSuggestionsPanelProps> = ({
  currentCategory,
  mediaItems,
  onApplySuggestions
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [topicInput, setTopicInput] = useState('');
  const [authorNotes, setAuthorNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<BlogAiSuggestions | null>(null);
  const [applied, setApplied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setApplied(false);

    try {
      const primaryMedia = mediaItems[0];
      const response = await fetch('/api/ai/blog-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicInput,
          category: currentCategory,
          mediaType: primaryMedia?.type || '',
          mediaFileName: primaryMedia?.name || '',
          authorNotes: authorNotes,
          authorName: 'Johnny Blue'
        })
      });

      const data = await response.json();
      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.warn('AI suggestions error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!suggestions) return;
    onApplySuggestions(suggestions);
    setApplied(true);
    setTimeout(() => {
      setIsOpen(false);
      setApplied(false);
    }, 1200);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 rounded-xl border border-amber-400/40 p-3.5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950 shadow-xs">
            <Sparkles className="w-4 h-4 text-slate-950" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 font-serif">
              Gemini AI Editorial Copilot & Suggestions
            </h4>
            <p className="text-[11px] text-slate-600">
              Generate titles, markdown articles, SEO tags & media captions in seconds
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>{isOpen ? 'Close AI Assist' : 'Open AI Suggestions'}</span>
        </button>
      </div>

      {isOpen && (
        <div className="pt-2 border-t border-amber-300/40 space-y-3 animate-in fade-in duration-200">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Article Theme / Topic Idea
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. Why Handloom Silk books foster deep cognitive presence"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Key Angle or Notes (Optional)
              </label>
              <input
                type="text"
                value={authorNotes}
                onChange={(e) => setAuthorNotes(e.target.value)}
                placeholder="e.g. Include 10-dimension comparison and Google SEO benefits"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs bg-white text-slate-900 outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Prompt Generate Button */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              {mediaItems.length > 0 ? `Will analyze ${mediaItems.length} attached media asset(s)` : 'Generates complete 10-dimension ready article'}
            </span>

            <button
              type="button"
              disabled={isGenerating}
              onClick={handleGenerate}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black rounded-lg text-xs shadow transition flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Drafting Suggestions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate AI Suggestions</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Result Preview */}
          {suggestions && (
            <div className="bg-white rounded-xl p-4 border border-amber-300 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  AI Suggestions Ready (gemini-3.8-flash)
                </span>

                <button
                  type="button"
                  onClick={handleApply}
                  className={`px-3 py-1 rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer ${
                    applied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-amber-400 hover:bg-amber-500 text-slate-950'
                  }`}
                >
                  {applied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied to Article!</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-3.5 h-3.5" />
                      <span>Apply to Form (1-Click)</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-amber-600">Proposed Title</p>
                <h5 className="font-bold text-sm text-slate-900 font-serif leading-snug">{suggestions.title}</h5>
                <p className="text-xs text-slate-600 mt-0.5 italic">{suggestions.subtitle}</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-amber-600">Suggested Category & Tags</p>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    {suggestions.category}
                  </span>
                  {suggestions.suggestedTags?.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-amber-600">Excerpt & Content Preview</p>
                <p className="text-xs text-slate-700 line-clamp-3 bg-slate-50 p-2 rounded-lg border border-slate-100 font-serif">
                  {suggestions.articleContent}
                </p>
              </div>

              {suggestions.suggestedMediaCaption && (
                <div className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg border border-purple-100">
                  <strong className="text-purple-700">Media Caption:</strong> {suggestions.suggestedMediaCaption}
                </div>
              )}
            </div>
          )}

        </div>
      )}
    </div>
  );
};
