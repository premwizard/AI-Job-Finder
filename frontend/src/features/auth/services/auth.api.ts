import axios from 'axios';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/auth.types';

const API_URL = '/api';

export const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt token refresh on 401, and never for auth endpoints themselves
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/login' &&
      originalRequest.url !== '/auth/refresh'
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return authApi(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        if (data.access_token) {
          localStorage.setItem('auth_token', data.access_token);
          authApi.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
          processQueue(null, data.access_token);
        }
        return authApi(originalRequest);
      } catch (refreshErr: any) {
        processQueue(refreshErr, null);
        // Refresh failed (404 = endpoint missing, 401 = no valid session) — clear local session
        localStorage.removeItem('auth_token');
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  // Backend uses OAuth2PasswordRequestForm which requires form-data, not JSON
  const formData = new URLSearchParams();
  formData.append('username', data.email);
  formData.append('password', data.password);
  const response = await authApi.post<AuthResponse>('/auth/login', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await authApi.get<UserResponse>('/users/me');
  return response.data;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  // This backend does not implement a refresh endpoint — always reject so callers treat it as no session
  return Promise.reject({ response: { status: 401 } });
};

export const logout = async (): Promise<void> => {
  // Best-effort: ignore errors if logout endpoint doesn't exist
  try {
    await authApi.post('/auth/logout');
  } catch {
    // noop
  }
};

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

export const forgotPassword = async (data: ForgotPasswordData): Promise<{ success: boolean, message: string }> => {
  const response = await authApi.post('/auth/forgot-password', data);
  return response.data;
};

export const verifyResetToken = async (token: string): Promise<{ valid: boolean }> => {
  const response = await authApi.get(`/auth/reset-password/verify?token=${token}`);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean, message: string }> => {
  const response = await authApi.post('/auth/reset-password', data);
  return response.data;
};

export const sendVerificationEmail = async (): Promise<{ success: boolean, message: string }> => {
  const response = await authApi.post('/auth/send-verification-email');
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ success: boolean, message: string }> => {
  // Use regular axios to avoid interceptor issues, or authApi. Since it's public, regular axios is fine, but authApi works too.
  const response = await axios.get(`${API_URL}/auth/verify-email?token=${token}`);
  return response.data;
};

export const getVerificationStatus = async (): Promise<{ is_verified: boolean }> => {
  const response = await authApi.get('/auth/verification-status');
  return response.data;
};
