import React, { useState } from 'react';
import { X, Sparkles, Mail, CheckCircle2, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTranslation } from '@/stores/useLanguageStore';
import { syncEngine } from '@/services/syncEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { loginWithGoogle, requestMagicLink, verifyMagicLink, authError, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicLinkData, setMagicLinkData] = useState<{ token?: string; verifyUrl?: string } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleMockLogin = async () => {
    setIsSubmitting(true);
    clearError();
    const mockEmail = email.trim() || 'user@vibespace.dev';
    const success = await loginWithGoogle({
      email: mockEmail,
      name: mockEmail.split('@')[0],
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${mockEmail}`,
    });

    setIsSubmitting(false);
    if (success) {
      setSuccessMessage(t.auth.loginSuccess);
      await syncEngine.mergeLocal();
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 1000);
    }
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    clearError();
    const result = await requestMagicLink(email.trim());
    setIsSubmitting(false);

    if (result.success) {
      setMagicLinkData({ token: result.token, verifyUrl: result.verifyUrl });
    }
  };

  const handleVerifyInstantToken = async () => {
    if (!magicLinkData?.token) return;
    setIsSubmitting(true);
    const success = await verifyMagicLink(magicLinkData.token);
    setIsSubmitting(false);

    if (success) {
      setSuccessMessage(t.auth.loginSuccess);
      await syncEngine.mergeLocal();
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
        setMagicLinkData(null);
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/25 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl border border-white/80 rounded-3xl p-7 shadow-2xl shadow-purple-900/10 text-zen-slate animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zen-muted hover:text-zen-slate hover:bg-slate-100/80 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-purple-100/90 text-primary flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-headline font-extrabold text-lg text-zen-slate tracking-tight">
              {t.auth.welcomeBack}
            </h2>
            <p className="text-xs text-zen-muted">{t.auth.subtitle}</p>
          </div>
        </div>

        {/* Guest Mode Indicator Notice */}
        <div className="my-4 px-3.5 py-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-2.5 text-xs text-amber-800">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">{t.auth.guestModeActive}:</span> {t.auth.guestModeDesc}
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium animate-fade-in">
            {authError}
          </div>
        )}

        {/* Magic Link Sent State */}
        {magicLinkData ? (
          <div className="space-y-4 py-2">
            <div className="text-center p-4 rounded-2xl bg-purple-50/80 border border-purple-100">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-200/70 text-purple-700 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-zen-slate">{t.auth.magicLinkSent}</h3>
              <p className="text-xs text-zen-muted mt-1">{t.auth.magicLinkSentDesc}</p>
            </div>

            <button
              onClick={handleVerifyInstantToken}
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-2xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              <span>{t.auth.instantLoginButton}</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Google OAuth Button */}
            <button
              onClick={handleGoogleMockLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-2xl bg-white border border-slate-200/90 text-zen-slate font-bold text-xs flex items-center justify-center gap-3 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{t.auth.googleSignIn}</span>
            </button>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200/80"></div>
              <span className="shrink mx-3 text-[10px] font-bold text-zen-muted uppercase tracking-wider">
                {t.auth.orMagicLink}
              </span>
              <div className="flex-grow border-t border-slate-200/80"></div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zen-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.auth.emailPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs text-zen-slate placeholder:text-zen-muted focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-2xl bg-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-purple-500/20 hover:bg-primary-hover active:scale-[0.98] transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>{t.auth.sendMagicLink}</span>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
