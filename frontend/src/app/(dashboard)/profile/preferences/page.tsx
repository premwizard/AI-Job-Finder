"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getJobSearchPreferences,
  updateJobSearchPreferences,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Search,
  Bell,
  Mail,
  Sliders,
  Building2,
  MapPin,
  Sparkles,
  Save,
  Loader2,
  X,
  Plus,
  Ban,
  Tag,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { toast } from "sonner";

// ── Static options & suggestions ──────────────────────────────────────────────

const SEARCH_FREQUENCY_OPTIONS = ["Daily", "Weekly", "Instant", "Manual Only"];
const DIGEST_FREQUENCY_OPTIONS = ["Daily Digest", "Weekly Summary", "Never"];

const SOURCE_SUGGESTIONS = [
  "LinkedIn", "Indeed", "Glassdoor", "Wellfound (AngelList)", "GitHub Jobs",
  "Y Combinator", "RemoteOK", "We Work Remotely", "Dice", "ZipRecruiter",
];

const KEYWORD_SUGGESTIONS = [
  "React", "TypeScript", "Python", "Node.js", "AI/ML", "Backend",
  "Frontend", "Full Stack", "DevOps", "Kubernetes", "Remote", "Senior",
];

const IGNORE_COMPANY_SUGGESTIONS = [
  "Revature", "Infosys", "Wipro", "TCS", "Consulting Agencies",
];

const IGNORE_KEYWORD_SUGGESTIONS = [
  "Unpaid", "W2 Only", "Onsite Only", "Legacy Code", "PHP", "AngularJS",
];

const BLOCKED_LOCATION_SUGGESTIONS = [
  "Onsite Only", "Non-Relocation Cities", "High-Tax Regions",
];

// ── CSV ↔ Array helpers ───────────────────────────────────────────────────────

const toArr = (csv?: string | null): string[] =>
  csv ? csv.split(",").map((s) => s.trim()).filter(Boolean) : [];
const toCSV = (arr: string[]): string => arr.join(",");

// ── Chip Input component ──────────────────────────────────────────────────────

interface ChipInputProps {
  label: string;
  chips: string[];
  suggestions?: string[];
  placeholder?: string;
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
  icon?: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
}

function ChipInput({
  label,
  chips,
  suggestions = [],
  placeholder = "Type and press Enter…",
  onAdd,
  onRemove,
  icon,
  variant = "default",
}: ChipInputProps) {
  const [inputVal, setInputVal] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      !chips.includes(s) &&
      s.toLowerCase().includes(inputVal.toLowerCase())
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputVal.trim()) {
      e.preventDefault();
      onAdd(inputVal.trim());
      setInputVal("");
    } else if (e.key === "Backspace" && !inputVal && chips.length > 0) {
      onRemove(chips[chips.length - 1]);
    }
  };

  const badgeVariant = variant === "destructive" ? "destructive" : "secondary";

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        {icon} {label}
      </label>

      <div className="min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-shadow">
        {chips.map((chip) => (
          <Badge
            key={chip}
            variant={badgeVariant}
            className={`flex items-center gap-1 h-6 text-xs font-medium pl-2 pr-1 rounded-md ${
              variant === "destructive" ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" : ""
            }`}
          >
            {chip}
            <button
              type="button"
              onClick={() => onRemove(chip)}
              className="ml-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-foreground/20 transition-colors"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </Badge>
        ))}

        <div className="relative flex-1 min-w-24">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => { setInputVal(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={chips.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground py-0.5"
          />

          {showSuggestions && filteredSuggestions.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-60 max-h-48 overflow-y-auto z-50 bg-popover border border-border rounded-lg shadow-lg py-1">
              {filteredSuggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onAdd(s);
                    setInputVal("");
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {suggestions.length > 0 && chips.length === 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {suggestions.slice(0, 5).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onAdd(s)}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="w-2.5 h-2.5" /> {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="pb-3 pt-5 px-6">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-primary/10 text-primary">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">{children}</CardContent>
    </Card>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function JobSearchPreferencesPage() {
  const queryClient = useQueryClient();
  const [isDirty, setIsDirty] = useState(false);

  // Form states
  const [searchFrequency, setSearchFrequency] = useState("Daily");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState("Daily Digest");
  const [jobAlertKeywords, setJobAlertKeywords] = useState<string[]>([]);
  const [minMatchScore, setMinMatchScore] = useState<number>(70);
  const [preferredSources, setPreferredSources] = useState<string[]>([]);
  const [ignoreCompanies, setIgnoreCompanies] = useState<string[]>([]);
  const [ignoreKeywords, setIgnoreKeywords] = useState<string[]>([]);
  const [blockedLocations, setBlockedLocations] = useState<string[]>([]);

  // Fetch prefs
  const { data: prefs, isLoading } = useQuery({
    queryKey: ["jobSearchPreferences"],
    queryFn: getJobSearchPreferences,
  });

  useEffect(() => {
    if (!prefs) return;
    setSearchFrequency(prefs.search_frequency || "Daily");
    setEmailNotifications(prefs.email_notifications ?? true);
    setDigestFrequency(prefs.digest_frequency || "Daily Digest");
    setJobAlertKeywords(toArr(prefs.job_alert_keywords));
    setMinMatchScore(prefs.min_match_score ?? 70);
    setPreferredSources(toArr(prefs.preferred_sources));
    setIgnoreCompanies(toArr(prefs.ignore_companies));
    setIgnoreKeywords(toArr(prefs.ignore_keywords));
    setBlockedLocations(toArr(prefs.blocked_locations));
    setIsDirty(false);
  }, [prefs]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const mutation = useMutation({
    mutationFn: updateJobSearchPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobSearchPreferences"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Job search preferences saved successfully!");
      setIsDirty(false);
    },
    onError: () => toast.error("Failed to save preferences. Please try again."),
  });

  const handleSave = () => {
    mutation.mutate({
      search_frequency: searchFrequency,
      email_notifications: emailNotifications,
      digest_frequency: digestFrequency,
      job_alert_keywords: toCSV(jobAlertKeywords),
      min_match_score: minMatchScore,
      preferred_sources: toCSV(preferredSources),
      ignore_companies: toCSV(ignoreCompanies),
      ignore_keywords: toCSV(ignoreKeywords),
      blocked_locations: toCSV(blockedLocations),
    });
  };

  const addChip = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
    setter((prev) => (prev.includes(val) ? prev : [...prev, val]));
    markDirty();
  };
  const removeChip = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
    setter((prev) => prev.filter((v) => v !== val));
    markDirty();
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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Job Search Preferences</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure automated job discovery, search frequency, and filtering criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDirty && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Unsaved changes
            </span>
          )}
          <Button onClick={handleSave} disabled={mutation.isPending} className="shadow-sm">
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-sm text-purple-700 dark:text-purple-300">
        <Sparkles className="w-4 h-4 shrink-0" />
        <p>
          <span className="font-semibold">AI Personalized Recommendations — Active.</span>{" "}
          These filters dictate how the AI matching engine ranks and surfaces relevant jobs for you.
        </p>
      </div>

      {/* 1. Automation & Frequency */}
      <Section title="Search & Notification Rules" icon={<Bell className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-muted-foreground" /> Auto-Search Frequency
            </label>
            <Select
              value={searchFrequency}
              onValueChange={(v) => { setSearchFrequency(v); markDirty(); }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SEARCH_FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" /> Email Digest Frequency
            </label>
            <Select
              value={digestFrequency}
              onValueChange={(v) => { setDigestFrequency(v); markDirty(); }}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIGEST_FREQUENCY_OPTIONS.map((opt) => (
                  <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-xl bg-background">
          <div>
            <p className="text-sm font-semibold">Instant Email Alerts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Receive immediate email alerts when a job match score exceeds your threshold.
            </p>
          </div>
          <Switch
            checked={emailNotifications}
            onCheckedChange={(val) => { setEmailNotifications(val); markDirty(); }}
          />
        </div>
      </Section>

      {/* 2. Match Criteria */}
      <Section title="Match Thresholds & Sources" icon={<Sliders className="w-4 h-4" />}>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Minimum Match Score Threshold</label>
            <span className="text-sm font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
              {minMatchScore}% Match
            </span>
          </div>
          <Slider
            value={[minMatchScore]}
            onValueChange={(val) => { setMinMatchScore(val[0]); markDirty(); }}
            min={50}
            max={95}
            step={5}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Jobs scoring below {minMatchScore}% match will be automatically filtered out of your feed.
          </p>
        </div>

        <ChipInput
          label="Job Alert Keywords"
          chips={jobAlertKeywords}
          suggestions={KEYWORD_SUGGESTIONS}
          placeholder="e.g. React, Full Stack, Remote…"
          onAdd={addChip(setJobAlertKeywords)}
          onRemove={removeChip(setJobAlertKeywords)}
          icon={<Tag className="w-3.5 h-3.5 text-muted-foreground" />}
        />

        <ChipInput
          label="Preferred Job Boards & Sources"
          chips={preferredSources}
          suggestions={SOURCE_SUGGESTIONS}
          placeholder="e.g. LinkedIn, Indeed, Wellfound…"
          onAdd={addChip(setPreferredSources)}
          onRemove={removeChip(setPreferredSources)}
          icon={<Globe className="w-3.5 h-3.5 text-muted-foreground" />}
        />
      </Section>

      {/* 3. Negative Filters & Exclusion Rules */}
      <Section title="Exclusion & Negative Rules" icon={<Ban className="w-4 h-4" />}>
        <ChipInput
          label="Ignore Companies"
          chips={ignoreCompanies}
          suggestions={IGNORE_COMPANY_SUGGESTIONS}
          placeholder="e.g. Company Name…"
          onAdd={addChip(setIgnoreCompanies)}
          onRemove={removeChip(setIgnoreCompanies)}
          icon={<Building2 className="w-3.5 h-3.5 text-muted-foreground" />}
          variant="destructive"
        />

        <ChipInput
          label="Ignore Keywords"
          chips={ignoreKeywords}
          suggestions={IGNORE_KEYWORD_SUGGESTIONS}
          placeholder="e.g. Unpaid, Legacy…"
          onAdd={addChip(setIgnoreKeywords)}
          onRemove={removeChip(setIgnoreKeywords)}
          icon={<Tag className="w-3.5 h-3.5 text-muted-foreground" />}
          variant="destructive"
        />

        <ChipInput
          label="Blocked Locations"
          chips={blockedLocations}
          suggestions={BLOCKED_LOCATION_SUGGESTIONS}
          placeholder="e.g. City or Region…"
          onAdd={addChip(setBlockedLocations)}
          onRemove={removeChip(setBlockedLocations)}
          icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
          variant="destructive"
        />
      </Section>

      {/* Footer button */}
      <div className="flex justify-end pt-2 pb-6">
        <Button
          onClick={handleSave}
          disabled={mutation.isPending}
          size="lg"
          className="shadow-md min-w-40"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Preferences
        </Button>
      </div>
    </div>
  );
}
