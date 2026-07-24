import { authApi } from "@/features/auth/services/auth.api";

export interface ToolDef {
  name: string;
  description: string;
  category: string;
  input_schema: any;
}

export const listTools = async (): Promise<ToolDef[]> => {
  const { data } = await authApi.get('/tools');
  return data;
};

export const executeTool = async (tool_name: string, parameters: any): Promise<any> => {
  const { data } = await authApi.post('/tools/execute', { tool_name, parameters });
  return data;
};

export const getToolStatistics = async (): Promise<any> => {
  const { data } = await authApi.get('/tools/statistics');
  return data;
};
