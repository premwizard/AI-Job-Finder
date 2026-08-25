"use client";

import React, { useState, useMemo } from "react";
import * as diff from "diff";
import { 
  Sparkles, 
  Columns, 
  FileText, 
  Copy, 
  Check, 
  PlusCircle, 
  MinusCircle, 
  ArrowRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ResumeDiffViewerProps {
  originalText: string;
  tailoredText: string;
  jobTitle?: string;
  companyName?: string;
}

export function ResumeDiffViewer({
  originalText,
  tailoredText,
  jobTitle = "Target Position",
  companyName,
}: ResumeDiffViewerProps) {
  const [viewMode, setViewMode] = useState<"side-by-side" | "unified">("side-by-side");
  const [copied, setCopied] = useState(false);

  // Compute line-by-line diffs
  const lineDiffs = useMemo(() => {
    return diff.diffLines(originalText || "", tailoredText || "");
  }, [originalText, tailoredText]);

  // Compute word-level diffs for inline highlighting
  const wordDiffs = useMemo(() => {
    return diff.diffWords(originalText || "", tailoredText || "");
  }, [originalText, tailoredText]);

  // Compute statistics
  const stats = useMemo(() => {
    let addedLines = 0;
    let removedLines = 0;
    let unchangedLines = 0;

    lineDiffs.forEach((part) => {
      const count = part.count || (part.value.match(/\n/g) || []).length + 1;
      if (part.added) {
        addedLines += count;
      } else if (part.removed) {
        removedLines += count;
      } else {
        unchangedLines += count;
      }
    });

    const totalChanges = addedLines + removedLines;
    return { addedLines, removedLines, unchangedLines, totalChanges };
  }, [lineDiffs]);

  const handleCopyTailored = () => {
    navigator.clipboard.writeText(tailoredText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="border border-border/60 bg-card/60 backdrop-blur-md shadow-md">
      <CardHeader className="border-b pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-primary/15 text-primary border-primary/20 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> AI Resume Comparison
              </Badge>
              {companyName && (
                <span className="text-xs text-muted-foreground font-medium">
                  Tailored for {companyName}
                </span>
              )}
            </div>
            <CardTitle className="text-xl font-bold mt-1.5 flex items-center gap-2">
              Resume Tailoring Diff
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <span className="text-primary">{jobTitle}</span>
            </CardTitle>
            <CardDescription className="text-xs mt-0.5">
              Review AI-driven keyword optimizations, skill additions, and phrasing improvements.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "side-by-side" | "unified")}>
              <TabsList className="grid grid-cols-2 h-9">
                <TabsTrigger value="side-by-side" className="text-xs gap-1.5">
                  <Columns className="w-3.5 h-3.5" /> Side by Side
                </TabsTrigger>
                <TabsTrigger value="unified" className="text-xs gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Unified Diff
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyTailored}
              className="gap-1.5 text-xs h-9"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Tailored
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Stats summary bar */}
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+{stats.addedLines} additions</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-medium">
            <MinusCircle className="w-3.5 h-3.5" />
            <span>-{stats.removedLines} removals</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>{stats.totalChanges} total edits applied</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        {viewMode === "side-by-side" ? (
          /* Side-by-side layout */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Resume Box */}
            <div className="rounded-lg border bg-muted/30 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Original Resume
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Before AI
                </Badge>
              </div>
              <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap space-y-1 overflow-x-auto max-h-[450px] overflow-y-auto pr-2">
                {lineDiffs.map((part, index) => {
                  if (part.added) return null;
                  return (
                    <span
                      key={index}
                      className={
                        part.removed
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 line-through decoration-rose-500/50 block rounded px-1"
                          : "text-foreground block"
                      }
                    >
                      {part.value}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* AI Tailored Resume Box */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-primary/20">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI Tailored Resume
                </span>
                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                  Optimized
                </Badge>
              </div>
              <div className="font-mono text-xs leading-relaxed whitespace-pre-wrap space-y-1 overflow-x-auto max-h-[450px] overflow-y-auto pr-2">
                {lineDiffs.map((part, index) => {
                  if (part.removed) return null;
                  return (
                    <span
                      key={index}
                      className={
                        part.added
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium block rounded px-1 border-l-2 border-emerald-500 pl-2"
                          : "text-foreground block"
                      }
                    >
                      {part.value}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* Inline Unified Diff layout */
          <div className="rounded-lg border bg-slate-950 text-slate-100 p-4 font-mono text-xs leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto">
            <div className="text-[11px] text-slate-400 pb-2 mb-3 border-b border-slate-800 flex items-center justify-between">
              <span>UNIFIED RESUME DIFF</span>
              <span>Green: Added by AI | Red: Removed</span>
            </div>
            {wordDiffs.map((part, index) => {
              const color = part.added
                ? "bg-emerald-950 text-emerald-300 font-semibold px-1 rounded border-b border-emerald-500"
                : part.removed
                ? "bg-rose-950 text-rose-400 line-through px-1 rounded"
                : "text-slate-300";

              return (
                <span key={index} className={color}>
                  {part.value}
                </span>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
