"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
} from "@/features/profile/services/profile.api";
import { EducationItem, EducationSortOption } from "@/features/profile/types/education.types";
import { EducationTimeline } from "@/features/profile/components/education/EducationTimeline";
import { EducationDialog } from "@/features/profile/components/education/EducationDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Compass, 
  Loader2, 
  GraduationCap,
  ListFilter,
  LayoutList,
  Grid
} from "lucide-react";
import { toast } from "sonner";

export default function EducationPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<EducationSortOption>("newest");
  const [viewMode, setViewMode] = useState<"timeline" | "grid">("timeline");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);

  // Fetch education list
  const { data: educations = [], isLoading } = useQuery<EducationItem[]>({
    queryKey: ["educations"],
    queryFn: getEducations,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Education entry added successfully");
    },
    onError: () => {
      toast.error("Failed to add education entry");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateEducation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Education entry updated successfully");
    },
    onError: () => {
      toast.error("Failed to update education entry");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteEducation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["educations"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Education entry removed");
    },
    onError: () => {
      toast.error("Failed to delete education entry");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingEducation(null);
    setDialogOpen(true);
  };

  const handleEditClick = (item: EducationItem) => {
    setEditingEducation(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (formData: any) => {
    if (editingEducation) {
      await updateMutation.mutateAsync({ id: editingEducation.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  // Filter & Sort
  const filteredAndSortedEducations = useMemo(() => {
    let result = [...educations];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const inst = (item.institution_name || item.institution || "").toLowerCase();
        const deg = (item.degree || "").toLowerCase();
        const maj = (item.major || "").toLowerCase();
        const spec = (item.specialization || "").toLowerCase();
        const course = (item.relevant_coursework || "").toLowerCase();
        return inst.includes(q) || deg.includes(q) || maj.includes(q) || spec.includes(q) || course.includes(q);
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "institution") {
        const nameA = a.institution_name || a.institution || "";
        const nameB = b.institution_name || b.institution || "";
        return nameA.localeCompare(nameB);
      }
      if (sortBy === "degree") {
        return (a.degree || "").localeCompare(b.degree || "");
      }
      return 0;
    });

    return result;
  }, [educations, searchQuery, sortBy]);

  // Future Ready Feature Placeholders
  const handleFeatureNotice = (featureName: string) => {
    toast.info(`${featureName} feature is ready for integration. AI features are currently set to dormant.`);
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Education Management</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your degrees, academic achievements, coursework, and certificates.
          </p>
        </div>

        <Button onClick={handleAddClick} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>

      {/* Future-Ready Feature Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/20 border rounded-xl">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Resume Education Import")}
          className="h-9 text-xs justify-start border-dashed hover:border-primary/50"
        >
          <FileText className="w-3.5 h-3.5 mr-2 text-blue-500" /> Resume Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("AI Education Analysis")}
          className="h-9 text-xs justify-start border-dashed hover:border-purple/50"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-purple-500" /> AI Analysis
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Degree Verification")}
          className="h-9 text-xs justify-start border-dashed hover:border-emerald/50"
        >
          <ShieldCheck className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Verify Degree
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Career Recommendation")}
          className="h-9 text-xs justify-start border-dashed hover:border-amber/50"
        >
          <Compass className="w-3.5 h-3.5 mr-2 text-amber-500" /> Career Paths
        </Button>
      </div>

      {/* Controls: Search, Sort & View Mode */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search institution, degree, major, coursework..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-muted-foreground hidden sm:block" />
            <Select value={sortBy} onValueChange={(val: EducationSortOption) => setSortBy(val)}>
              <SelectTrigger className="w-[150px] text-xs h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="institution">Institution (A-Z)</SelectItem>
                <SelectItem value="degree">Degree (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center border rounded-lg p-0.5 bg-muted/30">
            <Button
              variant={viewMode === "timeline" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("timeline")}
              className="h-8 px-2.5"
              title="Timeline View"
            >
              <LayoutList className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 px-2.5"
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : (
        <EducationTimeline
          educations={filteredAndSortedEducations}
          viewMode={viewMode}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onAddClick={handleAddClick}
          onAIAnalysis={(item) => handleFeatureNotice(`AI Review for ${item.degree}`)}
        />
      )}

      {/* Modal Dialog */}
      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={editingEducation}
        onSave={handleSave}
      />
    </div>
  );
}
