"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFullProfile, addListItem, deleteListItem } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SkillsPage() {
  const queryClient = useQueryClient();
  const [newSkill, setNewSkill] = useState("");
  const [level, setLevel] = useState("Intermediate");
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const skills = profile?.skills || [];

  const addMutation = useMutation({
    mutationFn: async (skillData: any) => {
      return addListItem("/profile/skills", skillData);
    },
    onSuccess: () => {
      toast.success("Skill added.");
      setNewSkill("");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return deleteListItem("/profile/skills", id.toString());
    },
    onSuccess: () => {
      toast.success("Skill removed.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    addMutation.mutate({ skill_name: newSkill, level });
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="text-sm text-muted-foreground">Add skills to help our AI match you with the best jobs.</p>
      </div>

      <form onSubmit={handleAddSkill} className="flex gap-3 mb-8 items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium">Skill Name</label>
          <Input 
            placeholder="e.g. React, Python, Product Management" 
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
        </div>
        <div className="w-48 space-y-2 hidden sm:block">
          <label className="text-sm font-medium">Level</label>
          <Select value={level} onValueChange={setLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" disabled={addMutation.isPending || !newSkill.trim()}>
          {addMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Add Skill
        </Button>
      </form>

      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Your Skills</h3>
        
        {skills.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No skills added yet.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: any) => (
              <Badge 
                key={skill.id} 
                variant="secondary" 
                className="px-3 py-1.5 text-sm font-medium flex items-center gap-2 hover:bg-secondary/80 transition-colors"
              >
                {skill.skill_name}
                <span className="text-xs opacity-50 font-normal">({skill.level || 'Intermediate'})</span>
                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(skill.id)}
                  className="ml-1 hover:bg-background rounded-full p-0.5 transition-colors"
                  disabled={deleteMutation.isPending}
                >
                  <X className="w-3 h-3 text-muted-foreground hover:text-destructive" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
