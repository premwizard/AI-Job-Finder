import React, { useState } from 'react';
import { format, differenceInMonths, differenceInYears } from 'date-fns';
import { Building2, Calendar, MapPin, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkExperience } from '../../types/experience';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useExperience } from '../../hooks/useExperience';
import { toast } from 'sonner';

interface ExperienceCardProps {
  experience: WorkExperience;
  onEdit: (experience: WorkExperience) => void;
}

export function ExperienceCard({ experience, onEdit }: ExperienceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { deleteExperienceAsync } = useExperience();

  const formatDuration = (start: string | undefined, end: string | undefined, isCurrent: boolean) => {
    if (!start) return '';
    const startDate = new Date(start);
    const endDate = isCurrent || !end ? new Date() : new Date(end);
    
    const totalMonths = differenceInMonths(endDate, startDate) + 1; // +1 to make it inclusive
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    const parts = [];
    if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} mo${months > 1 ? 's' : ''}`);
    
    return parts.join(' ');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'MMM yyyy');
  };

  const handleDelete = async () => {
    try {
      await deleteExperienceAsync(experience.id);
      toast.success('Experience deleted successfully');
    } catch (error) {
      toast.error('Failed to delete experience');
    }
  };

  const hasContent = experience.description || experience.achievements || (experience.skills && experience.skills.length > 0);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
            <Building2 className="h-6 w-6 text-muted-foreground" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg">{experience.role}</h3>
                <div className="text-muted-foreground font-medium">{experience.company_name}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onEdit(experience)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this work experience.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                </span>
                <span className="hidden sm:inline">
                  {' · '}
                  {formatDuration(experience.start_date, experience.end_date, experience.is_current)}
                </span>
              </div>
              
              {experience.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{experience.location}</span>
                  {experience.work_model && <span>({experience.work_model})</span>}
                </div>
              )}
            </div>

            {(experience.employment_type || experience.department) && (
              <div className="flex flex-wrap gap-2 mt-3">
                {experience.employment_type && (
                  <Badge variant="secondary" className="font-normal">{experience.employment_type}</Badge>
                )}
                {experience.department && (
                  <Badge variant="outline" className="font-normal">{experience.department}</Badge>
                )}
              </div>
            )}
            
            {hasContent && (
              <div className="mt-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 p-0 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <><ChevronUp className="mr-2 h-4 w-4" /> Show less</>
                  ) : (
                    <><ChevronDown className="mr-2 h-4 w-4" /> Show details</>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {expanded && hasContent && (
          <div className="mt-6 ml-0 sm:ml-16 space-y-6 animate-in slide-in-from-top-2">
            
            {experience.description && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: experience.description }} 
                />
              </div>
            )}

            {experience.achievements && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Key Achievements</h4>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert"
                  dangerouslySetInnerHTML={{ __html: experience.achievements }} 
                />
              </div>
            )}

            {experience.skills && experience.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Skills Used</h4>
                <div className="flex flex-wrap gap-2">
                  {experience.skills.map(skill => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.skill_name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}
      </CardContent>
    </Card>
  );
}
