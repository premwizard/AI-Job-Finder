import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BrainCircuit, FileSearch, Sparkles, MessageSquare, Briefcase, FileText, Upload, Target, Users, Mail, Bot, Braces } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full max-w-screen-2xl px-4 md:px-8 py-20 md:py-32 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 flex flex-col items-start gap-6">
          <Badge variant="secondary" className="px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Career Assistant
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Find AI-Matched Jobs, <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Not Just Jobs.
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Upload your resume and let AI analyze your profile, match jobs, detect missing skills, prepare interviews, and generate personalized cover letters.
          </p>
          <div className="flex gap-4 mt-4">
            <Button size="lg" className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Resume
            </Button>
            <Link href="/register">
              <Button size="lg" variant="outline" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Dashboard Preview (Visual representation) */}
        <div className="flex-1 w-full relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 blur-3xl rounded-full" />
          <Card className="relative border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-border/50 bg-muted/50 px-4 py-3 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-semibold text-lg">AI Match Analysis</h3>
                  <p className="text-sm text-muted-foreground">Senior AI Engineer @ TechCorp</p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center font-bold text-xl text-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]">
                  92%
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Resume Strength</span>
                    <span className="text-primary">Strong</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-sm font-medium mb-2 block">Missing Skills detected:</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-red-400 border-red-500/30">Kubernetes</Badge>
                    <Badge variant="outline" className="text-red-400 border-red-500/30">System Design</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="w-full border-y border-border/40 bg-muted/30 py-12">
        <div className="container max-w-screen-2xl px-4 md:px-8 mx-auto flex flex-col md:flex-row justify-around items-center gap-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">50,000+</h3>
            <p className="text-muted-foreground font-medium">Jobs Processed</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">95%</h3>
            <p className="text-muted-foreground font-medium">Matching Accuracy</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-bold text-primary mb-2">10,000+</h3>
            <p className="text-muted-foreground font-medium">Resumes Analyzed</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full max-w-screen-2xl px-4 md:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to land your dream job</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered platform provides a comprehensive suite of tools to give you an unfair advantage in the job market.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="group hover:border-primary/50 transition-colors bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="w-full bg-muted/30 py-20 md:py-32">
        <div className="container max-w-screen-2xl px-4 md:px-8 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to transform your job search with AI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-border -translate-y-1/2 z-0" />
            {steps.map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-background border-2 border-primary flex items-center justify-center text-2xl font-bold text-primary mb-6 shadow-lg shadow-primary/20">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full max-w-screen-2xl px-4 md:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by job seekers</h2>
          <p className="text-lg text-muted-foreground">Don't just take our word for it.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <p className="mb-6 italic text-muted-foreground">"{t.quote}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                    {t.author[0]}
                  </div>
                  <div>
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

const features = [
  { icon: <Target />, title: "AI Job Matching", description: "Get highly accurate job recommendations based on a deep semantic analysis of your resume and skills." },
  { icon: <FileSearch />, title: "Resume Analysis", description: "Identify weaknesses in your resume, calculate ATS score, and receive actionable improvement tips." },
  { icon: <BrainCircuit />, title: "Skill Gap Detection", description: "Automatically detect what skills you are missing for your target roles and generate a learning roadmap." },
  { icon: <MessageSquare />, title: "AI Interview Prep", description: "Practice with our AI agent that generates company and role-specific technical and HR questions." },
  { icon: <FileText />, title: "Cover Letter Generator", description: "Generate highly personalized cover letters tailored to specific job descriptions in seconds." },
  { icon: <Mail />, title: "Smart Email Alerts", description: "Never miss an opportunity with intelligent alerts that notify you only for highly matched roles." },
  { icon: <Users />, title: "RAG Knowledge Assistant", description: "Chat with an AI that knows everything about your profile, career goals, and the job market." },
  { icon: <Bot />, title: "AI Agents", description: "Deploy autonomous agents to scrape, filter, and summarize job listings from various portals." },
  { icon: <Braces />, title: "MCP Integration", description: "Seamlessly connect with external Model Context Protocol servers for extended functionality." },
];

const steps = [
  { title: "Upload Resume", description: "Simply drag and drop your PDF resume to get started." },
  { title: "AI Understands You", description: "Our engine extracts skills, experience, and career trajectory." },
  { title: "AI Finds Best Jobs", description: "We match your unique profile against thousands of open roles." },
  { title: "Get Recommendations", description: "Receive personalized guidance, skill gaps, and interview prep." },
];

const testimonials = [
  { quote: "This platform completely changed my job search. The AI correctly identified that I needed to learn Docker to get Senior backend roles.", author: "Alex Johnson", role: "Backend Engineer" },
  { quote: "The personalized cover letter generator saved me hours of work. I got an interview at my dream company on the first try.", author: "Sarah Miller", role: "Product Manager" },
  { quote: "Practicing with the AI interview prep gave me the confidence I needed. The technical questions were spot on.", author: "David Chen", role: "Data Scientist" },
];
