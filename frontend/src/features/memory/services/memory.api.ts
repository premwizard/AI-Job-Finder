import { authApi } from "@/features/auth/services/auth.api";

export interface UserMemory {
  id: number;
  memory_type: string;
  title?: string;
  content: string;
  importance_score: number;
  source?: string;
  tags?: string;
  created_at: string;
}

export const listMemories = async (type?: string): Promise<UserMemory[]> => {
  const params = type ? { memory_type: type } : {};
  const { data } = await authApi.get('/memory', { params });
  return data;
};

export const createMemory = async (payload: Partial<UserMemory>): Promise<any> => {
  const { data } = await authApi.post('/memory', payload);
  return data;
};

export const deleteMemory = async (id: number): Promise<any> => {
  const { data } = await authApi.delete(`/memory/${id}`);
  return data;
};

export const searchMemories = async (query: string, limit: number = 5): Promise<any[]> => {
  const { data } = await authApi.post('/memory/search', { query, limit });
  return data;
};

export const consolidateMemories = async (memory_ids: number[]): Promise<any> => {
  const { data } = await authApi.post('/memory/consolidate', { memory_ids });
  return data;
};
