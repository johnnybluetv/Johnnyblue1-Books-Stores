import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  CheckCircle2, 
  ShoppingBag, 
  Flame, 
  Award, 
  Bookmark,
  ArrowRight,
  Maximize2,
  Minimize2,
  Zap,
  GripVertical
} from 'lucide-react';
import { soundService } from '../services/soundService';

export const AMAZON_AFFILIATE_TAG = 'adultsvize339-20';
export const AMAZON_BASE_AFFILIATE_LINK = 'https://amzn.to/46e2mBZ';

export interface AmazonBestSellerBook {
  id: string;
  asin: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  rankBadge: string;
  rating: number;
  reviewCount: string;
  originalPrice: string;
  amazonPrice: string;
  discount: string;
  keyTakeaway: string;
  coverImage: string;
  pages: number;
  isbn: string;
  primeEligible: boolean;
}

/**
 * Builds the exact Amazon book product page URL embedding the verified affiliate tag
 */
export const getAmazonExactBookUrl = (asin: string): string => {
  if (!asin) return AMAZON_BASE_AFFILIATE_LINK;
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_AFFILIATE_TAG}`;
};

/**
 * Builds the instant 1-Click checkout / Quick Purchase URL on Amazon with affiliate attribution
 */
export const getAmazon1ClickQuickPurchaseUrl = (asin: string): string => {
  if (!asin) return AMAZON_BASE_AFFILIATE_LINK;
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_AFFILIATE_TAG}&linkCode=ll1&ref_=as_li_ss_tl`;
};

export const AMAZON_BEST_SELLERS: AmazonBestSellerBook[] = [
  {
    id: 'atomic-habits',
    asin: '0735211299',
    title: 'Atomic Habits',
    subtitle: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
    author: 'James Clear',
    category: 'Personal Development & Psychology',
    rankBadge: '#1 Most Sold Book on Amazon Worldwide',
    rating: 4.8,
    reviewCount: '138,400+',
    originalPrice: '$27.00',
    amazonPrice: '$14.99',
    discount: '44% OFF',
    keyTakeaway: 'You do not rise to the level of your goals. You fall to the level of your systems. Master the tiny 1% daily compound effect.',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
    pages: 320,
    isbn: '978-0735211292',
    primeEligible: true
  },
  {
    id: 'psychology-of-money',
    asin: '0857197681',
    title: 'The Psychology of Money',
    subtitle: 'Timeless Lessons on Wealth, Greed, and Happiness',
    author: 'Morgan Housel',
    category: 'Wealth & Behavioral Economics',
    rankBadge: '#1 Best Seller in Financial Behavioral Economics',
    rating: 4.7,
    reviewCount: '68,200+',
    originalPrice: '$24.99',
    amazonPrice: '$15.49',
    discount: '38% OFF',
    keyTakeaway: 'Doing well with money has a little to do with how smart you are and a lot to do with how you behave. True wealth is what you do not see.',
    coverImage: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=600&auto=format&fit=crop',
    pages: 256,
    isbn: '978-0857197689',
    primeEligible: true
  },
  {
    id: '48-laws-of-power',
    asin: '0140280197',
    title: 'The 48 Laws of Power',
    subtitle: 'The Definitive Manual for Power, Strategy and Mastery',
    author: 'Robert Greene',
    category: 'Leadership & Strategic Philosophy',
    rankBadge: '#1 Best Seller in Leadership Mentorship',
    rating: 4.7,
    reviewCount: '94,500+',
    originalPrice: '$28.00',
    amazonPrice: '$16.99',
    discount: '39% OFF',
    keyTakeaway: 'Never outshine the master. Conceal your intentions. Master the art of timing and preserve supreme sovereign command over your trajectory.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop',
    pages: 480,
    isbn: '978-0140280197',
    primeEligible: true
  },
  {
    id: 'deep-work',
    asin: '1455586692',
    title: 'Deep Work',
    subtitle: 'Rules for Focused Success in a Distracted World',
    author: 'Cal Newport',
    category: 'Productivity & Cognitive Performance',
    rankBadge: '#1 Best Seller in Time Management',
    rating: 4.7,
    reviewCount: '39,100+',
    originalPrice: '$22.00',
    amazonPrice: '$14.29',
    discount: '35% OFF',
    keyTakeaway: 'Deep work is the superpower of the 21st century. The ability to concentrate without distraction unlocks unprecedented creative output.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop',
    pages: 304,
    isbn: '978-1455586691',
    primeEligible: true
  },
  {
    id: 'cant-hurt-me',
    asin: '1544512287',
    title: "Can't Hurt Me",
    subtitle: 'Master Your Mind and Defy the Odds',
    author: 'David Goggins',
    category: 'Mental Toughness & Autobiography',
    rankBadge: '#1 Best Seller in Motivational Memoirs',
    rating: 4.8,
    reviewCount: '91,000+',
    originalPrice: '$29.99',
    amazonPrice: '$17.99',
    discount: '40% OFF',
    keyTakeaway: 'When your mind is screaming that you are exhausted and finished, you are really only at 40 percent of your true sovereign capability.',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=600&auto=format&fit=crop',
    pages: 364,
    isbn: '978-1544512280',
    primeEligible: true
  },
  {
    id: 'outlive',
    asin: '0593236599',
    title: 'Outlive: The Science and Art of Longevity',
    subtitle: 'A Groundbreaking Manual for Living Better and Longer',
    author: 'Dr. Peter Attia & Bill Gifford',
    category: 'Health, Medicine & Longevity Science',
    rankBadge: '#1 New York Times & Amazon Best Seller',
    rating: 4.7,
    reviewCount: '51,400+',
    originalPrice: '$32.00',
    amazonPrice: '$18.49',
    discount: '42% OFF',
    keyTakeaway: 'Medicine 3.0 replaces reactive symptom treatment with proactive prevention, metabolic vitality, and sustained physical cognitive strength.',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=600&auto=format&fit=crop',
    pages: 496,
    isbn: '978-0593236598',
    primeEligible: true
  },
  {
    id: 'rich-dad-poor-dad',
    asin: '1612681131',
    title: 'Rich Dad Poor Dad',
    subtitle: 'What the Rich Teach Their Kids About Money',
    author: 'Robert T. Kiyosaki',
    category: 'Financial Literacy & Real Estate',
    rankBadge: '#1 Personal Finance Book of All Time',
    rating: 4.7,
    reviewCount: '118,000+',
    originalPrice: '$19.99',
    amazonPrice: '$12.99',
    discount: '35% OFF',
    keyTakeaway: 'The poor and middle class work for money. The rich acquire assets that produce positive cash flow and have money work for them.',
    coverImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
    pages: 336,
    isbn: '978-1612680194',
    primeEligible: true
  },
  {
    id: 'thinking-fast-and-slow',
    asin: '0374533555',
    title: 'Thinking, Fast and Slow',
    subtitle: 'Two Systems Shaping Human Judgments & Biases',
    author: 'Daniel Kahneman',
    category: 'Cognitive Science & Behavioral Economics',
    rankBadge: 'Nobel Memorial Prize Winning Classic',
    rating: 4.6,
    reviewCount: '54,000+',
    originalPrice: '$20.00',
    amazonPrice: '$13.99',
    discount: '30% OFF',
    keyTakeaway: 'System 1 is intuitive, emotional and fast. System 2 is deliberate, analytical and slow. Recognize biases before making irreversible bets.',
    coverImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop',
    pages: 512,
    isbn: '978-0374533557',
    primeEligible: true
  },
  {
    id: 'the-creative-act',
    asin: '0593652886',
    title: 'The Creative Act: A Way of Being',
    subtitle: 'A Transcendent Guide to Artistic Creation',
    author: 'Rick Rubin',
    category: 'Philosophy, Art & Creativity',
    rankBadge: '#1 Best Seller in Creativity & Audio Arts',
    rating: 4.8,
    reviewCount: '31,500+',
    originalPrice: '$32.00',
    amazonPrice: '$19.99',
    discount: '38% OFF',
    keyTakeaway: 'The universe is only as large as our perception of it. When you cultivate pure presence, inspiration flows without force or strain.',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
    pages: 432,
    isbn: '978-0593652886',
    primeEligible: true
  },
  {
    id: 'meditations',
    asin: '0812968255',
    title: 'Meditations',
    subtitle: 'The Emperor’s Private Handbook for Inner Peace',
    author: 'Marcus Aurelius (Trans. Gregory Hays)',
    category: 'Stoic Philosophy & Wisdom',
    rankBadge: '#1 Best Seller in Ancient Stoic Philosophy',
    rating: 4.8,
    reviewCount: '46,800+',
    originalPrice: '$17.00',
    amazonPrice: '$10.99',
    discount: '35% OFF',
    keyTakeaway: 'You have power over your mind - not outside events. Realize this, and you will discover unwavering inner clarity and peace.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=600&auto=format&fit=crop',
    pages: 256,
    isbn: '978-0812968255',
    primeEligible: true
  },
  {
    id: 'zero-to-one',
    asin: '0804139296',
    title: 'Zero to One',
    subtitle: 'Notes on Startups, or How to Build the Future',
    author: 'Peter Thiel with Blake Masters',
    category: 'Technology & Entrepreneurship',
    rankBadge: '#1 Best Seller in Venture Strategy',
    rating: 4.6,
    reviewCount: '38,900+',
    originalPrice: '$27.00',
    amazonPrice: '$14.49',
    discount: '46% OFF',
    keyTakeaway: 'Every moment in business happens only once. Progress comes not from copying 1 to n, but from creating something genuinely new from 0 to 1.',
    coverImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600&auto=format&fit=crop',
    pages: 224,
    isbn: '978-0804139298',
    primeEligible: true
  },
  {
    id: 'mans-search-for-meaning',
    asin: '080701429X',
    title: "Man's Search for Meaning",
    subtitle: 'The Classic Tribute to Hope from the Holocaust',
    author: 'Viktor E. Frankl',
    category: 'Psychology, Existential Philosophy & Memoir',
    rankBadge: 'Library of Congress Top 10 Most Influential Books',
    rating: 4.8,
    reviewCount: '85,000+',
    originalPrice: '$17.00',
    amazonPrice: '$11.29',
    discount: '34% OFF',
    keyTakeaway: 'Those who have a why to live, can bear almost any how. Everything can be taken from a man but the freedom to choose one’s attitude in any given circumstance.',
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?q=80&w=600&auto=format&fit=crop',
    pages: 192,
    isbn: '978-0807014295',
    primeEligible: true
  }
];

interface AmazonBestSellerFlippingBookCardProps {
  className?: string;
  isFloating?: boolean;
  instanceId?: string;
}

export const AmazonBestSellerFlippingBookCard: React.FC<AmazonBestSellerFlippingBookCardProps> = ({
  className = '',
  isFloating = false,
  instanceId = 'default'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetIndex, setTargetIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'forward' | 'backward'>('forward');
  const [isHovered, setIsHovered] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isMinimized, setIsMinimized] = useState(isFloating);

  // Movable / Draggable floating tab state (Finger touch & mouse drag)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number } | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const floatingTabRef = useRef<HTMLDivElement>(null);

  const timerRef = useRef<any>(null);
  const progressIntervalRef = useRef<any>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);

  // 10-second cycle configuration
  const FLIP_INTERVAL_MS = 10000;
  const PROGRESS_TICK_MS = 50;

  const currentBook = AMAZON_BEST_SELLERS[currentIndex];
  const nextBook = AMAZON_BEST_SELLERS[targetIndex];

  // Natural anticipatory page curl: In the last 600ms of the 10s cycle, the page corner lifts
  const isPreFlipping = isPlaying && !isHovered && !isFlipping && progressPercent >= 94;

  // Execute realistic 3D CSS rotateY Page Flip Animation
  const flipToPage = (newIndex: number, direction: 'forward' | 'backward' = 'forward') => {
    if (isFlipping || newIndex === currentIndex) return;
    setTargetIndex(newIndex);
    setFlipDirection(direction);
    setIsFlipping(true);

    // Play tactile paper turn acoustic
    try {
      if (soundService.isEnabled()) {
        soundService.playFlipSound();
      }
    } catch {
      // Safe fallback
    }

    // After realistic 3D rotateY completion (620ms), commit index
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setIsFlipping(false);
      setProgressPercent(0);
    }, 620);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % AMAZON_BEST_SELLERS.length;
    flipToPage(nextIdx, 'forward');
  };

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + AMAZON_BEST_SELLERS.length) % AMAZON_BEST_SELLERS.length;
    flipToPage(prevIdx, 'backward');
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
    setProgressPercent(0);
  };

  // Auto-flip every 3 seconds with smooth progress tracking
  useEffect(() => {
    if (!isPlaying || isHovered || isMinimized || isFlipping) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      return;
    }

    let currentProgress = 0;
    const progressStep = (PROGRESS_TICK_MS / FLIP_INTERVAL_MS) * 100;

    progressIntervalRef.current = setInterval(() => {
      currentProgress += progressStep;
      if (currentProgress >= 100) {
        currentProgress = 0;
      }
      setProgressPercent(currentProgress);
    }, PROGRESS_TICK_MS);

    timerRef.current = setInterval(() => {
      handleNext();
    }, FLIP_INTERVAL_MS);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, isHovered, isMinimized, currentIndex, isFlipping]);

  // Handle Dragging by Finger (Touch) or Mouse
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    initDrag(touch.clientX, touch.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    initDrag(e.clientX, e.clientY);
  };

  const initDrag = (clientX: number, clientY: number) => {
    hasMovedRef.current = false;
    const rect = floatingTabRef.current?.getBoundingClientRect();
    const currentX = rect ? rect.left : 24;
    const currentY = rect ? rect.top : window.innerHeight - 80;

    dragStartRef.current = {
      clientX,
      clientY,
      posX: currentX,
      posY: currentY
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!dragStartRef.current) return;
      const deltaX = clientX - dragStartRef.current.clientX;
      const deltaY = clientY - dragStartRef.current.clientY;

      if (Math.hypot(deltaX, deltaY) > 5) {
        hasMovedRef.current = true;
      }

      let newX = dragStartRef.current.posX + deltaX;
      let newY = dragStartRef.current.posY + deltaY;

      const tabWidth = floatingTabRef.current?.offsetWidth || 260;
      const tabHeight = floatingTabRef.current?.offsetHeight || 60;
      newX = Math.max(12, Math.min(window.innerWidth - tabWidth - 12, newX));
      newY = Math.max(12, Math.min(window.innerHeight - tabHeight - 12, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (dragStartRef.current) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (dragStartRef.current) {
        handleMove(e.clientX, e.clientY);
      }
    };

    const handleEnd = () => {
      dragStartRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
    };
  }, []);

  const handleTabClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsMinimized(false);
  };

  // Helper renderer: Left Book Page (Visual Cover, Rank Badge, Amazon Credentials & Ratings)
  const renderLeftBookPage = (book: AmazonBestSellerBook, isTurningSide = false) => {
    const exactUrl = getAmazonExactBookUrl(book.asin);
    const quickBuyUrl = getAmazon1ClickQuickPurchaseUrl(book.asin);

    return (
      <div className={`p-5 sm:p-6 bg-gradient-to-br from-[#f8f5ee] to-[#ece5d8] border-b md:border-b-0 md:border-r border-stone-300 relative flex flex-col justify-between h-full select-none ${isTurningSide ? 'shadow-inner' : ''}`}>
        {/* Paper Corner Curl Graphic Accent */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-amber-100 via-stone-200 to-stone-300 rounded-bl-xl shadow-xs pointer-events-none opacity-60" />

        {/* Best Seller Rank Ribbon */}
        <div className="space-y-1.5 mb-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[11px] rounded-lg shadow-sm">
            <Award className="w-3.5 h-3.5 text-slate-950 shrink-0" />
            <span className="truncate max-w-[260px] sm:max-w-[280px]">{book.rankBadge}</span>
          </div>
          <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
            {book.category}
          </div>
        </div>

        {/* Book Cover Container with direct link to exact Amazon book page */}
        <a
          href={exactUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="group/cover relative block my-auto mx-auto max-w-[180px] sm:max-w-[205px] cursor-pointer transform hover:-translate-y-1 transition-all duration-300"
          title={`View ${book.title} on Amazon (${exactUrl})`}
        >
          <div className="absolute -inset-1.5 bg-gradient-to-r from-black/40 via-amber-900/30 to-black/40 rounded-xl blur-sm group-hover/cover:blur-md transition-all" />
          
          <div className="relative rounded-lg overflow-hidden border-2 border-stone-400/80 shadow-2xl bg-white">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-52 sm:h-60 object-cover group-hover/cover:scale-105 transition-transform duration-500"
            />
            
            {book.primeEligible && (
              <div className="absolute bottom-2 left-2 bg-[#232f3e] text-[#00a8e1] font-black italic text-[10px] px-2 py-0.5 rounded shadow flex items-center gap-1 border border-cyan-500/40">
                <span>prime</span>
                <span className="text-[8px] not-italic text-white">One-Day</span>
              </div>
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/cover:opacity-100 transition-opacity flex items-center justify-center p-3 text-center">
              <span className="px-3 py-1.5 bg-amber-400 text-slate-950 font-black text-xs rounded-full shadow-lg flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Open on Amazon</span>
              </span>
            </div>
          </div>

          <div className="absolute -top-2 -right-2 bg-rose-600 text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-lg border-2 border-white">
            {book.discount}
          </div>
        </a>

        {/* Quick Purchase Trigger pill on left page */}
        <div className="pt-2 text-center">
          <a
            href={quickBuyUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-full font-black text-[11px] shadow-sm hover:scale-105 transition cursor-pointer"
            title={`Quick Purchase ${book.title} with 1-Click on Amazon`}
          >
            <Zap className="w-3 h-3 fill-slate-950" />
            <span>Quick Purchase • {book.amazonPrice}</span>
          </a>
        </div>

        {/* Verified Ratings Strip */}
        <div className="pt-3 mt-1 flex items-center justify-between text-xs border-t border-stone-300/80">
          <div className="flex items-center gap-1">
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              ))}
            </div>
            <span className="font-bold text-slate-900 ml-1">{book.rating}</span>
          </div>
          <span className="text-[11px] text-slate-600 font-medium">
            {book.reviewCount} reviews
          </span>
        </div>
      </div>
    );
  };

  // Helper renderer: Right Book Page (Title, Synopsis, Pricing Deal & Quick Purchase 1-Click CTA)
  const renderRightBookPage = (book: AmazonBestSellerBook, pageNumber: number, isTurningSide = false) => {
    const exactUrl = getAmazonExactBookUrl(book.asin);
    const quickBuyUrl = getAmazon1ClickQuickPurchaseUrl(book.asin);

    return (
      <div className={`p-5 sm:p-7 bg-[#fcfbf9] relative flex flex-col justify-between space-y-4 h-full select-none ${isTurningSide ? 'shadow-inner' : ''}`}>
        {/* Top Page Header & Bookmark Accent */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-stone-500 tracking-wider uppercase block">
              Page {pageNumber} • Amazon Best Sellers Vault (ASIN: {book.asin})
            </span>
            <a
              href={exactUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="group/title block text-left"
              title={`Go to ${book.title} on Amazon with affiliate link`}
            >
              <h3 className="font-serif font-black text-xl sm:text-2xl text-slate-950 group-hover/title:text-amber-700 transition leading-tight mt-1 flex items-center gap-1.5">
                <span>{book.title}</span>
                <ExternalLink className="w-4 h-4 text-amber-600 opacity-70 inline" />
              </h3>
            </a>
            <p className="text-xs text-stone-600 font-medium mt-0.5">
              {book.subtitle}
            </p>
          </div>

          <div className="hidden sm:flex flex-col items-center shrink-0">
            <div className="w-4 h-10 bg-amber-600 rounded-b shadow-md flex items-end justify-center pb-1">
              <Bookmark className="w-2.5 h-2.5 text-amber-200 fill-amber-200" />
            </div>
          </div>
        </div>

        {/* Author & ISBN Specs */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-slate-900 bg-stone-200/80 px-2.5 py-1 rounded-md">
            By {book.author}
          </span>
          <span className="text-stone-500 text-[11px]">
            {book.pages} Pages
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-500 font-mono text-[11px]">
            ASIN: {book.asin}
          </span>
        </div>

        {/* Curated Editorial Takeaway / Book Quote */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/90 to-orange-50/70 border-l-4 border-amber-500 border-y border-r border-amber-200/60 shadow-xs space-y-1.5">
          <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Key Literary Insight</span>
          </span>
          <p className="font-serif italic text-xs sm:text-[13px] text-slate-800 leading-relaxed">
            "{book.keyTakeaway}"
          </p>
        </div>

        {/* Live Price Comparison & Amazon Prime Pouch */}
        <div className="p-3.5 rounded-xl bg-stone-100 border border-stone-300 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold text-stone-500">
              Amazon Limited-Time Deal
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xl sm:text-2xl font-black font-mono text-emerald-700">
                {book.amazonPrice}
              </span>
              <span className="text-xs text-stone-500 line-through font-mono">
                {book.originalPrice}
              </span>
              <span className="text-[10px] font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                Save {book.discount}
              </span>
            </div>
          </div>

          <div className="text-right text-[11px] text-stone-600">
            <span className="font-bold text-slate-900 block">Fast Free Delivery</span>
            <span>with Amazon Prime</span>
          </div>
        </div>

        {/* Primary 'Quick Purchase' & Direct Amazon Affiliate Action Buttons */}
        <div className="space-y-2 pt-1">
          <a
            id={`${instanceId}-amazon-quick-purchase-btn-${book.id}`}
            href={quickBuyUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group border border-amber-300/80"
          >
            <Zap className="w-5 h-5 text-slate-950 fill-amber-300 animate-bounce" />
            <span>Quick Purchase (1-Click Buy on Amazon)</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            id={`${instanceId}-amazon-affiliate-view-btn-${book.id}`}
            href={exactUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="w-full py-2.5 px-4 rounded-lg bg-stone-200/90 hover:bg-stone-300 text-slate-950 font-bold text-xs shadow-xs hover:shadow transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-stone-700" />
            <span>View Exact Book Page &amp; Verified Reviews on Amazon</span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-500" />
          </a>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-stone-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
              <span>Exact Amazon Product Link with Affiliate Tag: <code className="text-amber-800 font-mono font-bold">{AMAZON_AFFILIATE_TAG}</code></span>
            </span>
            <span className="italic text-stone-400">
              Eligible purchases support Knowledge Centa
            </span>
          </div>
        </div>
      </div>
    );
  };

  // If minimized in floating mode, render the finger-movable book-shaped tab
  if (isFloating && isMinimized) {
    const stylePosition = position 
      ? { left: `${position.x}px`, top: `${position.y}px`, bottom: 'auto', right: 'auto' }
      : { left: '24px', bottom: '24px' };

    return (
      <div 
        id="amazon-flipper-minimized-tab"
        ref={floatingTabRef}
        style={stylePosition}
        onTouchStart={handleTouchStart}
        onMouseDown={handleMouseDown}
        className={`fixed z-[80] select-none touch-none transition-shadow ${
          isDragging ? 'cursor-grabbing scale-105 shadow-2xl opacity-95' : 'cursor-grab'
        }`}
      >
        <div 
          onClick={handleTabClick}
          className="group flex items-center gap-2 px-3.5 py-2.5 bg-gradient-to-r from-[#232f3e] via-[#1a2533] to-[#131921] hover:from-[#2e3e52] hover:to-[#1a232f] text-white rounded-2xl shadow-2xl border-2 border-amber-400/90 cursor-grab active:cursor-grabbing transition-transform"
          title="Drag with finger to move • Click to open Amazon Best Sellers Flipper"
        >
          <div className="text-amber-400/70 group-hover:text-amber-300 transition-colors shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          <div className="relative w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center text-slate-950 font-bold shadow-md transform group-hover:rotate-6 transition-transform shrink-0">
            <BookOpen className="w-4 h-4 text-slate-950" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full" />
          </div>

          <div className="text-left leading-tight">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-300 uppercase tracking-wider">
              <span>Best Sellers Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[9px] text-emerald-400 font-mono">({currentIndex + 1}/12)</span>
            </div>
            <div className="text-[11px] font-bold text-slate-100 max-w-[140px] sm:max-w-[170px] truncate">
              {currentBook.title}
            </div>
            <div className="text-[9px] text-stone-400 flex items-center gap-1">
              <span className="text-amber-400 font-bold">{currentBook.amazonPrice}</span>
              <span>•</span>
              <span className="text-stone-300">Movable Tab</span>
            </div>
          </div>

          <a
            href={getAmazon1ClickQuickPurchaseUrl(currentBook.asin)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={(e) => e.stopPropagation()}
            className="ml-1 p-1.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 rounded-lg font-black shadow-md hover:scale-110 transition shrink-0"
            title={`Instant 1-Click Buy ${currentBook.title} on Amazon`}
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
          </a>

          <button 
            type="button"
            className="text-amber-400/80 hover:text-amber-300 p-0.5 shrink-0"
            title="Expand Full Book Card"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN 3D FLIPPING BOOK TOOLCARD WITH CSS ROTATEY PAGE ROTATION
  // =========================================================================
  const cardMarkup = (
    <div 
      id={isFloating ? "floating-amazon-bestseller-flipper" : `${instanceId}-amazon-bestseller-flipper`}
      ref={bookContainerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full transition-all duration-300 ${className}`}
    >
      {/* Outer Toolcard Frame styled as a Premium Mahogany & Leather Book Dock */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#1c2430] via-[#141b24] to-[#0c1017] border-2 border-amber-500/40 shadow-2xl text-slate-100 p-4 sm:p-6">
        
        {/* Subtle background ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl pointer-events-none" />

        {/* 10-Second Auto-Flip Progress Track across the top */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-800/80 overflow-hidden z-20">
          <div 
            className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 transition-all duration-75 ease-linear"
            style={{ 
              width: isPlaying && !isHovered ? `${progressPercent}%` : '100%',
              opacity: isHovered ? 0.6 : 1
            }}
          />
        </div>

        {/* Card Header & Controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
              <BookOpen className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                  <span>Amazon Official Best Sellers</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold bg-amber-400/20 text-amber-300 rounded-full border border-amber-400/30">
                  Auto-Flipping Every 10s
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span>Direct Amazon Associate Storefront</span>
                <span className="text-slate-600">•</span>
                <span className="text-amber-300 font-medium">3D rotateY realistic page-flip simulation</span>
              </p>
            </div>
          </div>

          {/* Right: Page Navigation, Play/Pause, & Floating Minimize */}
          <div className="flex items-center gap-2">
            {isHovered && isPlaying && (
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-md">
                <Pause className="w-2.5 h-2.5" /> Paused on hover
              </span>
            )}

            <div className="text-[11px] font-mono text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-lg border border-slate-700">
              <span className="text-amber-400 font-bold">{currentIndex + 1}</span>
              <span className="text-slate-500"> / </span>
              <span>{AMAZON_BEST_SELLERS.length}</span>
            </div>

            <button
              id={`${instanceId}-flipper-prev-btn`}
              onClick={handlePrev}
              disabled={isFlipping}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Previous Page (3D Flip Back)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              id={`${instanceId}-flipper-play-pause-btn`}
              onClick={togglePlayPause}
              className={`p-1.5 rounded-lg border transition cursor-pointer flex items-center gap-1 text-[11px] font-bold px-2.5 ${
                isPlaying 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-500/40 hover:bg-amber-400/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title={isPlaying ? 'Pause 10-Second Auto-Flip' : 'Resume 10-Second Auto-Flip'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Auto-Flip</span>
                </>
              )}
            </button>

            <button
              id={`${instanceId}-flipper-next-btn`}
              onClick={handleNext}
              disabled={isFlipping}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 transition cursor-pointer disabled:opacity-50"
              title="Next Page (3D Flip Forward)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {isFloating && (
              <button
                onClick={() => setIsMinimized(true)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition cursor-pointer ml-1"
                title="Minimize Flipper to Tab"
              >
                <Minimize2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3D OPEN BOOK STAGE WITH REALISTIC ROTATEY PAGE-TURNING ANIMATION          */}
        {/* ========================================================================= */}
        <div 
          className="relative py-1 select-none"
          style={{ perspective: '2200px' }}
        >
          {/* Main Book Object Container */}
          <div 
            id={`${instanceId}-book-3d-stage`}
            className="relative bg-[#fbf9f4] text-slate-900 rounded-2xl shadow-2xl border-4 border-[#3a2818] overflow-hidden transition-all duration-300"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0, 0, 0, 0.08)'
            }}
          >
            {/* Left Bound Leather Spine Accent */}
            <div className="hidden md:block absolute top-0 bottom-0 left-0 w-3.5 bg-gradient-to-r from-[#22130a] via-[#432714] to-[#60381e] z-40 border-r border-[#1a0f08] shadow-md" />

            {/* Center Book Crease / Spine Shadow Groove */}
            <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-10 bg-gradient-to-r from-black/25 via-black/35 to-black/25 z-30 pointer-events-none shadow-sm" />

            {/* Stacked Paper Edges along bottom & right */}
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#d9d0be] via-[#ebd9c1] to-[#d9d0be] border-t border-[#b5a995] z-30" />

            {/* =================================================================== */}
            {/* DESKTOP 2-PAGE SPREAD WITH BASE PAGES & TURNING 3D ROTATEY LEAF     */}
            {/* =================================================================== */}
            <div 
              className="hidden md:grid md:grid-cols-2 relative min-h-[580px]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* LEFT BASE PAGE */}
              <div 
                className="relative h-full overflow-hidden transition-all duration-500"
                style={{
                  transformOrigin: 'right center',
                  transform: 'rotateY(2deg)',
                  boxShadow: 'inset -15px 0 25px rgba(0,0,0,0.07)'
                }}
              >
                {/* When flipping backwards, base left displays the incoming book */}
                {isFlipping && flipDirection === 'backward' 
                  ? renderLeftBookPage(nextBook)
                  : renderLeftBookPage(currentBook)
                }
              </div>

              {/* RIGHT BASE PAGE */}
              <div 
                className="relative h-full overflow-hidden transition-all duration-500"
                style={{
                  transformOrigin: 'left center',
                  transform: isPreFlipping ? 'rotateY(-5.5deg)' : 'rotateY(-2deg)',
                  boxShadow: isPreFlipping 
                    ? '-8px 0 25px rgba(0,0,0,0.18), inset 15px 0 25px rgba(0,0,0,0.07)' 
                    : 'inset 15px 0 25px rgba(0,0,0,0.07)'
                }}
              >
                {/* When flipping forwards, base right page displays the incoming book so it is revealed under the turning leaf */}
                {isFlipping && flipDirection === 'forward' 
                  ? renderRightBookPage(nextBook, targetIndex + 1)
                  : renderRightBookPage(currentBook, currentIndex + 1)
                }
              </div>

              {/* ================================================================= */}
              {/* ACTIVE 3D ROTATEY TURNING LEAF (Simulates physical paper turning)  */}
              {/* ================================================================= */}
              {isFlipping && flipDirection === 'forward' && (
                <div 
                  className="absolute top-0 right-0 bottom-0 w-1/2 z-40 pointer-events-none"
                  style={{
                    transformOrigin: 'left center',
                    transformStyle: 'preserve-3d',
                    animation: 'pageRotateYForward 0.62s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                  }}
                >
                  {/* FRONT FACE of turning leaf (Outgoing right page, visible from 0deg to -90deg) */}
                  <div 
                    className="absolute inset-0 bg-[#fcfbf9] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      boxShadow: '-15px 0 35px rgba(0,0,0,0.3)'
                    }}
                  >
                    {renderRightBookPage(currentBook, currentIndex + 1, true)}
                    {/* Dynamic shadow cast on front leaf during turn */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* BACK FACE of turning leaf (Incoming left page, visible from -90deg to -180deg) */}
                  <div 
                    className="absolute inset-0 bg-[#f8f5ee] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      boxShadow: '15px 0 35px rgba(0,0,0,0.3)'
                    }}
                  >
                    {renderLeftBookPage(nextBook, true)}
                    {/* Dynamic paper highlight & shading on reverse side */}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/25 via-transparent to-black/10 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* BACKWARD 3D ROTATEY TURNING LEAF */}
              {isFlipping && flipDirection === 'backward' && (
                <div 
                  className="absolute top-0 left-0 bottom-0 w-1/2 z-40 pointer-events-none"
                  style={{
                    transformOrigin: 'right center',
                    transformStyle: 'preserve-3d',
                    animation: 'pageRotateYBackward 0.62s cubic-bezier(0.25, 1, 0.5, 1) forwards'
                  }}
                >
                  {/* FRONT FACE of turning leaf (Outgoing left page, visible from 0deg to 90deg) */}
                  <div 
                    className="absolute inset-0 bg-[#f8f5ee] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      boxShadow: '15px 0 35px rgba(0,0,0,0.3)'
                    }}
                  >
                    {renderLeftBookPage(currentBook, true)}
                    <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/10 to-transparent pointer-events-none" />
                  </div>

                  {/* BACK FACE of turning leaf (Incoming right page, visible from 90deg to 180deg) */}
                  <div 
                    className="absolute inset-0 bg-[#fcfbf9] overflow-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(-180deg)',
                      boxShadow: '-15px 0 35px rgba(0,0,0,0.3)'
                    }}
                  >
                    {renderRightBookPage(nextBook, targetIndex + 1, true)}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/10 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* =================================================================== */}
            {/* MOBILE COMPACT 3D ROTATEY FLIP CARD VIEW                            */}
            {/* =================================================================== */}
            <div 
              className="md:hidden relative flex flex-col"
              style={{
                perspective: '1400px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div 
                className={`transition-all duration-500 ${
                  isFlipping 
                    ? flipDirection === 'forward' 
                      ? 'animate-mobile-turn-forward' 
                      : 'animate-mobile-turn-backward'
                    : ''
                }`}
                style={{
                  transformOrigin: 'center center',
                  transformStyle: 'preserve-3d'
                }}
              >
                {renderLeftBookPage(currentBook)}
                {renderRightBookPage(currentBook, currentIndex + 1)}
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Fast Page Selector Thumbnails */}
        <div className="relative z-10 pt-4 mt-4 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full no-scrollbar">
            {AMAZON_BEST_SELLERS.map((book, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <button
                  key={book.id}
                  id={`${instanceId}-thumb-btn-${book.id}`}
                  onClick={() => flipToPage(idx, idx > currentIndex ? 'forward' : 'backward')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer shrink-0 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md scale-105'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                  }`}
                  title={`${book.title} by ${book.author}`}
                >
                  <span>{idx + 1}.</span>
                  <span className="truncate max-w-[80px] sm:max-w-[110px]">{book.title}</span>
                </button>
              );
            })}
          </div>

          <a
            href={AMAZON_BASE_AFFILIATE_LINK}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer transition shrink-0"
          >
            <span>Explore All Amazon Best Sellers</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>

      </div>

      {/* Global CSS for 3D rotateY Page Flipping Animations */}
      <style>{`
        @keyframes pageRotateYForward {
          0% {
            transform: rotateY(0deg);
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
          }
          30% {
            transform: rotateY(-50deg) skewY(-1deg);
            filter: drop-shadow(-15px 12px 25px rgba(0,0,0,0.35));
          }
          50% {
            transform: rotateY(-90deg) skewY(-2deg);
            filter: drop-shadow(-30px 18px 35px rgba(0,0,0,0.45));
          }
          75% {
            transform: rotateY(-135deg) skewY(-1deg);
            filter: drop-shadow(-20px 12px 25px rgba(0,0,0,0.35));
          }
          100% {
            transform: rotateY(-180deg);
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
          }
        }

        @keyframes pageRotateYBackward {
          0% {
            transform: rotateY(0deg);
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
          }
          30% {
            transform: rotateY(50deg) skewY(1deg);
            filter: drop-shadow(15px 12px 25px rgba(0,0,0,0.35));
          }
          50% {
            transform: rotateY(90deg) skewY(2deg);
            filter: drop-shadow(30px 18px 35px rgba(0,0,0,0.45));
          }
          75% {
            transform: rotateY(135deg) skewY(1deg);
            filter: drop-shadow(20px 12px 25px rgba(0,0,0,0.35));
          }
          100% {
            transform: rotateY(180deg);
            filter: drop-shadow(0 4px 6px rgba(0,0,0,0.15));
          }
        }

        @keyframes mobileTurnForward {
          0% {
            transform: perspective(1200px) rotateY(0deg) scale(1);
          }
          50% {
            transform: perspective(1200px) rotateY(-90deg) scale(0.96);
            opacity: 0.8;
          }
          100% {
            transform: perspective(1200px) rotateY(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes mobileTurnBackward {
          0% {
            transform: perspective(1200px) rotateY(0deg) scale(1);
          }
          50% {
            transform: perspective(1200px) rotateY(90deg) scale(0.96);
            opacity: 0.8;
          }
          100% {
            transform: perspective(1200px) rotateY(0deg) scale(1);
            opacity: 1;
          }
        }

        .animate-mobile-turn-forward {
          animation: mobileTurnForward 0.62s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        .animate-mobile-turn-backward {
          animation: mobileTurnBackward 0.62s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>

    </div>
  );

  if (isFloating) {
    return (
      <div 
        id="floating-amazon-bestseller-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsMinimized(true);
        }}
        className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      >
        <div className="relative w-full max-w-4xl my-auto">
          {cardMarkup}
        </div>
      </div>
    );
  }

  return cardMarkup;
};
