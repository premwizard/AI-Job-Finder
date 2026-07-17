import { api } from '@/services/api';
import { ProfessionalInfoFormValues, ProfessionalInfoResponse } from '../types/professional-info';

export const professionalInfoService = {
  getProfessionalInfo: async (): Promise<ProfessionalInfoResponse> => {
    const response = await api.get('/profile/professional');
    return response.data;
  },

  updateProfessionalInfo: async (data: ProfessionalInfoFormValues): Promise<ProfessionalInfoResponse> => {
    const response = await api.put('/profile/professional', data);
    return response.data;
  },
};
