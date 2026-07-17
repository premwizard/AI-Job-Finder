import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsService } from '../services/skills.service';
import { SkillFormValues, SkillResponse } from '../types/skills';

export function useGetSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: skillsService.getSkills,
  });
}

export function useAddSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsService.addSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
      queryClient.invalidateQueries({ queryKey: ['fullProfile'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SkillFormValues> }) => 
      skillsService.updateSkill(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['fullProfile'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skillsService.deleteSkill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      queryClient.invalidateQueries({ queryKey: ['profileCompletion'] });
      queryClient.invalidateQueries({ queryKey: ['fullProfile'] });
    },
  });
}
