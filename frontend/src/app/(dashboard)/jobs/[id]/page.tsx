import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the job based on params.id
  const job = {
    id: 1,
    title: "Senior AI Engineer",
    company: "TechNova",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$150k - $200k",
    postedDate: "2 days ago",
    matchScore: 95,
    skills: ["Python", "PyTorch", "LLMs", "Transformers", "Git"],
    missingSkills: ["Docker", "Kubernetes"],
    description: `We are looking for a Senior AI Engineer to join our core intelligence team. You will be responsible for designing, training, and deploying large language models that power our enterprise solutions.

Responsibilities:
- Train and fine-tune open-source LLMs (Llama 3, Mistral) on domain-specific data.
- Design scalable inference pipelines using vLLM or TGI.
- Work closely with product teams to integrate AI capabilities into end-user applications.
- Optimize model performance for low latency and high throughput.

Requirements:
- 5+ years of software engineering experience.
- 3+ years of experience with Machine Learning and Deep Learning frameworks (PyTorch preferred).
- Proven experience deploying models to production.
- Strong Python programming skills.
- Familiarity with containerization (Docker, Kubernetes) is a strong plus.`,
    aiAnalysis: "Your profile is a very strong match for this role. You have extensive experience with Python, PyTorch, and LLMs which are the core requirements. The only gap is in containerization (Docker/Kubernetes). We recommend spending a weekend building a small project with Docker to cover this gap before the interview."
  };

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
                    {job.company[0]}
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{job.title}</h1>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
                      <span className="flex items-center gap-1"><Building2 className="w-4 h-4" /> {job.company}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 w-full md:w-auto">
                  <Button variant="outline" size="icon">
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button className="flex-1 md:w-auto gap-2">
                    Apply Now <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 py-6 border-y border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Salary</p>
                  <p className="font-semibold">{job.salary}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Job Type</p>
                  <p className="font-semibold flex items-center gap-1"><Briefcase className="w-4 h-4 text-muted-foreground"/> {job.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Posted</p>
                  <p className="font-semibold flex items-center gap-1"><Calendar className="w-4 h-4 text-muted-foreground"/> {job.postedDate}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Applicants</p>
                  <p className="font-semibold">45 applied</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Job Description</h3>
                  <div className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {job.description}
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
                <span className="text-2xl font-bold text-primary">{job.matchScore}%</span>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">Matched Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map(s => <Badge key={s} variant="secondary" className="bg-primary/10 text-primary">{s}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground flex items-center justify-between">
                  Missing Skills
                  <Link href="/skills" className="text-xs text-primary hover:underline font-normal">View Roadmap</Link>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {job.missingSkills.map(s => <Badge key={s} variant="outline" className="border-red-500/30 text-red-400">{s}</Badge>)}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-2 text-foreground">AI Insight</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {job.aiAnalysis}
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
