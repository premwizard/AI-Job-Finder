import axios from 'axios';
import { RegisterRequest, LoginRequest, AuthResponse, UserResponse } from '../types/auth.types';

const API_URL = 'http://localhost:8000/api/auth';

const authApi = axios.create({
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
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (originalRequest.url === '/login' || originalRequest.url === '/refresh') {
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({resolve, reject})
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return authApi(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<AuthResponse>(`${API_URL}/refresh`, {}, { withCredentials: true });
        localStorage.setItem('auth_token', data.access_token);
        authApi.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        processQueue(null, data.access_token);
        return authApi(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('auth_token');
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

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

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, {}, { withCredentials: true });
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

export const forgotPassword = async (data: ForgotPasswordData): Promise<{ success: boolean, message: string }> => {
  const response = await authApi.post('/forgot-password', data);
  return response.data;
};

export const verifyResetToken = async (token: string): Promise<{ valid: boolean }> => {
  const response = await authApi.get(`/reset-password/verify?token=${token}`);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData): Promise<{ success: boolean, message: string }> => {
  const response = await authApi.post('/reset-password', data);
  return response.data;
};
