import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoggedIn: false,

      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),

      setUser: (user) => set({ user }),

      logout: () => {
        set({ user: null, token: null, isLoggedIn: false });
        // Also clean up legacy localStorage keys
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
      }),
    },
  ),
);
