"use client";

import { useState } from "react";
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
  Eye,
  Loader2,
  FileDown
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService } from "@/services/resume";

export default function ResumePage() {
  const queryClient = useQueryClient();
  const [showViewer, setShowViewer] = useState(false);

  const { data: resume, isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: resumeService.getResume,
    retry: false
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => resumeService.uploadResume(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume'] });
      alert("Resume uploaded successfully!");
    },
    onError: () => {
      alert("Failed to upload resume. Please try again.");
    }
  });

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      uploadMutation.mutate(e.target.files[0]);
    }
  };

  if (isLoading && !uploadMutation.isPending) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const overallScore = resume?.resume_score || 0;
  const atsScore = resume?.ats_score || 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resume Analysis</h2>
          <p className="text-muted-foreground mt-1">
            AI-powered insights to optimize your resume for ATS and recruiters.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <input 
            type="file" 
            id="resume-upload" 
            className="hidden" 
            accept=".pdf,.doc,.docx" 
            onChange={handleUpload} 
          />
          <Button 
            onClick={() => document.getElementById('resume-upload')?.click()}
            disabled={uploadMutation.isPending} 
            className="gap-2 bg-primary text-primary-foreground min-w-[180px]"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                Upload New Resume
              </>
            )}
          </Button>
        </div>
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
                  <circle cx="64" cy="64" r="56" fill="none" stroke="currentColor" strokeWidth="8" strokeDasharray={`${overallScore * 3.52} 352`} className="text-primary" />
                </svg>
                <span className="relative">{overallScore}<span className="text-lg text-muted-foreground">/100</span></span>
              </div>
              <p className="text-sm text-green-500 font-medium mt-4">{overallScore > 80 ? 'Top 15% of candidates' : 'Needs improvement'}</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Current Document</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {resume ? (
                <>
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium truncate">Resume</p>
                      <p className="text-xs text-muted-foreground">Uploaded recently</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2" onClick={() => setShowViewer(!showViewer)}>
                    <Eye className="w-4 h-4" />
                    {showViewer ? "Hide Document" : "View Document"}
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center">No resume uploaded yet.</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Missing Skills</CardTitle>
              <CardDescription>Highly requested by your target roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/5">Pending Analysis</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Adding these keywords appropriately can boost your ATS match score by up to 12%.
              </p>
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
                  <span className="font-medium">{atsScore}%</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${atsScore}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Insights & Recommendations */}
        <div className="md:col-span-2 space-y-6">
          {showViewer && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden animate-in fade-in slide-in-from-top-4">
              <CardHeader className="flex flex-row items-center justify-between py-3 border-b bg-muted/20">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Resume Text Extract
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setShowViewer(false)}>Close</Button>
              </CardHeader>
              <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-mono">
                  {resume?.resume_text || 'No text extracted'}
                </pre>
              </CardContent>
            </Card>
          )}

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
                    <h4 className="font-semibold text-green-600 dark:text-green-400">Score Overview</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Your ATS score is {atsScore}/100 and overall resume score is {overallScore}/100.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-primary/5 border-primary/20">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-primary">Extracted Entities</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      We have extracted information from your resume to match with jobs.
                    </p>
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
