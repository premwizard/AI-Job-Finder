import { api } from './api';
import { WorkExperience, WorkExperienceCreate, WorkExperienceUpdate } from '../types/workExperience';

export const workExperienceService = {
  getAll: async (): Promise<WorkExperience[]> => {
    const { data } = await api.get('/work-experience/');
    return data;
  },

  create: async (payload: WorkExperienceCreate): Promise<WorkExperience> => {
    const { data } = await api.post('/work-experience/', payload);
    return data;
  },

  update: async (id: number, payload: WorkExperienceUpdate): Promise<WorkExperience> => {
    const { data } = await api.put(`/work-experience/${id}`, payload);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/work-experience/${id}`);
  },
};
