"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSocialProfiles,
  updateSocialProfiles,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Loader2,
  Save,
  Check,
  X,
  Copy,
  Pencil,
  Github,
  Globe,
  Youtube,
  Sparkles,
  Link2,
} from "lucide-react";
import { toast } from "sonner";

// ── Platform definitions ──────────────────────────────────────────────────────

interface Platform {
  key: string;
  label: string;
  placeholder: string;
  color: string;
  bg: string;
  textColor: string;
  icon: React.ReactNode;
  baseUrl: string;
  category: string;
}

// Inline SVG icons for platforms without lucide equivalents
const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const KaggleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.825 23.859c-.022.092-.117.141-.281.141h-3.139c-.187 0-.351-.082-.492-.248l-5.178-6.589-1.448 1.374v5.111c0 .235-.117.352-.351.352H5.505c-.236 0-.354-.117-.354-.352V.353c0-.233.118-.353.354-.353h2.431c.234 0 .351.12.351.353v14.343l6.203-6.272c.165-.165.33-.246.495-.246h3.239c.144 0 .236.06.285.18.046.149.034.255-.036.315l-6.555 6.344 6.836 8.507c.095.104.117.208.07.336z" />
  </svg>
);

const LeetCodeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const HackerRankIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0c1.285 0 9.75 4.886 10.392 6 .645 1.123.645 10.877 0 12-.642 1.114-9.107 6-10.392 6-1.285 0-9.75-4.886-10.392-6C.963 16.877.963 7.123 1.608 6 2.25 4.886 10.715 0 12 0zm2.295 6.799c-.141 0-.258.115-.258.258v3.875H9.963V7.057a.258.258 0 0 0-.258-.258H7.699a.258.258 0 0 0-.258.258v9.886c0 .143.115.258.258.258H9.7a.258.258 0 0 0 .258-.258v-3.875h4.074v3.875c0 .143.116.258.258.258h2.006a.258.258 0 0 0 .258-.258V7.057a.258.258 0 0 0-.258-.258h-2.001z" />
  </svg>
);

const CodeforcesIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M4.5 7.5A1.5 1.5 0 0 1 6 9v10.5A1.5 1.5 0 0 1 4.5 21h-3A1.5 1.5 0 0 1 0 19.5V9a1.5 1.5 0 0 1 1.5-1.5h3zm9-4.5A1.5 1.5 0 0 1 15 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-15A1.5 1.5 0 0 1 10.5 3h3zm9 7.5A1.5 1.5 0 0 1 24 12v7.5A1.5 1.5 0 0 1 22.5 21h-3A1.5 1.5 0 0 1 18 19.5V12a1.5 1.5 0 0 1 1.5-1.5h3z" />
  </svg>
);

const MediumIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

const DevToIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const PLATFORMS: Platform[] = [
  {
    key: "github_url",
    label: "GitHub",
    placeholder: "https://github.com/username",
    color: "#24292e",
    bg: "bg-gray-900/10 dark:bg-gray-100/10",
    textColor: "text-gray-900 dark:text-gray-100",
    icon: <Github className="w-5 h-5" />,
    baseUrl: "github.com",
    category: "Code",
  },
  {
    key: "linkedin_url",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    color: "#0077b5",
    bg: "bg-blue-600/10",
    textColor: "text-blue-700 dark:text-blue-400",
    icon: <LinkedInIcon />,
    baseUrl: "linkedin.com",
    category: "Professional",
  },
  {
    key: "portfolio_url",
    label: "Portfolio / Website",
    placeholder: "https://yourwebsite.com",
    color: "#6366f1",
    bg: "bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
    icon: <Globe className="w-5 h-5" />,
    baseUrl: "",
    category: "Portfolio",
  },
  {
    key: "kaggle_url",
    label: "Kaggle",
    placeholder: "https://kaggle.com/username",
    color: "#20beff",
    bg: "bg-sky-500/10",
    textColor: "text-sky-600 dark:text-sky-400",
    icon: <KaggleIcon />,
    baseUrl: "kaggle.com",
    category: "Data Science",
  },
  {
    key: "leetcode_url",
    label: "LeetCode",
    placeholder: "https://leetcode.com/u/username",
    color: "#ffa116",
    bg: "bg-amber-500/10",
    textColor: "text-amber-600 dark:text-amber-400",
    icon: <LeetCodeIcon />,
    baseUrl: "leetcode.com",
    category: "Competitive",
  },
  {
    key: "hackerrank_url",
    label: "HackerRank",
    placeholder: "https://hackerrank.com/profile/username",
    color: "#00ea64",
    bg: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
    icon: <HackerRankIcon />,
    baseUrl: "hackerrank.com",
    category: "Competitive",
  },
  {
    key: "codeforces_url",
    label: "Codeforces",
    placeholder: "https://codeforces.com/profile/username",
    color: "#1f8acb",
    bg: "bg-blue-400/10",
    textColor: "text-blue-500 dark:text-blue-300",
    icon: <CodeforcesIcon />,
    baseUrl: "codeforces.com",
    category: "Competitive",
  },
  {
    key: "medium_url",
    label: "Medium",
    placeholder: "https://medium.com/@username",
    color: "#000000",
    bg: "bg-gray-700/10 dark:bg-gray-100/10",
    textColor: "text-gray-800 dark:text-gray-200",
    icon: <MediumIcon />,
    baseUrl: "medium.com",
    category: "Writing",
  },
  {
    key: "devto_url",
    label: "Dev.to",
    placeholder: "https://dev.to/username",
    color: "#0a0a0a",
    bg: "bg-slate-700/10 dark:bg-slate-200/10",
    textColor: "text-slate-800 dark:text-slate-200",
    icon: <DevToIcon />,
    baseUrl: "dev.to",
    category: "Writing",
  },
  {
    key: "youtube_url",
    label: "YouTube",
    placeholder: "https://youtube.com/@channel",
    color: "#ff0000",
    bg: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400",
    icon: <Youtube className="w-5 h-5" />,
    baseUrl: "youtube.com",
    category: "Content",
  },
  {
    key: "twitter_url",
    label: "X (Twitter)",
    placeholder: "https://x.com/username",
    color: "#000000",
    bg: "bg-gray-800/10 dark:bg-gray-100/10",
    textColor: "text-gray-900 dark:text-gray-100",
    icon: <XIcon />,
    baseUrl: "x.com",
    category: "Social",
  },
];

// ── URL validation ────────────────────────────────────────────────────────────

function validateUrl(url: string, baseUrl: string): string | null {
  if (!url || url.trim() === "") return null;
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (baseUrl && !parsed.hostname.includes(baseUrl)) {
      return `URL should be from ${baseUrl}`;
    }
    return null;
  } catch {
    return "Invalid URL format";
  }
}

// ── Category badge ────────────────────────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  Code: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
  Professional: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Portfolio: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  "Data Science": "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
  Competitive: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  Writing: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20",
  Content: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  Social: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
};

// ── Individual Platform Card ──────────────────────────────────────────────────

interface PlatformCardProps {
  platform: Platform;
  currentValue: string;
  onSave: (key: string, value: string) => void;
}

function PlatformCard({ platform, currentValue, onSave }: PlatformCardProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(currentValue);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const isConnected = !!currentValue;

  const handleEdit = () => {
    setInputValue(currentValue);
    setError(null);
    setEditing(true);
  };

  const handleSave = () => {
    const trimmed = inputValue.trim();

    if (trimmed) {
      // Auto-add https:// if missing
      const normalized = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
      const err = validateUrl(normalized, platform.baseUrl);
      if (err) {
        setError(err);
        return;
      }
      onSave(platform.key, normalized);
    } else {
      onSave(platform.key, ""); // clear
    }
    setEditing(false);
    setError(null);
  };

  const handleClear = () => {
    onSave(platform.key, "");
    setEditing(false);
    setInputValue("");
    setError(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setInputValue(currentValue);
    setError(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy URL");
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        isConnected
          ? "border-border/60 shadow-sm"
          : "border-dashed border-border/40 bg-muted/5 hover:border-border/70"
      } ${editing ? "ring-2 ring-ring ring-offset-1" : ""}`}
    >
      {/* Card Header */}
      <div className={`flex items-center gap-3 px-4 py-3 ${isConnected ? platform.bg : ""}`}>
        <div className={`${platform.textColor} ${!isConnected ? "opacity-40" : ""}`}>
          {platform.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{platform.label}</span>
            <Badge
              variant="outline"
              className={`text-[10px] font-medium px-1.5 py-0 h-4 ${CATEGORY_COLORS[platform.category]}`}
            >
              {platform.category}
            </Badge>
            {isConnected && (
              <Badge className="text-[10px] font-semibold px-1.5 py-0 h-4 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25">
                <Check className="w-2.5 h-2.5 mr-0.5" /> Connected
              </Badge>
            )}
          </div>

          {isConnected && !editing && (
            <p className="text-xs text-muted-foreground truncate mt-0.5 max-w-xs">
              {currentValue}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isConnected && !editing && (
            <>
              <button
                onClick={handleCopy}
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Copy URL"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <a
                href={currentValue}
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Open link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}

          {!editing && (
            <button
              onClick={handleEdit}
              className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                isConnected
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent"
                  : "text-primary hover:bg-primary/10"
              }`}
              title={isConnected ? "Edit URL" : "Add URL"}
            >
              {isConnected ? <Pencil className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      {/* Edit Section */}
      {editing && (
        <div className="px-4 py-3 border-t border-border/40 bg-background space-y-2">
          <div className="flex items-center gap-2">
            <Input
              autoFocus
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
              placeholder={platform.placeholder}
              className={`h-8 text-sm flex-1 ${error ? "border-destructive" : ""}`}
            />
            <button
              onClick={handleSave}
              className="w-8 h-8 rounded-md flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 transition-colors"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-md flex items-center justify-center bg-muted text-muted-foreground hover:bg-accent shrink-0 transition-colors"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            {isConnected && (
              <button
                onClick={handleClear}
                className="w-8 h-8 rounded-md flex items-center justify-center text-destructive hover:bg-destructive/10 shrink-0 transition-colors"
                title="Remove URL"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">
            Press Enter to save · Esc to cancel{isConnected ? " · Click ✕ to remove" : ""}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function SocialProfilesPage() {
  const queryClient = useQueryClient();
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [pendingCount, setPendingCount] = useState(0);

  const { data: social, isLoading } = useQuery({
    queryKey: ["socialProfiles"],
    queryFn: getSocialProfiles,
  });

  useEffect(() => {
    if (!social) return;
    const mapped: Record<string, string> = {};
    PLATFORMS.forEach((p) => {
      mapped[p.key] = social[p.key] || "";
    });
    setUrls(mapped);
  }, [social]);

  const mutation = useMutation({
    mutationFn: updateSocialProfiles,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["socialProfiles"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Social profiles saved");
      setPendingCount(0);
    },
    onError: () => toast.error("Failed to save social profiles"),
  });

  const handleSave = (key: string, value: string) => {
    const updated = { ...urls, [key]: value };
    setUrls(updated);
    // Save immediately on per-card save
    mutation.mutate({ [key]: value || null });
    toast.promise(Promise.resolve(), {
      loading: `Saving ${PLATFORMS.find((p) => p.key === key)?.label}…`,
    });
  };

  const connectedCount = PLATFORMS.filter((p) => !!urls[p.key]).length;

  const futureFeature = (name: string) => {
    toast.info(`${name} integration is reserved for a future phase.`);
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
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Link2 className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Social Profiles</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your professional profiles and online presence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{connectedCount}</p>
            <p className="text-xs text-muted-foreground">Connected</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground/40">{PLATFORMS.length - connectedCount}</p>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </div>
        </div>
      </div>

      {/* Future Ready Banner */}
      <div className="flex flex-wrap items-center gap-2 p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15 text-sm">
        <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
        <span className="text-purple-700 dark:text-purple-300 font-medium">Future Integrations:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "GitHub MCP", desc: "GitHub MCP Integration" },
            { label: "Portfolio Import", desc: "Portfolio Import" },
            { label: "LinkedIn Import", desc: "LinkedIn Profile Import" },
          ].map((feat) => (
            <button
              key={feat.label}
              onClick={() => futureFeature(feat.desc)}
              className="px-2 py-0.5 rounded-md border border-dashed border-purple-400/30 text-xs font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-500/10 transition-colors"
            >
              {feat.label} ›
            </button>
          ))}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Profile completeness</span>
          <span>{connectedCount}/{PLATFORMS.length} platforms connected</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
            style={{ width: `${(connectedCount / PLATFORMS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Platform Cards */}
      <div className="space-y-3">
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.key}
            platform={platform}
            currentValue={urls[platform.key] || ""}
            onSave={handleSave}
          />
        ))}
      </div>

      {/* Saving indicator */}
      {mutation.isPending && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Saving changes…
        </div>
      )}
    </div>
  );
}
