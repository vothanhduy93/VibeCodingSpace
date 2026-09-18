import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePomodoroStore } from '../stores/usePomodoroStore';

describe('usePomodoroStore (Pomodoro State Machine)', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // Reset store to initial state
    usePomodoroStore.setState({
      mode: 'focus',
      status: 'idle',
      timeLeft: 25 * 60,
      totalDuration: 25 * 60,
      currentSession: 1,
      totalSessionsCompleted: 0,
      settings: {
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        longBreakInterval: 4,
        autoStartBreaks: false,
        autoStartPomodoros: false,
      },
      isDuckingActive: false,
    });
  });

  it('should initialize with default focus settings (25m = 1500s)', () => {
    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('focus');
    expect(state.status).toBe('idle');
    expect(state.timeLeft).toBe(1500);
    expect(state.totalDuration).toBe(1500);
    expect(state.currentSession).toBe(1);
    expect(state.totalSessionsCompleted).toBe(0);
  });

  it('should transition between start, pause, and reset statuses', () => {
    const store = usePomodoroStore.getState();

    store.start();
    expect(usePomodoroStore.getState().status).toBe('running');

    store.pause();
    expect(usePomodoroStore.getState().status).toBe('paused');

    // Simulate elapsed time
    usePomodoroStore.setState({ timeLeft: 1200 });
    store.reset();
    expect(usePomodoroStore.getState().status).toBe('idle');
    expect(usePomodoroStore.getState().timeLeft).toBe(1500);
  });

  it('should decrement timeLeft by 1s on tick when running', () => {
    usePomodoroStore.setState({ status: 'running', timeLeft: 1500 });
    usePomodoroStore.getState().tick();

    expect(usePomodoroStore.getState().timeLeft).toBe(1499);
  });

  it('should not decrement timeLeft on tick when paused or idle', () => {
    usePomodoroStore.setState({ status: 'paused', timeLeft: 1500 });
    usePomodoroStore.getState().tick();
    expect(usePomodoroStore.getState().timeLeft).toBe(1500);

    usePomodoroStore.setState({ status: 'idle', timeLeft: 1500 });
    usePomodoroStore.getState().tick();
    expect(usePomodoroStore.getState().timeLeft).toBe(1500);
  });

  it('should complete focus session and transition to short break on last tick', () => {
    usePomodoroStore.setState({
      status: 'running',
      mode: 'focus',
      timeLeft: 1,
      currentSession: 1,
      totalSessionsCompleted: 0,
    });

    usePomodoroStore.getState().tick();

    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('shortBreak');
    expect(state.status).toBe('completed');
    expect(state.currentSession).toBe(2);
    expect(state.totalSessionsCompleted).toBe(1);
    expect(state.timeLeft).toBe(5 * 60);
    expect(state.isDuckingActive).toBe(true);

    // Ducking auto-clears after 3.5s
    vi.advanceTimersByTime(3500);
    expect(usePomodoroStore.getState().isDuckingActive).toBe(false);
  });

  it('should trigger longBreak after reaching longBreakInterval (session 4)', () => {
    usePomodoroStore.setState({
      status: 'running',
      mode: 'focus',
      timeLeft: 1,
      currentSession: 4,
      totalSessionsCompleted: 3,
    });

    usePomodoroStore.getState().tick();

    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('longBreak');
    expect(state.currentSession).toBe(1);
    expect(state.totalSessionsCompleted).toBe(4);
    expect(state.timeLeft).toBe(15 * 60);
  });

  it('should update settings and adjust current duration', () => {
    usePomodoroStore.getState().updateSettings({ focusDuration: 30 });

    const state = usePomodoroStore.getState();
    expect(state.settings.focusDuration).toBe(30);
    expect(state.timeLeft).toBe(30 * 60);
    expect(state.totalDuration).toBe(30 * 60);
  });

  it('should switch mode manually with setMode', () => {
    usePomodoroStore.getState().setMode('shortBreak');

    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('shortBreak');
    expect(state.status).toBe('idle');
    expect(state.timeLeft).toBe(5 * 60);
  });

  it('should advance to next mode with skip()', () => {
    usePomodoroStore.setState({ mode: 'focus', currentSession: 1 });
    usePomodoroStore.getState().skip();

    const state = usePomodoroStore.getState();
    expect(state.mode).toBe('shortBreak');
    expect(state.currentSession).toBe(2);
    expect(state.timeLeft).toBe(5 * 60);
  });
});
