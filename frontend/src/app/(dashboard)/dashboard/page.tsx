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
  AlertCircle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Hello, John 👋</h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-primary" />
            Your AI Career Assistant is active and analyzing the job market.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="w-4 h-4" />
            Update Resume
          </Button>
          <Button className="gap-2">
            <Target className="w-4 h-4" />
            Find Match
          </Button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Match Score</CardTitle>
            <BrainCircuit className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">92%</div>
            <p className="text-xs text-muted-foreground mt-1">Based on target role: AI Engineer</p>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[92%]" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resume Strength</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">Strong</div>
            <p className="text-xs text-muted-foreground mt-1">ATS Score: 85/100</p>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 w-[85%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jobs Found</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1 text-green-500">
              <TrendingUp className="w-3 h-3" /> +12% since last week
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highly Matched</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">34</div>
            <p className="text-xs text-muted-foreground mt-1">Jobs with &gt;90% match score</p>
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
              {recommendedJobs.map((job) => (
                <div key={job.id} className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                    {job.company[0]}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg hover:underline cursor-pointer">{job.title}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1 text-primary/80 font-medium">{job.salary}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {job.matchScore}% Match
                        </Badge>
                      </div>
                    </div>
                    <div className="pt-2 flex flex-wrap gap-2">
                      {job.skills.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                      {job.missingSkills.map(s => <Badge key={s} variant="outline" className="text-xs border-red-500/30 text-red-400">{s} (Missing)</Badge>)}
                    </div>
                  </div>
                </div>
              ))}
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
                {activities.map((activity, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow shadow-primary/20" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border bg-card/50 text-sm">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <time className="text-xs text-muted-foreground">{activity.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const recommendedJobs = [
  {
    id: 1,
    title: "Senior AI Engineer",
    company: "TechNova",
    location: "Remote",
    salary: "$150k - $200k",
    matchScore: 95,
    skills: ["Python", "PyTorch", "LLMs"],
    missingSkills: ["Docker"]
  },
  {
    id: 2,
    title: "Machine Learning Scientist",
    company: "DataSphere",
    location: "New York, NY (Hybrid)",
    salary: "$160k - $220k",
    matchScore: 92,
    skills: ["Python", "TensorFlow", "NLP"],
    missingSkills: ["AWS"]
  },
  {
    id: 3,
    title: "AI Product Engineer",
    company: "InnovateAI",
    location: "San Francisco, CA",
    salary: "$140k - $180k",
    matchScore: 88,
    skills: ["Python", "React", "Next.js", "LangChain"],
    missingSkills: ["System Design"]
  }
];

const activities = [
  { title: "Found 12 highly matched jobs", time: "2 hours ago" },
  { title: "Generated cover letter for TechNova", time: "5 hours ago" },
  { title: "Resume analysis completed", time: "Yesterday" },
  { title: "Prepared interview questions for DataSphere", time: "2 days ago" },
];
