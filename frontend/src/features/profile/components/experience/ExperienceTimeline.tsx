'use client';

import React, { useState } from 'react';
import { Plus, BriefcaseBusiness, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExperienceCard } from './ExperienceCard';
import { ExperienceDialog } from './ExperienceDialog';
import { useExperience } from '../../hooks/useExperience';
import { WorkExperience } from '../../types/experience';

export function ExperienceTimeline() {
  const { experiences, isLoading, isError } = useExperience();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState<WorkExperience | null>(null);

  const handleAddClick = () => {
    setExperienceToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (experience: WorkExperience) => {
    setExperienceToEdit(experience);
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-destructive">
        Failed to load work experience. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Work Experience</h2>
          <p className="text-muted-foreground">
            Highlight your career progression and key responsibilities.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {!experiences || experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center animate-in fade-in-50">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <BriefcaseBusiness className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">No work experience added</h3>
          <p className="mt-2 text-sm text-muted-foreground max-w-sm">
            Add your professional experience to stand out to employers and get better job matches.
          </p>
          <Button onClick={handleAddClick} className="mt-6" variant="secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Experience
          </Button>
        </div>
      ) : (
        <div className="relative space-y-6 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-muted-foreground/20 before:to-transparent">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              {/* Timeline marker */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-muted text-muted-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <BriefcaseBusiness className="h-4 w-4" />
              </div>
              
              {/* Card wrapper */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)]">
                <ExperienceCard experience={exp} onEdit={handleEditClick} />
              </div>
            </div>
          ))}
        </div>
      )}

      <ExperienceDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        experienceToEdit={experienceToEdit}
      />
    </div>
  );
}
