"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  MapPin, 
  Building2, 
  Briefcase, 
  Filter, 
  Bookmark, 
  FileText,
  Sparkles,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs";

export default function JobsPage() {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['recommendedJobs'],
    queryFn: jobsService.getRecommendedJobs
  });

  const saveJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.saveJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
      // In a real app, show a toast notification
      alert("Job saved successfully!");
    }
  });

  const applyJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.applyToJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      // In a real app, show a toast notification
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

  const jobList = jobs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Job Matches</h2>
          <p className="text-muted-foreground mt-1">
            We found {jobList.length} jobs that match your profile.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search job titles, skills, or companies..." className="pl-9" />
            </div>
            <div className="relative md:w-48">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Location" className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2 shrink-0 w-full md:w-auto">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Remote:</Label>
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 cursor-pointer">Remote Only</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Experience:</Label>
              <select className="bg-background border border-input rounded-md text-sm px-3 py-1.5 focus:ring-2 focus:ring-ring focus:outline-none h-9">
                <option>Any Level</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Level</option>
              </select>
            </div>
             <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Salary (Min):</Label>
              <select className="bg-background border border-input rounded-md text-sm px-3 py-1.5 focus:ring-2 focus:ring-ring focus:outline-none h-9">
                <option>Any Salary</option>
                <option>$80k+</option>
                <option>$120k+</option>
                <option>$160k+</option>
              </select>
            </div>
            <div className="flex items-center gap-2 flex-1 md:justify-end">
              <Label className="text-sm font-medium mr-2">Skills:</Label>
              <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer">Python</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer">Machine Learning</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm border-dashed text-muted-foreground hover:text-foreground hover:border-foreground cursor-pointer">+ Add Skill</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4">
        {jobList.length > 0 ? jobList.map((job: any) => (
          <Card key={job.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0 shadow-inner">
                  {job.company_name?.[0] || 'A'}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">{job.job_title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company_name}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location || 'Remote'}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.employment_type || 'Full-time'}</span>
                        {job.salary && <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{job.salary}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">AI Match</span>
                        <div className="relative w-12 h-12 flex items-center justify-center font-bold text-primary">
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted opacity-20" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${(job.score || 95) * 1.25} 125`} className="text-primary" />
                          </svg>
                          <span className="relative text-sm">{job.score || 95}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="space-y-3">
                        {/* Not displaying required/missing skills yet since backend doesn't provide them easily in this endpoint */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            {/* Dummy skills badges since backend doesn't provide detailed missing skills mapping yet */}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-end gap-2 shrink-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-muted-foreground hover:text-primary"
                          onClick={() => saveJobMutation.mutate(job.id)}
                          disabled={saveJobMutation.isPending}
                        >
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Cover Letter
                        </Button>
                        <Button 
                          variant="default" 
                          className="gap-2 bg-blue-600 hover:bg-blue-700 text-white border-transparent"
                          onClick={() => applyJobMutation.mutate(job.id)}
                          disabled={applyJobMutation.isPending}
                        >
                          Apply
                        </Button>
                        <Link href={`/jobs/${job.id}`}>
                          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <p className="text-muted-foreground">No jobs found matching your criteria.</p>
        )}
      </div>
    </div>
  );
}
