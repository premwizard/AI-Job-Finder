"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAIPreferences,
  updateAIPreferences,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Sparkles,
  Building2,
  Briefcase,
  Code2,
  Brain,
  BookOpen,
  Globe,
  Target,
  TrendingUp,
  Save,
  Loader2,
  X,
  Plus,
  Zap,
  Trophy,
  GraduationCap,
  Map,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";

// ── Static suggestion sets ────────────────────────────────────────────────────

const COMPANY_SUGGESTIONS = [
  "Google", "OpenAI", "Meta", "Apple", "Microsoft", "Amazon", "Stripe",
  "Anthropic", "DeepMind", "Netflix", "Spotify", "Airbnb", "Uber",
  "Figma", "Notion", "Linear", "Vercel", "GitHub", "GitLab", "HashiCorp",
];

const ROLE_SUGGESTIONS = [
  "AI Researcher", "ML Engineer", "Staff Engineer", "Principal Engineer",
  "CTO", "VP of Engineering", "Head of AI", "Data Scientist",
  "AI Product Manager", "Full-Stack Engineer", "Platform Engineer",
  "Research Scientist", "Engineering Manager", "Solutions Architect",
];

const TECH_SUGGESTIONS = [
  "LLMs", "Transformers", "PyTorch", "JAX", "Rust", "Go", "TypeScript",
  "Kubernetes", "Distributed Systems", "RLHF", "RAG", "GraphQL",
  "WebAssembly", "eBPF", "Quantum Computing", "Edge Computing",
];

const AI_DOMAIN_SUGGESTIONS = [
  "Natural Language Processing", "Computer Vision", "Reinforcement Learning",
  "Generative AI", "MLOps", "AI Safety", "Robotics", "Speech Recognition",
  "Recommendation Systems", "Graph Neural Networks", "Autonomous Agents",
  "Multimodal AI", "Edge AI", "AI Ethics",
];

const LEARNING_RESOURCE_SUGGESTIONS = [
  "Coursera", "edX", "Fast.ai", "Deeplearning.ai", "YouTube", "Udemy",
  "ArXiv Papers", "Technical Blogs", "Books", "Podcasts", "Conferences",
  "Open Source Projects", "Kaggle", "LeetCode",
];

const TARGET_COUNTRY_SUGGESTIONS = [
  "United States", "United Kingdom", "Germany", "Canada", "Australia",
  "Netherlands", "Singapore", "Japan", "France", "Sweden", "Switzerland",
  "India", "UAE", "Remote / Worldwide",
];

const GROWTH_PRIORITY_SUGGESTIONS = [
  "Technical Leadership", "System Design Mastery", "AI/ML Expertise",
  "Open Source Contributions", "Public Speaking", "Technical Writing",
  "Mentoring", "International Exposure", "Startup Experience",
  "Research Publications", "Cross-functional Leadership",
];

// ── CSV ↔ Array helpers ───────────────────────────────────────────────────────

const toArr = (csv?: string | null): string[] =>
  csv ? csv.split(",").map((s) => s.trim()).filter(Boolean) : [];
const toCSV = (arr: string[]): string => arr.join(",");

// ── Reusable chip input ───────────────────────────────────────────────────────

interface ChipInputProps {
  chips: string[];
  suggestions?: string[];
  placeholder?: string;
  onAdd: (val: string) => void;
  onRemove: (val: string) => void;
}

function ChipInput({ chips, suggestions = [], placeholder = "Type and press Enter…", onAdd, onRemove }: ChipInputProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = suggestions.filter(
    (s) => !chips.includes(s) && s.toLowerCase().includes(input.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <div className="min-h-10 w-full rounded-lg border border-input bg-background px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-1 transition-shadow">
        {chips.map((chip) => (
          <Badge
            key={chip}
            variant="secondary"
            className="flex items-center gap-1 h-6 text-xs font-medium pl-2 pr-1 rounded-md"
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
            value={input}
            onChange={(e) => { setInput(e.target.value); setOpen(true); }}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && input.trim()) {
                e.preventDefault();
                onAdd(input.trim());
                setInput("");
              } else if (e.key === "Backspace" && !input && chips.length > 0) {
                onRemove(chips[chips.length - 1]);
              }
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            placeholder={chips.length === 0 ? placeholder : ""}
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground py-0.5"
          />
          {open && filtered.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-64 max-h-52 overflow-y-auto z-50 bg-popover border border-border rounded-lg shadow-xl py-1">
              {filtered.slice(0, 10).map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onAdd(s);
                    setInput("");
                    setOpen(false);
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
      {/* Quick-adds */}
      {suggestions.length > 0 && chips.length === 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 6).map((s) => (
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
  subtitle,
  children,
  gradient = false,
}: {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  gradient?: boolean;
}) {
  return (
    <Card className={`border-border/60 shadow-sm overflow-hidden ${gradient ? "border-purple-500/20" : ""}`}>
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/3 to-transparent pointer-events-none rounded-xl" />
      )}
      <CardHeader className="pb-2 pt-5 px-6">
        <CardTitle className="text-base font-bold flex items-start gap-3">
          <span className={`p-1.5 rounded-lg shrink-0 ${gradient ? "bg-purple-500/10 text-purple-600 dark:text-purple-400" : "bg-primary/10 text-primary"}`}>
            {icon}
          </span>
          <div>
            {title}
            {subtitle && <p className="text-xs font-normal text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-6 space-y-5">{children}</CardContent>
    </Card>
  );
}

// ── Future capability card ────────────────────────────────────────────────────

interface FutureCapCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FUTURE_CAPS: FutureCapCard[] = [
  {
    icon: <Zap className="w-5 h-5" />,
    title: "AI Job Matching",
    description: "Match jobs with precision fit scores based on your aspiration profile.",
    color: "text-amber-500",
  },
  {
    icon: <GraduationCap className="w-5 h-5" />,
    title: "Learning Recommendations",
    description: "Auto-curated learning paths to close skill gaps for your dream roles.",
    color: "text-blue-500",
  },
  {
    icon: <Trophy className="w-5 h-5" />,
    title: "Job Ranking & Scoring",
    description: "Automatically rank and score inbound job opportunities against goals.",
    color: "text-emerald-500",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Skill Gap Analysis",
    description: "Compare your current skills against your dream company requirements.",
    color: "text-purple-500",
  },
];

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AIPreferencesPage() {
  const queryClient = useQueryClient();
  const [isDirty, setIsDirty] = useState(false);

  // Aspiration state
  const [dreamCompanies, setDreamCompanies] = useState<string[]>([]);
  const [dreamRoles, setDreamRoles] = useState<string[]>([]);
  const [dreamTech, setDreamTech] = useState<string[]>([]);

  // AI & Learning
  const [aiDomains, setAiDomains] = useState<string[]>([]);
  const [learningGoals, setLearningGoals] = useState("");
  const [learningResources, setLearningResources] = useState<string[]>([]);

  // Career Goals
  const [targetSalary, setTargetSalary] = useState("");
  const [targetCountries, setTargetCountries] = useState<string[]>([]);
  const [careerObjectives, setCareerObjectives] = useState("");
  const [growthPriorities, setGrowthPriorities] = useState<string[]>([]);

  const { data: prefs, isLoading } = useQuery({
    queryKey: ["aiPreferences"],
    queryFn: getAIPreferences,
  });

  useEffect(() => {
    if (!prefs) return;
    setDreamCompanies(toArr(prefs.dream_companies));
    setDreamRoles(toArr(prefs.dream_roles));
    setDreamTech(toArr(prefs.dream_technologies));
    setAiDomains(toArr(prefs.preferred_ai_domains));
    setLearningGoals(prefs.learning_goals || "");
    setLearningResources(toArr(prefs.preferred_learning_resources));
    setTargetSalary(prefs.target_salary || "");
    setTargetCountries(toArr(prefs.target_countries));
    setCareerObjectives(prefs.career_objectives || "");
    setGrowthPriorities(toArr(prefs.career_growth_priorities));
    setIsDirty(false);
  }, [prefs]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const mutation = useMutation({
    mutationFn: updateAIPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiPreferences"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("AI preferences saved!");
      setIsDirty(false);
    },
    onError: () => toast.error("Failed to save. Please try again."),
  });

  const handleSave = () => {
    mutation.mutate({
      dream_companies: toCSV(dreamCompanies),
      dream_roles: toCSV(dreamRoles),
      dream_technologies: toCSV(dreamTech),
      preferred_ai_domains: toCSV(aiDomains),
      learning_goals: learningGoals,
      preferred_learning_resources: toCSV(learningResources),
      target_salary: targetSalary,
      target_countries: toCSV(targetCountries),
      career_objectives: careerObjectives,
      career_growth_priorities: toCSV(growthPriorities),
    });
  };

  const add = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
    setter((prev) => (prev.includes(val) ? prev : [...prev, val]));
    markDirty();
  };
  const remove = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
    setter((prev) => prev.filter((v) => v !== val));
    markDirty();
  };

  // Completion score — how many of the 9 key fields are filled
  const filledFields = [
    dreamCompanies.length > 0,
    dreamRoles.length > 0,
    dreamTech.length > 0,
    aiDomains.length > 0,
    learningGoals.trim().length > 0,
    learningResources.length > 0,
    targetSalary.trim().length > 0,
    targetCountries.length > 0,
    careerObjectives.trim().length > 0,
    growthPriorities.length > 0,
  ].filter(Boolean).length;

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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">AI Preferences</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Define your aspirations. These power every AI feature in the platform.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {isDirty && (
            <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Unsaved changes
            </span>
          )}
          <Button onClick={handleSave} disabled={mutation.isPending} className="shadow-sm bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600">
            {mutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </div>
      </div>

      {/* Completion indicator */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Aspiration profile completeness</span>
          <span className="font-medium text-foreground">{filledFields}/10 fields filled</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${(filledFields / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Future Capabilities Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {FUTURE_CAPS.map((cap) => (
          <div
            key={cap.title}
            className="p-3 rounded-xl border border-dashed border-border/60 bg-muted/5 space-y-2"
          >
            <div className={`${cap.color} opacity-70`}>{cap.icon}</div>
            <p className="text-xs font-semibold leading-tight">{cap.title}</p>
            <p className="text-[11px] text-muted-foreground/70 leading-tight">{cap.description}</p>
            <Badge variant="outline" className="text-[10px] font-semibold border-dashed text-muted-foreground/60">
              Coming Soon
            </Badge>
          </div>
        ))}
      </div>

      {/* Section 1 — Dream Aspirations */}
      <Section
        title="Dream Aspirations"
        icon={<Trophy className="w-4 h-4" />}
        subtitle="The places, roles, and tech stacks you are aiming for"
        gradient
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
            Dream Companies
          </label>
          <ChipInput
            chips={dreamCompanies}
            suggestions={COMPANY_SUGGESTIONS}
            placeholder="e.g. OpenAI, Stripe, Google…"
            onAdd={add(setDreamCompanies)}
            onRemove={remove(setDreamCompanies)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-muted-foreground" />
            Dream Roles
          </label>
          <ChipInput
            chips={dreamRoles}
            suggestions={ROLE_SUGGESTIONS}
            placeholder="e.g. Staff Engineer, Head of AI…"
            onAdd={add(setDreamRoles)}
            onRemove={remove(setDreamRoles)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
            Dream Technologies
          </label>
          <ChipInput
            chips={dreamTech}
            suggestions={TECH_SUGGESTIONS}
            placeholder="e.g. LLMs, Rust, Distributed Systems…"
            onAdd={add(setDreamTech)}
            onRemove={remove(setDreamTech)}
          />
        </div>
      </Section>

      {/* Section 2 — AI & Learning */}
      <Section
        title="AI & Learning"
        icon={<Brain className="w-4 h-4" />}
        subtitle="Focus areas and how you prefer to grow"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            Preferred AI Domains
          </label>
          <ChipInput
            chips={aiDomains}
            suggestions={AI_DOMAIN_SUGGESTIONS}
            placeholder="e.g. NLP, Generative AI, MLOps…"
            onAdd={add(setAiDomains)}
            onRemove={remove(setAiDomains)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
            Preferred Learning Resources
          </label>
          <ChipInput
            chips={learningResources}
            suggestions={LEARNING_RESOURCE_SUGGESTIONS}
            placeholder="e.g. Coursera, ArXiv Papers, Fast.ai…"
            onAdd={add(setLearningResources)}
            onRemove={remove(setLearningResources)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Learning Goals</label>
          <Textarea
            value={learningGoals}
            onChange={(e) => { setLearningGoals(e.target.value); markDirty(); }}
            placeholder="What skills or knowledge are you actively working to develop? Be specific — this helps the AI tailor your learning path."
            className="min-h-[90px] text-sm resize-none"
          />
        </div>
      </Section>

      {/* Section 3 — Career Goals */}
      <Section
        title="Career Goals"
        icon={<Target className="w-4 h-4" />}
        subtitle="Where you want to go and what you want to earn"
      >
        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-muted-foreground" />
            Target Countries
          </label>
          <ChipInput
            chips={targetCountries}
            suggestions={TARGET_COUNTRY_SUGGESTIONS}
            placeholder="e.g. USA, Germany, Remote…"
            onAdd={add(setTargetCountries)}
            onRemove={remove(setTargetCountries)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-muted-foreground" />
            Target Annual Salary
          </label>
          <Input
            value={targetSalary}
            onChange={(e) => { setTargetSalary(e.target.value); markDirty(); }}
            placeholder="e.g. $200,000 or ₹50,00,000 or €90,000"
            className="h-9"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-muted-foreground" />
            Career Growth Priorities
          </label>
          <ChipInput
            chips={growthPriorities}
            suggestions={GROWTH_PRIORITY_SUGGESTIONS}
            placeholder="e.g. Technical Leadership, Research Publications…"
            onAdd={add(setGrowthPriorities)}
            onRemove={remove(setGrowthPriorities)}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Career Objectives</label>
          <Textarea
            value={careerObjectives}
            onChange={(e) => { setCareerObjectives(e.target.value); markDirty(); }}
            placeholder="Where do you see yourself in 5 years? What impact do you want to create? What legacy do you want to leave? Write freely — the AI Agent uses this as your north star."
            className="min-h-[110px] text-sm resize-none"
          />
        </div>
      </Section>

      {/* Save Footer */}
      <div className="flex items-center justify-between pt-2 pb-6">
        <p className="text-xs text-muted-foreground">
          {filledFields < 5
            ? "Fill at least 5 fields to unlock AI capabilities."
            : filledFields < 10
            ? `${10 - filledFields} more field${10 - filledFields > 1 ? "s" : ""} to a fully optimized profile.`
            : "Your aspiration profile is fully optimized! 🎉"}
        </p>
        <Button
          onClick={handleSave}
          disabled={mutation.isPending}
          size="lg"
          className="min-w-44 bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-500 dark:hover:bg-purple-600 shadow-md"
        >
          {mutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save AI Preferences
        </Button>
      </div>
    </div>
  );
}
