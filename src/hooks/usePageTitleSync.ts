import { useEffect } from 'react';
import { usePomodoroStore } from '@/stores/usePomodoroStore';
import { useTranslation } from '@/stores/useLanguageStore';

export function usePageTitleSync() {
  const { mode, status, timeLeft } = usePomodoroStore();
  const { t, isVietnamese } = useTranslation();

  useEffect(() => {
    const baseTitle = isVietnamese
      ? 'VibeSpace — Không Gian Tập Trung Zen'
      : 'VibeSpace — Zen Focus Workspace';

    if (status === 'idle') {
      document.title = baseTitle;
      return;
    }

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const modeEmoji = mode === 'focus' ? '🍅' : '☕';

    const modeLabel =
      mode === 'focus'
        ? t.pageTitle.focus
        : mode === 'shortBreak'
        ? t.pageTitle.shortBreak
        : t.pageTitle.longBreak;

    if (status === 'running') {
      document.title = `(${formatted}) ${modeEmoji} ${modeLabel} • VibeSpace`;
      return;
    }

    if (status === 'paused') {
      document.title = `[${t.pageTitle.paused}] (${formatted}) ${modeEmoji} • VibeSpace`;
      return;
    }

    if (status === 'completed') {
      let toggle = false;
      const flashInterval = setInterval(() => {
        document.title = toggle ? t.pageTitle.completedAlert : t.pageTitle.breatheAlert;
        toggle = !toggle;
      }, 1000);

      return () => {
        clearInterval(flashInterval);
        document.title = baseTitle;
      };
    }
  }, [mode, status, timeLeft, isVietnamese, t]);
}
