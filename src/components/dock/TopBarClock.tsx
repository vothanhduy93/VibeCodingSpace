import React, { useState, useEffect } from 'react';
import { Sparkles, Command, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip } from '@/components/ui';

interface TopBarClockProps {
  onOpenShortcuts: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export const TopBarClock: React.FC<TopBarClockProps> = ({
  onOpenShortcuts,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [timeString, setTimeString] = useState('');
  const [dateString, setDateString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
      setDateString(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

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
        {/* Shortcuts Trigger */}
        <Tooltip content="Keyboard Shortcuts (?)" position="bottom">
          <button
            onClick={onOpenShortcuts}
            className="glass-tier1 px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs text-zen-body hover:text-zen-slate hover:bg-white transition-all shadow-sm cursor-pointer"
            aria-label="Open keyboard shortcuts"
          >
            <Command className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium hidden sm:inline">Shortcuts</span>
            <kbd className="keycap text-[10px] text-primary px-1.5 py-0.5 rounded ml-0.5">?</kbd>
          </button>
        </Tooltip>

        {/* Fullscreen Toggle */}
        <Tooltip content={isFullscreen ? 'Exit Fullscreen (F)' : 'Zen Fullscreen (F)'} position="bottom">
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
        <div className="glass-tier1 px-3 py-1.5 rounded-2xl hidden md:flex items-center gap-2 shadow-sm text-xs font-semibold text-purple-800">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span>Flow Mode</span>
        </div>
      </div>
    </header>
  );
};
