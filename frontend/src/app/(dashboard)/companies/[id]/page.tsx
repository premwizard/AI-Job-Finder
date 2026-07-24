"use client";

import { useQuery } from "@tanstack/react-query";
import { getCompany } from "@/features/company/services/company.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Terminal, Users, Sparkles, Gift, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CompanyDetailsPage() {
  const params = useParams();
  const companyId = parseInt(params.id as string);

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompany(companyId)
  });

  if (isLoading) {
    return <div className="flex justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  if (!company) {
    return <div className="text-center p-20 text-slate-500">Company not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex items-center gap-4">
        <Link href="/companies">
          <div className="p-2 hover:bg-slate-100 rounded-full cursor-pointer transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-500" />
          </div>
        </Link>
        {company.logo_url ? (
          <img src={company.logo_url} alt={company.company_name} className="w-12 h-12 rounded-lg object-contain bg-white border shadow-sm" />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-sm">
            {company.company_name.charAt(0)}
          </div>
        )}
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{company.company_name}</h2>
          <p className="text-slate-500 font-medium">{company.industry || 'Technology'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* AI Summary */}
          <Card className="border-indigo-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-50 to-white p-6">
              <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-indigo-500" /> Executive Summary
              </h3>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{company.ai_summary}</p>
            </div>
          </Card>

          {/* Culture */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-500" /> Engineering Culture & Mission
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {company.culture?.mission && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Mission</h4>
                  <p className="text-slate-600 leading-relaxed">{company.culture.mission}</p>
                </div>
              )}
              {company.culture?.engineering_culture && (
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">How We Work</h4>
                  <p className="text-slate-600 leading-relaxed">{company.culture.engineering_culture}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Tech Stack */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-700" /> Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {company.tech_stack && company.tech_stack.length > 0 ? (
                  company.tech_stack.map((tech, i) => (
                    <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                      {tech}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No tech stack extracted.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="border-b bg-slate-50/50">
              <CardTitle className="text-lg flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" /> Benefits & Perks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ul className="space-y-3">
                {company.benefits && company.benefits.length > 0 ? (
                  company.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 italic">No benefits extracted.</p>
                )}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
