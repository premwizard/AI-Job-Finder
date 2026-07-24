"use client";

import { Card, CardContent } from "@/components/ui/card";
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
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getJobs, Job, refreshJobs } from "@/features/jobs/services/jobs.api";
import { parseAllJobs } from "@/features/jobs/services/job_parsing.api";
import { useState } from "react";
import { jobsService } from "@/services/jobs";

export default function JobsPage() {
  const queryClient = useQueryClient();

  // Filters State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState<boolean | undefined>(undefined);

  const { data, isLoading } = useQuery({
    queryKey: ['jobs', page, search, location, isRemote],
    queryFn: () => getJobs({ page, size: 20, search, location, is_remote: isRemote }),
    placeholderData: (previousData) => previousData
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

  const parseAllJobsMutation = useMutation({
    mutationFn: () => parseAllJobs(),
    onSuccess: () => {
      alert("Background parsing job started successfully!");
    }
  });

  const refreshJobsMutation = useMutation({
    mutationFn: () => refreshJobs(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      alert("New jobs fetched successfully!");
    }
  });

  if (isLoading && !data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const jobList = data?.items || [];
  const totalJobs = data?.total || 0;
  const totalPages = data?.pages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Job Matches</h2>
          <p className="text-muted-foreground mt-1">
            We found {totalJobs} jobs that match your profile.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/jobs/analytics">
            <Button variant="outline" className="gap-2">
              <Sparkles className="w-4 h-4 text-indigo-500" /> 
              Job Parsing Analytics
            </Button>
          </Link>
          <Button 
            variant="outline"
            className="gap-2 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
            onClick={() => parseAllJobsMutation.mutate()}
            disabled={parseAllJobsMutation.isPending}
          >
            {parseAllJobsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Parse Unprocessed Jobs with AI
          </Button>
          <Button onClick={() => refreshJobsMutation.mutate()} disabled={refreshJobsMutation.isPending} className="gap-2">
            {refreshJobsMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Fetch New Jobs
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search job titles, skills, or companies..." 
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="relative md:w-48">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-9" 
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button variant="outline" className="gap-2 shrink-0 w-full md:w-auto">
              <Filter className="w-4 h-4" />
              More Filters
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-border/20">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Remote:</Label>
              <Badge 
                variant={isRemote ? "default" : "outline"}
                className={`px-3 py-1 text-sm cursor-pointer ${isRemote ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
                onClick={() => {
                  setIsRemote(prev => prev === true ? undefined : true);
                  setPage(1);
                }}
              >
                Remote Only
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4">
        {jobList.length > 0 ? jobList.map((job: Job) => (
          <Card key={job.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0 shadow-inner">
                  {job.company_logo ? (
                    <img src={job.company_logo} alt={job.company_name} className="w-full h-full object-contain rounded-xl" />
                  ) : (
                    job.company_name?.[0] || 'A'
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">{job.job_title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company_name}</span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" /> 
                          {job.locations?.map(l => l.city || l.country || (l.is_remote ? 'Remote' : '')).join(', ') || 'Remote'}
                        </span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.employment_type || 'Full-time'}</span>
                        {job.salary_available && job.min_salary && (
                          <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">
                            {job.salary_currency}{job.min_salary} - {job.max_salary}
                          </span>
                        )}
                        <Badge variant="secondary" className="text-xs">{job.source}</Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2 pt-2">
                            {job.skills?.slice(0, 5).map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                {skill.skill_name}
                              </Badge>
                            ))}
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
          <div className="text-center p-8 bg-card/50 rounded-lg border border-border/50">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm font-medium mx-4">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
