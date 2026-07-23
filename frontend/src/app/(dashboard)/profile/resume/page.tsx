"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResumes,
  uploadResumeFile,
  replaceResumeFile,
  deleteResume,
} from "@/features/profile/services/profile.api";
import { ResumeItem, formatFileSize } from "@/features/profile/types/resume.types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
        accept=".pdf,.doc,.docx,.txt,.rtf"
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
          {isUploading ? "Uploading…" : isDragging ? "Drop to upload" : "Drag & drop your resume here"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          or <span className="text-primary font-medium underline">click to browse</span>
        </p>
        <p className="text-xs text-muted-foreground/70 mt-2">Supported: PDF, DOCX, DOC, TXT, RTF · Max 10 MB</p>
      </div>
    </div>
  );
}

// ── Reserved AI Card ──────────────────────────────────────────────────────────

interface AICardProps {
  icon: React.ReactNode;
  label: string;
  description: string;
}

function AIReservedCard({ icon, label, description }: AICardProps) {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed border-border/60 bg-muted/10 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 pointer-events-none" />
      <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center opacity-50">
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground/60">{label}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">{description}</p>
      </div>
      <Badge variant="outline" className="text-[10px] font-semibold text-muted-foreground/70 border-dashed mt-1">
        Coming Soon
      </Badge>
    </div>
  );
}

// ── Active Resume Card ────────────────────────────────────────────────────────

interface ResumeCardProps {
  resume: ResumeItem;
  onReplace: (id: number) => void;
  onDelete: (id: number) => void;
  isReplacing: boolean;
}

function ActiveResumeCard({ resume, onReplace, onDelete, isReplacing }: ResumeCardProps) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const downloadUrl = `${backendBase}${resume.file_url}`;

  return (
    <Card className="border-emerald-500/30 ring-1 ring-emerald-500/15 shadow-sm bg-card overflow-hidden">
      <CardHeader className="p-5 pb-4 bg-emerald-500/5 border-b border-emerald-500/10">
        <div className="flex items-start gap-4">
          {/* File Icon */}
          <div className="w-14 h-14 shrink-0 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-inner">
            <FileText className="w-7 h-7 text-primary" />
          </div>

          {/* File Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-base truncate max-w-xs" title={resume.file_name ?? ""}>
                {resume.file_name || "Resume"}
              </h3>
              <VersionBadge version={resume.version} isActive={resume.is_active} />
              <FileTypeBadge type={resume.file_type} />
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
              <span className="flex items-center gap-1">
                <FileType className="w-3.5 h-3.5" />
                {resume.file_type || "Unknown type"}
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Status: {resume.parsing_status}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 space-y-5">
        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-2">
          <Button variant="default" size="sm" className="h-8 text-xs shadow-sm" asChild>
            <a href={downloadUrl} target="_blank" rel="noreferrer" download={resume.file_name ?? "resume"}>
              <Download className="w-3.5 h-3.5 mr-1.5" /> Download
            </a>
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

        {/* Reserved AI Intelligence Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Resume Intelligence
            </h4>
            <Badge variant="secondary" className="text-[10px] font-semibold">
              <Sparkles className="w-3 h-3 mr-1" /> AI — Coming Soon
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <AIReservedCard
              icon={<ShieldCheck className="w-5 h-5 text-blue-400" />}
              label="ATS Score"
              description="Match rate against job descriptions"
            />
            <AIReservedCard
              icon={<Star className="w-5 h-5 text-amber-400" />}
              label="Resume Score"
              description="Overall quality rating out of 100"
            />
            <AIReservedCard
              icon={<ScanText className="w-5 h-5 text-purple-400" />}
              label="Parsing Status"
              description="Resume content extraction status"
            />
            <AIReservedCard
              icon={<Brain className="w-5 h-5 text-pink-400" />}
              label="AI Summary"
              description="AI-generated professional summary"
            />
            <AIReservedCard
              icon={<Layers className="w-5 h-5 text-teal-400" />}
              label="Skill Extraction"
              description="Auto-detected skills from resume"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Version History Row ───────────────────────────────────────────────────────

interface HistoryRowProps {
  resume: ResumeItem;
  onDelete: (id: number) => void;
}

function VersionHistoryRow({ resume, onDelete }: HistoryRowProps) {
  const backendBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const downloadUrl = `${backendBase}${resume.file_url}`;

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-lg bg-muted/10 hover:bg-muted/20 border border-transparent hover:border-border/40 transition-colors">
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

      <div className="flex items-center gap-2 shrink-0">
        <VersionBadge version={resume.version} isActive={resume.is_active} />
        <FileTypeBadge type={resume.file_type} />

        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" asChild>
          <a href={downloadUrl} target="_blank" rel="noreferrer" download={resume.file_name ?? "resume"}>
            <Download className="w-3.5 h-3.5" />
          </a>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => onDelete(resume.id)}
        >
          <Trash2 className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function ResumeCenterPage() {
  const queryClient = useQueryClient();
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const { data: resumes = [], isLoading } = useQuery<ResumeItem[]>({
    queryKey: ["resumes"],
    queryFn: getResumes,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadResumeFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume uploaded successfully");
    },
    onError: () => toast.error("Upload failed. Please try again."),
  });

  const replaceMutation = useMutation({
    mutationFn: ({ id, file }: { id: number; file: File }) => replaceResumeFile(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Resume replaced successfully");
      setReplacingId(null);
    },
    onError: () => {
      toast.error("Replacement failed. Please try again.");
      setReplacingId(null);
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
      toast.error("File too large. Maximum size is 10 MB.");
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
        toast.error("File too large. Maximum size is 10 MB.");
        return;
      }
      replaceMutation.mutate({ id: replacingId, file });
    }
    e.target.value = "";
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
        accept=".pdf,.doc,.docx,.txt,.rtf"
        className="hidden"
        onChange={handleReplaceFile}
      />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Resume Center</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload, manage, and track your resume versions. AI intelligence coming soon.
          </p>
        </div>

        {resumes.length > 0 && (
          <Button onClick={() => replaceInputRef.current?.click()} variant="outline" className="shadow-sm">
            <UploadCloud className="w-4 h-4 mr-2" /> Upload New Version
          </Button>
        )}
      </div>

      {/* Upload Zone (shown when no resumes OR always) */}
      {resumes.length === 0 ? (
        <div className="space-y-4">
          <UploadZone onFile={handleFileUpload} isUploading={uploadMutation.isPending} />

          <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 text-sm text-blue-700 dark:text-blue-300">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>
              Upload your resume to enable AI-powered ATS scoring, skill extraction, and smart job matching. <span className="font-medium">(AI features coming in next phase.)</span>
            </p>
          </div>
        </div>
      ) : (
        /* Compact upload bar when resume exists */
        <div
          onClick={() => handleFileUpload}
          className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-border/60 bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors"
          role="button"
          tabIndex={0}
        >
          <UploadCloud className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="text-sm text-muted-foreground flex-1">
            Upload a new version to replace the current active resume.
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
            isReplacing={replaceMutation.isPending && replacingId === activeResume.id}
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
                <VersionHistoryRow key={r.id} resume={r} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats Summary Bar */}
      {resumes.length > 0 && (
        <div className="grid grid-cols-3 gap-4 p-4 rounded-xl border bg-muted/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{resumes.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Versions</p>
          </div>
          <div className="text-center border-x">
            <p className="text-2xl font-bold text-foreground">
              {activeResume?.file_type || "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Current Format</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {activeResume ? format(new Date(activeResume.uploaded_at), "MMM d") : "—"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Last Updated</p>
          </div>
        </div>
      )}
    </div>
  );
}
