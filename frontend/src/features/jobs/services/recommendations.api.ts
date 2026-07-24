import { authApi } from "@/features/auth/services/auth.api";

export interface JobRecommendation {
  id: number;
  job_title: string;
  company_name: string;
  location: string;
  recommendation_score: number;
  semantic_score: number;
  career_growth_score: number;
  confidence_score: number;
  category: string;
  matched_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  explanation_summary: string;
}

export const getRecommendations = async (limit: number = 20): Promise<JobRecommendation[]> => {
  const { data } = await authApi.get(`/recommendations?limit=${limit}`);
  return data;
};

export const refreshRecommendations = async (): Promise<any> => {
  const { data } = await authApi.post("/recommendations/refresh");
  return data;
};
