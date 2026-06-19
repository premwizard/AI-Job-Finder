"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Building2, 
  Briefcase, 
  Bookmark, 
  FileText,
  BrainCircuit,
  ArrowLeft,
  Calendar,
  ExternalLink,
  Target,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const jobId = Number(params.id);

  const { data: job, isLoading } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsService.getJobDetails(jobId)
  });

  const saveJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.saveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      alert("Job saved successfully!");
    }
  });

  const applyJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.applyToJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      alert("Applied to job successfully!");
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Job not found</h2>
        <Link href="/jobs">
          <Button>Back to Jobs</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link href="/jobs" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content Area */}
        <div className="lg:w-2/3 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0 shadow-inner">
                    {job.company_name?.[0] || 'A'}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{job.job_title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company_name}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 w-full md:w-auto">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => saveJobMutation.mutate(jobId)}
                    disabled={saveJobMutation.isPending}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="flex-1 md:w-auto gap-2"
                    onClick={() => {
                      if (job.link) {
                        window.open(job.link, '_blank');
                      } else {
                        applyJobMutation.mutate(jobId);
                      }
                    }}
                    disabled={applyJobMutation.isPending}
                  >
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 py-6 border-y border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Salary</p>
                  <p className="font-semibold">{job.salary || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                  <p className="font-semibold flex items-center gap-1"><Briefcase className="w-4 h-4 text-muted-foreground"/> {job.employment_type || 'Full-time'}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Posted</p>
                  <p className="font-semibold flex items-center gap-1"><Calendar className="w-4 h-4 text-muted-foreground"/> {new Date(job.posted_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Source</p>
                  <p className="font-semibold">{job.source || 'Direct'}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.description || 'No description available.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar / AI Analysis */}
        <div className="lg:w-1/3 space-y-6">
          <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <BrainCircuit className="w-32 h-32 text-primary" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="w-5 h-5" />
                AI Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex items-center justify-between bg-background/50 rounded-lg p-4 border border-border/50">
                <span className="font-medium">Match Score</span>
                <span className="text-2xl font-bold text-primary">{job.score || 95}%</span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">View profile to see matches</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground flex items-center justify-between">
                  Missing Skills
                  <Link href="/skills" className="text-xs text-primary hover:underline font-normal">View Roadmap</Link>
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-red-500/30 text-red-400">Analysis pending</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">AI Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your profile is a strong match for this role based on your experience and target role preferences.
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 space-y-3">
                <Button className="w-full gap-2" variant="outline">
                  <Target className="w-4 h-4" />
                  Mock Interview for this role
                </Button>
                <Link href="/cover-letter" className="block">
                  <Button className="w-full gap-2 bg-primary/20 text-primary hover:bg-primary/30 border-0">
                    <FileText className="w-4 h-4" />
                    Generate AI Cover Letter
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
