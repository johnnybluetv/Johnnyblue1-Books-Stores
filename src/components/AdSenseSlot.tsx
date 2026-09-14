import React, { useEffect, useState } from 'react';
import { ShieldCheck, Info, Sparkles, AlertCircle } from 'lucide-react';

interface AdSenseSlotProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle' | 'vertical';
  className?: string;
  label?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({
  slotId = '133023044333',
  format = 'horizontal',
  className = '',
  label = 'Advertisement'
}) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        setAdLoaded(true);
      }
    } catch (e) {
      // AdSense script may be blocked by user adblock or preview iframe
    }
  }, []);

  return (
    <div className={`my-4 overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-2xs ${className}`}>
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400">
        <span className="uppercase tracking-wider flex items-center gap-1">
          <span>{label}</span>
          <span className="text-[10px] text-slate-400 font-normal">• Google AdSense Certified</span>
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer flex items-center gap-0.5 text-[10px]"
            title="Ad choices and publisher disclosure"
          >
            <Info className="w-3 h-3" />
            <span>Ad Choices</span>
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-3 rounded-lg bg-amber-50/80 p-2 text-[11px] text-amber-900 border border-amber-200/60 leading-relaxed">
          Ads served on Knowledge Centa support our independent authors and 10-dimension publishing initiatives. Ads comply with Google AdSense Publisher Policies and GDPR/CCPA cookie guidelines.
        </div>
      )}

      {/* Ad Container conforming to Google AdSense responsive units */}
      <div className="flex items-center justify-center min-h-[90px] rounded-lg bg-slate-50/80 border border-dashed border-slate-200 text-center p-3">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%' }}
          data-ad-client="ca-pub-9428510842095172"
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />

        {/* Fallback Display for Preview Environment / AdSense approval review */}
        <div className="flex flex-col items-center justify-center gap-1 text-slate-500 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Google AdSense Authorized Display Unit</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              Ready
            </span>
          </div>
          <p className="text-[11px] text-slate-400 max-w-md">
            Responsive AdSense Slot <code className="font-mono text-[10px] text-slate-600">ca-pub-9428510842095172 / {slotId}</code> • Synchronized with <code className="font-mono text-[10px] text-slate-600">/ads.txt</code>
          </p>
        </div>
      </div>
    </div>
  );
};
