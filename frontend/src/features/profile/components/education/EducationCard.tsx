"use client";

import { useState } from "react";
import { EducationItem } from "../../types/education.types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Calendar, 
  Award, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  Trophy
} from "lucide-react";
import { format } from "date-fns";

interface EducationCardProps {
  education: EducationItem;
  onEdit: (item: EducationItem) => void;
  onDelete: (id: string) => void;
  onAIAnalysis?: (item: EducationItem) => void;
}

export function EducationCard({ education, onEdit, onDelete, onAIAnalysis }: EducationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const institutionName = education.institution_name || education.institution || "Educational Institution";
  const cgpaValue = education.cgpa || education.grade;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    try {
      return format(new Date(dateStr), "MMM yyyy");
    } catch {
      return dateStr;
    }
  };

  const hasExtraContent = !!(
    education.activities ||
    education.honors_awards ||
    education.relevant_coursework ||
    education.certificate_url
  );

  return (
    <Card className="overflow-hidden border border-border/60 hover:border-primary/40 transition-all shadow-sm hover:shadow-md bg-card">
      <CardContent className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {/* Institution Logo / Icon Badge */}
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
              {education.institution_logo_url ? (
                <img 
                  src={education.institution_logo_url} 
                  alt={institutionName} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <GraduationCap className="w-6 h-6 text-primary" />
              )}
            </div>

            {/* Details */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-foreground leading-tight">
                  {institutionName}
                </h3>
                {education.is_current && (
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs">
                    Currently Studying
                  </Badge>
                )}
                {education.verification_status === "verified" && (
                  <Badge variant="outline" className="border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </Badge>
                )}
              </div>

              <p className="font-semibold text-primary text-base">
                {education.degree}
                {education.major && <span className="text-foreground/80 font-normal"> in {education.major}</span>}
              </p>

              {education.specialization && (
                <p className="text-xs text-muted-foreground font-medium">
                  Specialization: {education.specialization}
                </p>
              )}

              {/* Date & CGPA row */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <div className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-primary/70" />
                  <span>
                    {formatDate(education.start_date)} — {education.is_current ? "Present" : formatDate(education.end_date) || "Present"}
                  </span>
                </div>

                {cgpaValue && (
                  <div className="flex items-center gap-1.5 font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Award className="w-3.5 h-3.5" />
                    <span>CGPA / Grade: {cgpaValue}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 self-end md:self-start shrink-0 pt-2 md:pt-0">
            {onAIAnalysis && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onAIAnalysis(education)}
                className="h-8 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                title="AI Education Analysis (Coming Soon)"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Review
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onEdit(education)}
              className="h-8 px-2.5 text-xs"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onDelete(education.id)}
              className="h-8 px-2 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Expandable Section */}
        {hasExtraContent && (
          <div className="mt-4 pt-3 border-t border-border/40">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline focus:outline-none"
            >
              {expanded ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" /> Show less details
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" /> View coursework, awards & attachments
                </>
              )}
            </button>

            {expanded && (
              <div className="mt-4 space-y-3.5 text-xs text-foreground/90 bg-muted/20 p-4 rounded-lg border border-border/40">
                {education.relevant_coursework && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-primary" /> Relevant Coursework
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{education.relevant_coursework}</p>
                  </div>
                )}

                {education.honors_awards && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" /> Honors & Awards
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{education.honors_awards}</p>
                  </div>
                )}

                {education.activities && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-500" /> Activities & Societies
                    </h4>
                    <p className="leading-relaxed pl-5 whitespace-pre-line">{education.activities}</p>
                  </div>
                )}

                {education.certificate_url && (
                  <div>
                    <h4 className="font-semibold text-muted-foreground flex items-center gap-1.5 mb-1.5">
                      <FileText className="w-3.5 h-3.5 text-blue-500" /> Degree Certificate
                    </h4>
                    <div className="pl-5">
                      <a
                        href={education.certificate_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 underline font-medium"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Attached Certificate
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
