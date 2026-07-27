const API_BASE = 'http://localhost:8000/api/gmail';

export const gmailMcpApi = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },
  getMessages: async () => {
    const res = await fetch(`${API_BASE}/messages`);
    return res.json();
  },
  getThreads: async () => {
    const res = await fetch(`${API_BASE}/threads`);
    return res.json();
  },
  getLabels: async () => {
    const res = await fetch(`${API_BASE}/labels`);
    return res.json();
  },
  searchEmail: async (query: string) => {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    });
    return res.json();
  },
  analyzeEmail: async (threadId: string) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId }),
    });
    return res.json();
  },
  generateDraft: async (intent: string, threadId?: string, to?: string) => {
    const res = await fetch(`${API_BASE}/draft`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intent, thread_id: threadId, to }),
    });
    return res.json();
  },
  sendDraft: async (draftId: string) => {
    const res = await fetch(`${API_BASE}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draft_id: draftId }),
    });
    return res.json();
  },
  generateFollowUp: async (threadId: string) => {
    const res = await fetch(`${API_BASE}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: threadId }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
