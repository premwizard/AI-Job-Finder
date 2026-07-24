"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listTools, executeTool, getToolStatistics, ToolDef } from "@/features/agent/services/tools.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wrench, Search, Play, Activity, CheckCircle2, AlertTriangle, Settings } from "lucide-react";

export default function ToolCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTool, setSelectedTool] = useState<ToolDef | null>(null);
  const [params, setParams] = useState<string>("");
  const [executionResult, setExecutionResult] = useState<any>(null);

  const { data: tools, isLoading: loadingTools } = useQuery({
    queryKey: ['tools-list'],
    queryFn: listTools
  });

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['tools-stats'],
    queryFn: getToolStatistics,
    refetchInterval: 5000
  });

  const executeMutation = useMutation({
    mutationFn: (payload: {name: string, p: any}) => executeTool(payload.name, payload.p),
    onSuccess: (data) => {
      setExecutionResult(data);
    },
    onError: (err: any) => {
      setExecutionResult(err.response?.data?.detail || { error: err.message });
    }
  });

  const handleExecute = () => {
    if (!selectedTool) return;
    try {
      const parsedParams = JSON.parse(params);
      executeMutation.mutate({ name: selectedTool.name, p: parsedParams });
    } catch (e) {
      alert("Invalid JSON parameters");
    }
  };

  const filteredTools = tools?.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.category.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wrench className="w-8 h-8 text-indigo-600" /> Unified Tool Registry
          </h2>
          <p className="text-slate-500 mt-1">
            The central registry for all internal capabilities, external APIs, and MCP servers.
          </p>
        </div>
        
        {stats && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-emerald-700 bg-emerald-50 px-3 py-1">
              <CheckCircle2 className="w-3 h-3 mr-1" /> {stats.success_rate.toFixed(1)}% Success
            </Badge>
            <Badge variant="outline" className="text-indigo-700 bg-indigo-50 px-3 py-1">
              <Activity className="w-3 h-3 mr-1" /> {stats.average_latency_ms}ms Avg
            </Badge>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search tools by name or category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white"
            />
          </div>

          <div className="space-y-2">
            {loadingTools ? (
              <div className="flex justify-center p-4"><Loader2 className="w-4 h-4 animate-spin text-slate-400" /></div>
            ) : filteredTools?.map(tool => (
              <div 
                key={tool.name} 
                onClick={() => { setSelectedTool(tool); setParams("{}"); setExecutionResult(null); }}
                className={`p-3 rounded-lg cursor-pointer border transition-colors ${selectedTool?.name === tool.name ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-sm truncate">{tool.name}</p>
                  <Badge variant="secondary" className="text-[10px] uppercase">{tool.category}</Badge>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selectedTool ? (
            <div className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="bg-slate-50 border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-500" /> {selectedTool.name}
                      </CardTitle>
                      <p className="text-sm text-slate-500 mt-1">{selectedTool.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0 flex flex-col md:flex-row">
                  <div className="flex-1 p-4 border-r border-slate-200 bg-slate-50/50">
                    <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Input Schema (JSON)</h4>
                    <pre className="text-xs bg-slate-800 text-emerald-400 p-3 rounded-md overflow-auto max-h-[300px]">
                      {JSON.stringify(selectedTool.input_schema, null, 2)}
                    </pre>
                  </div>
                  <div className="flex-1 p-4">
                    <h4 className="text-xs font-semibold uppercase text-slate-500 mb-2">Test Execution</h4>
                    <textarea 
                      className="w-full h-[150px] p-2 text-sm font-mono border rounded bg-white mb-2"
                      value={params}
                      onChange={e => setParams(e.target.value)}
                      placeholder='{"key": "value"}'
                    />
                    <Button 
                      onClick={handleExecute}
                      disabled={executeMutation.isPending}
                      className="w-full bg-indigo-600"
                    >
                      {executeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                      Execute Tool
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {executionResult && (
                <Card className={`border shadow-sm ${executionResult.error ? 'border-red-300 bg-red-50' : 'border-emerald-300 bg-emerald-50'}`}>
                  <CardContent className="p-4">
                    <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${executionResult.error ? 'text-red-700' : 'text-emerald-700'}`}>
                      {executionResult.error ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      Execution Result
                    </h4>
                    <pre className="text-xs overflow-auto max-h-[200px] text-slate-800 font-mono bg-white/50 p-2 rounded">
                      {JSON.stringify(executionResult, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 bg-slate-50 rounded-xl border border-dashed">
               <Wrench className="w-12 h-12 text-slate-300 mb-4" />
               <p>Select a tool from the catalog to view details and execute.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
