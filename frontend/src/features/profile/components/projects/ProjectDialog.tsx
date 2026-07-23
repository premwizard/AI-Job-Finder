"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectItem } from "../../types/project.types";
import { uploadProjectFile } from "../../services/profile.api";
import { Loader2, Upload, X, Image as ImageIcon, Star } from "lucide-react";
import { toast } from "sonner";

const PROJECT_STATUSES = ["Completed", "In Progress", "Archived", "Planned"];

const projectSchema = z.object({
  name: z.string().min(2, "Project title is required (min 2 characters)"),
  short_description: z.string().optional(),
  description: z.string().optional(),
  role: z.string().optional(),
  team_size: z.string().optional(),
  duration: z.string().optional(),
  tech_stack: z.string().optional(),
  ai_technologies: z.string().optional(),
  github_url: z.string().optional(),
  live_demo_url: z.string().optional(),
  video_demo_url: z.string().optional(),
  challenges: z.string().optional(),
  achievements: z.string().optional(),
  status: z.string().default("Completed"),
  is_featured: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: ProjectItem | null;
  onSave: (data: any) => Promise<void>;
}

export function ProjectDialog({
  open,
  onOpenChange,
  project,
  onSave,
}: ProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      short_description: "",
      description: "",
      role: "",
      team_size: "",
      duration: "",
      tech_stack: "",
      ai_technologies: "",
      github_url: "",
      live_demo_url: "",
      video_demo_url: "",
      challenges: "",
      achievements: "",
      status: "Completed",
      is_featured: false,
    },
  });

  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name || project.title || "",
        short_description: project.short_description || "",
        description: project.description || "",
        role: project.role || "",
        team_size: project.team_size ? String(project.team_size) : "",
        duration: project.duration || "",
        tech_stack: project.tech_stack || "",
        ai_technologies: project.ai_technologies || "",
        github_url: project.github_url || "",
        live_demo_url: project.live_demo_url || "",
        video_demo_url: project.video_demo_url || "",
        challenges: project.challenges || "",
        achievements: project.achievements || "",
        status: project.status || "Completed",
        is_featured: project.is_featured || false,
      });

      // Parse gallery images
      if (project.images) {
        try {
          if (project.images.startsWith("[")) {
            setUploadedImages(JSON.parse(project.images));
          } else {
            setUploadedImages(project.images.split(",").map((s) => s.trim()).filter(Boolean));
          }
        } catch {
          setUploadedImages([project.images]);
        }
      } else {
        setUploadedImages([]);
      }
    } else {
      form.reset({
        name: "",
        short_description: "",
        description: "",
        role: "",
        team_size: "",
        duration: "",
        tech_stack: "",
        ai_technologies: "",
        github_url: "",
        live_demo_url: "",
        video_demo_url: "",
        challenges: "",
        achievements: "",
        status: "Completed",
        is_featured: false,
      });
      setUploadedImages([]);
    }
  }, [project, open, form]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      const newUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const res = await uploadProjectFile(files[i]);
        if (res.url) {
          newUrls.push(res.url);
        }
      }

      setUploadedImages((prev) => [...prev, ...newUrls]);
      toast.success(`${newUrls.length} image(s) uploaded to gallery`);
    } catch {
      toast.error("Failed to upload image(s)");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = async (values: ProjectFormValues) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...values,
        images: JSON.stringify(uploadedImages),
      };
      await onSave(payload);
      onOpenChange(false);
    } catch {
      // Error handled by caller
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
          <DialogDescription>
            Showcase your project, technologies, screenshots, and live demo links.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            {/* Title & Short Description */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AI Resume Optimizer & Job Tracker" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="short_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description (Tagline)</FormLabel>
                  <FormControl>
                    <Input placeholder="A 1-line overview of what your project does..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status & Featured Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-muted/20 rounded-lg border border-border/40">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_STATUSES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_featured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0 pt-6">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-medium leading-none cursor-pointer flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      Mark as Featured Project
                    </FormLabel>
                  </FormItem>
                )}
              />
            </div>

            {/* Role, Team Size & Duration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Role</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Lead Architect" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="team_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Size</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 4 developers / Solo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 3 Months / Jan-Mar 2026" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tech Stack & AI Technologies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tech_stack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technologies Used (Comma Separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="React, Next.js, FastAPI, PostgreSQL..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ai_technologies"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Tech Used (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="OpenAI GPT-4, PyTorch, LangChain, Claude..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Links: GitHub, Live Demo, Video Demo */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="github_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GitHub Repo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="live_demo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Live Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://myproject.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="video_demo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Demo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Images Gallery Upload */}
            <div className="space-y-2 p-3 border border-dashed rounded-lg bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <FormLabel className="text-sm font-medium">Project Image Gallery</FormLabel>
                  <p className="text-xs text-muted-foreground">Upload screenshots or architecture diagrams.</p>
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="project-gallery-input"
                />
                <label htmlFor="project-gallery-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    disabled={isUploading}
                    asChild
                  >
                    <span>
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                      ) : (
                        <ImageIcon className="w-3.5 h-3.5 mr-1" />
                      )}
                      Upload Images
                    </span>
                  </Button>
                </label>
              </div>

              {/* Gallery Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                  {uploadedImages.map((imgUrl, idx) => (
                    <div key={idx} className="relative aspect-video rounded-md overflow-hidden border border-border group bg-muted">
                      <img src={imgUrl} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Detailed Description, Challenges & Achievements */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Comprehensive breakdown of features, architecture, and design decisions..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="challenges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Challenges & Solutions</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What obstacles did you encounter and solve?"
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="achievements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Achievements & Key Metrics</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Scaled to 10k users, 99.9% uptime..."
                        rows={2}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {project ? "Save Changes" : "Add Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
