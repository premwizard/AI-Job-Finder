"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Target, 
  FileText, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Building2, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  AlertCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";
import { jobsService } from "@/services/jobs";
import { analyticsService } from "@/services/analytics";
import { resumeService } from "@/services/resume";

export default function DashboardPage() {
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser
  });

  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: analyticsService.getAnalytics
  });

  const { data: recommendedJobs, isLoading: isJobsLoading } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: jobsService.getRecommendedJobs
  });

  const { data: resume, isLoading: isResumeLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: resumeService.getResume,
    retry: false // Might not have a resume yet
  });

  if (isUserLoading || isAnalyticsLoading || isJobsLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const jobsFound = analytics?.jobs_found || 0;
  const matchedJobs = analytics?.matched_jobs || 0;
  const applicationsSent = analytics?.applications_sent || 0;
  const resumeScore = resume?.resume_score || 0;
  const atsScore = resume?.ats_score || 0;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hello, {user?.full_name?.split(' ')[0] || 'User'} 👋</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            Your AI Career Assistant is active and analyzing the job market.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/resume">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Update Resume
            </Button>
          </Link>
          <Link href="/jobs">
            <Button className="gap-2">
              <Target className="w-4 h-4" />
              Find Match
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Match Score</CardTitle>
            <BrainCircuit className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{resumeScore > 0 ? `${resumeScore}%` : 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">Based on target role: {user?.preferred_role || 'Any'}</p>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: `${resumeScore}%` }} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Strength</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{atsScore >= 80 ? 'Strong' : atsScore > 0 ? 'Average' : 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">ATS Score: {atsScore}/100</p>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${atsScore}%` }} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Found</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsFound}</div>
            <p className="text-xs text-muted-foreground mt-1">Total scraped jobs</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highly Matched</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{matchedJobs}</div>
            <p className="text-xs text-muted-foreground mt-1">Jobs matching your profile</p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Applications Sent</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{applicationsSent}</div>
            <p className="text-xs text-muted-foreground mt-1">Total applications submitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Main Content Area */}
        <div className="lg:col-span-4 space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>AI-selected roles matching your profile</CardDescription>
              </div>
              <Link href="/jobs">
                <Button variant="ghost" size="sm" className="gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendedJobs?.length > 0 ? recommendedJobs.map((job: any) => (
                <div key={job.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {job.company_name[0]}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg hover:underline cursor-pointer">{job.job_title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company_name}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location || 'Remote'}</span>
                          {job.salary && <span className="flex items-center gap-1 text-primary/80 font-medium">{job.salary}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {job.score || 95}% Match
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-3 flex flex-wrap items-center gap-2 border-t border-border/50 mt-4">
                      <Link href={`/jobs/${job.id}`}>
                        <Button size="sm" variant="default" className="flex-1 sm:flex-none">View Job</Button>
                      </Link>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none">Save</Button>
                      <Button size="sm" variant="secondary" className="flex-1 sm:flex-none gap-2 bg-primary/10 text-primary hover:bg-primary/20">
                        <FileText className="w-4 h-4" /> Cover Letter
                      </Button>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground">No recommended jobs found at the moment.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                Skill Gap Detected
              </CardTitle>
              <CardDescription>Top skills requested in your matched jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Docker</Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Kubernetes</Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">System Design</Badge>
                  <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">AWS</Badge>
                </div>
                <Button variant="outline" className="w-full text-xs h-8">View Learning Roadmap</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent AI Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary/20" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card/50 text-sm">
                    <p className="font-medium text-foreground">Scanned new jobs</p>
                    <time className="text-xs text-muted-foreground">Today</time>
                  </div>
                </div>
                <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary/20" />
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card/50 text-sm">
                    <p className="font-medium text-foreground">Updated Resume Match</p>
                    <time className="text-xs text-muted-foreground">Yesterday</time>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
