import { api } from './api';

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/profile/analytics');
    return response.data;
  }
};
