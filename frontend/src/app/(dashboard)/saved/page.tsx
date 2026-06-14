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
  FileText
} from "lucide-react";
import Link from "next/link";

export default function SavedJobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookmarkCheck className="w-8 h-8 text-primary" />
            Saved Jobs
          </h2>
          <p className="text-muted-foreground mt-1">
            You have {savedJobs.length} saved jobs.
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
        {savedJobs.map((job) => (
          <Card key={job.id} className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-2xl text-primary shrink-0 shadow-inner">
                  {job.company[0]}
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div>
                      <Link href={`/jobs/${job.id}`}>
                        <h3 className="text-xl font-bold hover:text-primary transition-colors cursor-pointer">{job.title}</h3>
                      </Link>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1.5"><Building2 className="w-4 h-4" /> {job.company}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</span>
                        <span className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {job.type}</span>
                        <span className="font-semibold text-foreground bg-muted px-2 py-0.5 rounded">{job.salary}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-end">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Required Skills you have:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map(s => <Badge key={s} variant="secondary" className="bg-primary/5 text-primary/80">{s}</Badge>)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-end gap-2 shrink-0 mt-4 sm:mt-0">
                        <Button variant="outline" className="gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-border/50">
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
        ))}
      </div>
    </div>
  );
}

const savedJobs = [
  {
    id: 1,
    title: "Senior AI Engineer",
    company: "TechNova",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$150k - $200k",
    matchScore: 95,
    skills: ["Python", "PyTorch", "LLMs", "Transformers"],
    missingSkills: ["Docker"]
  },
  {
    id: 3,
    title: "AI Product Engineer",
    company: "InnovateAI",
    location: "Remote",
    type: "Full-time",
    salary: "$140k - $180k",
    matchScore: 88,
    skills: ["Python", "React", "Next.js", "LangChain"],
    missingSkills: ["System Design"]
  }
];
