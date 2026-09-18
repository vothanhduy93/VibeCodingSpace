import React from 'react';
import { Music, Sliders, CheckSquare, Image, Maximize2, Minimize2 } from 'lucide-react';
import { Tooltip } from '@/components/ui';
import { useSoundMixerStore } from '@/stores/useSoundMixerStore';
import { useTodoStore } from '@/stores/useTodoStore';
import { useYouTubeStore } from '@/stores/useYouTubeStore';

interface FloatingDockProps {
  onToggleSoundMixer: () => void;
  onToggleTodo: () => void;
  onToggleWallpaper: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  isSoundMixerOpen: boolean;
  isTodoOpen: boolean;
  isWallpaperOpen: boolean;
}

export const FloatingDock: React.FC<FloatingDockProps> = ({
  onToggleSoundMixer,
  onToggleTodo,
  onToggleWallpaper,
  isFullscreen,
  onToggleFullscreen,
  isSoundMixerOpen,
  isTodoOpen,
  isWallpaperOpen,
}) => {
  const { channels } = useSoundMixerStore();
  const { todos } = useTodoStore();
  const { displayMode, setDisplayMode } = useYouTubeStore();

  const activeSoundCount = channels.filter((c) => c.enabled).length;
  const pendingTaskCount = todos.filter((t) => !t.isCompleted).length;

  const handleToggleMusic = () => {
    if (displayMode === 'hidden') {
      setDisplayMode('pill');
    } else if (displayMode === 'pill') {
      setDisplayMode('miniVideo');
    } else {
      setDisplayMode('pill');
    }
  };

  return (
    <nav
      aria-label="Floating Workspace Dock"
      className="glass-tier1 rounded-full px-4 sm:px-6 py-2.5 shadow-glass-dock border border-white/95 flex items-center gap-2 sm:gap-3 select-none transition-all duration-300 hover:shadow-2xl"
    >
      {/* 1. Music Button */}
      <Tooltip content="Lofi Music Player" position="top">
        <button
          onClick={handleToggleMusic}
          className={`relative p-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
            displayMode !== 'hidden'
              ? 'bg-purple-100 text-primary shadow-xs ring-1 ring-purple-300'
              : 'text-zen-body hover:bg-white/90 hover:text-zen-slate'
          }`}
          aria-label="Toggle YouTube music player"
        >
          <Music className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* 2. Sound Mixer Button */}
      <Tooltip content="Ambient Sound Mixer (P)" position="top">
        <button
          onClick={onToggleSoundMixer}
          className={`relative p-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
            isSoundMixerOpen || activeSoundCount > 0
              ? 'bg-purple-100 text-primary shadow-xs ring-1 ring-purple-300'
              : 'text-zen-body hover:bg-white/90 hover:text-zen-slate'
          }`}
          aria-label="Open ambient sound mixer"
        >
          <Sliders className="w-4 h-4" />
          {activeSoundCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {activeSoundCount}
            </span>
          )}
        </button>
      </Tooltip>

      {/* 3. Daily Tasks Button */}
      <Tooltip content="Daily Focus Tasks (T)" position="top">
        <button
          onClick={onToggleTodo}
          className={`relative p-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
            isTodoOpen
              ? 'bg-purple-100 text-primary shadow-xs ring-1 ring-purple-300'
              : 'text-zen-body hover:bg-white/90 hover:text-zen-slate'
          }`}
          aria-label="Open daily task list"
        >
          <CheckSquare className="w-4 h-4" />
          {pendingTaskCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {pendingTaskCount}
            </span>
          )}
        </button>
      </Tooltip>

      <div className="w-[1px] h-6 bg-slate-200/80 mx-1" />

      {/* 4. Wallpaper Switcher Button */}
      <Tooltip content="Canvas & Atmosphere (W)" position="top">
        <button
          onClick={onToggleWallpaper}
          className={`relative p-3 rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
            isWallpaperOpen
              ? 'bg-purple-100 text-primary shadow-xs ring-1 ring-purple-300'
              : 'text-zen-body hover:bg-white/90 hover:text-zen-slate'
          }`}
          aria-label="Change wallpaper background"
        >
          <Image className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* 5. Fullscreen Toggle */}
      <Tooltip content={isFullscreen ? 'Exit Fullscreen (F)' : 'Zen Fullscreen (F)'} position="top">
        <button
          onClick={onToggleFullscreen}
          className="p-3 rounded-full text-zen-body hover:bg-white/90 hover:text-zen-slate transition-all duration-200 cursor-pointer active:scale-95"
          aria-label="Toggle Fullscreen mode"
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4 text-primary" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
      </Tooltip>
    </nav>
  );
};
