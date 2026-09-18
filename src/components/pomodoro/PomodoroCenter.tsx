import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings, Sparkles } from 'lucide-react';
import { usePomodoroStore } from '@/stores/usePomodoroStore';
import { PomodoroProgressRing } from './PomodoroProgressRing';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';
import { GlassButton } from '@/components/ui';

export const PomodoroCenter: React.FC = () => {
  const {
    mode,
    status,
    timeLeft,
    totalDuration,
    currentSession,
    start,
    pause,
    reset,
    skip,
    tick,
  } = usePomodoroStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 1-second interval ticker when running
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (status === 'running') {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [status, tick]);

  // Format MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Progress fraction (0 to 1)
  const progress = totalDuration > 0 ? (totalDuration - timeLeft) / totalDuration : 0;

  const modeBadges = {
    focus: {
      text: 'Focus Session • Deep Work',
      className: 'bg-purple-100/90 text-purple-700 border-purple-200/60',
      dotColor: 'bg-purple-600',
    },
    shortBreak: {
      text: 'Short Break • Rest & Breathe',
      className: 'bg-sky-100/90 text-sky-700 border-sky-200/60',
      dotColor: 'bg-sky-600',
    },
    longBreak: {
      text: 'Long Break • Deep Recharge',
      className: 'bg-emerald-100/90 text-emerald-700 border-emerald-200/60',
      dotColor: 'bg-emerald-600',
    },
  };

  return (
    <>
      <div className="glass-tier2 rounded-[32px] p-8 sm:p-10 shadow-glass-panel border border-white/95 max-w-[460px] w-full mx-auto text-center flex flex-col items-center gap-6 select-none relative transition-all duration-300">
        {/* Settings gear trigger button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute top-5 right-5 p-2 text-zen-muted hover:text-zen-slate rounded-full hover:bg-white/80 transition-colors cursor-pointer"
          title="Pomodoro Preferences"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Mode Status Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold border shadow-xs ${modeBadges[mode].className}`}
        >
          <span
            className={`w-2 h-2 rounded-full ${modeBadges[mode].dotColor} ${
              status === 'running' ? 'animate-ping' : ''
            }`}
          />
          <span>{modeBadges[mode].text}</span>
        </div>

        {/* Circular Progress Ring & Time Digits */}
        <PomodoroProgressRing progress={progress} size={230} strokeWidth={8}>
          <div className="flex flex-col items-center">
            <span className="font-headline font-extrabold text-5xl sm:text-6xl text-zen-slate tracking-tight tabular-nums drop-shadow-xs">
              {formattedTime}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-widest font-semibold text-zen-muted mt-2">
              Session {currentSession} of 4
            </span>
          </div>
        </PomodoroProgressRing>

        {/* 4 Session Progress Dots */}
        <div className="flex items-center gap-2.5">
          {[1, 2, 3, 4].map((s) => {
            const isFilled = s < currentSession;
            const isCurrent = s === currentSession;
            return (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isCurrent
                    ? 'w-6 bg-primary shadow-xs shadow-primary/30'
                    : isFilled
                    ? 'w-2.5 bg-purple-400'
                    : 'w-2 bg-slate-200'
                }`}
                title={`Interval ${s}`}
              />
            );
          })}
        </div>

        {/* Controls Row */}
        <div className="flex items-center gap-3.5">
          {/* Secondary Reset Button */}
          <GlassButton
            variant="secondary"
            size="icon"
            onClick={reset}
            title="Reset interval"
            aria-label="Reset interval"
            className="w-11 h-11"
          >
            <RotateCcw className="w-4 h-4 text-zen-body" />
          </GlassButton>

          {/* Primary Play / Pause CTA */}
          <GlassButton
            variant="primary"
            size="lg"
            onClick={status === 'running' ? pause : start}
            glow
            className="px-8 py-3 text-sm font-semibold shadow-purple-glow"
          >
            {status === 'running' ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white ml-0.5" />
                <span>Start Focus</span>
              </>
            )}
          </GlassButton>

          {/* Secondary Skip Button */}
          <GlassButton
            variant="secondary"
            size="icon"
            onClick={skip}
            title="Skip session"
            aria-label="Skip session"
            className="w-11 h-11"
          >
            <SkipForward className="w-4 h-4 text-zen-body" />
          </GlassButton>
        </div>

        {/* Zen Inspirational Quote */}
        <div className="flex items-center gap-1.5 text-[11px] text-zen-muted font-body">
          <Sparkles className="w-3 h-3 text-primary/70" />
          <span>&ldquo;Quiet the mind, and the soul will speak.&rdquo;</span>
        </div>
      </div>

      {/* Settings Modal */}
      <PomodoroSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
