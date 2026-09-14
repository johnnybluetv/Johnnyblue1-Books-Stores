import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Send, 
  Tag, 
  User, 
  CheckCircle2, 
  BookOpen, 
  PenLine, 
  Feather, 
  Smile, 
  FileText,
  Clock,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { saveBlogPostToFirestore } from '../services/firebase';

const BLOG_CATEGORIES = [
  'Literary Essays',
  'Author Dispatch',
  'Book Reviews',
  'Craft of Writing',
  'Reader Notes',
  'Behind the Scenes',
  '10-Dimension Reading'
];

const SUGGESTED_TAGS = [
  'BookTok',
  'ReadingLife',
  'IndieAuthor',
  'Manuscript',
  'BookReview',
  'SovereignCreator',
  'Philosophy'
];

const PRESET_COVERS = [
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1200&q=80'
];

export const FloatingBlogPenBubble: React.FC = () => {
  const { user, publishBlogPost, setCurrentView, showNotification } = useStore();

  // Position state (movable by finger / cursor)
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    // Default near bottom right
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;
    return {
      x: Math.max(16, width - 84),
      y: Math.max(80, height - 160)
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0
  });
  const hasMovedSignificantlyRef = useRef(false);

  // Modal open state
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for simple blog posting
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState(user?.displayName || 'Guest Writer');
  const [category, setCategory] = useState(BLOG_CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(['BookTok', 'ReadingLife']);
  const [customTagInput, setCustomTagInput] = useState('');

  // Sync authorName when logged in user changes
  useEffect(() => {
    if (user?.displayName && authorName === 'Guest Writer') {
      setAuthorName(user.displayName);
    }
  }, [user]);

  // Adjust on window resize to keep bubble in view
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 72),
        y: Math.min(prev.y, window.innerHeight - 72)
      }));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse / Touch handlers for finger drag
  const handlePointerDown = (clientX: number, clientY: number) => {
    setIsDragging(true);
    hasMovedSignificantlyRef.current = false;
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: position.x,
      initialY: position.y
    };
  };

  const handlePointerMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - dragStartRef.current.startX;
    const deltaY = clientY - dragStartRef.current.startY;

    if (Math.hypot(deltaX, deltaY) > 6) {
      hasMovedSignificantlyRef.current = true;
    }

    const newX = Math.max(12, Math.min(window.innerWidth - 68, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(70, Math.min(window.innerHeight - 68, dragStartRef.current.initialY + deltaY));

    setPosition({ x: newX, y: newY });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // If it was dragged, don't trigger click
    if (hasMovedSignificantlyRef.current) return;
    setIsOpen(true);
  };

  // Toggle tag
  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => 
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Add custom tag
  const handleAddCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTagInput.trim()) {
      e.preventDefault();
      const clean = customTagInput.trim().replace(/^#/, '');
      if (!selectedTags.includes(clean)) {
        setSelectedTags([...selectedTags, clean]);
      }
      setCustomTagInput('');
    }
  };

  // Submit Blog Post (Supports both Authors and Guests without mandatory sign-in wall!)
  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      showNotification('Please enter an article title and content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const isGuest = !user;
      const cleanAuthor = authorName.trim() || (isGuest ? 'Guest Writer' : 'Independent Author');
      const cleanExcerpt = excerpt.trim() || content.trim().slice(0, 180) + '...';
      const readTime = `${Math.max(2, Math.ceil(content.split(/\s+/).length / 180))} min read`;

      const newPostPayload = {
        title: title.trim(),
        author: cleanAuthor,
        authorRole: isGuest ? 'Guest Contributor' : (user?.role === 'author' ? 'Verified Author' : 'Reader'),
        authorAvatar: user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        coverImage,
        excerpt: cleanExcerpt,
        content: content.trim(),
        category,
        tags: selectedTags.map(t => `#${t.replace(/^#/, '')}`),
        readTime
      };

      const created = await publishBlogPost(newPostPayload);

      // Also persist directly to Firestore collection
      await saveBlogPostToFirestore(created);

      // Celebrate
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Reset form
      setTitle('');
      setContent('');
      setExcerpt('');
      setIsOpen(false);

      showNotification(`✓ Article published by ${cleanAuthor}! Now live in the Community Blog.`);
      setCurrentView('blog');
    } catch (err: any) {
      console.error('Blog post creation error:', err);
      showNotification(err?.message || 'Could not publish article. Saved locally.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* FLOATING DRAGGABLE BUBBLE: "A Hand Holding Pen"              */}
      {/* ------------------------------------------------------------- */}
      <div
        id="floating-blog-pen-bubble"
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 50,
          touchAction: 'none'
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
        onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          handlePointerDown(touch.clientX, touch.clientY);
        }}
        onTouchMove={(e) => {
          const touch = e.touches[0];
          handlePointerMove(touch.clientX, touch.clientY);
        }}
        onTouchEnd={handlePointerUp}
        onClick={handleClick}
        className={`select-none cursor-grab active:cursor-grabbing group transition-transform duration-150 ${
          isDragging ? 'scale-110 shadow-2xl ring-4 ring-amber-400' : 'hover:scale-105 shadow-xl'
        }`}
        title="Movable by finger: Tap to Post a Blog as an Author or Guest"
        aria-label="Post a Blog Article"
      >
        <div className="relative flex items-center justify-center">
          {/* Pulsing halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 animate-ping opacity-25" />

          {/* Core Golden Bubble */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#131921] via-[#232f3e] to-[#0f172a] p-1 border-2 border-amber-400 shadow-2xl flex items-center justify-center overflow-hidden">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex flex-col items-center justify-center text-slate-950 p-1.5 shadow-inner">
              
              {/* Hand Holding Pen Iconic Graphic */}
              <svg 
                viewBox="0 0 32 32" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-slate-950 filter drop-shadow-xs"
              >
                {/* Stylized Hand Contour */}
                <path 
                  d="M10 21C8 21 6 22 5 24C4 26 5 28 8 28C11 28 15 28 19 28C22 28 24 26 23 23C22 20 20 20 18 20L15 20" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Pen Barrel & Nib */}
                <path 
                  d="M26 6L21 11L13 19L11 23L15 21L23 13L28 8C28.5 7.5 28.5 6.5 28 6L26 4C25.5 3.5 24.5 3.5 24 4L21 7" 
                  fill="#131921"
                  stroke="#131921" 
                  strokeWidth="1.8" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                />
                {/* Gold Nib Tip Line */}
                <path 
                  d="M11 23L12.5 20" 
                  stroke="#fbbf24" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                />
                {/* Radiating Creative Ink Sparkle */}
                <circle cx="27" cy="4" r="1.5" fill="#fef08a" />
              </svg>
            </div>
          </div>

          {/* Floating mini badge: "Post Blog" */}
          <div className="absolute -bottom-2 whitespace-nowrap bg-slate-900 text-amber-300 text-[10px] font-black font-sans px-2 py-0.5 rounded-full border border-amber-400/60 shadow-md">
            Post Blog
          </div>

          {/* Mobile finger grab hint */}
          <div className="absolute -top-2 -right-1 bg-amber-400 text-slate-950 text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
            ✍️
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SIMPLIFIED BLOG POSTING MODAL                                 */}
      {/* ------------------------------------------------------------- */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-2xl max-h-[92vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#131921] to-[#232f3e] text-white flex items-center justify-between border-b border-amber-500/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow font-black">
                  <PenLine className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-white flex items-center gap-2">
                    <span>Quick Blog Studio</span>
                    <span className="text-[11px] font-sans font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                      Author &amp; Guest Friendly
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Publish your thoughts, reviews, or essays in seconds. No complex setup required.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSubmitBlog} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              
              {/* Row 1: Author Pen Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    <span>Author / Pen Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g., Johnny Blue, Maya A., Guest Reader"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    {user ? 'Logged in as verified user' : 'Posting as Guest Writer (no account needed)'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-amber-600" />
                    <span>Blog Category</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:border-amber-500 outline-none cursor-pointer"
                  >
                    {BLOG_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Article Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>Article Title *</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Why Physical Handwritten Scans Bring Literature to Life..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm font-serif font-bold text-slate-900 focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Row 3: Short Excerpt / Teaser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  <span>Short Summary / Teaser</span>
                </label>
                <input
                  type="text"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="One catchy sentence introducing your article..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>

              {/* Row 4: Main Content (Reader friendly) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5 text-amber-600" />
                    <span>Story / Essay Content *</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans font-normal">
                    {content.split(/\s+/).filter(Boolean).length} words
                  </span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts here. Share book insights, author reflections, excerpts, reading notes, or ideas..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-serif text-slate-900 leading-relaxed focus:bg-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                />
              </div>

              {/* Row 5: Preset Cover Image Picker */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  <span>Choose Cover Image Aesthetic</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {PRESET_COVERS.map((url, idx) => (
                    <div
                      key={idx}
                      onClick={() => setCoverImage(url)}
                      className={`relative aspect-[16/9] rounded-lg overflow-hidden border-2 cursor-pointer transition ${
                        coverImage === url ? 'border-amber-500 ring-2 ring-amber-400/50' : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      {coverImage === url && (
                        <div className="absolute top-1 right-1 w-4 h-4 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 6: Interactive Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Hashtags &amp; Topics</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {SUGGESTED_TAGS.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => handleToggleTag(tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition cursor-pointer ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-400 text-slate-950 border-amber-500 font-bold'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Type custom hashtag and press Enter..."
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  onKeyDown={handleAddCustomTag}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              {/* Form Action Footer */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="py-2.5 px-6 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Publishing Article...' : '⚡ Publish Blog Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
