import { authApi } from "@/features/auth/services/auth.api";

export interface JobMatchResult {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  overall_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation_summary: string;
}

export interface DetailedJobMatch {
  overall_score: number;
  semantic_score: number;
  skills_score: number;
  experience_score: number;
  matched_skills: string[];
  missing_skills: string[];
  explanation_summary: string;
  explanation_missing: string;
}

export const getRecommendedJobs = async (limit: number = 10): Promise<JobMatchResult[]> => {
  const { data } = await authApi.get(`/jobs/recommended?limit=${limit}`);
  return data;
};

export const getJobMatch = async (jobId: number): Promise<DetailedJobMatch> => {
  const { data } = await authApi.get(`/jobs/${jobId}/match`);
  return data;
};

export const recalculateMatches = async (): Promise<any> => {
  const { data } = await authApi.post("/jobs/recalculate-matches");
  return data;
};
