import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  Mic, 
  MicOff, 
  BookOpen, 
  Layers, 
  Feather, 
  Compass, 
  ShieldCheck,
  ChevronRight,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Book } from '../types';
import { useStore } from '../context/StoreContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: string;
  source?: string;
  followUps?: string[];
}

interface BookChatAssistantProps {
  book: Book;
  onSelectDimension?: (dim: string) => void;
}

export const BookChatAssistant: React.FC<BookChatAssistantProps> = ({ 
  book,
  onSelectDimension
}) => {
  const { t, currentLanguage } = useStore();
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'model',
      content: `### Welcome to the AI Book Scholar for **"${book.title}"**\n\nI am grounded in the complete literary context of this work by **${book.author}**—including its thematic architecture, chapter previews, author philosophy, and its craftsmanship across all **10 physical and digital dimensions**.\n\nWhat would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini-3.8-flash',
      followUps: [
        `Summarize the core thesis of "${book.title}"`,
        `Who is the ideal reader for this work?`,
        `How does the Silk & Cotton edition differ from the Dedicated E-Ink device?`,
        `What inspired ${book.author} to write this?`
      ]
    }
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = (questionText || inputQuestion).trim();
    if (!textToSend || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMessage: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      // Build conversation history payload
      const historyPayload = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          content: m.content
        }));

      const res = await fetch('/api/gemini/book-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: {
            id: book.id,
            title: book.title,
            subtitle: book.subtitle,
            author: book.author,
            authorBio: book.authorBio,
            category: book.category,
            description: book.description,
            pages: book.pages,
            isbn: book.isbn,
            publisher: book.publisher,
            formats: book.formats,
            chapterOnePreview: book.chapterOnePreview
          },
          messages: historyPayload,
          userQuestion: textToSend,
          language: currentLanguage
        })
      });

      const data = await res.json();
      if (data.success && data.answer) {
        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'model',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          source: data.source || 'gemini-3.8-flash',
          followUps: data.followUps || []
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to get answer');
      }
    } catch (err: any) {
      // Graceful conversational fallback
      const fallbackAiMessage: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        role: 'model',
        content: `### Literary Insights on "${book.title}"\n\n**Category:** ${book.category} • **Author:** ${book.author}\n\n${book.description}\n\n**Craftsmanship across 10 Dimensions:**\nThis title is available in eBook, Audiobook, 4K Videobook, Raw Fountain Pen Manuscript Scans, Clothbound Hardcover, Silk-Touch Papercover, 64GB USB-C Vault, Original Musical Score, Artisan Silk & Cotton Weave, and Dedicated Standalone E-Ink Hardware.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'local-grounded-engine',
        followUps: [
          `Tell me more about ${book.author}'s background`,
          `How was the manuscript created?`,
          `Can I preview Chapter 1?`
        ]
      };
      setMessages(prev => [...prev, fallbackAiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'model',
        content: `### Conversation Reset\n\nI am ready for fresh questions on **"${book.title}"** by **${book.author}**. Feel free to pick a prompt below or type your own question.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'gemini-3.8-flash',
        followUps: [
          `Summarize the core thesis of "${book.title}"`,
          `Who is the ideal reader for this work?`,
          `What formats include the musical score?`,
          `What makes ${book.author}'s style distinctive?`
        ]
      }
    ]);
  };

  // Toggle voice recognition
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setInputQuestion(`What are the key takeaways of ${book.title}?`);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = currentLanguage === 'es' ? 'es-ES' : currentLanguage === 'fr' ? 'fr-FR' : 'en-US';
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuestion(transcript);
        setIsListening(false);
        setTimeout(() => handleSend(transcript), 300);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Preset suggested query chips
  const suggestedQueries = [
    { label: 'Core Thesis', query: `What is the central philosophical argument or thesis of "${book.title}"?`, icon: Compass },
    { label: 'Ideal Reader', query: `Who is the target audience or ideal reader for "${book.title}"?`, icon: User },
    { label: '10 Dimensions', query: `Explain the physical and sensory craftsmanship behind the 10 editions of "${book.title}".`, icon: Layers },
    { label: 'Author Vision', query: `What inspired ${book.author} and what is their sovereign publishing philosophy?`, icon: Feather },
    { label: 'Chapter 1 Takeaways', query: `What are the primary insights and opening hooks established in Chapter 1?`, icon: BookOpen },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[640px]">
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white px-5 py-3.5 flex items-center justify-between border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Grounded AI Book Scholar
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" />
                Gemini 3.8
              </span>
            </div>
            <p className="text-[11px] text-stone-300 line-clamp-1">
              Deep contextual assistant for <span className="text-amber-200 font-medium">"{book.title}"</span> by {book.author}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearHistory}
            className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-700/60 rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
            title="Clear conversation history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Reset</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Question Pills */}
      <div className="px-4 py-2.5 bg-stone-50 border-b border-slate-200/80 overflow-x-auto flex items-center gap-2 scrollbar-thin">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" />
          Quick Ask:
        </span>
        {suggestedQueries.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSend(item.query)}
              disabled={isLoading}
              className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 text-slate-700 hover:text-amber-900 text-xs rounded-full border border-slate-200 shadow-2xs whitespace-nowrap shrink-0 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Icon className="w-3 h-3 text-amber-600" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed shadow-xs transition-all ${
                  isUser
                    ? 'bg-amber-600 text-white rounded-tr-xs font-medium'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {/* Meta Bar */}
                <div className="flex items-center justify-between gap-3 mb-1.5 pb-1 border-b border-slate-100/50 text-[10px] text-slate-400">
                  <span className={`font-semibold ${isUser ? 'text-amber-100' : 'text-stone-700'}`}>
                    {isUser ? 'You' : `AI Book Scholar (${msg.source || 'Gemini 3.8'})`}
                  </span>
                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition cursor-pointer"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <div className="prose prose-xs text-inherit space-y-2 whitespace-pre-line break-words">
                  {msg.content}
                </div>

                {/* Dynamic Suggested Follow-ups */}
                {!isUser && msg.followUps && msg.followUps.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <ChevronRight className="w-3 h-3 text-amber-600" />
                      Suggested Follow-Up Inquiries:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.followUps.map((fu, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(fu)}
                          disabled={isLoading}
                          className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200/80 transition cursor-pointer disabled:opacity-50"
                        >
                          {fu}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-start">
            <div className="w-8 h-8 rounded-full bg-stone-900 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-xs mt-1">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white text-slate-700 border border-slate-200 rounded-2xl rounded-tl-xs p-4 shadow-xs text-xs flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-800">
                  Synthesizing grounded response via Gemini 3.8 Flash...
                </span>
                <p className="text-[11px] text-slate-500">
                  Cross-referencing chapter previews, author philosophy & 10-dimension specs
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Ask anything about "${book.title}", ${book.author}, or the 10 editions...`}
              disabled={isLoading}
              className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 focus:bg-white text-xs border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition disabled:opacity-60 text-slate-900 placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={toggleVoiceInput}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition cursor-pointer ${
                isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'text-slate-400 hover:text-slate-700'
              }`}
              title={isListening ? 'Listening...' : 'Voice ask'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={!inputQuestion.trim() || isLoading}
            className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs font-bold rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Ask AI</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Grounded directly in authentic book metadata & 10 dimensions
          </span>
          <span className="text-[10px] text-slate-400">
            Powered by Gemini API
          </span>
        </div>
      </div>
    </div>
  );
};
