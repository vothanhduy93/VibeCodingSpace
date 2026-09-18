import React, { useState, useRef } from 'react';
import { GripHorizontal, Minimize2, X, Volume2, VolumeX, Plus, Radio } from 'lucide-react';
import { GlassSlider, GlassButton } from '@/components/ui';
import { useYouTubeStore, CURATED_TRACKS } from '@/stores/useYouTubeStore';

export const YouTubeMiniVideoCard: React.FC = () => {
  const {
    currentTrack,
    volume,
    isMuted,
    displayMode,
    cardPosition,
    setTrackUrl,
    setVolume,
    toggleMute,
    setDisplayMode,
    setCardPosition,
  } = useYouTubeStore();

  const [inputUrl, setInputUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Position defaults to top right if not positioned
  const position = cardPosition || { x: window.innerWidth - 420, y: 80 };

  // Pointer Events Dragging Implementation (Dual Engine: Mouse + Touch)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only drag from header handle
    if ((e.target as HTMLElement).closest('button, input')) return;

    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);

    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    let newX = e.clientX - dragOffsetRef.current.x;
    let newY = e.clientY - dragOffsetRef.current.y;

    // Viewport containment
    const maxX = Math.max(0, window.innerWidth - 410);
    const maxY = Math.max(0, window.innerHeight - 360);

    newX = Math.max(10, Math.min(newX, maxX));
    newY = Math.max(10, Math.min(newY, maxY));

    setCardPosition({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Safe pointer release
      }
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setTrackUrl(inputUrl.trim());
      setInputUrl('');
    }
  };

  // Embed URL
  const embedUrl = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&autoplay=1&controls=1&modestbranding=1&rel=0`;

  if (displayMode !== 'miniVideo') return null;

  return (
    <div
      ref={cardRef}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        touchAction: 'none',
      }}
      className={`fixed top-0 left-0 w-[380px] max-w-[95vw] glass-tier2 rounded-2xl border border-white/95 shadow-glass-panel flex flex-col gap-3 p-4 select-none z-50 transition-shadow ${
        isDragging ? 'shadow-2xl ring-2 ring-primary/40 cursor-grabbing' : 'shadow-xl'
      }`}
    >
      {/* Header / Drag Handle */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="flex items-center justify-between cursor-grab pb-2 border-b border-slate-200/60"
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-4 h-4 text-zen-muted" />
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            LIVE
          </span>
          <span className="text-xs font-bold text-zen-slate truncate max-w-[170px]">
            {currentTrack.title}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Minimize to Audio Pill */}
          <button
            onClick={() => setDisplayMode('pill')}
            className="p-1 text-zen-muted hover:text-zen-slate rounded-lg hover:bg-white/80 cursor-pointer"
            title="Minimize to Pill"
            aria-label="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>

          {/* Close Player */}
          <button
            onClick={() => setDisplayMode('hidden')}
            className="p-1 text-zen-muted hover:text-zen-slate rounded-lg hover:bg-white/80 cursor-pointer"
            title="Close Player"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 16:9 Video Frame */}
      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-slate-900 shadow-inner">
        <iframe
          key={currentTrack.videoId}
          src={embedUrl}
          title={currentTrack.title}
          allow="autoplay; encrypted-media"
          className="w-full h-full border-0"
        />
      </div>

      {/* Volume & Preset Quick Select */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            className="p-1 text-zen-muted hover:text-zen-slate cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          <div className="flex-1">
            <GlassSlider
              value={volume}
              min={0}
              max={100}
              step={1}
              disabled={isMuted}
              onChange={setVolume}
              accent="purple"
            />
          </div>
        </div>

        {/* Curated Stream Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CURATED_TRACKS.map((track) => (
            <button
              key={track.videoId}
              onClick={() => setTrackUrl(track.url, track.title, track.artist)}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                currentTrack.videoId === track.videoId
                  ? 'bg-primary text-white'
                  : 'bg-white/80 text-zen-body hover:bg-white border border-slate-200/60'
              }`}
            >
              {track.artist}
            </button>
          ))}
        </div>

        {/* Custom YouTube URL Input */}
        <form onSubmit={handleCustomUrlSubmit} className="flex gap-1.5 mt-1">
          <input
            type="url"
            placeholder="Paste YouTube link / playlist..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="flex-1 text-[11px] px-3 py-1.5 rounded-xl bg-white border border-slate-200/80 text-zen-slate placeholder:text-zen-subtle focus:outline-none focus:border-primary"
          />
          <GlassButton type="submit" size="sm" variant="primary" className="text-xs px-3">
            <Plus className="w-3.5 h-3.5" />
          </GlassButton>
        </form>
      </div>
    </div>
  );
};
