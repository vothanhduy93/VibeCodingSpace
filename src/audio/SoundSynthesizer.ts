import { audioContextManager } from './AudioContextManager';

export interface SoundChannelState {
  id: string;
  name: string;
  volume: number; // 0 to 100
  enabled: boolean;
}

export class AmbientAudioEngine {
  private static instance: AmbientAudioEngine;
  private masterGain: GainNode | null = null;
  private channelGains: Map<string, GainNode> = new Map();
  private channelSources: Map<string, AudioNode> = new Map();
  private isMuted = false;
  private previousMasterVolume = 0.8;
  private isDucking = false;

  private constructor() {
    this.initMasterGain();
  }

  public static getInstance(): AmbientAudioEngine {
    if (!AmbientAudioEngine.instance) {
      AmbientAudioEngine.instance = new AmbientAudioEngine();
    }
    return AmbientAudioEngine.instance;
  }

  private initMasterGain() {
    const ctx = audioContextManager.getContext();
    this.masterGain = ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.8, ctx.currentTime);
    this.masterGain.connect(ctx.destination);
  }

  /**
   * Set Master Volume smoothly without pops/clicks
   */
  public setMasterVolume(vol: number) {
    const ctx = audioContextManager.getContext();
    if (!this.masterGain) this.initMasterGain();
    const target = Math.max(0, Math.min(1, vol / 100));

    if (!this.isMuted && this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.05);
    }
    this.previousMasterVolume = target;
  }

  /**
   * Toggle Master Mute smoothly
   */
  public setMasterMute(muted: boolean) {
    const ctx = audioContextManager.getContext();
    if (!this.masterGain) this.initMasterGain();
    this.isMuted = muted;

    if (this.masterGain) {
      const target = muted ? 0 : this.previousMasterVolume;
      this.masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 0.08);
    }
  }

  /**
   * Set individual channel volume smoothly
   */
  public setChannelVolume(channelId: string, volume: number, enabled: boolean) {
    const ctx = audioContextManager.getContext();
    let gainNode = this.channelGains.get(channelId);

    if (!gainNode) {
      gainNode = ctx.createGain();
      gainNode.connect(this.masterGain!);
      this.channelGains.set(channelId, gainNode);
      this.startGenerator(channelId, gainNode);
    }

    const targetGain = enabled ? (volume / 100) * 0.4 : 0;
    gainNode.gain.linearRampToValueAtTime(targetGain, ctx.currentTime + 0.05);
  }

  /**
   * Trigger Tibetan Singing Bowl / Chime Bell for Pomodoro completion
   */
  public playZenChime() {
    const ctx = audioContextManager.getContext();
    const now = ctx.currentTime;

    // Frequencies for a rich, harmonic Tibetan singing bowl
    const frequencies = [528, 1056, 1584, 2112];
    const gains = [0.3, 0.15, 0.08, 0.03];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gains[index], now + 0.03); // attack
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5); // long decay

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 3.6);
    });

    // Apply Audio Ducking: reduce master volume to 50% for 3 seconds
    this.applyAudioDucking();
  }

  /**
   * Audio Ducking: Drop ambient noise 50% during chime
   */
  public applyAudioDucking() {
    if (this.isDucking || this.isMuted || !this.masterGain) return;
    const ctx = audioContextManager.getContext();
    this.isDucking = true;

    const normalVol = this.previousMasterVolume;
    const duckedVol = normalVol * 0.35;

    this.masterGain.gain.linearRampToValueAtTime(duckedVol, ctx.currentTime + 0.1);

    setTimeout(() => {
      if (this.masterGain && !this.isMuted) {
        this.masterGain.gain.linearRampToValueAtTime(normalVol, ctx.currentTime + 0.5);
      }
      this.isDucking = false;
    }, 3200);
  }

  /**
   * DSP Procedural Noise Generators
   */
  private startGenerator(channelId: string, gainNode: GainNode) {
    const ctx = audioContextManager.getContext();

    switch (channelId) {
      case 'rain': {
        // Pink noise with gentle lowpass
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.969 * b2 + white * 0.153852;
          b3 = 0.8665 * b3 + white * 0.3104856;
          b4 = 0.55 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.016898;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(850, ctx.currentTime);

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        whiteNoise.start();
        this.channelSources.set(channelId, whiteNoise);
        break;
      }

      case 'campfire': {
        // Low rumble + randomized crackle
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Brown noise
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 2.5;
          // Occasional spark crackle
          if (Math.random() < 0.0003) {
            output[i] += (Math.random() - 0.5) * 2;
          }
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start();
        this.channelSources.set(channelId, source);
        break;
      }

      case 'wind': {
        // Bandpass modulated noise with slow LFO
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);

        // LFO to sway wind frequency
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.2, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(180, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        source.connect(filter);
        filter.connect(gainNode);
        source.start();
        this.channelSources.set(channelId, source);
        break;
      }

      case 'ocean': {
        // Pink noise with wave swell envelope
        const bufferSize = 4 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.18;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        // Slow 0.12Hz swell
        const swellLfo = ctx.createOscillator();
        swellLfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        const swellGain = ctx.createGain();
        swellGain.gain.setValueAtTime(150, ctx.currentTime);

        swellLfo.connect(swellGain);
        swellGain.connect(filter.frequency);
        swellLfo.start();

        source.connect(filter);
        filter.connect(gainNode);
        source.start();
        this.channelSources.set(channelId, source);
        break;
      }

      case 'coffee': {
        // Soft room rumble and murmur resonance
        const bufferSize = 2 * ctx.sampleRate;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          output[i] = (Math.random() * 2 - 1) * 0.08;
        }

        const source = ctx.createBufferSource();
        source.buffer = noiseBuffer;
        source.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(250, ctx.currentTime);
        filter.Q.setValueAtTime(1.2, ctx.currentTime);

        source.connect(filter);
        filter.connect(gainNode);
        source.start();
        this.channelSources.set(channelId, source);
        break;
      }
    }
  }
}

export const ambientAudioEngine = AmbientAudioEngine.getInstance();
