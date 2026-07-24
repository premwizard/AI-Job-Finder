"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listGoals, createGoal, getGoalDetails, generatePlan, executeNextTask, AgentGoal, AgentTask } from "@/features/agent/services/agent.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, BrainCircuit, Target, ListTodo, Play, CheckCircle2, Circle, AlertCircle } from "lucide-react";

export default function CareerAgentPage() {
  const queryClient = useQueryClient();
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [activeGoalId, setActiveGoalId] = useState<number | null>(null);

  const { data: goals, isLoading: loadingGoals } = useQuery({
    queryKey: ['agent-goals'],
    queryFn: listGoals
  });

  const { data: activeGoal, refetch: refetchGoal } = useQuery({
    queryKey: ['agent-goal', activeGoalId],
    queryFn: () => getGoalDetails(activeGoalId!),
    enabled: !!activeGoalId
  });

  // Select the most recent active goal on load
  useEffect(() => {
    if (goals && goals.length > 0 && !activeGoalId) {
      setActiveGoalId(goals[0].id);
    }
  }, [goals, activeGoalId]);

  const createGoalMutation = useMutation({
    mutationFn: (title: string) => createGoal(title),
    onSuccess: (data) => {
      setNewGoalTitle("");
      setActiveGoalId(data.id);
      queryClient.invalidateQueries({ queryKey: ['agent-goals'] });
    }
  });

  const planMutation = useMutation({
    mutationFn: (id: number) => generatePlan(id),
    onSuccess: () => {
      refetchGoal();
      queryClient.invalidateQueries({ queryKey: ['agent-goals'] });
    }
  });

  const executeMutation = useMutation({
    mutationFn: (id: number) => executeNextTask(id),
    onSuccess: (data) => {
      if(data.result) {
        alert("Execution Output: " + data.result);
      }
      refetchGoal();
      queryClient.invalidateQueries({ queryKey: ['agent-goals'] });
    },
    onError: (err: any) => {
      alert("Execution failed: " + (err.response?.data?.detail || err.message));
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    createGoalMutation.mutate(newGoalTitle);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "failed": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "running": return <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />;
      default: return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-indigo-600" /> AI Career Agent
          </h2>
          <p className="text-slate-500 mt-1">
            State a goal, get an execution plan, and let the agent orchestrate your career progression.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar: Goals List */}
        <div className="lg:col-span-1 space-y-4">
          <form onSubmit={handleCreate} className="flex gap-2">
            <Input 
              placeholder="E.g., Get an AI job" 
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              className="bg-white"
            />
            <Button type="submit" disabled={createGoalMutation.isPending || !newGoalTitle.trim()} className="bg-indigo-600">
              {createGoalMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Target className="w-4 h-4" />}
            </Button>
          </form>

          <div className="space-y-2">
            {loadingGoals ? (
              <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : goals?.map(g => (
              <div 
                key={g.id} 
                onClick={() => setActiveGoalId(g.id)}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${activeGoalId === g.id ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <p className="font-semibold text-sm truncate">{g.title}</p>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <Badge variant="outline" className="text-slate-500">{g.status}</Badge>
                  <span className="text-indigo-600 font-mono">{g.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content: Goal Details */}
        <div className="lg:col-span-3">
          {activeGoal ? (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="border-b bg-slate-50/50 flex flex-row items-center justify-between pb-4">
                <div>
                  <CardTitle className="text-2xl">{activeGoal.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><ListTodo className="w-4 h-4" /> {activeGoal.tasks?.length || 0} Tasks</span>
                    <span>Status: <span className="font-semibold text-slate-700 uppercase">{activeGoal.status}</span></span>
                  </div>
                </div>
                
                {activeGoal.status === "pending" && (
                  <Button onClick={() => planMutation.mutate(activeGoal.id)} disabled={planMutation.isPending} className="bg-indigo-600">
                    {planMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <BrainCircuit className="w-4 h-4 mr-2" />}
                    Generate Execution Plan
                  </Button>
                )}

                {(activeGoal.status === "active" || activeGoal.status === "planning") && activeGoal.progress < 100 && (
                  <Button 
                    onClick={() => executeMutation.mutate(activeGoal.id)} 
                    disabled={executeMutation.isPending} 
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {executeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    Execute Next Step
                  </Button>
                )}
              </CardHeader>
              
              <CardContent className="p-0">
                {/* Progress Bar */}
                <div className="bg-slate-100 h-2 w-full">
                  <div className="bg-indigo-600 h-full transition-all duration-500" style={{ width: `${activeGoal.progress}%` }} />
                </div>

                <div className="p-6 space-y-4">
                  {!activeGoal.tasks || activeGoal.tasks.length === 0 ? (
                    <div className="text-center p-10 text-slate-500">
                      <BrainCircuit className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                      <p>Goal created. Click "Generate Execution Plan" to let the AI plan the necessary tasks.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {activeGoal.tasks.map((task: AgentTask, idx: number) => {
                        const isNextExecutable = task.status === "pending" && (idx === 0 || activeGoal.tasks![idx-1].status === "completed");
                        
                        return (
                          <div key={task.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-white bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {getStatusIcon(task.status)}
                            </div>
                            <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border shadow-sm transition-all ${isNextExecutable ? 'bg-indigo-50 border-indigo-200 shadow-md ring-1 ring-indigo-200' : 'bg-white border-slate-200'} ${task.status === 'completed' ? 'opacity-70 bg-slate-50' : ''}`}>
                              <div className="flex items-center justify-between mb-1">
                                <Badge variant="secondary" className="text-xs tracking-wider">{task.task_type}</Badge>
                              </div>
                              <p className="text-slate-700 text-sm font-medium leading-snug">{task.description}</p>
                              
                              {task.result_summary && (
                                <div className="mt-3 p-2 bg-slate-100 rounded text-xs text-slate-600 font-mono">
                                  {task.result_summary}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
             <div className="flex items-center justify-center h-full min-h-[300px] text-slate-500">
               Select or create a goal to view the execution plan.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
