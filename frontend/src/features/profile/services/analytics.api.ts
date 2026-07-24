import { authApi } from "@/api/axiosInstance";

export interface TrendDataPoint {
  date: string;
  score?: number;
  version?: number;
  count?: number;
}

export interface RecentVersion {
  id: string;
  version_number: number;
  change_summary: string;
  date: string;
}

export interface RecentImprovement {
  id: string;
  section: string;
  type: string;
  date: string;
}

export interface ResumeAnalyticsData {
  current_ats_score: number;
  highest_ats_score: number;
  latest_version: number;
  total_improvements_accepted: number;
  total_skills: number;
  resume_age_days: number;
  
  ats_trend: TrendDataPoint[];
  quality_trend: TrendDataPoint[];
  
  skills_growth: TrendDataPoint[];
  experience_growth: TrendDataPoint[];
  projects_growth: TrendDataPoint[];
  
  recent_versions: RecentVersion[];
  recent_improvements: RecentImprovement[];
}

export const getResumeAnalytics = async (): Promise<ResumeAnalyticsData> => {
  const response = await authApi.get("/api/profile/resume/analytics");
  return response.data;
};
