"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listMemories, createMemory, deleteMemory, searchMemories, consolidateMemories, UserMemory } from "@/features/memory/services/memory.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, DatabaseZap, Search, Trash2, Combine, Sparkles, Filter } from "lucide-react";

export default function MemoryCenterPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemory, setNewMemory] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedMemories, setSelectedMemories] = useState<number[]>([]);

  const { data: memories, isLoading } = useQuery({
    queryKey: ['memories', selectedType],
    queryFn: () => listMemories(selectedType || undefined)
  });

  const searchMutation = useMutation({
    mutationFn: (q: string) => searchMemories(q)
  });

  const createMutation = useMutation({
    mutationFn: (content: string) => createMemory({ content, memory_type: "semantic", title: "Manual Entry", importance_score: 3 }),
    onSuccess: () => {
      setNewMemory("");
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMemory(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memories'] })
  });

  const consolidateMutation = useMutation({
    mutationFn: (ids: number[]) => consolidateMemories(ids),
    onSuccess: () => {
      setSelectedMemories([]);
      alert("Memories successfully consolidated and compressed!");
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery);
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedMemories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const displayData = searchMutation.data ? searchMutation.data.map(r => ({ ...r.metadata, id: parseInt(r.id.split('_')[1] || '0'), content: r.content })) : memories;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-indigo-600" /> Memory Center
          </h2>
          <p className="text-slate-500 mt-1">
            The central source of truth for your long-term preferences, career context, and episodic events.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedMemories.length > 1 && (
            <Button 
              onClick={() => consolidateMutation.mutate(selectedMemories)}
              disabled={consolidateMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700 shadow-sm"
            >
              {consolidateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Combine className="w-4 h-4 mr-2" />}
              Consolidate Selected ({selectedMemories.length})
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b bg-slate-50">
              <CardTitle className="text-sm flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</CardTitle>
            </CardHeader>
            <CardContent className="p-3 space-y-1">
              {['', 'semantic', 'episodic', 'short_term', 'long_term'].map(type => (
                <div 
                  key={type} 
                  onClick={() => { setSelectedType(type); searchMutation.reset(); }}
                  className={`p-2 text-sm rounded cursor-pointer transition-colors ${selectedType === type ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'hover:bg-slate-100 text-slate-600'}`}
                >
                  {type === '' ? 'All Memories' : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 text-white">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Sparkles className="w-4 h-4" /> Add Context</h3>
              <div className="flex gap-2">
                <Input 
                  value={newMemory}
                  onChange={e => setNewMemory(e.target.value)}
                  placeholder="E.g., I want to learn Rust next year" 
                  className="bg-white/20 border-white/30 text-white placeholder:text-indigo-200"
                />
                <Button 
                  onClick={() => createMutation.mutate(newMemory)}
                  disabled={!newMemory.trim() || createMutation.isPending}
                  variant="secondary"
                >
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Semantic Search (e.g., 'What are my salary expectations?')..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-white"
              />
            </div>
            <Button type="submit" disabled={searchMutation.isPending || !searchQuery.trim()} className="bg-indigo-600">
              {searchMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search Vector Store"}
            </Button>
            {searchMutation.data && (
              <Button type="button" variant="outline" onClick={() => { setSearchQuery(""); searchMutation.reset(); }}>
                Clear
              </Button>
            )}
          </form>

          {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayData?.map((mem: any) => {
                const isSelected = selectedMemories.includes(mem.id);
                return (
                  <Card 
                    key={mem.id} 
                    className={`border transition-all cursor-pointer ${isSelected ? 'border-amber-400 ring-1 ring-amber-400 bg-amber-50/30 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}
                    onClick={() => toggleSelect(mem.id)}
                  >
                    <CardHeader className="pb-2 p-4 flex flex-row items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{mem.memory_type}</Badge>
                          {mem.importance_score && (
                            <Badge variant="outline" className={`text-[10px] uppercase ${mem.importance_score >= 4 ? 'text-red-600 border-red-200 bg-red-50' : 'text-slate-500'}`}>
                              Imp: {mem.importance_score}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-base text-slate-800 leading-tight mt-1">{mem.title || 'Memory Segment'}</CardTitle>
                      </div>
                      
                      {!searchMutation.data && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 text-slate-400 hover:text-red-600 -mr-2"
                          onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(mem.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <p className="text-sm text-slate-600 whitespace-pre-wrap">{mem.content}</p>
                      {mem.source && <p className="text-xs text-slate-400 mt-3 font-mono">Source: {mem.source}</p>}
                    </CardContent>
                  </Card>
                );
              })}
              
              {displayData?.length === 0 && (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                  <DatabaseZap className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                  <p>No memories found in this category.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
