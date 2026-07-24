"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRecommendations, refreshRecommendations } from "@/features/jobs/services/recommendations.api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, MapPin, Building2, ChevronRight, RefreshCw, Target, CheckCircle2, XCircle, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function RecommendedJobsPage() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading, refetch } = useQuery({
    queryKey: ['recommendations'],
    queryFn: () => getRecommendations(20)
  });

  const recalculateMutation = useMutation({
    mutationFn: () => refreshRecommendations(),
    onSuccess: () => {
      alert("AI is recalculating your personalized recommendations in the background!");
    }
  });

  if (isLoading && !jobs) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Top Pick': return 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent';
      case 'Highly Recommended': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Recommended': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Recommended for You</h2>
          <p className="text-muted-foreground mt-1">
            Personalized AI rankings based on your career goals, behavior, and semantic profile.
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
            Refresh Rankings
          </Button>
          <Button onClick={() => refetch()} className="gap-2">
            Refresh List
          </Button>
        </div>
      </div>

      {!jobs || jobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <Target className="w-12 h-12 text-muted-foreground mb-4 opacity-20" />
          <h3 className="text-xl font-semibold">No recommendations yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            We haven't calculated your AI recommendations yet. Click "Refresh Rankings" to run the AI Ranking engine.
          </p>
          <Button onClick={() => recalculateMutation.mutate()} className="mt-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Sparkles className="w-4 h-4" /> Start AI Ranking
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden border-l-4 border-l-indigo-600 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row border-b border-border/50">
                  <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={`mb-2 ${getCategoryColor(job.category)}`}>
                        {job.category}
                      </Badge>
                      <Badge variant="outline" className="flex gap-1 items-center bg-slate-50 text-slate-600">
                        <ShieldCheck className="w-3 h-3 text-green-600" /> {job.confidence_score}% Confidence
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-bold">{job.job_title}</h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1 font-medium text-foreground">
                        <Building2 className="w-4 h-4" /> {job.company_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600" /> 
                        <span className="font-medium text-green-700">{job.career_growth_score}% Growth Potential</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50/50 p-6 flex flex-col items-center justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-border/50">
                    <div className="text-4xl font-black text-indigo-600 tracking-tighter">
                      {Math.round(job.recommendation_score)}
                    </div>
                    <div className="text-xs font-semibold text-indigo-900/60 uppercase tracking-widest mt-1">
                      Rank Score
                    </div>
                    <Link href={`/jobs/${job.id}`} className="mt-4 w-full">
                      <Button className="w-full gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm">
                        View Job <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 bg-slate-50/50">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-green-800 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Why we recommend this
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {job.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">•</span>
                            <span>{strength.replace(/^[-\*\✓]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                        <XCircle className="w-4 h-4 text-amber-600" /> Potential drawbacks
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {job.weaknesses.map((weakness, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500 mt-0.5">•</span>
                            <span>{weakness.replace(/^[-\*\✓]\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-border/50">
                    <span className="text-xs font-semibold text-muted-foreground self-center mr-2 uppercase tracking-wider">Skills:</span>
                    {job.matched_skills.slice(0, 4).map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-green-100/50 text-green-700 hover:bg-green-100 border-green-200">
                        {skill}
                      </Badge>
                    ))}
                    {job.missing_skills.slice(0, 3).map(skill => (
                      <Badge key={skill} variant="outline" className="text-amber-700 border-amber-200 bg-amber-50/50">
                        Missing: {skill}
                      </Badge>
                    ))}
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
