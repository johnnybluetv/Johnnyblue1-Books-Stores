import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Book, 
  FormatType, 
  CartItem, 
  LibraryItem, 
  PublishFormData, 
  ReelVideo, 
  BlogPost, 
  ReelComment, 
  BlogComment, 
  WaitlistEntry,
  ReadingProgress,
  PaymentGatewayConfig,
  SearchHistoryItem,
  AppUser,
  AudioBookmark,
  WishlistToastState
} from '../types';
import { INITIAL_BOOKS, CATEGORIES } from '../data/mockBooks';
import { INITIAL_REELS } from '../data/mockReels';
import { INITIAL_BLOG_POSTS } from '../data/mockBlogPosts';
import { INITIAL_WAITLIST } from '../data/mockWaitlist';
import { INITIAL_PAYMENT_GATEWAYS } from '../data/mockPaymentGateways';
import { searchIndex } from '../services/searchIndexService';
import { soundService } from '../services/soundService';
import { ShareModal, ShareData } from '../components/ShareModal';
import { OfflineReadingModal } from '../components/OfflineReadingModal';
import { AuthModal } from '../components/AuthModal';
import { LanguageCode, SUPPORTED_LANGUAGES, getTranslation, formatCurrency, getLanguageDirection } from '../services/i18n';
import { 
  saveBookToFirestore, 
  fetchBooksFromFirestore,
  saveWishlistToFirestore,
  fetchWishlistFromFirestore,
  saveAudioBookmarkToFirestore,
  deleteAudioBookmarkFromFirestore,
  fetchAudioBookmarksFromFirestore,
  saveBlogPostToFirestore,
  fetchBlogPostsFromFirestore,
  saveReelToFirestore,
  fetchReelsFromFirestore,
  auth,
  mapFirebaseUserToAppUser,
  logOutAuth
} from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import confetti from 'canvas-confetti';

export type ActiveView = 'store' | 'book-detail' | 'publish' | 'author-dashboard' | 'library' | 'author-profile' | 'wishlist' | 'reels' | 'blog' | 'waitlist';

interface StoreContextType {
  // 5-Pillar Authentication & Guest Browsing
  user: AppUser | null;
  setUser: (user: AppUser | null) => void;
  isAuthModalOpen: boolean;
  authModalPrompt: string;
  openAuthModal: (prompt?: string, onAuthenticated?: () => void) => void;
  closeAuthModal: () => void;
  requireAuth: (actionPrompt: string, action: () => void) => boolean;
  completePendingAuthAction: () => void;
  signOutUser: () => Promise<void>;
  clearAllSampleData: () => void;

  books: Book[];
  activeBook: Book | null;
  activeFormat: FormatType;
  cart: CartItem[];
  library: LibraryItem[];
  wishlist: Book[];
  reels: ReelVideo[];
  blogPosts: BlogPost[];
  activeBlogPost: BlogPost | null;
  categories: string[];
  waitlist: WaitlistEntry[];
  selectedWaitlistDimension: string;
  searchQuery: string;
  selectedCategory: string;
  selectedFormatFilter: 'all' | FormatType;
  currentView: ActiveView;
  cartDrawerOpen: boolean;
  apiInspectorOpen: boolean;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
  lookInsideModal: {
    isOpen: boolean;
    book: Book | null;
    format: FormatType;
  };
  // Search History
  searchHistory: SearchHistoryItem[];
  addSearchHistory: (query: string, category?: string) => void;
  removeSearchHistoryItem: (id: string) => void;
  clearSearchHistory: () => void;
  // Reading Progress Tracker
  readingProgress: Record<string, ReadingProgress>;
  updateReadingProgress: (bookId: string, format: FormatType, page: number, totalPages: number, timeSpentMinutes?: number) => void;
  getReadingProgress: (bookId: string) => ReadingProgress | undefined;
  addBookmark: (bookId: string, pageNumber: number) => void;
  // Global Payment Gateways for Authors
  paymentGateways: PaymentGatewayConfig[];
  updatePaymentGateways: (updated: PaymentGatewayConfig[]) => void;
  // Universal Share Modal
  openShare: (data: ShareData) => void;
  closeShare: () => void;
  // Actions
  setActiveBook: (book: Book | null) => void;
  setActiveFormat: (format: FormatType) => void;
  setCurrentView: (view: ActiveView) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedFormatFilter: (filter: 'all' | FormatType) => void;
  setCartDrawerOpen: (open: boolean) => void;
  setApiInspectorOpen: (open: boolean) => void;
  addCategory: (categoryName: string) => void;
  setSelectedWaitlistDimension: (dimension: string) => void;
  addToWaitlist: (entry: Omit<WaitlistEntry, 'id' | 'joinedAt' | 'priorityQueueNumber' | 'status'>) => WaitlistEntry;
  addToCart: (book: Book, format: FormatType) => void;
  removeFromCart: (bookId: string, format: FormatType) => void;
  clearCart: () => void;
  buyNow: (book: Book, format: FormatType) => void;
  checkoutCart: () => void;
  openLookInside: (book: Book, format?: FormatType) => void;
  closeLookInside: () => void;
  publishBook: (data: PublishFormData) => Promise<Book>;
  isBookPurchased: (bookId: string, format: FormatType) => boolean;
  purchasedSet: Set<string>;
  // Wishlist Actions & Toast Feedback
  wishlistToast: WishlistToastState | null;
  dismissWishlistToast: () => void;
  undoWishlistToast: () => void;
  addToWishlist: (book: Book) => void;
  removeFromWishlist: (bookId: string) => void;
  isInWishlist: (bookId: string) => boolean;
  toggleWishlist: (book: Book) => void;
  // Reels & Shorts Actions
  addReel: (reel: Omit<ReelVideo, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'uploadedAt' | 'comments'>) => void;
  likeReel: (reelId: string) => void;
  addReelComment: (reelId: string, text: string, userName?: string, userRole?: string) => void;
  // Blog Actions
  setActiveBlogPost: (post: BlogPost | null) => void;
  publishBlogPost: (post: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'viewsCount' | 'likesCount' | 'comments'>) => Promise<BlogPost>;
  likeBlogPost: (postId: string) => void;
  addBlogComment: (postId: string, text: string, authorName?: string) => void;
  // Theme & Appearance
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  // Multi-Language
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatPrice: (amount: number) => string;
  languageDirection: 'ltr' | 'rtl';
  // Offline Reading Vault
  offlineBooks: Record<string, boolean>;
  toggleOfflineBook: (bookId: string) => void;
  isBookOffline: (bookId: string) => boolean;
  offlineModalOpen: boolean;
  setOfflineModalOpen: (open: boolean) => void;
  // Follow Author & Release Notifications
  followedAuthors: string[];
  followAuthor: (authorName: string) => void;
  unfollowAuthor: (authorName: string) => void;
  isFollowingAuthor: (authorName: string) => boolean;
  toggleFollowAuthor: (authorName: string) => boolean;
  notifyNewAssetRelease: (authorName: string, assetTitle: string, assetType?: string) => void;
  setNotificationMessage: (msg: string | null) => void;
  // Audio Bookmarks (Timestamps, Chapters & Notes)
  audioBookmarks: AudioBookmark[];
  addAudioBookmark: (data: Omit<AudioBookmark, 'id' | 'createdAt'>) => Promise<AudioBookmark>;
  deleteAudioBookmark: (id: string) => Promise<void>;
  updateAudioBookmarkNote: (id: string, note: string, colorTag?: AudioBookmark['colorTag']) => Promise<void>;
  getBookmarksForBook: (bookId: string) => AudioBookmark[];
  openAudiobookAtBookmark: (bookmark: AudioBookmark) => void;
  initialAudioSeekSeconds: number | null;
  setInitialAudioSeekSeconds: (seconds: number | null) => void;
  // Flexible 1 to 10 Dimensions Bookshelf Expansion
  addBookDimensions: (
    bookId: string,
    dimensionsToAdd: FormatType[],
    pricingUpdate?: Partial<Record<FormatType, number>>,
    specsUpdate?: any
  ) => Promise<Book | null>;
  // 2-Hour Automated Global AI Article & Featured Image Engine
  autoArticleStatus: any;
  fetchAutoArticleStatus: () => Promise<void>;
  triggerAutoArticleGeneration: (domain?: string, topic?: string) => Promise<BlogPost | null>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // --- 5-Pillar Authentication State (Guest Browsing by Default) ---
  const [user, setUserState] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('kc_app_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null; // Guest by default!
  });

  const setUser = (u: AppUser | null) => {
    setUserState(u);
    try {
      if (u) {
        localStorage.setItem('kc_app_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('kc_app_user');
      }
    } catch {
      // ignore
    }
  };

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalPrompt, setAuthModalPrompt] = useState('');
  const pendingAuthActionRef = React.useRef<(() => void) | null>(null);

  // Listen to Firebase auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        const mapped = mapFirebaseUserToAppUser(fbUser);
        setUser(mapped);
      }
    });
    return () => unsubscribe();
  }, []);

  const openAuthModal = (prompt?: string, onAuthenticated?: () => void) => {
    setAuthModalPrompt(prompt || 'Sign in or create an account to unlock this action');
    if (onAuthenticated) {
      pendingAuthActionRef.current = onAuthenticated;
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalPrompt('');
  };

  const completePendingAuthAction = () => {
    if (pendingAuthActionRef.current) {
      const action = pendingAuthActionRef.current;
      pendingAuthActionRef.current = null;
      action();
    }
  };

  const requireAuth = (actionPrompt: string, action: () => void): boolean => {
    if (user) {
      action();
      return true;
    }
    openAuthModal(actionPrompt, action);
    return false;
  };

  const signOutUser = async () => {
    await logOutAuth();
    setUser(null);
    showNotification('✓ Signed out. You are now browsing as a Guest.');
  };

  // Load real published books (with initial catalog fallback)
  const [books, setBooks] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('kc_published_books');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Keep real published books created by authors
          const custom = parsed.filter((b: Book) => b && !b.id.startsWith('b-'));
          if (custom.length > 0) return custom;
        }
      }
    } catch {
      // ignore
    }
    return INITIAL_BOOKS;
  });

  const [activeBook, setActiveBook] = useState<Book | null>(() => (books.length > 0 ? books[0] : null));
  const [activeFormat, setActiveFormat] = useState<FormatType>('ebook');
  const [currentView, setCurrentView] = useState<ActiveView>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<'all' | FormatType>('all');
  
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [apiInspectorOpen, setApiInspectorOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // User Wishlist state (clean empty default)
  const [wishlist, setWishlist] = useState<Book[]>(() => {
    try {
      const saved = localStorage.getItem('kc_user_wishlist');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Reels & Shorts state (TikTok style - clean real uploads)
  const [reels, setReels] = useState<ReelVideo[]>(() => {
    try {
      const saved = localStorage.getItem('kc_community_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((r: ReelVideo) => r && !r.id.startsWith('reel-1') && !r.id.startsWith('reel-2') && !r.id.startsWith('reel-3') && !r.id.startsWith('reel-4'));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Blog Posts & Articles state (clean real articles)
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem('kc_blog_posts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((p: BlogPost) => p && !p.id.startsWith('post-1') && !p.id.startsWith('post-2') && !p.id.startsWith('post-3'));
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost | null>(null);

  // Clean empty initial user library (removed sample pre-owned data)
  const [library, setLibrary] = useState<LibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kc_user_library');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [cart, setCart] = useState<CartItem[]>([]);

  // User-Defined Categories State
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kc_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.from(new Set([...CATEGORIES, ...parsed]));
      }
    } catch {
      // ignore
    }
    return CATEGORIES;
  });

  const addCategory = (newCat: string) => {
    const trimmed = newCat.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setSelectedCategory(trimmed);
      showNotification(`Switched to category "${trimmed}"`);
      return;
    }
    const updated = [...categories, trimmed];
    setCategories(updated);
    setSelectedCategory(trimmed);
    try {
      const customOnly = updated.filter((c) => !CATEGORIES.includes(c));
      localStorage.setItem('kc_custom_categories', JSON.stringify(customOnly));
    } catch {
      // ignore
    }
    showNotification(`New category "${trimmed}" created!`);
  };

  // 4 Dimensions & Dedicated Tablet Waitlist State (Clean initial data)
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>(() => {
    try {
      const saved = localStorage.getItem('kc_waitlist_entries');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [selectedWaitlistDimension, setSelectedWaitlistDimension] = useState<string>('dedicated_tablet_all9');

  const addToWaitlist = (entryData: Omit<WaitlistEntry, 'id' | 'joinedAt' | 'priorityQueueNumber' | 'status'>) => {
    if (!user) {
      openAuthModal(`Sign in to reserve priority queue for ${entryData.dimensionLabel}`, () => {
        addToWaitlist(entryData);
      });
      return {
        id: `temp-${Date.now()}`,
        dimension: entryData.dimension,
        dimensionLabel: entryData.dimensionLabel,
        fullName: entryData.fullName || 'Guest Reader',
        contact: entryData.contact || '',
        bookId: entryData.bookId || '',
        bookTitle: entryData.bookTitle || '',
        authorName: entryData.authorName || '',
        notes: entryData.notes,
        joinedAt: 'Pending sign-in',
        priorityQueueNumber: 1,
        status: 'priority' as const
      };
    }

    const newEntry: WaitlistEntry = {
      ...entryData,
      id: `wl-${Date.now()}`,
      joinedAt: 'Just now',
      priorityQueueNumber: waitlist.length + 1,
      status: 'priority'
    };

    setWaitlist((prev) => {
      const updated = [newEntry, ...prev];
      try {
        localStorage.setItem('kc_waitlist_entries', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    showNotification(`✓ You're on the Waiting List for ${newEntry.dimensionLabel}! Queue #${newEntry.priorityQueueNumber}`);
    return newEntry;
  };

  const [lookInsideModal, setLookInsideModal] = useState<{
    isOpen: boolean;
    book: Book | null;
    format: FormatType;
  }>({
    isOpen: false,
    book: null,
    format: 'ebook'
  });

  // Search History State (clean empty initial list)
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('kc_search_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const addSearchHistory = (query: string, category?: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.query.toLowerCase() !== trimmed.toLowerCase());
      const newItem: SearchHistoryItem = {
        id: `sh-${Date.now()}`,
        query: trimmed,
        timestamp: 'Just now',
        category
      };
      const updated = [newItem, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('kc_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const removeSearchHistoryItem = (id: string) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('kc_search_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    try {
      localStorage.removeItem('kc_search_history');
    } catch {
      // ignore
    }
  };

  // Reading Progress State (clean empty initial state)
  const [readingProgress, setReadingProgress] = useState<Record<string, ReadingProgress>>(() => {
    try {
      const saved = localStorage.getItem('kc_reading_progress');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const updateReadingProgress = (
    bookId: string,
    format: FormatType,
    page: number,
    totalPages: number,
    timeSpentMinutes: number = 2
  ) => {
    setReadingProgress((prev) => {
      const current = prev[bookId] || {
        bookId,
        format,
        currentPage: 1,
        totalPages: totalPages || 100,
        percentCompleted: 0,
        lastReadAt: new Date().toISOString(),
        timeSpentMinutes: 0,
        bookmarks: []
      };

      const safeTotal = Math.max(totalPages || 1, current.totalPages || 1);
      const safePage = Math.min(Math.max(1, page), safeTotal);
      const percent = Math.min(100, Math.round((safePage / safeTotal) * 100));

      const updated: ReadingProgress = {
        ...current,
        format,
        currentPage: safePage,
        totalPages: safeTotal,
        percentCompleted: percent,
        lastReadAt: new Date().toISOString(),
        timeSpentMinutes: (current.timeSpentMinutes || 0) + timeSpentMinutes
      };

      const nextState = { ...prev, [bookId]: updated };
      try {
        localStorage.setItem('kc_reading_progress', JSON.stringify(nextState));
      } catch {
        // ignore
      }
      return nextState;
    });
  };

  const getReadingProgress = (bookId: string): ReadingProgress | undefined => {
    return readingProgress[bookId];
  };

  const addBookmark = (bookId: string, pageNumber: number) => {
    setReadingProgress((prev) => {
      const current = prev[bookId] || {
        bookId,
        format: 'ebook',
        currentPage: pageNumber,
        totalPages: 320,
        percentCompleted: Math.round((pageNumber / 320) * 100),
        lastReadAt: new Date().toISOString(),
        timeSpentMinutes: 5,
        bookmarks: []
      };

      const hasBookmark = current.bookmarks.includes(pageNumber);
      const updatedBookmarks = hasBookmark
        ? current.bookmarks.filter((p) => p !== pageNumber)
        : [...current.bookmarks, pageNumber].sort((a, b) => a - b);

      const updated: ReadingProgress = {
        ...current,
        bookmarks: updatedBookmarks
      };

      const nextState = { ...prev, [bookId]: updated };
      try {
        localStorage.setItem('kc_reading_progress', JSON.stringify(nextState));
      } catch {
        // ignore
      }
      showNotification(hasBookmark ? `Bookmark removed from page ${pageNumber}` : `Page ${pageNumber} bookmarked!`);
      return nextState;
    });
  };

  // --- Audio Bookmarks State ---
  const [audioBookmarks, setAudioBookmarks] = useState<AudioBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('johnnyblue1_audio_bookmarks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'abm-1',
        bookId: 'book-sovereign-creator',
        bookTitle: 'The Sovereign Creator: Architecting Digital Wealth',
        bookCoverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
        author: 'Dr. Marcus Sterling',
        timestampSeconds: 45,
        formattedTimestamp: '00:45',
        chapterTitle: 'Prologue: The Gutenberg Inversion',
        note: 'Johannes Gutenberg movable type analysis and the shift from guild monopolies to sovereign distribution.',
        colorTag: 'amber',
        createdAt: '2026-03-01T10:15:00.000Z'
      },
      {
        id: 'abm-2',
        bookId: 'book-sovereign-creator',
        bookTitle: 'The Sovereign Creator: Architecting Digital Wealth',
        bookCoverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
        author: 'Dr. Marcus Sterling',
        timestampSeconds: 168,
        formattedTimestamp: '02:48',
        chapterTitle: 'Chapter 1: The Myth of the Subsidized Mind',
        note: 'Crucial distinction: our ideas are not mere "content" to feed algorithmic loops, but compound intellectual capital.',
        colorTag: 'emerald',
        createdAt: '2026-03-05T14:30:00.000Z'
      },
      {
        id: 'abm-3',
        bookId: 'book-synthesized-consciousness',
        bookTitle: 'Synthesized Consciousness: Silicon Neurons and the Ghost in the Neural Net',
        bookCoverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1000&q=80',
        author: 'Dr. Elena Rostova',
        timestampSeconds: 112,
        formattedTimestamp: '01:52',
        chapterTitle: 'Chapter 1: Silicon Synapses and Quantum Fluctuations',
        note: 'Philosophical argument regarding substrate independence vs embodied biological cognition.',
        colorTag: 'purple',
        createdAt: '2026-03-10T08:20:00.000Z'
      }
    ];
  });

  const [initialAudioSeekSeconds, setInitialAudioSeekSeconds] = useState<number | null>(null);

  // Sync with Firestore audio bookmarks on startup
  useEffect(() => {
    let isMounted = true;
    fetchAudioBookmarksFromFirestore().then((remoteBookmarks) => {
      if (!isMounted) return;
      if (remoteBookmarks && remoteBookmarks.length > 0) {
        setAudioBookmarks((prev) => {
          const map = new Map<string, AudioBookmark>();
          [...remoteBookmarks, ...prev].forEach((bm) => map.set(bm.id, bm));
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('johnnyblue1_audio_bookmarks', JSON.stringify(merged));
          } catch {
            // ignore
          }
          return merged;
        });
      }
    });
    return () => { isMounted = false; };
  }, []);

  const addAudioBookmark = async (data: Omit<AudioBookmark, 'id' | 'createdAt'>): Promise<AudioBookmark> => {
    const newBookmark: AudioBookmark = {
      ...data,
      id: `abm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      userId: user?.uid
    };

    setAudioBookmarks((prev) => {
      const updated = [newBookmark, ...prev];
      try {
        localStorage.setItem('johnnyblue1_audio_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    saveAudioBookmarkToFirestore(newBookmark).catch((err) => {
      console.warn('Background Firestore bookmark sync:', err);
    });

    showNotification(`Audio bookmark saved at ${newBookmark.formattedTimestamp}!`);
    return newBookmark;
  };

  const deleteAudioBookmark = async (id: string): Promise<void> => {
    setAudioBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem('johnnyblue1_audio_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    deleteAudioBookmarkFromFirestore(id).catch((err) => {
      console.warn('Background Firestore bookmark delete:', err);
    });

    showNotification('Audio bookmark deleted.');
  };

  const updateAudioBookmarkNote = async (id: string, note: string, colorTag?: AudioBookmark['colorTag']): Promise<void> => {
    setAudioBookmarks((prev) => {
      const updated = prev.map((bm) => {
        if (bm.id === id) {
          const next = { ...bm, note, ...(colorTag ? { colorTag } : {}) };
          saveAudioBookmarkToFirestore(next).catch(() => {});
          return next;
        }
        return bm;
      });
      try {
        localStorage.setItem('johnnyblue1_audio_bookmarks', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
    showNotification('Bookmark note updated.');
  };

  const getBookmarksForBook = (bookId: string): AudioBookmark[] => {
    return audioBookmarks
      .filter((bm) => bm.bookId === bookId)
      .sort((a, b) => a.timestampSeconds - b.timestampSeconds);
  };

  const openAudiobookAtBookmark = (bookmark: AudioBookmark) => {
    const targetBook = books.find((b) => b.id === bookmark.bookId) || INITIAL_BOOKS.find((b) => b.id === bookmark.bookId);
    if (!targetBook) {
      showNotification('Audiobook not found in catalog');
      return;
    }
    setInitialAudioSeekSeconds(bookmark.timestampSeconds);
    setLookInsideModal({
      isOpen: true,
      book: targetBook,
      format: 'audiobook'
    });
    showNotification(`Resumed "${bookmark.bookTitle}" at ${bookmark.formattedTimestamp}`);
  };

  // Author Global Payment Gateways State
  const [paymentGateways, setPaymentGateways] = useState<PaymentGatewayConfig[]>(() => {
    try {
      const saved = localStorage.getItem('kc_author_payment_gateways');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_PAYMENT_GATEWAYS;
  });

  const updatePaymentGateways = (updated: PaymentGatewayConfig[]) => {
    setPaymentGateways(updated);
    try {
      localStorage.setItem('kc_author_payment_gateways', JSON.stringify(updated));
    } catch {
      // ignore
    }
    showNotification('✓ Author payment gateways updated globally!');
  };

  // Universal Share Modal State
  const [shareModalState, setShareModalState] = useState<{
    isOpen: boolean;
    data: ShareData;
  }>({
    isOpen: false,
    data: {
      title: 'Johnny Blue Books & Media Labs',
      text: 'Explore 10-dimension publishing masterworks on Knowledge Centa',
      url: typeof window !== 'undefined' ? window.location.href : ''
    }
  });

  const openShare = (data: ShareData) => {
    setShareModalState({
      isOpen: true,
      data
    });
  };

  const closeShare = () => {
    setShareModalState((prev) => ({ ...prev, isOpen: false }));
  };

  // --- Theme Mode State (Dark / Light) ---
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('kc_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // ignore
    }
    return 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('kc_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      showNotification(`✓ Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
      return next;
    });
  };

  // --- Multi-Language State ---
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem('kc_language');
      if (saved) return saved as LanguageCode;
    } catch {
      // ignore
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    try {
      localStorage.setItem('kc_language', lang);
    } catch {
      // ignore
    }
    const match = SUPPORTED_LANGUAGES.find((l) => l.code === lang);
    showNotification(`✓ Language changed to ${match?.label || lang}`);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(currentLanguage, key, params);
  };

  const formatPrice = (amount: number): string => {
    return formatCurrency(amount, currentLanguage);
  };

  const languageDirection = getLanguageDirection(currentLanguage);

  // --- Offline Reading Vault State (clean empty default) ---
  const [offlineBooks, setOfflineBooks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('kc_offline_books');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {};
  });

  const clearAllSampleData = () => {
    setBooks([]);
    setActiveBook(null);
    setReels([]);
    setBlogPosts([]);
    setLibrary([]);
    setWishlist([]);
    setWaitlist([]);
    setSearchHistory([]);
    setReadingProgress({});
    setOfflineBooks({});
    setCart([]);
    setAudioBookmarks([]);
    try {
      localStorage.removeItem('kc_user_library');
      localStorage.removeItem('kc_user_wishlist');
      localStorage.removeItem('kc_waitlist_entries');
      localStorage.removeItem('kc_search_history');
      localStorage.removeItem('kc_reading_progress');
      localStorage.removeItem('kc_offline_books');
      localStorage.removeItem('kc_published_books');
      localStorage.removeItem('kc_community_reels');
      localStorage.removeItem('kc_blog_posts');
      localStorage.removeItem('johnnyblue1_audio_bookmarks');
      localStorage.setItem('kc_demo_cleared_v4', 'true');
    } catch {
      // ignore
    }
    showNotification('✓ All demo data cleared. Ready for real books, reels, and articles!');
  };

  const [offlineModalOpen, setOfflineModalOpen] = useState(false);

  const toggleOfflineBook = (bookId: string) => {
    setOfflineBooks((prev) => {
      const isNowOffline = !prev[bookId];
      const updated = { ...prev };
      if (isNowOffline) {
        updated[bookId] = true;
      } else {
        delete updated[bookId];
      }
      try {
        localStorage.setItem('kc_offline_books', JSON.stringify(updated));
      } catch {
        // ignore
      }
      const targetBook = books.find((b) => b.id === bookId);
      const title = targetBook ? `"${targetBook.title.slice(0, 24)}..."` : 'Title';
      showNotification(
        isNowOffline 
          ? `✓ Cached ${title} for offline reading!` 
          : `Removed ${title} from offline cache`
      );
      return updated;
    });
  };

  const isBookOffline = (bookId: string) => Boolean(offlineBooks[bookId]);

  // Build and sync Inverted Search Index whenever books change
  useEffect(() => {
    searchIndex.indexBooks(books);
    if (!activeBook && books.length > 0) {
      setActiveBook(books[0]);
    }
  }, [books]);

  // Fetch remote books, blog posts, reels, and wishlist from Firebase Firestore on startup
  useEffect(() => {
    let isMounted = true;
    fetchBooksFromFirestore().then((remoteBooks) => {
      if (!isMounted) return;
      if (remoteBooks && remoteBooks.length > 0) {
        setBooks((prev) => {
          const map = new Map<string, Book>();
          [...remoteBooks, ...prev].forEach((b) => map.set(b.id, b));
          return Array.from(map.values());
        });
      }
    });

    fetchBlogPostsFromFirestore().then((remotePosts) => {
      if (!isMounted) return;
      if (remotePosts && remotePosts.length > 0) {
        setBlogPosts((prev) => {
          const map = new Map<string, BlogPost>();
          [...remotePosts, ...prev].forEach((p) => map.set(p.id, p));
          return Array.from(map.values());
        });
      }
    });

    fetchReelsFromFirestore().then((remoteReels) => {
      if (!isMounted) return;
      if (remoteReels && remoteReels.length > 0) {
        setReels((prev) => {
          const map = new Map<string, ReelVideo>();
          [...remoteReels, ...prev].forEach((r) => map.set(r.id, r));
          return Array.from(map.values());
        });
      }
    });

    fetchWishlistFromFirestore('default-user').then((bookIds) => {
      if (!isMounted) return;
      if (bookIds && bookIds.length > 0) {
        // match with books
        setWishlist((prev) => {
          const idSet = new Set(prev.map((b) => b.id));
          const toAdd = books.filter((b) => bookIds.includes(b.id) && !idSet.has(b.id));
          return [...prev, ...toAdd];
        });
      }
    });

    // Fetch 2-Hour Auto-Published Articles from server
    fetch('/api/auto-articles/posts')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!isMounted || !data || !data.articles) return;
        setBlogPosts((prev) => {
          const map = new Map<string, BlogPost>();
          [...data.articles, ...prev].forEach((p: BlogPost) => map.set(p.id, p));
          return Array.from(map.values());
        });
      })
      .catch(() => {});

    return () => { isMounted = false; };
  }, []);

  // Save library changes
  useEffect(() => {
    try {
      localStorage.setItem('kc_user_library', JSON.stringify(library));
    } catch {
      // ignore
    }
  }, [library]);

  // Save wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem('kc_user_wishlist', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  const showNotification = (msg: string) => {
    setNotificationMessage(msg);
    const duration = msg.includes('🔔') || msg.includes('Release') || msg.includes('Published') ? 7000 : 4000;
    setTimeout(() => {
      setNotificationMessage(null);
    }, duration);
  };

  const purchasedSet = useMemo(() => {
    const set = new Set<string>();
    library.forEach((item) => {
      set.add(`${item.bookId}:${item.format}`);
    });
    return set;
  }, [library]);

  const isBookPurchased = (bookId: string, format: FormatType): boolean => {
    return purchasedSet.has(`${bookId}:${format}`);
  };

  // Wishlist Functions & Visual Feedback Toast
  const [wishlistToast, setWishlistToast] = useState<WishlistToastState | null>(null);

  const dismissWishlistToast = () => {
    setWishlistToast(null);
  };

  const undoWishlistToast = () => {
    if (!wishlistToast) return;
    const { type, book } = wishlistToast;
    if (type === 'added') {
      const updated = wishlist.filter((b) => b.id !== book.id);
      setWishlist(updated);
      try {
        localStorage.setItem('kc_user_wishlist', JSON.stringify(updated));
      } catch {
        // ignore
      }
      saveWishlistToFirestore(user?.uid || 'default-user', updated.map((b) => b.id));
      showNotification(`Removed "${book.title.slice(0, 24)}..." from Wish List`);
    } else {
      const updated = [book, ...wishlist.filter((b) => b.id !== book.id)];
      setWishlist(updated);
      try {
        localStorage.setItem('kc_user_wishlist', JSON.stringify(updated));
      } catch {
        // ignore
      }
      saveWishlistToFirestore(user?.uid || 'default-user', updated.map((b) => b.id));
      showNotification(`Re-added "${book.title.slice(0, 24)}..." to Wish List`);
    }
    setWishlistToast(null);
  };

  const isInWishlist = (bookId: string): boolean => {
    return wishlist.some((b) => b.id === bookId);
  };

  const addToWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      showNotification(`"${book.title.slice(0, 28)}..." is already in your Wish List.`);
      return;
    }

    const updated = [book, ...wishlist];
    setWishlist(updated);
    try {
      localStorage.setItem('kc_user_wishlist', JSON.stringify(updated));
    } catch {
      // ignore
    }
    saveWishlistToFirestore(user?.uid || 'default-user', updated.map((b) => b.id));

    // Audio acoustic feedback
    try {
      soundService.playFlipSound();
    } catch {
      // ignore
    }

    // Confetti micro-burst from top right
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { x: 0.88, y: 0.15 },
        colors: ['#f43f5e', '#fb7185', '#f59e0b', '#fbbf24']
      });
    } catch {
      // ignore
    }

    // Trigger immediate visual feedback toast notification
    setWishlistToast({
      id: `wt-${Date.now()}`,
      type: 'added',
      book,
      itemCount: updated.length
    });
  };

  const removeFromWishlist = (bookId: string) => {
    const targetBook = wishlist.find((b) => b.id === bookId) || books.find((b) => b.id === bookId);
    const updated = wishlist.filter((b) => b.id !== bookId);
    setWishlist(updated);
    try {
      localStorage.setItem('kc_user_wishlist', JSON.stringify(updated));
    } catch {
      // ignore
    }
    saveWishlistToFirestore(user?.uid || 'default-user', updated.map((b) => b.id));

    if (targetBook) {
      setWishlistToast({
        id: `wt-${Date.now()}`,
        type: 'removed',
        book: targetBook,
        itemCount: updated.length
      });
    } else {
      showNotification('Removed item from your Wish List.');
    }
  };

  const toggleWishlist = (book: Book) => {
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book);
    }
  };

  // --- Follow Author & Release Notifications State ---
  const [followedAuthors, setFollowedAuthors] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kc_followed_authors');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('kc_followed_authors', JSON.stringify(followedAuthors));
    } catch {
      // ignore
    }
  }, [followedAuthors]);

  const isFollowingAuthor = (authorName: string): boolean => {
    if (!authorName) return false;
    return followedAuthors.some(
      (a) => a.toLowerCase().trim() === authorName.toLowerCase().trim()
    );
  };

  const followAuthor = (authorName: string) => {
    const trimmed = authorName.trim();
    if (!trimmed) return;
    requireAuth(`Sign in to follow ${trimmed} and receive instant release notifications`, () => {
      setFollowedAuthors((prev) => {
        if (prev.some((a) => a.toLowerCase() === trimmed.toLowerCase())) return prev;
        return [...prev, trimmed];
      });
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
      showNotification(`✓ You are now following ${trimmed}! You will receive instant toast notifications whenever they release a new asset.`);
    });
  };

  const unfollowAuthor = (authorName: string) => {
    const trimmed = authorName.trim();
    setFollowedAuthors((prev) => prev.filter((a) => a.toLowerCase() !== trimmed.toLowerCase()));
    showNotification(`Unfollowed ${trimmed}. You will no longer receive release alerts.`);
  };

  const toggleFollowAuthor = (authorName: string): boolean => {
    if (isFollowingAuthor(authorName)) {
      unfollowAuthor(authorName);
      return false;
    } else {
      followAuthor(authorName);
      return true;
    }
  };

  const notifyNewAssetRelease = (authorName: string, assetTitle: string, assetType: string = 'new asset') => {
    const isFollowed = followedAuthors.some(
      (a) => a.toLowerCase().trim() === authorName.toLowerCase().trim()
    );
    if (isFollowed) {
      const lowerType = assetType.toLowerCase();
      if (lowerType.includes('book') && !lowerType.includes('soundtrack')) {
        showNotification(`🔔 New Book Published! ${authorName} just published a new book: "${assetTitle}" across 10 dimensions!`);
      } else if (lowerType.includes('blog') || lowerType.includes('post') || lowerType.includes('article')) {
        showNotification(`🔔 New Blog Post Published! ${authorName} just published a new article: "${assetTitle}" on the Literary Blog!`);
      } else {
        showNotification(`🔔 New Release Alert! ${authorName} just released a ${assetType}: "${assetTitle}"`);
      }
    }
  };

  const addToCart = (book: Book, format: FormatType) => {
    requireAuth(`Sign in to add "${book.title.slice(0, 24)}..." to your Cart`, () => {
      const existing = cart.find((i) => i.bookId === book.id && i.format === format);
      if (existing) {
        showNotification(`"${book.title.slice(0, 30)}..." (${format.toUpperCase()}) is already in your cart.`);
        setCartDrawerOpen(true);
        return;
      }

      const price = book.formats[format]?.price ?? 14.99;

      const newItem: CartItem = {
        bookId: book.id,
        book,
        format,
        price,
        addedAt: Date.now()
      };

      setCart((prev) => [...prev, newItem]);
      showNotification(`Added to Cart: ${book.title.slice(0, 35)}... [${format.toUpperCase()}]`);
      setCartDrawerOpen(true);
    });
  };

  const removeFromCart = (bookId: string, format: FormatType) => {
    setCart((prev) => prev.filter((i) => !(i.bookId === bookId && i.format === format)));
  };

  const clearCart = () => {
    setCart([]);
  };

  const buyNow = (book: Book, format: FormatType) => {
    requireAuth(`Sign in to instantly purchase "${book.title.slice(0, 24)}..."`, () => {
      if (isBookPurchased(book.id, format)) {
        showNotification(`You already own this ${format} in your Knowledge Centa Library.`);
        setCurrentView('library');
        return;
      }

      const newLibItem: LibraryItem = {
        id: `lib-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        bookId: book.id,
        book,
        format,
        purchasedAt: new Date().toISOString(),
        downloadCount: 0
      };

      setLibrary((prev) => [newLibItem, ...prev]);

      // trigger celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      showNotification(`Order Placed! "${book.title.slice(0, 30)}..." has been added to your Library.`);
      setCurrentView('library');
    });
  };

  const checkoutCart = () => {
    requireAuth('Sign in to complete checkout and claim your books', () => {
      if (cart.length === 0) return;

      const newItems: LibraryItem[] = cart.map((item) => ({
        id: `lib-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        bookId: item.bookId,
        book: item.book,
        format: item.format,
        purchasedAt: new Date().toISOString(),
        downloadCount: 0
      }));

      setLibrary((prev) => [...newItems, ...prev]);
      setCart([]);
      setCartDrawerOpen(false);

      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.55 }
      });

      showNotification(`Thank you! ${newItems.length} items added to your Knowledge Centa Cloud Library.`);
      setCurrentView('library');
    });
  };

  const openLookInside = (book: Book, format?: FormatType) => {
    setLookInsideModal({
      isOpen: true,
      book,
      format: format || activeFormat
    });
  };

  const closeLookInside = () => {
    setLookInsideModal((prev) => ({ ...prev, isOpen: false }));
  };

  const publishBook = async (data: PublishFormData): Promise<Book> => {
    if (!user) {
      openAuthModal('Sign in to publish your manuscript to Johnnyblue1 Author Studio');
      throw new Error('Authentication required to publish manuscript');
    }

    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = `book-${Date.now()}`;

    const enabledDims = (data.enabledDimensions && data.enabledDimensions.length > 0)
      ? new Set(data.enabledDimensions)
      : new Set<FormatType>(['ebook', 'audiobook', 'videobook', 'manuscript', 'hardcover', 'papercover', 'pendrive_sd', 'musical_album', 'silk_cotton', 'digital_device']);

    const isEnabled = (fmt: FormatType) => enabledDims.has(fmt);

    const newBook: Book = {
      id: newId,
      slug,
      title: data.title,
      subtitle: data.subtitle || 'Knowledge Centa Author Edition',
      author: data.author,
      authorBio: data.authorBio || 'Independent creator published via Johnnyblue1 Author Studio.',
      authorId: `author-${slug.slice(0, 15)}`,
      coverImage: data.coverPreviewUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
      category: data.category,
      rating: 5.0,
      reviewCount: 1,
      publishedDate: 'Just now',
      publisher: 'Johnnyblue1 Creator Press',
      isbn: data.isbn || `978-0-${Math.floor(1000000 + Math.random() * 9000000)}`,
      pages: data.pages || 280,
      language: data.language || 'English',
      editorsPick: true,
      description: data.description,
      chapterOnePreview: {
        title: 'Chapter 1: The Inception',
        subheading: 'Author Manuscript Release',
        content: [
          `Welcome to the first published edition of "${data.title}" by ${data.author}.`,
          'This volume was distributed through the Johnnyblue1 Books Stores decentralized creator pipeline, offering synchronized multi-format media directly from the creator.',
          data.description.slice(0, 300) + '...'
        ]
      },
      audioSample: {
        title: `${data.title} (Audio Edition)`,
        narrator: `${data.author} & Voice Studio`,
        durationSeconds: 18000,
        sampleDurationSeconds: 240,
        audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
        chapterList: [
          { name: 'Introduction', duration: '10:00' },
          { name: 'Chapter 1', duration: '35:00' }
        ]
      },
      videoSample: {
        title: `${data.title}: Creator Video Masterclass`,
        resolution: '1080p HD Studio Master',
        durationSeconds: 7200,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        aspectRatio: '16:9',
        companionNotesPreview: 'Official creator notes and companion slides included with video edition.'
      },
      manuscriptSample: {
        version: 'Author Raw Handwritten Notebook (Original Scans)',
        notebookType: data.manuscriptSpecs?.notebookType || 'Original Author Hand-Bound Draft Notebook',
        draftStatus: 'Authentic Uncut Handwritten Scan',
        lastUpdated: new Date().toLocaleDateString(),
        authorMarginNotes: [
          { paragraphIndex: 0, note: 'Creator Note: First batch handwritten release for Knowledge Centa readers.' }
        ],
        handwrittenNotebook: {
          title: `Original Handwritten Drafts for "${data.title}"`,
          medium: data.manuscriptSpecs?.penMedium || 'Fountain Pen & Ink on Heavyweight Journal Paper',
          totalPages: data.manuscriptSpecs?.pageCount || 120,
          scannedPages: [
            {
              pageNumber: 1,
              imageUrl: data.manuscriptSpecs?.sampleScanUrl || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=80',
              transcription: data.chapterOnePreview?.content?.[0] || data.description.slice(0, 200),
              authorAnnotation: 'Opening thesis penned in author handwritten journal.'
            }
          ]
        }
      },
      musicalAlbumSample: {
        albumTitle: data.musicalAlbumSpecs?.albumTitle || `${data.title}: Original Book Soundtrack`,
        composer: data.musicalAlbumSpecs?.composer || `${data.author} & Ambient Unit`,
        totalDuration: '40 min 12 sec',
        genre: data.musicalAlbumSpecs?.genre || 'Ambient / Neo-Classical Piano',
        coverUrl: data.coverPreviewUrl || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&q=80',
        tracks: [
          {
            id: `tr-${Date.now()}-1`,
            trackNumber: 1,
            title: 'Overture Theme',
            duration: '4:20',
            audioUrl: 'https://cdn.freesound.org/previews/612/612095_5674468-lq.mp3',
            description: 'Focus-inducing acoustic piano and cello arrangement.'
          }
        ]
      },
      hardcoverDetails: {
        binding: data.hardcoverSpecs?.binding || 'Clothbound Hardcover with Gold Foil Spine',
        foilStamping: data.hardcoverSpecs?.foilStamping || '24k Matte Gold Foil on Archival Linen',
        ribbonColor: data.hardcoverSpecs?.ribbonColor || 'Silk Ribbon Marker',
        weight: '1.8 lbs',
        shippingEstimate: 'Ships in 2-3 business days'
      },
      papercoverDetails: {
        paperStock: data.papercoverSpecs?.paperStock || '60lb Acid-Free Natural Cream Archival Paper',
        finish: data.papercoverSpecs?.finish || 'Velvet Matte Soft-Touch Lamination',
        dimensions: data.papercoverSpecs?.dimensions || '6.0" x 9.0" Trade Paperback',
        shippingEstimate: 'Ships in 2-4 business days'
      },
      pendriveSdDetails: {
        storageCapacity: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
        connector: 'Heavy-Duty Zinc Alloy Dual USB-C / USB 3.2',
        includesCardReader: true,
        preloadedContents: [
          'Complete 4K Ultra-HD Video Masterclass',
          '24-Bit / 96kHz Studio FLAC Audiobook',
          'DRM-Free EPUB & PDF eBooks',
          '600 DPI Full-Color Scans of Original Handwritten Notebooks',
          'Lossless Musical Soundtrack Album'
        ]
      },
      silkCottonDetails: {
        material: data.silkCottonSpecs?.material || '100% Pure Mulberry Silk & Combed Egyptian Cotton',
        binding: data.silkCottonSpecs?.binding || 'Master Guild Smyth-Sewn Lay-Flat Fabric Binding',
        artisanOrigin: 'Heritage Atelier Bookbindery (Master Guild Hand-Crafted)',
        edgeFinishing: 'Hand-Deckled Edges with 24k Gold Leaf Stamping',
        slipcase: 'Cloth-Lined Archival Solander Box with Debossed Title',
        limitedEditionUnits: data.silkCottonSpecs?.editionUnits || 250,
        shippingEstimate: 'Ships in 3-5 business days (Insured Priority)'
      },
      digitalDeviceDetails: {
        deviceName: data.digitalDeviceSpecs?.deviceName || 'Sovereign Reader Slate 7.8" (Dedicated Book Device)',
        screenTech: data.digitalDeviceSpecs?.screenTech || '7.8-inch 300 PPI E-Ink Carta 1200 Glare-Free Ambient Screen',
        enclosureMaterial: data.digitalDeviceSpecs?.casing || 'CNC Machined Anodized Aerospace Aluminum with Solid Brass Page Buttons',
        storageCapacity: '64GB Fast Solid-State Storage',
        batteryLife: '8-10 Weeks Standby, 45 Hours Active Reading',
        audioJack: 'Dual 3.5mm Hi-Res Audio Port + Bluetooth 5.3 LDAC',
        firmwareOS: 'Distraction-Free Sovereign OS (Single-Book Dedicated Firmware)',
        bundledDimensionsCarried: [
          '1. eBook: Full responsive EPUB3 & high-res vector PDF',
          '2. Audiobook: 24-bit / 96kHz uncompressed master narration',
          '3. 4K Video Book: Masterclass lecture series with companion notes',
          '4. Raw Handwritten Manuscript: 600 DPI scans with author annotations',
          '5. Hardcover Print Facsimile: Typographic layout of collector clothbound edition',
          '6. Paper Cover Layout: High-contrast reading mode',
          '7. Hardware SD Vault: Offline master cryptographic media archive',
          '8. Musical Album: Master FLAC soundtrack & focus audio beds',
          '9. Silk & Cotton Archive: High-resolution weave photography & textile provenance'
        ],
        includedAccessories: [
          'Full-Grain Leather Magnetic Sleep Folio',
          'Braided USB-C Fast-Charging Cable',
          'Solid Brass Author Bookmark Key',
          'Hand-Numbered Hardware Certificate'
        ],
        shippingEstimate: 'White-Glove Insured Courier Tracked Delivery (2-3 Days)'
      },
      formats: {
        ebook: {
          type: 'ebook',
          name: 'eBook (EPUB / PDF)',
          badge: isEnabled('ebook') ? 'Instant Download' : 'Available in Bookshelf',
          price: data.pricing.ebook || 9.99,
          originalPrice: (data.pricing.ebook || 9.99) * 1.3,
          fileFormat: 'EPUB & High-Res PDF',
          fileSize: '12.4 MB',
          sampleLength: 'Chapter 1 Preview',
          available: isEnabled('ebook'),
          features: ['Cloud sync reader', 'EPUB3 & PDF formats']
        },
        audiobook: {
          type: 'audiobook',
          name: 'Audiobook (MP3 / M4B)',
          badge: isEnabled('audiobook') ? 'Unabridged Studio' : 'Available in Bookshelf',
          price: data.pricing.audiobook || 19.99,
          originalPrice: (data.pricing.audiobook || 19.99) * 1.25,
          fileFormat: '320kbps MP3 & M4B',
          fileSize: '320 MB',
          duration: '5 hr 00 min',
          sampleLength: '4 min Audio Sample',
          available: isEnabled('audiobook'),
          features: ['High-fidelity audio stream', 'Chapter bookmarks']
        },
        videobook: {
          type: 'videobook',
          name: 'Video Book (4K MP4 / HLS)',
          badge: isEnabled('videobook') ? 'Creator Masterclass' : 'Available in Bookshelf',
          price: data.pricing.videobook || 29.99,
          originalPrice: (data.pricing.videobook || 29.99) * 1.35,
          fileFormat: '1080p / 4K MP4 + HLS',
          fileSize: '2.5 GB',
          duration: '2 hr 00 min',
          sampleLength: 'Trailer & Chapter 1',
          available: isEnabled('videobook'),
          features: ['Interactive video lecture', 'Companion notes bundle']
        },
        manuscript: {
          type: 'manuscript',
          name: 'Raw Handwritten Manuscript',
          badge: isEnabled('manuscript') ? 'Authentic Notebook Scans' : 'Available in Bookshelf',
          price: data.pricing.manuscript || 39.99,
          originalPrice: (data.pricing.manuscript || 39.99) * 1.5,
          fileFormat: '600 DPI Scanned Pages & Author Ink PDF',
          fileSize: '54.6 MB',
          sampleLength: 'Full Handwritten Notebook Draft',
          available: isEnabled('manuscript'),
          features: ['Unedited original handwritten draft scans', 'Direct author diary annotations']
        },
        hardcover: {
          type: 'hardcover',
          name: 'Clothbound Hardcover Print',
          badge: isEnabled('hardcover') ? 'Collector Foil Edition' : 'Available in Bookshelf',
          price: data.pricing.hardcover || 35.00,
          originalPrice: (data.pricing.hardcover || 35.00) * 1.3,
          fileFormat: 'Clothbound Hardcover Book (Physical)',
          fileSize: '320 Printed Pages',
          sampleLength: 'Binding Inspection',
          available: isEnabled('hardcover'),
          features: ['Smyth-sewn clothbound archival hardcover', '24k gold foil stamping on linen']
        },
        papercover: {
          type: 'papercover',
          name: 'Paper Cover (Paperback)',
          badge: isEnabled('papercover') ? 'Trade Paperback' : 'Available in Bookshelf',
          price: data.pricing.papercover || 18.99,
          originalPrice: (data.pricing.papercover || 18.99) * 1.25,
          fileFormat: 'Trade Paperback 6x9 (Physical)',
          fileSize: '320 Printed Pages',
          sampleLength: 'Table of Contents',
          available: isEnabled('papercover'),
          features: ['Velvet soft-touch matte finish', 'Acid-free archival paper']
        },
        pendrive_sd: {
          type: 'pendrive_sd',
          name: 'Pendrive & Micro-SD Vault',
          badge: isEnabled('pendrive_sd') ? 'Collector USB-C / Micro-SD Vault' : 'Available in Bookshelf',
          price: data.pricing.pendrive_sd || 69.99,
          originalPrice: (data.pricing.pendrive_sd || 69.99) * 1.4,
          fileFormat: '64GB Dual USB-C Metal Key + 64GB Micro-SD',
          fileSize: '64 GB Storage Vault',
          sampleLength: 'Full Vault Specsheet',
          available: isEnabled('pendrive_sd'),
          features: ['Dual USB-C & USB-A metal drive with keychain ring', 'Preloaded with all 4K video, FLAC audio & raw scans']
        },
        musical_album: {
          type: 'musical_album',
          name: 'Musical Album (Soundtrack)',
          badge: isEnabled('musical_album') ? 'Original Ambient Score' : 'Available in Bookshelf',
          price: data.pricing.musical_album || 14.99,
          originalPrice: (data.pricing.musical_album || 14.99) * 1.3,
          fileFormat: 'Lossless FLAC & 320kbps MP3',
          fileSize: '320 MB',
          duration: '40 min 12 sec',
          sampleLength: 'Overture Theme Preview',
          available: isEnabled('musical_album'),
          features: ['Original composed soundtrack to accompany reading', 'Lossless 24-bit studio master audio']
        },
        silk_cotton: {
          type: 'silk_cotton',
          name: 'Silk / Cotton Material Edition',
          badge: isEnabled('silk_cotton') ? 'Artisanal Woven Cloth' : 'Available in Bookshelf',
          price: data.pricing.silk_cotton || 95.00,
          originalPrice: (data.pricing.silk_cotton || 95.00) * 1.35,
          fileFormat: 'Hand-Bound Mulberry Silk / Combed Cotton (Physical)',
          fileSize: '320 Handcrafted Pages',
          sampleLength: 'Fabric & Binding Preview',
          available: isEnabled('silk_cotton'),
          features: ['100% natural Mulberry silk & Egyptian cotton weave', 'Hand-deckled edges with 24k gold leaf stamping', 'Archival Solander presentation box included']
        },
        digital_device: {
          type: 'digital_device',
          name: 'Digital Device (Dedicated E-Reader)',
          badge: isEnabled('digital_device') ? 'Dedicated Tablet (All 9 Formats Inside)' : 'Available in Bookshelf',
          price: data.pricing.digital_device || 299.00,
          originalPrice: (data.pricing.digital_device || 299.00) * 1.35,
          fileFormat: '7.8" E-Ink Carta 1200 Hardware Tablet (Preloaded)',
          fileSize: '64 GB Dedicated Solid-State Vault',
          sampleLength: 'Hardware & OS Spec Preview',
          available: isEnabled('digital_device'),
          features: [
            'Dedicated hardware tablet built solely for this masterwork',
            'Zero-distraction Sovereign OS boots directly into the book',
            'Pre-loaded offline with all 9 other dimensions',
            'Dual 3.5mm hi-res headphone jack + Bluetooth 5.3 LDAC'
          ]
        }
      },
      tags: [data.category, 'Creator Published', 'Indie Author', '10-Dimension Edition'],
      draft2DigitalUrl: data.draft2DigitalUrl || 'https://www.draft2digital.com/book/',
      authorWhatsapp: data.authorWhatsapp || '+233555414967'
    };

    // Save to Firestore
    await saveBookToFirestore(newBook);

    setBooks((prev) => {
      const updated = [newBook, ...prev];
      try {
        localStorage.setItem('kc_published_books', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    setActiveBook(newBook);
    // Notify followers if author is followed
    notifyNewAssetRelease(newBook.author, newBook.title, 'new book asset');
    return newBook;
  };

  // Flexible Bookshelf Expansion: Add 1 to 10 Dimensions anytime
  const addBookDimensions = async (
    bookId: string,
    dimensionsToAdd: FormatType[],
    pricingUpdate?: Partial<Record<FormatType, number>>,
    specsUpdate?: any
  ): Promise<Book | null> => {
    let targetBook: Book | null = null;

    setBooks((prev) => {
      const nextList = prev.map((b) => {
        if (b.id !== bookId) return b;
        const updatedFormats = { ...b.formats };
        dimensionsToAdd.forEach((dim) => {
          if (updatedFormats[dim]) {
            updatedFormats[dim] = {
              ...updatedFormats[dim],
              available: true,
              badge: updatedFormats[dim].badge === 'Available in Bookshelf' ? 'Newly Added Dimension' : updatedFormats[dim].badge,
              ...(pricingUpdate?.[dim] ? { price: pricingUpdate[dim]! } : {})
            };
          }
        });
        const updatedBook: Book = {
          ...b,
          formats: updatedFormats,
          ...(specsUpdate || {})
        };
        targetBook = updatedBook;
        return updatedBook;
      });

      try {
        localStorage.setItem('kc_published_books', JSON.stringify(nextList));
      } catch {}
      return nextList;
    });

    if (targetBook) {
      await saveBookToFirestore(targetBook);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
      showNotification(`✓ Successfully activated ${dimensionsToAdd.length} new dimension(s) for "${(targetBook as Book).title}" on Bookshelf!`);
      notifyNewAssetRelease((targetBook as Book).author, (targetBook as Book).title, 'new dimensions published');
    }

    return targetBook;
  };

  // 2-Hour Automated Global AI Article & Featured Image Engine
  const [autoArticleStatus, setAutoArticleStatus] = useState<any>(null);

  const fetchAutoArticleStatus = async () => {
    try {
      const res = await fetch('/api/auto-articles/status');
      if (res.ok) {
        const data = await res.json();
        setAutoArticleStatus(data);
      }
    } catch {}
  };

  const triggerAutoArticleGeneration = async (domain?: string, topic?: string): Promise<BlogPost | null> => {
    try {
      showNotification('⚡ Triggering 2-Hour Global AI Publishing Engine (Gemini AI)...');
      const res = await fetch('/api/auto-articles/trigger-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, topic })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.article) {
          const newPost = data.article as BlogPost;
          setBlogPosts((prev) => {
            const map = new Map<string, BlogPost>();
            [newPost, ...prev].forEach((p) => map.set(p.id, p));
            return Array.from(map.values());
          });
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.5 } });
          showNotification(`✓ Edition #${data.article.editionCycle} Published: "${data.article.title.slice(0, 32)}..."`);
          await fetchAutoArticleStatus();
          return newPost;
        }
      }
    } catch (err) {
      console.error('Auto article trigger error:', err);
    }
    return null;
  };

  // Reels Actions
  const addReel = (reelData: Omit<ReelVideo, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'uploadedAt' | 'comments'>) => {
    requireAuth('Sign in to upload a reel to the community feed', async () => {
      const newReel: ReelVideo = {
        ...reelData,
        id: `reel-${Date.now()}`,
        likesCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        isLiked: true,
        isBookmarked: false,
        uploadedAt: 'Just now',
        comments: []
      };

      // Save to Firestore
      await saveReelToFirestore(newReel);

      setReels((prev) => {
        const updated = [newReel, ...prev];
        try {
          localStorage.setItem('kc_community_reels', JSON.stringify(updated));
        } catch {
          // ignore
        }
        return updated;
      });

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });

      showNotification('Reel uploaded! Live in TikTok-style community feed.');
    });
  };

  const likeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const nextLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked: nextLiked,
            likesCount: nextLiked ? reel.likesCount + 1 : Math.max(0, reel.likesCount - 1)
          };
        }
        return reel;
      })
    );
  };

  const addReelComment = (reelId: string, text: string, userName = 'Literary Explorer', userRole = 'Reader') => {
    requireAuth('Sign in to comment on this reel', () => {
      if (!text.trim()) return;
      const newComment: ReelComment = {
        id: `rc-${Date.now()}`,
        userName: user?.displayName || userName,
        userRole: userRole as any,
        text: text.trim(),
        timestamp: 'Just now',
        likes: 0
      };

      setReels((prev) =>
        prev.map((reel) => {
          if (reel.id === reelId) {
            return {
              ...reel,
              commentsCount: reel.commentsCount + 1,
              comments: [newComment, ...reel.comments]
            };
          }
          return reel;
        })
      );

      showNotification('Comment posted to Reel.');
    });
  };

  // Blog Actions
  const publishBlogPost = async (
    postData: Omit<BlogPost, 'id' | 'slug' | 'publishedAt' | 'viewsCount' | 'likesCount' | 'comments'>
  ): Promise<BlogPost> => {
    const authorName = postData.author || user?.displayName || 'Guest Contributor';
    const authorAvatar = postData.authorAvatar || user?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

    const slug = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPost: BlogPost = {
      ...postData,
      author: authorName,
      authorAvatar: authorAvatar,
      id: `post-${Date.now()}`,
      slug: slug || `article-${Date.now()}`,
      publishedAt: new Date().toISOString(),
      viewsCount: 1,
      likesCount: 1,
      comments: []
    };

    // Save to Firestore
    await saveBlogPostToFirestore(newPost);

    setBlogPosts((prev) => {
      const updated = [newPost, ...prev];
      try {
        localStorage.setItem('kc_blog_posts', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.5 }
    });

    setActiveBlogPost(newPost);
    setCurrentView('blog');
    // Notify followers if author is followed
    notifyNewAssetRelease(newPost.author, newPost.title, 'blog post');
    showNotification('Article published! Live on blog & ready for search indexing.');
    return newPost;
  };

  const likeBlogPost = (postId: string) => {
    setBlogPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, likesCount: post.likesCount + 1 };
        }
        return post;
      })
    );
    if (activeBlogPost && activeBlogPost.id === postId) {
      setActiveBlogPost((prev) => (prev ? { ...prev, likesCount: prev.likesCount + 1 } : null));
    }
  };

  const addBlogComment = (postId: string, text: string, author = 'Book Lover') => {
    requireAuth('Sign in to leave a comment on this article', () => {
      if (!text.trim()) return;
      const newComment: BlogComment = {
        id: `bc-${Date.now()}`,
        author: user?.displayName || author,
        text: text.trim(),
        date: new Date().toISOString().split('T')[0],
        likes: 0
      };

      setBlogPosts((prev) =>
        prev.map((post) => {
          if (post.id === postId) {
            return { ...post, comments: [newComment, ...post.comments] };
          }
          return post;
        })
      );

      if (activeBlogPost && activeBlogPost.id === postId) {
        setActiveBlogPost((prev) => (prev ? { ...prev, comments: [newComment, ...prev.comments] } : null));
      }

      showNotification('Comment published on article.');
    });
  };

  return (
    <StoreContext.Provider
      value={{
        // 5-Pillar Auth & Guest Flow
        user,
        setUser,
        isAuthModalOpen,
        authModalPrompt,
        openAuthModal,
        closeAuthModal,
        requireAuth,
        completePendingAuthAction,
        signOutUser,
        clearAllSampleData,

        books,
        activeBook,
        activeFormat,
        cart,
        library,
        wishlist,
        reels,
        blogPosts,
        activeBlogPost,
        categories,
        waitlist,
        selectedWaitlistDimension,
        searchQuery,
        selectedCategory,
        selectedFormatFilter,
        currentView,
        cartDrawerOpen,
        apiInspectorOpen,
        notificationMessage,
        showNotification,
        lookInsideModal,
        searchHistory,
        addSearchHistory,
        removeSearchHistoryItem,
        clearSearchHistory,
        readingProgress,
        updateReadingProgress,
        getReadingProgress,
        addBookmark,
        paymentGateways,
        updatePaymentGateways,
        openShare,
        closeShare,
        setActiveBook,
        setActiveFormat,
        setCurrentView,
        setSearchQuery,
        setSelectedCategory,
        setSelectedFormatFilter,
        setCartDrawerOpen,
        setApiInspectorOpen,
        addCategory,
        setSelectedWaitlistDimension,
        addToWaitlist,
        addToCart,
        removeFromCart,
        clearCart,
        buyNow,
        checkoutCart,
        openLookInside,
        closeLookInside,
        publishBook,
        isBookPurchased,
        purchasedSet,
        wishlistToast,
        dismissWishlistToast,
        undoWishlistToast,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
        addReel,
        likeReel,
        addReelComment,
        setActiveBlogPost,
        publishBlogPost,
        likeBlogPost,
        addBlogComment,
        // Theme & Appearance
        theme,
        toggleTheme,
        // Multi-Language
        currentLanguage,
        setLanguage,
        t,
        formatPrice,
        languageDirection,
        // Offline Reading Vault
        offlineBooks,
        toggleOfflineBook,
        isBookOffline,
        offlineModalOpen,
        setOfflineModalOpen,
        // Follow Author & Release Notifications
        followedAuthors,
        followAuthor,
        unfollowAuthor,
        isFollowingAuthor,
        toggleFollowAuthor,
        notifyNewAssetRelease,
        setNotificationMessage,
        audioBookmarks,
        addAudioBookmark,
        deleteAudioBookmark,
        updateAudioBookmarkNote,
        getBookmarksForBook,
        openAudiobookAtBookmark,
        initialAudioSeekSeconds,
        setInitialAudioSeekSeconds,
        addBookDimensions,
        autoArticleStatus,
        fetchAutoArticleStatus,
        triggerAutoArticleGeneration
      }}
    >
      {children}
      <ShareModal
        isOpen={shareModalState.isOpen}
        onClose={closeShare}
        data={shareModalState.data}
      />
      <OfflineReadingModal
        isOpen={offlineModalOpen}
        onClose={() => setOfflineModalOpen(false)}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        actionPrompt={authModalPrompt}
        onSuccess={completePendingAuthAction}
      />
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};
