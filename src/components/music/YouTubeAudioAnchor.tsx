import React, { useEffect, useRef } from 'react';
import { useYouTubeStore } from '@/stores/useYouTubeStore';

export const YouTubeAudioAnchor: React.FC = () => {
  const { currentTrack, isPlaying, volume, isMuted, displayMode } = useYouTubeStore();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Send postMessage commands to YouTube Iframe API for play/pause/volume
  useEffect(() => {
    if (!iframeRef.current || !iframeRef.current.contentWindow) return;

    try {
      const targetWindow = iframeRef.current.contentWindow;
      const command = isPlaying ? 'playVideo' : 'pauseVideo';

      targetWindow.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );

      const targetVol = isMuted ? 0 : volume;
      targetWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'setVolume', args: [targetVol] }),
        '*'
      );
    } catch {
      // Cross-origin message safety
    }
  }, [isPlaying, volume, isMuted]);

  // Construct embed URL
  const embedUrl = `https://www.youtube.com/embed/${currentTrack.videoId}?enablejsapi=1&autoplay=${
    isPlaying ? 1 : 0
  }&controls=1&modestbranding=1&rel=0&origin=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.origin : ''
  )}`;

  // If in miniVideo mode, the video is rendered inside the floating card.
  // Otherwise, we keep this invisible anchor to keep audio playing.
  if (displayMode === 'miniVideo') {
    return null;
  }

  return (
    <div
      id="youtube-headless-anchor"
      style={{
        position: 'fixed',
        width: '1px',
        height: '1px',
        opacity: 0.001,
        pointerEvents: 'none',
        zIndex: -1,
        bottom: 0,
        left: 0,
      }}
      aria-hidden="true"
    >
      <iframe
        ref={iframeRef}
        key={currentTrack.videoId}
        src={embedUrl}
        title="YouTube Audio Stream"
        allow="autoplay; encrypted-media"
        className="w-full h-full border-0"
      />
    </div>
  );
};
