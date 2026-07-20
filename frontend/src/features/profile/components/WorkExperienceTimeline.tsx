import { WorkExperience } from '../../../types/workExperience';
import { WorkExperienceCard } from './WorkExperienceCard';

interface WorkExperienceTimelineProps {
  experiences: WorkExperience[];
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: number) => void;
}

export function WorkExperienceTimeline({ experiences, onEdit, onDelete }: WorkExperienceTimelineProps) {
  if (!experiences || experiences.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg border-dashed bg-muted/30">
        <h3 className="text-lg font-medium text-muted-foreground">No work experience added yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your past roles to improve your profile matches.</p>
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-muted ml-6 pl-8 space-y-8 py-4">
      {experiences.map((experience, index) => (
        <div key={experience.id} className="relative">
          {/* Timeline Node */}
          <div className="absolute -left-[41px] top-4 w-4 h-4 rounded-full bg-primary border-4 border-background" />
          
          <WorkExperienceCard 
            experience={experience} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </div>
      ))}
    </div>
  );
}
