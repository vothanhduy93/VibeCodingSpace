import React from 'react';
import { CloudRain, Flame, Wind, Waves, Coffee, Volume2, VolumeX } from 'lucide-react';
import { GlassSlider } from '@/components/ui';
import { SoundChannel, useSoundMixerStore } from '@/stores/useSoundMixerStore';

interface SoundSliderItemProps {
  channel: SoundChannel;
}

const ICONS: Record<string, React.ReactNode> = {
  CloudRain: <CloudRain className="w-4 h-4 text-sky-500" />,
  Flame: <Flame className="w-4 h-4 text-amber-500" />,
  Wind: <Wind className="w-4 h-4 text-emerald-500" />,
  Waves: <Waves className="w-4 h-4 text-cyan-500" />,
  Coffee: <Coffee className="w-4 h-4 text-purple-500" />,
};

export const SoundSliderItem: React.FC<SoundSliderItemProps> = ({ channel }) => {
  const { setChannelVolume, toggleChannel } = useSoundMixerStore();

  return (
    <div
      className={`glass-tier3 p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-3 ${
        channel.enabled
          ? 'border-purple-200/80 bg-white/95 shadow-sm ring-1 ring-purple-400/20'
          : 'border-slate-200/70 hover:border-slate-300 bg-white/70'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
            {ICONS[channel.iconName] || <Volume2 className="w-4 h-4 text-zen-muted" />}
          </div>
          <span className="text-xs font-semibold text-zen-slate">{channel.name}</span>
        </div>

        {/* Toggle Switch */}
        <button
          onClick={() => toggleChannel(channel.id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
            channel.enabled
              ? 'bg-primary text-white shadow-xs'
              : 'bg-slate-100 text-zen-muted hover:text-zen-slate'
          }`}
          aria-label={`Toggle ${channel.name}`}
        >
          {channel.enabled ? (
            <>
              <Volume2 className="w-3 h-3" />
              <span>ON</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3" />
              <span>OFF</span>
            </>
          )}
        </button>
      </div>

      {/* Volume Slider */}
      <GlassSlider
        value={channel.volume}
        min={0}
        max={100}
        step={1}
        disabled={!channel.enabled}
        valueDisplay={channel.enabled ? `${channel.volume}%` : 'Off'}
        onChange={(vol) => setChannelVolume(channel.id, vol)}
        accent={channel.accent}
        className={channel.enabled ? 'opacity-100' : 'opacity-40'}
      />
    </div>
  );
};
