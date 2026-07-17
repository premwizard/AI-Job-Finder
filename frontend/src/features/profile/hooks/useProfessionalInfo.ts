import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { professionalInfoService } from '../services/professional-info.service';
import { ProfessionalInfoFormValues } from '../types/professional-info';

export function useGetProfessionalInfo() {
  return useQuery({
    queryKey: ['professionalInfo'],
    queryFn: professionalInfoService.getProfessionalInfo,
  });
}

export function useUpdateProfessionalInfo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfessionalInfoFormValues) => professionalInfoService.updateProfessionalInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionalInfo'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
      queryClient.invalidateQueries({ queryKey: ['fullProfile'] });
    },
  });
}
