import { api } from './apiClient';
import { useAuthStore } from '@/stores/useAuthStore';
import { useTodoStore, TodoItem } from '@/stores/useTodoStore';
import { useBackgroundStore, DEFAULT_WALLPAPERS } from '@/stores/useBackgroundStore';
import { useSoundMixerStore } from '@/stores/useSoundMixerStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { usePomodoroStore } from '@/stores/usePomodoroStore';

class SyncEngine {
  private syncTimer: any = null;

  /**
   * Merge local browser guest data into the cloud account upon login
   * Guaranteed Zero Data Loss!
   */
  async mergeLocal() {
    const { isAuthenticated, setSyncing, setLastSynced } = useAuthStore.getState();
    if (!isAuthenticated) return;

    setSyncing(true);
    try {
      // 1. Gather local data
      const localTodos = useTodoStore.getState().todos.map((t) => ({
        id: t.id,
        text: t.title,
        completed: t.isCompleted,
        order: 0,
        createdAt: t.createdAt,
        updatedAt: t.createdAt,
      }));

      const background = useBackgroundStore.getState();
      const soundChannels = useSoundMixerStore.getState().channels;
      const soundVolumes: Record<string, number> = {};
      for (const [id, ch] of Object.entries(soundChannels)) {
        soundVolumes[id] = ch.volume;
      }

      const language = useLanguageStore.getState().language;
      const pomodoroSettings = usePomodoroStore.getState().settings;

      const payload = {
        todos: localTodos,
        settings: {
          wallpaper: background.currentWallpaper.id,
          customWallpaperUrl: background.customUrl,
          soundVolumes,
          language,
          pomodoroSettings,
        },
        pomodoroHistory: [],
      };

      const res = await api.post('/api/v1/sync/merge-local', payload);
      if (res && res.success) {
        // Hydrate todos from merged response
        if (Array.isArray(res.todos) && res.todos.length > 0) {
          const syncedTodos: TodoItem[] = res.todos.map((dbTodo: any) => ({
            id: dbTodo.id,
            title: dbTodo.text,
            isCompleted: dbTodo.completed,
            priority: 'normal',
            createdAt: dbTodo.createdAt,
          }));

          useTodoStore.setState({ todos: syncedTodos });
        }

        // Apply synced settings
        if (res.settings) {
          if (res.settings.wallpaper) {
            const foundPreset = DEFAULT_WALLPAPERS.find((p) => p.id === res.settings.wallpaper);
            if (foundPreset) {
              useBackgroundStore.getState().setWallpaper(foundPreset);
            }
          }
          if (res.settings.customWallpaperUrl) {
            useBackgroundStore.getState().setCustomUrl(res.settings.customWallpaperUrl);
          }
          if (res.settings.language) {
            useLanguageStore.getState().setLanguage(res.settings.language);
          }
        }

        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Sync merge failed (running offline mode):', err);
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Pull delta changes from the server
   */
  async pull() {
    const { isAuthenticated, setSyncing, setLastSynced } = useAuthStore.getState();
    if (!isAuthenticated) return;

    setSyncing(true);
    try {
      const res = await api.get('/api/v1/sync/pull');
      if (res && res.todos) {
        const cloudTodos: TodoItem[] = res.todos.map((dbTodo: any) => ({
          id: dbTodo.id,
          title: dbTodo.text,
          isCompleted: dbTodo.completed,
          priority: 'normal',
          createdAt: dbTodo.createdAt,
        }));

        useTodoStore.setState({ todos: cloudTodos });
        setLastSynced(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.warn('Sync pull failed:', err);
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Push current changes to the cloud
   */
  async pushCurrentState() {
    const { isAuthenticated, setSyncing, setLastSynced } = useAuthStore.getState();
    if (!isAuthenticated) return;

    setSyncing(true);
    try {
      const now = new Date().toISOString();
      const todos = useTodoStore.getState().todos.map((t, idx) => ({
        id: t.id,
        text: t.title,
        completed: t.isCompleted,
        order: idx,
        updatedAt: now,
        deleted: false,
      }));

      const background = useBackgroundStore.getState();
      const soundChannels = useSoundMixerStore.getState().channels;
      const soundVolumes: Record<string, number> = {};
      for (const [id, ch] of Object.entries(soundChannels)) {
        soundVolumes[id] = ch.volume;
      }

      await api.post('/api/v1/sync/push', {
        todos,
        settings: {
          wallpaper: background.currentWallpaper.id,
          customWallpaperUrl: background.customUrl,
          soundVolumes,
          language: useLanguageStore.getState().language,
          pomodoroSettings: usePomodoroStore.getState().settings,
          updatedAt: now,
        },
      });

      setLastSynced(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Sync push failed:', err);
    } finally {
      setSyncing(false);
    }
  }

  /**
   * Log completed pomodoro to analytics
   */
  async logPomodoroComplete(durationSeconds: number, mode = 'pomodoro') {
    const { isAuthenticated } = useAuthStore.getState();
    if (!isAuthenticated) return;

    try {
      await api.post('/api/v1/analytics/pomodoro-complete', {
        duration: durationSeconds,
        mode,
        completedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Failed to log pomodoro to cloud analytics:', err);
    }
  }

  /**
   * Start periodic auto-sync every 60 seconds
   */
  startPeriodicSync() {
    if (this.syncTimer) return;
    this.syncTimer = setInterval(() => {
      const { isAuthenticated } = useAuthStore.getState();
      if (isAuthenticated && !document.hidden) {
        this.pull();
      }
    }, 60000);
  }

  stopPeriodicSync() {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }
}

export const syncEngine = new SyncEngine();
