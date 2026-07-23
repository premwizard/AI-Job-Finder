"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrivacySettings,
  updatePrivacySettings,
  exportUserData,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  Search,
  Download,
  FileSpreadsheet,
  Globe,
  Lock,
  Loader2,
  Save,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner";

const RESUME_VISIBILITY_OPTIONS = ["Public", "Recruiters Only", "Private"];
const ACCOUNT_VISIBILITY_OPTIONS = ["Public", "Connections Only", "Private"];

export default function PrivacySettingsPage() {
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  // Privacy states
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [hideEmail, setHideEmail] = useState(false);
  const [hidePhone, setHidePhone] = useState(false);
  const [resumeVisibility, setResumeVisibility] = useState("Recruiters Only");
  const [recruiterVisibility, setRecruiterVisibility] = useState(true);
  const [searchEngineIndexing, setSearchEngineIndexing] = useState(false);
  const [accountVisibility, setAccountVisibility] = useState("Public");

  // Fetch settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["privacySettings"],
    queryFn: getPrivacySettings,
  });

  useEffect(() => {
    if (!settings) return;
    setIsPublicProfile(settings.is_public_profile ?? true);
    setHideEmail(settings.hide_email ?? false);
    setHidePhone(settings.hide_phone ?? false);
    setResumeVisibility(settings.resume_visibility || "Recruiters Only");
    setRecruiterVisibility(settings.recruiter_visibility ?? true);
    setSearchEngineIndexing(settings.search_engine_indexing ?? false);
    setAccountVisibility(settings.account_visibility || "Public");
  }, [settings]);

  const mutation = useMutation({
    mutationFn: updatePrivacySettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacySettings"] });
      toast.success("Privacy settings updated successfully!");
    },
    onError: () => toast.error("Failed to update privacy settings."),
  });

  const handleToggle = (key: string, value: any, setter: (val: any) => void) => {
    setter(value);
    mutation.mutate({ [key]: value });
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const data = await exportUserData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `my_ai_job_finder_data_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Data export downloaded successfully!");
    } catch {
      toast.error("Failed to export data.");
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Privacy Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Control your profile visibility, personal contact details, recruiter access, and data portability.
        </p>
      </div>

      {/* 1. Profile & Account Visibility */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" /> Profile & Account Visibility
          </CardTitle>
          <CardDescription className="text-xs">
            Manage who can view your public profile page and account details.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div>
              <p className="text-sm font-semibold">Public Profile Page</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Allow anyone with your profile link to view your public profile summary.
              </p>
            </div>
            <Switch
              checked={isPublicProfile}
              onCheckedChange={(val) => handleToggle("is_public_profile", val, setIsPublicProfile)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" /> Account Visibility Scope
              </label>
              <Select
                value={accountVisibility}
                onValueChange={(val) => handleToggle("account_visibility", val, setAccountVisibility)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_VISIBILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-muted-foreground" /> Resume Access Level
              </label>
              <Select
                value={resumeVisibility}
                onValueChange={(val) => handleToggle("resume_visibility", val, setResumeVisibility)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {RESUME_VISIBILITY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contact Detail Concealment */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-primary" /> Contact Masking & Protection
          </CardTitle>
          <CardDescription className="text-xs">
            Hide sensitive contact details from public view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Hide Email Address</p>
                <p className="text-xs text-muted-foreground mt-0.5">Mask your email address on public profile views.</p>
              </div>
            </div>
            <Switch
              checked={hideEmail}
              onCheckedChange={(val) => handleToggle("hide_email", val, setHideEmail)}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Hide Phone Number</p>
                <p className="text-xs text-muted-foreground mt-0.5">Conceal phone number from unauthenticated visitors.</p>
              </div>
            </div>
            <Switch
              checked={hidePhone}
              onCheckedChange={(val) => handleToggle("hide_phone", val, setHidePhone)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Recruiter Access & Search Engines */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-primary" /> Recruiter & Indexing Access
          </CardTitle>
          <CardDescription className="text-xs">
            Control search engine discovery and verified recruiter outreach.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div>
              <p className="text-sm font-semibold">Verified Recruiter Outreach</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Allow verified hiring managers and recruiters to match and reach out to you.
              </p>
            </div>
            <Switch
              checked={recruiterVisibility}
              onCheckedChange={(val) => handleToggle("recruiter_visibility", val, setRecruiterVisibility)}
            />
          </div>

          <div className="flex items-center justify-between p-3.5 border rounded-xl bg-background">
            <div className="flex items-center gap-3">
              <Search className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold">Search Engine Indexing</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow Google, Bing, and other web crawlers to index your public profile.
                </p>
              </div>
            </div>
            <Switch
              checked={searchEngineIndexing}
              onCheckedChange={(val) => handleToggle("search_engine_indexing", val, setSearchEngineIndexing)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Data Portability & Export */}
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <Download className="w-4 h-4 text-primary" /> Data Export & Portability
          </CardTitle>
          <CardDescription className="text-xs">
            Download a complete JSON snapshot of your profile data, achievements, and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="w-8 h-8 text-emerald-500 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Export Complete Profile Snapshot</p>
              <p className="text-xs text-muted-foreground">Includes all experiences, projects, skills, preferences, and metadata.</p>
            </div>
          </div>
          <Button onClick={handleExportData} disabled={isExporting} variant="outline" className="shrink-0">
            {isExporting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
            Export Data (.JSON)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
