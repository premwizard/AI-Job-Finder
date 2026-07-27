const API_BASE = 'http://localhost:8000/api/drive';

export const driveMcpApi = {
  getProfile: async () => {
    const res = await fetch(`${API_BASE}/profile`);
    return res.json();
  },
  getDocuments: async () => {
    const res = await fetch(`${API_BASE}/documents`);
    return res.json();
  },
  getDocument: async (documentId: string) => {
    const res = await fetch(`${API_BASE}/document/${documentId}`);
    return res.json();
  },
  searchDocuments: async (query: string, semantic: boolean = true) => {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, semantic }),
    });
    return res.json();
  },
  analyzeDocument: async (documentId: string) => {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId }),
    });
    return res.json();
  },
  indexDocument: async (documentId: string) => {
    const res = await fetch(`${API_BASE}/index`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId }),
    });
    return res.json();
  },
  updateDocument: async (documentId: string, metadata: any) => {
    const res = await fetch(`${API_BASE}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document_id: documentId, metadata }),
    });
    return res.json();
  },
  archiveDocument: async (documentId: string) => {
    const res = await fetch(`${API_BASE}/archive/${documentId}`, {
      method: 'DELETE',
    });
    return res.json();
  },
  getStatistics: async () => {
    const res = await fetch(`${API_BASE}/statistics`);
    return res.json();
  }
};
