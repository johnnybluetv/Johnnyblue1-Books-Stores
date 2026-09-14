import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Key, 
  Clock, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertTriangle,
  FileCode,
  HardDrive,
  Database
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { FormatType, ApiAccessResponse } from '../types';
import { requestBookAccess } from '../services/secureDeliveryApi';

export const SecurityApiInspectorModal: React.FC = () => {
  const {
    apiInspectorOpen,
    setApiInspectorOpen,
    activeBook,
    activeFormat,
    purchasedSet
  } = useStore();

  const [testFormat, setTestFormat] = useState<FormatType>(activeFormat);
  const [testSampleOnly, setTestSampleOnly] = useState<boolean>(true);
  const [apiResponse, setApiResponse] = useState<ApiAccessResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(900); // 15 minutes in seconds
  const [isSimulatedTampered, setIsSimulatedTampered] = useState<boolean>(false);

  useEffect(() => {
    if (apiInspectorOpen) {
      executeApiCall(testSampleOnly, testFormat);
    }
  }, [apiInspectorOpen]);

  // Countdown timer for 15-minute expiration
  useEffect(() => {
    let timer: number | null = null;
    if (apiInspectorOpen && apiResponse?.success && !apiResponse.isSampleOnly) {
      setCountdown(apiResponse.expiresInSeconds);
      timer = window.setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [apiInspectorOpen, apiResponse]);

  if (!apiInspectorOpen) return null;

  const executeApiCall = async (sampleOnly: boolean, format: FormatType) => {
    setLoading(true);
    setIsSimulatedTampered(false);
    try {
      const res = await requestBookAccess(
        {
          bookId: activeBook.id,
          format,
          isSampleOnly: sampleOnly,
          userId: 'usr_kc_verified_884'
        },
        purchasedSet
      );
      setApiResponse(res);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatCountdown = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden font-mono"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100 font-sans">
                Secure Delivery Route Handler & Signed URL Inspector
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                POST /api/books/access • Cloudflare R2 & AWS S3 Compatibility
              </p>
            </div>
          </div>
          <button
            onClick={() => setApiInspectorOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded cursor-pointer transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300 font-sans">
          
          {/* Controls Bar */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
              Live API Request Simulation
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Select Media Format:</label>
                <div className="flex gap-1.5">
                  {(['ebook', 'audiobook', 'videobook', 'manuscript'] as FormatType[]).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setTestFormat(fmt);
                        executeApiCall(testSampleOnly, fmt);
                      }}
                      className={`px-2.5 py-1 rounded text-xs font-mono capitalize transition cursor-pointer ${
                        testFormat === fmt
                          ? 'bg-amber-400 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Access Mode:</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setTestSampleOnly(true);
                      executeApiCall(true, testFormat);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      testSampleOnly
                        ? 'bg-blue-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>isSampleOnly: true</span>
                  </button>

                  <button
                    onClick={() => {
                      setTestSampleOnly(false);
                      executeApiCall(false, testFormat);
                    }}
                    className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer flex items-center gap-1.5 ${
                      !testSampleOnly
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Full Content (Owned)</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Response Inspector */}
          {apiResponse && (
            <div className="space-y-4">
              
              {/* Status Header */}
              <div className="flex items-center justify-between bg-slate-950 px-4 py-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${apiResponse.success ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                  <span className="font-bold text-xs font-mono">
                    HTTP {apiResponse.success ? '200 OK' : '403 FORBIDDEN'}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Storage Provider: <strong className="text-amber-400">{apiResponse.storageProvider}</strong>
                </span>
              </div>

              {/* 15-Minute Expiration Countdown Card (as requested) */}
              {!apiResponse.isSampleOnly && apiResponse.success && (
                <div className="p-4 bg-emerald-950/40 border border-emerald-500/50 rounded-lg flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs font-mono">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>15-Minute Signed URL Expiration Window</span>
                    </div>
                    <p className="text-[11px] text-emerald-300/80">
                      Cloudflare R2 rejects requests after timestamp to prevent unauthorized hotlinking.
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                      {formatCountdown(countdown)}
                    </div>
                    <span className="text-[10px] text-slate-400">remaining</span>
                  </div>
                </div>
              )}

              {/* API JSON Payload Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
                  <span>Response Payload:</span>
                  <button
                    onClick={() => handleCopy(JSON.stringify(apiResponse, null, 2))}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-48 leading-relaxed">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>

              {/* Signed URL Breakdown */}
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 font-mono">
                  <Key className="w-3.5 h-3.5" />
                  <span>HMAC-SHA256 Token Signature:</span>
                </div>
                <div className="p-2 bg-slate-900 rounded font-mono text-[11px] text-slate-300 break-all border border-slate-800">
                  {isSimulatedTampered
                    ? 'INVALID_TAMPERED_SIG_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                    : apiResponse.tokenSignature || 'N/A (Unauthorized)'}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => setIsSimulatedTampered(!isSimulatedTampered)}
                    className="text-[11px] text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSimulatedTampered ? 'Reset Signature' : 'Simulate Hotlink Tampering'}</span>
                  </button>
                  {isSimulatedTampered && (
                    <span className="text-[11px] font-bold text-red-400">
                      R2 Cloudflare Validation: Signature Mismatch (Denied)
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Architecture Summary */}
          <div className="border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400">
            <div className="flex items-start gap-2">
              <HardDrive className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Cloudflare R2 Zero-Egress</strong>
                Private buckets eliminate bandwidth fees for high-volume audio and 4K video downloads.
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Database className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-200 block">Prisma / PostgreSQL Schema</strong>
                Row-level user library validation checks verified receipts prior to URL issuance.
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setApiInspectorOpen(false)}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold cursor-pointer transition font-sans"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
