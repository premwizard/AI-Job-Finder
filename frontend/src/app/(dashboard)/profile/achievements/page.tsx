"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  uploadAchievementFile,
} from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Trophy,
  GraduationCap,
  BookOpen,
  Code2,
  Zap,
  Medal,
  Lightbulb,
  Mic2,
  Plus,
  Pencil,
  Trash2,
  ExternalLink,
  FileText,
  UploadCloud,
  Loader2,
  Calendar,
  Building2,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

// ── Constants ─────────────────────────────────────────────────────────────────

const ACHIEVEMENT_TYPES = [
  "Award",
  "Scholarship",
  "Publication",
  "Open Source Contribution",
  "Hackathon",
  "Competition",
  "Patent",
  "Speaking Engagement",
] as const;

type AchievementType = (typeof ACHIEVEMENT_TYPES)[number];

interface Achievement {
  id: string;
  type: AchievementType;
  title: string;
  organization?: string | null;
  date?: string | null;
  description?: string | null;
  url?: string | null;
  file_url?: string | null;
  file_name?: string | null;
  order: number;
  created_at: string;
  updated_at?: string | null;
}

// ── Type meta — icon, color, label ───────────────────────────────────────────

interface TypeMeta {
  icon: React.ReactNode;
  color: string;          // Tailwind text color
  bg: string;             // Tailwind bg color
  border: string;         // Tailwind border color
  label: string;
}

const TYPE_META: Record<AchievementType, TypeMeta> = {
  Award: {
    icon: <Trophy className="w-4 h-4" />,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/25",
    label: "Award",
  },
  Scholarship: {
    icon: <GraduationCap className="w-4 h-4" />,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/25",
    label: "Scholarship",
  },
  Publication: {
    icon: <BookOpen className="w-4 h-4" />,
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/25",
    label: "Publication",
  },
  "Open Source Contribution": {
    icon: <Code2 className="w-4 h-4" />,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/25",
    label: "Open Source",
  },
  Hackathon: {
    icon: <Zap className="w-4 h-4" />,
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/25",
    label: "Hackathon",
  },
  Competition: {
    icon: <Medal className="w-4 h-4" />,
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/25",
    label: "Competition",
  },
  Patent: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: "text-teal-600 dark:text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/25",
    label: "Patent",
  },
  "Speaking Engagement": {
    icon: <Mic2 className="w-4 h-4" />,
    color: "text-indigo-600 dark:text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/25",
    label: "Speaking",
  },
};

// ── Form dialog ───────────────────────────────────────────────────────────────

interface AchievementFormData {
  type: AchievementType;
  title: string;
  organization: string;
  date: string;
  description: string;
  url: string;
}

interface AchievementDialogProps {
  open: boolean;
  onClose: () => void;
  defaultValues?: Partial<AchievementFormData>;
  onSubmit: (data: AchievementFormData) => void;
  isPending: boolean;
  mode: "create" | "edit";
}

function AchievementDialog({
  open,
  onClose,
  defaultValues,
  onSubmit,
  isPending,
  mode,
}: AchievementDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<AchievementFormData>({
    defaultValues: defaultValues ?? { type: "Award" },
  });

  const selectedType = watch("type") as AchievementType;

  // Sync when dialog opens with new defaultValues
  useState(() => {
    if (open && defaultValues) reset(defaultValues);
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "create" ? (
              <><Plus className="w-5 h-5 text-primary" /> Add Achievement</>
            ) : (
              <><Pencil className="w-5 h-5 text-primary" /> Edit Achievement</>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Type <span className="text-destructive">*</span></label>
            <Select
              value={selectedType}
              onValueChange={(v) => setValue("type", v as AchievementType)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select type…" />
              </SelectTrigger>
              <SelectContent>
                {ACHIEVEMENT_TYPES.map((t) => {
                  const meta = TYPE_META[t];
                  return (
                    <SelectItem key={t} value={t}>
                      <span className="flex items-center gap-2">
                        <span className={meta.color}>{meta.icon}</span>
                        {t}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Title <span className="text-destructive">*</span></label>
            <Input
              {...register("title", { required: "Title is required" })}
              placeholder="e.g. Best Paper Award, Google Summer of Code"
              className="h-9"
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          {/* Organization + Date (2-col) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Organization / Event</label>
              <Input
                {...register("organization")}
                placeholder="e.g. NeurIPS, IEEE, Meta"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Date</label>
              <Input
                type="date"
                {...register("date")}
                className="h-9"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Description</label>
            <Textarea
              {...register("description")}
              placeholder="Describe the achievement, its significance, and your contribution…"
              className="min-h-[90px] resize-none text-sm"
            />
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold">Reference URL</label>
            <Input
              {...register("url")}
              type="url"
              placeholder="https://doi.org/… or https://github.com/…"
              className="h-9"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="min-w-28">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {mode === "create" ? "Add Achievement" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ── Achievement Card ──────────────────────────────────────────────────────────

interface AchievementCardProps {
  achievement: Achievement;
  onEdit: (a: Achievement) => void;
  onDelete: (id: string) => void;
  onUpload: (id: string) => void;
  isDeleting: boolean;
}

function AchievementCard({ achievement, onEdit, onDelete, onUpload, isDeleting }: AchievementCardProps) {
  const meta = TYPE_META[achievement.type as AchievementType] ?? TYPE_META.Award;
  const backendBase = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : "";

  return (
    <div className={`relative flex gap-0 group`}>
      {/* Timeline dot + line */}
      <div className="flex flex-col items-center mr-4 pt-1">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.bg} ${meta.color} border ${meta.border} shadow-sm`}>
          {meta.icon}
        </div>
        <div className="flex-1 w-px bg-border/40 mt-2 mb-0 group-last:hidden" />
      </div>

      {/* Card body */}
      <div className={`mb-6 flex-1 rounded-xl border ${meta.border} bg-card shadow-sm overflow-hidden hover:shadow-md transition-shadow`}>
        {/* Header stripe */}
        <div className={`px-5 py-3.5 ${meta.bg} border-b ${meta.border} flex items-start justify-between gap-3`}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <Badge
                variant="outline"
                className={`text-[11px] font-semibold ${meta.color} ${meta.bg} ${meta.border} border`}
              >
                {meta.label}
              </Badge>
              {achievement.date && (
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {format(parseISO(achievement.date), "MMM yyyy")}
                </span>
              )}
            </div>
            <h3 className="font-bold text-sm leading-snug">{achievement.title}</h3>
            {achievement.organization && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Building2 className="w-3 h-3 shrink-0" />
                {achievement.organization}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(achievement)}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(achievement.id)}
              disabled={isDeleting}
              className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Delete"
            >
              {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-3.5 space-y-3">
          {achievement.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{achievement.description}</p>
          )}

          {/* Links & files row */}
          <div className="flex flex-wrap items-center gap-2">
            {achievement.url && (
              <a
                href={achievement.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5" /> View Reference
              </a>
            )}

            {achievement.file_url ? (
              <a
                href={`${backendBase}${achievement.file_url}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <FileText className="w-3.5 h-3.5" />
                {achievement.file_name || "Supporting File"}
                <CheckCircle2 className="w-3 h-3" />
              </a>
            ) : (
              <button
                onClick={() => onUpload(achievement.id)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5" /> Attach File
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AchievementsPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadTargetId, setUploadTargetId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Achievement | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: achievements = [], isLoading } = useQuery<Achievement[]>({
    queryKey: ["achievements"],
    queryFn: () => getAchievements(),
  });

  const createMutation = useMutation({
    mutationFn: createAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement added!");
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to add achievement."),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAchievement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement updated!");
      setEditTarget(null);
      setDialogOpen(false);
    },
    onError: () => toast.error("Failed to update achievement."),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAchievement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("Achievement deleted");
      setDeletingId(null);
    },
    onError: () => {
      toast.error("Failed to delete achievement.");
      setDeletingId(null);
    },
  });

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => uploadAchievementFile(id, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      toast.success("File attached successfully!");
      setUploadTargetId(null);
    },
    onError: () => toast.error("Failed to upload file."),
  });

  const handleFormSubmit = (data: any) => {
    const payload = {
      ...data,
      date: data.date ? new Date(data.date).toISOString() : null,
      organization: data.organization || null,
      description: data.description || null,
      url: data.url || null,
    };
    if (editTarget) {
      updateMutation.mutate({ id: editTarget.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (a: Achievement) => {
    setEditTarget(a);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this achievement? This cannot be undone.")) return;
    setDeletingId(id);
    deleteMutation.mutate(id);
  };

  const handleUploadClick = (id: string) => {
    setUploadTargetId(id);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadTargetId) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File too large. Max 10 MB.");
        return;
      }
      uploadMutation.mutate({ id: uploadTargetId, file });
    }
    e.target.value = "";
  };

  const openCreate = () => {
    setEditTarget(null);
    setDialogOpen(true);
  };

  // Type filter counts
  const typeCounts = ACHIEVEMENT_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = achievements.filter((a) => a.type === t).length;
    return acc;
  }, {});

  const filtered =
    activeFilter === "All"
      ? achievements
      : achievements.filter((a) => a.type === activeFilter);

  const defaultFormValues = editTarget
    ? {
        type: editTarget.type as AchievementType,
        title: editTarget.title,
        organization: editTarget.organization ?? "",
        date: editTarget.date ? editTarget.date.split("T")[0] : "",
        description: editTarget.description ?? "",
        url: editTarget.url ?? "",
      }
    : { type: "Award" as AchievementType, title: "", organization: "", date: "", description: "", url: "" };

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Achievements</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Awards, publications, patents, hackathons, and more.
          </p>
        </div>
        <Button onClick={openCreate} className="shadow-sm shrink-0">
          <Plus className="w-4 h-4 mr-2" /> Add Achievement
        </Button>
      </div>

      {/* Stats row */}
      {achievements.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          <div className="col-span-4 sm:col-span-1 p-3 rounded-xl border bg-primary/5 border-primary/15 text-center">
            <p className="text-3xl font-bold text-primary">{achievements.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Total</p>
          </div>
          {Object.entries(typeCounts)
            .filter(([, count]) => count > 0)
            .slice(0, 3)
            .map(([type, count]) => {
              const meta = TYPE_META[type as AchievementType];
              return (
                <div key={type} className={`p-3 rounded-xl border ${meta.border} ${meta.bg} text-center`}>
                  <p className={`text-2xl font-bold ${meta.color}`}>{count}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{meta.label}</p>
                </div>
              );
            })}
        </div>
      )}

      {/* Type filter pills */}
      {achievements.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          {["All", ...ACHIEVEMENT_TYPES].map((t) => {
            const count = t === "All" ? achievements.length : (typeCounts[t] ?? 0);
            const meta = t !== "All" ? TYPE_META[t as AchievementType] : null;
            if (t !== "All" && count === 0) return null;
            return (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  activeFilter === t
                    ? meta
                      ? `${meta.bg} ${meta.color} ${meta.border}`
                      : "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:border-border/80"
                }`}
              >
                {t === "All" ? "All" : TYPE_META[t as AchievementType].label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {achievements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary/60" />
          </div>
          <div>
            <h3 className="font-bold text-lg">No achievements yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              Start adding your awards, publications, hackathons, and other recognitions.
            </p>
          </div>
          <Button onClick={openCreate} variant="outline" className="mt-2">
            <Plus className="w-4 h-4 mr-2" /> Add Your First Achievement
          </Button>
        </div>
      )}

      {/* Timeline */}
      {filtered.length > 0 && (
        <div className="space-y-0 pt-2">
          {filtered.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onUpload={handleUploadClick}
              isDeleting={deletingId === achievement.id && deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {/* Empty filter state */}
      {achievements.length > 0 && filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No achievements of type <strong>{activeFilter}</strong> yet.
        </div>
      )}

      {/* Form Dialog */}
      <AchievementDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditTarget(null); }}
        defaultValues={defaultFormValues}
        onSubmit={handleFormSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        mode={editTarget ? "edit" : "create"}
      />
    </div>
  );
}
