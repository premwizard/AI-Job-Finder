const API_BASE = 'http://localhost:8000/api/copilot';

export const copilotApi = {
  getDashboard: async () => {
    const res = await fetch(`${API_BASE}/dashboard`);
    return res.json();
  },
  getGoals: async () => {
    const res = await fetch(`${API_BASE}/goals`);
    return res.json();
  },
  createGoal: async (goalData: { title: string, target_date: string }) => {
    const res = await fetch(`${API_BASE}/goals`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalData),
    });
    return res.json();
  },
  runWeeklyReview: async () => {
    const res = await fetch(`${API_BASE}/review`, { method: 'POST' });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
