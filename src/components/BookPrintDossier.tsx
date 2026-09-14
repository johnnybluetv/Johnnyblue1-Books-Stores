import React from 'react';
import { Book, FormatType } from '../types';
import { 
  BookOpen, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  Star, 
  CheckCircle2, 
  Printer 
} from 'lucide-react';

interface BookPrintDossierProps {
  book: Book;
  activeFormat: FormatType;
  formatPrice: (price: number) => string;
  isScreenPreview?: boolean;
}

export const BookPrintDossier: React.FC<BookPrintDossierProps> = ({
  book,
  activeFormat,
  formatPrice,
  isScreenPreview = false,
}) => {
  const printDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div 
      id={isScreenPreview ? 'book-print-dossier-preview' : 'book-print-dossier'} 
      className={`font-serif text-slate-900 bg-white p-6 max-w-4xl mx-auto space-y-6 ${
        isScreenPreview 
          ? 'shadow-2xl rounded-2xl border border-slate-300 print:hidden' 
          : 'print-only'
      }`}
    >
      {/* Official Archival Header */}
      <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-900 text-white rounded flex items-center justify-center font-bold text-xs">
              JB
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-wider uppercase text-slate-900 font-sans">
                Johnnyblue1 Books Stores &amp; Knowledge Centa
              </h1>
              <p className="text-[10px] text-slate-600 font-sans font-medium uppercase tracking-widest">
                Sovereign 10-Dimension Universal Literary Architecture
              </p>
            </div>
          </div>
        </div>

        <div className="text-right text-[10px] font-sans text-slate-600 space-y-0.5">
          <div className="font-bold text-slate-900 uppercase">Archival Book Dossier</div>
          <div>Printed: {printDate}</div>
          <div className="font-mono text-[9px] text-slate-500">ID: JBK-DOC-{book.id.slice(0, 8)}</div>
        </div>
      </div>

      {/* Book Identification Header Section */}
      <div className="flex gap-6 items-start">
        {/* Cover Thumbnail */}
        <div className="w-36 shrink-0 border border-slate-300 rounded p-1 bg-slate-50 shadow-xs print-avoid-break">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-auto object-cover rounded"
          />
          <div className="mt-1 text-center font-sans text-[9px] text-slate-500 font-semibold uppercase">
            {book.category}
          </div>
        </div>

        {/* Title, Subtitle, Author & Quick Metadata */}
        <div className="flex-1 space-y-2">
          <div>
            <div className="font-sans text-[10px] font-bold uppercase tracking-wider text-amber-800">
              {book.bestSellerCategory || 'Sovereign Masterwork Collection'}
            </div>
            <h2 className="text-2xl font-bold text-slate-950 leading-tight">
              {book.title}
            </h2>
            <p className="text-xs text-slate-700 font-sans italic mt-0.5">
              {book.subtitle}
            </p>
          </div>

          <div className="font-sans text-xs flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-800 border-y border-slate-200 py-2">
            <div>
              <span className="text-slate-500">Author: </span>
              <strong>{book.author}</strong>
            </div>
            <div>
              <span className="text-slate-500">Rating: </span>
              <strong>★ {book.rating.toFixed(1)} / 5.0</strong> ({book.reviewCount.toLocaleString()} reviews)
            </div>
            <div>
              <span className="text-slate-500">Language: </span>
              <strong>{book.language}</strong>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans text-[10px] pt-1">
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
              <span className="block text-slate-500 text-[9px]">Standard ISBN</span>
              <span className="font-mono font-bold text-slate-800">{book.isbn}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
              <span className="block text-slate-500 text-[9px]">Print Pages</span>
              <span className="font-bold text-slate-800">{book.pages} pages</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
              <span className="block text-slate-500 text-[9px]">Release Date</span>
              <span className="font-bold text-slate-800">{book.publishedDate}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 p-1.5 rounded">
              <span className="block text-slate-500 text-[9px]">Publisher</span>
              <span className="font-bold text-slate-800 truncate block">{book.publisher}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Book Overview / Description */}
      <div className="space-y-2 print-avoid-break">
        <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
          Editorial Overview &amp; Synopsis
        </h3>
        <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line text-justify">
          {book.description}
        </p>
      </div>

      {/* 10 Multi-Format Editions Matrix */}
      <div className="space-y-2 print-avoid-break">
        <div className="flex items-center justify-between border-b border-slate-300 pb-1">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900">
            10-Dimension Format Editions &amp; Archival Availability
          </h3>
          <span className="font-sans text-[10px] text-slate-500">
            Active Format: <strong>{activeFormat.replace('_', ' ').toUpperCase()}</strong>
          </span>
        </div>

        <table className="w-full text-[10px] font-sans border-collapse border border-slate-300">
          <thead>
            <tr className="bg-slate-100 text-slate-800 text-left">
              <th className="border border-slate-300 p-1.5">Dimension / Format</th>
              <th className="border border-slate-300 p-1.5">Type</th>
              <th className="border border-slate-300 p-1.5">Price</th>
              <th className="border border-slate-300 p-1.5">File / Physical Medium</th>
              <th className="border border-slate-300 p-1.5">Key Features</th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(book.formats) as FormatType[]).map((fmtKey) => {
              const fmt = book.formats[fmtKey];
              if (!fmt) return null;
              const isCurrent = fmtKey === activeFormat;

              let mediumType = 'Digital Cloud';
              if (['hardcover', 'papercover', 'silk_cotton'].includes(fmtKey)) {
                mediumType = 'Physical Print';
              } else if (fmtKey === 'pendrive_sd' || fmtKey === 'digital_device') {
                mediumType = 'Physical Hardware';
              } else if (fmtKey === 'audiobook' || fmtKey === 'musical_album') {
                mediumType = 'Audio Master';
              }

              return (
                <tr 
                  key={fmtKey} 
                  className={isCurrent ? 'bg-amber-50/80 font-semibold' : 'hover:bg-slate-50'}
                >
                  <td className="border border-slate-300 p-1.5">
                    <span className="capitalize">{fmt.name}</span>
                    {isCurrent && <span className="ml-1 text-amber-700 font-bold">(Selected)</span>}
                  </td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{mediumType}</td>
                  <td className="border border-slate-300 p-1.5 font-mono">{formatPrice(fmt.price)}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">{fmt.fileFormat || fmt.fileSize}</td>
                  <td className="border border-slate-300 p-1.5 text-slate-600">
                    {fmt.features.slice(0, 2).join(' • ')}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Physical & Technical Manufacturing Details */}
      <div className="space-y-2 print-avoid-break">
        <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
          Technical &amp; Archival Specifications
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-sans">
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Hardcover Binding</span>
            <span className="text-slate-600">{book.hardcoverDetails?.binding || 'Smyth-sewn clothbound with gold foil stamping'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Paper Stock</span>
            <span className="text-slate-600">{book.papercoverDetails?.paperStock || '70# Warm White Archival Acid-Free'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Audio Narration</span>
            <span className="text-slate-600">{book.audioSample?.narrator || 'Full Cast Acoustic Master'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Video Masterclass</span>
            <span className="text-slate-600">{book.videoSample?.resolution || '4K Ultra-HD HDR 60fps'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Raw Manuscript Medium</span>
            <span className="text-slate-600">{book.manuscriptSample?.handwrittenNotebook?.medium || 'Pelikan 4001 Ink on 120gsm Archival Paper'}</span>
          </div>
          <div className="border border-slate-200 p-2 rounded bg-slate-50">
            <span className="font-bold block text-slate-800">Cloud Storage &amp; Encryption</span>
            <span className="text-slate-600">Google Drive OAuth Sync &amp; Firestore 256-bit AES</span>
          </div>
        </div>
      </div>

      {/* Sample Excerpt Preview */}
      {book.chapterOnePreview && (
        <div className="space-y-2 print-avoid-break">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
            Sample Excerpt: {book.chapterOnePreview.title}
          </h3>
          <div className="text-xs text-slate-800 italic space-y-1.5 leading-relaxed bg-slate-50/50 p-3 rounded border border-slate-200">
            {book.chapterOnePreview.content.slice(0, 3).map((para, idx) => (
              <p key={idx} className="text-justify indent-4">
                {para}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* About Author */}
      <div className="space-y-1.5 print-avoid-break">
        <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
          About the Author: {book.author}
        </h3>
        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          {book.authorBio}
        </p>
      </div>

      {/* Official Archival Footer */}
      <div className="border-t-2 border-slate-900 pt-3 flex items-center justify-between font-sans text-[9px] text-slate-500">
        <div>
          <span>© {new Date().getFullYear()} {book.publisher || 'Johnnyblue1 Books Stores & Knowledge Centa'}. All rights reserved.</span>
          <div className="text-slate-400">Direct Archival Link: {currentUrl}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-700">Verified Sovereign Cultural Record</div>
          <div>Page 1 of 1 • Official Specification Sheet</div>
        </div>
      </div>
    </div>
  );
};
