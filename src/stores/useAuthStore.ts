import { create } from 'zustand';
import { api } from '@/services/apiClient';

export interface UserProfile {
  id: string;
  email: string;
  name?: string | null;
  avatar?: string | null;
  authProvider?: string;
  createdAt?: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  authError: string | null;

  // Actions
  checkAuth: () => Promise<boolean>;
  loginWithGoogle: (payload: { credential?: string; email?: string; name?: string; avatar?: string }) => Promise<boolean>;
  requestMagicLink: (email: string) => Promise<{ success: boolean; token?: string; verifyUrl?: string }>;
  verifyMagicLink: (token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  setSyncing: (isSyncing: boolean) => void;
  setLastSynced: (time: string) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isSyncing: false,
  lastSyncedAt: null,
  authError: null,

  clearError: () => set({ authError: null }),
  setSyncing: (isSyncing) => set({ isSyncing }),
  setLastSynced: (time) => set({ lastSyncedAt: time }),

  checkAuth: async () => {
    try {
      set({ isLoading: true, authError: null });
      const res = await api.get('/api/v1/auth/me');
      if (res && res.user) {
        set({
          user: res.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
    } catch {
      // Not authenticated or server offline -> fallback to guest mode seamlessly
    }
    set({ user: null, isAuthenticated: false, isLoading: false });
    return false;
  },

  loginWithGoogle: async (payload) => {
    try {
      set({ isLoading: true, authError: null });
      const res = await api.post('/api/v1/auth/google', payload);
      if (res && res.user) {
        if (res.token) api.setToken(res.token);
        set({
          user: res.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Google Login Failed',
      });
      return false;
    }
  },

  requestMagicLink: async (email: string) => {
    try {
      set({ isLoading: true, authError: null });
      const res = await api.post('/api/v1/auth/magic-link', { email });
      set({ isLoading: false });
      return {
        success: true,
        token: res.token,
        verifyUrl: res.verifyUrl,
      };
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Failed to request magic link',
      });
      return { success: false };
    }
  },

  verifyMagicLink: async (token: string) => {
    try {
      set({ isLoading: true, authError: null });
      const res = await api.get(`/api/v1/auth/verify-magic-link?token=${encodeURIComponent(token)}`);
      if (res && res.user) {
        if (res.token) api.setToken(res.token);
        set({
          user: res.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return true;
      }
      return false;
    } catch (err: any) {
      set({
        isLoading: false,
        authError: err.message || 'Verification link expired or invalid',
      });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/api/v1/auth/logout');
    } catch {
      // ignore
    } finally {
      api.setToken(null);
      set({
        user: null,
        isAuthenticated: false,
        lastSyncedAt: null,
      });
    }
  },
}));
