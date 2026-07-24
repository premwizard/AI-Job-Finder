import { authApi } from "@/features/auth/services/auth.api";

export interface ParsingStatistics {
  total_jobs: number;
  processed_jobs: number;
  pending_jobs: number;
  failed_jobs: number;
}

export const getParsingStatistics = async (): Promise<ParsingStatistics> => {
  const { data } = await authApi.get("/jobs/parsing/statistics");
  return data;
};

export const getParsedJob = async (id: number): Promise<any> => {
  const { data } = await authApi.get(`/jobs/${id}/parsed`);
  return data;
};

export const parseSingleJob = async (id: number): Promise<any> => {
  const { data } = await authApi.post(`/jobs/${id}/parse`);
  return data;
};

export const parseAllJobs = async (): Promise<any> => {
  const { data } = await authApi.post("/jobs/parse-all");
  return data;
};
