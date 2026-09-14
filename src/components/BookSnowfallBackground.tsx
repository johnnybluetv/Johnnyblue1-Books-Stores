import React, { useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { BookOpen, Sparkles } from 'lucide-react';

interface Flake {
  id: string;
  bookId: string;
  title: string;
  coverImage: string;
  author: string;
  leftPercent: number; // 0% to 100% within the right zone
  durationSeconds: number;
  delaySeconds: number;
  scale: number;
  opacity: number;
  rotationDelta: number;
}

export const BookSnowfallBackground: React.FC = () => {
  const { books } = useStore();

  // Create falling book snowflake particles based on all books posted to the platform
  const flakes: Flake[] = useMemo(() => {
    if (!books || books.length === 0) return [];

    const list: Flake[] = [];
    const count = Math.min(18, Math.max(8, books.length * 3));

    for (let i = 0; i < count; i++) {
      const book = books[i % books.length];
      list.push({
        id: `flake-${i}-${book.id}`,
        bookId: book.id,
        title: book.title,
        coverImage: book.coverImage,
        author: book.author,
        leftPercent: 5 + (i * 17) % 85, // distributed across right-side column
        durationSeconds: 9 + (i % 6) * 2.2, // 9s to 20s varied speeds
        delaySeconds: -(i * 1.6), // pre-staggered so they are already falling smoothly
        scale: 0.65 + ((i % 4) * 0.12), // varied sizes (0.65 to 1.0)
        opacity: 0.35 + ((i % 5) * 0.1), // 0.35 to 0.75 soft ethereal transparency
        rotationDelta: (i % 2 === 0 ? 1 : -1) * (10 + (i % 12)),
      });
    }

    return list;
  }, [books]);

  if (flakes.length === 0) return null;

  return (
    <aside 
      id="book-snowfall-container"
      aria-hidden="true"
      className="fixed top-0 right-0 w-36 sm:w-56 md:w-64 h-full pointer-events-none z-10 overflow-hidden select-none"
    >
      {/* Subtle right glow column to frame the falling books */}
      <div className="absolute inset-0 bg-gradient-to-l from-amber-500/5 via-amber-400/2 to-transparent pointer-events-none" />

      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute top-0 animate-book-snowfall flex flex-col items-center group pointer-events-none will-change-transform"
          style={{
            left: `${flake.leftPercent}%`,
            animationDuration: `${flake.durationSeconds}s`,
            animationDelay: `${flake.delaySeconds}s`,
            opacity: flake.opacity,
            transform: `scale(${flake.scale})`,
          }}
        >
          {/* Miniature 3D Book Silhouette Snowflake */}
          <div className="relative p-1 bg-white/90 backdrop-blur-xs rounded-md shadow-lg border border-amber-300/40 transform transition-transform duration-300">
            {/* Book Spine accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-600 to-amber-800 rounded-l-xs" />
            
            {flake.coverImage ? (
              <img
                src={flake.coverImage}
                alt=""
                className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded-xs shadow-xs"
                loading="lazy"
              />
            ) : (
              <div className="w-10 h-14 sm:w-12 sm:h-16 bg-slate-800 rounded-xs flex flex-col items-center justify-center text-amber-300 p-1">
                <BookOpen className="w-4 h-4 mb-0.5" />
                <span className="text-[7px] text-center line-clamp-2 leading-none font-serif">{flake.title}</span>
              </div>
            )}

            {/* Subtle floating sparkle emblem on corner */}
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center shadow-xs">
              <Sparkles className="w-2 h-2 text-slate-900" />
            </div>
          </div>

          {/* Micro Title Label trailing behind */}
          <span className="mt-1 px-1.5 py-0.5 bg-slate-900/70 text-amber-200 text-[8px] font-serif rounded-full shadow-xs backdrop-blur-xs max-w-[90px] truncate leading-tight border border-amber-400/20">
            {flake.title}
          </span>
        </div>
      ))}
    </aside>
  );
};
