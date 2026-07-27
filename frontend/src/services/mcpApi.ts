const API_BASE = 'http://localhost:8000/api/mcp';

export const mcpApi = {
  getStatus: async () => {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },
  getServers: async () => {
    const res = await fetch(`${API_BASE}/servers`);
    return res.json();
  },
  getCapabilities: async () => {
    const res = await fetch(`${API_BASE}/capabilities`);
    return res.json();
  },
  getTools: async () => {
    const res = await fetch(`${API_BASE}/tools`);
    return res.json();
  },
  getResources: async () => {
    const res = await fetch(`${API_BASE}/resources`);
    return res.json();
  },
  getPrompts: async () => {
    const res = await fetch(`${API_BASE}/prompts`);
    return res.json();
  },
  connectProvider: async (providerName: string, transport: string, config: any) => {
    const res = await fetch(`${API_BASE}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_name: providerName, transport, config }),
    });
    return res.json();
  },
  disconnectProvider: async (providerName: string) => {
    const res = await fetch(`${API_BASE}/disconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_name: providerName }),
    });
    return res.json();
  },
  reconnectProvider: async (providerName: string) => {
    const res = await fetch(`${API_BASE}/reconnect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_name: providerName }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
