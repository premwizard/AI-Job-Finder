import { useState } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Trash2, MapPin, Building2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { WorkExperience } from '../../../types/workExperience';

interface WorkExperienceCardProps {
  experience: WorkExperience;
  onEdit: (experience: WorkExperience) => void;
  onDelete: (id: number) => void;
}

export function WorkExperienceCard({ experience, onEdit, onDelete }: WorkExperienceCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Present';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="group relative rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start gap-4">
          <div className="flex gap-4 flex-1">
            {/* Logo placeholder if no logo is available */}
            <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center shrink-0 border">
              {experience.company_logo ? (
                <img src={experience.company_logo} alt={experience.company_name} className="h-full w-full object-cover rounded-md" />
              ) : (
                <Building2 className="h-6 w-6 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-none tracking-tight mb-1">
                {experience.role}
              </h3>
              <div className="text-sm text-muted-foreground mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-medium text-foreground">{experience.company_name}</span>
                <span className="hidden sm:inline">•</span>
                <span>{experience.employment_type}</span>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2 mb-3">
                <span>
                  {formatDate(experience.start_date)} - {experience.is_current ? 'Present' : formatDate(experience.end_date)}
                </span>
                {experience.location && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {experience.location} ({experience.work_model})
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(experience)} className="h-8 w-8">
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(experience.id)} className="h-8 w-8 text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(experience.description || experience.skills_used?.length > 0) && (
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 h-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" /> Show less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" /> Show more
                </>
              )}
            </Button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 border-t mt-2">
                    {experience.description && (
                      <div className="text-sm whitespace-pre-wrap text-muted-foreground mb-4">
                        {experience.description}
                      </div>
                    )}
                    
                    {experience.skills_used && experience.skills_used.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Skills Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {experience.skills_used.map(skill => (
                            <Badge key={skill.id} variant="secondary">
                              {skill.skill_name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
