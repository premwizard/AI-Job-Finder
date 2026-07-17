import { api } from '@/services/api';
import { SkillFormValues, SkillResponse } from '../types/skills';

export const skillsService = {
  getSkills: async (): Promise<SkillResponse[]> => {
    const response = await api.get('/profile/skills');
    return response.data;
  },

  addSkill: async (data: SkillFormValues): Promise<SkillResponse> => {
    const response = await api.post('/profile/skills', data);
    return response.data;
  },

  updateSkill: async (id: number, data: Partial<SkillFormValues>): Promise<SkillResponse> => {
    const response = await api.put(`/profile/skills/${id}`, data);
    return response.data;
  },

  deleteSkill: async (id: number): Promise<void> => {
    await api.delete(`/profile/skills/${id}`);
  },
};
