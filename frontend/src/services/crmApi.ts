const API_BASE = 'http://localhost:8000/api/crm';

export const crmApi = {
  getContacts: async () => {
    const res = await fetch(`${API_BASE}/contacts`);
    return res.json();
  },
  getContact: async (contactId: string) => {
    const res = await fetch(`${API_BASE}/contact/${contactId}`);
    return res.json();
  },
  createContact: async (contactData: { name: string, company: string, role: string }) => {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData),
    });
    return res.json();
  },
  generateFollowUp: async (contactId: string, messageType: string) => {
    const res = await fetch(`${API_BASE}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact_id: contactId, message_type: messageType }),
    });
    return res.json();
  },
  generateNetworkPlan: async (goal: string) => {
    const res = await fetch(`${API_BASE}/network-plan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
