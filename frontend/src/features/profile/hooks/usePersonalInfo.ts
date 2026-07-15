import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService, PersonalInfoResponse } from '../services/personal-info.service';
import { PersonalInfoFormValues } from '../utils/validators';

const QUERY_KEY = ['personalInfo'];

export const useGetPersonalInfo = () => {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: profileService.getPersonalInfo,
  });
};

export const useUpdatePersonalInfo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PersonalInfoFormValues) => profileService.updatePersonalInfo(data),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, data);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData(QUERY_KEY, (old: PersonalInfoResponse | undefined) => {
        if (!old) return old;
        return { ...old, profile_picture_url: data.url };
      });
    },
  });
};

export const useDeleteAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.deleteAvatar(),
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY, (old: PersonalInfoResponse | undefined) => {
        if (!old) return old;
        return { ...old, profile_picture_url: undefined };
      });
    },
  });
};
