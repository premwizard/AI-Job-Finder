"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRAGStatistics, reindexKnowledge, testRAGSearch } from "@/features/rag/services/rag.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, Search, RefreshCw, Layers, HardDrive, Zap, Server } from "lucide-react";

export default function RAGDashboardPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['ragStats'],
    queryFn: getRAGStatistics
  });

  const reindexMutation = useMutation({
    mutationFn: () => reindexKnowledge(),
    onSuccess: () => {
      alert("Reindexing process started in the background.");
    }
  });

  const searchMutation = useMutation({
    mutationFn: (query: string) => testRAGSearch(query)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    searchMutation.mutate(searchQuery);
  };

  if (statsLoading && !stats) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">RAG Infrastructure</h2>
          <p className="text-slate-500 mt-1">
            Manage vector collections, monitor retrieval latency, and test semantic search.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => reindexMutation.mutate()} disabled={reindexMutation.isPending} variant="outline" className="gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
            {reindexMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Rebuild All Indexes
          </Button>
          <Button onClick={() => refetchStats()} className="gap-2 bg-slate-900">
            <RefreshCw className="w-4 h-4" /> Refresh Stats
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg"><Database className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Chunks</p>
              <h3 className="text-2xl font-bold">{stats?.total_chunks || 0}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg"><Zap className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Avg Latency</p>
              <h3 className="text-2xl font-bold">{stats?.latency_ms || 0} ms</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg"><Server className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Active Provider</p>
              <h3 className="text-lg font-bold truncate">{stats?.provider || "N/A"}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><HardDrive className="w-6 h-6" /></div>
            <div>
              <p className="text-sm font-medium text-slate-500">Storage Used</p>
              <h3 className="text-2xl font-bold">{stats?.storage_gb || 0} GB</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-slate-200 shadow-sm h-fit">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> Vector Collections
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {stats?.collections?.map((col: any) => (
                <div key={col.name} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span className="font-medium text-slate-700 capitalize">{col.name}</span>
                  </div>
                  <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-mono">
                    {col.count} chunks
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-slate-200 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-500" /> Retrieval Sandbox
            </CardTitle>
            <CardDescription>Test hybrid retrieval and semantic reranking directly against the collections.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input 
                placeholder="Ask a question or enter keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={searchMutation.isPending || !searchQuery.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
                {searchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Run Query
              </Button>
            </form>

            {searchMutation.data && (
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Intent Detected</span>
                    <span className="font-medium text-indigo-700 capitalize">{searchMutation.data.detected_intent}</span>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Target Collection</span>
                    <span className="font-medium text-indigo-700 capitalize">{searchMutation.data.targeted_collection}</span>
                  </div>
                  <div className="w-px bg-slate-200" />
                  <div>
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Results</span>
                    <span className="font-medium text-indigo-700">{searchMutation.data.results_count}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-800">Top Retrieved Chunks (Reranked)</h4>
                  {searchMutation.data.top_results?.map((res: any, idx: number) => (
                    <div key={idx} className="p-4 border rounded-lg hover:border-indigo-200 transition-colors bg-white shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-600">{res.id}</Badge>
                        <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200">
                          Score: {(res.rerank_score * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600 whitespace-pre-wrap mt-2">{res.content.substring(0, 300)}...</p>
                    </div>
                  ))}
                  {searchMutation.data.top_results?.length === 0 && (
                    <div className="p-8 text-center text-slate-500 border border-dashed rounded-lg">
                      No chunks retrieved for this query.
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
