import { api } from './api';

export const resumeService = {
  getResume: async () => {
    const response = await api.get('/profile/resume');
    return response.data;
  },
  
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/profile/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
