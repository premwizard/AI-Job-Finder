import { authApi } from "@/features/auth/services/auth.api";

export interface ChatMessage {
  id?: string;
  role: "user" | "model";
  content: string;
  citations?: string[];
  suggested_actions?: string[];
  created_at?: string;
}

export const sendChatMessage = async (message: string): Promise<{ response: string; citations: string[]; suggested_actions: string[] }> => {
  const { data } = await authApi.post('/chat', { message });
  return data;
};

export const getChatHistory = async (): Promise<{ messages: ChatMessage[] }> => {
  const { data } = await authApi.get('/chat/history');
  return data;
};

export const clearChatHistory = async (): Promise<any> => {
  const { data } = await authApi.delete('/chat/history');
  return data;
};
