import axios from 'axios';

// Create a customized axios instance for settings
// If we want to reuse the token logic, we can import from auth.api

// Let's assume authApi isn't exported, we'll create our own interceptor to grab the token
const API_URL = 'http://localhost:8000/api/settings';

const settingsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

settingsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic interceptor for 401s
settingsApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // If we wanted robust token refresh, we'd use the authApi logic here.
    return Promise.reject(error);
  }
);

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface VerifyPasswordChangeData {
  otp: string;
}

export const requestPasswordChange = async (data: ChangePasswordData): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/change-password/request', data);
  return response.data;
};

export const verifyPasswordChange = async (data: VerifyPasswordChangeData): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/change-password/verify', data);
  return response.data;
};
