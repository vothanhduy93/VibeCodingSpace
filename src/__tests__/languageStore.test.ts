import { describe, it, expect, beforeEach } from 'vitest';
import { useLanguageStore } from '../stores/useLanguageStore';
import { vi } from '../locales/vi';
import { en } from '../locales/en';

describe('useLanguageStore & i18n System', () => {
  beforeEach(() => {
    localStorage.clear();
    useLanguageStore.setState({ language: 'vi' });
  });

  it('should default to Vietnamese (vi) for new users', () => {
    const state = useLanguageStore.getState();
    expect(state.language).toBe('vi');
    expect(vi.common.save).toBe('Lưu thay đổi');
  });

  it('should toggle language between vi and en seamlessly', () => {
    const store = useLanguageStore.getState();

    // Initially Vietnamese
    expect(useLanguageStore.getState().language).toBe('vi');

    // Toggle to English
    store.toggleLanguage();
    expect(useLanguageStore.getState().language).toBe('en');
    expect(localStorage.getItem('vibespace_v1_language')).toBe('en');

    // Toggle back to Vietnamese
    useLanguageStore.getState().toggleLanguage();
    expect(useLanguageStore.getState().language).toBe('vi');
    expect(localStorage.getItem('vibespace_v1_language')).toBe('vi');
  });

  it('should set language explicitly and persist to localStorage', () => {
    const store = useLanguageStore.getState();

    store.setLanguage('en');
    expect(useLanguageStore.getState().language).toBe('en');
    expect(localStorage.getItem('vibespace_v1_language')).toBe('en');

    store.setLanguage('vi');
    expect(useLanguageStore.getState().language).toBe('vi');
    expect(localStorage.getItem('vibespace_v1_language')).toBe('vi');
  });

  it('should have parity and non-empty values across vi and en translation schemas', () => {
    // Check common
    expect(vi.common.save).toBeTruthy();
    expect(en.common.save).toBeTruthy();
    expect(vi.common.cancel).toBeTruthy();
    expect(en.common.cancel).toBeTruthy();

    // Check Pomodoro
    expect(vi.pomodoro.quotes.length).toBeGreaterThanOrEqual(5);
    expect(en.pomodoro.quotes.length).toBeGreaterThanOrEqual(5);
    expect(vi.pomodoro.sessionCounter(1, 4)).toContain('1');
    expect(en.pomodoro.sessionCounter(1, 4)).toContain('1');

    // Check Mixer
    expect(vi.mixer.activeCount(3)).toBe('3 Kênh Đang Phát');
    expect(en.mixer.activeCount(3)).toBe('3 Active Channels');
    expect(vi.mixer.channels.rain.name).toBe('Mưa Rào & Sấm Dịu');
    expect(en.mixer.channels.rain.name).toBe('Rain & Gentle Thunder');

    // Check Todo
    expect(vi.todo.tabToday(5)).toBe('Hôm nay (5)');
    expect(en.todo.tabToday(5)).toBe('Today (5)');
    expect(vi.todo.emptyArchive).toBeTruthy();
    expect(en.todo.emptyArchive).toBeTruthy();

    // Check Wallpaper
    expect(vi.wallpaper.categories.nature).toBeTruthy();
    expect(en.wallpaper.categories.nature).toBeTruthy();

    // Check Shortcuts
    expect(vi.shortcuts.spaceTitle).toBeTruthy();
    expect(en.shortcuts.spaceTitle).toBeTruthy();

    // Check PageTitle
    expect(vi.pageTitle.focus).toBe('Tập Trung');
    expect(en.pageTitle.focus).toBe('Focus');
  });
});
