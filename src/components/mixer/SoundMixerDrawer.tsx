import React from 'react';
import { Sliders, X, Volume2, VolumeX, Bell } from 'lucide-react';
import { GlassButton, GlassSlider } from '@/components/ui';
import { useSoundMixerStore } from '@/stores/useSoundMixerStore';
import { SoundSliderItem } from './SoundSliderItem';
import { SoundPresetsBar } from './SoundPresetsBar';

interface SoundMixerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundMixerDrawer: React.FC<SoundMixerDrawerProps> = ({ isOpen, onClose }) => {
  const {
    channels,
    masterVolume,
    isMuted,
    setMasterVolume,
    toggleMasterMute,
    muteAll,
    playChime,
  } = useSoundMixerStore();

  const activeCount = channels.filter((c) => c.enabled).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Container (Glass Tier 2) */}
      <div className="relative w-[420px] max-w-[90vw] h-full glass-tier2 border-l border-white/95 shadow-glass-panel flex flex-col justify-between p-6 z-10 animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-primary border border-purple-100 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-headline font-bold text-lg text-zen-slate">
                    Sound Mixer
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[11px] font-semibold">
                    {activeCount} Active
                  </span>
                </div>
                <p className="text-xs text-zen-muted mt-0.5">
                  Craft your tranquil soundscape
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <GlassButton
                variant="icon"
                size="icon"
                onClick={toggleMasterMute}
                title={isMuted ? 'Unmute' : 'Mute master audio'}
                aria-label="Toggle mute"
                className="text-zen-body"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-rose-500" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </GlassButton>

              <GlassButton
                variant="icon"
                size="icon"
                onClick={onClose}
                aria-label="Close sound mixer"
                className="text-zen-muted hover:text-zen-slate"
              >
                <X className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>

          {/* Presets Bar */}
          <SoundPresetsBar />
        </div>

        {/* Channels List */}
        <div className="flex-1 my-5 overflow-y-auto pr-1 flex flex-col gap-3">
          {channels.map((channel) => (
            <SoundSliderItem key={channel.id} channel={channel} />
          ))}
        </div>

        {/* Footer with Master Controls */}
        <div className="pt-4 border-t border-slate-200/70 flex flex-col gap-3.5">
          <GlassSlider
            label="Master Ambience Volume"
            value={masterVolume}
            min={0}
            max={100}
            step={1}
            disabled={isMuted}
            valueDisplay={isMuted ? 'Muted' : `${masterVolume}%`}
            onChange={setMasterVolume}
            accent="purple"
          />

          <div className="flex items-center justify-between gap-2">
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={muteAll}
              className="text-xs text-zen-muted hover:text-zen-slate"
            >
              Mute All Channels
            </GlassButton>

            <GlassButton
              variant="secondary"
              size="sm"
              onClick={playChime}
              className="text-xs flex items-center gap-1.5"
              title="Test Tibetan Chime Bell"
            >
              <Bell className="w-3.5 h-3.5 text-primary" />
              <span>Chime Bell</span>
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};
