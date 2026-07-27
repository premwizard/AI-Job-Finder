const API_BASE = 'http://localhost:8000/api/ats';

export const atsMcpApi = {
  getProviders: async () => {
    const res = await fetch(`${API_BASE}/providers`);
    return res.json();
  },
  getApplications: async () => {
    const res = await fetch(`${API_BASE}/applications`);
    return res.json();
  },
  getApplication: async (applicationId: string) => {
    const res = await fetch(`${API_BASE}/application/${applicationId}`);
    return res.json();
  },
  syncProviders: async (providers?: string[]) => {
    const res = await fetch(`${API_BASE}/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ providers }),
    });
    return res.json();
  },
  analyzePipeline: async (applicationId: string) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId }),
    });
    return res.json();
  },
  generateFollowUp: async (applicationId: string) => {
    const res = await fetch(`${API_BASE}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ application_id: applicationId }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
