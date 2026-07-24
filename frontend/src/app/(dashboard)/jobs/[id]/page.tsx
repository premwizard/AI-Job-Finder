"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJob } from "@/features/jobs/services/jobs.api";
import { getParsedJob, parseSingleJob } from "@/features/jobs/services/job_parsing.api";
import { Loader2, Briefcase, Building2, MapPin, Code, Star, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function JobDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id
  });

  const { data: parsedData, isLoading: parsedLoading } = useQuery({
    queryKey: ['parsedJob', id],
    queryFn: () => getParsedJob(id),
    enabled: !!job?.ai_processed
  });

  const parseMutation = useMutation({
    mutationFn: () => parseSingleJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['job', id] });
      queryClient.invalidateQueries({ queryKey: ['parsedJob', id] });
    }
  });

  if (jobLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return <div>Job not found</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="bg-card/50 border border-border/50 rounded-xl p-6 shadow-sm backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          {!job.ai_processed ? (
            <Button 
              onClick={() => parseMutation.mutate()} 
              disabled={parseMutation.isPending}
              className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {parseMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Extract with AI
            </Button>
          ) : (
            <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> AI Processed
            </Badge>
          )}
        </div>

        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-3xl text-primary shrink-0 shadow-inner">
            {job.company_logo ? (
              <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-xl" />
            ) : (
              job.company_name?.[0] || 'A'
            )}
          </div>
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl font-bold tracking-tight">{job.job_title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
              <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company_name}</span>
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.locations?.map((l:any) => l.city || l.country || (l.is_remote ? 'Remote' : '')).join(', ') || 'Remote'}</span>
              <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.employment_type || 'Full-time'}</span>
            </div>
            {job.salary_available && job.min_salary && (
              <div className="mt-4">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200">
                  {job.salary_currency}{job.min_salary} - {job.max_salary} {job.salary_period}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {job.ai_processed && parsedLoading ? (
        <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : job.ai_processed && parsedData ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content (2/3 width) */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-muted-foreground leading-relaxed">{parsedData.ai_summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-500" />
                  Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2">
                <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                  {parsedData.responsibilities?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3">Required</h4>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {parsedData.requirements?.required?.map((r: string, i: number) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
                {parsedData.requirements?.preferred?.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Preferred</h4>
                    <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                      {parsedData.requirements.preferred.map((r: string, i: number) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar (1/3 width) */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-500" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {Object.entries(parsedData.technical_skills || {}).map(([category, skills]: [string, any]) => {
                    if (!skills || skills.length === 0) return null;
                    const formatTitle = category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
                    return (
                      <div key={category}>
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">{formatTitle}</h4>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill: string, i: number) => (
                            <Badge key={i} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl">Benefits</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <ul className="space-y-2">
                  {parsedData.benefits?.map((b: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-xl">Confidence Scores</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {Object.entries(parsedData.confidence || {}).map(([key, score]: [string, any]) => (
                  <div key={key} className="flex items-center justify-between text-sm">
                    <span className="capitalize">{key}</span>
                    <Badge variant={score > 80 ? "default" : score > 50 ? "secondary" : "destructive"}>
                      {score}%
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="p-10 text-center">
            <h3 className="text-lg font-medium">Raw Description</h3>
            <div className="mt-6 text-left whitespace-pre-wrap text-muted-foreground max-w-4xl mx-auto">
              {job.description_clean}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
