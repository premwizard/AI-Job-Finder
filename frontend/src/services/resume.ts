import { api } from './api';

export const resumeService = {
  getResume: async () => {
    const response = await api.get('/resume');
    return response.data;
  },
  
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
