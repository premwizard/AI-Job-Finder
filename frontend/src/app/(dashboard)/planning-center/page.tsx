"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listGoals } from "@/features/agent/services/agent.api";
import { generateCognitivePlan, makeCognitiveDecision, getPlanningHistory, evaluatePlan } from "@/features/agent/services/planning.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lightbulb, Workflow, HelpCircle, AlertTriangle, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function PlanningCenterPage() {
  const queryClient = useQueryClient();
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);
  const [question, setQuestion] = useState("");

  const { data: goals, isLoading: loadingGoals } = useQuery({
    queryKey: ['agent-goals'],
    queryFn: listGoals
  });

  useEffect(() => {
    if (goals && goals.length > 0 && !activeGoalId) {
      setActiveGoalId(goals[0].id);
    }
  }, [goals, activeGoalId]);

  const { data: history, refetch: refetchHistory } = useQuery({
    queryKey: ['planning-history', activeGoalId],
    queryFn: () => getPlanningHistory(activeGoalId!),
    enabled: !!activeGoalId
  });

  const { data: evalData, refetch: refetchEval } = useQuery({
    queryKey: ['planning-eval', activeGoalId],
    queryFn: () => evaluatePlan(activeGoalId!),
    enabled: !!activeGoalId
  });

  const planMutation = useMutation({
    mutationFn: (id: number) => generateCognitivePlan(id),
    onSuccess: () => {
      refetchHistory();
      refetchEval();
      alert("Cognitive plan generated successfully.");
    }
  });

  const decisionMutation = useMutation({
    mutationFn: (payload: {id: number, q: string}) => makeCognitiveDecision(payload.id, payload.q),
    onSuccess: () => {
      setQuestion("");
      refetchHistory();
    }
  });

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !activeGoalId) return;
    decisionMutation.mutate({ id: activeGoalId, q: question });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Lightbulb className="w-8 h-8 text-amber-500" /> Planning & Reasoning Engine
          </h2>
          <p className="text-slate-500 mt-1">
            Observe the cognitive processes of the AI Career Agent: goal decomposition, structured decision making, and task reflection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <CardTitle className="text-sm">Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {loadingGoals ? (
                  <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin" /></div>
                ) : goals?.map(g => (
                  <div 
                    key={g.id} 
                    onClick={() => setActiveGoalId(g.id)}
                    className={`p-4 cursor-pointer transition-colors ${activeGoalId === g.id ? 'bg-amber-50/50 border-l-4 border-amber-500' : 'hover:bg-slate-50 border-l-4 border-transparent'}`}
                  >
                    <p className="font-semibold text-sm truncate">{g.title}</p>
                    <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider">{g.status}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {evalData && (
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <CardContent className="p-5 space-y-4">
                <h3 className="font-bold flex items-center gap-2"><Workflow className="w-4 h-4" /> Goal Progress</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Tasks</span>
                    <span className="font-mono">{evalData.total_tasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Completed</span>
                    <span className="font-mono text-emerald-400">{evalData.completed_tasks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Failed</span>
                    <span className="font-mono text-red-400">{evalData.failed_tasks}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-semibold">
                    <span>Avg Confidence</span>
                    <span className={evalData.average_confidence > 0.8 ? 'text-emerald-400' : 'text-amber-400'}>
                      {(evalData.average_confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <Button 
                  onClick={() => activeGoalId && planMutation.mutate(activeGoalId)}
                  disabled={planMutation.isPending}
                  className="w-full bg-white text-slate-900 hover:bg-slate-100"
                >
                  {planMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Lightbulb className="w-4 h-4 mr-2" />}
                  Generate Cognitive Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-indigo-500">
            <div className="bg-indigo-50/50 p-4 border-b">
              <h3 className="font-bold text-indigo-900 flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" /> Ask the Decision Engine
              </h3>
              <form onSubmit={handleAsk} className="flex gap-2">
                <Input 
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  placeholder="e.g., Should I prioritize learning Python or Go for this goal?" 
                  className="bg-white border-indigo-200"
                />
                <Button type="submit" disabled={!question.trim() || decisionMutation.isPending || !activeGoalId} className="bg-indigo-600 hover:bg-indigo-700">
                  {decisionMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reason"}
                </Button>
              </form>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-700">
                <ShieldCheck className="w-5 h-5 text-emerald-500" /> Recent Decisions
              </h3>
              
              {!history?.decisions || history.decisions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-white border border-dashed rounded-lg">
                  No decisions recorded yet. Ask a question above.
                </div>
              ) : history.decisions.map((d: any, idx: number) => (
                <Card key={idx} className="border-slate-200 shadow-sm">
                  <CardHeader className="p-4 pb-2 bg-slate-50 border-b">
                    <p className="text-sm font-medium text-slate-700">"{d.question}"</p>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-100 mb-1">Decision</Badge>
                      <p className="text-sm font-semibold text-slate-900">{d.decision}</p>
                    </div>
                    <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border">
                      <span className="font-semibold block mb-1">Reasoning:</span>
                      {d.reasoning}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2 text-slate-700">
                <FileText className="w-5 h-5 text-blue-500" /> Task Reflections
              </h3>
              
              {!history?.reflections || history.reflections.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-white border border-dashed rounded-lg">
                  No execution reflections yet. Execute tasks in the Career Agent.
                </div>
              ) : history.reflections.map((r: any, idx: number) => (
                <Card key={idx} className={`border shadow-sm ${r.success ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-red-500'}`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      {r.success ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <AlertTriangle className="w-5 h-5 text-red-500" />}
                      <span className="font-semibold text-sm">Task {r.task_id} Reflection</span>
                    </div>
                    <p className="text-sm text-slate-700">{r.reasoning}</p>
                    
                    {!r.success && r.mitigation && (
                      <div className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-100 mt-2">
                        <span className="font-bold block mb-1">Mitigation Strategy:</span>
                        {r.mitigation}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
