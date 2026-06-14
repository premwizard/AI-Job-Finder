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
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Job Matches</h2>
          <p className="text-muted-foreground mt-1">
            We found {jobs.length} jobs that match your profile.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search job titles, skills, or companies..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 shrink-0">
              <Filter className="w-4 h-4" />
              Filters
            </Button>
            <div className="hidden md:flex gap-2">
              <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 cursor-pointer">Remote Only</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer">Python</Badge>
              <Badge variant="outline" className="px-3 py-1 text-sm cursor-pointer">Machine Learning</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Listings */}
      <div className="grid gap-4">
        {jobs.map((job) => (
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
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">AI Match</span>
                        <div className="relative w-12 h-12 flex items-center justify-center font-bold text-primary">
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted opacity-20" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${job.matchScore * 1.25} 125`} className="text-primary" />
                          </svg>
                          <span className="relative text-sm">{job.matchScore}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1.5">Required Skills you have:</p>
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map(s => <Badge key={s} variant="secondary" className="bg-primary/5 text-primary/80">{s}</Badge>)}
                          </div>
                        </div>
                        {job.missingSkills.length > 0 && (
                          <div>
                            <p className="text-xs text-muted-foreground mb-1.5">Missing Skills:</p>
                            <div className="flex flex-wrap gap-2">
                              {job.missingSkills.map(s => <Badge key={s} variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">{s}</Badge>)}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap items-end gap-2 shrink-0">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                          <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <FileText className="w-4 h-4" />
                          Cover Letter
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
        ))}
      </div>
    </div>
  );
}

const jobs = [
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
    id: 2,
    title: "Machine Learning Scientist",
    company: "DataSphere",
    location: "New York, NY (Hybrid)",
    type: "Full-time",
    salary: "$160k - $220k",
    matchScore: 92,
    skills: ["Python", "TensorFlow", "NLP", "Machine Learning"],
    missingSkills: ["AWS"]
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
  },
  {
    id: 4,
    title: "Lead Data Scientist",
    company: "GlobalFinance",
    location: "London, UK (On-site)",
    type: "Full-time",
    salary: "£90k - £120k",
    matchScore: 82,
    skills: ["Python", "Machine Learning", "SQL", "Statistics"],
    missingSkills: ["Team Leadership", "Spark"]
  }
];
