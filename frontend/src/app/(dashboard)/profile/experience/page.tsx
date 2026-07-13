"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Briefcase, Calendar, MapPin, Building } from "lucide-react";
import { format } from "date-fns";

export default function ExperiencePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const experiences = profile?.experiences || [];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Work Experience</h2>
          <p className="text-sm text-muted-foreground">Showcase your professional journey and achievements.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No experience added</h3>
          <p className="text-muted-foreground mt-1 mb-6">Add your past work experience to build your profile.</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Experience
          </Button>
        </div>
      ) : (
        <div className="relative border-l border-muted ml-3 md:ml-6 space-y-10 py-4">
          {experiences.map((exp: any, i: number) => (
            <div key={exp.id} className="relative pl-8 md:pl-10">
              <div className="absolute -left-3.5 md:-left-4 top-1 w-7 h-7 md:w-8 md:h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-sm">
                <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
              
              <div className="bg-card border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-primary font-medium mt-1">
                      <Building className="w-4 h-4" />
                      {exp.company_name}
                      {exp.employment_type && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-normal ml-2">
                          {exp.employment_type}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 md:self-start">Edit</Button>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {exp.start_date ? format(new Date(exp.start_date), "MMM yyyy") : ""} - {" "}
                      {exp.is_current ? "Present" : (exp.end_date ? format(new Date(exp.end_date), "MMM yyyy") : "")}
                    </span>
                  </div>
                  {exp.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>{exp.location}</span>
                    </div>
                  )}
                </div>

                {exp.description && (
                  <p className="text-sm mt-4 text-foreground/90 leading-relaxed whitespace-pre-wrap">
                    {exp.description}
                  </p>
                )}
                
                {exp.technologies && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {exp.technologies.split(",").map((tech: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-md">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
