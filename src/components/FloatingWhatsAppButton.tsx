import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  MessageSquare, 
  X, 
  Send, 
  Move, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  HelpCircle,
  PhoneCall
} from 'lucide-react';

export const USER_PRIMARY_WHATSAPP = '233555414967'; // User WhatsApp: https://wa.me/233555414967/

export const FloatingWhatsAppButton: React.FC = () => {
  const { activeBook, books } = useStore();

  // Position state (defaults to bottom right)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return {
      x: typeof window !== 'undefined' ? window.innerWidth - (isMobile ? 76 : 84) : 280,
      y: typeof window !== 'undefined' ? window.innerHeight - (isMobile ? 140 : 130) : 550
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: 0,
    posY: 0
  });

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAuthorNumber, setSelectedAuthorNumber] = useState(activeBook?.authorWhatsapp || USER_PRIMARY_WHATSAPP);
  const [customMessage, setCustomMessage] = useState(
    activeBook ? `Hi ${activeBook.author}, I am reading about "${activeBook.title}" on Knowledge Centa and wanted to ask...` : 'Hello, I have a question regarding the books and publishing dimensions on Knowledge Centa.'
  );

  // Keep author sync when activeBook changes
  useEffect(() => {
    if (activeBook?.authorWhatsapp) {
      setSelectedAuthorNumber(activeBook.authorWhatsapp);
      setCustomMessage(
        `Hi ${activeBook.author}, I am viewing "${activeBook.title}" on Knowledge Centa and would like to inquire about...`
      );
    } else {
      setSelectedAuthorNumber(USER_PRIMARY_WHATSAPP);
    }
  }, [activeBook]);

  // Adjust coordinates on window resize to ensure button stays on screen
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const maxX = window.innerWidth - 76;
        const maxY = window.innerHeight - 76;
        return {
          x: Math.min(Math.max(16, prev.x), maxX),
          y: Math.min(Math.max(60, prev.y), maxY)
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- TOUCH HANDLERS (for finger dragging on mobile screen) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.startX;
    const deltaY = touch.clientY - dragStartRef.current.startY;

    if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
      setHasMoved(true);
    }

    const maxX = window.innerWidth - 68;
    const maxY = window.innerHeight - 68;
    const newX = Math.min(Math.max(12, dragStartRef.current.posX + deltaX), maxX);
    const newY = Math.min(Math.max(50, dragStartRef.current.posY + deltaY), maxY);

    setPosition({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (!hasMoved) {
      setIsOpen(prev => !prev);
    }
  };

  // --- MOUSE HANDLERS (for dragging on desktop) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.startX;
      const deltaY = moveEvent.clientY - dragStartRef.current.startY;

      if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
        setHasMoved(true);
      }

      const maxX = window.innerWidth - 76;
      const maxY = window.innerHeight - 76;
      const newX = Math.min(Math.max(16, dragStartRef.current.posX + deltaX), maxX);
      const newY = Math.min(Math.max(50, dragStartRef.current.posY + deltaY), maxY);

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!hasMoved) {
      setIsOpen(prev => !prev);
    }
  };

  const handleLaunchWhatsApp = (explicitNumber?: string) => {
    const target = explicitNumber || selectedAuthorNumber || USER_PRIMARY_WHATSAPP;
    const cleanPhone = target.replace(/[^0-9]/g, '') || USER_PRIMARY_WHATSAPP;
    const encoded = encodeURIComponent(customMessage);
    // Target link explicitly requested by user: https://wa.me/233555414967/
    const url = `https://wa.me/${cleanPhone}/?text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const QUICK_PROMPTS = [
    {
      label: 'Pre-order Silk & Cotton Edition',
      text: `Hi ${activeBook?.author || 'Author'}, I would like to reserve an artisanal Silk & Cotton heirloom edition of "${activeBook?.title || 'your book'}". What is the next production schedule?`
    },
    {
      label: 'Dedicated Tablet with 9 Dimensions',
      text: `Hello ${activeBook?.author || 'Author'}, I am interested in the Dedicated Hardware Tablet pre-loaded with all 9 formats of "${activeBook?.title || 'your masterwork'}". How do I secure unit allocation?`
    },
    {
      label: 'Raw Handwritten Scans Inquiry',
      text: `Hello ${activeBook?.author || 'Author'}, I love the concept of the raw handwritten manuscript scans. Are custom annotated notebooks available for purchase?`
    },
    {
      label: 'Draft2Digital Print Copies',
      text: `Hi ${activeBook?.author || 'Author'}, I want to order physical hardcover/paperback copies via Draft2Digital. Could you send me the direct distributor links?`
    }
  ];

  return (
    <>
      {/* Draggable WhatsApp Bubble Button */}
      <div
        id="floating-movable-whatsapp-container"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999,
          touchAction: 'none'
        }}
        className="select-none"
      >
        <div className="relative group">
          {/* Tooltip hint on hover (desktop) */}
          <div className="hidden sm:group-hover:flex absolute right-full mr-3 top-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-lg bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-lg pointer-events-none transition-opacity">
            <span>Chat Author on WhatsApp</span>
            <span className="text-stone-400 font-normal text-[10px] flex items-center gap-0.5 border-l border-stone-700 pl-1.5">
              <Move className="h-2.5 w-2.5" /> Drag anywhere
            </span>
          </div>

          <button
            id="floating-whatsapp-btn"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onClick={handleClick}
            aria-label="Chat with authors on WhatsApp"
            className={`flex h-14 w-14 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-2xl transition-transform active:scale-95 ${
              isDragging ? 'scale-105 shadow-2xl cursor-grabbing ring-4 ring-[#25D366]/40' : 'cursor-grab animate-bounce-gentle'
            }`}
          >
            {/* WhatsApp SVG Icon */}
            <svg 
              className="h-8 w-8 fill-current" 
              viewBox="0 0 24 24"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>

            {/* Little draggable grip indicator */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-stone-900 text-white shadow">
              <Move className="h-2.5 w-2.5" />
            </span>

            {/* Pulse Dot */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-ping opacity-75" />
          </button>
        </div>
      </div>

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-[#075E54] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={activeBook?.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                    alt="Author"
                    className="h-11 w-11 rounded-full object-cover border-2 border-white/80"
                  />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {activeBook ? activeBook.author : 'Knowledge Centa Author Desk'}
                  </h3>
                  <p className="text-[11px] text-emerald-100 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                    Online • Direct WhatsApp Inquiries
                  </p>
                </div>
              </div>

              <button
                id="close-whatsapp-modal-btn"
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 bg-stone-50/50">
              {/* Selected Book Context */}
              {activeBook && (
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-stone-200 shadow-2xs">
                  <BookOpen className="h-4 w-4 text-stone-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {activeBook.title}
                    </p>
                    <p className="text-[10px] text-stone-500 truncate">
                      Draft2Digital • Pre-Orders • Dedicated Tablet • Studio FLAC
                    </p>
                  </div>
                </div>
              )}

              {/* Author Switcher / Phone number */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Recipient Author Number:
                  </label>
                  <span className="text-[10px] font-bold text-[#075E54] bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                    +233 (Ghana)
                  </span>
                </div>
                <select
                  id="whatsapp-author-select"
                  value={selectedAuthorNumber}
                  onChange={(e) => setSelectedAuthorNumber(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-xs text-stone-800 shadow-2xs focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
                >
                  <option value={USER_PRIMARY_WHATSAPP}>
                    Johnny Blue — Direct Author Desk (+233 55 541 4967) [Primary]
                  </option>
                  {books.map(b => (
                    <option key={b.id} value={b.authorWhatsapp || USER_PRIMARY_WHATSAPP}>
                      {b.author} ({b.title.slice(0, 26)}...)
                    </option>
                  ))}
                  <option value={USER_PRIMARY_WHATSAPP}>
                    Knowledge Centa Creator Operations (+233 55 541 4967)
                  </option>
                </select>
              </div>

              {/* Instant WhatsApp Quick Link Badge */}
              <div className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-[#075E54] shrink-0" />
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-[#075E54]">Author Direct: </span>
                    <a
                      href="https://wa.me/233555414967/"
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-emerald-800 underline hover:text-emerald-950 font-bold"
                    >
                      https://wa.me/233555414967/
                    </a>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleLaunchWhatsApp(USER_PRIMARY_WHATSAPP)}
                  className="px-2 py-1 bg-[#25D366] hover:bg-[#20ba5a] text-white text-[10px] font-extrabold rounded-md shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  Quick Chat
                </button>
              </div>

              {/* Quick Prompt Chips */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Quick Inquiries & Pre-Order Requests:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PROMPTS.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCustomMessage(prompt.text)}
                      className="text-left text-[11px] font-medium bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {prompt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Your WhatsApp Message:
                </label>
                <textarea
                  id="whatsapp-message-textarea"
                  rows={3}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Type your message to the author..."
                  className="w-full rounded-xl border border-stone-300 bg-white p-3 text-xs text-stone-900 shadow-2xs focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366]"
                />
              </div>

              {/* Drag instruction notice */}
              <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1">
                <span className="flex items-center gap-1">
                  <Move className="h-3 w-3" />
                  Tip: The green button is finger-movable across the screen.
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-stone-200 space-y-2">
              <button
                id="launch-whatsapp-chat-btn"
                onClick={() => handleLaunchWhatsApp()}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 px-4 font-bold text-sm text-white shadow-md hover:bg-[#20ba5a] active:scale-[0.99] transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span>Send WhatsApp to Author (+233 55 541 4967)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
