import { authApi } from "@/features/auth/services/auth.api";

export interface AgentTask {
  id: number;
  task_type: string;
  description: string;
  status: string;
  result_summary?: string;
  priority: number;
}

export interface AgentGoal {
  id: number;
  title: string;
  description?: string;
  status: string;
  progress: number;
  created_at: string;
  tasks?: AgentTask[];
}

export const listGoals = async (): Promise<AgentGoal[]> => {
  const { data } = await authApi.get('/agent/goals');
  return data;
};

export const createGoal = async (title: string, description: string = ""): Promise<AgentGoal> => {
  const { data } = await authApi.post('/agent/goals', { title, description });
  return data;
};

export const getGoalDetails = async (id: number): Promise<AgentGoal> => {
  const { data } = await authApi.get(`/agent/goals/${id}`);
  return data;
};

export const generatePlan = async (id: number): Promise<any> => {
  const { data } = await authApi.post(`/agent/goals/${id}/plan`);
  return data;
};

export const executeNextTask = async (id: number): Promise<any> => {
  const { data } = await authApi.post(`/agent/goals/${id}/execute`);
  return data;
};
