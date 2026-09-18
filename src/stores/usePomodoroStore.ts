import { create } from 'zustand';
import { ambientAudioEngine } from '@/audio/SoundSynthesizer';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';
export type PomodoroStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface PomodoroSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  longBreakInterval: number; // sessions before long break (default 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

export interface PomodoroState {
  mode: PomodoroMode;
  status: PomodoroStatus;
  timeLeft: number; // in seconds
  totalDuration: number; // in seconds
  currentSession: number; // 1 to 4
  totalSessionsCompleted: number;
  settings: PomodoroSettings;
  isDuckingActive: boolean;

  // Actions
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
  tick: () => void;
  setMode: (mode: PomodoroMode) => void;
  updateSettings: (newSettings: Partial<PomodoroSettings>) => void;
  clearDucking: () => void;
}

const STORAGE_KEY = 'vibespace_v1_pomodoro';

const DEFAULT_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

function loadStoredPomodoro(): { settings?: PomodoroSettings; sessions?: number } | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load pomodoro state from localStorage', e);
  }
  return null;
}

const storedData = loadStoredPomodoro();
const initialSettings = { ...DEFAULT_SETTINGS, ...storedData?.settings };
const initialFocusSeconds = initialSettings.focusDuration * 60;

export const usePomodoroStore = create<PomodoroState>((set, get) => ({
  mode: 'focus',
  status: 'idle',
  timeLeft: initialFocusSeconds,
  totalDuration: initialFocusSeconds,
  currentSession: 1,
  totalSessionsCompleted: storedData?.sessions || 0,
  settings: initialSettings,
  isDuckingActive: false,

  start: () => {
    set({ status: 'running' });
  },

  pause: () => {
    set({ status: 'paused' });
  },

  reset: () => {
    const { mode, settings } = get();
    let duration = settings.focusDuration * 60;
    if (mode === 'shortBreak') duration = settings.shortBreakDuration * 60;
    if (mode === 'longBreak') duration = settings.longBreakDuration * 60;

    set({
      status: 'idle',
      timeLeft: duration,
      totalDuration: duration,
    });
  },

  skip: () => {
    const { mode, currentSession, settings } = get();
    let nextMode: PomodoroMode = 'focus';
    let nextSession = currentSession;

    if (mode === 'focus') {
      if (currentSession >= settings.longBreakInterval) {
        nextMode = 'longBreak';
        nextSession = 1;
      } else {
        nextMode = 'shortBreak';
        nextSession = currentSession + 1;
      }
    } else {
      nextMode = 'focus';
    }

    let nextDuration = settings.focusDuration * 60;
    if (nextMode === 'shortBreak') nextDuration = settings.shortBreakDuration * 60;
    if (nextMode === 'longBreak') nextDuration = settings.longBreakDuration * 60;

    set({
      mode: nextMode,
      status: 'idle',
      currentSession: nextSession,
      timeLeft: nextDuration,
      totalDuration: nextDuration,
    });
  },

  tick: () => {
    const { status, timeLeft, mode, currentSession, totalSessionsCompleted, settings } = get();

    if (status !== 'running') return;

    if (timeLeft > 1) {
      set({ timeLeft: timeLeft - 1 });
      return;
    }

    // Timer completed!
    let nextMode: PomodoroMode = 'focus';
    let nextSession = currentSession;
    let newCompletedSessions = totalSessionsCompleted;

    if (mode === 'focus') {
      newCompletedSessions += 1;
      if (currentSession >= settings.longBreakInterval) {
        nextMode = 'longBreak';
        nextSession = 1;
      } else {
        nextMode = 'shortBreak';
        nextSession = currentSession + 1;
      }
    } else {
      nextMode = 'focus';
    }

    let nextDuration = settings.focusDuration * 60;
    if (nextMode === 'shortBreak') nextDuration = settings.shortBreakDuration * 60;
    if (nextMode === 'longBreak') nextDuration = settings.longBreakDuration * 60;

    const nextStatus =
      (mode === 'focus' && settings.autoStartBreaks) ||
      (mode !== 'focus' && settings.autoStartPomodoros)
        ? 'running'
        : 'completed';

    set({
      mode: nextMode,
      status: nextStatus,
      currentSession: nextSession,
      totalSessionsCompleted: newCompletedSessions,
      timeLeft: nextDuration,
      totalDuration: nextDuration,
      isDuckingActive: true,
    });

    // Play synthesized Tibetan bell chime and duck ambient audio 50%
    try {
      ambientAudioEngine.playZenChime();
    } catch {
      // AudioContext fallback
    }

    savePomodoroState(get());

    // Auto-clear ducking after 3.5 seconds
    setTimeout(() => {
      get().clearDucking();
    }, 3500);
  },

  setMode: (newMode: PomodoroMode) => {
    const { settings } = get();
    let duration = settings.focusDuration * 60;
    if (newMode === 'shortBreak') duration = settings.shortBreakDuration * 60;
    if (newMode === 'longBreak') duration = settings.longBreakDuration * 60;

    set({
      mode: newMode,
      status: 'idle',
      timeLeft: duration,
      totalDuration: duration,
    });
  },

  updateSettings: (newSettings: Partial<PomodoroSettings>) => {
    const updated = { ...get().settings, ...newSettings };
    const { mode } = get();
    let duration = updated.focusDuration * 60;
    if (mode === 'shortBreak') duration = updated.shortBreakDuration * 60;
    if (mode === 'longBreak') duration = updated.longBreakDuration * 60;

    set({
      settings: updated,
      timeLeft: duration,
      totalDuration: duration,
    });
    savePomodoroState(get());
  },

  clearDucking: () => {
    set({ isDuckingActive: false });
  },
}));

function savePomodoroState(state: PomodoroState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        settings: state.settings,
        sessions: state.totalSessionsCompleted,
      })
    );
  } catch (e) {
    console.error('Failed to save pomodoro state to localStorage', e);
  }
}
