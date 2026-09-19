import React, { useState, useEffect } from 'react';
import { Sparkles, Command, Maximize2, Minimize2, Globe, BarChart2, Cloud, CheckCircle2, Loader2, User, LogOut } from 'lucide-react';
import { Tooltip } from '@/components/ui';
import { useTranslation } from '@/stores/useLanguageStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { syncEngine } from '@/services/syncEngine';

interface TopBarClockProps {
  onOpenShortcuts: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenAuth: () => void;
  onOpenAnalytics: () => void;
}

export const TopBarClock: React.FC<TopBarClockProps> = ({
  onOpenShortcuts,
  isFullscreen,
  onToggleFullscreen,
  onOpenAuth,
  onOpenAnalytics,
}) => {
  const { t, language, toggleLanguage } = useTranslation();
  const { user, isAuthenticated, isSyncing, lastSyncedAt, logout } = useAuthStore();
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const locale = language === 'vi' ? 'vi-VN' : 'en-US';
      setTimeString(
        now.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
      );
      setDateString(
        now.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [language]);

  const handleManualSync = async () => {
    await syncEngine.pushCurrentState();
    await syncEngine.pull();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-30 px-6 py-3.5 flex items-center justify-between select-none">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="glass-tier1 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50 animate-pulse" />
          <span className="font-headline font-extrabold text-sm text-zen-slate tracking-tight">
            VibeSpace
          </span>
          <span className="px-1.5 py-0.2 rounded-md bg-purple-100 text-purple-700 font-mono text-[9px] font-bold uppercase tracking-wider">
            ZEN
          </span>
        </div>
      </div>

      {/* Center Live Clock */}
      <div className="glass-tier1 px-5 py-1.5 rounded-2xl flex items-center gap-2.5 shadow-sm text-xs">
        <span className="font-headline font-bold text-zen-slate text-sm tabular-nums">
          {timeString}
        </span>
        <span className="text-zen-muted text-xs font-medium">·</span>
        <span className="text-zen-body font-medium">{dateString}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Focus Analytics Button */}
        <Tooltip content={t.analytics.title} position="bottom">
          <button
            onClick={onOpenAnalytics}
            className="glass-tier1 px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs text-zen-body hover:text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Open Focus Analytics"
          >
            <BarChart2 className="w-3.5 h-3.5 text-emerald-600" />
            <span className="font-semibold text-[11px] text-zen-slate hidden md:inline">
              {t.analytics.title}
            </span>
          </button>
        </Tooltip>

        {/* User Profile / Cloud Sync Indicator */}
        {isAuthenticated && user ? (
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="glass-tier1 px-2.5 py-1.5 rounded-2xl flex items-center gap-2 text-xs text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
              aria-label="User profile and sync"
            >
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || user.email} className="w-5 h-5 rounded-full border border-purple-300" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center font-bold text-[10px]">
                  {user.email[0].toUpperCase()}
                </div>
              )}
              <span className="font-semibold text-[11px] max-w-[90px] truncate hidden sm:inline">
                {user.name || user.email.split('@')[0]}
              </span>

              {/* Sync status indicator icon */}
              {isSyncing ? (
                <Loader2 className="w-3 h-3 text-purple-600 animate-spin" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs shadow-emerald-500/50" />
              )}
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-52 bg-white/95 backdrop-blur-xl border border-white/80 rounded-2xl p-2 shadow-xl text-xs z-50 animate-fade-in"
                onMouseLeave={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="font-bold text-zen-slate truncate">{user.name || 'User'}</p>
                  <p className="text-[10px] text-zen-muted truncate">{user.email}</p>
                  {lastSyncedAt && (
                    <p className="text-[9px] text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>{t.auth.synced} {lastSyncedAt}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleManualSync();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-zen-slate hover:bg-purple-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Cloud className="w-3.5 h-3.5 text-primary" />
                  <span>{t.auth.syncNow}</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t.auth.signOut}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Tooltip content={t.auth.subtitle} position="bottom">
            <button
              onClick={onOpenAuth}
              className="glass-tier1 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs text-primary font-bold hover:bg-white hover:shadow-md transition-all cursor-pointer"
              aria-label="Sign In to Cloud Sync"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.auth.signIn}</span>
            </button>
          </Tooltip>
        )}

        {/* Language Switcher */}
        <Tooltip content={t.topBar.switchLangTooltip} position="bottom">
          <button
            onClick={toggleLanguage}
            className="glass-tier1 px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs text-zen-body hover:text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="font-bold text-[11px] text-primary">
              {language === 'vi' ? 'VI' : 'EN'}
            </span>
          </button>
        </Tooltip>

        {/* Shortcuts Trigger */}
        <Tooltip content={`${t.topBar.shortcuts} (${t.topBar.shortcutsKey})`} position="bottom">
          <button
            onClick={onOpenShortcuts}
            className="glass-tier1 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs text-zen-body hover:text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Open keyboard shortcuts"
          >
            <Command className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium hidden sm:inline">{t.topBar.shortcuts}</span>
            <kbd className="keycap text-[10px] text-primary px-1.5 py-0.5 rounded ml-0.5">?</kbd>
          </button>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip content={isFullscreen ? t.common.exitFullscreen : t.topBar.zenMode} position="bottom">
          <button
            onClick={onToggleFullscreen}
            className="glass-tier1 p-2 rounded-2xl text-zen-body hover:text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4 text-primary" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </Tooltip>

        {/* User Zen Flow Badge */}
        <div className="glass-tier1 px-3 py-1.5 rounded-2xl hidden lg:flex items-center gap-2 shadow-sm text-xs font-semibold text-purple-800">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>{t.topBar.flowMode}</span>
        </div>
      </div>
    </header>
  );
};
