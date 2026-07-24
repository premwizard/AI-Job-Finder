"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLearningRoadmap, regenerateLearningRoadmap } from "@/features/jobs/services/learning.api";
import { getJob } from "@/features/jobs/services/jobs.api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, BookOpen, Clock, Target, TrendingUp, RefreshCw, ChevronLeft, Flag } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LearningRoadmapPage() {
  const params = useParams();
  const id = Number(params.id);
  const queryClient = useQueryClient();

  const { data: job, isLoading: jobLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => getJob(id),
    enabled: !!id
  });

  const { data: roadmapData, isLoading: roadmapLoading } = useQuery({
    queryKey: ['learningRoadmap', id],
    queryFn: () => getLearningRoadmap(id),
    enabled: !!job?.ai_processed,
    retry: false
  });

  const regenerateMutation = useMutation({
    mutationFn: () => regenerateLearningRoadmap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningRoadmap', id] });
    }
  });

  if (jobLoading || roadmapLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!roadmapData || !roadmapData.roadmap) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto pb-10">
        <Link href={`/jobs/${id}`}>
          <Button variant="ghost" className="gap-2 pl-0 hover:bg-transparent">
            <ChevronLeft className="w-4 h-4" /> Back to Job
          </Button>
        </Link>
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold">No Roadmap Available</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We haven't generated a learning roadmap for this job yet. Or maybe you don't have any skill gaps!
          </p>
          <Button onClick={() => regenerateMutation.mutate()} className="mt-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
            <RefreshCw className="w-4 h-4" /> Generate Roadmap
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href={`/jobs/${id}`}>
          <Button variant="outline" size="icon" className="h-10 w-10">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-indigo-950">Learning Roadmap</h2>
          <p className="text-indigo-800/60 mt-1">
            Personalized learning path to close the gap for <span className="font-semibold">{job?.job_title}</span>
          </p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => regenerateMutation.mutate()} disabled={regenerateMutation.isPending} variant="outline" className="gap-2">
            {regenerateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Regenerate Roadmap
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 shadow-sm border-indigo-100">
          <CardHeader className="bg-slate-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Step-by-Step Learning Path
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              {roadmapData.roadmap.map((phase: any, index: number) => (
                <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-indigo-500 text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    {phase.phase}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-lg mb-4 text-indigo-900">Phase {phase.phase}</h3>
                    <div className="space-y-4">
                      {phase.skills.map((skill: any, i: number) => (
                        <div key={i} className="flex flex-col gap-2 p-3 rounded-md bg-slate-50 border border-slate-100">
                          <div className="flex justify-between items-start">
                            <span className="font-semibold text-slate-800">{skill.skill_name}</span>
                            <Badge variant="outline" className={`${skill.importance === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700'}`}>
                              {skill.importance}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {skill.estimated_time}</span>
                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {skill.difficulty}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-green-100 shadow-sm bg-gradient-to-br from-green-50/50 to-white">
            <CardHeader className="pb-3 border-b border-green-100">
              <CardTitle className="text-lg flex items-center gap-2 text-green-900">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Projected Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {roadmapData.projected_improvements.map((proj: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b border-green-100/50 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-800">{proj.milestone}</span>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700 font-bold px-3 py-1 text-sm shadow-sm">
                    {proj.projected_score}% Match
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-indigo-100 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Career Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Readiness Level</span>
                <p className="font-semibold text-indigo-900 text-lg mt-1">{roadmapData.career_growth_insights.readiness_level}</p>
              </div>
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</span>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">{roadmapData.career_growth_insights.summary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
