import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string; role: string } | null;
  token: string | null;
  expiresAt: number | null;
  login: (token: string, user: { id: string; name: string; email: string; role: string }, expiresIn: number) => void;
  logout: () => void;
  checkSession: () => boolean;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      expiresAt: null,
      login: (token, user, expiresIn) => {
        const expiresAt = Date.now() + expiresIn * 1000;
        localStorage.setItem('access_token', token);
        set({ isAuthenticated: true, user, token, expiresAt });
      },
      logout: () => {
        localStorage.removeItem('access_token');
        set({ isAuthenticated: false, user: null, token: null, expiresAt: null });
      },
      checkSession: () => {
        const { expiresAt, isAuthenticated, logout } = get();
        if (isAuthenticated && expiresAt && Date.now() > expiresAt) {
          logout();
          return false;
        }
        return isAuthenticated;
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
