import { authApi } from "@/features/auth/services/auth.api";

export const runJobMonitor = async (): Promise<any> => {
  const { data } = await authApi.post('/job-monitor/monitor');
  return data;
};

export const listOpportunities = async (): Promise<any[]> => {
  const { data } = await authApi.get('/job-monitor/opportunities');
  return data;
};

export const updateOpportunityStatus = async (id: number, status: string): Promise<any> => {
  const { data } = await authApi.patch(`/job-monitor/opportunities/${id}`, { status });
  return data;
};

export const getOpportunityStatistics = async (): Promise<any> => {
  const { data } = await authApi.get('/job-monitor/statistics');
  return data;
};
