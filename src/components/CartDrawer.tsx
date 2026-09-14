import React from 'react';
import { 
  X, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    clearCart,
    checkoutCart,
    setCurrentView,
    setActiveBook,
    t,
    formatPrice
  } = useStore();

  if (!cartDrawerOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price, 0);

  const getFormatBadge = (format: FormatType) => {
    switch (format) {
      case 'ebook':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{t('format_ebook')}</span>;
      case 'audiobook':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{t('format_audiobook')}</span>;
      case 'videobook':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{t('format_videobook')}</span>;
      case 'manuscript':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{t('format_manuscript')}</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-1.5 py-0.5 rounded">{format}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-slate-900 border-l border-slate-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Drawer Header */}
        <div className="bg-[#131921] text-white p-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm">
              {t('cart_title')} ({cart.length} {cart.length === 1 ? t('cart_item') : t('cart_items')})
            </h2>
          </div>
          <button
            onClick={() => setCartDrawerOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="space-y-1">
                <p className="font-bold text-slate-800 text-sm">{t('cart_empty_title')}</p>
                <p className="text-xs text-slate-500">
                  {t('cart_empty_desc')}
                </p>
              </div>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  setCurrentView('store');
                }}
                className="py-2 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-full shadow cursor-pointer transition mt-2"
              >
                {t('btn_start_shopping')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div
                  key={`${item.bookId}-${item.format}`}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-3 relative group"
                >
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-14 h-20 object-cover rounded shadow shrink-0"
                  />
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      {getFormatBadge(item.format)}
                      <span className="font-bold text-slate-950 text-sm">
                        {formatPrice(item.price)}
                      </span>
                    </div>

                    <h4 
                      onClick={() => {
                        setActiveBook(item.book);
                        setCurrentView('book-detail');
                        setCartDrawerOpen(false);
                      }}
                      className="font-bold text-xs text-slate-900 line-clamp-1 hover:underline cursor-pointer"
                    >
                      {item.book.title}
                    </h4>

                    <div className="text-[11px] text-slate-500">
                      {t('by_author')} {item.book.author}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.bookId, item.format)}
                      className="text-[11px] text-red-600 hover:text-red-800 flex items-center gap-1 pt-1 font-medium cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-1">
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-500 hover:text-red-600 underline cursor-pointer"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-slate-600 font-medium">{t('subtotal')}:</span>
              <span className="text-xl font-extrabold text-slate-950">
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Amazon Gold Checkout Button */}
            <button
              id="cart-checkout-btn"
              onClick={checkoutCart}
              className="w-full py-3 px-4 bg-[#FFD814] hover:bg-[#F7CA00] active:bg-[#F0B800] text-slate-950 rounded-full font-bold text-xs tracking-wide shadow-md border border-[#FCD200] transition cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t('proceed_checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('instant_delivery')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
