import axios from 'axios';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/auth.types';

const API_URL = 'http://localhost:8000/api/auth';

const authApi = axios.create({
  baseURL: API_URL,
});

authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (data: RegisterRequest): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/register', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await authApi.post<AuthResponse>('/login', data);
  return response.data;
};

export const getCurrentUser = async (): Promise<UserResponse> => {
  const response = await authApi.get<UserResponse>('/me');
  return response.data;
};

export const logout = async (): Promise<void> => {
  await authApi.post('/logout');
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

export const forgotPassword = async (data: ForgotPasswordData): Promise<{success: boolean, message: string}> => {
  const response = await authApi.post('/forgot-password', data);
  return response.data;
};

export const verifyResetToken = async (token: string): Promise<{valid: boolean}> => {
  const response = await authApi.get(`/reset-password/verify?token=${token}`);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{success: boolean, message: string}> => {
  const response = await authApi.post('/reset-password', data);
  return response.data;
};
