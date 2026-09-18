/**
 * Singleton AudioContext Manager
 * Handles browser autoplay policy unlock on first user gesture.
 */
class AudioContextManager {
  private static instance: AudioContextManager;
  private ctx: AudioContext | null = null;
  private isUnlocked = false;

  private constructor() {
    this.setupUnlockListeners();
  }

  public static getInstance(): AudioContextManager {
    if (!AudioContextManager.instance) {
      AudioContextManager.instance = new AudioContextManager();
    }
    return AudioContextManager.instance;
  }

  public getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private setupUnlockListeners() {
    const unlock = () => {
      if (this.isUnlocked) return;
      const ctx = this.getContext();
      if (ctx.state === 'suspended') {
        ctx.resume().then(() => {
          this.isUnlocked = true;
          this.removeUnlockListeners(unlock);
        });
      } else {
        this.isUnlocked = true;
        this.removeUnlockListeners(unlock);
      }
    };

    ['click', 'touchstart', 'keydown'].forEach((event) => {
      window.addEventListener(event, unlock, { once: true, passive: true });
    });
  }

  private removeUnlockListeners(handler: () => void) {
    ['click', 'touchstart', 'keydown'].forEach((event) => {
      window.removeEventListener(event, handler);
    });
  }
}

export const audioContextManager = AudioContextManager.getInstance();
