"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { diffWords, Change } from "diff";
import { format } from "date-fns";
import { 
  History, RotateCcw, Trash2, ChevronRight, FileText, ArrowLeft, Eye
} from "lucide-react";
import { toast } from "sonner";

import { getResumeVersions, restoreResumeVersion, deleteResumeVersion } from "@/features/profile/services/version.api";
import { getResumeDetails } from "@/features/profile/services/profile.api";
import { ResumeVersion } from "@/features/profile/types/version.types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ResumeVersionsPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const resumeId = Number(params.id);

  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);

  // Fetch head resume
  const { data: resume } = useQuery({
    queryKey: ["resume", resumeId],
    queryFn: () => getResumeDetails(resumeId),
  });

  // Fetch version history
  const { data: versions = [], isLoading } = useQuery({
    queryKey: ["resumeVersions", resumeId],
    queryFn: () => getResumeVersions(resumeId),
  });

  const restoreMutation = useMutation({
    mutationFn: (versionId: string) => restoreResumeVersion(resumeId, versionId),
    onSuccess: () => {
      toast.success("Resume restored successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumeVersions", resumeId] });
      queryClient.invalidateQueries({ queryKey: ["resume", resumeId] });
      router.push(`/profile/resume`);
    },
    onError: () => {
      toast.error("Failed to restore version");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (versionId: string) => deleteResumeVersion(resumeId, versionId),
    onSuccess: () => {
      toast.success("Version deleted");
      queryClient.invalidateQueries({ queryKey: ["resumeVersions", resumeId] });
      setSelectedVersionId(null);
    },
    onError: () => {
      toast.error("Failed to delete version");
    }
  });

  // Selected Version vs Head
  const selectedVersion = versions.find(v => v.id === selectedVersionId);
  
  // Compute text diff between selected historical version and current head
  let diffChunks: Change[] = [];
  if (selectedVersion && resume) {
    const oldText = selectedVersion.clean_text || "";
    const newText = resume.clean_text || "";
    diffChunks = diffWords(oldText, newText);
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-[calc(100vh-60px)] flex flex-col">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Version History</h1>
          <p className="text-muted-foreground">Compare past versions with your current resume</p>
        </div>
      </div>

      <div className="flex flex-1 gap-6 overflow-hidden">
        {/* Left Panel: Timeline */}
        <Card className="w-1/3 flex flex-col shadow-sm h-full overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50 pb-4 shrink-0">
            <CardTitle className="text-lg flex items-center">
              <History className="w-5 h-5 mr-2 text-slate-500" />
              Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto flex-1">
            {isLoading ? (
              <div className="p-6 space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-full" />
              </div>
            ) : versions.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
                No version history found.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {versions.map((version) => (
                  <div 
                    key={version.id} 
                    className={`p-4 cursor-pointer hover:bg-blue-50/50 transition-colors border-l-4 ${selectedVersionId === version.id ? "border-l-blue-600 bg-blue-50/50" : "border-l-transparent"}`}
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-white">v{version.version_number}</Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        {format(new Date(version.created_at), "MMM d, yyyy h:mm a")}
                      </span>
                    </div>
                    <p className="font-medium text-slate-900">{version.change_summary}</p>
                    
                    <div className="mt-3 flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-7 text-xs bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                        onClick={(e) => { e.stopPropagation(); restoreMutation.mutate(version.id); }}
                        disabled={restoreMutation.isPending}
                      >
                        <RotateCcw className="w-3 h-3 mr-1" /> Restore
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => { e.stopPropagation(); deleteMutation.mutate(version.id); }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Panel: Diff Viewer */}
        <Card className="flex-1 shadow-sm flex flex-col overflow-hidden h-full">
          <CardHeader className="border-b bg-slate-50/50 pb-4 shrink-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center">
                <Eye className="w-5 h-5 mr-2 text-slate-500" />
                Diff Viewer
              </CardTitle>
              {selectedVersion && (
                <CardDescription className="mt-1">
                  Comparing <strong className="text-slate-700">v{selectedVersion.version_number}</strong> with <strong className="text-blue-600">Current Head</strong>
                </CardDescription>
              )}
            </div>
            {selectedVersion && (
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-red-100 border border-red-300 mr-2"></span> Removed in Current</div>
                <div className="flex items-center"><span className="w-3 h-3 rounded-sm bg-green-100 border border-green-300 mr-2"></span> Added in Current</div>
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0 overflow-hidden flex-1 relative bg-white">
            {!selectedVersion ? (
              <div className="flex items-center justify-center h-full text-slate-400 p-8 text-center flex-col">
                <History className="w-16 h-16 mb-4 opacity-20" />
                <p>Select a historical version from the timeline<br/>to compare it against your current resume.</p>
              </div>
            ) : (
              <div className="h-full overflow-y-auto p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                {diffChunks.map((part, index) => {
                  if (part.added) {
                    return (
                      <span key={index} className="bg-green-100 text-green-900 px-1 py-0.5 rounded-sm font-medium">
                        {part.value}
                      </span>
                    );
                  }
                  if (part.removed) {
                    return (
                      <span key={index} className="bg-red-100 text-red-900 line-through px-1 py-0.5 rounded-sm opacity-80">
                        {part.value}
                      </span>
                    );
                  }
                  return <span key={index} className="text-slate-600">{part.value}</span>;
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
