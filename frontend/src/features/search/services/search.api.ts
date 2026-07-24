import { authApi } from "@/features/auth/services/auth.api";

export interface AdvancedSearchResponse {
  original_query: string;
  expanded_query: string;
  extracted_filters: any;
  target_collections: string[];
  results: { [collection: string]: any[] };
  total_hits: number;
}

export const performAdvancedSearch = async (query: string, mode: string = "hybrid", collections?: string[]): Promise<AdvancedSearchResponse> => {
  const { data } = await authApi.post('/search', { query, mode, collections });
  return data;
};
