import React from 'react';
import { SOUND_PRESETS, useSoundMixerStore } from '@/stores/useSoundMixerStore';
import { useTranslation } from '@/stores/useLanguageStore';

export const SoundPresetsBar: React.FC = () => {
  const { t } = useTranslation();
  const { activePresetId, applyPreset } = useSoundMixerStore();

  const getPresetName = (id: string, defaultName: string) => {
    switch (id) {
      case 'rainy-cafe':
        return t.mixer.presets.rainyCafe;
      case 'deep-forest':
        return t.mixer.presets.mistyForest;
      case 'nordic-morning':
        return t.mixer.presets.nordicMorning;
      case 'ocean-zen':
        return t.mixer.presets.oceanZen;
      default:
        return defaultName;
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-[11px] font-bold uppercase tracking-wider text-zen-muted">
        {t.mixer.presetsTitle}
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
              {getPresetName(preset.id, preset.name)}
            </button>
          );
        })}
      </div>
    </div>
  );
};
