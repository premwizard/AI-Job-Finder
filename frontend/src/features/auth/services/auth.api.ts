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
