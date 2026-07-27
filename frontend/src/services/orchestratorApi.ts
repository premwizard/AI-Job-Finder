const API_BASE = 'http://localhost:8000/api/orchestrator';

export const orchestratorApi = {
  runWorkflow: async (goal: string, workflowType?: string, parameters?: any) => {
    const res = await fetch(`${API_BASE}/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, workflow_type: workflowType, parameters }),
    });
    return res.json();
  },
  listWorkflows: async () => {
    const res = await fetch(`${API_BASE}/workflows`);
    return res.json();
  },
  getWorkflow: async (workflowId: string) => {
    const res = await fetch(`${API_BASE}/workflows/${workflowId}`);
    return res.json();
  },
  retryWorkflow: async (workflowId: string) => {
    const res = await fetch(`${API_BASE}/retry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId }),
    });
    return res.json();
  },
  cancelWorkflow: async (workflowId: string) => {
    const res = await fetch(`${API_BASE}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflow_id: workflowId }),
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
