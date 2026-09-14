import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, 
  Video, 
  SwitchCamera, 
  X, 
  Check, 
  RotateCcw, 
  CircleDot, 
  StopCircle, 
  Sparkles, 
  AlertCircle,
  Smartphone,
  Upload
} from 'lucide-react';

interface NativeCameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
  title?: string;
  defaultMode?: 'video' | 'photo';
  maxDurationSeconds?: number;
}

export const NativeCameraCaptureModal: React.FC<NativeCameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = 'Native Camera Studio',
  defaultMode = 'video',
  maxDurationSeconds = 180 // 3 minutes for reels or shorts
}) => {
  const [mode, setMode] = useState<'video' | 'photo'>(defaultMode);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(null);
  const [capturedType, setCapturedType] = useState<'video' | 'image' | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [streamActive, setStreamActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const nativeFileInputRef = useRef<HTMLInputElement>(null);

  // Stop current active stream
  const stopStream = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setStreamActive(false);
  }, []);

  // Initialize camera stream
  const startStream = useCallback(async () => {
    stopStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Native camera access is not supported on this browser. You can use the Native Device Camera option below.');
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: mode === 'video'
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setStreamActive(true);
    } catch (err: any) {
      console.warn('Camera initialization notice:', err);
      setCameraError(
        err.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera permissions in your browser or use the Native Device Camera button.'
          : 'Could not activate webcam directly. Use the Native Device Camera button below to capture using your phone or OS camera.'
      );
    }
  }, [facingMode, mode, stopStream]);

  useEffect(() => {
    if (isOpen && !capturedBlob) {
      startStream();
    } else {
      stopStream();
    }

    return () => {
      stopStream();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isOpen, capturedBlob, startStream, stopStream]);

  // Clean up URL object when captured blob changes
  useEffect(() => {
    return () => {
      if (capturedPreviewUrl) {
        URL.revokeObjectURL(capturedPreviewUrl);
      }
    };
  }, [capturedPreviewUrl]);

  // Flip camera (front vs back)
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture Photo Snapshot
  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        stopStream();
        setCapturedBlob(blob);
        setCapturedPreviewUrl(URL.createObjectURL(blob));
        setCapturedType('image');
      }
    }, 'image/jpeg', 0.95);
  };

  // Start Video Recording
  const handleStartRecording = () => {
    if (!mediaStreamRef.current) return;
    recordedChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
        ? 'video/webm;codecs=vp9,opus'
        : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : 'video/mp4';

      const recorder = new MediaRecorder(mediaStreamRef.current, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunksRef.current, { type: mimeType });
        stopStream();
        setCapturedBlob(finalBlob);
        setCapturedPreviewUrl(URL.createObjectURL(finalBlob));
        setCapturedType('video');
      };

      recorder.start(250); // Collect data chunks every 250ms
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= maxDurationSeconds) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Failed to start MediaRecorder:', err);
    }
  };

  // Stop Video Recording
  const handleStopRecording = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Retake capture
  const handleRetake = () => {
    if (capturedPreviewUrl) URL.revokeObjectURL(capturedPreviewUrl);
    setCapturedBlob(null);
    setCapturedPreviewUrl(null);
    setCapturedType(null);
    setRecordingSeconds(0);
    startStream();
  };

  // Confirm and accept captured media as File
  const handleAccept = () => {
    if (!capturedBlob || !capturedType) return;
    const timestamp = Date.now();
    const isVideo = capturedType === 'video';
    const extension = isVideo ? 'webm' : 'jpg';
    const filename = `camera_capture_${timestamp}.${extension}`;
    const file = new File([capturedBlob], filename, {
      type: capturedBlob.type,
      lastModified: timestamp
    });

    onCapture(file);
    handleCloseModal();
  };

  // Handle native mobile input (via system camera)
  const handleNativeDeviceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onCapture(file);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    stopStream();
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-serif flex items-center gap-1.5">
                <span>{title}</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Direct Ingest
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Snap photos or record reels directly with high-capacity 10GB streaming
              </p>
            </div>
          </div>

          <button
            id="close-native-camera-modal-btn"
            type="button"
            onClick={handleCloseModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Area */}
        <div className="relative flex-1 min-h-[320px] sm:min-h-[400px] bg-black flex items-center justify-center overflow-hidden">
          {capturedPreviewUrl ? (
            capturedType === 'video' ? (
              <video
                src={capturedPreviewUrl}
                controls
                autoPlay
                loop
                className="w-full h-full max-h-[460px] object-contain rounded-lg"
              />
            ) : (
              <img
                src={capturedPreviewUrl}
                alt="Captured Snapshot"
                className="w-full h-full max-h-[460px] object-contain rounded-lg"
              />
            )
          ) : cameraError ? (
            <div className="p-6 text-center space-y-4 max-w-md">
              <div className="w-12 h-12 rounded-full bg-rose-950/80 text-rose-400 border border-rose-800 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-rose-300">Camera Access Notice</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{cameraError}</p>
              </div>

              {/* Native Mobile / System Camera Fallback Button */}
              <button
                type="button"
                onClick={() => nativeFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
              >
                <Smartphone className="w-4 h-4" />
                <span>Open Device Native Camera</span>
              </button>
            </div>
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className={`w-full h-full max-h-[460px] object-contain ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
          )}

          {/* Live Recording HUD Indicator */}
          {isRecording && (
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse backdrop-blur-sm">
              <CircleDot className="w-3.5 h-3.5" />
              <span>REC {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}</span>
              <span className="text-[10px] text-red-200">/ 3:00 max</span>
            </div>
          )}

          {/* Flip camera button */}
          {!capturedPreviewUrl && streamActive && !isRecording && (
            <button
              type="button"
              onClick={handleToggleFacingMode}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 transition cursor-pointer backdrop-blur-sm"
              title="Switch Front / Rear Camera"
            >
              <SwitchCamera className="w-4 h-4" />
            </button>
          )}

          {/* Format Mode Selector (Photo vs Video) */}
          {!capturedPreviewUrl && !isRecording && streamActive && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-900/80 backdrop-blur-md p-1 rounded-full border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setMode('photo')}
                className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                  mode === 'photo' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Photo</span>
              </button>
              <button
                type="button"
                onClick={() => setMode('video')}
                className={`px-3 py-1 rounded-full transition cursor-pointer flex items-center gap-1.5 ${
                  mode === 'video' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Reel</span>
              </button>
            </div>
          )}
        </div>

        {/* Action Controls Bar */}
        <div className="p-4 sm:p-5 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          {capturedPreviewUrl ? (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleRetake}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>

              <div className="text-center text-[11px] text-slate-400">
                <span>{capturedType === 'video' ? 'Video Reel Ready' : 'Photo Snapshot Ready'}</span>
              </div>

              <button
                id="accept-camera-capture-btn"
                type="button"
                onClick={handleAccept}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use & Ingest Media</span>
              </button>
            </div>
          ) : (
            <>
              {/* Native System Camera App Option (iOS/Android Native Camera directly) */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={nativeFileInputRef}
                  accept={mode === 'video' ? 'video/*' : 'image/*'}
                  capture="environment"
                  className="hidden"
                  onChange={handleNativeDeviceFile}
                />
                <button
                  type="button"
                  onClick={() => nativeFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition"
                  title="Open Phone's native Camera application"
                >
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Native Device Camera</span>
                </button>
              </div>

              {/* Central Trigger Button */}
              <div className="flex-1 flex justify-center">
                {mode === 'photo' ? (
                  <button
                    id="snap-photo-trigger-btn"
                    type="button"
                    onClick={handleSnapPhoto}
                    disabled={!streamActive}
                    className="w-14 h-14 rounded-full bg-white hover:bg-slate-100 disabled:opacity-50 text-slate-950 p-1 border-4 border-amber-400 shadow-xl flex items-center justify-center transition cursor-pointer active:scale-95"
                    title="Take Snapshot"
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                      <Camera className="w-5 h-5" />
                    </div>
                  </button>
                ) : (
                  isRecording ? (
                    <button
                      id="stop-recording-trigger-btn"
                      type="button"
                      onClick={handleStopRecording}
                      className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white p-1 border-4 border-white shadow-xl flex items-center justify-center transition cursor-pointer animate-pulse"
                      title="Stop Recording"
                    >
                      <StopCircle className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      id="start-recording-trigger-btn"
                      type="button"
                      onClick={handleStartRecording}
                      disabled={!streamActive}
                      className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white p-1 border-4 border-amber-400 shadow-xl flex items-center justify-center transition cursor-pointer active:scale-95"
                      title="Start Video Recording"
                    >
                      <div className="w-6 h-6 rounded-full bg-white" />
                    </button>
                  )
                )}
              </div>

              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Up to 10GB Support</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
