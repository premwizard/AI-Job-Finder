import { authApi } from "@/features/auth/services/auth.api";

const SKILL_GAP_URL = "/profile/skill-gap";

export interface AnalyzeSkillGapPayload {
  target_role: string;
  target_industry: string;
  resume_id?: number | null;
}

export const analyzeSkillGap = async (payload: AnalyzeSkillGapPayload) => {
  const response = await authApi.post(`${SKILL_GAP_URL}/analyze`, payload);
  return response.data;
};

export const getSkillGapHistory = async () => {
  const response = await authApi.get(`${SKILL_GAP_URL}/history`);
  return response.data;
};
