"use client";

import { useState } from "react";
import { ProjectItem } from "../../types/project.types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FolderGit2, 
  ExternalLink, 
  Code, 
  Video, 
  Star, 
  Users, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Trash2, 
  Sparkles,
  Zap,
  Target,
  Trophy
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectItem;
  onEdit: (item: ProjectItem) => void;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Parse images JSON/csv array
  const parseImages = (): string[] => {
    if (!project.images) return [];
    try {
      if (project.images.startsWith("[")) {
        return JSON.parse(project.images);
      }
      return project.images.split(",").map((s) => s.trim()).filter(Boolean);
    } catch {
      return [project.images];
    }
  };

  const galleryImages = parseImages();

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  const techStackList = project.tech_stack
    ? project.tech_stack.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const aiTechList = project.ai_technologies
    ? project.ai_technologies.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const title = project.name || project.title || "Untitled Project";

  return (
    <Card className={`overflow-hidden border transition-all shadow-sm hover:shadow-md bg-card flex flex-col justify-between ${
      project.is_featured ? "border-amber-500/40 ring-1 ring-amber-500/20" : "border-border/60"
    }`}>
      {/* Gallery Image Carousel */}
      {galleryImages.length > 0 ? (
        <div className="relative w-full h-48 sm:h-56 bg-black/90 overflow-hidden group">
          <img
            src={galleryImages[currentImageIndex]}
            alt={`${title} screenshot ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />

          {/* Carousel Overlay Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
            {project.is_featured && (
              <Badge className="bg-amber-500 text-black font-semibold text-xs shadow-md flex items-center gap-1">
                <Star className="w-3 h-3 fill-black" /> Featured
              </Badge>
            )}
            {project.status && (
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-foreground text-xs">
                {project.status}
              </Badge>
            )}
          </div>

          {/* Carousel Controls */}
          {galleryImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                title="Previous Image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                title="Next Image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Indicator Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        /* Default Header if No Gallery Images */
        <div className="p-5 pb-0 flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {project.is_featured && (
              <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs font-semibold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-500" /> Featured
              </Badge>
            )}
            {project.status && (
              <Badge variant="outline" className="text-xs">
                {project.status}
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <CardContent className="p-5 md:p-6 space-y-3.5 flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground leading-tight" title={title}>
              {title}
            </h3>
            {project.role && (
              <p className="text-xs font-semibold text-primary mt-1">
                Role: {project.role}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(project)}
              className="h-8 px-2.5 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(project.id)}
              className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Short Description */}
        {(project.short_description || project.description) && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {project.short_description || project.description}
          </p>
        )}

        {/* Meta Info: Team Size & Duration */}
        {(project.team_size || project.duration) && (
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
            {project.team_size && (
              <div className="flex items-center gap-1.5 font-medium">
                <Users className="w-3.5 h-3.5 text-primary/70" />
                <span>Team: {project.team_size}</span>
              </div>
            )}
            {project.duration && (
              <div className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-primary/70" />
                <span>Duration: {project.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Tech Stack & AI Tech Stack Tags */}
        {(techStackList.length > 0 || aiTechList.length > 0) && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {techStackList.map((tech, i) => (
              <Badge key={i} variant="secondary" className="font-normal text-xs bg-muted/60">
                {tech}
              </Badge>
            ))}
            {aiTechList.map((aiTech, i) => (
              <Badge
                key={`ai-${i}`}
                className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 font-medium text-xs flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> {aiTech}
              </Badge>
            ))}
          </div>
        )}

        {/* Expandable Section for Challenges, Achievements & Full Description */}
        {(project.description || project.challenges || project.achievements) && (
          <div className="pt-2 border-t border-border/40">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus:outline-none"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Hide deep details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> Read description, challenges & achievements
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-3 space-y-3 text-xs text-foreground/90 bg-muted/20 p-4 rounded-lg border border-border/40">
                {project.description && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <FolderGit2 className="w-3.5 h-3.5 text-primary" /> Detailed Overview
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{project.description}</p>
                  </div>
                )}

                {project.challenges && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> Key Challenges Solved
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{project.challenges}</p>
                  </div>
                )}

                {project.achievements && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Trophy className="w-3.5 h-3.5 text-emerald-500" /> Key Achievements & Metrics
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{project.achievements}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Footer Demo Links */}
      {(project.github_url || project.live_demo_url || project.video_demo_url) && (
        <CardFooter className="p-4 bg-muted/20 border-t border-border/40 flex flex-wrap gap-2">
          {project.github_url && (
            <Button variant="outline" size="sm" className="h-8 text-xs flex-1" asChild>
              <a href={project.github_url} target="_blank" rel="noreferrer">
                <Code className="w-3.5 h-3.5 mr-1.5" /> Code Repo
              </a>
            </Button>
          )}

          {project.live_demo_url && (
            <Button variant="default" size="sm" className="h-8 text-xs flex-1 shadow-sm" asChild>
              <a href={project.live_demo_url} target="_blank" rel="noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live Demo
              </a>
            </Button>
          )}

          {project.video_demo_url && (
            <Button variant="secondary" size="sm" className="h-8 text-xs flex-1" asChild>
              <a href={project.video_demo_url} target="_blank" rel="noreferrer">
                <Video className="w-3.5 h-3.5 mr-1.5" /> Watch Video
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
