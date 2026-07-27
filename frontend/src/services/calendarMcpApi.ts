const API_BASE = 'http://localhost:8000/api/calendar';

export const calendarMcpApi = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },
  getEvents: async () => {
    const res = await fetch(`${API_BASE}/events`);
    return res.json();
  },
  getUpcomingEvents: async () => {
    const res = await fetch(`${API_BASE}/upcoming`);
    return res.json();
  },
  createEvent: async (data: any) => {
    const res = await fetch(`${API_BASE}/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  updateEvent: async (eventId: string, updates: any) => {
    const res = await fetch(`${API_BASE}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, updates }),
    });
    return res.json();
  },
  deleteEvent: async (eventId: string) => {
    const res = await fetch(`${API_BASE}/delete/${eventId}`, {
      method: 'DELETE',
    });
    return res.json();
  },
  findAvailability: async (dateRange: string[], durationMinutes: number) => {
    const res = await fetch(`${API_BASE}/availability`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date_range: dateRange, duration_minutes: durationMinutes }),
    });
    return res.json();
  },
  optimizeSchedule: async (goals: string[]) => {
    const res = await fetch(`${API_BASE}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goals }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
