import { describe, it, expect, beforeEach } from 'vitest';
import { useSoundMixerStore } from '../stores/useSoundMixerStore';

describe('useSoundMixerStore (5-Channel DSP Ambient Mixer)', () => {
  beforeEach(() => {
    // Reset to default
    useSoundMixerStore.setState({
      channels: [
        { id: 'rain', name: 'Rain', iconName: 'CloudRain', volume: 60, enabled: false, accent: 'cyan' },
        { id: 'campfire', name: 'Campfire', iconName: 'Flame', volume: 40, enabled: false, accent: 'amber' },
        { id: 'wind', name: 'Wind', iconName: 'Wind', volume: 25, enabled: false, accent: 'emerald' },
        { id: 'ocean', name: 'Ocean', iconName: 'Waves', volume: 30, enabled: false, accent: 'cyan' },
        { id: 'coffee', name: 'Coffee', iconName: 'Coffee', volume: 35, enabled: false, accent: 'purple' },
      ],
      masterVolume: 80,
      isMuted: false,
      activePresetId: null,
    });
  });

  it('should initialize with 5 channels, 80 master volume, and unmuted state', () => {
    const state = useSoundMixerStore.getState();
    expect(state.channels).toHaveLength(5);
    expect(state.masterVolume).toBe(80);
    expect(state.isMuted).toBe(false);
  });

  it('should adjust channel volume', () => {
    useSoundMixerStore.getState().setChannelVolume('rain', 75);
    const rainChannel = useSoundMixerStore.getState().channels.find((c) => c.id === 'rain');
    expect(rainChannel?.volume).toBe(75);
  });

  it('should toggle channel active state', () => {
    useSoundMixerStore.getState().toggleChannel('rain');
    let rainChannel = useSoundMixerStore.getState().channels.find((c) => c.id === 'rain');
    expect(rainChannel?.enabled).toBe(true);

    useSoundMixerStore.getState().toggleChannel('rain');
    rainChannel = useSoundMixerStore.getState().channels.find((c) => c.id === 'rain');
    expect(rainChannel?.enabled).toBe(false);
  });

  it('should adjust master volume', () => {
    useSoundMixerStore.getState().setMasterVolume(50);
    expect(useSoundMixerStore.getState().masterVolume).toBe(50);
  });

  it('should toggle master mute', () => {
    useSoundMixerStore.getState().toggleMasterMute();
    expect(useSoundMixerStore.getState().isMuted).toBe(true);

    useSoundMixerStore.getState().toggleMasterMute();
    expect(useSoundMixerStore.getState().isMuted).toBe(false);
  });

  it('should apply preset correctly and activate configured channels', () => {
    // Apply 'rainy-cafe' (rain: 60, coffee: 35)
    useSoundMixerStore.getState().applyPreset('rainy-cafe');
    const { channels, activePresetId } = useSoundMixerStore.getState();

    expect(activePresetId).toBe('rainy-cafe');

    const rain = channels.find((c) => c.id === 'rain');
    const coffee = channels.find((c) => c.id === 'coffee');
    const campfire = channels.find((c) => c.id === 'campfire');

    expect(rain?.enabled).toBe(true);
    expect(rain?.volume).toBe(60);

    expect(coffee?.enabled).toBe(true);
    expect(coffee?.volume).toBe(35);

    expect(campfire?.enabled).toBe(false);
  });

  it('should mute all channels when muteAll() is called', () => {
    useSoundMixerStore.getState().applyPreset('rainy-cafe');
    expect(useSoundMixerStore.getState().channels.some((c) => c.enabled)).toBe(true);

    useSoundMixerStore.getState().muteAll();
    const { channels, activePresetId } = useSoundMixerStore.getState();
    expect(channels.every((c) => !c.enabled)).toBe(true);
    expect(activePresetId).toBeNull();
  });
});
