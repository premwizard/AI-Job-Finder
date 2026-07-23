"use client";

import { EducationItem } from "../../types/education.types";
import { EducationCard } from "./EducationCard";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus } from "lucide-react";

interface EducationTimelineProps {
  educations: EducationItem[];
  viewMode?: "timeline" | "grid";
  onEdit: (item: EducationItem) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onAIAnalysis?: (item: EducationItem) => void;
}

export function EducationTimeline({
  educations,
  viewMode = "timeline",
  onEdit,
  onDelete,
  onAddClick,
  onAIAnalysis,
}: EducationTimelineProps) {
  if (!educations || educations.length === 0) {
    return (
      <div className="text-center py-16 border-2 border-dashed rounded-xl bg-muted/10 p-6">
        <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 shadow-sm">
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h3 className="font-semibold text-lg">No education history found</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-6 max-w-sm mx-auto">
          Add your degrees, certifications, and academic achievements to complete your professional profile.
        </p>
        <Button onClick={onAddClick}>
          <Plus className="w-4 h-4 mr-2" /> Add Education
        </Button>
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {educations.map((item) => (
          <EducationCard
            key={item.id}
            education={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onAIAnalysis={onAIAnalysis}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative border-l-2 border-primary/20 ml-4 md:ml-6 pl-6 md:pl-8 space-y-8 py-2">
      {educations.map((item) => (
        <div key={item.id} className="relative">
          {/* Vertical Timeline Node Marker */}
          <div className="absolute -left-[31px] md:-left-[39px] top-5 w-4 h-4 rounded-full bg-primary border-4 border-background ring-2 ring-primary/20 shadow-sm" />
          
          <EducationCard
            education={item}
            onEdit={onEdit}
            onDelete={onDelete}
            onAIAnalysis={onAIAnalysis}
          />
        </div>
      ))}
    </div>
  );
}
