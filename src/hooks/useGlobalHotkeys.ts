import { useEffect } from 'react';
import { usePomodoroStore } from '@/stores/usePomodoroStore';
import { useSoundMixerStore } from '@/stores/useSoundMixerStore';

interface GlobalHotkeysActions {
  toggleTodoDrawer: () => void;
  toggleSoundMixerDrawer: () => void;
  toggleWallpaperModal: () => void;
  toggleShortcutsModal: () => void;
  closeAllPanels: () => void;
  toggleFullscreen: () => void;
}

export function useGlobalHotkeys(actions: GlobalHotkeysActions) {
  const { status, start, pause, reset, skip } = usePomodoroStore();
  const { toggleMasterMute } = useSoundMixerStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore hotkeys when typing in input, textarea or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (status === 'running') {
            pause();
          } else {
            start();
          }
          break;

        case 'r':
        case 'R':
          e.preventDefault();
          reset();
          break;

        case 's':
        case 'S':
          e.preventDefault();
          skip();
          break;

        case 'm':
        case 'M':
          e.preventDefault();
          toggleMasterMute();
          break;

        case 'p':
        case 'P':
          e.preventDefault();
          actions.toggleSoundMixerDrawer();
          break;

        case 'w':
        case 'W':
          e.preventDefault();
          actions.toggleWallpaperModal();
          break;

        case 't':
        case 'T':
          e.preventDefault();
          actions.toggleTodoDrawer();
          break;

        case 'f':
        case 'F':
          e.preventDefault();
          actions.toggleFullscreen();
          break;

        case '?':
          e.preventDefault();
          actions.toggleShortcutsModal();
          break;

        case 'Escape':
          e.preventDefault();
          actions.closeAllPanels();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, start, pause, reset, skip, toggleMasterMute, actions]);
}
