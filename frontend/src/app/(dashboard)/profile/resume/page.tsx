"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResumes,
  uploadResumeFile,
  replaceResumeFile,
  activateResume,
  deleteResume,
  processResumeDocument,
  cleanResumeText,
  parseResumeAI,
  getResumeMergeSuggestions,
} from "@/features/profile/services/profile.api";
import { ResumeItem, formatFileSize } from "@/features/profile/types/resume.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  FileText,
  UploadCloud,
  Download,
  RefreshCw,
  Trash2,
  Loader2,
  Clock,
  HardDrive,
  FileType,
  CheckCircle2,
  Star,
  History,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Brain,
  Sparkles,
  ScanText,
  Layers,
  AlertCircle,
  Eye,
  Check,
  RotateCw,
  Copy,
  Cpu,
  AlertTriangle,
  Wand2,
  Bot,
  User,
  Briefcase,
  GraduationCap,
  Code,
  GitCompare,
  XCircle,
  Edit3,
  CheckCheck,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// ── Helpers ──────────────────────────────────────────────────────────────────

function FileTypeBadge({ type }: { type?: string | null }) {
  const colors: Record<string, string> = {
    PDF:  "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/25",
    DOCX: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    DOC:  "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25",
    TXT:  "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/25",
    RTF:  "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/25",
    PNG:  "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/25",
    JPEG: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/25",
    WEBP: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/25",
  };
  const label = type || "FILE";
  return (
    <Badge
      className={`font-bold text-[11px] tracking-wider px-2 py-0.5 border ${colors[label] ?? "bg-muted text-muted-foreground border-border"}`}
    >
      {label}
    </Badge>
  );
}

function VersionBadge({ version, isActive }: { version: number; isActive: boolean }) {
  return (
    <Badge
      variant={isActive ? "default" : "outline"}
      className={`text-xs font-semibold ${isActive ? "bg-emerald-500 hover:bg-emerald-500 text-white" : "text-muted-foreground"}`}
    >
      {isActive && <CheckCircle2 className="w-3 h-3 mr-1" />}
      v{version}.0 {isActive ? "• Active" : ""}
    </Badge>
  );
}

function OcrConfidenceBadge({ confidence, isLow }: { confidence?: number | null; isLow?: boolean }) {
  if (confidence == null) return null;

  if (isLow || confidence < 60) {
    return (
      <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold text-xs flex items-center gap-1">
        <AlertTriangle className="w-3 h-3 text-red-500" /> {confidence}% OCR (Low)
      </Badge>
    );
  }
  if (confidence >= 85) {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-xs flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {confidence}% OCR (High)
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold text-xs flex items-center gap-1">
      <Clock className="w-3 h-3 text-amber-500" /> {confidence}% OCR
    </Badge>
  );
}

function ProcessingStatusBadge({ status, error, hasParsed }: { status?: string; error?: string | null; hasParsed?: boolean }) {
  if (hasParsed) {
    return (
      <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 font-semibold text-xs flex items-center gap-1">
        <Bot className="w-3 h-3 text-purple-500" /> Parsed via Gemini Flash
      </Badge>
    );
  }
  const s = status || "Queued";
  if (s === "Completed") {
    return (
      <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-semibold text-xs flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Extracted & Cleaned
      </Badge>
    );
  }
  if (s === "Processing") {
    return (
      <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-semibold text-xs flex items-center gap-1">
        <Loader2 className="w-3 h-3 text-blue-500 animate-spin" /> Processing…
      </Badge>
    );
  }
  if (s === "Failed") {
    return (
      <Badge
        title={error || "Processing failed"}
        className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold text-xs flex items-center gap-1"
      >
        <AlertCircle className="w-3 h-3 text-red-500" /> Extraction Failed
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-semibold text-xs flex items-center gap-1">
      <Clock className="w-3 h-3 text-amber-500" /> Queued
    </Badge>
  );
}

function MergeStatusBadge({ status }: { status: string }) {
  if (status === "NEW") {
    return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25 font-bold text-[10px]">NEW INFO</Badge>;
  }
  if (status === "UPDATE") {
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25 font-bold text-[10px]">UPDATED</Badge>;
  }
  if (status === "CONFLICT") {
    return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25 font-bold text-[10px]">CONFLICT</Badge>;
  }
  return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/25 font-bold text-[10px]">DUPLICATE</Badge>;
}

// ── Profile Merge Engine Modal Component ──────────────────────────────────────

interface MergeEngineModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
}

function ProfileMergeEngineModal({ resume, onClose }: MergeEngineModalProps) {
  const [decisions, setDecisions] = useState<Record<string, "accept" | "reject" | "edit">>({});

  const { data, isLoading } = useQuery({
    queryKey: ["merge-suggestions", resume?.id],
    queryFn: () => (resume ? getResumeMergeSuggestions(resume.id) : null),
    enabled: !!resume,
  });

  if (!resume) return null;

  const suggestions = data?.suggestions || [];

  const handleDecision = (id: string, action: "accept" | "reject" | "edit") => {
    setDecisions((prev) => ({ ...prev, [id]: action }));
    toast.info(`Suggestion marked as ${action.toUpperCase()}`);
  };

  const handleAcceptAllNew = () => {
    const updated = { ...decisions };
    suggestions.forEach((s: any) => {
      if (s.status === "NEW") updated[s.id] = "accept";
    });
    setDecisions(updated);
    toast.success("Accepted all new suggestions!");
  };

  const handleRejectDuplicates = () => {
    const updated = { ...decisions };
    suggestions.forEach((s: any) => {
      if (s.status === "DUPLICATE") updated[s.id] = "reject";
    });
    setDecisions(updated);
    toast.info("Rejected all duplicate items");
  };

  return (
    <Dialog open={!!resume} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <GitCompare className="w-5 h-5 text-indigo-500" />
            Profile Merge Engine — {resume.file_name} (v{resume.version})
          </DialogTitle>
        </DialogHeader>

        {/* Stats Summary Header */}
        {data && (
          <div className="grid grid-cols-4 gap-3 py-3 border-b text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{data.new_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">New Items</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-base font-bold text-blue-600 dark:text-blue-400">{data.update_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Updates</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <p className="text-base font-bold text-amber-600 dark:text-amber-400">{data.conflict_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Conflicts</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/20">
              <p className="text-base font-bold text-muted-foreground">{data.duplicate_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">Duplicates</p>
            </div>
          </div>
        )}

        {/* Notice & Bulk Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 py-2 border-b text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>No database updates are made automatically until you review decisions.</span>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 border-emerald-500/30" onClick={handleAcceptAllNew}>
              <CheckCheck className="w-3.5 h-3.5 mr-1" /> Accept All New
            </Button>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={handleRejectDuplicates}>
              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject Duplicates
            </Button>
          </div>
        </div>

        {/* Suggestion Cards Container */}
        <div className="flex-1 overflow-auto p-4 bg-muted/10 rounded-lg space-y-3 mt-2 max-h-[480px]">
          {isLoading ? (
            <div className="py-16 flex justify-center items-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : suggestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-xs italic">
              No merge suggestions detected. Run AI Resume Parser first.
            </p>
          ) : (
            suggestions.map((s: any) => {
              const decision = decisions[s.id];
              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-lg border bg-card transition-all space-y-2 ${
                    decision === "accept"
                      ? "border-emerald-500/40 bg-emerald-500/5"
                      : decision === "reject"
                      ? "border-destructive/30 opacity-60 bg-muted/20"
                      : decision === "edit"
                      ? "border-indigo-500/40 bg-indigo-500/5"
                      : "border-border"
                  }`}
                >
                  {/* Card Title & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MergeStatusBadge status={s.status} />
                      <h4 className="font-bold text-xs">{s.title}</h4>
                    </div>
                    <span className="text-[11px] text-muted-foreground italic">{s.recommendation}</span>
                  </div>

                  {/* Side-by-Side Comparison */}
                  <div className="grid grid-cols-2 gap-3 p-2 rounded bg-muted/20 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Current Profile Value
                      </span>
                      {s.existing_value ? (
                        <pre className="font-sans whitespace-pre-wrap font-medium">{typeof s.existing_value === "object" ? JSON.stringify(s.existing_value, null, 1) : s.existing_value}</pre>
                      ) : (
                        <span className="text-muted-foreground italic">— None —</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Parsed Resume Value
                      </span>
                      {s.resume_value ? (
                        <pre className="font-sans whitespace-pre-wrap font-semibold text-primary">{typeof s.resume_value === "object" ? JSON.stringify(s.resume_value, null, 1) : s.resume_value}</pre>
                      ) : (
                        <span className="text-muted-foreground italic">— None —</span>
                      )}
                    </div>
                  </div>

                  {/* Individual Action Decision Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant={decision === "accept" ? "default" : "outline"}
                      className={`h-7 px-3 text-xs ${decision === "accept" ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "text-emerald-600 hover:bg-emerald-500/10"}`}
                      onClick={() => handleDecision(s.id, "accept")}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept
                    </Button>

                    <Button
                      size="sm"
                      variant={decision === "reject" ? "default" : "outline"}
                      className={`h-7 px-3 text-xs ${decision === "reject" ? "bg-destructive text-white" : "text-destructive hover:bg-destructive/10"}`}
                      onClick={() => handleDecision(s.id, "reject")}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>

                    <Button
                      size="sm"
                      variant={decision === "edit" ? "default" : "outline"}
                      className={`h-7 px-3 text-xs ${decision === "edit" ? "bg-indigo-600 text-white" : "text-indigo-600 hover:bg-indigo-500/10"}`}
                      onClick={() => handleDecision(s.id, "edit")}
                    >
                      <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Preview Modal Component ───────────────────────────────────────────────────

interface PreviewModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
}

function ResumePreviewModal({ resume, onClose }: PreviewModalProps) {
  if (!resume) return null;

  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const fileUrl = `${backendBase}${resume.file_url}`;
  const fileExt = (resume.file_type || "").toUpperCase();
  const isImage = ["PNG", "JPEG", "JPG", "WEBP"].includes(fileExt);
  const isPdf = fileExt === "PDF";

  return (
    <Dialog open={!!resume} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Eye className="w-4 h-4 text-primary" />
            Resume Document Preview — {resume.file_name} (v{resume.version})
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto min-h-[400px] flex items-center justify-center p-2 bg-muted/20 rounded-lg">
          {isImage ? (
            <img
              src={fileUrl}
              alt={resume.file_name || "Resume preview"}
              className="max-h-[600px] max-w-full object-contain rounded border shadow-sm"
            />
          ) : isPdf ? (
            <iframe
              src={fileUrl}
              className="w-full h-[600px] rounded border"
              title="PDF Resume Preview"
            />
          ) : (
            <div className="text-center space-y-3 p-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <p className="font-semibold text-sm">{resume.file_name}</p>
              <p className="text-xs text-muted-foreground">
                Direct in-browser document preview is supported for PDF, PNG, JPG, and WEBP.
              </p>
              <Button size="sm" asChild variant="outline" className="mt-2">
                <a href={`${backendBase}/api/profile/resume/${resume.id}/download`} download>
                  <Download className="w-4 h-4 mr-2" /> Download Document
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── AI Parsed Structured Data Modal Component ─────────────────────────────────

interface ParsedDataModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
}

function AIParsedDataModal({ resume, onClose }: ParsedDataModalProps) {
  const [copied, setCopied] = useState(false);
  if (!resume) return null;

  let parsed: any = {};
  if (resume.parsed_data_json) {
    try {
      parsed = JSON.parse(resume.parsed_data_json);
    } catch (e) {}
  }

  const handleCopyJSON = () => {
    if (resume.parsed_data_json) {
      navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
      setCopied(true);
      toast.success("Structured JSON copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const personal = parsed.personal_info || {};
  const work = parsed.work_experience || [];
  const edu = parsed.education || [];
  const skills = parsed.skills || [];
  const projects = parsed.projects || [];

  return (
    <Dialog open={!!resume} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Bot className="w-5 h-5 text-purple-500" />
            AI Parsed Resume Data — {resume.file_name} (v{resume.version})
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between py-2 border-b text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Gemini Flash Engine
            </Badge>
            {resume.parsed_at && (
              <span>Parsed {format(new Date(resume.parsed_at), "h:mm a, MMM d, yyyy")}</span>
            )}
          </div>

          {resume.parsed_data_json && (
            <Button size="sm" variant="ghost" onClick={handleCopyJSON} className="h-7 text-xs">
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
              {copied ? "Copied" : "Copy JSON"}
            </Button>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4 bg-muted/10 rounded-lg space-y-6 mt-2 max-h-[520px]">
          {/* Note Banner */}
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              AI Parsed output is stored in isolated structured format. Your main profile database tables are untouched until you review and confirm.
            </p>
          </div>

          {/* Personal Info */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" /> Personal Information
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded-lg border bg-card text-xs">
              <div><span className="text-muted-foreground">Name:</span> <strong className="block truncate">{personal.full_name || "—"}</strong></div>
              <div><span className="text-muted-foreground">Email:</span> <strong className="block truncate">{personal.email || "—"}</strong></div>
              <div><span className="text-muted-foreground">Phone:</span> <strong className="block truncate">{personal.phone || "—"}</strong></div>
            </div>
          </div>

          {/* Work Experience */}
          {work.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Work Experience ({work.length})
              </h3>
              <div className="space-y-2">
                {work.map((w: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border bg-card text-xs space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{w.job_title} · {w.company}</span>
                      <span className="text-muted-foreground">{w.start_date || ""} - {w.is_current ? "Present" : w.end_date || ""}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-amber-500" /> Detected Skills ({skills.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s: any, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                    {typeof s === "string" ? s : s.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Extracted & Cleaned Text Modal Component ─────────────────────────────────

interface ExtractedTextModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
  onReClean: (id: number) => void;
  isCleaning: boolean;
}

function ExtractedTextModal({ resume, onClose, onReClean, isCleaning }: ExtractedTextModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"clean" | "raw">("clean");
  if (!resume) return null;

  const currentText = activeTab === "clean" ? (resume.clean_text || resume.raw_text) : resume.raw_text;

  const handleCopy = () => {
    if (currentText) {
      navigator.clipboard.writeText(currentText);
      setCopied(true);
      toast.success(`${activeTab === "clean" ? "Cleaned" : "Raw"} text copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={!!resume} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Wand2 className="w-4 h-4 text-primary" />
            Resume Text Center — {resume.file_name} (v{resume.version})
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="clean" onValueChange={(v) => setActiveTab(v as "clean" | "raw")} className="flex-1 flex flex-col min-h-0 mt-2">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
            <TabsList>
              <TabsTrigger value="clean" className="text-xs font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" /> Cleaned Text
              </TabsTrigger>
              <TabsTrigger value="raw" className="text-xs font-semibold flex items-center gap-1.5">
                <ScanText className="w-3.5 h-3.5 text-muted-foreground" /> Raw Extracted Text
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
                disabled={isCleaning}
                onClick={() => onReClean(resume.id)}
              >
                {isCleaning ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                Re-Clean Text
              </Button>

              {currentText && (
                <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 text-xs">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copied ? "Copied" : "Copy"}
                </Button>
              )}
            </div>
          </div>

          <TabsContent value="clean" className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-xs leading-relaxed rounded-lg border whitespace-pre-wrap mt-2 max-h-[480px]">
            {resume.clean_text ? (
              resume.clean_text
            ) : (
              <p className="text-muted-foreground italic text-center py-8">
                No cleaned text stored yet. Click "Re-Clean Text" to run the Resume Cleaning Engine.
              </p>
            )}
          </TabsContent>

          <TabsContent value="raw" className="flex-1 overflow-auto p-4 bg-muted/20 font-mono text-xs leading-relaxed rounded-lg border whitespace-pre-wrap mt-2 max-h-[480px]">
            {resume.raw_text ? (
              resume.raw_text
            ) : (
              <p className="text-muted-foreground italic text-center py-8">
                No raw text recorded. Re-run document extraction.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// ── Drag & Drop Upload Zone ───────────────────────────────────────────────────

interface UploadZoneProps {
  onFile: (file: File) => void;
  isUploading: boolean;
}

function UploadZone({ onFile, isUploading }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 text-center transition-all duration-200 ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border bg-muted/10 hover:border-primary/40 hover:bg-muted/20"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />

      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shadow-inner">
        {isUploading ? (
          <Loader2 className="w-7 h-7 text-primary animate-spin" />
        ) : (
          <UploadCloud className={`w-7 h-7 ${isDragging ? "text-primary animate-bounce" : "text-primary"}`} />
        )}
      </div>

      <div>
        <p className="font-semibold text-base">
          {isUploading ? "Uploading, Parsing & Extracting Data…" : isDragging ? "Drop resume file here" : "Drag & drop your resume here"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or <span className="text-primary font-medium underline">click to browse files</span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">
          Supported Formats: PDF, DOC, DOCX, TXT, RTF, PNG, JPG, JPEG, WEBP · Max 10 MB
        </p>
      </div>
    </div>
  );
}

// ── Active Resume Card ────────────────────────────────────────────────────────

interface ResumeCardProps {
  resume: ResumeItem;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  onPreview: (resume: ResumeItem) => void;
  onViewText: (resume: ResumeItem) => void;
  onViewParsed: (resume: ResumeItem) => void;
  onViewMerge: (resume: ResumeItem) => void;
  onParseAI: (id: number) => void;
  onProcess: (id: number) => void;
  isReplacing: boolean;
  isProcessing: boolean;
  isParsingAI: boolean;
}

function ActiveResumeCard({
  resume,
  onReplace,
  onDelete,
  onPreview,
  onViewText,
  onViewParsed,
  onViewMerge,
  onParseAI,
  onProcess,
  isReplacing,
  isProcessing,
  isParsingAI,
}: ResumeCardProps) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const downloadUrl = `${backendBase}/api/profile/resume/${resume.id}/download`;

  return (
    <Card className="border-emerald-500/30 ring-1 ring-emerald-500/15 shadow-sm bg-card overflow-hidden">
      <CardHeader className="p-5 pb-4 bg-emerald-500/5 border-b border-emerald-500/10">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
            <FileText className="w-7 h-7 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base truncate max-w-xs" title={resume.file_name ?? ""}>
                {resume.file_name || "Resume"}
              </h3>
              <VersionBadge version={resume.version} isActive={resume.is_active} />
              <FileTypeBadge type={resume.file_type} />
              <ProcessingStatusBadge
                status={resume.parsing_status}
                error={resume.processing_error}
                hasParsed={!!resume.parsed_data_json}
              />
              <OcrConfidenceBadge confidence={resume.ocr_confidence} isLow={resume.is_low_confidence} />
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Uploaded {format(new Date(resume.uploaded_at), "MMM d, yyyy 'at' h:mm a")}
              </span>
              <span className="flex items-center gap-1">
                <HardDrive className="w-3.5 h-3.5" />
                {formatFileSize(resume.file_size)}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="h-8 text-xs shadow-sm" asChild>
            <a href={downloadUrl} download={resume.file_name ?? "resume"}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download
            </a>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onPreview(resume)}
          >
            <Eye className="w-3.5 h-3.5 mr-1.5 text-primary" /> Preview
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-indigo-600 dark:text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/10"
            onClick={() => onViewMerge(resume)}
          >
            <GitCompare className="w-3.5 h-3.5 mr-1.5 text-indigo-500" /> Merge Engine
          </Button>

          {resume.parsed_data_json ? (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
              onClick={() => onViewParsed(resume)}
            >
              <Bot className="w-3.5 h-3.5 mr-1.5 text-purple-500" /> View Parsed Data
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
              disabled={isParsingAI}
              onClick={() => onParseAI(resume.id)}
            >
              {isParsingAI ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Bot className="w-3.5 h-3.5 mr-1.5" />
              )}
              Parse with Gemini AI
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onViewText(resume)}
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5 text-emerald-500" /> Text Center
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            disabled={isReplacing}
            onClick={() => onReplace(resume.id)}
          >
            {isReplacing ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            )}
            Replace File
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(resume.id)}
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Version History Row ───────────────────────────────────────────────────────

interface HistoryRowProps {
  resume: ResumeItem;
  onActivate: (id: number) => void;
  onDelete: (id: number) => void;
  onPreview: (resume: ResumeItem) => void;
  onViewText: (resume: ResumeItem) => void;
  onViewParsed: (resume: ResumeItem) => void;
  onViewMerge: (resume: ResumeItem) => void;
  isActivating: boolean;
}

function VersionHistoryRow({
  resume,
  onActivate,
  onDelete,
  onPreview,
  onViewText,
  onViewParsed,
  onViewMerge,
  isActivating,
}: HistoryRowProps) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const downloadUrl = `${backendBase}/api/profile/resume/${resume.id}/download`;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 px-4 rounded-lg bg-muted/10 hover:bg-muted/20 border border-transparent hover:border-border/40 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-medium truncate" title={resume.file_name ?? ""}>
            {resume.file_name || "Resume"}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(resume.uploaded_at), "MMM d, yyyy")} · {formatFileSize(resume.file_size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap">
        <VersionBadge version={resume.version} isActive={resume.is_active} />
        <FileTypeBadge type={resume.file_type} />
        <OcrConfidenceBadge confidence={resume.ocr_confidence} isLow={resume.is_low_confidence} />

        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
          onClick={() => onActivate(resume.id)}
          disabled={isActivating}
        >
          {isActivating ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <Check className="w-3 h-3 mr-1" />}
          Make Active
        </Button>

        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-indigo-500" onClick={() => onViewMerge(resume)}>
          <GitCompare className="w-3.5 h-3.5" />
        </Button>

        {resume.parsed_data_json && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-purple-500" onClick={() => onViewParsed(resume)}>
            <Bot className="w-3.5 h-3.5" />
          </Button>
        )}

        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => onPreview(resume)}>
          <Eye className="w-3.5 h-3.5" />
        </Button>

        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => onDelete(resume.id)}>
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Main Page Component ───────────────────────────────────────────────────────

export default function ResumeCenterPage() {
  const queryClient = useQueryClient();
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);
  const [viewTextResume, setViewTextResume] = useState<ResumeItem | null>(null);
  const [viewParsedResume, setViewParsedResume] = useState<ResumeItem | null>(null);
  const [viewMergeResume, setViewMergeResume] = useState<ResumeItem | null>(null);
  const [activatingId, setActivatingId] = useState<number | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [cleaningId, setCleaningId] = useState<number | null>(null);
  const [parsingAIId, setParsingAIId] = useState<number | null>(null);

  const { data: resumes = [], isLoading } = useQuery<ResumeItem[]>({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadResumeFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume uploaded, cleaned & parsed!");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Upload failed. Please try again.";
      toast.error(msg);
    },
  });

  const replaceMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => replaceResumeFile(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume replaced!");
      setReplacingId(null);
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || "Replacement failed. Please try again.";
      toast.error(msg);
      setReplacingId(null);
    },
  });

  const activateMutation = useMutation({
    mutationFn: activateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume set to active!");
      setActivatingId(null);
    },
    onError: () => {
      toast.error("Failed to activate resume version.");
      setActivatingId(null);
    },
  });

  const processMutation = useMutation({
    mutationFn: processResumeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Document processing completed!");
      setProcessingId(null);
    },
    onError: () => {
      toast.error("Document processing failed.");
      setProcessingId(null);
    },
  });

  const cleanMutation = useMutation({
    mutationFn: cleanResumeText,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("Resume text re-cleaned!");
      setCleaningId(null);
    },
    onError: () => {
      toast.error("Resume text cleaning failed.");
      setCleaningId(null);
    },
  });

  const parseAIMutation = useMutation({
    mutationFn: parseResumeAI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      toast.success("AI Resume Parsing completed via Gemini Flash!");
      setParsingAIId(null);
    },
    onError: () => {
      toast.error("AI Resume Parsing failed.");
      setParsingAIId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume deleted");
    },
    onError: () => toast.error("Failed to delete resume."),
  });

  const handleFileUpload = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10 MB limit.");
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleReplaceClick = (id: number) => {
    setReplacingId(id);
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && replacingId != null) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10 MB limit.");
        return;
      }
      replaceMutation.mutate({ id: replacingId, file });
    }
    e.target.value = "";
  };

  const handleActivate = (id: number) => {
    setActivatingId(id);
    activateMutation.mutate(id);
  };

  const handleProcess = (id: number) => {
    setProcessingId(id);
    processMutation.mutate(id);
  };

  const handleReClean = (id: number) => {
    setCleaningId(id);
    cleanMutation.mutate(id);
  };

  const handleParseAI = (id: number) => {
    setParsingAIId(id);
    parseAIMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this resume version?")) {
      deleteMutation.mutate(id);
    }
  };

  const activeResume = resumes.find((r) => r.is_active);
  const historyResumes = resumes.filter((r) => !r.is_active);

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      {/* Hidden replace file input */}
      <input
        ref={replaceInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.rtf,.png,.jpg,.jpeg,.webp"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Resume Center & Merge Engine</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, clean, parse, and generate profile merge suggestions without modifying database records automatically.
          </p>
        </div>

        {resumes.length > 0 && (
          <Button onClick={() => replaceInputRef.current?.click()} variant="outline" className="shadow-sm">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload New Version
          </Button>
        )}
      </div>

      {/* Upload Zone */}
      {resumes.length === 0 ? (
        <div className="space-y-4">
          <UploadZone onFile={handleFileUpload} isUploading={uploadMutation.isPending} />
        </div>
      ) : (
        /* Compact upload bar when resume exists */
        <div
          onClick={() => replaceInputRef.current?.click()}
          className="flex items-center gap-3 p-3.5 rounded-xl border border-dashed border-border/60 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors"
          role="button"
          tabIndex={0}
        >
          <UploadCloud className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground flex-1">
            Upload a new file to auto-increment version number (v{resumes.length + 1}).
          </span>
          <Button
            size="sm"
            variant="outline"
            className="h-8 text-xs"
            disabled={uploadMutation.isPending}
            onClick={(e) => {
              e.stopPropagation();
              replaceInputRef.current?.click();
            }}
          >
            {uploadMutation.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
            ) : (
              <UploadCloud className="w-3.5 h-3.5 mr-1" />
            )}
            Upload
          </Button>
        </div>
      )}

      {/* Active Resume Card */}
      {activeResume && (
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Active Resume
          </h2>
          <ActiveResumeCard
            resume={activeResume}
            onReplace={handleReplaceClick}
            onDelete={handleDelete}
            onPreview={setPreviewResume}
            onViewText={setViewTextResume}
            onViewParsed={setViewParsedResume}
            onViewMerge={setViewMergeResume}
            onParseAI={handleParseAI}
            onProcess={handleProcess}
            isReplacing={replaceMutation.isPending && replacingId === activeResume.id}
            isProcessing={processMutation.isPending && processingId === activeResume.id}
            isParsingAI={parseAIMutation.isPending && parsingAIId === activeResume.id}
          />
        </div>
      )}

      {/* Version History */}
      {historyResumes.length > 0 && (
        <div className="space-y-2">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <History className="w-4 h-4" /> Version History ({historyResumes.length})
            </span>
            {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showHistory && (
            <div className="space-y-2">
              {historyResumes.map((r) => (
                <VersionHistoryRow
                  key={r.id}
                  resume={r}
                  onActivate={handleActivate}
                  onDelete={handleDelete}
                  onPreview={setPreviewResume}
                  onViewText={setViewTextResume}
                  onViewParsed={setViewParsedResume}
                  onViewMerge={setViewMergeResume}
                  isActivating={activatingId === r.id}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Resume Preview Modal */}
      <ResumePreviewModal
        resume={previewResume}
        onClose={() => setPreviewResume(null)}
      />

      {/* Extracted & Cleaned Text Modal */}
      <ExtractedTextModal
        resume={viewTextResume}
        onClose={() => setViewTextResume(null)}
        onReClean={handleReClean}
        isCleaning={cleanMutation.isPending && cleaningId === viewTextResume?.id}
      />

      {/* AI Parsed Structured Data Modal */}
      <AIParsedDataModal
        resume={viewParsedResume}
        onClose={() => setViewParsedResume(null)}
      />

      {/* Profile Merge Engine Modal */}
      <ProfileMergeEngineModal
        resume={viewMergeResume}
        onClose={() => setViewMergeResume(null)}
      />
    </div>
  );
}
