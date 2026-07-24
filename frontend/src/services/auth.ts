import { api } from './api';

export const authService = {
  login: async (data: any) => {
    // fastapi OAuth2PasswordRequestForm expects form-data
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    return response.data;
  },
  
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};
