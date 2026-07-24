import axios from 'axios';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const authApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

authApi.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) {
      if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('Authorization', `Bearer ${token}`);
      } else {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  }
  return config;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    // The backend has no token-refresh endpoint.
    // On 401, clear the stale local token so the user is redirected to login.
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
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
  const response = await authApi.get<UserResponse>('/auth/me');
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
