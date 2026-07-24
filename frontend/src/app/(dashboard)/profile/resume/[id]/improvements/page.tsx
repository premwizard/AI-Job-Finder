"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, Check, X, Edit3, Sparkles, AlertCircle, Wand2, Lightbulb, Save } from "lucide-react";
import { toast } from "sonner";

import { generateResumeImprovements, getResumeImprovements, resolveResumeImprovement, applyAllResumeImprovements } from "@/features/profile/services/profile.api";
import { ResumeImprovementSuggestion } from "@/features/profile/types/improvement.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

export default function ImprovementsDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const resumeId = Number(params.id);

  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");

  const { data: suggestions = [], isLoading, refetch } = useQuery({
    queryKey: ["resumeImprovements", resumeId],
    queryFn: () => getResumeImprovements(resumeId),
    enabled: !!resumeId,
  });

  const generateMutation = useMutation({
    mutationFn: () => generateResumeImprovements(resumeId),
    onSuccess: () => {
      toast.success("New suggestions generated!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to generate suggestions. Please ensure the resume is parsed.");
    }
  });

  const resolveMutation = useMutation({
    mutationFn: ({ id, action, text }: { id: string, action: "ACCEPT" | "REJECT" | "EDIT", text?: string }) => 
      resolveResumeImprovement(resumeId, id, { action, edited_text: text }),
    onSuccess: (_, variables) => {
      toast.success(`Suggestion ${variables.action.toLowerCase()}ed.`);
      setEditingId(null);
      refetch();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  });

  const applyAllMutation = useMutation({
    mutationFn: () => applyAllResumeImprovements(resumeId),
    onSuccess: (res: any) => {
      toast.success(res.message || "All suggestions applied!");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    }
  });

  const pendingSuggestions = suggestions.filter((s: ResumeImprovementSuggestion) => s.status === "PENDING");
  const resolvedSuggestions = suggestions.filter((s: ResumeImprovementSuggestion) => s.status !== "PENDING");

  const sections = Array.from(new Set(pendingSuggestions.map((s: ResumeImprovementSuggestion) => s.section)));

  const filteredPending = pendingSuggestions.filter((s: ResumeImprovementSuggestion) => 
    activeFilter === "ALL" || s.section === activeFilter
  );

  const handleEditSave = (id: string) => {
    resolveMutation.mutate({ id, action: "EDIT", text: editText });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground" onClick={() => router.push('/profile/resume')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resumes
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">AI Improvement Engine</h1>
          <p className="text-muted-foreground">Targeted rewrites to enhance impact and ATS compatibility</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => generateMutation.mutate()} 
            disabled={generateMutation.isPending}
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            {generateMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Generate More
          </Button>
          {pendingSuggestions.length > 0 && (
            <Button 
              onClick={() => applyAllMutation.mutate()} 
              disabled={applyAllMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Apply All Pending
            </Button>
          )}
        </div>
      </div>

      {pendingSuggestions.length === 0 && resolvedSuggestions.length === 0 && !generateMutation.isPending ? (
        <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
          <Wand2 className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Suggestions Yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Click generate to let our AI analyze your resume and suggest high-impact rewrites for your experience and summary.
          </p>
          <Button onClick={() => generateMutation.mutate()} className="bg-indigo-600 hover:bg-indigo-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Suggestions
          </Button>
        </Card>
      ) : null}

      {pendingSuggestions.length > 0 && (
        <div className="space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-100">
            <Button 
              variant={activeFilter === "ALL" ? "default" : "outline"} 
              size="sm" 
              className={activeFilter === "ALL" ? "bg-slate-800" : ""}
              onClick={() => setActiveFilter("ALL")}
            >
              All Sections
            </Button>
            {sections.map(section => (
              <Button 
                key={section}
                variant={activeFilter === section ? "default" : "outline"} 
                size="sm"
                className={activeFilter === section ? "bg-slate-800" : ""}
                onClick={() => setActiveFilter(section)}
              >
                {section}
              </Button>
            ))}
          </div>

          <div className="grid gap-6">
            {filteredPending.map((s: ResumeImprovementSuggestion) => (
              <Card key={s.id} className="overflow-hidden border-indigo-100 shadow-sm transition-all hover:shadow-md">
                <div className="bg-indigo-50/50 px-5 py-3 border-b border-indigo-100 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-200">
                      {s.section}
                    </Badge>
                    <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {s.improvement_type}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    {/* Original */}
                    <div className="p-5 bg-slate-50/50">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Original</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium line-through decoration-red-300 decoration-2">
                        {s.original_text}
                      </p>
                    </div>
                    {/* Suggested */}
                    <div className="p-5 bg-white relative">
                      <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-3 flex items-center">
                        <Wand2 className="w-3.5 h-3.5 mr-1.5" /> Suggested Improvement
                      </h4>
                      
                      {editingId === s.id ? (
                        <div className="space-y-3">
                          <Textarea 
                            value={editText} 
                            onChange={(e) => setEditText(e.target.value)}
                            className="min-h-[100px] text-sm text-slate-800 leading-relaxed focus-visible:ring-indigo-500"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleEditSave(s.id)} className="bg-indigo-600 hover:bg-indigo-700">
                              <Save className="w-3.5 h-3.5 mr-1.5" /> Save Custom Edit
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-800 leading-relaxed font-medium bg-emerald-50/50 p-2 -mx-2 rounded border border-emerald-100/50">
                          {s.suggested_text}
                        </p>
                      )}

                      {!editingId && s.reason && (
                        <div className="mt-4 flex items-start text-xs text-indigo-700 bg-indigo-50/50 p-2.5 rounded-md border border-indigo-100">
                          <Lightbulb className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-amber-500" />
                          <span>{s.reason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-slate-50 border-t border-slate-100 p-3 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-slate-600 hover:bg-slate-200 border-slate-300"
                    onClick={() => {
                      setEditingId(s.id);
                      setEditText(s.suggested_text);
                    }}
                    disabled={resolveMutation.isPending || editingId === s.id}
                  >
                    <Edit3 className="w-4 h-4 mr-1.5" /> Custom Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 border-red-200"
                    onClick={() => resolveMutation.mutate({ id: s.id, action: "REJECT" })}
                    disabled={resolveMutation.isPending}
                  >
                    <X className="w-4 h-4 mr-1.5" /> Reject
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    onClick={() => resolveMutation.mutate({ id: s.id, action: "ACCEPT" })}
                    disabled={resolveMutation.isPending}
                  >
                    <Check className="w-4 h-4 mr-1.5" /> Accept Suggestion
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {resolvedSuggestions.length > 0 && pendingSuggestions.length === 0 && (
        <Card className="border-dashed border-2 bg-emerald-50/50 flex flex-col items-center justify-center p-12 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2 text-emerald-900">All Caught Up!</h3>
          <p className="text-emerald-700 mb-6 max-w-md">
            You've reviewed all suggestions. Your resume is looking stronger. Generate more if you've made recent changes.
          </p>
          <Button onClick={() => generateMutation.mutate()} className="bg-emerald-600 hover:bg-emerald-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Scan for New Improvements
          </Button>
        </Card>
      )}

    </div>
  );
}
