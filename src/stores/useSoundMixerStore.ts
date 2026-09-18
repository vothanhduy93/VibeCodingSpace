import { create } from 'zustand';
import { ambientAudioEngine } from '@/audio/SoundSynthesizer';

export interface SoundChannel {
  id: string;
  name: string;
  iconName: string;
  volume: number; // 0 to 100
  enabled: boolean;
  accent: 'cyan' | 'amber' | 'emerald' | 'purple';
}

export interface SoundPreset {
  id: string;
  name: string;
  channels: Record<string, number>; // channelId -> volume
}

export const SOUND_PRESETS: SoundPreset[] = [
  {
    id: 'rainy-cafe',
    name: 'Rainy Cafe',
    channels: { rain: 60, coffee: 35 },
  },
  {
    id: 'deep-forest',
    name: 'Misty Forest',
    channels: { wind: 40, campfire: 30 },
  },
  {
    id: 'nordic-morning',
    name: 'Nordic Morning',
    channels: { wind: 30, rain: 25 },
  },
  {
    id: 'ocean-zen',
    name: 'Ocean Zen',
    channels: { ocean: 55, wind: 20 },
  },
];

interface SoundMixerState {
  channels: SoundChannel[];
  masterVolume: number;
  isMuted: boolean;
  activePresetId: string | null;

  // Actions
  setChannelVolume: (id: string, volume: number) => void;
  toggleChannel: (id: string) => void;
  setMasterVolume: (vol: number) => void;
  toggleMasterMute: () => void;
  applyPreset: (presetId: string) => void;
  muteAll: () => void;
  playChime: () => void;
}

const STORAGE_KEY = 'vibespace_v1_sound_mixer';

const INITIAL_CHANNELS: SoundChannel[] = [
  {
    id: 'rain',
    name: 'Rain & Gentle Thunder',
    iconName: 'CloudRain',
    volume: 60,
    enabled: false,
    accent: 'cyan',
  },
  {
    id: 'campfire',
    name: 'Cozy Campfire',
    iconName: 'Flame',
    volume: 40,
    enabled: false,
    accent: 'amber',
  },
  {
    id: 'wind',
    name: 'Pine Forest Wind',
    iconName: 'Wind',
    volume: 25,
    enabled: false,
    accent: 'emerald',
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    iconName: 'Waves',
    volume: 30,
    enabled: false,
    accent: 'cyan',
  },
  {
    id: 'coffee',
    name: 'Coffee Shop Atmosphere',
    iconName: 'Coffee',
    volume: 35,
    enabled: false,
    accent: 'purple',
  },
];

function loadStoredMixer() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load sound mixer state', e);
  }
  return null;
}

const saved = loadStoredMixer();

export const useSoundMixerStore = create<SoundMixerState>((set, get) => ({
  channels: saved?.channels || INITIAL_CHANNELS,
  masterVolume: saved?.masterVolume !== undefined ? saved.masterVolume : 80,
  isMuted: saved?.isMuted || false,
  activePresetId: saved?.activePresetId || null,

  setChannelVolume: (id: string, volume: number) => {
    const channels = get().channels.map((ch) =>
      ch.id === id ? { ...ch, volume } : ch
    );
    set({ channels, activePresetId: null });

    const target = channels.find((c) => c.id === id);
    if (target) {
      ambientAudioEngine.setChannelVolume(id, volume, target.enabled);
    }
    saveMixerState(get());
  },

  toggleChannel: (id: string) => {
    const channels = get().channels.map((ch) =>
      ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
    );
    set({ channels, activePresetId: null });

    const target = channels.find((c) => c.id === id);
    if (target) {
      ambientAudioEngine.setChannelVolume(id, target.volume, target.enabled);
    }
    saveMixerState(get());
  },

  setMasterVolume: (vol: number) => {
    set({ masterVolume: vol });
    ambientAudioEngine.setMasterVolume(vol);
    saveMixerState(get());
  },

  toggleMasterMute: () => {
    const nextMuted = !get().isMuted;
    set({ isMuted: nextMuted });
    ambientAudioEngine.setMasterMute(nextMuted);
    saveMixerState(get());
  },

  muteAll: () => {
    const channels = get().channels.map((ch) => ({ ...ch, enabled: false }));
    set({ channels, activePresetId: null });
    channels.forEach((ch) => {
      ambientAudioEngine.setChannelVolume(ch.id, ch.volume, false);
    });
    saveMixerState(get());
  },

  applyPreset: (presetId: string) => {
    const preset = SOUND_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const channels = get().channels.map((ch) => {
      const presetVol = preset.channels[ch.id];
      if (presetVol !== undefined) {
        return { ...ch, volume: presetVol, enabled: true };
      }
      return { ...ch, enabled: false };
    });

    set({ channels, activePresetId: presetId });

    channels.forEach((ch) => {
      ambientAudioEngine.setChannelVolume(ch.id, ch.volume, ch.enabled);
    });
    saveMixerState(get());
  },

  playChime: () => {
    ambientAudioEngine.playZenChime();
  },
}));

function saveMixerState(state: SoundMixerState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        channels: state.channels,
        masterVolume: state.masterVolume,
        isMuted: state.isMuted,
        activePresetId: state.activePresetId,
      })
    );
  } catch (e) {
    console.error('Failed to save mixer state to localStorage', e);
  }
}
