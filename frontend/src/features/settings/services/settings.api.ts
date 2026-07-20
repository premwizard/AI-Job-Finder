import axios from 'axios';

const API_URL = 'http://localhost:8001/api/settings';

const settingsApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Attach the access token to every outgoing request
settingsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface VerifyPasswordChangeData {
  otp: string;
}

export const requestPasswordChange = async (
  data: ChangePasswordData,
): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/change-password/request', data);
  return response.data;
};

export const verifyPasswordChange = async (
  data: VerifyPasswordChangeData,
): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/change-password/verify', data);
  return response.data;
};

// --- Delete Account ---

export const requestAccountDeletion = async (
  current_password: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/delete-account/request', { current_password });
  return response.data;
};

export const verifyDeletionOtp = async (
  otp: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.post('/delete-account/verify', { otp });
  return response.data;
};

export const executeAccountDeletion = async (
  confirmation: string,
): Promise<{ success: boolean; message: string }> => {
  const response = await settingsApi.delete('/delete-account', { data: { confirmation } });
  return response.data;
};
