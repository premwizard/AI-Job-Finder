"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listOpportunities, runJobMonitor, updateOpportunityStatus, getOpportunityStatistics } from "@/features/agent/services/opportunity.api";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Radar, Target, MapPin, Building, Briefcase, Play, BookmarkPlus, X, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function OpportunityCenterPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  const { data: opportunities, isLoading: loadingOpps } = useQuery({
    queryKey: ['opportunities'],
    queryFn: listOpportunities
  });

  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['opportunity-stats'],
    queryFn: getOpportunityStatistics
  });

  const monitorMutation = useMutation({
    mutationFn: runJobMonitor,
    onSuccess: (data) => {
      alert(`Monitoring Cycle Complete.\nEvaluated: ${data.jobs_evaluated}\nDuplicates Filtered: ${data.duplicates_filtered}\nNew Opportunities: ${data.new_opportunities}`);
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      refetchStats();
    }
  });

  const statusMutation = useMutation({
    mutationFn: (payload: {id: number, status: string}) => updateOpportunityStatus(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      refetchStats();
    }
  });

  const filteredOpps = opportunities?.filter(opp => {
    if (filter === "all") return opp.status !== "ignored";
    return opp.status === filter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Radar className="w-8 h-8 text-rose-500" /> Opportunity Center
          </h2>
          <p className="text-slate-500 mt-1">
            Your Autonomous Job Search Agent. Curated opportunities ranked by semantic match.
          </p>
        </div>
        <Button 
          onClick={() => monitorMutation.mutate()}
          disabled={monitorMutation.isPending}
          className="bg-rose-600 hover:bg-rose-700 shadow-sm"
        >
          {monitorMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
          Run Monitoring Cycle
        </Button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-slate-500">Total Curated</p>
              <p className="text-2xl font-bold text-slate-900">{stats.total_opportunities}</p>
            </CardContent>
          </Card>
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-rose-600">Perfect Matches</p>
              <p className="text-2xl font-bold text-rose-700">{stats.perfect_matches}</p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-emerald-600">Avg Match Score</p>
              <p className="text-2xl font-bold text-emerald-700">{stats.average_score}%</p>
            </CardContent>
          </Card>
          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-indigo-600">Saved</p>
              <p className="text-2xl font-bold text-indigo-700">{stats.saved_opportunities}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-slate-500">Ignored</p>
              <p className="text-2xl font-bold text-slate-900">{stats.ignored_opportunities}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex gap-2 border-b pb-2">
        <Button variant={filter === "all" ? "default" : "ghost"} onClick={() => setFilter("all")} size="sm">Active Feed</Button>
        <Button variant={filter === "saved" ? "default" : "ghost"} onClick={() => setFilter("saved")} size="sm" className={filter === "saved" ? "bg-indigo-600" : ""}>Saved Opportunities</Button>
      </div>

      <div className="space-y-4">
        {loadingOpps ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>
        ) : filteredOpps?.length === 0 ? (
          <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed text-slate-500">
            <Radar className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p>No opportunities found. Run a monitoring cycle to discover jobs.</p>
          </div>
        ) : filteredOpps?.map((opp) => (
          <Card key={opp.id} className="border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{opp.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {opp.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {opp.location || "Remote"}</span>
                    {opp.salary && <span className="flex items-center gap-1"><Briefcase className="w-4 h-4" /> {opp.salary}</span>}
                  </div>
                </div>
                <Badge className={
                  opp.match_score > 90 ? "bg-emerald-100 text-emerald-800" :
                  opp.match_score > 75 ? "bg-blue-100 text-blue-800" :
                  "bg-amber-100 text-amber-800"
                }>
                  {opp.match_score}% {opp.category}
                </Badge>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-md mt-4 border text-sm text-slate-700">
                <span className="font-semibold block mb-1 flex items-center gap-1"><Target className="w-4 h-4 text-rose-500" /> AI Evaluation:</span>
                {opp.reasoning}
              </div>
              
              <div className="mt-4 text-xs text-slate-400">
                Discovered {formatDistanceToNow(new Date(opp.created_at))} ago
              </div>
            </div>
            
            <div className="bg-slate-50 md:w-48 p-4 flex flex-row md:flex-col justify-center gap-3 border-t md:border-t-0 md:border-l">
              <Button 
                variant={opp.status === "saved" ? "secondary" : "outline"}
                className={`w-full ${opp.status === "saved" ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "hover:text-indigo-600 hover:border-indigo-300"}`}
                onClick={() => statusMutation.mutate({ id: opp.id, status: "saved" })}
              >
                {opp.status === "saved" ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <BookmarkPlus className="w-4 h-4 mr-2" />}
                {opp.status === "saved" ? "Saved" : "Save"}
              </Button>
              <Button 
                variant="outline" 
                className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                onClick={() => statusMutation.mutate({ id: opp.id, status: "ignored" })}
              >
                <X className="w-4 h-4 mr-2" /> Ignore
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
