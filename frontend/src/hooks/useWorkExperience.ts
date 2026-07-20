import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workExperienceService } from '../services/workExperience';
import { WorkExperienceCreate, WorkExperienceUpdate } from '../types/workExperience';
import { toast } from 'sonner';

export const WORK_EXPERIENCE_KEYS = {
  all: ['workExperience'] as const,
};

export function useWorkExperiences() {
  return useQuery({
    queryKey: WORK_EXPERIENCE_KEYS.all,
    queryFn: workExperienceService.getAll,
  });
}

export function useCreateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkExperienceCreate) => workExperienceService.create(data),
    onSuccess: () => {
      toast.success('Work experience added successfully');
      queryClient.invalidateQueries({ queryKey: WORK_EXPERIENCE_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to add work experience');
    },
  });
}

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: WorkExperienceUpdate }) => 
      workExperienceService.update(id, data),
    onSuccess: () => {
      toast.success('Work experience updated successfully');
      queryClient.invalidateQueries({ queryKey: WORK_EXPERIENCE_KEYS.all });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || 'Failed to update work experience');
    },
  });
}

export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => workExperienceService.delete(id),
    onSuccess: () => {
      toast.success('Work experience deleted successfully');
      queryClient.invalidateQueries({ queryKey: WORK_EXPERIENCE_KEYS.all });
    },
    onError: (error: any) => {
      toast.error('Failed to delete work experience');
    },
  });
}
