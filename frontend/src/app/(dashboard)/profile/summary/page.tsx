"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getFullProfile, updateProfessionalSummary } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProfessionalSummaryPage() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      current_job_title: "",
      current_company: "",
      employment_status: "",
      years_of_experience: "",
      industry: "",
      career_level: "",
      expected_salary: "",
      preferred_currency: "",
      notice_period: "",
      professional_summary: "",
    }
  });

  useEffect(() => {
    if (profile?.professional_summary) {
      reset({
        current_job_title: profile.professional_summary.current_job_title || "",
        current_company: profile.professional_summary.current_company || "",
        employment_status: profile.professional_summary.employment_status || "",
        years_of_experience: profile.professional_summary.years_of_experience || "",
        industry: profile.professional_summary.industry || "",
        career_level: profile.professional_summary.career_level || "",
        expected_salary: profile.professional_summary.expected_salary || "",
        preferred_currency: profile.professional_summary.preferred_currency || "",
        notice_period: profile.professional_summary.notice_period || "",
        professional_summary: profile.professional_summary.professional_summary || "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateProfessionalSummary,
    onSuccess: () => {
      toast.success("Professional summary updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update professional summary.");
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
      <div className="mb-6">
        <h2 className="text-xl font-bold">Professional Summary</h2>
        <p className="text-sm text-muted-foreground">Highlight your career objectives and current status.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="space-y-2">
          <Label>Executive Summary</Label>
          <Textarea 
            placeholder="A brief summary of your professional background and goals..." 
            className="min-h-[120px]"
            {...register("professional_summary")} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Current Job Title</Label>
            <Input placeholder="e.g. Product Manager" {...register("current_job_title")} />
          </div>
          <div className="space-y-2">
            <Label>Current Company</Label>
            <Input placeholder="e.g. Acme Corp" {...register("current_company")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Employment Status</Label>
            <Select onValueChange={(val) => setValue("employment_status", val || "")} value={watch("employment_status") || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Years of Experience</Label>
            <Select onValueChange={(val) => setValue("years_of_experience", val || "")} value={watch("years_of_experience") || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0-1">0-1 Years</SelectItem>
                <SelectItem value="2-4">2-4 Years</SelectItem>
                <SelectItem value="5-7">5-7 Years</SelectItem>
                <SelectItem value="8-10">8-10 Years</SelectItem>
                <SelectItem value="10+">10+ Years</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Career Level</Label>
            <Select onValueChange={(val) => setValue("career_level", val || "")} value={watch("career_level") || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="mid">Mid Level</SelectItem>
                <SelectItem value="senior">Senior Level</SelectItem>
                <SelectItem value="director">Director</SelectItem>
                <SelectItem value="executive">Executive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Industry</Label>
            <Input placeholder="e.g. Technology" {...register("industry")} />
          </div>
          <div className="space-y-2">
            <Label>Expected Salary</Label>
            <Input placeholder="e.g. 120,000" type="number" {...register("expected_salary")} />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input placeholder="e.g. USD" {...register("preferred_currency")} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-8">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
