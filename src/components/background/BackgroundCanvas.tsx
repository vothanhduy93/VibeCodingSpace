import React from 'react';
import { useBackgroundStore } from '@/stores/useBackgroundStore';

export const BackgroundCanvas: React.FC = () => {
  const { currentWallpaper, customUrl, overlayOpacity, blurAmount, vignette } = useBackgroundStore();

  const activeUrl = customUrl || currentWallpaper.url;
  const isVideo = currentWallpaper.type === 'video' || (customUrl && /\.(mp4|webm)$/i.test(customUrl));

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 select-none">
      {/* Background Media with Filter */}
      <div
        className="absolute inset-0 w-full h-full transition-all duration-700 ease-out transform scale-105"
        style={{
          filter: `blur(${blurAmount}px)`,
        }}
      >
        {isVideo ? (
          <video
            key={activeUrl}
            src={activeUrl}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            key={activeUrl}
            src={activeUrl}
            alt={currentWallpaper.name}
            className="w-full h-full object-cover transition-opacity duration-500"
            loading="eager"
          />
        )}
      </div>

      {/* Daylight Ambient Overlay (Soft White / Dimmer) */}
      <div
        className="absolute inset-0 transition-colors duration-300 pointer-events-none"
        style={{
          backgroundColor: `rgba(248, 250, 252, ${overlayOpacity / 100})`,
        }}
      />

      {/* Subtle Vignette Gradient for Depth */}
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at center, transparent 50%, rgba(15, 23, 42, 0.08) 100%)',
          }}
        />
      )}
    </div>
  );
};
