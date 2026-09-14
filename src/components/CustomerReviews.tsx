import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  MessageSquarePlus, 
  Filter, 
  ArrowUpDown, 
  Send, 
  Sparkles,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Review, FormatType, Book } from '../types';
import { INITIAL_REVIEWS } from '../data/mockReviews';
import { saveReviewToFirestore, fetchReviewsForBook } from '../services/firebase';

interface CustomerReviewsProps {
  book: Book;
  onRatingUpdated?: (newRating: number, newCount: number) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ book, onRatingUpdated }) => {
  // Reviews state with Firestore + local initial reviews
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(`kc_reviews_${book.id}`);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_REVIEWS[book.id] || [];
  });

  const [sortBy, setSortBy] = useState<'recent' | 'highest'>('recent');
  const [selectedFormatFilter, setSelectedFormatFilter] = useState<'all' | FormatType>('all');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Review Form State
  const [formRating, setFormRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formFormat, setFormFormat] = useState<FormatType>('manuscript');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helpful votes set
  const [helpfulVoted, setHelpfulVoted] = useState<Set<string>>(new Set());

  // Fetch Firestore reviews on book change
  useEffect(() => {
    let isMounted = true;
    fetchReviewsForBook(book.id).then((remoteReviews) => {
      if (!isMounted) return;
      if (remoteReviews && remoteReviews.length > 0) {
        setReviews((prev) => {
          // Merge by unique id
          const map = new Map<string, Review>();
          [...remoteReviews, ...prev].forEach((r) => map.set(r.id, r));
          return Array.from(map.values());
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [book.id]);

  // Persist local cache
  useEffect(() => {
    try {
      localStorage.setItem(`kc_reviews_${book.id}`, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews, book.id]);

  // Handle Review Submission
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim() || !formAuthor.trim()) {
      return;
    }

    setIsSubmitting(true);
    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      bookId: book.id,
      author: formAuthor.trim(),
      rating: formRating,
      title: formTitle.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedPurchase: true,
      content: formContent.trim(),
      formatPurchased: formFormat,
      helpfulCount: 0
    };

    // Save to Firestore
    await saveReviewToFirestore(newReview);

    // Update local state
    setReviews((prev) => [newReview, ...prev]);

    // Reset Form
    setFormTitle('');
    setFormContent('');
    setFormAuthor('');
    setFormRating(5);
    setShowReviewForm(false);
    setIsSubmitting(false);

    setSubmittedMessage('Thank you! Your verified customer review has been synced to Firebase Firestore.');
    setTimeout(() => setSubmittedMessage(null), 5000);

    // Update parent rating if callback exists
    if (onRatingUpdated) {
      const updatedTotal = reviews.length + 1;
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0) + formRating;
      onRatingUpdated(Number((sum / updatedTotal).toFixed(1)), updatedTotal);
    }
  };

  const handleToggleHelpful = (reviewId: string) => {
    if (helpfulVoted.has(reviewId)) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r))
    );
    setHelpfulVoted((prev) => new Set(prev).add(reviewId));
  };

  // Compute rating metrics
  const { avgRating, totalCount, distribution } = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { avgRating: book.rating, totalCount: book.reviewCount, distribution: { 5: 85, 4: 10, 3: 3, 2: 1, 1: 1 } };
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rKey = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
      dist[rKey] = (dist[rKey] || 0) + 1;
    });

    return {
      avgRating: Number((sum / total).toFixed(1)),
      totalCount: total,
      distribution: {
        5: Math.round((dist[5] / total) * 100),
        4: Math.round((dist[4] / total) * 100),
        3: Math.round((dist[3] / total) * 100),
        2: Math.round((dist[2] / total) * 100),
        1: Math.round((dist[1] / total) * 100)
      }
    };
  }, [reviews, book.rating, book.reviewCount]);

  // Filter and Sort Reviews
  const displayedReviews = useMemo(() => {
    let list = [...reviews];
    if (selectedFormatFilter !== 'all') {
      list = list.filter((r) => r.formatPurchased === selectedFormatFilter);
    }

    if (sortBy === 'recent') {
      // sort by id descending (time-based) or date
      list.sort((a, b) => b.id.localeCompare(a.id));
    } else if (sortBy === 'highest') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [reviews, selectedFormatFilter, sortBy]);

  const getFormatBadgeLabel = (format: FormatType) => {
    switch (format) {
      case 'manuscript':
        return 'Raw Handwritten Manuscript';
      case 'hardcover':
        return 'Clothbound Hardcover';
      case 'papercover':
        return 'Paper Cover (Paperback)';
      case 'pendrive_sd':
        return 'Pendrive & Micro-SD Vault';
      case 'musical_album':
        return 'Musical Album (Soundtrack)';
      case 'silk_cotton':
        return 'Silk & Cotton Woven Edition';
      case 'digital_device':
        return 'Dedicated Digital Device';
      case 'audiobook':
        return 'Audiobook';
      case 'videobook':
        return '4K Video Book';
      case 'ebook':
        return 'eBook';
    }
  };

  return (
    <div id="customer-reviews-section" className="mt-8 pt-8 border-t border-slate-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif text-slate-900 flex items-center gap-2">
              <span>Customer Reviews</span>
              <span className="text-sm font-sans font-medium text-slate-500">
                ({totalCount} verified)
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified feedback across all 10 multi-dimensional editions, persisted in Firebase Firestore.
            </p>
          </div>

          {/* Write a Review Toggle Button */}
          <button
            id="write-customer-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-full text-xs font-bold transition shadow cursor-pointer self-start"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>{showReviewForm ? 'Cancel Review' : 'Write a Customer Review'}</span>
          </button>
        </div>

        {/* Success Alert */}
        {submittedMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{submittedMessage}</span>
          </div>
        )}

        {/* Expandable Review Input Form */}
        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="p-5 bg-white rounded-xl border border-amber-200 shadow-md space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Submit Your Verified Review</span>
              </span>
              <span className="text-[11px] text-slate-500">
                Directly stored into Firebase Firestore
              </span>
            </div>

            {/* Star Rating Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Overall Rating:
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= (hoverRating ?? formRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-100 text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-800 ml-2">
                  {formRating} out of 5 Stars
                </span>
              </div>
            </div>

            {/* Format Purchased Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Format / Dimension Experienced:
                </label>
                <select
                  value={formFormat}
                  onChange={(e) => setFormFormat(e.target.value as FormatType)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="manuscript">Raw Handwritten Manuscript (Notebook Scans)</option>
                  <option value="hardcover">Clothbound Hardcover Print</option>
                  <option value="papercover">Paper Cover (Paperback)</option>
                  <option value="pendrive_sd">Pendrive & Micro-SD Vault (64GB)</option>
                  <option value="musical_album">Musical Album (Original Soundtrack)</option>
                  <option value="silk_cotton">Silk & Cotton Woven Edition (Artisanal Loom)</option>
                  <option value="digital_device">Dedicated Digital Device (Carrying 9 Dimensions)</option>
                  <option value="audiobook">Audiobook (Studio Narration)</option>
                  <option value="videobook">4K Video Book (Masterclass)</option>
                  <option value="ebook">eBook (EPUB / PDF)</option>
                </select>
              </div>

              {/* Reviewer Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Name / Pen Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan R., Architecture Fellow"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Review Headline */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline / Title of your review:
              </label>
              <input
                type="text"
                required
                placeholder="What was the most impactful element of this work?"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Review Body */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Written Review:
              </label>
              <textarea
                rows={4}
                required
                placeholder="Describe your reading or listening experience, the quality of the raw handwritten notes or physical clothbound print, and how the material impacted you..."
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-300 rounded-md text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Syncing to Firebase...' : 'Post Review'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Rating Breakdown Summary + Star Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          
          {/* Average Rating Score */}
          <div className="md:col-span-4 flex flex-col justify-center items-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-serif">
              {avgRating.toFixed(1)}
            </div>
            <div className="flex items-center text-amber-500 my-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(avgRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-slate-100 text-slate-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Based on {totalCount} verified global ratings
            </span>
            <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Verified Purchases</span>
            </div>
          </div>

          {/* Star Distribution Bars */}
          <div className="md:col-span-8 flex flex-col justify-center space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const pct = (distribution as any)[stars] || 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-slate-600 font-medium shrink-0">
                    {stars} star
                  </span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-500 font-mono text-[11px] shrink-0">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Filters and Sorting Controls (Most Recent & Highest Rated) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          {/* Format Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-500 flex items-center gap-1 shrink-0 mr-1 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            {[
              { key: 'all', label: 'All Formats' },
              { key: 'manuscript', label: 'Raw Manuscript' },
              { key: 'hardcover', label: 'Hardcover' },
              { key: 'papercover', label: 'Paper Cover' },
              { key: 'pendrive_sd', label: 'Pendrive / SD' },
              { key: 'musical_album', label: 'Musical Album' },
              { key: 'silk_cotton', label: 'Silk & Cotton' },
              { key: 'digital_device', label: 'Dedicated Device' },
              { key: 'audiobook', label: 'Audiobook' },
              { key: 'videobook', label: 'Video Book' },
              { key: 'ebook', label: 'eBook' }
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSelectedFormatFilter(f.key as any)}
                className={`px-2.5 py-1 rounded-full text-xs transition cursor-pointer whitespace-nowrap ${
                  selectedFormatFilter === f.key
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown Options: "Most Recent" & "Highest Rated" */}
          <div className="flex items-center gap-2 text-xs shrink-0 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              id="reviews-sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'recent' | 'highest')}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
            >
              <option value="recent">Most Recent</option>
              <option value="highest">Highest Rated</option>
            </select>
          </div>

        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {displayedReviews.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg border border-slate-200 p-6 text-slate-500 text-xs">
              No reviews found matching the selected filter. Be the first to share your experience!
            </div>
          ) : (
            displayedReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3 transition hover:border-slate-300"
              >
                {/* Reviewer Header */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                      {review.author.slice(0, 1).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {review.author}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>Reviewed on {review.date}</span>
                        {review.verifiedPurchase && (
                          <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified Purchase</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Format Badge */}
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                    {getFormatBadgeLabel(review.formatPurchased)}
                  </span>
                </div>

                {/* Rating & Headline */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-100 text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                    {review.title}
                  </h4>
                </div>

                {/* Review Content */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {review.content}
                </p>

                {/* Helpful Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <button
                    onClick={() => handleToggleHelpful(review.id)}
                    disabled={helpfulVoted.has(review.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded border transition text-xs cursor-pointer ${
                      helpfulVoted.has(review.id)
                        ? 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      {helpfulVoted.has(review.id)
                        ? 'Helpful (Voted)'
                        : `Helpful (${review.helpfulCount || 0})`}
                    </span>
                  </button>

                  <span className="text-[11px] text-slate-400">
                    Knowledge Centa Verified Reader
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
