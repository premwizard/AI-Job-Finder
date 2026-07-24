import { api } from '@/services/api';
import { PersonalInfoFormValues } from '../utils/validators';

export interface PersonalInfoResponse extends PersonalInfoFormValues {
  email?: string;
  is_verified?: boolean;
  profile_picture_url?: string;
  cover_banner_url?: string;
}

export const profileService = {
  getPersonalInfo: async (): Promise<PersonalInfoResponse> => {
    const response = await api.get('/profile/personal');
    return response.data;
  },

  updatePersonalInfo: async (data: PersonalInfoFormValues): Promise<PersonalInfoResponse> => {
    const response = await api.put('/profile/personal', data);
    return response.data;
  },

  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteAvatar: async (): Promise<void> => {
    await api.delete('/profile/avatar');
  },
};
