import { create } from 'zustand';

export type YouTubeDisplayMode = 'pill' | 'miniVideo' | 'hidden';

export interface YouTubeTrack {
  title: string;
  artist: string;
  url: string;
  videoId: string;
}

export const CURATED_TRACKS: YouTubeTrack[] = [
  {
    title: 'Lofi Hip Hop Radio - Beats to Relax/Study',
    artist: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    videoId: 'jfKfPfyJRdk',
  },
  {
    title: 'Synthwave Radio - Chill synth / retro beats',
    artist: 'Lofi Girl',
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    videoId: '4xDzrJKXOOY',
  },
  {
    title: 'Peaceful Japanese Garden Water Ambience',
    artist: 'Zen Meditation',
    url: 'https://www.youtube.com/watch?v=lTRiuFIWV54',
    videoId: 'lTRiuFIWV54',
  },
];

export function parseYouTubeUrl(url: string): { videoId: string | null; playlistId: string | null } {
  if (!url) return { videoId: null, playlistId: null };

  let videoId: string | null = null;
  let playlistId: string | null = null;

  // Playlist parser
  const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  if (playlistMatch) {
    playlistId = playlistMatch[1];
  }

  // Video ID parser: youtu.be, shorts, embed, watch?v=
  const videoMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([\w-]{11})/
  );
  if (videoMatch) {
    videoId = videoMatch[1];
  }

  return { videoId, playlistId };
}

interface YouTubeState {
  currentTrack: YouTubeTrack;
  isPlaying: boolean;
  volume: number; // 0 to 100
  isMuted: boolean;
  displayMode: YouTubeDisplayMode;
  cardPosition: { x: number; y: number };

  // Actions
  setTrackUrl: (url: string, title?: string, artist?: string) => void;
  togglePlay: () => void;
  setIsPlaying: (playing: boolean) => void;
  setVolume: (vol: number) => void;
  toggleMute: () => void;
  setDisplayMode: (mode: YouTubeDisplayMode) => void;
  setCardPosition: (pos: { x: number; y: number }) => void;
}

const STORAGE_KEY = 'vibespace_v1_youtube';

function loadStoredYouTube() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error('Failed to load YouTube state', e);
  }
  return null;
}

const saved = loadStoredYouTube();

export const useYouTubeStore = create<YouTubeState>((set, get) => ({
  currentTrack: saved?.currentTrack || CURATED_TRACKS[0],
  isPlaying: false,
  volume: saved?.volume !== undefined ? saved.volume : 70,
  isMuted: saved?.isMuted || false,
  displayMode: saved?.displayMode || 'pill',
  cardPosition: saved?.cardPosition || { x: 24, y: 80 },

  setTrackUrl: (url: string, title?: string, artist?: string) => {
    const { videoId } = parseYouTubeUrl(url);
    if (videoId) {
      const newTrack: YouTubeTrack = {
        title: title || 'Custom YouTube Stream',
        artist: artist || 'YouTube Audio',
        url,
        videoId,
      };
      set({ currentTrack: newTrack, isPlaying: true });
      saveState(get());
    }
  },

  togglePlay: () => {
    const next = !get().isPlaying;
    set({ isPlaying: next });
  },

  setIsPlaying: (playing: boolean) => {
    set({ isPlaying: playing });
  },

  setVolume: (vol: number) => {
    set({ volume: vol });
    saveState(get());
  },

  toggleMute: () => {
    set({ isMuted: !get().isMuted });
    saveState(get());
  },

  setDisplayMode: (mode: YouTubeDisplayMode) => {
    set({ displayMode: mode });
    saveState(get());
  },

  setCardPosition: (pos: { x: number; y: number }) => {
    set({ cardPosition: pos });
    saveState(get());
  },
}));

function saveState(state: YouTubeState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentTrack: state.currentTrack,
        volume: state.volume,
        isMuted: state.isMuted,
        displayMode: state.displayMode,
        cardPosition: state.cardPosition,
      })
    );
  } catch (e) {
    console.error('Failed to save YouTube state to localStorage', e);
  }
}
