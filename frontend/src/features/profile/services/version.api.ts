import { authApi } from "@/features/auth/services/auth.api";
import { ResumeVersion } from "../types/version.types";

export const getResumeVersions = async (resumeId: number): Promise<ResumeVersion[]> => {
  const response = await authApi.get(`/api/profile/resume/${resumeId}/versions`);
  return response.data;
};

export const getResumeVersionDetails = async (resumeId: number, versionId: string): Promise<ResumeVersion> => {
  const response = await authApi.get(`/api/profile/resume/${resumeId}/versions/${versionId}`);
  return response.data;
};

export const restoreResumeVersion = async (resumeId: number, versionId: string): Promise<{message: string}> => {
  const response = await authApi.post(`/api/profile/resume/${resumeId}/versions/${versionId}/restore`);
  return response.data;
};

export const deleteResumeVersion = async (resumeId: number, versionId: string): Promise<{message: string}> => {
  const response = await authApi.delete(`/api/profile/resume/${resumeId}/versions/${versionId}`);
  return response.data;
};
