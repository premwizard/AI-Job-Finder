"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, FolderGit2, ExternalLink, Code, Pencil } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ProjectsPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const projects = profile?.projects || [];

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Highlight your best work, portfolios, and side projects.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-muted/10">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FolderGit2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg">No projects added</h3>
          <p className="text-muted-foreground mt-1 mb-6">Add projects to demonstrate your practical skills.</p>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" /> Add Project
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {projects.map((project: any) => (
            <Card key={project.id} className="flex flex-col h-full hover:shadow-lg transition-shadow overflow-hidden">
              <CardContent className="p-6 flex-1">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold line-clamp-1" title={project.name}>{project.name}</h3>
                  <Button variant="ghost" size="sm" className="h-8 -mt-2 -mr-2">Edit</Button>
                </div>
                
                {project.role && (
                  <p className="text-sm font-medium text-primary mb-3">{project.role}</p>
                )}
                
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {project.description}
                  </p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-auto pt-4">
                  {project.tech_stack?.split(",").map((tech: string, i: number) => (
                    <Badge key={i} variant="secondary" className="font-normal text-xs">{tech.trim()}</Badge>
                  ))}
                  {project.ai_technologies?.split(",").map((tech: string, i: number) => (
                    <Badge key={`ai-${i}`} className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 font-normal text-xs border-0">
                      {tech.trim()}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              
              {(project.github_url || project.live_demo_url) && (
                <CardFooter className="p-4 bg-muted/30 border-t flex gap-3">
                  {project.github_url && (
                    <Button variant="outline" size="sm" className="w-full" render={<Link href={project.github_url} target="_blank" />}>
                      <Code className="w-4 h-4 mr-2" /> Code
                    </Button>
                  )}
                  {project.live_demo_url && (
                    <Button variant="default" size="sm" className="w-full" render={<Link href={project.live_demo_url} target="_blank" />}>
                      <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
