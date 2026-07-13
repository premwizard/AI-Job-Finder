import axios from "axios";

const API_URL = "http://localhost:8000/api";

export type AuthProvider = "email" | "google" | "github" | "microsoft" | "linkedin";

export interface ConnectedAccountResponse {
  id: string;
  provider: AuthProvider;
  provider_user_id: string;
  provider_email?: string;
  connected_at: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("access_token") || sessionStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getConnectedAccounts = async (): Promise<ConnectedAccountResponse[]> => {
  const response = await axios.get(`${API_URL}/settings/connected-accounts`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const disconnectAccount = async (provider: AuthProvider): Promise<void> => {
  await axios.delete(`${API_URL}/settings/connected-accounts/${provider}`, {
    headers: getAuthHeaders(),
  });
};

export const initiateSocialLogin = (provider: AuthProvider) => {
  // Redirect to backend endpoint that initiates OAuth flow
  window.location.href = `${API_URL}/auth/${provider}`;
};
