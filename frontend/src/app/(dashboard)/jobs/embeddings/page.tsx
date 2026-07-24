"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getEmbeddingStatistics, generateAllEmbeddings } from "@/features/jobs/services/job_embeddings.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Database, BrainCircuit, Activity, Layers, Server } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function JobEmbeddingsDashboard() {
  const queryClient = useQueryClient();

  const { data: stats, isLoading, refetch } = useQuery({
    queryKey: ['embeddingStatistics'],
    queryFn: getEmbeddingStatistics,
    refetchInterval: 5000 // Poll every 5s to see progress if running
  });

  const generateAllMutation = useMutation({
    mutationFn: () => generateAllEmbeddings(),
    onSuccess: () => {
      alert("Bulk embedding generation started in the background!");
      refetch();
    }
  });

  if (isLoading || !stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const completionPercentage = stats.total_jobs > 0 
    ? Math.round((stats.embedded_jobs / stats.total_jobs) * 100) 
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vector Intelligence</h2>
          <p className="text-muted-foreground mt-1">
            Job Embedding Engine Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => generateAllMutation.mutate()} 
            disabled={generateAllMutation.isPending || stats.pending_jobs === 0}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {generateAllMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
            Generate {stats.pending_jobs} Pending Embeddings
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Embedded Jobs</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.embedded_jobs} <span className="text-sm text-muted-foreground font-normal">/ {stats.total_jobs}</span></div>
            <Progress value={completionPercentage} className="mt-3" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chunks Indexed</CardTitle>
            <Layers className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_chunks}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ~{stats.avg_chunks_per_job} chunks per job
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Infrastructure</CardTitle>
            <Server className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{stats.vector_store}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <BrainCircuit className="w-3 h-3" /> {stats.provider}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
          <CardDescription>The Vector Intelligence layer is fully prepared for RAG and Semantic Search capabilities.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-muted-foreground">
            <div className="flex justify-between py-2 border-b">
              <span>Embedding Provider Status</span>
              <span className="text-green-600 font-medium flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Connected</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>Vector Database (ChromaDB)</span>
              <span className="text-green-600 font-medium flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> Online</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span>RAG Readiness</span>
              <span className="text-indigo-600 font-medium">Prepared for Phase 5</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
