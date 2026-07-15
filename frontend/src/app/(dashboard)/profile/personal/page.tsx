"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getFullProfile, updatePersonalInfo } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function PersonalInfoPage() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      headline: "",
      bio: "",
      phone_number: "",
      country: "",
      state: "",
      city: "",
      languages: "",
    }
  });

  useEffect(() => {
    if (profile?.personal_info) {
      reset({
        headline: profile.personal_info.headline || "",
        bio: profile.personal_info.bio || "",
        phone_number: profile.personal_info.phone_number || "",
        country: profile.personal_info.country || "",
        state: profile.personal_info.state || "",
        city: profile.personal_info.city || "",
        languages: profile.personal_info.languages || "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updatePersonalInfo,
    onSuccess: () => {
      toast.success("Personal information updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update personal information.");
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
        <h2 className="text-xl font-bold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">Manage your basic profile details and contact information.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Placeholder for future Avatar / Cover upload */}
        <div className="space-y-2">
          <Label>Professional Headline</Label>
          <Input placeholder="e.g. Senior Software Engineer at TechCorp" {...register("headline")} />
          <p className="text-xs text-muted-foreground">Appears at the top of your profile.</p>
        </div>

        <div className="space-y-2">
          <Label>About (Bio)</Label>
          <Textarea 
            placeholder="Tell us about yourself..." 
            className="min-h-[120px]"
            {...register("bio")} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input placeholder="+1 (555) 000-0000" {...register("phone_number")} />
          </div>
          <div className="space-y-2">
            <Label>Languages</Label>
            <Input placeholder="English, Spanish" {...register("languages")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Country</Label>
            <Input placeholder="e.g. United States" {...register("country")} />
          </div>
          <div className="space-y-2">
            <Label>State / Province</Label>
            <Input placeholder="e.g. California" {...register("state")} />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Input placeholder="e.g. San Francisco" {...register("city")} />
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
