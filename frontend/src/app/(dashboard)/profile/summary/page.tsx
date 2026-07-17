"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { getFullProfile, updateProfessionalSummary } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Sparkles, Wand2, SearchCheck, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { format } from "date-fns";

export default function ProfessionalSummaryPage() {
  const queryClient = useQueryClient();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset, control, formState: { isDirty } } = useForm({
    defaultValues: {
      headline: "",
      professional_summary: "",
      career_objective: "",
      years_of_experience_summary: "",
      key_achievements: "",
      career_highlights: "",
    }
  });

  useEffect(() => {
    if (profile?.professional_summary) {
      reset({
        headline: profile.professional_summary.headline || "",
        professional_summary: profile.professional_summary.professional_summary || "",
        career_objective: profile.professional_summary.career_objective || "",
        years_of_experience_summary: profile.professional_summary.years_of_experience_summary || "",
        key_achievements: profile.professional_summary.key_achievements || "",
        career_highlights: profile.professional_summary.career_highlights || "",
      });
      if (profile.professional_summary.updated_at) {
        setLastSaved(new Date(profile.professional_summary.updated_at));
      }
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateProfessionalSummary,
    onSuccess: (data) => {
      toast.success("Professional summary updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      if (data?.updated_at) {
        setLastSaved(new Date(data.updated_at));
      } else {
        setLastSaved(new Date());
      }
    },
    onError: () => {
      toast.error("Failed to update professional summary.");
    }
  });

  const onSubmit = (data: any) => {
    mutation.mutate(data);
  };

  const AiButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <Button variant="outline" size="sm" type="button" disabled className="h-8 text-xs font-medium bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary">
      <Icon className="w-3.5 h-3.5 mr-1.5" />
      {label}
    </Button>
  );

  if (isLoading) {
    return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-muted-foreground w-8 h-8" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Professional Summary</h2>
          <p className="text-muted-foreground mt-1">Shape your professional narrative. Enhance it continuously to attract the best opportunities.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSaved && (
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md">
              <RefreshCw className="w-3 h-3" />
              Last saved: {format(lastSaved, 'MMM d, h:mm a')}
            </span>
          )}
        </div>
      </div>

      {isDirty && (
        <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-md text-sm mb-6 flex items-center justify-between">
          <span>You have unsaved changes.</span>
          <Button size="sm" onClick={handleSubmit(onSubmit)} disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Now
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        
        {/* Professional Headline */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Professional Headline</Label>
            <div className="flex gap-2">
              <AiButton icon={Sparkles} label="Generate AI Headline" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">A concise, impactful statement describing your role and core value.</p>
          <Input 
            placeholder="e.g. Senior Full-Stack Engineer | AI Enthusiast | Building Scalable Systems" 
            className="font-medium text-lg h-12"
            maxLength={255}
            {...register("headline")} 
          />
        </section>

        {/* Career Summary */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Career Summary</Label>
            <div className="flex gap-2 hidden sm:flex">
              <AiButton icon={Wand2} label="Improve" />
              <AiButton icon={SearchCheck} label="Optimize for ATS" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">An executive overview of your professional background, skills, and overall trajectory.</p>
          <Controller
            name="professional_summary"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange} 
                placeholder="Write your career summary..." 
                maxLength={2000}
                className="min-h-[200px]"
              />
            )}
          />
        </section>

        {/* Years of Experience Summary */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Years of Experience Summary</Label>
          </div>
          <p className="text-sm text-muted-foreground">Detail how your experience spans across different industries, technologies, or roles.</p>
          <Controller
            name="years_of_experience_summary"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange} 
                placeholder="e.g. 5+ years in FinTech, 3 years specializing in Machine Learning..." 
                maxLength={2000}
                className="min-h-[150px]"
              />
            )}
          />
        </section>

        {/* Career Objective */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Career Objective</Label>
          </div>
          <p className="text-sm text-muted-foreground">What are you looking for in your next role? What are your short-term and long-term goals?</p>
          <Controller
            name="career_objective"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange} 
                placeholder="Looking for a leadership role in an AI-driven startup..." 
                maxLength={2000}
                className="min-h-[150px]"
              />
            )}
          />
        </section>

        {/* Key Achievements */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Key Achievements</Label>
            <div className="flex gap-2">
              <AiButton icon={Wand2} label="Rewrite Professionally" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Highlight 3-5 of your most impressive professional milestones with quantifiable results.</p>
          <Controller
            name="key_achievements"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange} 
                placeholder="Use bullet points for impact..." 
                maxLength={2000}
                className="min-h-[150px]"
              />
            )}
          />
        </section>

        {/* Career Highlights */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Career Highlights</Label>
          </div>
          <p className="text-sm text-muted-foreground">Notable projects, awards, speaking engagements, or unique experiences.</p>
          <Controller
            name="career_highlights"
            control={control}
            render={({ field }) => (
              <RichTextEditor 
                value={field.value} 
                onChange={field.onChange} 
                placeholder="e.g. Keynote speaker at ReactConf 2023..." 
                maxLength={2000}
                className="min-h-[150px]"
              />
            )}
          />
        </section>

        <div className="sticky bottom-0 bg-background/80 backdrop-blur-md p-4 -mx-6 md:-mx-8 border-t flex justify-end gap-4 mt-12 z-10">
          <Button type="button" variant="outline" onClick={() => reset()} disabled={!isDirty || mutation.isPending}>
            Discard Changes
          </Button>
          <Button type="submit" disabled={!isDirty || mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save All Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
