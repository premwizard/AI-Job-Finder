import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { WorkExperienceTimeline } from './WorkExperienceTimeline';
import { WorkExperienceDialog } from './WorkExperienceDialog';
import { 
  useWorkExperiences, 
  useCreateWorkExperience, 
  useUpdateWorkExperience, 
  useDeleteWorkExperience 
} from '../../../hooks/useWorkExperience';
import { WorkExperience, WorkExperienceCreate } from '../../../types/workExperience';

export function WorkExperienceSection() {
  const { data: experiences = [], isLoading } = useWorkExperiences();
  const createMutation = useCreateWorkExperience();
  const updateMutation = useUpdateWorkExperience();
  const deleteMutation = useDeleteWorkExperience();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  const handleAddClick = () => {
    setEditingExperience(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (experience: WorkExperience) => {
    setEditingExperience(experience);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    if (confirm('Are you sure you want to delete this work experience?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (data: WorkExperienceCreate) => {
    if (editingExperience) {
      updateMutation.mutate(
        { id: editingExperience.id, data },
        { onSuccess: () => setIsDialogOpen(false) }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => setIsDialogOpen(false) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Add your past and current roles to build your professional timeline.
          </p>
        </div>
        <Button onClick={handleAddClick} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-32 bg-muted animate-pulse rounded-lg" />
        </div>
      ) : (
        <WorkExperienceTimeline 
          experiences={experiences} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
      )}

      <WorkExperienceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        experience={editingExperience} 
        onSave={handleSave} 
      />
    </div>
  );
}
