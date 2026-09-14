/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { SubNav } from './components/SubNav';
import { ProductDetailPage } from './components/ProductDetailPage';
import { Storefront } from './components/Storefront';
import { AuthorPublishStudio } from './components/AuthorPublishStudio';
import { AuthorDashboard } from './components/AuthorDashboard';
import { CloudLibraryView } from './components/CloudLibraryView';
import { AuthorProfilePage } from './components/AuthorProfilePage';
import { WishlistView } from './components/WishlistView';
import { ReelsFeed } from './components/ReelsFeed';
import { BlogView } from './components/BlogView';
import { WaitingListPage } from './components/WaitingListPage';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { FloatingBlogPenBubble } from './components/FloatingBlogPenBubble';
import { BookSnowfallBackground } from './components/BookSnowfallBackground';
import { LookInsideModal } from './components/LookInsideModal';
import { CartDrawer } from './components/CartDrawer';
import { SecurityApiInspectorModal } from './components/SecurityApiInspectorModal';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { LegalPoliciesModal, LegalTabType } from './components/LegalPoliciesModal';
import { PageFlipSoundDialog } from './components/PageFlipSoundDialog';
import { AmazonBestSellerFlippingBookCard } from './components/AmazonBestSellerFlippingBookCard';
import { WishlistToastNotification } from './components/WishlistToastNotification';
import { BookOpen, Sparkles, ShieldCheck, ChevronUp, Film, Newspaper, Tablet, Bell, X, Globe, Lock } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from './services/i18n';
import { scrollToTopEaseOutQuint } from './services/scrollService';

const MainLayout: React.FC = () => {
  const { 
    currentView, 
    setCurrentView, 
    notificationMessage, 
    setNotificationMessage,
    currentLanguage,
    setLanguage,
    languageDirection,
    t
  } = useStore();

  const [legalModalOpen, setLegalModalOpen] = React.useState(false);
  const [legalInitialTab, setLegalInitialTab] = React.useState<LegalTabType>('privacy');
  const [soundDialogOpen, setSoundDialogOpen] = React.useState(false);

  const openLegal = (tab: LegalTabType) => {
    setLegalInitialTab(tab);
    setLegalModalOpen(true);
  };

  const scrollToTop = () => {
    scrollToTopEaseOutQuint();
  };

  return (
    <div 
      dir={languageDirection}
      className="min-h-screen flex flex-col bg-[#eaeded] font-sans selection:bg-amber-300 selection:text-slate-900"
    >
      
      {/* Toast Notification */}
      <WishlistToastNotification />

      {notificationMessage && (
        <div 
          id="global-toast-notification"
          role="status"
          aria-live="polite"
          className={`fixed top-16 right-4 sm:right-6 z-[9999] max-w-md ${
            notificationMessage.includes('🔔') || notificationMessage.includes('Release')
              ? 'bg-[#0f172a] border-amber-400 text-white shadow-2xl ring-2 ring-amber-400/40' 
              : 'bg-[#131921] border-amber-400/70 text-white shadow-xl'
          } px-4 py-3 rounded-xl border flex items-center gap-3 text-xs animate-in slide-in-from-top-4 duration-300 backdrop-blur-md`}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
            {notificationMessage.includes('🔔') || notificationMessage.includes('Release') ? (
              <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="flex-1 font-semibold leading-snug">
            {notificationMessage}
          </div>
          <button
            onClick={() => setNotificationMessage(null)}
            className="text-slate-400 hover:text-white p-1 rounded transition cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Frozen Sticky Top Navigation (Header + 10 Dimensions SubNav) */}
      <div id="frozen-top-navigation-container" className="sticky top-0 z-40 shadow-md">
        <Header onOpenSoundDialog={() => setSoundDialogOpen(true)} />
        <SubNav />
      </div>

      {/* Dynamic Views */}
      <main className="flex-1">
        {currentView === 'store' && <Storefront />}
        {currentView === 'book-detail' && <ProductDetailPage />}
        {currentView === 'author-dashboard' && <AuthorDashboard />}
        {currentView === 'publish' && <AuthorPublishStudio />}
        {currentView === 'library' && <CloudLibraryView />}
        {currentView === 'author-profile' && <AuthorProfilePage />}
        {currentView === 'wishlist' && <WishlistView />}
        {currentView === 'reels' && <ReelsFeed />}
        {currentView === 'blog' && <BlogView />}
        {currentView === 'waitlist' && <WaitingListPage />}
      </main>

      {/* Global Amazon-Style Footer */}
      <footer className="bg-[#232f3e] text-slate-300 text-xs border-t border-slate-700 mt-auto">
        
        {/* Back to top banner */}
        <button
          id="back-to-top-btn"
          onClick={scrollToTop}
          aria-label={t('btn_back_to_top')}
          className="group w-full py-3 bg-[#37475a] hover:bg-[#485769] text-white font-medium text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <ChevronUp className="w-4 h-4 text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
          <span>{t('btn_back_to_top')}</span>
        </button>

        {/* 4 Footer Columns */}
        <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 leading-relaxed">
          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">
              {t('footer_get_to_know')}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => setCurrentView('store')} className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_about_books')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('reels')} className="text-pink-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <Film className="w-3 h-3" />
                  <span>{t('footer_reels_shorts')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('blog')} className="text-amber-400 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <Newspaper className="w-3 h-3" />
                  <span>{t('footer_blog')}</span>
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('waitlist')} className="text-amber-300 font-bold hover:underline cursor-pointer flex items-center gap-1">
                  <Tablet className="w-3 h-3 text-amber-400" />
                  <span>{t('footer_waitlist')}</span>
                </button>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_sovereign_pub')}
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_press')}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">
              {t('footer_creator_studio')}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <button onClick={() => setCurrentView('author-dashboard')} className="text-amber-400 font-bold hover:underline cursor-pointer">
                  {t('footer_dashboard_trends')}
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('publish')} className="text-slate-300 hover:text-white hover:underline cursor-pointer">
                  {t('footer_publish_direct')}
                </button>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_royalties')}
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_manuscript_program')}
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_videobook_prod')}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">
              {t('footer_core_formats')}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('format_ebook')} (EPUB3 & PDF)
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('format_audiobook')} (320kbps MP3/M4B)
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('format_videobook')} (4K HLS Streams)
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('format_manuscript')} (DOCX & Scans)
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">
              {t('footer_security_delivery')}
            </h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t('footer_cloudflare_s3')}</span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_signed_urls')}
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_stream_verify')}
                </span>
              </li>
              <li>
                <span className="hover:underline hover:text-white cursor-pointer">
                  {t('footer_support')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Amazon Best Sellers 3D Flipping Book Toolcard at Footnote */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pb-10">
          <AmazonBestSellerFlippingBookCard instanceId="footer" />
        </div>

        {/* Global Language Switcher Footer Strip */}
        <div className="border-t border-slate-700/60 py-4 bg-[#1a2432]/60">
          <div className="max-w-[1400px] mx-auto px-6 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 font-semibold mr-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>{t('language_label')}:</span>
            </div>
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isActive = currentLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  id={`footer-lang-${lang.code}`}
                  onClick={() => setLanguage(lang.code)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded transition cursor-pointer border text-[11px] ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-bold border-amber-300 shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border-slate-700'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#131921] py-6 border-t border-slate-800 text-center text-slate-400 text-xs px-4 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded bg-amber-400 flex items-center justify-center text-slate-950 font-black text-xs">
              <BookOpen className="w-3.5 h-3.5 text-slate-950" />
            </div>
            <span className="font-black text-white font-serif tracking-wider">
              JOHNNYBLUE1 BOOKS STORES
            </span>
            <span className="text-amber-400 font-bold">• KNOWLEDGE CENTA</span>
          </div>

          {/* Google AdSense & Publisher Compliance Links */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs pt-1">
            <button
              onClick={() => openLegal('privacy')}
              className="text-slate-400 hover:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
            >
              <Lock className="w-3 h-3 text-slate-500" />
              <span>Privacy Policy & DART Cookies</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <button
              onClick={() => openLegal('terms')}
              className="text-slate-400 hover:text-amber-400 hover:underline cursor-pointer"
            >
              Terms of Service
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <button
              onClick={() => openLegal('about')}
              className="text-slate-400 hover:text-amber-400 hover:underline cursor-pointer"
            >
              About Us & Editorial Standards
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <button
              onClick={() => openLegal('contact')}
              className="text-slate-400 hover:text-amber-400 hover:underline cursor-pointer"
            >
              Contact Us & Support
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <button
              onClick={() => openLegal('adsense-audit')}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>Google AdSense Approval Audit</span>
            </button>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <a
              href="/ads.txt"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-white hover:underline cursor-pointer font-mono text-[11px]"
            >
              ads.txt
            </a>
          </div>

          <p className="text-slate-500 text-[11px]">
            {t('footer_rights_reserved')}
          </p>
        </div>
      </footer>

      {/* Global Modals & Drawers */}
      <LookInsideModal />
      <CartDrawer />
      <SecurityApiInspectorModal />
      <FloatingWhatsAppButton />
      <FloatingBlogPenBubble />
      <BookSnowfallBackground />
      <CookieConsentBanner onOpenPrivacyPolicy={() => openLegal('privacy')} />
      <LegalPoliciesModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        initialTab={legalInitialTab}
      />
      <PageFlipSoundDialog
        forceOpen={soundDialogOpen}
        onClose={() => setSoundDialogOpen(false)}
      />
      {/* Floating Clickable Book-Shape Tab with Live 10-Second Auto-Flipping Amazon Best Sellers */}
      <AmazonBestSellerFlippingBookCard isFloating={true} instanceId="floating" />

    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
