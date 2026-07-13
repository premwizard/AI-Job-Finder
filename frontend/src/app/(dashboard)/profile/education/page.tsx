"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, GraduationCap, Calendar, Award } from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export default function EducationPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const educations = profile?.educations || [];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Education</h2>
          <p className="text-sm text-muted-foreground">List your academic background and achievements.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No education added</h3>
          <p className="text-muted-foreground mt-1 mb-6">Add your educational background.</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Education
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {educations.map((edu: any) => (
            <Card key={edu.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <GraduationCap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">{edu.institution}</h3>
                        <p className="font-medium mt-1">
                          {edu.degree} {edu.major && `in ${edu.major}`}
                        </p>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-3">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {edu.start_date ? format(new Date(edu.start_date), "yyyy") : ""} - {" "}
                              {edu.end_date ? format(new Date(edu.end_date), "yyyy") : "Present"}
                            </span>
                          </div>
                          {edu.cgpa && (
                            <div className="flex items-center gap-1.5 font-medium text-foreground">
                              <Award className="w-4 h-4 text-amber-500" />
                              <span>CGPA: {edu.cgpa}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 md:self-start">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
