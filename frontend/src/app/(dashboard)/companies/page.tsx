"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCompanies, enrichCompany } from "@/features/company/services/company.api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CompaniesListPage() {
  const queryClient = useQueryClient();
  const [newCompanyName, setNewCompanyName] = useState("");

  const { data: companies, isLoading } = useQuery({
    queryKey: ['companies'],
    queryFn: listCompanies
  });

  const enrichMutation = useMutation({
    mutationFn: enrichCompany,
    onSuccess: () => {
      setNewCompanyName("");
      queryClient.invalidateQueries({ queryKey: ['companies'] });
      alert("Company successfully analyzed and indexed into RAG!");
    },
    onError: (err: any) => {
      alert("Failed to enrich: " + (err.response?.data?.detail || err.message));
    }
  });

  const handleEnrich = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) return;
    enrichMutation.mutate(newCompanyName);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-indigo-600" /> Company Intelligence
          </h2>
          <p className="text-slate-500 mt-1">
            Analyze companies based on aggregated job postings to reveal culture, tech stacks, and benefits.
          </p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm bg-slate-50">
        <CardContent className="p-6">
          <form onSubmit={handleEnrich} className="flex gap-2 max-w-xl">
            <Input 
              placeholder="Enter company name to analyze (must have jobs in DB)..." 
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              className="flex-1 bg-white"
            />
            <Button type="submit" disabled={enrichMutation.isPending || !newCompanyName.trim()} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
              {enrichMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Extract Intelligence
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies?.map((company) => (
            <Card key={company.id} className="hover:shadow-md transition-shadow border-slate-200 flex flex-col h-full">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    {company.logo_url ? (
                      <img src={company.logo_url} alt={company.company_name} className="w-10 h-10 rounded-lg object-contain bg-white border" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg">
                        {company.company_name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 leading-tight">{company.company_name}</h3>
                      <p className="text-sm text-slate-500">{company.industry || 'Technology'}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex justify-between items-center border-t border-slate-100">
                  <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                    AI Analyzed
                  </Badge>
                  <Link href={`/companies/${company.id}`}>
                    <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                      View Profile <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {companies?.length === 0 && (
            <div className="col-span-full text-center py-20 bg-slate-50 rounded-lg border border-dashed border-slate-300 text-slate-500">
              <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p>No companies have been analyzed yet.</p>
              <p className="text-sm mt-1">Use the input above to extract intelligence for a company.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
