import React from 'react';
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  BookOpen, 
  Star, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Book } from '../types';

export const WishlistView: React.FC = () => {
  const { 
    wishlist, 
    removeFromWishlist, 
    addToCart, 
    setActiveBook, 
    setCurrentView,
    openLookInside 
  } = useStore();

  const handleOpenBook = (book: Book) => {
    setActiveBook(book);
    setCurrentView('book-detail');
  };

  return (
    <div className="bg-[#fcfbf9] min-h-screen text-slate-800 pb-20">
      
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full text-xs font-bold mb-2">
                <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                <span>Personal Reading Wish List</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900">
                Your Saved Books & Editions
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Titles saved for later across all 8 dimensions: eBooks, Audiobooks, 4K Videos, Handwritten Manuscripts & Soundtracks.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">
                {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
              </span>
              <button
                onClick={() => setCurrentView('store')}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-md text-xs font-bold transition cursor-pointer"
              >
                Browse More Books &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main List Container */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif font-bold text-slate-900 text-lg mb-1">
              Your Wish List is empty
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              Explore the bookstore and click the "Add to Wish List" heart button on any book or format to save titles here.
            </p>
            <button
              onClick={() => setCurrentView('store')}
              className="px-6 py-2.5 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 rounded-full font-bold text-xs tracking-wide shadow-sm border border-[#FCD200] transition cursor-pointer"
            >
              Explore Knowledge Centa Bookstore
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((book) => {
              return (
                <div 
                  key={book.id} 
                  className="bg-white rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-md transition p-4 flex flex-col justify-between group"
                >
                  <div className="flex gap-4">
                    {/* Book Thumbnail */}
                    <div 
                      onClick={() => handleOpenBook(book)}
                      className="w-24 aspect-[1/1.4] bg-slate-100 rounded overflow-hidden shadow-sm shrink-0 cursor-pointer group-hover:scale-102 transition-transform"
                    >
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>

                    {/* Book Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-0.5">
                        {book.category}
                      </div>
                      <h3 
                        onClick={() => handleOpenBook(book)}
                        className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-amber-800 cursor-pointer font-serif"
                      >
                        {book.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        by <span className="font-medium text-slate-700">{book.author}</span>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1 text-amber-500 text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold text-slate-800 text-[11px]">{book.rating.toFixed(1)}</span>
                        <span className="text-slate-400 text-[10px]">({book.reviewCount})</span>
                      </div>

                      {/* Starting Price */}
                      <div className="mt-2 text-xs font-bold text-slate-900">
                        From ${book.formats.ebook.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => addToCart(book, 'ebook')}
                      className="flex-1 py-1.5 px-3 bg-[#FFD814] hover:bg-[#F7CA00] text-slate-950 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm border border-[#FCD200] transition cursor-pointer"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => openLookInside(book, 'ebook')}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition cursor-pointer border border-slate-200"
                      title="Look Inside / Sample"
                    >
                      <BookOpen className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => removeFromWishlist(book.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-full transition cursor-pointer border border-slate-200"
                      title="Remove from Wish List"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
