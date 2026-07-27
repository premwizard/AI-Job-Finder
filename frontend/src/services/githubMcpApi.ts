const API_BASE = 'http://localhost:8000/api/github';

export const githubMcpApi = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },
  getRepositories: async () => {
    const res = await fetch(`${API_BASE}/repositories`);
    return res.json();
  },
  getRepository: async (repoId: string) => {
    const res = await fetch(`${API_BASE}/repositories/${repoId}`);
    return res.json();
  },
  analyzeGithub: async (username: string) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    return res.json();
  },
  generatePortfolio: async (username: string) => {
    const res = await fetch(`${API_BASE}/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    return res.json();
  },
  compareJob: async (username: string, jobDescription: string) => {
    const res = await fetch(`${API_BASE}/compare-job`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, job_description: jobDescription }),
    });
    return res.json();
  },
  getResumeSuggestions: async (username: string, targetRole: string) => {
    const res = await fetch(`${API_BASE}/resume-suggestions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, target_role: targetRole }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
