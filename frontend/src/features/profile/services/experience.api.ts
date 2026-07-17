import { api } from "@/lib/api";
import { WorkExperience, WorkExperienceCreate, WorkExperienceUpdate } from "../types/experience";

export const experienceApi = {
  getExperience: async () => {
    const response = await api.get<WorkExperience[]>("/api/profile/experience");
    return response.data;
  },

  addExperience: async (data: WorkExperienceCreate) => {
    const response = await api.post<WorkExperience>("/api/profile/experience", data);
    return response.data;
  },

  updateExperience: async (id: string, data: WorkExperienceUpdate) => {
    const response = await api.put<WorkExperience>(`/api/profile/experience/${id}`, data);
    return response.data;
  },

  deleteExperience: async (id: string) => {
    const response = await api.delete(`/api/profile/experience/${id}`);
    return response.data;
  },
};
