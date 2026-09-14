import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  Video, 
  Music, 
  Image as ImageIcon, 
  FileText, 
  Archive, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause,
  HardDrive,
  Sparkles,
  Camera,
  Smartphone
} from 'lucide-react';
import { BlogMediaItem } from '../types';
import { NativeCameraCaptureModal } from './NativeCameraCaptureModal';
import { UniversalAiSuggestionBox } from './UniversalAiSuggestionBox';

interface BlogMediaUploadProps {
  mediaItems: BlogMediaItem[];
  onMediaItemsChange: (items: BlogMediaItem[]) => void;
  maxSizeBytes?: number; // default 10GB
}

const TEN_GIGABYTES_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const BlogMediaUpload: React.FC<BlogMediaUploadProps> = ({
  mediaItems,
  onMediaItemsChange,
  maxSizeBytes = TEN_GIGABYTES_BYTES
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const totalUsedBytes = mediaItems.reduce((acc, item) => acc + item.sizeBytes, 0);
  const remainingBytes = Math.max(0, maxSizeBytes - totalUsedBytes);
  const usagePercentage = Math.min(100, Math.round((totalUsedBytes / maxSizeBytes) * 100));

  const detectMediaType = (file: File): 'video' | 'audio' | 'image' | 'document' | 'archive' => {
    const mime = file.type.toLowerCase();
    const name = file.name.toLowerCase();

    if (mime.startsWith('video/') || name.endsWith('.mp4') || name.endsWith('.mov') || name.endsWith('.mkv') || name.endsWith('.webm') || name.endsWith('.avi')) {
      return 'video';
    }
    if (mime.startsWith('audio/') || name.endsWith('.mp3') || name.endsWith('.wav') || name.endsWith('.flac') || name.endsWith('.m4a') || name.endsWith('.ogg')) {
      return 'audio';
    }
    if (mime.startsWith('image/') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.png') || name.endsWith('.webp') || name.endsWith('.gif') || name.endsWith('.svg')) {
      return 'image';
    }
    if (name.endsWith('.zip') || name.endsWith('.tar') || name.endsWith('.gz') || name.endsWith('.iso') || name.endsWith('.7z')) {
      return 'archive';
    }
    return 'document';
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setErrorMessage(null);

    const newItems: BlogMediaItem[] = [];

    Array.from(files).forEach((file) => {
      // 10GB limit check
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" (${formatBytes(file.size)}) exceeds the maximum 10 Gigabytes limit.`);
        return;
      }

      if (totalUsedBytes + file.size > maxSizeBytes) {
        setErrorMessage(`Adding "${file.name}" exceeds the total 10GB capacity for this article.`);
        return;
      }

      const mediaType = detectMediaType(file);
      const tempUrl = URL.createObjectURL(file);
      const itemId = `media_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

      newItems.push({
        id: itemId,
        name: file.name,
        type: mediaType,
        url: tempUrl,
        sizeBytes: file.size,
        sizeFormatted: formatBytes(file.size),
        mimeType: file.type || 'application/octet-stream',
        uploadedAt: new Date().toISOString(),
        caption: ''
      });

      // Simulate rapid progressive chunk upload for UX feedback
      setUploadProgress(prev => ({ ...prev, [itemId]: 10 }));
      const timer = setInterval(() => {
        setUploadProgress(prev => {
          const curr = prev[itemId] || 10;
          if (curr >= 100) {
            clearInterval(timer);
            return prev;
          }
          return { ...prev, [itemId]: Math.min(100, curr + 30) };
        });
      }, 150);
    });

    if (newItems.length > 0) {
      onMediaItemsChange([...mediaItems, ...newItems]);
    }
  };

  const handleRemoveItem = (id: string) => {
    onMediaItemsChange(mediaItems.filter(i => i.id !== id));
  };

  const handleCaptionChange = (id: string, caption: string) => {
    onMediaItemsChange(mediaItems.map(i => i.id === id ? { ...i, caption } : i));
  };

  return (
    <div className="space-y-4">
      
      {/* 10GB Quota Bar & Capacity Tracker */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-amber-300">Blog Media Cloud Storage Vault</span>
            <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
              10 Gigabytes Max Limit
            </span>
          </div>
          <span className="text-slate-300 font-mono text-[11px]">
            {formatBytes(totalUsedBytes)} / 10 GB ({100 - usagePercentage}% free)
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 transition-all duration-300"
            style={{ width: `${Math.max(1, usagePercentage)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Accepts 4K Video, High-Res Audio, Raw Manuscript PDFs, Master ZIPs</span>
          <span>Max single file: 10 GB</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Native Camera Quick Bar (Photo & Video Capture) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-3 bg-amber-500/10 rounded-xl border border-amber-300/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-xs text-slate-900 font-serif">Native Camera Media Capture</span>
            <p className="text-[11px] text-slate-600">Snap author desk photos or record video masterclass clips up to 10GB</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Direct Native Camera App Input */}
          <input
            type="file"
            ref={nativeCameraInputRef}
            accept="video/*,image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            onClick={() => nativeCameraInputRef.current?.click()}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition"
            title="Open phone or tablet native camera app"
          >
            <Smartphone className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Phone</span> Camera
          </button>

          {/* In-Browser Native Viewfinder Modal */}
          <button
            id="open-blog-native-camera-btn"
            type="button"
            onClick={() => setIsCameraModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition"
          >
            <Video className="w-3.5 h-3.5 text-slate-950" />
            <span>Launch Live Camera</span>
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
          isDragging 
            ? 'border-amber-500 bg-amber-50/50' 
            : 'border-slate-300 hover:border-amber-400 hover:bg-slate-50'
        }`}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple
          accept="video/*,audio/*,image/*,.pdf,.epub,.docx,.zip,.tar,.gz,.iso" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mb-3 shadow-inner">
          <UploadCloud className="w-6 h-6" />
        </div>

        <h4 className="font-bold text-sm text-slate-800 mb-1 font-serif">
          Drag & drop all sorts of media, or <span className="text-amber-600 underline">browse files</span>
        </h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Upload 4K Video Books, Studio FLAC Audio, Manuscript Scans, or Data Archives up to <strong className="text-slate-700">10 Gigabytes</strong>.
        </p>

        {/* Media type pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-[11px]">
          <span className="bg-slate-100 text-purple-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
            <Video className="w-3.5 h-3.5" /> Videos (MP4/MOV)
          </span>
          <span className="bg-slate-100 text-emerald-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
            <Music className="w-3.5 h-3.5" /> Audio (MP3/FLAC)
          </span>
          <span className="bg-slate-100 text-blue-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
            <ImageIcon className="w-3.5 h-3.5" /> Images (PNG/JPG)
          </span>
          <span className="bg-slate-100 text-amber-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
            <FileText className="w-3.5 h-3.5" /> Books/PDFs
          </span>
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1 font-semibold">
            <Archive className="w-3.5 h-3.5" /> Archives (ZIP)
          </span>
        </div>
      </div>

      {/* Uploaded Media Items List */}
      {mediaItems.length > 0 && (
        <div className="space-y-3">
          <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider flex items-center justify-between">
            <span>Attached Media Assets ({mediaItems.length})</span>
            <span className="text-amber-600 font-semibold">{formatBytes(totalUsedBytes)} of 10 GB used</span>
          </h5>

          <div className="grid grid-cols-1 gap-2.5">
            {mediaItems.map((item) => {
              const progress = uploadProgress[item.id] ?? 100;

              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Media Type Icon */}
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 bg-slate-100">
                      {item.type === 'video' && <Video className="w-5 h-5 text-purple-600" />}
                      {item.type === 'audio' && <Music className="w-5 h-5 text-emerald-600" />}
                      {item.type === 'image' && <ImageIcon className="w-5 h-5 text-blue-600" />}
                      {item.type === 'document' && <FileText className="w-5 h-5 text-amber-600" />}
                      {item.type === 'archive' && <Archive className="w-5 h-5 text-slate-600" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-xs text-slate-900 truncate">{item.name}</p>
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {item.sizeFormatted}
                        </span>
                        {progress >= 100 && (
                          <span className="text-emerald-600 flex items-center gap-0.5 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3" /> Ready
                          </span>
                        )}
                      </div>

                      {progress < 100 ? (
                        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div 
                            className="bg-amber-400 h-full transition-all duration-200" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={item.caption || ''}
                          onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                          placeholder="Optional caption or description for this media..."
                          className="w-full text-[11px] text-slate-600 border-b border-transparent hover:border-slate-300 focus:border-amber-400 outline-none mt-1 py-0.5"
                        />
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {item.type === 'image' && (
                      <img 
                        src={item.url} 
                        alt="Preview" 
                        className="w-10 h-10 object-cover rounded-md border border-slate-200" 
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition cursor-pointer"
                      title="Remove attachment"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Universal AI Suggestion Box below Media Upload */}
      <UniversalAiSuggestionBox
        context="blog-editor"
        label="AI 10GB Media & Multi-Sensory Publishing Suggestions"
        extraData={{ mediaCount: mediaItems.length, usedBytes: totalUsedBytes }}
      />

      {/* Native Camera Capture Modal */}
      <NativeCameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        title="Record or Snap Media for Blog Article"
        defaultMode="video"
        onCapture={(file) => {
          handleFiles([file] as any);
        }}
      />

    </div>
  );
};
