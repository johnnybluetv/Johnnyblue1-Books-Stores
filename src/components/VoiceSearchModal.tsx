import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Search, 
  Volume2, 
  VolumeX,
  Sparkles, 
  AlertCircle, 
  Check, 
  ArrowRight,
  BookOpen,
  Headphones,
  Video,
  PenTool,
  Layers,
  DollarSign,
  ShoppingCart,
  Eye,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book, FormatType, AiVoiceSearchResult } from '../types';
import { processAiVoiceSearch } from '../services/aiVoiceSearchService';

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  const { 
    books, 
    setSearchQuery, 
    setSelectedCategory, 
    setCurrentView, 
    setActiveBook, 
    setIsLookInsideOpen, 
    addToCart 
  } = useStore();

  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<AiVoiceSearchResult | null>(null);
  const [matchedBooks, setMatchedBooks] = useState<Book[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hasSpeechRecognition, setHasSpeechRecognition] = useState<boolean>(true);
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(true);
  const [addedBookId, setAddedBookId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // Suggested voice queries categorized across 10 dimensions
  const SUGGESTED_VOICE_QUERIES = [
    { text: 'Find silk and cotton woven editions under fifty dollars', tag: 'Silk Artisan', dim: 'Dimension 9' },
    { text: 'Show me handwritten manuscript scans by Johnny Blue', tag: 'Raw Scans', dim: 'Dimension 4' },
    { text: 'Audiobooks narrated by Johnny Blue', tag: 'Audio', dim: 'Dimension 2' },
    { text: 'Dedicated standalone E-Ink reading device', tag: 'Hardware', dim: 'Dimension 10' },
    { text: 'Clothbound hardcovers with gold foil stamping', tag: 'Print', dim: 'Dimension 5' },
    { text: 'Musical album soundtracks and lossless audio', tag: 'Original Score', dim: 'Dimension 8' },
    { text: '4K cinematic video master chapters', tag: 'Video', dim: 'Dimension 3' },
    { text: 'Pendrive and micro SD card archive vault', tag: 'Hardware Vault', dim: 'Dimension 7' }
  ];

  useEffect(() => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechRecognition(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setErrorMessage(null);
      setAiResult(null);
      setMatchedBooks([]);
      startListening();
    } else {
      stopListening();
    }

    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setHasSpeechRecognition(false);
      setErrorMessage('Speech recognition is not supported in this browser environment. Tap any AI voice command below to test.');
      return;
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMessage(null);
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[0].isFinal) {
          executeAiSearch(currentTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setErrorMessage('Microphone access was blocked. Please allow microphone permissions or tap any sample AI query below.');
        } else if (event.error === 'no-speech') {
          setErrorMessage('No voice detected. Tap the mic button to try speaking again.');
        } else {
          setErrorMessage(`Voice capture: ${event.error}. You can still use the instant AI queries below.`);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Error initiating speech recognition:', err);
      setIsListening(false);
      setErrorMessage('Could not initialize microphone. You can tap any sample query below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  // AI Voice Query Interpretation & Execution
  const executeAiSearch = async (queryText: string) => {
    const cleanQuery = queryText.trim();
    if (!cleanQuery) return;

    stopListening();
    setIsAiProcessing(true);
    setErrorMessage(null);

    try {
      const result = await processAiVoiceSearch(cleanQuery, books);
      setAiResult(result);

      // Filter matched books
      const foundBooks = books.filter(b => result.matchingBookIds.includes(b.id));
      setMatchedBooks(foundBooks.length ? foundBooks : books.slice(0, 3));

      // Speak back TTS response if enabled
      if (ttsEnabled && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(result.voiceAnswerSummary);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // ignore
        }
      }

    } catch (err) {
      console.warn('Error in AI voice search:', err);
      setErrorMessage('Failed to interpret voice query with AI. You can tap to browse all books.');
    } finally {
      setIsAiProcessing(false);
    }
  };

  // Apply filters and navigate to store view
  const handleApplyToStore = () => {
    if (aiResult) {
      setSearchQuery(aiResult.cleanSearchQuery);
      if (aiResult.detectedCategory) {
        setSelectedCategory(aiResult.detectedCategory);
      }
      setCurrentView('store');
      onClose();
    }
  };

  const handleQuickLookInside = (book: Book) => {
    setActiveBook(book);
    setIsLookInsideOpen(true);
    onClose();
  };

  const handleQuickAddToCart = (book: Book, formatType?: FormatType) => {
    const targetFormat = formatType 
      ? book.formats[formatType] 
      : (book.formats.ebook || Object.values(book.formats)[0]);

    if (targetFormat) {
      addToCart(book, targetFormat);
      setAddedBookId(book.id);
      setTimeout(() => setAddedBookId(null), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div 
        id="ai-voice-search-modal-card"
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-slate-900 max-h-[92vh]"
      >
        
        {/* Header with AI Brand Accent */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center font-bold shadow-sm">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base font-serif">
                  AI Voice Search
                </h3>
                <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Cpu className="w-3 h-3" />
                  Gemini & Neural 10D
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Speak natural commands across format, author, price, and 10 dimensions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Speech Synthesis Toggle */}
            <button
              type="button"
              onClick={() => setTtsEnabled(!ttsEnabled)}
              className={`p-2 rounded-lg text-xs transition cursor-pointer flex items-center gap-1 ${
                ttsEnabled ? 'text-amber-400 bg-slate-800' : 'text-slate-500 hover:text-slate-300'
              }`}
              title={ttsEnabled ? 'Spoken Voice Response Enabled' : 'Voice Response Muted'}
            >
              {ttsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Center Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Microphone Wave Arena */}
          <div className="flex flex-col items-center text-center space-y-4">
            
            <div className="relative flex items-center justify-center">
              {isListening && (
                <>
                  <div className="absolute w-28 h-28 rounded-full bg-amber-400/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full bg-amber-400/40 animate-pulse" />
                </>
              )}

              <button
                id="voice-mic-toggle-btn"
                type="button"
                onClick={() => {
                  if (isListening) {
                    stopListening();
                  } else {
                    startListening();
                  }
                }}
                className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-transform cursor-pointer ${
                  isListening 
                    ? 'bg-amber-400 text-slate-950 scale-105 ring-4 ring-amber-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-2 border-slate-300'
                }`}
                title={isListening ? 'Click to stop listening' : 'Click to start listening'}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-pulse" />
                ) : (
                  <MicOff className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {/* Sound Waves Animation when listening */}
            {isListening && (
              <div className="flex items-center gap-1.5 h-6">
                {[40, 70, 100, 60, 90, 45, 80].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-amber-500 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.6 + (i % 3) * 0.2}s`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Live Transcript / Status */}
            <div className="space-y-2 max-w-md w-full">
              {isAiProcessing ? (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
                  <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
                  <span>Gemini AI is parsing voice semantics and dimensional intent...</span>
                </div>
              ) : isListening ? (
                <div>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    Listening... Speak naturally
                  </p>
                  <div className="text-base font-serif font-bold text-slate-900 mt-2 min-h-[28px] italic">
                    {transcript ? `"${transcript}"` : 'Say "Find silk woven books under fifty dollars"...'}
                  </div>
                </div>
              ) : transcript && !aiResult ? (
                <div>
                  <p className="text-xs text-slate-500 mb-1">Captured voice input:</p>
                  <p className="text-sm font-semibold font-serif text-slate-900 italic">"{transcript}"</p>
                  <button
                    type="button"
                    onClick={() => executeAiSearch(transcript)}
                    className="mt-2 py-1.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze with AI</span>
                  </button>
                </div>
              ) : !aiResult ? (
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Tap the mic to speak, or select any AI command preset below.
                  </p>
                </div>
              ) : null}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900 text-left flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>

          </div>

          {/* AI Semantic Result Breakdown & Spoken Answer */}
          {aiResult && (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 animate-in fade-in">
              
              {/* Spoken Answer Summary Banner */}
              <div className="flex items-start gap-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-lg text-emerald-950 text-xs">
                <Volume2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <strong className="block font-bold">AI Voice Response:</strong>
                  <p className="text-[12px] leading-relaxed mt-0.5 font-serif">
                    "{aiResult.voiceAnswerSummary}"
                  </p>
                </div>
              </div>

              {/* Extracted Intelligence Chips */}
              <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                <span className="font-bold text-slate-500 mr-1">AI Detected:</span>
                
                {aiResult.detectedFormat && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-900 rounded-full font-bold flex items-center gap-1 border border-purple-200">
                    <Layers className="w-3 h-3 text-purple-600" />
                    <span>Format: {aiResult.detectedFormat.replace('_', ' ').toUpperCase()}</span>
                  </span>
                )}

                {aiResult.detectedDimensionNumber && (
                  <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full font-bold border border-amber-200">
                    Dimension #{aiResult.detectedDimensionNumber}
                  </span>
                )}

                {aiResult.maxPrice && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                    <DollarSign className="w-3 h-3 text-emerald-600" />
                    <span>Max: ${aiResult.maxPrice}</span>
                  </span>
                )}

                {aiResult.detectedAuthor && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full font-bold border border-blue-200">
                    Author: {aiResult.detectedAuthor}
                  </span>
                )}

                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full font-bold text-[10px]">
                  {Math.round(aiResult.confidenceScore * 100)}% Confidence
                </span>
              </div>

              {/* Matched Books Preview Strip */}
              {matchedBooks.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-slate-600 font-bold">
                    <span>Matching Masterworks ({matchedBooks.length}):</span>
                    <button
                      type="button"
                      onClick={handleApplyToStore}
                      className="text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline cursor-pointer"
                    >
                      <span>View in Full Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {matchedBooks.slice(0, 4).map((book) => {
                      const primaryFormat = aiResult.detectedFormat && book.formats[aiResult.detectedFormat]
                        ? book.formats[aiResult.detectedFormat]
                        : (book.formats.ebook || Object.values(book.formats)[0]);

                      return (
                        <div 
                          key={book.id}
                          className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs hover:border-amber-400 transition flex items-center gap-2.5 group"
                        >
                          <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded shadow-2xs shrink-0"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-900 truncate font-serif">
                              {book.title}
                            </h5>
                            <p className="text-[10px] text-slate-500 truncate">
                              by {book.author}
                            </p>
                            
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs font-black text-slate-900 font-serif">
                                ${primaryFormat?.price.toFixed(2) || '19.99'}
                              </span>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleQuickLookInside(book)}
                                  className="p-1 hover:bg-slate-100 rounded text-slate-600 transition"
                                  title="Look Inside"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickAddToCart(book, aiResult.detectedFormat)}
                                  className="p-1 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded transition"
                                  title="Add to Cart"
                                >
                                  {addedBookId === book.id ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Preset Suggested Voice Queries */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Tap Any AI Voice Query to Test Across 10 Dimensions:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SUGGESTED_VOICE_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTranscript(q.text);
                    executeAiSearch(q.text);
                  }}
                  className="p-2.5 bg-slate-50 hover:bg-amber-50/80 border border-slate-200 hover:border-amber-300 rounded-xl text-left transition flex items-start gap-2 cursor-pointer group shadow-2xs"
                >
                  <Volume2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 group-hover:text-slate-950 line-clamp-1">
                      "{q.text}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-amber-700 font-bold">
                        {q.dim}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        • {q.tag}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Connected to Gemini AI Search Engine</span>
          </div>

          {aiResult && (
            <button
              type="button"
              onClick={handleApplyToStore}
              className="px-4 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>Show {matchedBooks.length} Results in Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
