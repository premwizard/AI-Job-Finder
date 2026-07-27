const API_BASE = 'http://localhost:8000/api/salary';

export const salaryApi = {
  getOffers: async () => {
    const res = await fetch(`${API_BASE}/offers`);
    return res.json();
  },
  getOffer: async (offerId: string) => {
    const res = await fetch(`${API_BASE}/offer/${offerId}`);
    return res.json();
  },
  analyzeOffer: async (offerId: string) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_id: offerId }),
    });
    return res.json();
  },
  benchmarkSalary: async (role: string, location: string, experienceLevel: string) => {
    const res = await fetch(`${API_BASE}/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, location, experience_level: experienceLevel }),
    });
    return res.json();
  },
  compareOffers: async (offerIds: string[]) => {
    const res = await fetch(`${API_BASE}/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_ids: offerIds }),
    });
    return res.json();
  },
  negotiateOffer: async (offerId: string, focusArea: string) => {
    const res = await fetch(`${API_BASE}/negotiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_id: offerId, focus_area: focusArea }),
    });
    return res.json();
  },
  simulateDecision: async (offerId: string, scenario: any) => {
    const res = await fetch(`${API_BASE}/simulate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ offer_id: offerId, scenario }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
