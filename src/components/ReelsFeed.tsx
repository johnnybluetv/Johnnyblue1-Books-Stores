import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Bookmark, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Plus, 
  Sparkles, 
  BookOpen, 
  ChevronUp, 
  ChevronDown, 
  Send, 
  X, 
  Upload, 
  Check, 
  Filter,
  Eye,
  Film,
  Video,
  FileVideo,
  UploadCloud,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Camera,
  Smartphone
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ReelVideo } from '../types';
import { uploadFileWithFirebase } from '../services/fileUploadService';
import { NativeCameraCaptureModal } from './NativeCameraCaptureModal';
import { UniversalAiSuggestionBox } from './UniversalAiSuggestionBox';

export const ReelsFeed: React.FC = () => {
  const { 
    reels, 
    likeReel, 
    addReelComment, 
    addReel, 
    books, 
    setActiveBook, 
    setCurrentView, 
    openLookInside 
  } = useStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isNativeCameraModalOpen, setIsNativeCameraModalOpen] = useState(false);
  const nativePhoneCameraInputRef = useRef<HTMLInputElement>(null);
  const [shareToast, setShareToast] = useState(false);

  // New Reel Upload Form state
  const [newCreatorName, setNewCreatorName] = useState('Sarah Jenkins');
  const [newCreatorRole, setNewCreatorRole] = useState<'Author' | 'Reader' | 'Visitor' | 'Book Club' | 'Book Lover' | 'Critic & Reviewer'>('Book Club');
  const [newBookTitle, setNewBookTitle] = useState('The Sovereign Architect');
  const [newCaption, setNewCaption] = useState('');
  const [newDimensionTag, setNewDimensionTag] = useState('Silk & Cotton Edition');
  const [newVideoUrl, setNewVideoUrl] = useState('https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800');
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [videoUploadStatus, setVideoUploadStatus] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['#BookTok', '#10Dimensions', '#LiteraryMastery']);
  const [isReelDragging, setIsReelDragging] = useState(false);

  const reelFileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const availableHashtags = [
    '#BookTok',
    '#10Dimensions',
    '#LiteraryMastery',
    '#SilkAndCotton',
    '#CollectorEdition',
    '#AuthorLife',
    '#AudiobookLovers',
    '#EInkTech'
  ];

  const captionTemplates = [
    {
      label: '✨ 30s Review',
      caption: 'Just experienced this work across its physical and digital dimensions. The sheer craftsmanship of the prose and the physical edition is unmatched! 📖💫',
      dimension: 'Silk & Cotton Edition'
    },
    {
      label: '📦 Unboxing',
      caption: 'Unboxing the handloom Silk & Cotton edition today! Hand-bound with archival mulberry thread. You can literally smell the artisan print quality. 🧵✨',
      dimension: 'Silk & Cotton Edition'
    },
    {
      label: '✍️ Author Reading',
      caption: 'Live reading from the raw handwritten manuscript notebook draft. Notice the initial margins and personal author reflections recorded in real time. ✒️📜',
      dimension: 'Raw Handwritten Manuscript'
    },
    {
      label: '📱 E-Paper Demo',
      caption: 'Testing the custom ROM on the dedicated E-Ink hardware tablet. Zero glare, paper-like refresh rate, and pure literary focus without notifications. ⚡📚',
      dimension: 'Dedicated Digital Device'
    }
  ];

  const handleReelFileDrop = async (file: File) => {
    if (!file) return;
    setIsUploadingVideo(true);
    setVideoUploadProgress(15);
    setVideoUploadStatus('Uploading clip to Firebase Storage...');

    try {
      const result = await uploadFileWithFirebase({
        file,
        folder: 'reels',
        authorName: newCreatorName,
        bookTitle: newBookTitle,
        formatType: 'videobook',
        onProgress: (percent, msg) => {
          setVideoUploadProgress(percent);
          setVideoUploadStatus(msg);
        }
      });

      setNewVideoUrl(result.downloadUrl);
      setIsUploadingVideo(false);
      setVideoUploadStatus(result.isOfflineStored ? 'Cached offline in vault' : 'Uploaded to Firebase Storage');
    } catch (err) {
      console.warn('Reel upload fallback to local URL:', err);
      const localUrl = URL.createObjectURL(file);
      setNewVideoUrl(localUrl);
      setIsUploadingVideo(false);
      setVideoUploadStatus('Local preview loaded');
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const applyTemplate = (tpl: typeof captionTemplates[0]) => {
    setNewCaption(tpl.caption);
    setNewDimensionTag(tpl.dimension);
  };

  const handleSelectBook = (bookId: string) => {
    const b = books.find(item => item.id === bookId);
    if (b) {
      setNewBookTitle(b.title);
      if (b.cover) {
        // use book cover if no custom video yet
        if (!newVideoUrl.startsWith('blob:') && newVideoUrl.includes('unsplash')) {
          setNewVideoUrl(b.cover);
        }
      }
    }
  };

  // Filter reels
  const filteredReels = reels.filter((reel) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'authors') return reel.creatorRole === 'Author';
    if (activeFilter === 'critics') return reel.creatorRole === 'Critic & Reviewer';
    if (activeFilter === 'bookclubs') return reel.creatorRole === 'Book Club';
    if (activeFilter === 'readers') return reel.creatorRole === 'Reader' || reel.creatorRole === 'Book Lover';
    return true;
  });

  const currentReel: ReelVideo | undefined = filteredReels[currentIndex] || filteredReels[0];

  useEffect(() => {
    if (currentIndex >= filteredReels.length && filteredReels.length > 0) {
      setCurrentIndex(0);
    }
  }, [filteredReels.length, currentIndex]);

  const handleNext = () => {
    if (currentIndex < filteredReels.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(prev => !prev);
  };

  const handleShare = (reel: ReelVideo) => {
    const url = window.location.origin + `/#reels?id=${reel.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  const handleOpenBook = (bookId?: string) => {
    const found = books.find(b => b.id === bookId) || books[0];
    if (found) {
      setActiveBook(found);
      openLookInside(found, 'silk_cotton');
    }
  };

  const handlePostComment = () => {
    if (!commentInput.trim() || !currentReel) return;
    addReelComment(currentReel.id, commentInput, 'Literary Explorer', 'Reader');
    setCommentInput('');
  };

  const handleSubmitReel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaption.trim()) return;

    const finalTags = Array.from(new Set([
      ...selectedTags,
      `#${newDimensionTag.replace(/[^a-zA-Z0-9]/g, '')}`
    ]));

    addReel({
      bookTitle: newBookTitle,
      creatorName: newCreatorName,
      creatorRole: newCreatorRole,
      creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      caption: newCaption,
      tags: finalTags,
      videoUrl: newVideoUrl,
      thumbnailUrl: newVideoUrl,
      bookId: books.find(b => b.title === newBookTitle)?.id || books[0]?.id || 'book-1',
      dimensionTag: newDimensionTag
    });

    setUploadModalOpen(false);
    setNewCaption('');
  };

  return (
    <div className="bg-[#0b0f17] text-white min-h-[calc(100vh-130px)] py-4 sm:py-6 px-2 sm:px-4 flex flex-col items-center">
      {/* Top Header & Role Filter Chips */}
      <div className="w-full max-w-xl mb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-lg">
              <Film className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base font-serif flex items-center gap-1.5 text-white">
                BookTok & Literary Reels
                <span className="text-[10px] bg-pink-600/80 text-white font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  Live
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">
                Shorts from Authors, Critics, Book Clubs, & Readers exploring 10 Dimensions
              </p>
            </div>
          </div>

          {/* Action Buttons: Camera Record + Upload Reel */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="reels-header-camera-record-btn"
              type="button"
              onClick={() => {
                setUploadModalOpen(true);
                setIsNativeCameraModalOpen(true);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-400/40 font-bold text-xs rounded-full shadow transition flex items-center gap-1.5 cursor-pointer"
              title="Record a BookTok reel with live camera"
            >
              <Camera className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Camera Record</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs rounded-full shadow transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload Reel</span>
              <span className="sm:hidden">Post</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', label: 'All Shorts' },
            { id: 'authors', label: '✍️ Authors' },
            { id: 'critics', label: '🧐 Critics & Reviewers' },
            { id: 'bookclubs', label: '📚 Book Clubs' },
            { id: 'readers', label: '❤️ Book Lovers' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap text-[11px] font-semibold transition cursor-pointer ${
                activeFilter === filter.id
                  ? 'bg-amber-400 text-slate-950 font-bold shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main TikTok-style Stage Container */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[580px] sm:h-[680px] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
        {currentReel ? (
          <div 
            onClick={handleTogglePlay} 
            className="relative w-full h-full cursor-pointer select-none bg-black flex items-center justify-center"
          >
            {/* Visual Reel Background (Cinematic Image or Video placeholder simulation) */}
            <img
              src={currentReel.videoUrl || currentReel.thumbnailUrl}
              alt={currentReel.caption}
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 transition duration-300"
            />

            {/* Gradient Overlays for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

            {/* Play/Pause Pulse Indicator */}
            {!isPlaying && (
              <div className="absolute z-20 w-16 h-16 rounded-full bg-black/60 border border-white/30 backdrop-blur-md flex items-center justify-center text-white animate-in zoom-in-75 duration-200">
                <Play className="w-8 h-8 fill-white ml-1" />
              </div>
            )}

            {/* Top Bar inside Reel */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[11px] text-amber-300 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{currentReel.dimensionTag || '10-Dimension Release'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleMute}
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-black/80 transition cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
                </button>
              </div>
            </div>

            {/* Right-Hand Floating Action Bar */}
            <div className="absolute right-3 bottom-16 sm:bottom-20 flex flex-col items-center gap-4 z-30 pointer-events-auto">
              {/* Creator Avatar with follow plus */}
              <div className="relative">
                <img
                  src={currentReel.creatorAvatar}
                  alt={currentReel.creatorName}
                  className="w-11 h-11 rounded-full border-2 border-amber-400 object-cover shadow-lg"
                />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center text-white text-[10px] shadow">
                  <Plus className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Like Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  likeReel(currentReel.id);
                }}
                className="flex flex-col items-center gap-0.5 text-white hover:scale-110 transition cursor-pointer group"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition ${
                  currentReel.isLiked ? 'bg-rose-500/80 text-white' : 'bg-black/50 text-white group-hover:bg-rose-500/40'
                }`}>
                  <Heart className={`w-5 h-5 ${currentReel.isLiked ? 'fill-white' : ''}`} />
                </div>
                <span className="text-[11px] font-bold shadow-sm">
                  {currentReel.likesCount.toLocaleString()}
                </span>
              </button>

              {/* Comment Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCommentDrawerOpen(true);
                }}
                className="flex flex-col items-center gap-0.5 text-white hover:scale-110 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md group-hover:bg-slate-800">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold shadow-sm">
                  {currentReel.commentsCount || currentReel.comments?.length || 0}
                </span>
              </button>

              {/* Bookmark */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex flex-col items-center gap-0.5 text-white hover:scale-110 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md group-hover:bg-amber-400 group-hover:text-slate-950">
                  <Bookmark className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold shadow-sm">Save</span>
              </button>

              {/* Share */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleShare(currentReel);
                }}
                className="flex flex-col items-center gap-0.5 text-white hover:scale-110 transition cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-md group-hover:bg-emerald-500">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold shadow-sm">Share</span>
              </button>
            </div>

            {/* Bottom Caption & Book Details Card */}
            <div className="absolute bottom-4 left-3 right-16 z-20 text-left pointer-events-auto space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm text-white drop-shadow">
                  @{currentReel.creatorName.replace(/\s+/g, '').toLowerCase()}
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.5 rounded shadow">
                  {currentReel.creatorRole}
                </span>
              </div>

              <p className="text-xs text-slate-200 line-clamp-3 leading-relaxed drop-shadow">
                {currentReel.caption}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 text-[11px] text-amber-300 font-medium">
                {(currentReel.tags || ['#BookTok', '#10Dimensions']).map((tag, i) => (
                  <span key={i} className="hover:underline">{tag}</span>
                ))}
              </div>

              {/* Linked Book Pill (Click to open Look Inside & Purchase) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenBook(currentReel.bookId);
                }}
                className="inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-800 border border-amber-400/40 px-3 py-1.5 rounded-full text-xs font-semibold text-white transition shadow-lg cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-300 font-bold truncate max-w-[180px]">
                  {currentReel.bookTitle}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Explore 10D
                </span>
              </div>
            </div>

            {/* Sound bar running animation */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
              <div className={`h-full bg-amber-400 ${isPlaying ? 'w-full animate-pulse' : 'w-1/2'}`} />
            </div>
          </div>
        ) : (
          <div className="text-center p-6 space-y-3">
            <Film className="w-12 h-12 text-amber-500/60 mx-auto" />
            <h4 className="text-sm font-bold text-white">No BookTok Shorts Yet</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {reels.length === 0 
                ? 'All demo shorts cleared! Authors and readers can upload real video reels.' 
                : 'No shorts in this category.'}
            </p>
            <button
              onClick={() => setUploadModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold rounded-full shadow transition cursor-pointer"
            >
              + Upload First Short
            </button>
          </div>
        )}
      </div>

      {/* Up/Down Navigation Controls */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0 || filteredReels.length === 0}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition border border-slate-700 shadow cursor-pointer"
          title="Previous Reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <span className="text-xs text-slate-400 font-mono">
          {filteredReels.length > 0 ? `${currentIndex + 1} / ${filteredReels.length}` : '0 / 0'}
        </span>

        <button
          onClick={handleNext}
          disabled={filteredReels.length === 0 || currentIndex >= filteredReels.length - 1}
          className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white flex items-center justify-center transition border border-slate-700 shadow cursor-pointer"
          title="Next Reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Share Toast */}
      {shareToast && (
        <div className="fixed bottom-6 z-50 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>Reel link copied! Perfect for WhatsApp, Twitter & Book Clubs.</span>
        </div>
      )}

      {/* Comments Drawer Modal */}
      {commentDrawerOpen && currentReel && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 flex flex-col max-h-[80vh] h-[500px]">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-xs text-white">
                  Comments ({currentReel.comments?.length || 0})
                </h3>
              </div>
              <button
                onClick={() => setCommentDrawerOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 scrollbar-thin">
              {currentReel.comments && currentReel.comments.length > 0 ? (
                currentReel.comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{comment.userName}</span>
                        <span className="text-[10px] bg-slate-800 text-amber-300 font-semibold px-1.5 py-0.2 rounded">
                          {comment.userRole}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">{comment.timestamp}</span>
                    </div>
                    <p className="text-slate-300 leading-relaxed">{comment.text}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-xs text-slate-500">
                  Be the first to share your thoughts on this book short!
                </div>
              )}
            </div>

            {/* Comment Input */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                  placeholder="Add a thought, review, or literary insight..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-amber-400"
                />
                <button
                  onClick={handlePostComment}
                  className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* AI Suggestion Box for Reel Comments */}
              <UniversalAiSuggestionBox
                context="reels-comments"
                label="AI Reaction Prompts & Reel Reflections"
                title={currentReel?.bookTitle}
                onApply={(text) => setCommentInput(text)}
                defaultExpanded={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Reel Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-slate-900 border border-amber-400/40 rounded-2xl shadow-2xl p-6 text-xs text-white space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm text-white font-serif">Upload BookTok Reel / Short</h3>
                  <p className="text-[11px] text-slate-400">Share video commentary, unboxings, or reviews</p>
                </div>
              </div>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReel} className="space-y-4">
              
              {/* Drag & Drop Reel Video / Image Zone */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>Upload Short Video or Photo Cover</span>
                  </label>
                  
                  {/* Camera Quick Triggers */}
                  <div className="flex items-center gap-1.5">
                    <input
                      ref={nativePhoneCameraInputRef}
                      type="file"
                      accept="video/*,image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleReelFileDrop(e.target.files[0]);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => nativePhoneCameraInputRef.current?.click()}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                      title="Open native mobile camera directly"
                    >
                      <Smartphone className="w-3 h-3" />
                      <span>Phone Camera</span>
                    </button>
                    <span className="text-slate-600">•</span>
                    <button
                      type="button"
                      onClick={() => setIsNativeCameraModalOpen(true)}
                      className="text-[11px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Camera className="w-3 h-3 text-amber-400" />
                      <span>Live Viewfinder</span>
                    </button>
                  </div>
                </div>

                <div
                  onDragEnter={(e) => { e.preventDefault(); setIsReelDragging(true); }}
                  onDragOver={(e) => { e.preventDefault(); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsReelDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsReelDragging(false);
                    if (e.dataTransfer.files?.[0]) {
                      handleReelFileDrop(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => reelFileInputRef.current?.click()}
                  className={`p-4 rounded-xl border-2 border-dashed transition cursor-pointer text-center ${
                    isReelDragging 
                      ? 'border-amber-400 bg-amber-500/10' 
                      : 'border-slate-700 hover:border-amber-400/70 bg-slate-950/70'
                  }`}
                >
                  <input
                    ref={reelFileInputRef}
                    type="file"
                    accept="video/*,image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        handleReelFileDrop(e.target.files[0]);
                      }
                    }}
                  />
                  <div className="flex flex-col items-center justify-center space-y-1.5">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-amber-400">
                      {isUploadingVideo ? (
                        <RefreshCw className="w-5 h-5 animate-spin text-amber-400" />
                      ) : (
                        <UploadCloud className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-slate-200">
                      {isReelDragging ? 'Drop video file here...' : 'Click or drop video/photo clip here'}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Supports MP4, MOV, WebM, WEBP, JPG. Auto-converted and hosted on Firebase Storage.
                    </p>
                  </div>
                </div>

                {/* Video Upload Progress Indicator */}
                {isUploadingVideo && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-amber-400">
                      <span>{videoUploadStatus}</span>
                      <span className="font-bold">{videoUploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full transition-all duration-200"
                        style={{ width: `${videoUploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Live Preview Bar if media loaded */}
                {newVideoUrl && (
                  <div className="mt-2 p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-9 rounded bg-slate-800 overflow-hidden shrink-0">
                        <img src={newVideoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] text-slate-300 truncate">
                        {videoUploadStatus || 'Media clip ready for stream'}
                      </span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded font-bold shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Select Book from Store */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Pick Associated Book</label>
                  <select
                    onChange={(e) => handleSelectBook(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                  >
                    {books.map(b => (
                      <option key={b.id} value={b.id}>
                        {b.title} ({b.author})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Featured Dimension</label>
                  <select
                    value={newDimensionTag}
                    onChange={(e) => setNewDimensionTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Silk & Cotton Edition">Silk & Cotton Handloom</option>
                    <option value="Dedicated Digital Device">Dedicated E-Ink Hardware</option>
                    <option value="Raw Handwritten Manuscript">Raw Handwritten Notebook</option>
                    <option value="Musical Album Soundtrack">Musical Soundtrack Score</option>
                    <option value="4K Video Book">4K Video Book Masterclass</option>
                    <option value="Clothbound Hardcover">Clothbound Hardcover</option>
                    <option value="Trade Paperback">Trade Paperback</option>
                    <option value="Pendrive & SD Card">Pendrive & SD Archive</option>
                    <option value="Unabridged Audiobook">Unabridged Audiobook</option>
                    <option value="Digital eBook">Digital eBook</option>
                  </select>
                </div>
              </div>

              {/* 1-Click Caption Templates */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 flex items-center justify-between">
                  <span>1-Click Caption & Story Presets</span>
                  <span className="text-[10px] text-slate-400">Click to fill</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {captionTemplates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => applyTemplate(tpl)}
                      className="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 border border-slate-700 rounded-lg text-[11px] font-semibold transition cursor-pointer text-left truncate"
                    >
                      {tpl.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Textarea */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Caption / Review Notes</label>
                <textarea
                  required
                  rows={2}
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Share what makes this edition, quote, or masterclass memorable..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Interactive Hashtags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Hashtags</label>
                <div className="flex flex-wrap gap-1.5">
                  {availableHashtags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`text-[10px] px-2 py-1 rounded-md font-bold transition cursor-pointer ${
                          active
                            ? 'bg-amber-400 text-slate-950 shadow-xs'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Creator Info (Compact) */}
              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800/80">
                <div>
                  <label className="block text-slate-400 text-[11px] mb-0.5">Creator Handle</label>
                  <input
                    type="text"
                    required
                    value={newCreatorName}
                    onChange={(e) => setNewCreatorName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-[11px] mb-0.5">Role</label>
                  <select
                    value={newCreatorRole}
                    onChange={(e) => setNewCreatorRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-amber-400"
                  >
                    <option value="Author">✍️ Author</option>
                    <option value="Critic & Reviewer">🧐 Critic & Reviewer</option>
                    <option value="Book Club">📚 Book Club Host</option>
                    <option value="Book Lover">❤️ Book Lover</option>
                    <option value="Reader">📖 Reader</option>
                  </select>
                </div>
              </div>

              {/* Universal AI Suggestions below Reels form */}
              <UniversalAiSuggestionBox
                context="reels-upload"
                title={newBookTitle}
                category={newDimensionTag}
                label="AI Viral BookTok Hooks & Caption Optimizer"
                onApply={(text) => {
                  setNewCaption((prev) => (prev ? `${prev} ${text}` : text));
                }}
              />

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingVideo || !newCaption.trim()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold rounded-lg shadow cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingVideo ? 'Uploading Clip...' : 'Publish Short'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Native Camera Capture for Reels / Shorts */}
      <NativeCameraCaptureModal
        isOpen={isNativeCameraModalOpen}
        onClose={() => setIsNativeCameraModalOpen(false)}
        title="Record Live BookTok Reel"
        defaultMode="video"
        onCapture={(file) => {
          handleReelFileDrop(file);
        }}
      />
    </div>
  );
};
