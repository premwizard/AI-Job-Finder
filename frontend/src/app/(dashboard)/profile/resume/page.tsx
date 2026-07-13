"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, UploadCloud, File, Trash2, Download, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function ResumeCenterPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const resumes = profile?.resumes || [];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Resume Center
          </h2>
          <p className="text-sm text-muted-foreground">Manage your resumes and AI insights.</p>
        </div>
        <Button>
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No resumes uploaded</h3>
          <p className="text-muted-foreground mt-1 mb-6">Upload your resume to get AI feedback and instant parsing.</p>
          <Button variant="outline">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload PDF
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {resumes.map((resume: any) => (
            <Card key={resume.id} className="overflow-hidden shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Left Column: File Details */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <File className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-bold text-lg">{resume.file_name || "Resume.pdf"}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              Uploaded {format(new Date(resume.uploaded_at), "MMMM d, yyyy")} • Version {resume.version}
                            </p>
                          </div>
                          <Badge variant="outline" className="bg-primary/5">
                            {resume.parsing_status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" /> Replace
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: AI Intelligence (Placeholder) */}
                  <div className="flex-1 lg:border-l lg:pl-8 mt-6 lg:mt-0">
                    <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                      Resume Intelligence
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-muted/30">
                        <p className="text-sm text-muted-foreground italic mb-2">
                          Resume parsing and AI scoring capabilities will be available in Phase 2.
                        </p>
                        <Button variant="secondary" className="w-full" disabled>
                          Parse Resume (Coming Soon)
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 opacity-50">
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-3xl font-bold text-primary mb-1">--</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">ATS Score</p>
                        </div>
                        <div className="p-4 border rounded-lg text-center">
                          <p className="text-3xl font-bold text-primary mb-1">--</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium tracking-wide">Resume Score</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
