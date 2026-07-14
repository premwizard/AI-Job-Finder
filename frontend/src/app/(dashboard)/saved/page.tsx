"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Building2, 
  Briefcase, 
  Filter, 
  BookmarkCheck, 
  FileText,
  Loader2
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { jobsService } from "@/services/jobs";

export default function SavedJobsPage() {
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ['savedJobs'],
    queryFn: jobsService.getSavedJobs
  });

  const removeJobMutation = useMutation({
    mutationFn: (id: number) => jobsService.removeSavedJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedJobs'] });
    }
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const jobList = savedJobs || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-8 h-8 text-primary" />
            Saved Jobs
          </h2>
          <p className="text-muted-foreground mt-1">
            You have {jobList.length} saved jobs.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search saved jobs..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4">
        {jobList.length > 0 ? jobList.map((item: any) => {
          const job = item.job;
          return (
          <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
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
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {job.score || 95}% Match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 pt-2">
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-end gap-2 shrink-0 mt-4 sm:mt-0">
                        <Button 
                          variant="outline" 
                          className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-border/50"
                          onClick={() => removeJobMutation.mutate(job.id)}
                          disabled={removeJobMutation.isPending}
                        >
                          Remove
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Cover Letter
                        </Button>
                        <Link href={`/jobs/${job.id}`}>
                          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                            Apply
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}) : (
          <p className="text-muted-foreground">You haven&apos;t saved any jobs yet.</p>
        )}
      </div>
    </div>
  );
}
