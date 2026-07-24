"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip as RechartsTooltip 
} from "recharts";
import { 
  CheckCircle2, XCircle, Search, Target, Briefcase, Zap, AlertTriangle, ChevronRight, BarChart3, Clock, Rocket 
} from "lucide-react";
import { toast } from "sonner";

import { analyzeSkillGap, getSkillGapHistory } from "@/features/profile/services/skillGap.api";
import { getResumes } from "@/features/profile/services/profile.api";
import { SkillGapAnalysisHistory, SkillGapResult, RoadmapItem } from "@/features/profile/types/skillGap.types";
import { ResumeItem } from "@/features/profile/types/resume.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

export default function SkillGapPage() {
  const queryClient = useQueryClient();
  
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [targetIndustry, setTargetIndustry] = useState("Technology");
  const [selectedResumeId, setSelectedResumeId] = useState<string>("auto");

  // Fetch resumes for dropdown
  const { data: resumes = [] } = useQuery({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

  // Fetch skill gap history
  const { data: historyData, isLoading: isLoadingHistory, refetch } = useQuery({
    queryKey: ["skillGapHistory"],
    queryFn: getSkillGapHistory,
  });

  const analyzeMutation = useMutation({
    mutationFn: () => analyzeSkillGap({
      target_role: targetRole,
      target_industry: targetIndustry,
      resume_id: selectedResumeId === "auto" ? null : Number(selectedResumeId)
    }),
    onSuccess: () => {
      toast.success("Skill Gap Analysis Complete!");
      refetch();
    },
    onError: () => {
      toast.error("Failed to generate analysis. Make sure you have a parsed resume.");
    }
  });

  const latestAnalysis: SkillGapAnalysisHistory | null = historyData && historyData.length > 0 ? historyData[0] : null;
  const analysisData: SkillGapResult | null = latestAnalysis ? JSON.parse(latestAnalysis.analysis_data_json) : null;

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeMutation.mutate();
  };

  const getPriorityColor = (priority: string) => {
    if (priority.toLowerCase() === "high") return "bg-red-500/10 text-red-700 border-red-200";
    if (priority.toLowerCase() === "medium") return "bg-amber-500/10 text-amber-700 border-amber-200";
    return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Skill Gap Analysis</h1>
          <p className="text-muted-foreground">Map your current skills against industry requirements</p>
        </div>
      </div>

      {/* Input Form */}
      <Card className="shadow-sm border-blue-100 bg-blue-50/30">
        <CardContent className="pt-6">
          <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Target className="w-4 h-4 mr-2" /> Target Role
              </label>
              <Input 
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
                placeholder="e.g. Machine Learning Engineer" 
                required 
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" /> Target Industry
              </label>
              <Input 
                value={targetIndustry} 
                onChange={(e) => setTargetIndustry(e.target.value)} 
                placeholder="e.g. Finance, Healthcare" 
                required 
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-700">Baseline Resume</label>
              <Select value={selectedResumeId} onValueChange={setSelectedResumeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Most Recent)</SelectItem>
                  {resumes.map((r: ResumeItem) => (
                    <SelectItem key={r.id} value={r.id.toString()}>
                      {r.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              type="submit" 
              disabled={analyzeMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto"
            >
              {analyzeMutation.isPending ? (
                <Zap className="w-4 h-4 mr-2 animate-pulse" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Analyze Gap
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoadingHistory ? (
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
        </div>
      ) : analysisData && latestAnalysis ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Gap Score & Radar */}
            <Card className="col-span-1 lg:col-span-1 shadow-sm flex flex-col h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Readiness Score</CardTitle>
                <CardDescription>Based on {latestAnalysis.target_role}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center flex-1 justify-center">
                <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                    <circle 
                      cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" 
                      strokeDasharray={452} 
                      strokeDashoffset={452 - (452 * (100 - analysisData.gap_percentage)) / 100}
                      className={analysisData.gap_percentage < 30 ? "text-emerald-500" : analysisData.gap_percentage < 60 ? "text-blue-500" : "text-amber-500"} 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold">{100 - analysisData.gap_percentage}%</span>
                    <span className="text-xs text-muted-foreground uppercase font-semibold">Match</span>
                  </div>
                </div>

                <div className="w-full h-64 -mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={analysisData.radar_data}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="You" dataKey="current_level" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                      <Radar name="Required" dataKey="required_level" stroke="#cbd5e1" fill="#cbd5e1" fillOpacity={0.2} strokeDasharray="3 3" />
                      <RechartsTooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skill Matrix */}
            <Card className="col-span-1 lg:col-span-2 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Skill Matrix</CardTitle>
                <CardDescription>How your profile compares to {latestAnalysis.target_role} in {latestAnalysis.target_industry}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold flex items-center text-emerald-700 mb-3">
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Matching Skills (You have these)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.matching_skills.map(skill => (
                      <Badge key={skill} variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {skill}
                      </Badge>
                    ))}
                    {analysisData.matching_skills.length === 0 && <span className="text-sm text-slate-500">None identified.</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold flex items-center text-red-700 mb-3">
                    <XCircle className="w-4 h-4 mr-2" /> Missing Core Skills (Critical Gap)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missing_skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-red-700 border-red-200 bg-red-50/50">
                        {skill}
                      </Badge>
                    ))}
                    {analysisData.missing_skills.length === 0 && <span className="text-sm text-slate-500">None identified. Great job!</span>}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold flex items-center text-blue-700 mb-3">
                    <Rocket className="w-4 h-4 mr-2" /> Recommended Skills (Stand out)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.recommended_skills.map(skill => (
                      <Badge key={skill} variant="outline" className="text-blue-700 border-blue-200 bg-blue-50/50">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Roadmap */}
          {analysisData.learning_roadmap && analysisData.learning_roadmap.length > 0 && (
            <Card className="shadow-sm border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                  Prioritized Learning Roadmap
                </CardTitle>
                <CardDescription>Focus your upskilling efforts here for maximum impact</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {analysisData.learning_roadmap.map((item, idx) => (
                    <div key={idx} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                      
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold shrink-0">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 space-y-1">
                        <h4 className="font-semibold text-slate-900">{item.skill}</h4>
                        <p className="text-sm text-slate-600">{item.career_impact}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3 shrink-0">
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority} Priority
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600">
                          {item.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-slate-50 text-slate-600 flex items-center">
                          <Clock className="w-3 h-3 mr-1" /> {item.estimated_time}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      ) : !analyzeMutation.isPending ? (
        <Card className="border-dashed border-2 bg-slate-50/50 flex flex-col items-center justify-center p-12 text-center h-64">
          <Target className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Ready for Analysis</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Enter your target role above and click analyze to see how your current skills match up.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
