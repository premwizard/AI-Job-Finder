import { authApi } from "@/features/auth/services/auth.api";

export interface ResumeSuggestion {
  section: string;
  suggestion: string;
  reason: string;
  evidence: string;
  expected_impact: string;
  diff: {
    removed: string | null;
    added: string;
  };
}

export interface OptimizationResult {
  id: number;
  job_id: number;
  projected_ats_score: number;
  projected_match_score: number;
  suggestions: ResumeSuggestion[];
  status: string;
}

export const generateOptimization = async (job_id: number): Promise<OptimizationResult> => {
  const { data } = await authApi.post('/resume/optimize', { job_id });
  return data;
};

export const getOptimizationHistory = async (): Promise<any[]> => {
  const { data } = await authApi.get('/resume/optimize/history');
  return data;
};

export const applyOptimization = async (id: number): Promise<any> => {
  const { data } = await authApi.post(`/resume/optimize/${id}/apply`);
  return data;
};
