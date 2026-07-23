"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/features/profile/services/profile.api";
import { ProjectItem, ProjectSortOption } from "@/features/profile/types/project.types";
import { ProjectCard } from "@/features/profile/components/projects/ProjectCard";
import { ProjectDialog } from "@/features/profile/components/projects/ProjectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Plus,
  Search,
  FolderGit2,
  Github,
  Sparkles,
  Share2,
  FileText,
  Loader2,
  Star,
  Filter,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";

const STATUS_FILTERS = ["All Statuses", "Completed", "In Progress", "Archived", "Planned"];

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<ProjectSortOption>("featured_first");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Fetch projects list
  const { data: projects = [], isLoading } = useQuery<ProjectItem[]>({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Project added successfully");
    },
    onError: () => {
      toast.error("Failed to add project");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Project deleted");
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });

  // Handlers
  const handleAddClick = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleEditClick = (item: ProjectItem) => {
    setEditingProject(item);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = async (formData: any) => {
    if (editingProject) {
      await updateMutation.mutateAsync({ id: editingProject.id, data: formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  // Filter & Sort
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((proj) => {
        const title = (proj.name || proj.title || "").toLowerCase();
        const shortDesc = (proj.short_description || "").toLowerCase();
        const desc = (proj.description || "").toLowerCase();
        const tech = (proj.tech_stack || "").toLowerCase();
        const aiTech = (proj.ai_technologies || "").toLowerCase();
        const role = (proj.role || "").toLowerCase();
        return (
          title.includes(q) ||
          shortDesc.includes(q) ||
          desc.includes(q) ||
          tech.includes(q) ||
          aiTech.includes(q) ||
          role.includes(q)
        );
      });
    }

    // Featured Only filter
    if (featuredOnly) {
      result = result.filter((p) => p.is_featured);
    }

    // Status filter
    if (selectedStatus !== "All Statuses") {
      result = result.filter((p) => p.status === selectedStatus);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "featured_first") {
        if (a.is_featured && !b.is_featured) return -1;
        if (!a.is_featured && b.is_featured) return 1;
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "newest") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      }
      if (sortBy === "oldest") {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      }
      if (sortBy === "title") {
        const titleA = a.name || a.title || "";
        const titleB = b.name || b.title || "";
        return titleA.localeCompare(titleB);
      }
      return 0;
    });

    return result;
  }, [projects, searchQuery, featuredOnly, selectedStatus, sortBy]);

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
            <FolderGit2 className="w-7 h-7 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Project Portfolio</h1>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Highlight your best work, side projects, screenshots, and live demonstrations.
          </p>
        </div>

        <Button onClick={handleAddClick} className="shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      {/* Future-Ready Action Toolbar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-muted/20 border rounded-xl">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("GitHub Repository Import")}
          className="h-9 text-xs justify-start border-dashed hover:border-gray-500/50"
        >
          <Github className="w-3.5 h-3.5 mr-2 text-foreground" /> GitHub Import
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("AI Project Analysis")}
          className="h-9 text-xs justify-start border-dashed hover:border-purple-500/50"
        >
          <Sparkles className="w-3.5 h-3.5 mr-2 text-purple-500" /> AI Review
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Portfolio Sharing Link Generator")}
          className="h-9 text-xs justify-start border-dashed hover:border-blue-500/50"
        >
          <Share2 className="w-3.5 h-3.5 mr-2 text-blue-500" /> Share Portfolio
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeatureNotice("Resume Project Importer")}
          className="h-9 text-xs justify-start border-dashed hover:border-emerald-500/50"
        >
          <FileText className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Resume Import
        </Button>
      </div>

      {/* Controls: Search, Filters & Sort */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-card p-4 rounded-xl border">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search title, tech, role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-sm h-9"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="text-xs h-9 w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((st) => (
                <SelectItem key={st} value={st}>
                  {st}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Featured Filter Toggle */}
        <Button
          variant={featuredOnly ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFeaturedOnly(!featuredOnly)}
          className={`h-9 text-xs justify-center ${featuredOnly ? "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10" : ""}`}
        >
          <Star className={`w-3.5 h-3.5 mr-1.5 ${featuredOnly ? "fill-amber-500" : ""}`} />
          {featuredOnly ? "Featured Only (Active)" : "Show Featured Only"}
        </Button>

        {/* Sort dropdown */}
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-4 h-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Select value={sortBy} onValueChange={(val: ProjectSortOption) => setSortBy(val)}>
            <SelectTrigger className="text-xs h-9 w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured_first">Featured First</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="animate-spin text-primary w-8 h-8" />
        </div>
      ) : filteredAndSortedProjects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/10 p-6">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <FolderGit2 className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No projects found</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-sm mx-auto">
            {searchQuery || featuredOnly || selectedStatus !== "All Statuses"
              ? "No projects match your active search or filter criteria."
              : "Add your personal, academic, or professional projects to showcase your building skills."}
          </p>
          <Button onClick={handleAddClick}>
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAndSortedProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={editingProject}
        onSave={handleSave}
      />
    </div>
  );
}
