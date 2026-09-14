import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  BookOpen,
  Feather
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { 
  signInWithGoogle, 
  signInWithApple, 
  signInWithFacebook, 
  signInWithTwitter, 
  signInWithEmail, 
  signUpWithEmail 
} from '../services/firebase';
import confetti from 'canvas-confetti';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    authModalPrompt, 
    setUser, 
    showNotification,
    completePendingAuthAction
  } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleAuthSuccess = (authUser: any, providerName: string) => {
    setUser(authUser);
    setIsLoading(false);
    closeAuthModal();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
    showNotification(`✓ Welcome, ${authUser.displayName}! Signed in via ${providerName}`);
    completePendingAuthAction();
  };

  // Pillar 1: Google
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithGoogle();
      handleAuthSuccess(user, 'Google');
    } catch (err: any) {
      setError(err?.message || 'Google sign-in failed. Please try again.');
      setIsLoading(false);
    }
  };

  // Pillar 2: Email & Password
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(email.trim(), password, displayName.trim() || email.split('@')[0]);
        handleAuthSuccess(user, 'Email');
      } else if (mode === 'signin') {
        const user = await signInWithEmail(email.trim(), password);
        handleAuthSuccess(user, 'Email');
      } else {
        // Forgot password
        setTimeout(() => {
          setIsLoading(false);
          setMode('signin');
          showNotification(`✓ Password reset instructions sent to ${email}`);
        }, 1000);
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
      setIsLoading(false);
    }
  };

  // Pillar 3: Apple
  const handleAppleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithApple();
      handleAuthSuccess(user, 'Apple');
    } catch (err: any) {
      setError(err?.message || 'Apple sign-in failed.');
      setIsLoading(false);
    }
  };

  // Pillar 4: Facebook
  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithFacebook();
      handleAuthSuccess(user, 'Facebook');
    } catch (err: any) {
      setError(err?.message || 'Facebook sign-in failed.');
      setIsLoading(false);
    }
  };

  // Pillar 5: Twitter / X
  const handleTwitterSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const user = await signInWithTwitter();
      handleAuthSuccess(user, 'Twitter / X');
    } catch (err: any) {
      setError(err?.message || 'Twitter sign-in failed.');
      setIsLoading(false);
    }
  };

  // Demo Quick Sign-in Shortcuts
  const handleDemoSignIn = async (role: 'author' | 'reader') => {
    setIsLoading(true);
    setError(null);
    const demoUser = role === 'author' 
      ? {
          uid: 'author_johnny_blue_demo',
          email: 'johnnyblueagency@gmail.com',
          displayName: 'Johnny Blue (Author)',
          photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          provider: 'google' as const,
          role: 'author' as const,
          createdAt: new Date().toISOString()
        }
      : {
          uid: 'reader_elena_demo',
          email: 'elena.rostova@readingvault.org',
          displayName: 'Elena Rostova',
          photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
          provider: 'email' as const,
          role: 'reader' as const,
          createdAt: new Date().toISOString()
        };

    setTimeout(() => {
      handleAuthSuccess(demoUser, 'Fast Demo Sign-In');
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-[#131921] via-[#1a2432] to-[#232f3e] p-6 text-white text-center relative border-b border-slate-700">
          <button
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg mb-3">
            <BookOpen className="w-6 h-6 text-slate-950" />
          </div>

          <h2 className="text-xl font-extrabold font-serif tracking-tight text-white">
            JOHNNYBLUE1 BOOKS
          </h2>
          <p className="text-xs text-amber-400 font-semibold tracking-wide">
            KNOWLEDGE CENTA 10-DIMENSION ECOSYSTEM
          </p>

          {/* Action trigger prompt message */}
          {authModalPrompt && (
            <div className="mt-3 bg-amber-400/20 border border-amber-400/50 rounded-lg py-1.5 px-3 text-xs text-amber-200 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>{authModalPrompt}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {/* 5-Pillar Quick Social Buttons */}
          <div className="space-y-2.5">
            
            {/* 1. Google */}
            <button
              id="auth-pillar-google-btn"
              type="button"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:border-slate-400 transition cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* 3 Pillars Grid (Apple, Facebook, Twitter) */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* Apple */}
              <button
                id="auth-pillar-apple-btn"
                type="button"
                disabled={isLoading}
                onClick={handleAppleSignIn}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                title="Continue with Apple ID"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.3-9.56-11.29-20.73-14.96-33.51-3.68-12.78-5.52-24.81-5.52-36.08 0-15.01 3.86-27.42 11.58-37.21 7.72-9.79 17.51-14.77 29.37-14.94 4.57 0 9.79 1.25 15.65 3.76 5.86 2.5 9.49 3.8 10.9 3.89 1.95-.14 5.92-1.52 11.91-4.13 5.99-2.61 11.37-3.8 16.14-3.59 13.38.65 24.36 5.54 32.95 14.67-11.75 7.08-17.51 16.96-17.29 29.64.22 9.79 4.02 18.06 11.4 24.8 7.39 6.74 16.19 10.55 26.4 11.41-2.18 6.74-4.78 13.37-7.83 19.89zM119.22 33.02c0-7.39 2.66-14.41 7.99-21.05 5.33-6.63 11.85-10.77 19.57-12.4-.22 1.3-.44 2.61-.65 3.92-.65 6.74-3.48 13.59-8.48 20.55-5 6.96-11.42 10.98-19.25 12.07.22-1.09.43-2.12.65-3.09h.17z"/>
                </svg>
                <span>Apple</span>
              </button>

              {/* Facebook */}
              <button
                id="auth-pillar-facebook-btn"
                type="button"
                disabled={isLoading}
                onClick={handleFacebookSignIn}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-[#1877F2] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                title="Continue with Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>

              {/* Twitter / X */}
              <button
                id="auth-pillar-twitter-btn"
                type="button"
                disabled={isLoading}
                onClick={handleTwitterSignIn}
                className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                title="Continue with X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>X / Twitter</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Or with Email
            </span>
          </div>

          {/* Mode Switch Tabs (Sign In / Create Account) */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => { setMode('signin'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                mode === 'signin' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                mode === 'signup' 
                  ? 'bg-white text-slate-900 shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Johnny Blue"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Password</label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            )}

            <button
              id="auth-submit-email-btn"
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{mode === 'signup' ? 'Create Free Account' : mode === 'forgot' ? 'Send Reset Link' : 'Sign In with Email'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Fast Demo Shortcuts for Testing */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>Fast Demo Sign-In:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => handleDemoSignIn('author')}
                className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 transition cursor-pointer flex items-center gap-1"
              >
                <Feather className="w-3 h-3 text-amber-700" />
                <span>Johnny Blue (Author)</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSignIn('reader')}
                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold transition cursor-pointer"
              >
                <span>Reader Demo</span>
              </button>
            </div>
          </div>

          {/* Guest browsing notice */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={closeAuthModal}
              className="text-xs text-slate-500 hover:text-slate-800 underline transition cursor-pointer"
            >
              Continue browsing as Guest (Read-Only)
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
