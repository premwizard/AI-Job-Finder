"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend 
} from "recharts";
import { format } from "date-fns";
import { 
  ArrowLeft, Activity, TrendingUp, TrendingDown, Clock, LayoutTemplate, Briefcase, Award, GraduationCap, Lock, Star, ChevronRight
} from "lucide-react";
import { getResumeAnalytics } from "@/features/profile/services/analytics.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsDashboardPage() {
  const router = useRouter();
  
  const { data, isLoading } = useQuery({
    queryKey: ["resumeAnalytics"],
    queryFn: getResumeAnalytics,
  });

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-60px)] overflow-y-auto">
        <Skeleton className="h-10 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border p-3 rounded-lg shadow-lg">
          <p className="font-semibold text-sm mb-1">{label}</p>
          {payload.map((p: any, i: number) => (
            <p key={i} className="text-sm" style={{ color: p.color }}>
              {p.name}: <span className="font-bold">{p.value}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const getAtsTrendColor = () => {
    if (!data?.ats_trend || data.ats_trend.length < 2) return "text-emerald-500";
    const last = data.ats_trend[data.ats_trend.length - 1].score || 0;
    const prev = data.ats_trend[data.ats_trend.length - 2].score || 0;
    return last >= prev ? "text-emerald-500" : "text-rose-500";
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-60px)] overflow-y-auto pb-20">
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="w-7 h-7 text-primary" /> Resume Analytics
          </h1>
          <p className="text-muted-foreground">Insights and historical trends for your career profile</p>
        </div>
      </div>

      {/* Top Score Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-emerald-500/20 bg-emerald-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-emerald-800">Current ATS Score</p>
                <h3 className="text-3xl font-bold text-emerald-900 mt-1">{data?.current_ats_score}<span className="text-lg text-emerald-700 font-medium">/100</span></h3>
              </div>
              <div className={`p-2 rounded-full bg-white shadow-sm ${getAtsTrendColor()}`}>
                {getAtsTrendColor().includes('emerald') ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              </div>
            </div>
            <p className="text-xs text-emerald-700 mt-4 flex items-center">
              Highest score achieved: <strong className="ml-1">{data?.highest_ats_score}</strong>
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-500/20 bg-blue-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-blue-800">Improvements Applied</p>
                <h3 className="text-3xl font-bold text-blue-900 mt-1">{data?.total_improvements_accepted}</h3>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm text-blue-600">
                <Star className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-4">AI enhancements accepted</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-purple-500/20 bg-purple-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-purple-800">Total Skills Identified</p>
                <h3 className="text-3xl font-bold text-purple-900 mt-1">{data?.total_skills}</h3>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm text-purple-600">
                <LayoutTemplate className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-purple-700 mt-4">Across all profile sections</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-amber-500/20 bg-amber-500/5">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-amber-800">Resume Age</p>
                <h3 className="text-3xl font-bold text-amber-900 mt-1">{data?.resume_age_days} <span className="text-lg text-amber-700 font-medium">days</span></h3>
              </div>
              <div className="p-2 rounded-full bg-white shadow-sm text-amber-600">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-xs text-amber-700 mt-4">Since initial upload</p>
          </CardContent>
        </Card>
      </div>

      {/* Middle Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trends */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">ATS & Quality Score Trend</CardTitle>
            <CardDescription>Historical progression of your resume's core metrics</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.ats_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }} 
                  tickFormatter={(val) => format(new Date(val), "MMM d")}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" name="ATS Score" dataKey="score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Quality Score" data={data?.quality_trend} dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Profile Growth */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Profile Growth Engine</CardTitle>
            <CardDescription>Cumulative additions to your core professional sections</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSkills" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  allowDuplicatedCategory={false}
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  tickFormatter={(val) => val ? format(new Date(val), "MMM d") : ""}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="stepAfter" name="Skills Added" data={data?.skills_growth} dataKey="count" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorSkills)" />
                <Area type="stepAfter" name="Experiences Added" data={data?.experience_growth} dataKey="count" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Tables and Future Placeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Timeline of recent improvements */}
        <Card className="shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent AI Improvements</CardTitle>
            <CardDescription>Latest language and phrasing enhancements accepted</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.recent_improvements && data.recent_improvements.length > 0 ? (
              <div className="space-y-4">
                {data.recent_improvements.map((imp) => (
                  <div key={imp.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm flex items-center gap-2">
                        {imp.section} <Badge variant="secondary" className="text-[10px]">{imp.type}</Badge>
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">{format(new Date(imp.date), "MMM d, h:mm a")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                No AI improvements applied yet.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Future Ready Placeholder */}
        <div className="space-y-4">
          <Card className="shadow-sm border-dashed border-slate-300 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 flex-col text-slate-500">
              <Lock className="w-6 h-6 mb-2 opacity-50" />
              <span className="text-sm font-semibold">Unlocks in Phase 4</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-400">Job Match Score Trends</CardTitle>
            </CardHeader>
            <CardContent className="h-32">
              <div className="w-full h-full bg-slate-200/50 rounded-md"></div>
            </CardContent>
          </Card>
          
          <Card className="shadow-sm border-dashed border-slate-300 bg-slate-50/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] flex items-center justify-center z-10 flex-col text-slate-500">
              <Lock className="w-6 h-6 mb-2 opacity-50" />
              <span className="text-sm font-semibold">Unlocks in Phase 5</span>
            </div>
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-400">Application Success Rate</CardTitle>
            </CardHeader>
            <CardContent className="h-32">
              <div className="w-full h-full bg-slate-200/50 rounded-md"></div>
            </CardContent>
          </Card>
        </div>
        
      </div>
    </div>
  );
}
