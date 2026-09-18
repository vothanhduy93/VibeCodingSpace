import { create } from 'zustand';

export interface WallpaperPreset {
  id: string;
  name: string;
  category: 'nature' | 'minimal' | 'lofi' | 'rain' | 'cozy';
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  badge?: string;
}

export const DEFAULT_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'kyoto-morning',
    name: 'Kyoto Morning Mountains',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=70',
    badge: '4K Morning',
  },
  {
    id: 'nordic-study',
    name: 'Nordic Sunlit Study',
    category: 'minimal',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=70',
    badge: 'HD Daylight',
  },
  {
    id: 'tokyo-daylight-rain',
    name: 'Tokyo Daylight Rain',
    category: 'rain',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=400&q=70',
    badge: '4K Rain',
  },
  {
    id: 'zen-garden',
    name: 'Serene Zen Garden',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=400&q=70',
    badge: 'HD Zen',
  },
  {
    id: 'cozy-teahouse',
    name: 'Cozy Teahouse Dawn',
    category: 'cozy',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=400&q=70',
    badge: '4K Dawn',
  },
  {
    id: 'misty-forest',
    name: 'Alpine Sunlit Forest',
    category: 'nature',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=2560&q=85',
    thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=70',
    badge: 'HD Alpine',
  }
];

interface BackgroundState {
  currentWallpaper: WallpaperPreset;
  customUrl: string | null;
  overlayOpacity: number; // 0 to 70%
  blurAmount: number; // 0 to 20px
  vignette: boolean;

  // Actions
  setWallpaper: (wallpaper: WallpaperPreset) => void;
  setCustomUrl: (url: string) => void;
  setOverlayOpacity: (opacity: number) => void;
  setBlurAmount: (blur: number) => void;
  setVignette: (enabled: boolean) => void;
  resetDefaults: () => void;
}

const STORAGE_KEY = 'vibespace_v1_background';

function loadStoredBackground() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load background state from localStorage', e);
  }
  return null;
}

const initialSaved = loadStoredBackground();

export const useBackgroundStore = create<BackgroundState>((set, get) => ({
  currentWallpaper: initialSaved?.currentWallpaper || DEFAULT_WALLPAPERS[0],
  customUrl: initialSaved?.customUrl || null,
  overlayOpacity: initialSaved?.overlayOpacity !== undefined ? initialSaved.overlayOpacity : 15,
  blurAmount: initialSaved?.blurAmount !== undefined ? initialSaved.blurAmount : 4,
  vignette: initialSaved?.vignette !== undefined ? initialSaved.vignette : true,

  setWallpaper: (wallpaper) => {
    set({ currentWallpaper: wallpaper, customUrl: null });
    saveState(get());
  },

  setCustomUrl: (url) => {
    set({ customUrl: url });
    saveState(get());
  },

  setOverlayOpacity: (opacity) => {
    set({ overlayOpacity: opacity });
    saveState(get());
  },

  setBlurAmount: (blur) => {
    set({ blurAmount: blur });
    saveState(get());
  },

  setVignette: (enabled) => {
    set({ vignette: enabled });
    saveState(get());
  },

  resetDefaults: () => {
    set({
      currentWallpaper: DEFAULT_WALLPAPERS[0],
      customUrl: null,
      overlayOpacity: 15,
      blurAmount: 4,
      vignette: true,
    });
    saveState(get());
  },
}));

function saveState(state: BackgroundState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentWallpaper: state.currentWallpaper,
        customUrl: state.customUrl,
        overlayOpacity: state.overlayOpacity,
        blurAmount: state.blurAmount,
        vignette: state.vignette,
      })
    );
  } catch (e) {
    console.error('Failed to save background state to localStorage', e);
  }
}
