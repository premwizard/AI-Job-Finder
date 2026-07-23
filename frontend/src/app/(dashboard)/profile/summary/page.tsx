"use client";

import { useQuery } from "@tanstack/react-query";
import { getProfileAnalytics } from "@/features/profile/services/profile.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  CheckCircle2,
  XCircle,
  FileText,
  Briefcase,
  Award,
  FolderGit2,
  Sparkles,
  TrendingUp,
  Clock,
  Loader2,
  Brain,
  ShieldCheck,
} from "lucide-react";
import { formatDistanceToNow, parseISO } from "date-fns";

export default function ProfileAnalyticsPage() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["profileAnalytics"],
    queryFn: getProfileAnalytics,
  });

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const {
    profile_completion = 0,
    skills_count = 0,
    experience_count = 0,
    experience_years = 0,
    certifications_count = 0,
    projects_count = 0,
    resume_status = "No Resume Uploaded",
    career_readiness_score = 0,
    section_breakdown = [],
    recent_updates = [],
  } = analytics || {};

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Profile Analytics</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed metrics, section completion breakdown, readiness scores, and activity tracking.
        </p>
      </div>

      {/* Primary KPI Grid (Metric Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Profile Completion</p>
              <h3 className="text-2xl font-bold mt-0.5">{profile_completion}%</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Readiness Score</p>
              <h3 className="text-2xl font-bold mt-0.5">{career_readiness_score}/100</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Experience</p>
              <h3 className="text-2xl font-bold mt-0.5">{experience_years} yrs</h3>
              <p className="text-[11px] text-muted-foreground">{experience_count} role(s)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Resume Status</p>
              <h3 className="text-sm font-bold mt-1 line-clamp-1">{resume_status}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="w-5 h-5 text-indigo-500" />
              <span className="text-sm font-medium">Skills Verified</span>
            </div>
            <span className="text-lg font-bold">{skills_count}</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FolderGit2 className="w-5 h-5 text-teal-500" />
              <span className="text-sm font-medium">Portfolio Projects</span>
            </div>
            <span className="text-lg font-bold">{projects_count}</span>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">Certifications</span>
            </div>
            <span className="text-lg font-bold">{certifications_count}</span>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Breakdown Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Completion Progress Chart & Section Breakdown */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Section Completion Breakdown
            </CardTitle>
            <CardDescription className="text-xs">
              Weight distribution towards overall profile strength
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span>Overall Completion</span>
                <span>{profile_completion}%</span>
              </div>
              <Progress value={profile_completion} className="h-2.5" />
            </div>

            <div className="space-y-3 pt-2">
              {section_breakdown.map((item: any) => (
                <div key={item.section} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                    )}
                    <span className={item.completed ? "font-medium" : "text-muted-foreground"}>
                      {item.section}
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] ${
                      item.completed
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        : "text-muted-foreground border-border/40"
                    }`}
                  >
                    Weight: {item.weight}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity & Recent Updates */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Recent Profile Activity
            </CardTitle>
            <CardDescription className="text-xs">
              Timeline of recent section modifications
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            {recent_updates.length > 0 ? (
              <div className="space-y-4">
                {recent_updates.map((update: any) => (
                  <div key={update.section} className="flex items-center justify-between border-b border-border/40 pb-3 last:border-0">
                    <div>
                      <p className="text-sm font-semibold">{update.section}</p>
                      <p className="text-xs text-muted-foreground">Updated recently</p>
                    </div>
                    <span className="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded">
                      {formatDistanceToNow(parseISO(update.updated_at), { addSuffix: true })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent profile update logs recorded.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reserved Space for Future AI Insights */}
      <Card className="border-purple-500/20 bg-purple-500/5 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Sparkles className="w-4 h-4 text-purple-500" /> AI Insights & Recommendations
            <Badge variant="outline" className="ml-auto text-[10px] border-purple-500/30 text-purple-600 dark:text-purple-400">
              Reserved / Coming Soon
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-purple-900/80 dark:text-purple-200/80">
            Future updates will surface AI-driven competitive analysis, keyword optimization suggestions for targeted roles, and benchmark comparisons against industry candidates.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-purple-500/20 bg-background/50 text-xs">
              <p className="font-semibold text-purple-700 dark:text-purple-300">Target Role Match</p>
              <p className="text-muted-foreground mt-0.5">Calculated once job search goals are set</p>
            </div>
            <div className="p-3 rounded-lg border border-purple-500/20 bg-background/50 text-xs">
              <p className="font-semibold text-purple-700 dark:text-purple-300">ATS Keyword Fit</p>
              <p className="text-muted-foreground mt-0.5">Scanned against active industry listings</p>
            </div>
            <div className="p-3 rounded-lg border border-purple-500/20 bg-background/50 text-xs">
              <p className="font-semibold text-purple-700 dark:text-purple-300">Growth Recommendations</p>
              <p className="text-muted-foreground mt-0.5">Personalized skill and cert suggestions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
