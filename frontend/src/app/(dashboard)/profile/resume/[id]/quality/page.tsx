"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, Sparkles, Star, Target } from "lucide-react";

import { analyzeResumeQuality, getQualityHistory } from "@/features/profile/services/profile.api";
import { QualityAnalysisResult, QualityAnalysisHistory } from "@/features/profile/types/quality.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function QualityDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = Number(params.id);

  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["qualityHistory", resumeId],
    queryFn: () => getQualityHistory(resumeId),
    enabled: !!resumeId,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeResumeQuality(resumeId),
    onSuccess: () => {
      refetchHistory();
    },
  });

  const latestAnalysis: QualityAnalysisResult | null = historyData && historyData.length > 0 
    ? JSON.parse(historyData[0].full_analysis_json) 
    : null;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-500 hover:bg-emerald-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-500 hover:bg-blue-600">Good</Badge>;
    if (score >= 40) return <Badge className="bg-amber-500 hover:bg-amber-600">Needs Work</Badge>;
    return <Badge className="bg-red-500 hover:bg-red-600">Poor</Badge>;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-500";
    if (score >= 60) return "text-blue-500";
    if (score >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-red-500";
  };

  if (isLoadingHistory) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button variant="ghost" className="mb-2 -ml-4 text-muted-foreground" onClick={() => router.push('/profile/resume')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Resumes
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Resume Quality Engine</h1>
          <p className="text-muted-foreground">Deep evaluation of professionalism, impact, and writing quality</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => analyzeMutation.mutate()} 
            disabled={analyzeMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {analyzeMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Run Quality Scan
          </Button>
        </div>
      </div>

      {!latestAnalysis && !analyzeMutation.isPending ? (
        <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
          <Star className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Quality Scan Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Evaluate the true impact of your resume. Discover critical flaws, optimize your tone, and highlight your best sections.
          </p>
          <Button onClick={() => analyzeMutation.mutate()} className="bg-purple-600 hover:bg-purple-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Scan Resume Quality
          </Button>
        </Card>
      ) : null}

      {latestAnalysis ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="col-span-1 bg-gradient-to-br from-slate-900 to-purple-950 text-white border-none shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                <p className="text-purple-200 text-sm font-medium uppercase tracking-wider mb-2">Quality Score</p>
                <div className="relative flex items-center justify-center mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700/50" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={351.8} 
                            strokeDashoffset={351.8 - (351.8 * latestAnalysis.overall_score) / 100}
                            className={getScoreColor(latestAnalysis.overall_score)} />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{latestAnalysis.overall_score}</span>
                    <span className="text-xs text-purple-300">/ 100</span>
                  </div>
                </div>
                {getScoreBadge(latestAnalysis.overall_score)}
              </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2 shadow-md border-purple-100 bg-purple-50/30">
              <CardHeader>
                <CardTitle className="flex items-center text-xl text-purple-900">
                  <Target className="w-5 h-5 mr-2 text-purple-600" />
                  Executive Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  {latestAnalysis.general_feedback}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Historical Trend Chart (Simple visualization of last 5 runs) */}
          {historyData && historyData.length > 1 && (
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Score Trend</CardTitle>
                <CardDescription>Your resume quality over the last {Math.min(5, historyData.length)} scans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-2 h-32 mt-4">
                  {historyData.slice(0, 5).reverse().map((run: QualityAnalysisHistory, idx: number) => (
                    <div key={idx} className="flex flex-col items-center flex-1 group relative">
                      <span className="text-xs font-semibold text-slate-500 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {run.overall_score}
                      </span>
                      <div 
                        className={`w-full rounded-t-sm transition-all duration-500 ${getProgressColor(run.overall_score)} opacity-80 hover:opacity-100`} 
                        style={{ height: `${run.overall_score}%` }}
                      />
                      <span className="text-[10px] text-slate-400 mt-2 truncate max-w-full px-1">
                        {new Date(run.analyzed_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="issues" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="issues">Issues & Highlights</TabsTrigger>
              <TabsTrigger value="categories">Category Drilldown</TabsTrigger>
              <TabsTrigger value="feedback">General Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="issues" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {latestAnalysis.critical_issues.length > 0 && (
                  <Card className="shadow-sm border-red-200 md:col-span-2">
                    <CardHeader className="bg-red-50 border-b border-red-100">
                      <CardTitle className="flex items-center text-red-700 text-lg">
                        <XCircle className="w-5 h-5 mr-2" /> Critical Issues
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <ul className="space-y-3">
                        {latestAnalysis.critical_issues.map((item, idx) => (
                          <li key={idx} className="flex items-start text-sm text-slate-800 font-medium">
                            <XCircle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                <Card className="shadow-sm border-amber-200">
                  <CardHeader className="bg-amber-50 border-b border-amber-100">
                    <CardTitle className="flex items-center text-amber-700">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Minor Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {latestAnalysis.minor_issues.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700">
                          <AlertTriangle className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-emerald-200">
                  <CardHeader className="bg-emerald-50 border-b border-emerald-100">
                    <CardTitle className="flex items-center text-emerald-700">
                      <Star className="w-5 h-5 mr-2" /> Excellent Sections
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {latestAnalysis.excellent_sections.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700 font-medium">
                          <Star className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(latestAnalysis.category_scores).map(([category, details]) => (
                  <Card key={category} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center mb-1">
                        <CardTitle className="text-base font-semibold">{category}</CardTitle>
                        <span className={`font-bold ${getScoreColor(details.score)}`}>{details.score}/100</span>
                      </div>
                      <Progress value={details.score} className="h-2" 
                        style={{'--progress-background': getProgressColor(details.score)} as any} 
                      />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{details.feedback}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="feedback">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="shadow-sm border-emerald-100">
                  <CardHeader className="bg-emerald-50/50 border-b border-emerald-100">
                    <CardTitle className="flex items-center text-emerald-700">
                      <CheckCircle className="w-5 h-5 mr-2" /> Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {latestAnalysis.strengths.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700">
                          <CheckCircle className="w-4 h-4 mr-2 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-red-100">
                  <CardHeader className="bg-red-50/50 border-b border-red-100">
                    <CardTitle className="flex items-center text-red-700">
                      <AlertTriangle className="w-5 h-5 mr-2" /> Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {latestAnalysis.weaknesses.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700">
                          <AlertTriangle className="w-4 h-4 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>

        </div>
      ) : null}
    </div>
  );
}
