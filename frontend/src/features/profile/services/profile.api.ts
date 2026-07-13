import { authApi } from "@/features/auth/services/auth.api";

const PROFILE_URL = "/profile";

// GET Full Profile
export const getFullProfile = async () => {
  const response = await authApi.get(PROFILE_URL);
  return response.data;
};

// PUT Single Objects
export const updatePersonalInfo = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/personal`, data);
  return response.data;
};

export const updateProfessionalSummary = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/summary`, data);
  return response.data;
};

export const updateCareerPreferences = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/career-preferences`, data);
  return response.data;
};

export const updateSocialProfiles = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/social`, data);
  return response.data;
};

export const updateAIPreferences = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/ai-preferences`, data);
  return response.data;
};

// Generic Lists (Placeholder for now until endpoints are created in next phase)
export const addListItem = async (endpoint: string, data: any) => {
  // e.g. endpoint = "/api/profile/skills" -> we need full url if not provided
  const url = endpoint.startsWith("http") ? endpoint : endpoint;
  const response = await authApi.post(url, data);
  return response.data;
};

export const updateListItem = async (endpoint: string, id: string, data: any) => {
  const url = endpoint.startsWith("http") ? endpoint : endpoint;
  const response = await authApi.put(`${url}/${id}`, data);
  return response.data;
};

export const deleteListItem = async (endpoint: string, id: string) => {
  const url = endpoint.startsWith("http") ? endpoint : endpoint;
  const response = await authApi.delete(`${url}/${id}`);
  return response.data;
};
