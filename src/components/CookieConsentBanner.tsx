import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, Check, X, ExternalLink } from 'lucide-react';

interface CookieConsentBannerProps {
  onOpenPrivacyPolicy?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  onOpenPrivacyPolicy
}) => {
  const [hasConsented, setHasConsented] = useState(true); // default true to avoid flash

  useEffect(() => {
    const saved = localStorage.getItem('knowledge_centa_cookie_consent');
    if (!saved) {
      setHasConsented(false);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('knowledge_centa_cookie_consent', 'accepted_all');
    setHasConsented(true);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('knowledge_centa_cookie_consent', 'accepted_essential');
    setHasConsented(true);
  };

  if (hasConsented) return null;

  return (
    <aside aria-label="Cookie consent banner" className="fixed bottom-3 left-3 right-3 sm:left-6 sm:right-auto sm:max-w-xl z-50 bg-stone-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-stone-700/80 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0 text-amber-400">
          <Cookie className="w-5 h-5" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Google AdSense & Cookie Consent Notice</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-medium">
                GDPR & CCPA Compliant
              </span>
            </h4>
            <button
              onClick={handleAcceptEssential}
              className="text-stone-400 hover:text-white transition p-1 cursor-pointer"
              title="Close and accept essential only"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-300 leading-relaxed">
            We use cookies and similar tracking technologies to personalize literary content, analyze platform traffic, enable conversational Gemini AI inquiries, and serve relevant advertisements through <strong>Google AdSense</strong>. Third-party vendors, including Google, use DoubleClick DART cookies to serve ads based on your prior visits.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleAcceptAll}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All Cookies</span>
            </button>

            <button
              onClick={handleAcceptEssential}
              className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium rounded-lg border border-stone-600 transition cursor-pointer"
            >
              <span>Essential Only</span>
            </button>

            {onOpenPrivacyPolicy && (
              <button
                onClick={onOpenPrivacyPolicy}
                className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
              >
                <span>Read Policy & Opt-Out</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
