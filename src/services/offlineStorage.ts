// Client-side IndexedDB offline storage for Author Studio & BookTok Reels
// Provides persistent storage for large files (audio, video, handwritten scans, epubs)
// and pending sync operations when offline.

export interface OfflineDraft {
  id: string;
  type: 'book_draft' | 'reel_draft' | 'file_upload';
  title: string;
  author: string;
  formData: any;
  filesMeta: Record<string, {
    name: string;
    size: number;
    type: string;
    format: string;
    lastModified: number;
    storedInDbKey?: string;
  }>;
  createdAt: string;
  updatedAt: string;
  synced: boolean;
  syncError?: string;
}

export interface OfflineFileRecord {
  key: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  format: string;
  blob: Blob;
  addedAt: string;
}

const DB_NAME = 'johnnyblue1_author_offline_db';
const DB_VERSION = 1;
const DRAFTS_STORE = 'drafts';
const FILES_STORE = 'files';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(DRAFTS_STORE)) {
        db.createObjectStore(DRAFTS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(FILES_STORE)) {
        db.createObjectStore(FILES_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Save or update an author draft in offline store
 */
export async function saveOfflineDraft(draft: OfflineDraft): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([DRAFTS_STORE], 'readwrite');
      const store = tx.objectStore(DRAFTS_STORE);
      const req = store.put(draft);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB saveOfflineDraft fallback to localStorage:', err);
    try {
      const all = getLocalDraftsFallback();
      const idx = all.findIndex(d => d.id === draft.id);
      if (idx >= 0) all[idx] = draft;
      else all.push(draft);
      localStorage.setItem('jb_author_offline_drafts', JSON.stringify(all));
    } catch {
      // ignore
    }
  }
}

/**
 * Get all offline drafts
 */
export async function getOfflineDrafts(): Promise<OfflineDraft[]> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([DRAFTS_STORE], 'readonly');
      const store = tx.objectStore(DRAFTS_STORE);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return getLocalDraftsFallback();
  }
}

/**
 * Delete an offline draft
 */
export async function deleteOfflineDraft(id: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([DRAFTS_STORE], 'readwrite');
      const store = tx.objectStore(DRAFTS_STORE);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    const all = getLocalDraftsFallback().filter(d => d.id !== id);
    localStorage.setItem('jb_author_offline_drafts', JSON.stringify(all));
  }
}

/**
 * Store a binary file offline for deferred Firebase upload
 */
export async function storeOfflineFile(key: string, file: File, format: string): Promise<void> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([FILES_STORE], 'readwrite');
      const store = tx.objectStore(FILES_STORE);
      const record: OfflineFileRecord = {
        key,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        format,
        blob: file,
        addedAt: new Date().toISOString()
      };
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('Failed to store binary file in IndexedDB:', err);
  }
}

/**
 * Retrieve a stored offline binary file
 */
export async function getOfflineFile(key: string): Promise<File | null> {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction([FILES_STORE], 'readonly');
      const store = tx.objectStore(FILES_STORE);
      const req = store.get(key);
      req.onsuccess = () => {
        if (req.result && req.result.blob) {
          const r = req.result as OfflineFileRecord;
          const restoredFile = new File([r.blob], r.fileName, { type: r.mimeType });
          resolve(restoredFile);
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return null;
  }
}

function getLocalDraftsFallback(): OfflineDraft[] {
  try {
    const raw = localStorage.getItem('jb_author_offline_drafts');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
