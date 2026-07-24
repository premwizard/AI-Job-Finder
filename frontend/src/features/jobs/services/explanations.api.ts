import { authApi } from "@/features/auth/services/auth.api";

export interface MissingSkillAnalysis {
  skill: string;
  importance: "High" | "Medium" | "Low";
  impact: string;
}

export interface JobExplanation {
  id: string;
  overall_summary: string;
  strengths: string[];
  missing_skills_analysis: MissingSkillAnalysis[];
  risk_factors: string[];
  improvement_suggestions: string[];
  career_growth_analysis: string;
  confidence_explanation: string;
  confidence_score: number;
}

export const getJobExplanation = async (jobId: number): Promise<JobExplanation> => {
  const { data } = await authApi.get(`/explanations/${jobId}`);
  return data;
};

export const regenerateJobExplanation = async (jobId: number): Promise<any> => {
  const { data } = await authApi.post(`/explanations/regenerate/${jobId}`);
  return data;
};
