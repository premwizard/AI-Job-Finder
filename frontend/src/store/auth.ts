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
  checkAuthentication: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true, // Set to true to prevent premature redirects on hydration

      login: async (data: LoginRequest) => {
        set({ loading: true });
        try {
          const res = await authService.login(data);
          if (res.access_token) {
            localStorage.setItem('auth_token', res.access_token);
          }
          // Backend login returns only {access_token, token_type} — fetch user separately
          const user = await authService.getCurrentUser();
          set({ user, token: res.access_token, isAuthenticated: true, loading: false });
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ loading: true });
        try {
          const res = await authService.register(data);
          // Register may return a user or just a token depending on backend version
          const token = res.access_token ?? res.token;
          if (token) {
            localStorage.setItem('auth_token', token);
          }
          // Fetch user separately to stay consistent
          const user = token ? await authService.getCurrentUser() : (res.user ?? null);
          set({ user, token: token ?? null, isAuthenticated: !!token, loading: false });
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

      checkAuthentication: async () => {
        set({ loading: true });
        try {
          let token = localStorage.getItem('auth_token');
          if (!token) {
            // Try to silently refresh using the HttpOnly cookie via Next.js proxy
            try {
              const data = await authService.refreshToken();
              if (data.access_token) {
                token = data.access_token;
                localStorage.setItem('auth_token', token);
                set({ token, isAuthenticated: true });
              }
            } catch (refreshError: any) {
              // If refresh fails, it means there is no valid session. We should clean up.
              if (refreshError?.response?.status === 401) {
                localStorage.removeItem('auth_token');
                set({ user: null, token: null, isAuthenticated: false, loading: false });
                return;
              }
            }
          }
          
          if (token) {
            const user = await authService.getCurrentUser();
            set({ user, isAuthenticated: true, loading: false });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (error: any) {
          console.error("Auth initialization failed:", error);
          
          // Only clear session and logout if we get an explicit 401/403 meaning unauthorized.
          // For network errors (500, timeout), we retain the session so we don't aggressively log users out.
          if (error?.response?.status === 401 || error?.response?.status === 403) {
             localStorage.removeItem('auth_token');
             set({ user: null, token: null, isAuthenticated: false, loading: false });
          } else {
             set({ loading: false });
          }
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
