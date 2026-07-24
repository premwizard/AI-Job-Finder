"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, XCircle, Info, Sparkles, TrendingUp } from "lucide-react";

import { analyzeResumeATS, getATSHistory } from "@/features/profile/services/profile.api";
import { ATSAnalysisResult } from "@/features/profile/types/ats.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

export default function ATSDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = Number(params.id);

  const { data: historyData, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ["atsHistory", resumeId],
    queryFn: () => getATSHistory(resumeId),
    enabled: !!resumeId,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeResumeATS(resumeId),
    onSuccess: () => {
      refetchHistory();
    },
  });

  // Extract the latest analysis
  const latestAnalysis: ATSAnalysisResult | null = historyData && historyData.length > 0 
    ? JSON.parse(historyData[0].full_analysis_json) 
    : null;

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-emerald-500 hover:bg-emerald-600">Excellent</Badge>;
    if (score >= 60) return <Badge className="bg-blue-500 hover:bg-blue-600">Good</Badge>;
    if (score >= 40) return <Badge className="bg-amber-500 hover:bg-amber-600">Fair</Badge>;
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
          <h1 className="text-3xl font-bold tracking-tight">ATS Analysis Engine</h1>
          <p className="text-muted-foreground">Detailed compatibility report for Applicant Tracking Systems</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => analyzeMutation.mutate()} 
            disabled={analyzeMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {analyzeMutation.isPending ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            Run New Analysis
          </Button>
        </div>
      </div>

      {!latestAnalysis && !analyzeMutation.isPending ? (
        <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center">
          <ScanText className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Analysis Found</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Run your first ATS analysis to see how well your resume matches industry standards and get actionable feedback to improve it.
          </p>
          <Button onClick={() => analyzeMutation.mutate()} className="bg-indigo-600 hover:bg-indigo-700">
            <Sparkles className="w-4 h-4 mr-2" />
            Analyze Resume Now
          </Button>
        </Card>
      ) : null}

      {latestAnalysis ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Top Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-1 md:col-span-1 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-lg">
              <CardContent className="pt-6 flex flex-col items-center justify-center h-full">
                <p className="text-slate-300 text-sm font-medium uppercase tracking-wider mb-2">Overall ATS Score</p>
                <div className="relative flex items-center justify-center mb-4">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray={351.8} 
                            strokeDashoffset={351.8 - (351.8 * latestAnalysis.overall_score) / 100}
                            className={getScoreColor(latestAnalysis.overall_score)} />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold">{latestAnalysis.overall_score}</span>
                    <span className="text-xs text-slate-400">/ 100</span>
                  </div>
                </div>
                {getScoreBadge(latestAnalysis.overall_score)}
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 shadow-md border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <TrendingUp className="w-5 h-5 mr-2 text-indigo-500" />
                  Priority Improvements
                </CardTitle>
                <CardDescription>Top actions to take immediately to improve your score</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {latestAnalysis.priority_improvements.map((improvement, idx) => (
                    <li key={idx} className="flex items-start bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm mr-3 mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-700 font-medium">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="categories" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="categories">Category Breakdown</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Analysis</TabsTrigger>
              <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
            </TabsList>
            
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

            <TabsContent value="keywords">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Keyword Match Analysis</CardTitle>
                  <CardDescription>How well your resume covers standard industry keywords</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div>
                    <h3 className="flex items-center text-sm font-medium uppercase tracking-wider text-emerald-600 mb-3">
                      <CheckCircle className="w-4 h-4 mr-2" /> Found Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {latestAnalysis.keyword_analysis.found.map(kw => (
                        <Badge key={kw} variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center text-sm font-medium uppercase tracking-wider text-red-600 mb-3">
                      <XCircle className="w-4 h-4 mr-2" /> Missing Keywords
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {latestAnalysis.keyword_analysis.missing.map(kw => (
                        <Badge key={kw} variant="secondary" className="bg-red-50 text-red-700 hover:bg-red-100 border border-red-200">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center text-sm font-medium uppercase tracking-wider text-blue-600 mb-3">
                      <Info className="w-4 h-4 mr-2" /> Suggested Keywords to Add
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {latestAnalysis.keyword_analysis.suggested.map(kw => (
                        <Badge key={kw} variant="outline" className="text-blue-700 border-blue-200 bg-blue-50/50">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
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

                <Card className="shadow-sm md:col-span-2 border-indigo-100">
                  <CardHeader className="bg-indigo-50/50 border-b border-indigo-100">
                    <CardTitle className="flex items-center text-indigo-700">
                      <Info className="w-5 h-5 mr-2" /> General Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {latestAnalysis.recommendations.map((item, idx) => (
                        <li key={idx} className="flex items-start text-sm text-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-3 mt-1.5 flex-shrink-0" />
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
