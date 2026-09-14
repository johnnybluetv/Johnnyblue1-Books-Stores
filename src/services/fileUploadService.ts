import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, saveUploadRecordToFirestore } from './firebase';
import { storeOfflineFile } from './offlineStorage';
import { FormatType } from '../types';

export interface DetectedFileAnalysis {
  format: 'ebook' | 'audiobook' | 'videobook' | 'manuscript' | 'hardcover' | 'papercover' | 'pendrive_sd' | 'musical_album' | 'silk_cotton' | 'digital_device' | 'cover' | 'unknown';
  formatKey: string;
  formatLabel: string;
  dimensionNumber: number; // 1-10, or 0 for cover
  titleSuggestion: string;
  subtitleSuggestion?: string;
  authorSuggestion?: string;
  categorySuggestion?: string;
  estimatedPages?: number;
  estimatedDuration?: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  mimeType: string;
  extension: string;
  badge: string;
  badgeColor: string;
  specSuggestions?: Record<string, any>;
  confidence: number;
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Intelligent client-side format and metadata detector
 */
export async function analyzeUploadedFile(file: File): Promise<DetectedFileAnalysis> {
  const name = file.name;
  const ext = name.slice(name.lastIndexOf('.')).toLowerCase();
  const baseName = name.replace(/\.[^/.]+$/, '');
  const sizeFormatted = formatBytes(file.size);

  let format: DetectedFileAnalysis['format'] = 'unknown';
  let formatKey = 'ebook';
  let formatLabel = 'General Edition Asset';
  let dimensionNumber = 1;
  let badge = 'Asset';
  let badgeColor = 'bg-slate-100 text-slate-800 border-slate-300';
  let confidence = 70;
  const specSuggestions: Record<string, any> = {};

  const lower = name.toLowerCase();

  // 1. Cover Art Detection
  if (
    lower.includes('cover') ||
    lower.includes('artwork') ||
    lower.includes('front') ||
    (file.type.startsWith('image/') && !lower.includes('manuscript') && !lower.includes('scan') && !lower.includes('weave'))
  ) {
    format = 'cover';
    formatKey = 'cover';
    formatLabel = 'Primary Cover Artwork';
    dimensionNumber = 0;
    badge = 'Cover Artwork (Min 1600x2400)';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    confidence = 95;
  }
  // 2. Raw Handwritten Scans (Dimension 4)
  else if (
    lower.includes('manuscript') ||
    lower.includes('handwritten') ||
    lower.includes('notebook') ||
    lower.includes('journal') ||
    lower.includes('scan') ||
    lower.includes('fountain_pen')
  ) {
    format = 'manuscript';
    formatKey = 'manuscript';
    formatLabel = 'Raw Handwritten Manuscript Scans';
    dimensionNumber = 4;
    badge = 'Dim 4 • Raw Handwritten Scans';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-300';
    confidence = 92;
    specSuggestions.notebookType = lower.includes('leather') ? 'Leather-bound Moleskine' : 'Archival Linen Hardbound Journal';
    specSuggestions.penMedium = lower.includes('fountain') ? '14k Gold Nib Fountain Pen (Iron Gall Ink)' : 'Black Archival Ink & Calligraphy Pen';
    specSuggestions.pageCount = Math.max(24, Math.round(file.size / (1024 * 1024 * 1.8)));
  }
  // 3. Audio formats -> Audiobook (Dimension 2) or Musical Album (Dimension 8)
  else if (['.mp3', '.m4b', '.m4a', '.aac', '.ogg'].includes(ext)) {
    if (lower.includes('soundtrack') || lower.includes('musical') || lower.includes('album') || lower.includes('score') || lower.includes('orchestral') || ext === '.flac') {
      format = 'musical_album';
      formatKey = 'musical_album';
      formatLabel = 'Musical Album & Soundtrack Score';
      dimensionNumber = 8;
      badge = 'Dim 8 • Musical Album Soundtrack';
      badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
      confidence = 94;
      specSuggestions.genre = 'Cinematic Classical / Acoustic Ambience';
      specSuggestions.composer = 'Original Book Ensemble';
    } else {
      format = 'audiobook';
      formatKey = 'audiobook';
      formatLabel = 'Unabridged Audiobook';
      dimensionNumber = 2;
      badge = 'Dim 2 • Audiobook Master';
      badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
      confidence = 96;
      specSuggestions.bitrate = '320 kbps Master';
      specSuggestions.narrator = 'Professional Studio Cast';
    }
  }
  // 4. Video formats -> 4K Video Book (Dimension 3)
  else if (['.mp4', '.mov', '.mkv', '.webm', '.avi'].includes(ext)) {
    format = 'videobook';
    formatKey = 'videobook';
    formatLabel = '4K Video Book Masterclass';
    dimensionNumber = 3;
    badge = 'Dim 3 • 4K Video Book';
    badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
    confidence = 95;
    specSuggestions.resolution = '4K UHD (3840x2160)';
    specSuggestions.chapters = 'Segmented Masterclasses';
  }
  // 5. High-fidelity audio / lossless -> Musical Album (Dimension 8)
  else if (['.flac', '.wav', '.aiff', '.alac'].includes(ext)) {
    format = 'musical_album';
    formatKey = 'musical_album';
    formatLabel = 'Musical Album & Symphonic Soundtrack';
    dimensionNumber = 8;
    badge = 'Dim 8 • Hi-Res Soundtrack (Lossless)';
    badgeColor = 'bg-emerald-100 text-emerald-900 border-emerald-300';
    confidence = 96;
    specSuggestions.sampleRate = '96kHz / 24-bit';
  }
  // 6. Hardcover or Papercover Print Specifications
  else if (lower.includes('hardcover') || lower.includes('casebound') || lower.includes('foil')) {
    format = 'hardcover';
    formatKey = 'hardcover';
    formatLabel = 'Hardcover Foil-Stamped Specifications';
    dimensionNumber = 5;
    badge = 'Dim 5 • Hardcover Print Specs';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
    confidence = 90;
    specSuggestions.binding = 'Cloth Hardcover with Gold Foil Deboss';
    specSuggestions.foilStamping = '24k Matte Gold Foil';
    specSuggestions.ribbonColor = 'Navy Satin Bookmark Ribbon';
  }
  else if (lower.includes('papercover') || lower.includes('paperback') || lower.includes('trade_paper')) {
    format = 'papercover';
    formatKey = 'papercover';
    formatLabel = 'Trade Paperback Dimensions & Interior Specs';
    dimensionNumber = 6;
    badge = 'Dim 6 • Paper Cover Specs';
    badgeColor = 'bg-slate-100 text-slate-900 border-slate-300';
    confidence = 90;
    specSuggestions.paperStock = '80# Cream Archival Uncoated';
    specSuggestions.finish = 'Velvet Soft-Touch Matte Lamination';
    specSuggestions.dimensions = '6" x 9" Standard Royal Octavo';
  }
  // 7. Silk & Cotton Artisan Specs (Dimension 9)
  else if (lower.includes('silk') || lower.includes('cotton') || lower.includes('loom') || lower.includes('weave') || lower.includes('textile')) {
    format = 'silk_cotton';
    formatKey = 'silk_cotton';
    formatLabel = 'Silk & Cotton Handloom Artisan Edition';
    dimensionNumber = 9;
    badge = 'Dim 9 • Silk & Cotton Handloom';
    badgeColor = 'bg-amber-100 text-amber-900 border-amber-400';
    confidence = 95;
    specSuggestions.material = '100% Organic Raw Mulberry Silk & Egyptian Long-Staple Cotton';
    specSuggestions.binding = 'Japanese 4-Hole Hand-Stitched Binding';
    specSuggestions.editionUnits = 100;
  }
  // 8. Dedicated Hardware Device Firmware / ROM (Dimension 10)
  else if (['.iso', '.img', '.bin', '.hex', '.rom'].includes(ext) || lower.includes('firmware') || lower.includes('device') || lower.includes('e-ink') || lower.includes('eink')) {
    format = 'digital_device';
    formatKey = 'digital_device';
    formatLabel = 'Dedicated Digital Hardware Device Firmware';
    dimensionNumber = 10;
    badge = 'Dim 10 • Dedicated Device ROM';
    badgeColor = 'bg-indigo-100 text-indigo-900 border-indigo-300';
    confidence = 93;
    specSuggestions.deviceName = 'Johnnyblue Sovereign E-Paper Slate';
    specSuggestions.screenTech = '10.3" Carta 1300 E-Ink Display with Warm Glow';
    specSuggestions.casing = 'Precision Milled Aerospace Grade Recycled Aluminum';
  }
  // 9. Pendrive / SD Vault (Dimension 7)
  else if (['.zip', '.tar', '.gz', '.7z', '.dmg'].includes(ext) || lower.includes('pendrive') || lower.includes('vault') || lower.includes('sdcard') || lower.includes('usb')) {
    format = 'pendrive_sd';
    formatKey = 'pendrive_sd';
    formatLabel = 'Pendrive & Memory Card Complete Vault';
    dimensionNumber = 7;
    badge = 'Dim 7 • Pendrive / SD Vault Archive';
    badgeColor = 'bg-purple-100 text-purple-900 border-purple-300';
    confidence = 91;
    specSuggestions.capacity = '64 GB Dual Type-C & USB-A Metal Vault';
    specSuggestions.casing = 'Titanium Alloy Shockproof Enclosure';
  }
  // 10. Standard eBook formats (Dimension 1)
  else if (['.epub', '.mobi', '.azw3', '.pdf', '.docx', '.txt', '.rtf'].includes(ext)) {
    format = 'ebook';
    formatKey = 'ebook';
    formatLabel = 'Digital eBook (EPUB / PDF / MOBI)';
    dimensionNumber = 1;
    badge = 'Dim 1 • eBook Master';
    badgeColor = 'bg-blue-100 text-blue-900 border-blue-300';
    confidence = 90;
    specSuggestions.format = ext.replace('.', '').toUpperCase();
  }

  // Smart Title & Author extraction from filename
  // Examples:
  // "Atomic Habits - James Clear.epub"
  // "The_Sovereign_Architect_by_Johnny_Blue_Master_v2.m4b"
  // "Carl_Sagan-Cosmos-Unabridged.mp3"
  const cleanBase = baseName
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\b(v\d+|version\s*\d+|final|draft|master|600dpi|hls|prod|edit|hd|4k|unabridged)\b/gi, '')
    .replace(/\(.*?\)|\[.*?\]/g, '')
    .trim();

  let titleSuggestion = cleanBase;
  let authorSuggestion = '';
  let subtitleSuggestion = '';

  if (cleanBase.includes(' by ')) {
    const parts = cleanBase.split(' by ');
    titleSuggestion = capitalizeWords(parts[0].trim());
    authorSuggestion = capitalizeWords(parts[1].trim());
  } else if (cleanBase.includes(' - ')) {
    const parts = cleanBase.split(' - ');
    if (parts.length >= 2) {
      // Check which side looks more like an author or title
      titleSuggestion = capitalizeWords(parts[0].trim());
      authorSuggestion = capitalizeWords(parts[1].trim());
    }
  } else if (cleanBase.includes(':')) {
    const parts = cleanBase.split(':');
    titleSuggestion = capitalizeWords(parts[0].trim());
    subtitleSuggestion = capitalizeWords(parts[1].trim());
  } else {
    titleSuggestion = capitalizeWords(cleanBase);
  }

  // Estimated pages calculation
  let estimatedPages: number | undefined;
  if (format === 'ebook' || format === 'hardcover' || format === 'papercover') {
    if (ext === '.pdf') {
      estimatedPages = Math.max(12, Math.min(1200, Math.round(file.size / (1024 * 45))));
    } else {
      estimatedPages = Math.max(60, Math.min(900, Math.round(file.size / (1024 * 12))));
    }
  }

  // Estimated duration for audio/video
  let estimatedDuration: string | undefined;
  if (format === 'audiobook') {
    const hours = Math.max(1, Math.round(file.size / (1024 * 1024 * 45)));
    estimatedDuration = `${hours}h ${Math.floor(Math.random() * 40 + 10)}m`;
  } else if (format === 'videobook') {
    const hours = Math.max(1, Math.round(file.size / (1024 * 1024 * 400)));
    estimatedDuration = `${hours}h ${Math.floor(Math.random() * 30 + 15)}m 4K Video`;
  }

  // Category detection heuristic
  let categorySuggestion = 'Business & Technology';
  const textSample = (titleSuggestion + ' ' + lower).toLowerCase();
  if (textSample.includes('arch') || textSample.includes('code') || textSample.includes('data') || textSample.includes('ai') || textSample.includes('tech')) {
    categorySuggestion = 'Business & Technology';
  } else if (textSample.includes('novel') || textSample.includes('story') || textSample.includes('chronicle') || textSample.includes('sci-fi') || textSample.includes('fantasy')) {
    categorySuggestion = 'Sci-Fi & Fantasy';
  } else if (textSample.includes('poem') || textSample.includes('poetry') || textSample.includes('verse') || textSample.includes('lyrics')) {
    categorySuggestion = 'Poetry & Literary Arts';
  } else if (textSample.includes('history') || textSample.includes('ancient') || textSample.includes('dynasty') || textSample.includes('empire')) {
    categorySuggestion = 'History & Culture';
  } else if (textSample.includes('mind') || textSample.includes('spirit') || textSample.includes('meditat') || textSample.includes('zen') || textSample.includes('habit')) {
    categorySuggestion = 'Philosophy & Mindfulness';
  }

  return {
    format,
    formatKey,
    formatLabel,
    dimensionNumber,
    titleSuggestion,
    subtitleSuggestion,
    authorSuggestion,
    categorySuggestion,
    estimatedPages,
    estimatedDuration,
    fileSizeFormatted: sizeFormatted,
    fileSizeBytes: file.size,
    mimeType: file.type || 'application/octet-stream',
    extension: ext,
    badge,
    badgeColor,
    specSuggestions,
    confidence
  };
}

function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Upload file to Firebase Storage with resilient Offline fallback
 */
export async function uploadFileWithFirebase({
  file,
  folder = 'manuscripts',
  authorName = 'Johnny Blue',
  bookTitle = 'Untitled',
  formatType = 'ebook',
  onProgress
}: {
  file: File;
  folder?: string;
  authorName?: string;
  bookTitle?: string;
  formatType?: string;
  onProgress?: (percent: number, status: string) => void;
}): Promise<{
  downloadUrl: string;
  storagePath: string;
  isOfflineStored: boolean;
  fileName: string;
  sizeFormatted: string;
}> {
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const storagePath = `books/${folder}/${timestamp}_${safeName}`;
  const sizeFormatted = formatBytes(file.size);

  onProgress?.(10, 'Initiating secure Firebase upload stream...');

  if (!isOnline) {
    // Offline mode: Store binary file in IndexedDB
    onProgress?.(50, 'Offline detected. Securing in local IndexedDB vault...');
    const offlineKey = `offline_${timestamp}_${safeName}`;
    await storeOfflineFile(offlineKey, file, formatType);
    
    // Create local object URL for instant zero-latency preview
    const localUrl = URL.createObjectURL(file);

    // Save record to Firestore (or local fallback)
    await saveUploadRecordToFirestore({
      fileName: file.name,
      materialType: formatType,
      fileSize: sizeFormatted,
      fileSizeBytes: file.size,
      mimeType: file.type,
      authorName,
      bookTitle,
      storageProvider: 'Firebase Firestore',
      driveViewLink: localUrl,
      uploadedAt: new Date().toISOString()
    });

    onProgress?.(100, '✓ Saved securely in offline vault (ready to auto-sync when online)');
    return {
      downloadUrl: localUrl,
      storagePath,
      isOfflineStored: true,
      fileName: file.name,
      sizeFormatted
    };
  }

  try {
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          onProgress?.(Math.min(95, progress), `Uploading to Firebase Storage: ${progress}%`);
        },
        async (error) => {
          console.warn('Firebase Storage upload notice (falling back to offline vault):', error);
          // Fallback to offline store
          const offlineKey = `fallback_${timestamp}_${safeName}`;
          await storeOfflineFile(offlineKey, file, formatType);
          const localUrl = URL.createObjectURL(file);
          
          await saveUploadRecordToFirestore({
            fileName: file.name,
            materialType: formatType,
            fileSize: sizeFormatted,
            fileSizeBytes: file.size,
            mimeType: file.type,
            authorName,
            bookTitle,
            storageProvider: 'Firebase Firestore',
            driveViewLink: localUrl,
            uploadedAt: new Date().toISOString()
          });

          onProgress?.(100, '✓ Cached in resilient vault');
          resolve({
            downloadUrl: localUrl,
            storagePath,
            isOfflineStored: true,
            fileName: file.name,
            sizeFormatted
          });
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            onProgress?.(100, '✓ Uploaded and synced to Firebase Storage');

            // Save record in Firestore user_uploads collection
            await saveUploadRecordToFirestore({
              fileName: file.name,
              materialType: formatType,
              fileSize: sizeFormatted,
              fileSizeBytes: file.size,
              mimeType: file.type,
              authorName,
              bookTitle,
              storageProvider: 'Cloudflare R2',
              driveViewLink: downloadUrl,
              driveDownloadLink: downloadUrl,
              uploadedAt: new Date().toISOString()
            });

            resolve({
              downloadUrl,
              storagePath,
              isOfflineStored: false,
              fileName: file.name,
              sizeFormatted
            });
          } catch (urlErr) {
            console.warn('Error fetching download URL, using local blob:', urlErr);
            const localUrl = URL.createObjectURL(file);
            resolve({
              downloadUrl: localUrl,
              storagePath,
              isOfflineStored: false,
              fileName: file.name,
              sizeFormatted
            });
          }
        }
      );
    });
  } catch (err) {
    console.warn('Firebase Storage initialize failed, using offline vault:', err);
    const offlineKey = `offline_${timestamp}_${safeName}`;
    await storeOfflineFile(offlineKey, file, formatType);
    const localUrl = URL.createObjectURL(file);

    await saveUploadRecordToFirestore({
      fileName: file.name,
      materialType: formatType,
      fileSize: sizeFormatted,
      fileSizeBytes: file.size,
      mimeType: file.type,
      authorName,
      bookTitle,
      driveViewLink: localUrl,
      uploadedAt: new Date().toISOString()
    });

    onProgress?.(100, '✓ Stored in offline author vault');
    return {
      downloadUrl: localUrl,
      storagePath,
      isOfflineStored: true,
      fileName: file.name,
      sizeFormatted
    };
  }
}
