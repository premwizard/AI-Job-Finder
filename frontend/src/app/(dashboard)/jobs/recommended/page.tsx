"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecommendedJobs, recalculateMatches } from "@/features/jobs/services/job_matching.api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, MapPin, Building2, ChevronRight, RefreshCw, Target } from "lucide-react";
import Link from "next/link";

export default function RecommendedJobsPage() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: () => getRecommendedJobs(20)
  });

  const recalculateMutation = useMutation({
    mutationFn: () => recalculateMatches(),
    onSuccess: () => {
      alert("AI is recalculating your matches in the background!");
    }
  });

  if (isLoading && !jobs) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Recommended Jobs</h2>
          <p className="text-muted-foreground mt-1">
            Jobs tailored specifically to your profile, skills, and experience.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => recalculateMutation.mutate()} 
            disabled={recalculateMutation.isPending}
            variant="outline"
            className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
          >
            {recalculateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Recalculate Matches
          </Button>
          <Button onClick={() => refetch()} className="gap-2">
            Refresh List
          </Button>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold">No matches calculated yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We haven't calculated your AI matches yet. Click "Recalculate Matches" to run the semantic matching engine.
          </p>
          <Button onClick={() => recalculateMutation.mutate()} className="mt-6 gap-2">
            <Sparkles className="w-4 h-4" /> Start AI Matching
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden border-l-4 border-l-indigo-500">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="text-xl font-bold">{job.job_title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Building2 className="w-4 h-4" /> {job.company_name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50/50 p-4 rounded-lg border border-indigo-100/50">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-medium text-sm text-indigo-900 mb-1">AI Recommendation Summary</p>
                          <ul className="text-sm text-indigo-800 space-y-1 list-disc list-inside">
                            {job.explanation_summary ? job.explanation_summary.split('\n').filter(s => s.trim().length > 0).map((bullet, i) => (
                              <li key={i}>{bullet.replace(/^[-\*\✓]\s*/, '')}</li>
                            )) : <li>Strong match based on semantic profile analysis.</li>}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {job.matched_skills.slice(0, 5).map(skill => (
                        <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                          {skill}
                        </Badge>
                      ))}
                      {job.missing_skills.slice(0, 3).map(skill => (
                        <Badge key={skill} variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                          Missing: {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between shrink-0 md:w-48">
                    <div className="text-right">
                      <div className="text-3xl font-black text-indigo-600">
                        {Math.round(job.overall_score)}%
                      </div>
                      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">
                        Match Score
                      </div>
                    </div>
                    <Link href={`/jobs/${job.id}`}>
                      <Button className="w-full gap-2 mt-4 md:mt-0">
                        View Details <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
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
