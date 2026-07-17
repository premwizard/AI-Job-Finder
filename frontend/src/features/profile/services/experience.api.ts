import { authApi } from "@/features/auth/services/auth.api";
import { WorkExperience, WorkExperienceCreate, WorkExperienceUpdate } from "../types/experience";

export const experienceApi = {
  getExperience: async () => {
    const response = await authApi.get<WorkExperience[]>("/api/profile/experience");
    return response.data;
  },

  addExperience: async (data: WorkExperienceCreate) => {
    const response = await authApi.post<WorkExperience>("/api/profile/experience", data);
    return response.data;
  },

  updateExperience: async (id: string, data: WorkExperienceUpdate) => {
    const response = await authApi.put<WorkExperience>(`/api/profile/experience/${id}`, data);
    return response.data;
  },

  deleteExperience: async (id: string) => {
    const response = await authApi.delete(`/api/profile/experience/${id}`);
    return response.data;
  },
};
