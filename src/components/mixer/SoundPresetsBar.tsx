import React from 'react';
import { SOUND_PRESETS, useSoundMixerStore } from '@/stores/useSoundMixerStore';

export const SoundPresetsBar: React.FC = () => {
  const { activePresetId, applyPreset } = useSoundMixerStore();

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zen-muted">
        Mood Presets
      </h4>
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {SOUND_PRESETS.map((preset) => {
          const isActive = activePresetId === preset.id;
          return (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/40'
                  : 'bg-white/80 text-zen-body hover:bg-white border border-slate-200/60 hover:border-slate-300'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
