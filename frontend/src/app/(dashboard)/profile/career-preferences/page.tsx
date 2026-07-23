"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCareerPreferences,
  updateCareerPreferences,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Briefcase,
  Globe,
  MapPin,
  DollarSign,
  Building2,
  Plane,
  Clock,
  Sparkles,
  Save,
  Loader2,
  X,
  Plus,
  CheckCircle2,
  Moon,
  Sun,
  CalendarClock,
} from "lucide-react";
import { toast } from "sonner";

// ── Static option sets ────────────────────────────────────────────────────────

const WORK_SETUP_OPTIONS = ["Remote", "Hybrid", "Onsite"];
const EMPLOYMENT_TYPE_OPTIONS = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Freelance",
  "Internship",
  "Apprenticeship",
];
const COMPANY_SIZE_OPTIONS = ["1–10", "11–50", "51–200", "201–500", "501–1000", "1000+"];
const STARTUP_ENTERPRISE_OPTIONS = ["Startup", "Scale-up", "Mid-size", "Enterprise", "Any"];
const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "SGD", "AED", "JPY", "Other"];
const TRAVEL_OPTIONS = ["None", "Occasional (< 25%)", "Moderate (25–50%)", "Frequent (50%+)"];
const SHIFT_OPTIONS = ["Day Shift", "Night Shift", "Flexible / Async", "Rotating"];
const AVAILABILITY_OPTIONS = [
  "Immediately Available",
  "Available in 2 Weeks",
  "Available in 1 Month",
  "Available in 3 Months",
];

const COMMON_ROLES = [
  "Software Engineer", "Frontend Engineer", "Backend Engineer", "Full-Stack Engineer",
  "Data Scientist", "ML Engineer", "AI Engineer", "DevOps Engineer",
  "Product Manager", "Designer", "QA Engineer", "Security Engineer",
];

const COMMON_INDUSTRIES = [
  "Technology", "Finance / FinTech", "Healthcare", "E-Commerce",
  "EdTech", "Gaming", "Media & Entertainment", "Logistics", "Real Estate",
  "Government", "Non-Profit", "Consulting", "Manufacturing",
];

const COMMON_COUNTRIES = [
  "India", "United States", "United Kingdom", "Germany", "Canada",
  "Australia", "Singapore", "UAE", "Netherlands", "France",
];

const COMMON_CITIES = [
  "Bangalore", "Hyderabad", "Mumbai", "Pune", "Chennai", "Delhi",
  "San Francisco", "New York", "London", "Berlin", "Singapore", "Toronto",
  "Remote",
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
}

function ChipInput({
  label,
  chips,
  suggestions = [],
  placeholder = "Type and press Enter…",
  onAdd,
  onRemove,
  icon,
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

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        {icon} {label}
      </label>

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

      {/* Quick-add suggestion pills */}
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

// ── Toggle Chip Group ─────────────────────────────────────────────────────────

interface ToggleChipGroupProps {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (val: string) => void;
  icon?: React.ReactNode;
  multiSelect?: boolean;
}

function ToggleChipGroup({
  label,
  options,
  selected,
  onToggle,
  icon,
  multiSelect = true,
}: ToggleChipGroupProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
        {icon} {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {isSelected && <CheckCircle2 className="inline w-3 h-3 mr-1 -mt-0.5" />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Boolean Toggle Card ───────────────────────────────────────────────────────

interface BoolToggleProps {
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function BoolToggle({ label, description, value, onChange }: BoolToggleProps) {
  return (
    <div
      onClick={() => onChange(!value)}
      className={`cursor-pointer flex items-center justify-between gap-4 p-4 rounded-xl border transition-all duration-150 ${
        value
          ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
          : "bg-background border-border hover:border-border/80 hover:bg-muted/10"
      }`}
    >
      <div>
        <p className="text-sm font-semibold">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div
        className={`w-10 h-6 rounded-full flex items-center transition-all duration-200 ${
          value ? "bg-primary justify-end" : "bg-muted/50 justify-start"
        } px-1`}
      >
        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </div>
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

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CareerPreferencesPage() {
  const queryClient = useQueryClient();
  const [isDirty, setIsDirty] = useState(false);

  // Form state
  const [roles, setRoles] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [workSetup, setWorkSetup] = useState<string[]>([]);
  const [expectedSalary, setExpectedSalary] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [negotiable, setNegotiable] = useState(false);
  const [employmentTypes, setEmploymentTypes] = useState<string[]>([]);
  const [companySize, setCompanySize] = useState<string[]>([]);
  const [startupEnterprise, setStartupEnterprise] = useState("");
  const [visaSponsorship, setVisaSponsorship] = useState(false);
  const [willingToRelocate, setWillingToRelocate] = useState(false);
  const [travel, setTravel] = useState("");
  const [shift, setShift] = useState("");
  const [availability, setAvailability] = useState("");

  // Fetch existing prefs
  const { data: prefs, isLoading } = useQuery({
    queryKey: ["careerPreferences"],
    queryFn: getCareerPreferences,
  });

  // Populate form when data loads
  useEffect(() => {
    if (!prefs) return;
    setRoles(toArr(prefs.preferred_roles));
    setIndustries(toArr(prefs.preferred_industries));
    setCountries(toArr(prefs.preferred_countries));
    setCities(toArr(prefs.preferred_cities));
    setWorkSetup(toArr(prefs.work_setup));
    setExpectedSalary(prefs.expected_salary || "");
    setCurrency(prefs.preferred_currency || "USD");
    setNegotiable(prefs.negotiable_salary || false);
    setEmploymentTypes(toArr(prefs.employment_types));
    setCompanySize(toArr(prefs.company_size));
    setStartupEnterprise(prefs.startup_or_enterprise || "");
    setVisaSponsorship(prefs.visa_sponsorship || false);
    setWillingToRelocate(prefs.willing_to_relocate || false);
    setTravel(prefs.travel_willingness || "");
    setShift(prefs.preferred_shift || "");
    setAvailability(prefs.availability || "");
    setIsDirty(false);
  }, [prefs]);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const mutation = useMutation({
    mutationFn: updateCareerPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["careerPreferences"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Career preferences saved successfully!");
      setIsDirty(false);
    },
    onError: () => toast.error("Failed to save preferences. Please try again."),
  });

  const handleSave = () => {
    mutation.mutate({
      preferred_roles: toCSV(roles),
      preferred_industries: toCSV(industries),
      preferred_countries: toCSV(countries),
      preferred_cities: toCSV(cities),
      work_setup: toCSV(workSetup),
      expected_salary: expectedSalary,
      preferred_currency: currency,
      negotiable_salary: negotiable,
      employment_types: toCSV(employmentTypes),
      company_size: toCSV(companySize),
      startup_or_enterprise: startupEnterprise,
      visa_sponsorship: visaSponsorship,
      willing_to_relocate: willingToRelocate,
      travel_willingness: travel,
      preferred_shift: shift,
      availability: availability,
    });
  };

  // Chip toggle helpers for multi-select groups
  const toggleChip = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (val: string) => {
    setter((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
    markDirty();
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
            <Briefcase className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Career Preferences</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us exactly what you're looking for. This shapes AI job matching.
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

      {/* Future Ready AI Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-sm text-purple-700 dark:text-purple-300">
        <Sparkles className="w-4 h-4 shrink-0" />
        <p>
          <span className="font-semibold">AI Job Matching — Coming Soon.</span>{" "}
          These preferences will power intelligent job recommendations, fit scoring, and smart alerts.
        </p>
      </div>

      {/* 1. Role & Industry */}
      <Section title="Target Roles & Industries" icon={<Briefcase className="w-4 h-4" />}>
        <ChipInput
          label="Preferred Roles"
          chips={roles}
          suggestions={COMMON_ROLES}
          placeholder="e.g. Backend Engineer, ML Engineer…"
          onAdd={addChip(setRoles)}
          onRemove={removeChip(setRoles)}
        />
        <ChipInput
          label="Preferred Industries"
          chips={industries}
          suggestions={COMMON_INDUSTRIES}
          placeholder="e.g. FinTech, Healthcare, EdTech…"
          onAdd={addChip(setIndustries)}
          onRemove={removeChip(setIndustries)}
        />
      </Section>

      {/* 2. Location */}
      <Section title="Location Preferences" icon={<Globe className="w-4 h-4" />}>
        <ChipInput
          label="Preferred Countries"
          chips={countries}
          suggestions={COMMON_COUNTRIES}
          placeholder="e.g. India, USA, Germany…"
          onAdd={addChip(setCountries)}
          onRemove={removeChip(setCountries)}
          icon={<Globe className="w-3.5 h-3.5 text-muted-foreground" />}
        />
        <ChipInput
          label="Preferred Cities"
          chips={cities}
          suggestions={COMMON_CITIES}
          placeholder="e.g. Bangalore, New York, Remote…"
          onAdd={addChip(setCities)}
          onRemove={removeChip(setCities)}
          icon={<MapPin className="w-3.5 h-3.5 text-muted-foreground" />}
        />
        <ToggleChipGroup
          label="Work Setup"
          options={WORK_SETUP_OPTIONS}
          selected={workSetup}
          onToggle={(val) => { toggleChip(setWorkSetup)(val); }}
          icon={<Building2 className="w-3.5 h-3.5 text-muted-foreground" />}
        />
      </Section>

      {/* 3. Compensation */}
      <Section title="Compensation & Salary" icon={<DollarSign className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-sm font-semibold">Expected Annual Salary</label>
            <Input
              placeholder="e.g. 120000 or 80,000 – 100,000"
              value={expectedSalary}
              onChange={(e) => { setExpectedSalary(e.target.value); markDirty(); }}
              className="h-9"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Currency</label>
            <Select value={currency} onValueChange={(v) => { setCurrency(v); markDirty(); }}>
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <BoolToggle
          label="Open to Salary Negotiation"
          description="Mark this if the above salary is a starting expectation and you are open to discuss."
          value={negotiable}
          onChange={(v) => { setNegotiable(v); markDirty(); }}
        />
      </Section>

      {/* 4. Company Preferences */}
      <Section title="Company Preferences" icon={<Building2 className="w-4 h-4" />}>
        <ToggleChipGroup
          label="Employment Type"
          options={EMPLOYMENT_TYPE_OPTIONS}
          selected={employmentTypes}
          onToggle={(val) => { toggleChip(setEmploymentTypes)(val); }}
        />
        <ToggleChipGroup
          label="Company Size"
          options={COMPANY_SIZE_OPTIONS}
          selected={companySize}
          onToggle={(val) => { toggleChip(setCompanySize)(val); }}
        />
        <div className="space-y-2">
          <label className="text-sm font-semibold">Startup vs Enterprise</label>
          <div className="flex flex-wrap gap-2">
            {STARTUP_ENTERPRISE_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { setStartupEnterprise(opt); markDirty(); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  startupEnterprise === opt
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background text-muted-foreground border-border hover:border-primary/50"
                }`}
              >
                {opt === startupEnterprise && <CheckCircle2 className="inline w-3 h-3 mr-1 -mt-0.5" />}
                {opt}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* 5. Mobility */}
      <Section title="Mobility & Visa" icon={<Plane className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <BoolToggle
            label="Visa Sponsorship Required"
            description="I need a company to sponsor my work visa."
            value={visaSponsorship}
            onChange={(v) => { setVisaSponsorship(v); markDirty(); }}
          />
          <BoolToggle
            label="Open to Relocation"
            description="I am willing to move to a new city or country."
            value={willingToRelocate}
            onChange={(v) => { setWillingToRelocate(v); markDirty(); }}
          />
        </div>
      </Section>

      {/* 6. Schedule & Travel */}
      <Section title="Schedule & Travel" icon={<Clock className="w-4 h-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Plane className="w-3.5 h-3.5 text-muted-foreground" /> Travel Preference
            </label>
            <Select value={travel} onValueChange={(v) => { setTravel(v); markDirty(); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {TRAVEL_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-muted-foreground" /> Preferred Shift
            </label>
            <Select value={shift} onValueChange={(v) => { setShift(v); markDirty(); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {SHIFT_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1.5">
              <CalendarClock className="w-3.5 h-3.5 text-muted-foreground" /> Availability
            </label>
            <Select value={availability} onValueChange={(v) => { setAvailability(v); markDirty(); }}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select…" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Section>

      {/* Save Footer */}
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
