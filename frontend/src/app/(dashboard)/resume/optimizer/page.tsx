"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { generateOptimization, applyOptimization, OptimizationResult } from "@/features/resume/services/resume-optimizer.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, FileSearch, Check, X, Sparkles, TrendingUp, Target, Search } from "lucide-react";

export default function ResumeOptimizerPage() {
  const queryClient = useQueryClient();
  const [jobId, setJobId] = useState<string>("");
  const [result, setResult] = useState<OptimizationResult | null>(null);

  const optimizeMutation = useMutation({
    mutationFn: (id: number) => generateOptimization(id),
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const applyMutation = useMutation({
    mutationFn: (id: number) => applyOptimization(id),
    onSuccess: () => {
      alert("Changes marked as applied!");
      if (result) setResult({ ...result, status: "applied" });
    }
  });

  const handleOptimize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId.trim()) return;
    optimizeMutation.mutate(parseInt(jobId));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileSearch className="w-8 h-8 text-indigo-600" /> Resume Optimizer
          </h2>
          <p className="text-slate-500 mt-1">
            Generate evidence-based resume improvements tailored to a specific target job.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-slate-50">
        <CardContent className="p-6">
          <form onSubmit={handleOptimize} className="flex gap-2 max-w-xl">
            <Input 
              placeholder="Enter Target Job ID (e.g., 1, 2, 3)..." 
              value={jobId}
              type="number"
              onChange={(e) => setJobId(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button type="submit" disabled={optimizeMutation.isPending || !jobId.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              {optimizeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Generate Optimization
            </Button>
          </form>
        </CardContent>
      </Card>

      {optimizeMutation.isPending && (
         <div className="flex flex-col items-center justify-center p-20 space-y-4">
           <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
           <p className="text-slate-500 animate-pulse">Cross-referencing resume with target job requirements...</p>
         </div>
      )}

      {result && !optimizeMutation.isPending && (
        <div className="space-y-6">
          {/* Projections Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Target className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Projected ATS Score</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-4xl font-black text-indigo-900">{result.projected_ats_score}/100</h3>
                    <Badge variant="outline" className="mb-1 text-emerald-600 border-emerald-200 bg-emerald-50">+ Improved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-indigo-100 bg-indigo-50/50 shadow-sm">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><TrendingUp className="w-8 h-8" /></div>
                <div>
                  <p className="text-sm font-bold text-blue-400 uppercase tracking-wider">Semantic Match Increase</p>
                  <div className="flex items-end gap-2">
                    <h3 className="text-4xl font-black text-blue-900">{result.projected_match_score}%</h3>
                    <Badge variant="outline" className="mb-1 text-emerald-600 border-emerald-200 bg-emerald-50">High Confidence</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center mt-8 mb-4">
            <h3 className="text-2xl font-bold text-slate-800">Actionable Suggestions</h3>
            <Button 
              onClick={() => applyMutation.mutate(result.id)} 
              disabled={result.status === "applied" || applyMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {result.status === "applied" ? "Changes Applied" : "Mark All as Applied"}
            </Button>
          </div>

          <div className="grid gap-6">
            {result.suggestions.map((sug, idx) => (
              <Card key={idx} className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 mb-2">{sug.section}</Badge>
                      <CardTitle className="text-lg text-slate-800">{sug.suggestion}</CardTitle>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {sug.expected_impact}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex gap-2">
                      <div className="w-1.5 bg-indigo-400 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reason</p>
                        <p className="text-sm text-slate-700">{sug.reason}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1.5 bg-amber-400 rounded-full" />
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evidence (RAG)</p>
                        <p className="text-sm text-slate-700 italic">"{sug.evidence}"</p>
                      </div>
                    </div>
                  </div>
                  
                  {(sug.diff.removed || sug.diff.added) && (
                    <div className="border-t border-slate-100 bg-slate-50 p-5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Suggested Diff</p>
                      <div className="font-mono text-sm space-y-1">
                        {sug.diff.removed && (
                          <div className="p-2 bg-red-50 text-red-700 rounded border border-red-100 line-through">
                            - {sug.diff.removed}
                          </div>
                        )}
                        {sug.diff.added && (
                          <div className="p-2 bg-emerald-50 text-emerald-700 rounded border border-emerald-100">
                            + {sug.diff.added}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
