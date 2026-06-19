import { api } from './api';

export const jobsService = {
  getJobs: async () => {
    const response = await api.get('/jobs');
    return response.data;
  },
  
  getRecommendedJobs: async () => {
    const response = await api.get('/jobs/recommended');
    return response.data;
  },
  
  getJobDetails: async (id: number) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  
  getSavedJobs: async () => {
    const response = await api.get('/saved-jobs');
    return response.data;
  },
  
  saveJob: async (id: number) => {
    const response = await api.post(`/saved-jobs/${id}`);
    return response.data;
  },
  
  removeSavedJob: async (id: number) => {
    const response = await api.delete(`/saved-jobs/${id}`);
    return response.data;
  },
  
  applyToJob: async (id: number) => {
    const response = await api.post(`/applications/${id}`);
    return response.data;
  },
  
  getApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  }
};
