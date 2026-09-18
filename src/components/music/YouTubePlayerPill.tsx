import React from 'react';
import { Play, Pause, Maximize2, Disc3 } from 'lucide-react';
import { useYouTubeStore } from '@/stores/useYouTubeStore';

export const YouTubePlayerPill: React.FC = () => {
  const { currentTrack, isPlaying, displayMode, togglePlay, setDisplayMode } = useYouTubeStore();

  if (displayMode !== 'pill') return null;

  return (
    <div className="glass-tier2 rounded-full px-4 py-2 shadow-glass-dock border border-white/95 flex items-center gap-3 select-none transition-all duration-300 hover:shadow-lg animate-in fade-in slide-in-from-bottom-2">
      {/* Spinning Disc or Icon */}
      <div
        className={`w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-primary transition-transform ${
          isPlaying ? 'animate-spin-slow' : ''
        }`}
      >
        <Disc3 className="w-4 h-4" />
      </div>

      {/* Animated Equalizer Sound Bars */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-3.5" title="Playing">
          <span className="w-1 bg-primary rounded-full animate-[bounce_1s_infinite_100ms] h-2" />
          <span className="w-1 bg-sky-500 rounded-full animate-[bounce_1.2s_infinite_300ms] h-3.5" />
          <span className="w-1 bg-primary rounded-full animate-[bounce_0.8s_infinite_200ms] h-2.5" />
          <span className="w-1 bg-sky-500 rounded-full animate-[bounce_1.1s_infinite_400ms] h-1.5" />
        </div>
      )}

      {/* Track Info */}
      <div className="flex flex-col min-w-[130px] max-w-[200px]">
        <span className="text-xs font-semibold text-zen-slate truncate" title={currentTrack.title}>
          {currentTrack.title}
        </span>
        <span className="text-[10px] text-zen-muted truncate">
          {currentTrack.artist}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-primary text-white hover:bg-primary-hover shadow-xs cursor-pointer active:scale-95 transition-transform"
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? (
            <Pause className="w-3.5 h-3.5 fill-white" />
          ) : (
            <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
          )}
        </button>

        {/* Expand to Video Window Button */}
        <button
          onClick={() => setDisplayMode('miniVideo')}
          className="p-1.5 rounded-full text-zen-muted hover:text-zen-slate hover:bg-white/80 cursor-pointer transition-colors"
          title="Expand to Mini-Video"
          aria-label="Expand to Mini-Video"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
