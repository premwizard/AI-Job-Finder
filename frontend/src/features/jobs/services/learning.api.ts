import { authApi } from "@/features/auth/services/auth.api";

export interface LearningSkill {
  skill_name: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  estimated_time: string;
  category: string;
  importance: "Critical" | "High" | "Medium" | "Low" | "Nice-to-Have";
}

export interface LearningPhase {
  phase: number;
  skills: LearningSkill[];
}

export interface ProjectedImprovement {
  milestone: string;
  projected_score: number;
}

export interface CareerGrowthInsights {
  readiness_level: string;
  summary: string;
}

export interface JobLearningRoadmap {
  id: string;
  roadmap: LearningPhase[];
  projected_improvements: ProjectedImprovement[];
  career_growth_insights: CareerGrowthInsights;
}

export const getLearningRoadmap = async (jobId: number): Promise<JobLearningRoadmap> => {
  const { data } = await authApi.get(`/learning/job/${jobId}`);
  return data;
};

export const regenerateLearningRoadmap = async (jobId: number): Promise<any> => {
  const { data } = await authApi.post(`/learning/regenerate/${jobId}`);
  return data;
};
