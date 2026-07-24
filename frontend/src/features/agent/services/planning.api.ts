import { authApi } from "@/features/auth/services/auth.api";

export const generateCognitivePlan = async (goal_id: number): Promise<any> => {
  const { data } = await authApi.post('/planner/create', { goal_id });
  return data;
};

export const makeCognitiveDecision = async (goal_id: number, question: string): Promise<any> => {
  const { data } = await authApi.post('/planner/decision', { goal_id, question });
  return data;
};

export const evaluatePlan = async (goal_id: number): Promise<any> => {
  const { data } = await authApi.get(`/planner/evaluate/${goal_id}`);
  return data;
};

export const getPlanningHistory = async (goal_id: number): Promise<any> => {
  const { data } = await authApi.get(`/planner/history/${goal_id}`);
  return data;
};
