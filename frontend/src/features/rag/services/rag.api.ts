import { authApi } from "@/features/auth/services/auth.api";

export interface RAGStatistics {
  collections: { name: string; count: number }[];
  total_chunks: number;
  latency_ms: number;
  provider: string;
  storage_gb: number;
}

export const getRAGStatistics = async (): Promise<RAGStatistics> => {
  const { data } = await authApi.get('/rag/statistics');
  return data;
};

export const reindexKnowledge = async (): Promise<any> => {
  const { data } = await authApi.post('/rag/reindex');
  return data;
};

export const testRAGSearch = async (query: string): Promise<any> => {
  const { data } = await authApi.post('/rag/search', { query });
  return data;
};
