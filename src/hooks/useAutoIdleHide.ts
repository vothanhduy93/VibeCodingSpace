import { useState, useEffect, useCallback } from 'react';

interface UseAutoIdleHideOptions {
  timeoutMs?: number; // default 5000ms
  disabled?: boolean; // e.g. when a modal or drawer is open
}

export function useAutoIdleHide({ timeoutMs = 5000, disabled = false }: UseAutoIdleHideOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleActivity = useCallback(() => {
    setIsIdle(false);
  }, []);

  useEffect(() => {
    if (disabled) {
      setIsIdle(false);
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const resetTimer = () => {
      setIsIdle(false);
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsIdle(true);
      }, timeoutMs);
    };

    // Initial timeout
    resetTimer();

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [timeoutMs, disabled]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return { isIdle, isFullscreen, toggleFullscreen, handleActivity };
}
