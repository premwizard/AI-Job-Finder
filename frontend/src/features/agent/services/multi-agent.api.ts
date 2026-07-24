import { authApi } from "@/features/auth/services/auth.api";

export interface AgentInfo {
  name: string;
  capabilities: string[];
}

export interface AgentStats {
  [agentName: string]: {
    status: string;
    tasks_completed: number;
    tasks_failed: number;
    avg_execution_time: number;
    last_active: number;
  };
}

export const listAgents = async (): Promise<AgentInfo[]> => {
  const { data } = await authApi.get('/agents');
  return data;
};

export const getAgentStatus = async (): Promise<AgentStats> => {
  const { data } = await authApi.get('/agents/status');
  return data;
};
