"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { performAdvancedSearch, AdvancedSearchResponse } from "@/features/search/services/search.api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, Filter, Layers, Database, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdvancedSearchPage() {
  const [query, setQuery] = useState("");
  const [collections, setCollections] = useState<string[]>(["jobs", "users", "learning", "companies"]);

  const searchMutation = useMutation({
    mutationFn: (q: string) => performAdvancedSearch(q, "hybrid", collections)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    searchMutation.mutate(query);
  };

  const toggleCollection = (col: string) => {
    setCollections(prev => prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]);
  };

  const data: AdvancedSearchResponse | undefined = searchMutation.data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Search className="w-8 h-8 text-indigo-600" /> Advanced Hybrid Search
          </h2>
          <p className="text-slate-500 mt-1">
            Search simultaneously across Jobs, Profiles, Learning Roadmaps, and Companies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" /> Target Collections
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {["jobs", "users", "learning", "companies"].map(col => (
                <div key={col} className="flex items-center space-x-2">
                  <Checkbox 
                    id={col} 
                    checked={collections.includes(col)}
                    onCheckedChange={() => toggleCollection(col)}
                  />
                  <label htmlFor={col} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize">
                    {col}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3 space-y-6">
          <Card className="shadow-sm border-slate-200">
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input 
                  placeholder="Search for Python AI roles, resume improvements, etc..." 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 h-12 text-lg"
                />
                <Button type="submit" disabled={searchMutation.isPending || !query.trim()} className="h-12 px-6 gap-2 bg-indigo-600 hover:bg-indigo-700">
                  {searchMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {data && (
            <div className="space-y-6">
              {/* Query Understanding Panel */}
              <Card className="border-indigo-100 bg-indigo-50/30 shadow-sm">
                <CardContent className="p-5 flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Query Expansion
                    </h4>
                    <p className="text-sm font-medium text-slate-700">{data.expanded_query}</p>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Database className="w-3 h-3" /> Targeted Collections
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {data.target_collections.map((c, i) => (
                        <Badge key={i} variant="outline" className="bg-white capitalize text-indigo-700 border-indigo-200">
                          {c}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Results Grouped by Collection */}
              <div className="space-y-8">
                {Object.entries(data.results).map(([collection, items]) => (
                  <div key={collection} className="space-y-4">
                    <div className="flex items-center gap-2 border-b pb-2">
                      <Layers className="w-5 h-5 text-slate-500" />
                      <h3 className="text-xl font-bold text-slate-800 capitalize">{collection} Results</h3>
                      <Badge variant="secondary" className="ml-2">{items.length}</Badge>
                    </div>

                    <div className="grid gap-4">
                      {items.map((item: any, idx: number) => (
                        <Card key={idx} className="shadow-sm hover:shadow transition-shadow border-slate-200">
                          <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-3">
                              <Badge variant="outline" className="font-mono text-xs bg-slate-50 text-slate-600">
                                {item.id}
                              </Badge>
                              <Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 flex items-center gap-1">
                                <Zap className="w-3 h-3" />
                                Match: {(item.rerank_score * 100).toFixed(1)}%
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{item.content}</p>
                            <div className="mt-4 flex justify-end">
                              <Button variant="ghost" size="sm" className="text-indigo-600">
                                View Context <ChevronRight className="w-4 h-4 ml-1" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}

                {Object.keys(data.results).length === 0 && (
                  <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
                    <Search className="w-10 h-10 mx-auto text-slate-300 mb-4" />
                    <p>No results found across any collections for your query.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
