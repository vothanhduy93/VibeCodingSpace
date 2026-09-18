import { useEffect } from 'react';
import { usePomodoroStore } from '@/stores/usePomodoroStore';

export function usePageTitleSync() {
  const { mode, status, timeLeft } = usePomodoroStore();

  useEffect(() => {
    const baseTitle = 'VibeSpace — Zen Focus Workspace';

    if (status === 'idle') {
      document.title = baseTitle;
      return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const modeEmoji = mode === 'focus' ? '🍅' : '☕';

    if (status === 'running') {
      document.title = `(${formatted}) ${modeEmoji} ${mode === 'focus' ? 'Focus' : 'Break'} • VibeSpace`;
      return;
    }

    if (status === 'paused') {
      document.title = `[Paused] (${formatted}) ${modeEmoji} • VibeSpace`;
      return;
    }

    if (status === 'completed') {
      let toggle = false;
      const flashInterval = setInterval(() => {
        document.title = toggle
          ? '🔔 Session Complete! • VibeSpace'
          : `🎉 Take a Breath! • VibeSpace`;
        toggle = !toggle;
      }, 1000);

      return () => {
        clearInterval(flashInterval);
        document.title = baseTitle;
      };
    }
  }, [mode, status, timeLeft]);
}
