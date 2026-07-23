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
  approveResumeMerge,
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
  CheckCircle2,
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
  Search,
  ArrowRight,
  Send,
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
    return <Badge className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 font-bold text-[10px]">🟩 ADDED (NEW)</Badge>;
  }
  if (status === "UPDATE") {
    return <Badge className="bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/40 font-bold text-[10px]">🟨 UPDATED</Badge>;
  }
  if (status === "CONFLICT") {
    return <Badge className="bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/40 font-bold text-[10px]">🟧 CONFLICT</Badge>;
  }
  return <Badge className="bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/25 font-bold text-[10px]">⬜ UNCHANGED</Badge>;
}

// ── Profile Merge Review & Approval Modal Component ───────────────────────────

interface MergeEngineModalProps {
  resume: ResumeItem | null;
  onClose: () => void;
}

function ProfileMergeEngineModal({ resume, onClose }: MergeEngineModalProps) {
  const queryClient = useQueryClient();
  const [decisions, setDecisions] = useState<Record<string, "accept" | "reject" | "edit">>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const { data, isLoading } = useQuery({
    queryKey: ["merge-suggestions", resume?.id],
    queryFn: () => (resume ? getResumeMergeSuggestions(resume.id) : null),
    enabled: !!resume,
  });

  const approveMutation = useMutation({
    mutationFn: ({ resumeId, items }: { resumeId: number; items: any[] }) => approveResumeMerge(resumeId, items),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["experiences"] });
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(res.message || "Career Profile updated successfully!");
      onClose();
    },
    onError: (err: any) => {
      const detail = err.response?.data?.detail || "Approval failed. Atomic rollback executed.";
      toast.error(detail);
    },
  });

  if (!resume) return null;

  const suggestions = data?.suggestions || [];

  const filteredSuggestions = suggestions.filter((s: any) => {
    const matchesStatus = statusFilter === "ALL" || s.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDecision = (id: string, action: "accept" | "reject" | "edit") => {
    setDecisions((prev) => ({ ...prev, [id]: action }));
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

  const handleFinalApproval = () => {
    const approvedItems: any[] = [];
    suggestions.forEach((s: any) => {
      const decision = decisions[s.id] || (s.status === "NEW" ? "accept" : "reject");
      if (decision === "accept" || decision === "edit") {
        approvedItems.push({
          category: s.category,
          action: decision,
          value: typeof s.resume_value === "object" ? s.resume_value : { name: s.resume_value, title: s.title },
        });
      }
    });

    if (approvedItems.length === 0) {
      toast.error("No items selected for merging.");
      return;
    }

    approveMutation.mutate({ resumeId: resume.id, items: approvedItems });
  };

  const acceptedCount = Object.values(decisions).filter((v) => v === "accept").length;

  return (
    <Dialog open={!!resume} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-6">
        <DialogHeader className="pb-3 border-b flex items-center justify-between">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <GitCompare className="w-5 h-5 text-indigo-500" />
            Resume Review & Profile Merge Approval — {resume.file_name} (v{resume.version})
          </DialogTitle>
        </DialogHeader>

        {/* Summary Statistics Header */}
        {data && (
          <div className="grid grid-cols-4 gap-3 py-3 border-b text-center text-xs">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25">
              <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{data.new_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">🟩 New Items</p>
            </div>
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/25">
              <p className="text-base font-bold text-amber-600 dark:text-amber-400">{data.update_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">🟨 Updates</p>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/25">
              <p className="text-base font-bold text-rose-600 dark:text-rose-400">{data.conflict_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">🟧 Conflicts</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-500/10 border border-gray-500/25">
              <p className="text-base font-bold text-muted-foreground">{data.duplicate_count}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">⬜ Duplicates</p>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2 border-b text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search suggestions…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-md border bg-background text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            {["ALL", "NEW", "UPDATE", "CONFLICT", "DUPLICATE"].map((st) => (
              <Button
                key={st}
                size="sm"
                variant={statusFilter === st ? "default" : "outline"}
                className="h-7 text-[11px] px-2.5"
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </Button>
            ))}
          </div>
        </div>

        {/* Suggestion Cards Container with Diff Highlighting */}
        <div className="flex-1 overflow-auto p-4 bg-muted/10 rounded-lg space-y-3 mt-2 max-h-[440px]">
          {isLoading ? (
            <div className="py-16 flex justify-center items-center">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-xs italic">
              No matching suggestions found.
            </p>
          ) : (
            filteredSuggestions.map((s: any) => {
              const decision = decisions[s.id] || (s.status === "NEW" ? "accept" : "reject");
              const isAccepted = decision === "accept";
              const isRejected = decision === "reject";

              return (
                <div
                  key={s.id}
                  className={`p-3.5 rounded-lg border transition-all space-y-2 ${
                    s.status === "NEW"
                      ? "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-950/10"
                      : s.status === "UPDATE"
                      ? "border-amber-500/40 bg-amber-500/5 dark:bg-amber-950/10"
                      : s.status === "CONFLICT"
                      ? "border-rose-500/40 bg-rose-500/5 dark:bg-rose-950/10"
                      : "border-border bg-card/60 opacity-85"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MergeStatusBadge status={s.status} />
                      <h4 className="font-bold text-xs">{s.title}</h4>
                    </div>
                    <span className="text-[11px] text-muted-foreground italic">{s.recommendation}</span>
                  </div>

                  {/* Side-by-Side Diff Comparison */}
                  <div className="grid grid-cols-2 gap-3 p-2.5 rounded-md bg-background/80 border text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5">
                        Existing Profile Value
                      </span>
                      {s.existing_value ? (
                        <pre className="font-sans whitespace-pre-wrap font-medium">{typeof s.existing_value === "object" ? JSON.stringify(s.existing_value, null, 1) : s.existing_value}</pre>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">— None —</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-0.5 flex items-center gap-1">
                        <ArrowRight className="w-3 h-3 text-primary" /> Parsed Resume Value
                      </span>
                      {s.resume_value ? (
                        <pre className="font-sans whitespace-pre-wrap font-bold text-emerald-600 dark:text-emerald-400">{typeof s.resume_value === "object" ? JSON.stringify(s.resume_value, null, 1) : s.resume_value}</pre>
                      ) : (
                        <span className="text-muted-foreground italic text-[11px]">— None —</span>
                      )}
                    </div>
                  </div>

                  {/* Individual Action Decision Buttons */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <Button
                      size="sm"
                      variant={isAccepted ? "default" : "outline"}
                      className={`h-7 px-3 text-xs ${isAccepted ? "bg-emerald-600 hover:bg-emerald-600 text-white shadow-sm" : "text-emerald-600 hover:bg-emerald-500/10"}`}
                      onClick={() => handleDecision(s.id, "accept")}
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Accept
                    </Button>

                    <Button
                      size="sm"
                      variant={isRejected ? "default" : "outline"}
                      className={`h-7 px-3 text-xs ${isRejected ? "bg-destructive text-white shadow-sm" : "text-destructive hover:bg-destructive/10"}`}
                      onClick={() => handleDecision(s.id, "reject")}
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer & Final Approval Action */}
        <div className="flex items-center justify-between pt-3 border-t mt-2">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>

          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
            disabled={approveMutation.isPending}
            onClick={handleFinalApproval}
          >
            {approveMutation.isPending ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Send className="w-4 h-4 mr-1.5" />
            )}
            Apply Approved Changes to Career Profile ({acceptedCount} Selected)
          </Button>
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

  const { data: resumes = [], isLoading } = useQuery<ResumeItem[]>({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

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
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Resume Review & Approval Engine</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review parsed resume diffs, accept/reject additions, and transactionally merge into your Career Profile with zero data loss.
          </p>
        </div>
      </div>

      {/* Active Resume Card */}
      {activeResume && (
        <Card className="border-emerald-500/30 ring-1 ring-emerald-500/15 shadow-sm bg-card overflow-hidden">
          <CardHeader className="p-5 pb-4 bg-emerald-500/5 border-b border-emerald-500/10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base truncate max-w-xs">{activeResume.file_name || "Resume"}</h3>
                  <VersionBadge version={activeResume.version} isActive={activeResume.is_active} />
                  <FileTypeBadge type={activeResume.file_type} />
                  <ProcessingStatusBadge status={activeResume.parsing_status} error={activeResume.processing_error} hasParsed={!!activeResume.parsed_data_json} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="default" size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700" onClick={() => setViewMergeResume(activeResume)}>
                <GitCompare className="w-3.5 h-3.5 mr-1.5" /> Review & Approve Profile Merge
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setPreviewResume(activeResume)}>
                <Eye className="w-3.5 h-3.5 mr-1.5" /> Preview File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Merge Engine Modal */}
      <ProfileMergeEngineModal
        resume={viewMergeResume}
        onClose={() => setViewMergeResume(null)}
      />
    </div>
  );
}
