import { authApi } from "@/features/auth/services/auth.api";

export interface JobLocation {
  country?: string;
  state?: string;
  city?: string;
  is_remote: boolean;
  is_hybrid: boolean;
}

export interface JobSkill {
  skill_name: string;
  category?: string;
}

export interface JobRequirement {
  requirement_text: string;
}

export interface JobBenefit {
  benefit_text: string;
}

export interface Job {
  id: number;
  source?: string;
  original_url?: string;
  company_name?: string;
  company_logo?: string;
  job_title?: string;
  employment_type?: string;
  work_mode?: string;
  industry?: string;
  min_salary?: number;
  max_salary?: number;
  salary_currency?: string;
  salary_period?: string;
  salary_available: boolean;
  min_experience?: number;
  max_experience?: number;
  career_level?: string;
  description_clean?: string;
  posted_date?: string;
  collected_date?: string;
  locations: JobLocation[];
  skills: JobSkill[];
  requirements: JobRequirement[];
  benefits: JobBenefit[];
}

export interface JobPaginationResponse {
  total: number;
  page: number;
  size: number;
  pages: number;
  items: Job[];
}

export interface JobStatisticsResponse {
  total_jobs: number;
  jobs_today: number;
  remote_jobs: number;
  top_skills: { name: string; count: number }[];
  top_companies: { name: string; count: number }[];
  top_sources: { name: string; count: number }[];
}

export const getJobs = async (params: any = {}): Promise<JobPaginationResponse> => {
  const { data } = await authApi.get("/jobs", { params });
  return data;
};

export const getJob = async (id: number): Promise<Job> => {
  const { data } = await authApi.get(`/jobs/${id}`);
  return data;
};

export const getJobStatistics = async (): Promise<JobStatisticsResponse> => {
  const { data } = await authApi.get("/jobs/statistics");
  return data;
};

export const refreshJobs = async (): Promise<any> => {
  const { data } = await authApi.post("/jobs/refresh");
  return data;
};
