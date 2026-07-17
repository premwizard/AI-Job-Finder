'use client';

import React from 'react';
import { useGetProfessionalInfo } from '@/features/profile/hooks/useProfessionalInfo';
import { ProfessionalInfoForm } from '@/features/profile/components/ProfessionalInformation/ProfessionalInfoForm';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ProfessionalInformationPage() {
  const { data, isLoading, error } = useGetProfessionalInfo();

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-2 mb-8">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-5 w-2/3" />
        </div>
        {[1, 2, 3].map(i => (
          <Card key={i} className="rounded-xl border-border/40">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-1/4" />
              <div className="grid grid-cols-2 gap-6">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Failed to load professional information</h2>
        <p className="text-muted-foreground">Please try again later.</p>
      </div>
    );
  }

  // Calculate completion
  let fieldsCompleted = 0;
  const totalFields = 5; // current_job_title, industry, career_level, expected_salary, notice_period
  
  if (data) {
    if (data.current_job_title) fieldsCompleted++;
    if (data.industry) fieldsCompleted++;
    if (data.career_level) fieldsCompleted++;
    if (data.expected_salary) fieldsCompleted++;
    if (data.notice_period) fieldsCompleted++;
  }
  
  const isComplete = fieldsCompleted === totalFields;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-bold tracking-tight">Professional Information</h1>
          <p className="text-muted-foreground text-lg">
            Tell us about your professional background to improve AI-powered job recommendations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isComplete ? (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 px-3 py-1 text-sm">
              Complete Profile
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-500/20 px-3 py-1 text-sm">
              Incomplete ({fieldsCompleted}/{totalFields})
            </Badge>
          )}
        </div>
      </div>

      <ProfessionalInfoForm initialData={data || {}} />
    </div>
  );
}
