import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  FileSearch,
  Eye
} from "lucide-react";

export default function ResumePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resume Analysis</h2>
          <p className="text-muted-foreground mt-1">
            AI-powered insights to optimize your resume for ATS and recruiters.
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <UploadCloud className="w-4 h-4" />
          Upload New Resume
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column: Stats & Current Resume */}
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center font-bold text-3xl text-primary">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted opacity-20" />
                  <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray="299 352" className="text-primary" />
                </svg>
                <span className="relative">85<span className="text-lg text-muted-foreground">/100</span></span>
              </div>
              <p className="text-sm text-green-500 font-medium mt-4">Top 15% of candidates</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Current Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium truncate">john_doe_resume_2024.pdf</p>
                  <p className="text-xs text-muted-foreground">Uploaded 3 days ago • 1.2 MB</p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <Eye className="w-4 h-4" />
                View Document
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">ATS Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Keyword Match</span>
                  <span className="font-medium">82%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[82%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Action Verbs</span>
                  <span className="font-medium">90%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[90%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Measurable Results</span>
                  <span className="font-medium text-yellow-500">65%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500 w-[65%]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Insights & Recommendations */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-primary" />
                AI Insights
              </CardTitle>
              <CardDescription>
                Detailed analysis of your resume content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              
              <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Strong Technical Summary</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Your summary clearly states your 3+ years of experience in ML and effectively highlights your core stack (Python, PyTorch).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-yellow-500/5 border-yellow-500/20">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-600 dark:text-yellow-400">Lack of Measurable Impact</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      In your "Software Engineer at StartupX" role, you mentioned "Built API endpoints." 
                      <span className="block mt-2 font-medium text-foreground">AI Suggestion:</span>
                      "Designed and implemented RESTful API endpoints using FastAPI, serving 10,000+ daily requests with sub-50ms latency."
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary">Skill Placement Optimization</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Your skills section is currently at the bottom. Since you are applying for technical AI roles, ATS systems and recruiters prefer to see the technical stack immediately after the summary.
                    </p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Format & Formatting Checks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Standard fonts used</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Appropriate margins</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">No complex tables/columns</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Machine-readable text</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">Length: 2 pages (Consider condensing to 1)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
