import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse, LoginRequest, RegisterRequest } from '../features/auth/types/auth.types';
import * as authService from '../features/auth/services/auth.api';

interface AuthState {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  checkAuthentication: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,

      login: async (data: LoginRequest) => {
        set({ loading: true });
        try {
          const res = await authService.login(data);
          // Assuming response has access_token and user (as per backend TokenResponse)
          if (res.access_token) {
            localStorage.setItem('auth_token', res.access_token);
          }
          set({ user: res.user, token: res.access_token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true });
        try {
          const res = await authService.register(data);
          if (res.token) {
            localStorage.setItem('auth_token', res.token);
          }
          set({ user: res.user, token: res.token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
        } catch (e) {
          console.error(e);
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false });
          window.location.href = '/login';
        }
      },

      refreshUser: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        set({ loading: true });
        try {
          const user = await authService.getCurrentUser();
          set({ user, isAuthenticated: true, loading: false });
        } catch (error) {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false, loading: false });
        }
      },

      checkAuthentication: async () => {
        set({ loading: true });
        try {
          let token = localStorage.getItem('auth_token');
          if (!token) {
            // Try to silently refresh using the HttpOnly cookie
            const data = await authService.refreshToken();
            if (data.access_token) {
              token = data.access_token;
              localStorage.setItem('auth_token', token);
              set({ token, isAuthenticated: true });
            }
          }
          if (token) {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true, loading: false });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (error) {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false, loading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
