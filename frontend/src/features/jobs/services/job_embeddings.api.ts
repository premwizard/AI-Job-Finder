import { authApi } from "@/features/auth/services/auth.api";

export interface EmbeddingStatistics {
  total_jobs: number;
  embedded_jobs: number;
  pending_jobs: number;
  total_chunks: number;
  avg_chunks_per_job: number;
  provider: string;
  vector_store: string;
}

export const getEmbeddingStatistics = async (): Promise<EmbeddingStatistics> => {
  const { data } = await authApi.get("/jobs/embeddings/statistics");
  return data;
};

export const generateAllEmbeddings = async (): Promise<any> => {
  const { data } = await authApi.post("/jobs/embeddings/generate-all");
  return data;
};

export const getJobEmbeddings = async (id: number): Promise<any> => {
  const { data } = await authApi.get(`/jobs/${id}/embeddings`);
  return data;
};

export const generateJobEmbedding = async (id: number): Promise<any> => {
  const { data } = await authApi.post(`/jobs/${id}/embeddings`);
  return data;
};

export const deleteJobEmbedding = async (id: number): Promise<any> => {
  const { data } = await authApi.delete(`/jobs/${id}/embeddings`);
  return data;
};
