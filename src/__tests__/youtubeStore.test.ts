import { describe, it, expect, beforeEach } from 'vitest';
import { useYouTubeStore, parseYouTubeUrl, CURATED_TRACKS } from '../stores/useYouTubeStore';

describe('useYouTubeStore & URL Parsing Engine', () => {
  beforeEach(() => {
    useYouTubeStore.setState({
      currentTrack: CURATED_TRACKS[0],
      isPlaying: false,
      volume: 70,
      isMuted: false,
      displayMode: 'pill',
      cardPosition: { x: 24, y: 80 },
    });
  });

  describe('parseYouTubeUrl Regex Engine', () => {
    it('should parse standard youtube watch URLs', () => {
      const res = parseYouTubeUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk');
      expect(res.videoId).toBe('jfKfPfyJRdk');
      expect(res.playlistId).toBeNull();
    });

    it('should parse short youtu.be URLs', () => {
      const res = parseYouTubeUrl('https://youtu.be/4xDzrJKXOOY');
      expect(res.videoId).toBe('4xDzrJKXOOY');
    });

    it('should parse youtube shorts URLs', () => {
      const res = parseYouTubeUrl('https://www.youtube.com/shorts/lTRiuFIWV54');
      expect(res.videoId).toBe('lTRiuFIWV54');
    });

    it('should parse youtube live URLs', () => {
      const res = parseYouTubeUrl('https://www.youtube.com/live/jfKfPfyJRdk');
      expect(res.videoId).toBe('jfKfPfyJRdk');
    });

    it('should extract both videoId and playlistId when present', () => {
      const res = parseYouTubeUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk&list=PL1234567890abcdef');
      expect(res.videoId).toBe('jfKfPfyJRdk');
      expect(res.playlistId).toBe('PL1234567890abcdef');
    });

    it('should return nulls for invalid non-youtube URLs', () => {
      const res = parseYouTubeUrl('https://spotify.com/track/123456');
      expect(res.videoId).toBeNull();
      expect(res.playlistId).toBeNull();
    });
  });

  describe('Store Actions', () => {
    it('should set custom track when valid URL is provided', () => {
      useYouTubeStore.getState().setTrackUrl(
        'https://www.youtube.com/watch?v=4xDzrJKXOOY',
        'Custom Synthwave',
        'Retro Artist'
      );

      const track = useYouTubeStore.getState().currentTrack;
      expect(track.videoId).toBe('4xDzrJKXOOY');
      expect(track.title).toBe('Custom Synthwave');
      expect(track.artist).toBe('Retro Artist');
    });

    it('should toggle play/pause state', () => {
      expect(useYouTubeStore.getState().isPlaying).toBe(false);

      useYouTubeStore.getState().togglePlay();
      expect(useYouTubeStore.getState().isPlaying).toBe(true);

      useYouTubeStore.getState().togglePlay();
      expect(useYouTubeStore.getState().isPlaying).toBe(false);
    });

    it('should switch display modes between pill and miniVideo', () => {
      useYouTubeStore.getState().setDisplayMode('miniVideo');
      expect(useYouTubeStore.getState().displayMode).toBe('miniVideo');

      useYouTubeStore.getState().setDisplayMode('pill');
      expect(useYouTubeStore.getState().displayMode).toBe('pill');
    });

    it('should update card position on drag', () => {
      useYouTubeStore.getState().setCardPosition({ x: 120, y: 250 });
      expect(useYouTubeStore.getState().cardPosition).toEqual({ x: 120, y: 250 });
    });

    it('should handle volume and mute toggles', () => {
      useYouTubeStore.getState().setVolume(85);
      expect(useYouTubeStore.getState().volume).toBe(85);

      useYouTubeStore.getState().toggleMute();
      expect(useYouTubeStore.getState().isMuted).toBe(true);
    });
  });
});
