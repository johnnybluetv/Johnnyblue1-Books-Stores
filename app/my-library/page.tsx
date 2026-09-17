import React from 'react';
import { CustomerDigitalLibrary } from '../../src/components/CustomerDigitalLibrary';

/**
 * Customer Digital Library Page (app/my-library/page.tsx)
 * 
 * Once a user buys a book, they land here.
 * It contains an in-browser media player for their purchased format.
 * Purchasing & Streaming: Clicking "Buy Now" triggers the checkout route and redirects to /my-library,
 * where audio, video, and PDF reader controls function directly in-browser.
 */
export default function MyLibraryPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
      <CustomerDigitalLibrary />
    </main>
  );
}
