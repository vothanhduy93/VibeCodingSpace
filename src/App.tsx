import { useState, useCallback } from 'react';
import { BackgroundCanvas, BackgroundPickerModal } from '@/components/background';
import { PomodoroCenter } from '@/components/pomodoro';
import { SoundMixerDrawer } from '@/components/mixer';
import { TodoDrawer } from '@/components/todo';
import { YouTubeAudioAnchor, YouTubePlayerPill, YouTubeMiniVideoCard } from '@/components/music';
import { TopBarClock, FloatingDock, KeyboardShortcutsModal } from '@/components/dock';
import { useDailyRollover } from '@/hooks/useDailyRollover';
import { usePageTitleSync } from '@/hooks/usePageTitleSync';
import { useGlobalHotkeys } from '@/hooks/useGlobalHotkeys';
import { useAutoIdleHide } from '@/hooks/useAutoIdleHide';

export default function App() {
  // Drawers & Modals state
  const [isSoundMixerOpen, setIsSoundMixerOpen] = useState(false);
  const [isTodoOpen, setIsTodoOpen] = useState(false);
  const [isWallpaperOpen, setIsWallpaperOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  const isAnyPanelOpen = isSoundMixerOpen || isTodoOpen || isWallpaperOpen || isShortcutsOpen;

  // 1. Timezone Daily Rollover Watchdog
  useDailyRollover();

  // 2. Document Title Sync with Pomodoro Ticker
  usePageTitleSync();

  // 3. Auto-Idle Inactivity Watchdog (5s Auto-Hide)
  const { isIdle, isFullscreen, toggleFullscreen, handleActivity } = useAutoIdleHide({
    timeoutMs: 5000,
    disabled: isAnyPanelOpen,
  });

  // Hotkey action handlers
  const toggleTodoDrawer = useCallback(() => {
    setIsTodoOpen((prev) => !prev);
    setIsSoundMixerOpen(false);
  }, []);

  const toggleSoundMixerDrawer = useCallback(() => {
    setIsSoundMixerOpen((prev) => !prev);
    setIsTodoOpen(false);
  }, []);

  const toggleWallpaperModal = useCallback(() => {
    setIsWallpaperOpen((prev) => !prev);
  }, []);

  const toggleShortcutsModal = useCallback(() => {
    setIsShortcutsOpen((prev) => !prev);
  }, []);

  const closeAllPanels = useCallback(() => {
    setIsSoundMixerOpen(false);
    setIsTodoOpen(false);
    setIsWallpaperOpen(false);
    setIsShortcutsOpen(false);
  }, []);

  // 4. Global Hotkeys Hook (Space, M, F, T, S, P, R, ?, Esc)
  useGlobalHotkeys({
    toggleTodoDrawer,
    toggleSoundMixerDrawer,
    toggleWallpaperModal,
    toggleShortcutsModal,
    closeAllPanels,
    toggleFullscreen,
  });

  return (
    <div
      onMouseMove={handleActivity}
      onClick={handleActivity}
      className="relative w-screen h-screen overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic Background Canvas with Blur & Overlay Filter */}
      <BackgroundCanvas />

      {/* Headless YouTube Background Audio Anchor */}
      <YouTubeAudioAnchor />

      {/* Top Bar (Auto-Fades out on 5s idle) */}
      <div
        className={`relative z-30 transition-opacity duration-500 ${
          isIdle && !isAnyPanelOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <TopBarClock
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>

      {/* Main Center Stage: Pomodoro Timer Widget */}
      <main className="flex-1 flex items-center justify-center p-4 z-20">
        <PomodoroCenter />
      </main>

      {/* Draggable Mini-Video Floating Card (When in video mode) */}
      <YouTubeMiniVideoCard />

      {/* Floating Audio Pill & Bottom Dock Row (Auto-Fades out on 5s idle) */}
      <div
        className={`fixed bottom-6 left-0 right-0 z-30 flex flex-col items-center gap-3 pointer-events-none transition-opacity duration-500 ${
          isIdle && !isAnyPanelOpen ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {/* Floating Audio Pill (Positioned right above dock) */}
        <div className="pointer-events-auto">
          <YouTubePlayerPill />
        </div>

        {/* Bottom Centered Floating Dock */}
        <div className="pointer-events-auto">
          <FloatingDock
            onToggleSoundMixer={toggleSoundMixerDrawer}
            onToggleTodo={toggleTodoDrawer}
            onToggleWallpaper={toggleWallpaperModal}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            isSoundMixerOpen={isSoundMixerOpen}
            isTodoOpen={isTodoOpen}
            isWallpaperOpen={isWallpaperOpen}
          />
        </div>
      </div>

      {/* Drawers & Modals */}
      <SoundMixerDrawer
        isOpen={isSoundMixerOpen}
        onClose={() => setIsSoundMixerOpen(false)}
      />

      <TodoDrawer
        isOpen={isTodoOpen}
        onClose={() => setIsTodoOpen(false)}
      />

      <BackgroundPickerModal
        isOpen={isWallpaperOpen}
        onClose={() => setIsWallpaperOpen(false)}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
}
