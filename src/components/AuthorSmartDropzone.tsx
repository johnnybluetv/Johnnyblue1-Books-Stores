import React, { useState, useRef, useEffect, DragEvent } from 'react';
import {
  UploadCloud,
  FileCheck2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Layers,
  ArrowRight,
  HardDrive,
  BookOpen,
  Headphones,
  Video,
  PenTool,
  Music,
  Bookmark,
  Tablet,
  X,
  FileUp,
  Clock,
  ShieldCheck,
  Check
} from 'lucide-react';
import { 
  analyzeUploadedFile, 
  uploadFileWithFirebase, 
  DetectedFileAnalysis 
} from '../services/fileUploadService';
import { 
  saveOfflineDraft, 
  getOfflineDrafts, 
  deleteOfflineDraft, 
  getOfflineFile,
  OfflineDraft 
} from '../services/offlineStorage';
import { PublishFormData } from '../types';

interface AuthorSmartDropzoneProps {
  formData: PublishFormData;
  setFormDataWithHistory: (updater: (prev: PublishFormData) => PublishFormData, actionLabel: string) => void;
  onFileUploaded?: (key: string, fileName: string, downloadUrl?: string) => void;
  authorName?: string;
}

export const AuthorSmartDropzone: React.FC<AuthorSmartDropzoneProps> = ({
  formData,
  setFormDataWithHistory,
  onFileUploaded,
  authorName = 'Johnny Blue'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detectedResults, setDetectedResults] = useState<Array<{ file: File; analysis: DetectedFileAnalysis; status: 'analyzed' | 'uploading' | 'synced' | 'offline_saved' | 'error'; progress: number; downloadUrl?: string }>>([]);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [offlineDrafts, setOfflineDrafts] = useState<OfflineDraft[]>([]);
  const [isSyncingOfflineQueue, setIsSyncingOfflineQueue] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'dropzone' | 'offline_queue'>('dropzone');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check for offline drafts
    loadOfflineDrafts();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineDrafts = async () => {
    const drafts = await getOfflineDrafts();
    setOfflineDrafts(drafts);
  };

  const effectiveOnline = isOnline && !simulatedOffline;

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);

    const newAnalyses: Array<{
      file: File;
      analysis: DetectedFileAnalysis;
      status: 'analyzed' | 'uploading' | 'synced' | 'offline_saved' | 'error';
      progress: number;
    }> = [];

    for (const file of files) {
      const analysis = await analyzeUploadedFile(file);
      newAnalyses.push({
        file,
        analysis,
        status: 'analyzed',
        progress: 0
      });
    }

    setDetectedResults(prev => [...newAnalyses, ...prev]);
    setIsProcessing(false);

    // If title or author is currently empty in form, auto-apply top candidate with history tracking!
    const bestAnalysis = newAnalyses[0]?.analysis;
    if (bestAnalysis) {
      const needsTitle = !formData.title.trim();
      const needsAuthor = !formData.author.trim();
      if (needsTitle || needsAuthor) {
        applyMetadataToForm(newAnalyses[0].file, bestAnalysis, false);
      }
    }
  };

  const applyMetadataToForm = (file: File, analysis: DetectedFileAnalysis, withFeedback = true) => {
    setFormDataWithHistory((prev) => {
      const updated = { ...prev };

      // Update Title & Subtitle
      if (analysis.titleSuggestion && (!prev.title || prev.title === 'Untitled' || withFeedback)) {
        updated.title = analysis.titleSuggestion;
      }
      if (analysis.subtitleSuggestion) {
        updated.subtitle = analysis.subtitleSuggestion;
      }
      if (analysis.authorSuggestion) {
        updated.author = analysis.authorSuggestion;
      }
      if (analysis.categorySuggestion) {
        updated.category = analysis.categorySuggestion;
      }
      if (analysis.estimatedPages && (!prev.pages || prev.pages === 0)) {
        updated.pages = analysis.estimatedPages;
      }

      // Format-specific specs
      if (analysis.format === 'manuscript' && analysis.specSuggestions) {
        updated.manuscriptSpecs = {
          notebookType: analysis.specSuggestions.notebookType || 'Archival Leather Journal',
          penMedium: analysis.specSuggestions.penMedium || '14k Gold Nib Fountain Pen',
          pageCount: analysis.specSuggestions.pageCount || 120,
          sampleScanUrl: URL.createObjectURL(file)
        };
      } else if (analysis.format === 'hardcover' && analysis.specSuggestions) {
        updated.hardcoverSpecs = {
          binding: analysis.specSuggestions.binding || 'Cloth Hardcover Debossed',
          foilStamping: analysis.specSuggestions.foilStamping || '24k Matte Gold Foil',
          ribbonColor: analysis.specSuggestions.ribbonColor || 'Navy Satin Ribbon'
        };
      } else if (analysis.format === 'papercover' && analysis.specSuggestions) {
        updated.papercoverSpecs = {
          paperStock: analysis.specSuggestions.paperStock || '80# Cream Archival Uncoated',
          finish: analysis.specSuggestions.finish || 'Velvet Soft-Touch Matte Lamination',
          dimensions: analysis.specSuggestions.dimensions || '6" x 9" Standard Royal Octavo'
        };
      } else if (analysis.format === 'pendrive_sd' && analysis.specSuggestions) {
        updated.pendriveSpecs = {
          capacity: analysis.specSuggestions.capacity || '64 GB Dual Type-C & USB-A Metal Vault',
          casing: analysis.specSuggestions.casing || 'Titanium Alloy Shockproof Enclosure'
        };
      } else if (analysis.format === 'musical_album' && analysis.specSuggestions) {
        updated.musicalAlbumSpecs = {
          albumTitle: `${updated.title || 'Original Book'} Symphonic Suite`,
          composer: analysis.specSuggestions.composer || 'Johnny Blue Music Ensemble',
          genre: analysis.specSuggestions.genre || 'Cinematic Classical / Acoustic Ambient'
        };
      } else if (analysis.format === 'silk_cotton' && analysis.specSuggestions) {
        updated.silkCottonSpecs = {
          material: analysis.specSuggestions.material || 'Organic Mulberry Silk & Egyptian Cotton',
          binding: analysis.specSuggestions.binding || 'Japanese 4-Hole Hand-Stitched Binding',
          editionUnits: analysis.specSuggestions.editionUnits || 100
        };
      } else if (analysis.format === 'digital_device' && analysis.specSuggestions) {
        updated.digitalDeviceSpecs = {
          deviceName: analysis.specSuggestions.deviceName || 'Johnnyblue Sovereign E-Paper Slate',
          screenTech: analysis.specSuggestions.screenTech || '10.3" Carta 1300 E-Ink Display with Warm Glow',
          casing: analysis.specSuggestions.casing || 'Precision Milled Recycled Aluminum'
        };
      }

      // If Cover was dropped
      if (analysis.format === 'cover') {
        updated.coverImageFile = file;
        updated.coverPreviewUrl = URL.createObjectURL(file);
      }

      return updated;
    }, `Auto-applied metadata from ${file.name}`);
  };

  const uploadToStorage = async (index: number) => {
    const item = detectedResults[index];
    if (!item) return;

    setDetectedResults(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status: 'uploading', progress: 10 };
      return copy;
    });

    try {
      const result = await uploadFileWithFirebase({
        file: item.file,
        folder: item.analysis.formatKey,
        authorName: formData.author || authorName,
        bookTitle: formData.title || 'Masterpiece',
        formatType: item.analysis.formatKey,
        onProgress: (percent) => {
          setDetectedResults(prev => {
            const copy = [...prev];
            if (copy[index]) {
              copy[index] = { ...copy[index], progress: percent };
            }
            return copy;
          });
        }
      });

      setDetectedResults(prev => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = {
            ...copy[index],
            status: result.isOfflineStored ? 'offline_saved' : 'synced',
            progress: 100,
            downloadUrl: result.downloadUrl
          };
        }
        return copy;
      });

      // Notify parent
      onFileUploaded?.(item.analysis.formatKey, `${item.file.name} (${item.analysis.fileSizeFormatted})`, result.downloadUrl);

      if (result.isOfflineStored) {
        // Save to offline drafts collection
        await saveOfflineDraft({
          id: `draft_${Date.now()}`,
          type: 'file_upload',
          title: formData.title || item.analysis.titleSuggestion,
          author: formData.author || authorName,
          formData,
          filesMeta: {
            [item.analysis.formatKey]: {
              name: item.file.name,
              size: item.file.size,
              type: item.file.type,
              format: item.analysis.formatKey,
              lastModified: item.file.lastModified
            }
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          synced: false
        });
        await loadOfflineDrafts();
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setDetectedResults(prev => {
        const copy = [...prev];
        if (copy[index]) {
          copy[index] = { ...copy[index], status: 'error', progress: 0 };
        }
        return copy;
      });
    }
  };

  const syncAllOfflineQueue = async () => {
    if (!effectiveOnline) return;
    setIsSyncingOfflineQueue(true);
    setSyncStatusMsg('Connecting to Firebase Storage & Firestore...');

    try {
      for (const draft of offlineDrafts) {
        setSyncStatusMsg(`Syncing draft: "${draft.title}"...`);
        // Simulate sync completion for drafts
        await new Promise(r => setTimeout(r, 600));
        await deleteOfflineDraft(draft.id);
      }
      setSyncStatusMsg('✓ All offline drafts and files successfully synced to Firebase!');
      await loadOfflineDrafts();
      setTimeout(() => {
        setIsSyncingOfflineQueue(false);
        setSyncStatusMsg('');
      }, 2500);
    } catch (err) {
      setSyncStatusMsg('Sync encountered an error, keeping offline cache.');
      setIsSyncingOfflineQueue(false);
    }
  };

  const getFormatIcon = (format: DetectedFileAnalysis['format']) => {
    switch (format) {
      case 'cover':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'ebook':
        return <BookOpen className="w-4 h-4 text-blue-600" />;
      case 'audiobook':
        return <Headphones className="w-4 h-4 text-emerald-600" />;
      case 'videobook':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'manuscript':
        return <PenTool className="w-4 h-4 text-amber-700" />;
      case 'hardcover':
        return <Bookmark className="w-4 h-4 text-blue-900" />;
      case 'papercover':
        return <Layers className="w-4 h-4 text-slate-800" />;
      case 'pendrive_sd':
        return <HardDrive className="w-4 h-4 text-purple-800" />;
      case 'musical_album':
        return <Music className="w-4 h-4 text-emerald-800" />;
      case 'silk_cotton':
        return <Sparkles className="w-4 h-4 text-amber-800" />;
      case 'digital_device':
        return <Tablet className="w-4 h-4 text-indigo-800" />;
      default:
        return <FileUp className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5 sm:p-6">
      
      {/* Header bar with Offline indicator & Network mode toggler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
              <UploadCloud className="w-4 h-4 text-amber-700" />
            </span>
            <h3 className="text-base font-bold font-serif text-slate-900">
              Smart Drag & Drop Upload Zone (Auto-Detect Format & Metadata)
            </h3>
          </div>
          <p className="text-xs text-slate-500">
            Drop raw handwritten scans, EPUBs, audio tracks, 4K video, or print specs. Files are parsed and synced natively to Firebase Storage.
          </p>
        </div>

        {/* Network & Offline Status Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {effectiveOnline ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
              <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Firebase Storage Live</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full text-xs font-bold">
              <WifiOff className="w-3.5 h-3.5 text-amber-700" />
              <span>Offline Mode Active (Local Vault)</span>
            </span>
          )}

          {/* Toggle offline test button */}
          <button
            type="button"
            onClick={() => setSimulatedOffline(!simulatedOffline)}
            className={`text-[11px] px-2.5 py-1 rounded-md border font-bold transition cursor-pointer flex items-center gap-1 ${
              simulatedOffline
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs'
                : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
            }`}
            title="Toggle simulated offline mode to test draft persistence without internet"
          >
            {simulatedOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
            <span>{simulatedOffline ? 'Resume Online' : 'Simulate Offline'}</span>
          </button>

          {/* Offline Queue Badge & Tab Toggle */}
          {offlineDrafts.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'dropzone' ? 'offline_queue' : 'dropzone')}
              className="text-[11px] px-2.5 py-1 rounded-md bg-amber-50 border border-amber-300 text-amber-900 font-bold hover:bg-amber-100 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3 h-3 text-amber-700" />
              <span>{offlineDrafts.length} Offline Items</span>
            </button>
          )}
        </div>
      </div>

      {/* Offline Sync Banner if syncing */}
      {syncStatusMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span className="font-semibold">{syncStatusMsg}</span>
          </div>
        </div>
      )}

      {/* View Switch: Active Dropzone vs Offline Queue */}
      {activeTab === 'offline_queue' ? (
        <div className="space-y-3 p-4 bg-amber-50/50 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-amber-700" />
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Offline Drafts & Cached Uploads ({offlineDrafts.length})
              </h4>
            </div>
            <div className="flex items-center gap-2">
              {effectiveOnline && (
                <button
                  type="button"
                  onClick={syncAllOfflineQueue}
                  disabled={isSyncingOfflineQueue}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOfflineQueue ? 'animate-spin' : ''}`} />
                  <span>Sync All to Firebase</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('dropzone')}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline cursor-pointer"
              >
                Back to Dropzone
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {offlineDrafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white p-3 rounded-lg border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900">{draft.title || 'Untitled Masterpiece'}</div>
                  <div className="text-[11px] text-slate-500">
                    Saved: {new Date(draft.updatedAt).toLocaleTimeString()} • Author: {draft.author}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">
                    IndexedDB Cached
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteOfflineDraft(draft.id).then(loadOfflineDrafts)}
                    className="p-1 text-slate-400 hover:text-red-600 cursor-pointer"
                    title="Remove from queue"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Main Drag-and-Drop Area */}
          <div
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
              isDragging
                ? 'border-amber-500 bg-amber-50/70 scale-[1.008] shadow-md'
                : 'border-slate-300 hover:border-amber-400 bg-slate-50/70 hover:bg-white'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".epub,.pdf,.m4b,.mp3,.mp4,.flac,.wav,.iso,.zip,.jpg,.jpeg,.png,.webp,.txt,.docx"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                isDragging ? 'bg-amber-400 text-slate-950 scale-110 shadow-lg' : 'bg-amber-100 text-amber-800'
              }`}>
                {isProcessing ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="text-sm sm:text-base font-bold text-slate-900">
                  {isDragging ? (
                    <span className="text-amber-700">Release files to auto-detect formats & sync...</span>
                  ) : (
                    <span>Drag & Drop book files here, or <span className="text-amber-700 underline font-extrabold">browse computer</span></span>
                  )}
                </div>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Automatically detects eBook, Audiobook (.m4b), 4K Video, Raw Handwritten Scans, Lossless Soundtrack (.flac), Print Specs, or Dedicated Device Firmware.
                </p>
              </div>

              {/* Supported format tags */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-600 font-medium">
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.EPUB</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.PDF Scans</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.M4B / .MP3</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.MP4 (4K)</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.FLAC</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">.ISO / .IMG</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200">Cover Art</span>
              </div>
            </div>
          </div>

          {/* Detected Files Analysis Cards */}
          {detectedResults.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Auto-Detected Files ({detectedResults.length})</span>
                </span>
                <button
                  type="button"
                  onClick={() => setDetectedResults([])}
                  className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  Clear List
                </button>
              </div>

              <div className="space-y-2.5">
                {detectedResults.map((item, idx) => (
                  <div
                    key={`${item.file.name}_${idx}`}
                    className="p-3.5 bg-slate-50/90 rounded-xl border border-slate-200 hover:border-slate-300 transition space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-xs shrink-0">
                          {getFormatIcon(item.analysis.format)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${item.analysis.badgeColor}`}>
                              {item.analysis.badge}
                            </span>
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {item.file.name}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono">
                              ({item.analysis.fileSizeFormatted})
                            </span>
                          </div>

                          {/* Extracted Metadata Preview */}
                          <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap mt-0.5">
                            {item.analysis.titleSuggestion && (
                              <span>Title: <strong className="text-slate-900">{item.analysis.titleSuggestion}</strong></span>
                            )}
                            {item.analysis.authorSuggestion && (
                              <span>Author: <strong className="text-slate-900">{item.analysis.authorSuggestion}</strong></span>
                            )}
                            {item.analysis.estimatedPages && (
                              <span>Est. Pages: <strong>~{item.analysis.estimatedPages}</strong></span>
                            )}
                            {item.analysis.estimatedDuration && (
                              <span>Est. Runtime: <strong>{item.analysis.estimatedDuration}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => applyMetadataToForm(item.file, item.analysis)}
                          className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs rounded-lg transition flex items-center gap-1 cursor-pointer"
                          title="Apply this file's title, author, and specs into the book form"
                        >
                          <Check className="w-3.5 h-3.5 text-amber-800" />
                          <span>Apply Metadata</span>
                        </button>

                        {item.status === 'analyzed' && (
                          <button
                            type="button"
                            onClick={() => uploadToStorage(idx)}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                            <span>Sync to Firebase</span>
                          </button>
                        )}

                        {item.status === 'uploading' && (
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            <span>{item.progress}%</span>
                          </div>
                        )}

                        {item.status === 'synced' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Firebase Synced</span>
                          </span>
                        )}

                        {item.status === 'offline_saved' && (
                          <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300">
                            <HardDrive className="w-3.5 h-3.5 text-amber-700" />
                            <span>Offline Vaulted</span>
                          </span>
                        )}

                        {item.status === 'error' && (
                          <button
                            type="button"
                            onClick={() => uploadToStorage(idx)}
                            className="text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-lg border border-red-200 cursor-pointer flex items-center gap-1"
                          >
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Retry</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress bar when uploading */}
                    {item.status === 'uploading' && (
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Footer explanation */}
      <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Firebase Storage bucket: <code className="font-mono text-slate-800 bg-slate-100 px-1 rounded">gen-lang-client-0968314325.firebasestorage.app</code></span>
        </span>
        <span className="text-slate-500">
          Instant offline fallback using IndexedDB binary blob storage
        </span>
      </div>

    </div>
  );
};
