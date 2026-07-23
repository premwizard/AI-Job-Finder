import { authApi } from "@/features/auth/services/auth.api";

const PROFILE_URL = "/profile";

// GET Full Profile
export const getFullProfile = async () => {
  const response = await authApi.get(PROFILE_URL);
  return response.data;
};

export const getProfileCompletion = async () => {
  const response = await authApi.get(`${PROFILE_URL}/completion`);
  return response.data;
};

export const getProfileStrength = async () => {
  const response = await authApi.get(`${PROFILE_URL}/strength`);
  return response.data;
};

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const uploadBanner = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/banner`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
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

// Education API
export const getEducations = async () => {
  const response = await authApi.get(`${PROFILE_URL}/education`);
  return response.data;
};

export const createEducation = async (data: any) => {
  const response = await authApi.post(`${PROFILE_URL}/education`, data);
  return response.data;
};

export const updateEducation = async (id: string, data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/education/${id}`, data);
  return response.data;
};

export const deleteEducation = async (id: string) => {
  const response = await authApi.delete(`${PROFILE_URL}/education/${id}`);
  return response.data;
};

export const uploadEducationFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/education/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

