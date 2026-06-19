"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Copy, 
  Download, 
  Mail, 
  Edit3, 
  Sparkles,
  RefreshCw,
  CheckCircle2,
  ChevronDown
} from "lucide-react";

const generatedLetter = `Dear Hiring Team at TechNova,

I am writing to express my strong interest in the Senior AI Engineer position. With over 3 years of experience specializing in deep learning and natural language processing, I have consistently driven impact by building and deploying robust machine learning pipelines.

At my current role, I led the development of a fine-tuned open-source LLM that improved our internal knowledge retrieval accuracy by 35%. I leveraged PyTorch for model training and optimized inference speed using advanced quantization techniques. My deep understanding of transformer architectures aligns perfectly with TechNova's mission to build scalable enterprise AI solutions.

While I understand the importance of containerization and orchestration, I have been actively upskilling in Docker and Kubernetes to ensure I can independently deploy the models I build. My ability to quickly adapt and master new technologies has been a cornerstone of my career.

I am particularly excited about TechNova's recent contributions to the open-source AI community, and I am eager to bring my expertise in Python, PyTorch, and NLP to your team.

Thank you for considering my application. I look forward to the opportunity to discuss how my background, skills, and enthusiasm align with the goals of TechNova.

Sincerely,
John Doe
(555) 123-4567
johndoe@example.com`;

export default function CoverLetterPage() {
  const [selectedJob, setSelectedJob] = useState("TechNova - Senior AI Engineer");
  const [letterContent, setLetterContent] = useState(generatedLetter);
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterContent);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Cover Letter Generator</h2>
          <p className="text-muted-foreground mt-1">
            Instantly generate tailored cover letters based on your resume and the job description.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Sidebar Configuration */}
        <div className="md:col-span-1 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Target Role</label>
            <div className="w-full p-2 border rounded-md bg-card/50 flex items-center justify-between cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors">
              <span className="text-sm truncate pr-2">{selectedJob}</span>
              <ChevronDown className="w-4 h-4 shrink-0 opacity-50" />
            </div>
          </div>

          <div className="pt-4 space-y-2">
            <label className="text-sm font-medium text-foreground">Tone</label>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                Professional
              </Button>
              <Button variant="ghost" className="justify-start">Enthusiastic</Button>
              <Button variant="ghost" className="justify-start">Direct & Concise</Button>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button className="w-full gap-2 bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
              Regenerate
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Uses AI to align your experience with the job requirements.
            </p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-xl overflow-hidden">
            <div className="bg-muted/50 border-b p-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-primary" />
                Cover Letter
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  className="h-8 gap-1"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleCopy}>
                  {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {isCopied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
            
            <CardContent className="p-0">
              {isEditing ? (
                <textarea 
                  className="w-full min-h-[500px] border-0 focus-visible:ring-0 rounded-none resize-none p-6 text-base leading-relaxed bg-background outline-none"
                  value={letterContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setLetterContent(e.target.value)}
                />
              ) : (
                <div className="p-8 md:p-12 min-h-[500px] whitespace-pre-wrap text-base leading-relaxed font-serif bg-card text-foreground">
                  {letterContent}
                </div>
              )}
            </CardContent>
            
            <CardFooter className="bg-muted/30 border-t p-4 flex justify-end gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button className="gap-2">
                <Mail className="w-4 h-4" />
                Send via Email
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
