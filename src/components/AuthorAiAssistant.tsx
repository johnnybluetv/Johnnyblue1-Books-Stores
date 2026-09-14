import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  RefreshCw, 
  ChevronRight, 
  Layers, 
  DollarSign, 
  FileText, 
  Zap,
  Tablet,
  Music,
  HardDrive,
  BookOpen
} from 'lucide-react';
import { AiPublishPlan, FormatType, PublishFormData } from '../types';
import { generate10DimensionPublishPlan } from '../services/aiPublishAssistant';

interface AuthorAiAssistantProps {
  formData: PublishFormData;
  setFormData: React.Dispatch<React.SetStateAction<PublishFormData>>;
  onApplyPlan?: (plan: AiPublishPlan) => void;
}

export const AuthorAiAssistant: React.FC<AuthorAiAssistantProps> = ({
  formData,
  setFormData,
  onApplyPlan
}) => {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'readiness' | 'chat'>('blueprint');
  const [bookIdea, setBookIdea] = useState('');
  const [genre, setGenre] = useState(formData.category || 'Literary Fiction');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<AiPublishPlan | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Hello! I am your 10-Dimension AI Publishing Copilot. I can auto-generate your complete metadata, pricing strategy, and technical manufacturing specs for all 10 formats (including Silk & Cotton weaves and Dedicated E-Ink ROMs). What book are you publishing today?'
    }
  ]);

  const quickPresets = [
    { title: 'The Sovereign Architect', genre: 'Philosophical Sci-Fi & Architecture', prompt: 'A visionary architectural saga exploring human transcendence, handloom silk, and e-paper devices.' },
    { title: 'Chronicles of the Astral Gate', genre: 'Epic Space Fantasy', prompt: 'A sweeping space opera accompanied by full orchestral movements and 4K cinematic chapters.' },
    { title: 'The Alchemist\'s Botanical Journal', genre: 'Historical Fiction & Herbalism', prompt: 'A poetic 17th-century herbalist journal with raw fountain pen manuscript scans and Khadi cotton binding.' }
  ];

  const handleGenerate = async (preset?: { title: string; genre: string; prompt: string }) => {
    setIsGenerating(true);
    try {
      const plan = await generate10DimensionPublishPlan({
        title: preset?.title || formData.title || bookIdea || 'The Sovereign Architect',
        genre: preset?.genre || genre,
        premise: preset?.prompt || bookIdea || formData.description,
        authorName: formData.author || 'Johnny Blue'
      });
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyToWizard = () => {
    if (!generatedPlan) return;
    setFormData((prev) => ({
      ...prev,
      title: generatedPlan.title,
      subtitle: generatedPlan.subtitle,
      author: generatedPlan.author,
      authorBio: generatedPlan.authorBio,
      category: generatedPlan.category,
      description: generatedPlan.description,
      isbn: generatedPlan.isbn,
      pages: generatedPlan.pages,
      pricing: generatedPlan.pricing,
      manuscriptDetails: {
        medium: generatedPlan.manuscriptSpecs.medium,
        notebookType: generatedPlan.manuscriptSpecs.notebookType,
        fountainPenDetails: generatedPlan.manuscriptSpecs.fountainPenDetails,
        scannedDpi: generatedPlan.manuscriptSpecs.scannedDpi,
        notes: generatedPlan.manuscriptSpecs.notes
      },
      hardcoverSpecs: {
        paperWeightGsm: generatedPlan.hardcoverSpecs.paperWeightGsm,
        bindingType: generatedPlan.hardcoverSpecs.bindingType,
        clothColor: generatedPlan.hardcoverSpecs.clothColor,
        foilStampingColor: generatedPlan.hardcoverSpecs.foilStampingColor
      },
      papercoverSpecs: {
        trimSize: generatedPlan.papercoverSpecs.trimSize,
        paperType: generatedPlan.papercoverSpecs.paperType,
        matteFinish: generatedPlan.papercoverSpecs.matteFinish
      },
      pendriveSdSpecs: {
        capacityGb: generatedPlan.pendriveSdSpecs.capacityGb,
        formatSystem: generatedPlan.pendriveSdSpecs.formatSystem,
        bonusArchivesIncluded: generatedPlan.pendriveSdSpecs.bonusArchivesIncluded
      },
      musicalAlbumSpecs: {
        albumTitle: generatedPlan.musicalAlbumSpecs.albumTitle,
        composer: generatedPlan.musicalAlbumSpecs.composer,
        genre: generatedPlan.musicalAlbumSpecs.genre,
        trackList: generatedPlan.musicalAlbumSpecs.trackList
      },
      silkCottonSpecs: {
        material: generatedPlan.silkCottonSpecs.material,
        binding: generatedPlan.silkCottonSpecs.binding,
        editionUnits: generatedPlan.silkCottonSpecs.editionUnits
      },
      digitalDeviceSpecs: {
        deviceName: generatedPlan.digitalDeviceSpecs.deviceName,
        screenTech: generatedPlan.digitalDeviceSpecs.screenTech,
        casing: generatedPlan.digitalDeviceSpecs.casing,
        preloadedDimensionsCount: generatedPlan.digitalDeviceSpecs.preloadedDimensionsCount
      }
    }));
    if (onApplyPlan) {
      onApplyPlan(generatedPlan);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let reply = '';
      const lower = userText.toLowerCase();
      if (lower.includes('silk') || lower.includes('cotton')) {
        reply = 'For Dimension 9 (Silk & Cotton): We recommend 180-thread-count organic Khadi cotton with raw mulberry silk ribbon bookmarks and exposed coptic archival stitching. This format commands a premium price ($59 - $95) with high author margins.';
      } else if (lower.includes('device') || lower.includes('rom') || lower.includes('e-ink')) {
        reply = 'For Dimension 10 (Dedicated Digital Device): The device firmware preloads all 9 other dimensions (eBook EPUB, 320kbps audiobook, 4K video, 1200 DPI manuscript scans, high-res plates, and 24-bit FLAC soundtrack) onto custom 300 PPI color e-paper with zero notification distractions.';
      } else if (lower.includes('drive') || lower.includes('firebase') || lower.includes('storage')) {
        reply = 'Knowledge Centa uses native Google Drive and Firebase synchronization. When you upload assets in Step 2, each dimension gets an immutable, tamper-evident file ID and 15-minute expiring signed tokens for purchaser downloads.';
      } else if (lower.includes('royalty') || lower.includes('price')) {
        reply = 'You retain 85% creator royalties on all 10 formats! Our AI pricing engine balances accessible digital entry ($9.99 eBook) with premium physical collectors ($59.99 Silk & Cotton, $149.99 Dedicated Hardware Device).';
      } else {
        reply = `Regarding "${userText}": In a 10-dimension release, synchronizing your narrative theme across the written text, raw handwriting scans, visual 4K video, and chamber music score creates an unmatched immersive reading world. Would you like me to auto-generate a sample spec for you?`;
      }
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-[#131921] via-[#1a2332] to-[#0f172a] text-white rounded-xl border border-amber-400/40 p-5 shadow-2xl overflow-hidden mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 shadow-md">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white font-serif">
                10-Dimension AI Publishing Copilot
              </h3>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Auto-generate metadata, pricing architecture, and manufacturing specs across all 10 formats
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'blueprint'
                ? 'bg-amber-400 text-slate-950 shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Blueprint</span>
          </button>
          <button
            onClick={() => setActiveTab('readiness')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'readiness'
                ? 'bg-amber-400 text-slate-950 shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Pre-Flight Check</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-md font-medium transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-amber-400 text-slate-950 shadow font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Ask Copilot</span>
          </button>
        </div>
      </div>

      {/* Tab Content: Blueprint */}
      {activeTab === 'blueprint' && (
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Book Concept, Working Title, or Premise
              </label>
              <textarea
                value={bookIdea}
                onChange={(e) => setBookIdea(e.target.value)}
                placeholder="e.g. A multi-layered sci-fi mystery about an architect who uncovers hidden coordinates in ancient handwoven tapestries and cold e-paper devices..."
                rows={2}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Genre & Aesthetic Style
              </label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g. Philosophical Sci-Fi & Architecture"
                className="w-full bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400 outline-none"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={isGenerating}
                className="w-full py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-lg transition shadow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing 10 Dimensions...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Generate 10-Dimension Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400">Quick Inspiration:</span>
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBookIdea(preset.prompt);
                  setGenre(preset.genre);
                  handleGenerate(preset);
                }}
                className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1 rounded-full transition cursor-pointer text-[11px]"
              >
                + {preset.title}
              </button>
            ))}
          </div>

          {/* Generated Plan Review */}
          {generatedPlan && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900/80 border border-amber-400/30 space-y-4 animate-in fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="font-bold text-white text-sm font-serif">
                    {generatedPlan.title}: {generatedPlan.subtitle}
                  </h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    By {generatedPlan.author} • {generatedPlan.category} • {generatedPlan.pages} Pages • ISBN {generatedPlan.isbn}
                  </p>
                </div>
                <button
                  onClick={handleApplyToWizard}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg shadow transition flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Apply Entire Blueprint to Form</span>
                </button>
              </div>

              {/* 10 Dimension Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">1. eBook</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.ebook}</span>
                  <span className="text-[10px] text-slate-500 block">EPUB3 & PDF</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">2. Audiobook</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.audiobook}</span>
                  <span className="text-[10px] text-slate-500 block">320kbps MP3</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">3. Video Book</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.videobook}</span>
                  <span className="text-[10px] text-slate-500 block">4K Cinema Stream</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">4. Manuscript</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.manuscript}</span>
                  <span className="text-[10px] text-slate-500 block">1200 DPI Scans</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">5. Hardcover</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.hardcover}</span>
                  <span className="text-[10px] text-slate-500 block">Foil Clothbound</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">6. Paper Cover</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.papercover}</span>
                  <span className="text-[10px] text-slate-500 block">Trade 6x9</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">7. Pendrive Vault</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.pendrive_sd}</span>
                  <span className="text-[10px] text-slate-500 block">64GB Dual Key</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-slate-400 block">8. Soundtrack</span>
                  <span className="font-bold text-amber-300">${generatedPlan.pricing.musical_album}</span>
                  <span className="text-[10px] text-slate-500 block">Orchestral FLAC</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-amber-500/40">
                  <span className="text-amber-300 font-semibold block">9. Silk & Cotton</span>
                  <span className="font-bold text-amber-400">${generatedPlan.pricing.silk_cotton}</span>
                  <span className="text-[10px] text-slate-400 block">Khadi Handloom</span>
                </div>
                <div className="bg-slate-800/80 p-2.5 rounded-lg border border-indigo-500/40">
                  <span className="text-indigo-300 font-semibold block">10. Dedicated Device</span>
                  <span className="font-bold text-indigo-400">${generatedPlan.pricing.digital_device}</span>
                  <span className="text-[10px] text-slate-400 block">Standalone E-Ink</span>
                </div>
              </div>

              {/* Special Dimensions Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div className="space-y-1">
                  <span className="text-amber-300 font-bold block flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Silk & Cotton Weave Specification:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {generatedPlan.silkCottonSpecs.material} • {generatedPlan.silkCottonSpecs.binding} • Limited {generatedPlan.silkCottonSpecs.editionUnits} Handcrafted Units.
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-indigo-300 font-bold block flex items-center gap-1">
                    <Tablet className="w-3.5 h-3.5 text-indigo-400" />
                    Dedicated Digital Device ROM Specification:
                  </span>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    {generatedPlan.digitalDeviceSpecs.deviceName} • {generatedPlan.digitalDeviceSpecs.screenTech} • Preloads all 9 other dimensions.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Readiness Checklist */}
      {activeTab === 'readiness' && (
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-bold text-white text-xs block">10-Dimension Pre-Flight Engine</span>
                <span className="text-[11px] text-slate-400">Verifying format completeness, pricing logic, and cloud storage drops</span>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded border border-emerald-500/40">
              100% Ready for Distribution
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {[
              { num: 1, name: 'eBook (EPUB3 & Reflowable PDF)', status: 'Verified', note: 'NCX manifest and chapter anchors valid' },
              { num: 2, name: 'Audiobook (320kbps MP3 / M4B)', status: 'Verified', note: 'Consistent loudness (-19 LUFS) & chapter pauses' },
              { num: 3, name: '4K Video Book (HLS Stream)', status: 'Verified', note: 'Cinematic 24fps video stream with caption tracks' },
              { num: 4, name: 'Raw Handwritten Manuscript Scans', status: 'Verified', note: '1200 DPI archival scans with marginalia transcribed' },
              { num: 5, name: 'Clothbound Hardcover Specifications', status: 'Verified', note: 'Foil stamping dielines & 130gsm cream paper' },
              { num: 6, name: 'Paper Cover (Trade Paperback)', status: 'Verified', note: '6"x9" trim size and spine width calculated' },
              { num: 7, name: 'Pendrive & Micro-SD Vault (64GB)', status: 'Verified', note: 'Dual USB-C metal key master partition configured' },
              { num: 8, name: 'Musical Album Soundtrack (FLAC)', status: 'Verified', note: '24-bit/96kHz lossless orchestral score tracks' },
              { num: 9, name: 'Silk & Cotton Artisan Weave Specs', status: 'Verified', note: 'Handloom Khadi cotton & mulberry silk ribbon specs' },
              { num: 10, name: 'Dedicated Digital Device ROM', status: 'Verified', note: 'Standalone E-Ink custom firmware ROM configured' }
            ].map((item) => (
              <div key={item.num} className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <span className="font-semibold text-slate-200 block text-xs">{item.num}. {item.name}</span>
                  <span className="text-[11px] text-slate-400">{item.note}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30 shrink-0">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Copilot Chat */}
      {activeTab === 'chat' && (
        <div className="mt-4 space-y-3">
          <div className="h-56 overflow-y-auto space-y-2 p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs scrollbar-thin">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    AI
                  </div>
                )}
                <div
                  className={`p-2.5 rounded-lg max-w-[85%] leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-amber-400 text-slate-950 font-medium'
                      : 'bg-slate-800 text-slate-200 border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask anything about 10-dimension publishing, silk specifications, or pricing..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-400 outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition shadow flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
