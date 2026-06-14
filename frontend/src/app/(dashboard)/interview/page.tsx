"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Briefcase, 
  PlayCircle,
  BrainCircuit,
  Code2,
  Users,
  ChevronDown
} from "lucide-react";

export default function InterviewPrepPage() {
  const [selectedJob, setSelectedJob] = useState("TechNova - Senior AI Engineer");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Interview Prep</h2>
          <p className="text-muted-foreground mt-1">
            Generate highly targeted mock interviews based on real job descriptions.
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground">
          <PlayCircle className="w-4 h-4" />
          Start Mock Interview
        </Button>
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
            <p className="text-xs text-muted-foreground pt-1">Select from your saved or matched jobs to generate specific questions.</p>
          </div>

          <div className="pt-4 space-y-2">
            <label className="text-sm font-medium text-foreground">Difficulty Level</label>
            <div className="flex flex-col gap-2">
              <Button variant="outline" className="justify-start bg-primary/10 border-primary/20 text-primary hover:bg-primary/20">
                Senior / Lead
              </Button>
              <Button variant="ghost" className="justify-start">Mid-Level</Button>
              <Button variant="ghost" className="justify-start">Junior</Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5 text-primary" />
                Generated Questions
              </CardTitle>
              <CardDescription>
                AI analyzed the job description and your resume gaps to predict these questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="technical" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1">
                  <TabsTrigger value="technical" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <BrainCircuit className="w-4 h-4" /> Technical
                  </TabsTrigger>
                  <TabsTrigger value="coding" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Code2 className="w-4 h-4" /> Coding
                  </TabsTrigger>
                  <TabsTrigger value="hr" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                    <Users className="w-4 h-4" /> HR / Behavioral
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="technical" className="space-y-4 outline-none">
                  {technicalQuestions.map((q, i) => (
                    <div key={i} className="p-4 rounded-lg border bg-background/50 hover:border-primary/30 transition-colors group">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">{q.question}</h4>
                        <Badge variant="outline" className={q.isGap ? "border-red-500/30 text-red-400 bg-red-500/5 whitespace-nowrap" : "whitespace-nowrap"}>
                          {q.topic}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-md mt-3 border border-border/50">
                        <span className="font-semibold text-foreground mr-1">AI Hint:</span>
                        {q.hint}
                      </p>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="coding" className="space-y-4 outline-none">
                  <div className="p-8 text-center border-2 border-dashed rounded-lg">
                    <Code2 className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Algorithm & Data Structures</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Expect LeetCode Medium/Hard questions focused on Arrays, Trees, and DP.
                    </p>
                    <Button variant="outline">Practice Coding Environment</Button>
                  </div>
                </TabsContent>

                <TabsContent value="hr" className="space-y-4 outline-none">
                  {hrQuestions.map((q, i) => (
                     <div key={i} className="p-4 rounded-lg border bg-background/50 hover:border-primary/30 transition-colors group">
                     <h4 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{q.question}</h4>
                     <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-md mt-2 border border-border/50">
                       <span className="font-semibold text-foreground mr-1">AI Hint:</span>
                       {q.hint}
                     </p>
                   </div>
                  ))}
                </TabsContent>

              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const technicalQuestions = [
  {
    question: "How would you handle deploying a large language model with limited GPU VRAM?",
    topic: "Model Deployment",
    isGap: false,
    hint: "Discuss model quantization techniques (e.g., INT8, AWQ, GPTQ) and inference engines like vLLM that optimize memory usage via PagedAttention."
  },
  {
    question: "Explain the architectural differences between standard self-attention and grouped-query attention (GQA).",
    topic: "Transformers",
    isGap: false,
    hint: "Focus on how GQA reduces memory bandwidth during decoding by sharing key/value heads across multiple query heads, as seen in Llama 3."
  },
  {
    question: "Since you lack direct Docker experience, walk us through how you would conceptually isolate dependencies for an ML inference API.",
    topic: "Containerization",
    isGap: true,
    hint: "Acknowledge the gap but explain the principles of using a requirements.txt, building a virtual environment, and how containerization extends this to OS-level isolation."
  }
];

const hrQuestions = [
  {
    question: "Tell me about a time you had to optimize a model for production constraints.",
    hint: "Use the STAR method. Focus on a specific instance where you balanced accuracy vs. latency/throughput."
  },
  {
    question: "Why do you want to join TechNova specifically?",
    hint: "Mention their recent open-source contributions to the LLM community and align it with your passion for accessible AI."
  }
];
