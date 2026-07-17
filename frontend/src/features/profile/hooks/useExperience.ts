import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { experienceApi } from "../services/experience.api";
import { WorkExperienceCreate, WorkExperienceUpdate } from "../types/experience";

export const useExperience = () => {
  const queryClient = useQueryClient();

  const { data: experiences, isLoading, isError } = useQuery({
    queryKey: ["experience"],
    queryFn: experienceApi.getExperience,
  });

  const addExperienceMutation = useMutation({
    mutationFn: (data: WorkExperienceCreate) => experienceApi.addExperience(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });

  const updateExperienceMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: WorkExperienceUpdate }) =>
      experienceApi.updateExperience(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });

  const deleteExperienceMutation = useMutation({
    mutationFn: (id: string) => experienceApi.deleteExperience(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
  });

  return {
    experiences,
    isLoading,
    isError,
    addExperience: addExperienceMutation.mutate,
    updateExperience: updateExperienceMutation.mutate,
    deleteExperience: deleteExperienceMutation.mutate,
    addExperienceAsync: addExperienceMutation.mutateAsync,
    updateExperienceAsync: updateExperienceMutation.mutateAsync,
    deleteExperienceAsync: deleteExperienceMutation.mutateAsync,
    isAdding: addExperienceMutation.isPending,
    isUpdating: updateExperienceMutation.isPending,
    isDeleting: deleteExperienceMutation.isPending,
  };
};
