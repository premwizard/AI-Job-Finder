import { authApi } from '@/features/auth/services/auth.api';
import { WorkExperience, WorkExperienceCreate, WorkExperienceUpdate } from '../types/workExperience';

export const workExperienceService = {
  getAll: async (): Promise<WorkExperience[]> => {
    const { data } = await authApi.get('/profile/experience');
    return data;
  },

  create: async (payload: WorkExperienceCreate): Promise<WorkExperience> => {
    const { data } = await authApi.post('/profile/experience', payload);
    return data;
  },

  update: async (id: number | string, payload: WorkExperienceUpdate): Promise<WorkExperience> => {
    const { data } = await authApi.put(`/profile/experience/${id}`, payload);
    return data;
  },

  delete: async (id: number | string): Promise<void> => {
    await authApi.delete(`/profile/experience/${id}`);
  },
};

