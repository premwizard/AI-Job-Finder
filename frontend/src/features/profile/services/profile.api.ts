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

// Certifications API
export const getCertifications = async () => {
  const response = await authApi.get(`${PROFILE_URL}/certifications`);
  return response.data;
};

export const createCertification = async (data: any) => {
  const response = await authApi.post(`${PROFILE_URL}/certifications`, data);
  return response.data;
};

export const updateCertification = async (id: string, data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/certifications/${id}`, data);
  return response.data;
};

export const deleteCertification = async (id: string) => {
  const response = await authApi.delete(`${PROFILE_URL}/certifications/${id}`);
  return response.data;
};

export const uploadCertificationFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/certifications/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Projects API
export const getProjects = async () => {
  const response = await authApi.get(`${PROFILE_URL}/projects`);
  return response.data;
};

export const createProject = async (data: any) => {
  const response = await authApi.post(`${PROFILE_URL}/projects`, data);
  return response.data;
};

export const updateProject = async (id: string, data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string) => {
  const response = await authApi.delete(`${PROFILE_URL}/projects/${id}`);
  return response.data;
};

export const uploadProjectFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/projects/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Resume Center API
export const getResumes = async () => {
  const response = await authApi.get(`${PROFILE_URL}/resume`);
  return response.data;
};

export const uploadResumeFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/resume/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const replaceResumeFile = async (resumeId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/resume/replace/${resumeId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteResume = async (resumeId: number) => {
  const response = await authApi.delete(`${PROFILE_URL}/resume/${resumeId}`);
  return response.data;
};

// Career Preferences API
export const getCareerPreferences = async () => {
  const response = await authApi.get(`${PROFILE_URL}/career-preferences`);
  return response.data;
};

export const updateCareerPreferences = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/career-preferences`, data);
  return response.data;
};
// Social Profiles API
export const getSocialProfiles = async () => {
  const response = await authApi.get(`${PROFILE_URL}/social`);
  return response.data;
};

export const updateSocialProfiles = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/social`, data);
  return response.data;
};

// AI Preferences API
export const getAIPreferences = async () => {
  const response = await authApi.get(`${PROFILE_URL}/ai-preferences`);
  return response.data;
};

export const updateAIPreferences = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/ai-preferences`, data);
  return response.data;
};

// Achievements API
export const getAchievements = async (type?: string) => {
  const params = type ? `?type=${encodeURIComponent(type)}` : "";
  const response = await authApi.get(`${PROFILE_URL}/achievements${params}`);
  return response.data;
};

export const createAchievement = async (data: any) => {
  const response = await authApi.post(`${PROFILE_URL}/achievements`, data);
  return response.data;
};

export const updateAchievement = async (id: string, data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/achievements/${id}`, data);
  return response.data;
};

export const deleteAchievement = async (id: string) => {
  const response = await authApi.delete(`${PROFILE_URL}/achievements/${id}`);
  return response.data;
};

export const uploadAchievementFile = async (id: string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await authApi.post(`${PROFILE_URL}/achievements/${id}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Job Search Preferences API
export const getJobSearchPreferences = async () => {
  const response = await authApi.get(`${PROFILE_URL}/job-search-preferences`);
  return response.data;
};

export const updateJobSearchPreferences = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/job-search-preferences`, data);
  return response.data;
};

// Profile Analytics API
export const getProfileAnalytics = async () => {
  const response = await authApi.get(`${PROFILE_URL}/analytics`);
  return response.data;
};

// Privacy Settings API
export const getPrivacySettings = async () => {
  const response = await authApi.get(`${PROFILE_URL}/privacy-settings`);
  return response.data;
};

export const updatePrivacySettings = async (data: any) => {
  const response = await authApi.put(`${PROFILE_URL}/privacy-settings`, data);
  return response.data;
};

export const exportUserData = async () => {
  const response = await authApi.get(`${PROFILE_URL}/export-data`);
  return response.data;
};




