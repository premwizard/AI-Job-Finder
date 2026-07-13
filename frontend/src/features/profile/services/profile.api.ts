import axios from "axios";

// Setup a basic axios instance with the auth token
const api = axios.create({
  baseURL: "/api/profile",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET Full Profile
export const getFullProfile = async () => {
  const response = await api.get("");
  return response.data;
};

// PUT Single Objects
export const updatePersonalInfo = async (data: any) => {
  const response = await api.put("/personal", data);
  return response.data;
};

export const updateProfessionalSummary = async (data: any) => {
  const response = await api.put("/summary", data);
  return response.data;
};

export const updateCareerPreferences = async (data: any) => {
  const response = await api.put("/career-preferences", data);
  return response.data;
};

export const updateSocialProfiles = async (data: any) => {
  const response = await api.put("/social", data);
  return response.data;
};

export const updateAIPreferences = async (data: any) => {
  const response = await api.put("/ai-preferences", data);
  return response.data;
};

// Generic Lists (Placeholder for now until endpoints are created in next phase)
export const addListItem = async (endpoint: str, data: any) => {
  const response = await api.post(endpoint, data);
  return response.data;
};

export const updateListItem = async (endpoint: str, id: string, data: any) => {
  const response = await api.put(`${endpoint}/${id}`, data);
  return response.data;
};

export const deleteListItem = async (endpoint: str, id: string) => {
  const response = await api.delete(`${endpoint}/${id}`);
  return response.data;
};
