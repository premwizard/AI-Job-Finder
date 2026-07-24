"use client";

import { useQuery } from "@tanstack/react-query";
import { listAgents, getAgentStatus } from "@/features/agent/services/multi-agent.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Network, Activity, Clock, AlertTriangle, CheckCircle } from "lucide-react";

export default function AgentDashboardPage() {
  const { data: agents, isLoading: loadingAgents } = useQuery({
    queryKey: ['agents-list'],
    queryFn: listAgents,
    refetchInterval: 10000 // refresh every 10s
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['agents-status'],
    queryFn: getAgentStatus,
    refetchInterval: 10000
  });

  if (loadingAgents || loadingStats) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Network className="w-8 h-8 text-indigo-600" /> Multi-Agent Network
          </h2>
          <p className="text-slate-500 mt-1">
            Monitor the health, load, and capabilities of the autonomous worker agents.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 shadow-sm px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
            Registry Active
          </Badge>
          <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-indigo-200 shadow-sm px-3 py-1">
            {agents?.length || 0} Agents Online
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents?.map(agent => {
          const agentStats = stats?.[agent.name] || {
            status: "unknown",
            tasks_completed: 0,
            tasks_failed: 0,
            avg_execution_time: 0,
            last_active: 0
          };

          return (
            <Card key={agent.name} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <CardTitle className="text-lg text-slate-800">{agent.name}</CardTitle>
                  {agentStats.status === 'active' ? (
                     <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                       <Activity className="w-3 h-3 mr-1" /> Active
                     </div>
                  ) : (
                     <div className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                       Idle
                     </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {agent.capabilities.map((cap, i) => (
                    <Badge key={i} variant="outline" className="text-xs bg-white text-indigo-700 border-indigo-100">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="p-5 flex-1 flex flex-col justify-end">
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><CheckCircle className="w-4 h-4 text-emerald-500" /> Completed</span>
                    <span className="font-semibold text-slate-700">{agentStats.tasks_completed}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><AlertTriangle className="w-4 h-4 text-amber-500" /> Failed</span>
                    <span className="font-semibold text-slate-700">{agentStats.tasks_failed}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 flex items-center gap-1"><Clock className="w-4 h-4 text-blue-500" /> Avg Latency</span>
                    <span className="font-mono text-slate-700">{agentStats.avg_execution_time.toFixed(2)}s</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
