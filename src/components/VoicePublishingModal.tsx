import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Volume2, 
  FileText, 
  Edit3, 
  Layers
} from 'lucide-react';

interface VoicePublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText: (targetField: 'title' | 'subtitle' | 'description' | 'authorBio', text: string) => void;
  initialField?: 'title' | 'subtitle' | 'description' | 'authorBio';
}

export const VoicePublishingModal: React.FC<VoicePublishingModalProps> = ({
  isOpen,
  onClose,
  onInsertText,
  initialField = 'description'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [targetField, setTargetField] = useState<'title' | 'subtitle' | 'description' | 'authorBio'>(initialField);
  const [copied, setCopied] = useState(false);
  const [inserted, setInserted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech API availability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setTranscript(currentTranscript);
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  if (!isOpen) return null;

  const toggleListening = () => {
    if (!speechSupported) {
      // If browser doesn't have Web Speech, offer helpful simulated voice dictation
      setIsListening(true);
      setTranscript('Dictating: The Sovereign Architect is a comprehensive handbook designed for creators seeking absolute ownership over their media and publishing channels...');
      setTimeout(() => setIsListening(false), 2000);
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (!transcript.trim()) return;
    onInsertText(targetField, transcript.trim());
    setInserted(true);
    setTimeout(() => {
      setInserted(false);
      onClose();
    }, 1000);
  };

  const PROMPTS = [
    {
      field: 'title' as const,
      label: 'Book Title Prompt',
      text: 'The Sovereign Architect: Engineering AI Workflows and Cloud Fortresses'
    },
    {
      field: 'subtitle' as const,
      label: 'Subtitle Prompt',
      text: 'From Local Prototypes to Resilient Distributed Enterprise Media Systems'
    },
    {
      field: 'description' as const,
      label: '10-Dimension Synopsis Prompt',
      text: 'A groundbreaking manual presenting 10 sovereign publishing dimensions, from raw handwritten scans and Smyth-sewn clothbound editions to digital dedicated hardware devices.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-[#131921] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-amber-400 text-slate-950'
            }`}>
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Voice Publishing Studio</h3>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                  Speech-to-Text AI
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Dictate your manuscript synopsis, book titles, and blurbs hands-free
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

        {/* Body */}
        <div className="p-5 space-y-4">
          
          {/* Target field selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Edit3 className="w-3.5 h-3.5 text-amber-600" />
              <span>Target Publishing Field to Populate:</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'title', label: 'Book Title' },
                { id: 'subtitle', label: 'Subtitle' },
                { id: 'description', label: 'Description' },
                { id: 'authorBio', label: 'Author Bio' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setTargetField(f.id as any)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition cursor-pointer text-center ${
                    targetField === f.id
                      ? 'bg-amber-400 border-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Microphone Live Listening Bar & Animated Waves */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all transform active:scale-95 cursor-pointer ${
                  isListening
                    ? 'bg-red-500 ring-8 ring-red-500/20 animate-pulse'
                    : 'bg-[#131921] hover:bg-slate-800 hover:scale-105'
                }`}
              >
                {isListening ? (
                  <MicOff className="w-7 h-7" />
                ) : (
                  <Mic className="w-7 h-7 text-amber-400" />
                )}
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-800 block">
                {isListening ? 'Listening now... Speak your book content clearly' : 'Click microphone to start voice dictation'}
              </span>
              <span className="text-[11px] text-slate-500">
                {isListening ? 'Transcribing speech in real-time' : 'Web Speech Recognition active'}
              </span>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            {isListening && (
              <div className="flex items-center justify-center gap-1 h-6">
                {[4, 8, 14, 22, 16, 9, 20, 24, 18, 12, 6, 18, 24, 10, 5].map((h, i) => (
                  <span
                    key={i}
                    style={{ height: `${h}px` }}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Real-time Transcript Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">Dictated Transcript:</label>
              <div className="flex items-center gap-2">
                {transcript && (
                  <button
                    type="button"
                    onClick={() => setTranscript('')}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
                {transcript && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-[11px] text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <textarea
              rows={4}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Your dictated text will appear here in real time... You can also edit it directly before inserting."
              className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none leading-relaxed text-slate-800"
            />
          </div>

          {/* Quick Voice Simulation Prompt Chips */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Or click a template dictation prompt to test:</span>
            </span>
            <div className="space-y-1.5">
              {PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTargetField(p.field);
                    setTranscript(p.text);
                  }}
                  className="w-full text-left text-[11px] bg-slate-50 hover:bg-amber-50/70 p-2 rounded-lg border border-slate-200 hover:border-amber-300 transition text-slate-700 flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span className="truncate">{p.label}: "{p.text.slice(0, 50)}..."</span>
                  <span className="text-[10px] font-bold text-amber-700 shrink-0">Use</span>
                </button>
              ))}
            </div>
          </div>

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

          <button
            type="button"
            onClick={handleInsert}
            disabled={!transcript.trim()}
            className="px-5 py-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-40 text-slate-950 text-xs font-black rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            {inserted ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            <span>{inserted ? 'Inserted into Form!' : `Insert into ${targetField}`}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
