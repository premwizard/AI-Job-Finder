"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getFullProfile, updateAIPreferences } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export default function AIPreferencesPage() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      dream_companies: "",
      dream_roles: "",
      dream_technologies: "",
      preferred_ai_domains: "",
      learning_goals: "",
      interview_level: "",
      career_objectives: "",
    }
  });

  useEffect(() => {
    if (profile?.ai_preferences) {
      reset({
        dream_companies: profile.ai_preferences.dream_companies || "",
        dream_roles: profile.ai_preferences.dream_roles || "",
        dream_technologies: profile.ai_preferences.dream_technologies || "",
        preferred_ai_domains: profile.ai_preferences.preferred_ai_domains || "",
        learning_goals: profile.ai_preferences.learning_goals || "",
        interview_level: profile.ai_preferences.interview_level || "",
        career_objectives: profile.ai_preferences.career_objectives || "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateAIPreferences,
    onSuccess: () => {
      toast.success("AI preferences updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update AI preferences.");
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold">AI Preferences</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-8">
        These settings are exclusively used by our AI agents to tailor job matching, interview prep, and career pathing to your ultimate goals.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Dream Companies</Label>
                <Input placeholder="e.g. OpenAI, Google, Stripe" {...register("dream_companies")} />
                <p className="text-xs text-muted-foreground">Companies you aspire to work for.</p>
              </div>
              <div className="space-y-2">
                <Label>Dream Roles</Label>
                <Input placeholder="e.g. AI Researcher, Staff Engineer" {...register("dream_roles")} />
                <p className="text-xs text-muted-foreground">Your ultimate target positions.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Dream Technologies</Label>
              <Input placeholder="e.g. LLMs, Rust, Distributed Systems" {...register("dream_technologies")} />
              <p className="text-xs text-muted-foreground">Tech stacks you want to master.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Career Objectives</Label>
              <Textarea 
                placeholder="Where do you see yourself in 5 years? What impact do you want to make?" 
                className="min-h-[100px]"
                {...register("career_objectives")} 
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4 border-t mt-8">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save AI Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
