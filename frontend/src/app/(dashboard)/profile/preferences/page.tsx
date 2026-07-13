"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getFullProfile, updateCareerPreferences } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

export default function CareerPreferencesPage() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      preferred_roles: "",
      preferred_industries: "",
      preferred_locations: "",
      work_setup: "",
      expected_salary: "",
      preferred_currency: "",
      employment_types: "",
      company_size: "",
      visa_sponsorship: false,
      willing_to_relocate: false,
      travel_willingness: "",
      preferred_shift: "",
      availability: "",
    }
  });

  useEffect(() => {
    if (profile?.career_preferences) {
      reset({
        preferred_roles: profile.career_preferences.preferred_roles || "",
        preferred_industries: profile.career_preferences.preferred_industries || "",
        preferred_locations: profile.career_preferences.preferred_locations || "",
        work_setup: profile.career_preferences.work_setup || "",
        expected_salary: profile.career_preferences.expected_salary || "",
        preferred_currency: profile.career_preferences.preferred_currency || "",
        employment_types: profile.career_preferences.employment_types || "",
        company_size: profile.career_preferences.company_size || "",
        visa_sponsorship: profile.career_preferences.visa_sponsorship || false,
        willing_to_relocate: profile.career_preferences.willing_to_relocate || false,
        travel_willingness: profile.career_preferences.travel_willingness || "",
        preferred_shift: profile.career_preferences.preferred_shift || "",
        availability: profile.career_preferences.availability || "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateCareerPreferences,
    onSuccess: () => {
      toast.success("Career preferences updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update career preferences.");
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
        <h2 className="text-xl font-bold">Career Preferences</h2>
        <p className="text-sm text-muted-foreground">Tell us what you are looking for in your next role.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Preferred Roles</Label>
            <Input placeholder="e.g. Frontend Engineer, Full Stack" {...register("preferred_roles")} />
            <p className="text-xs text-muted-foreground">Separate with commas.</p>
          </div>
          <div className="space-y-2">
            <Label>Preferred Locations</Label>
            <Input placeholder="e.g. San Francisco, New York, London" {...register("preferred_locations")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Work Setup</Label>
            <Input placeholder="e.g. Remote, Hybrid" {...register("work_setup")} />
          </div>
          <div className="space-y-2">
            <Label>Employment Types</Label>
            <Input placeholder="e.g. Full-time, Contract" {...register("employment_types")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Expected Salary (Min)</Label>
            <Input placeholder="e.g. 100,000" type="number" {...register("expected_salary")} />
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <Input placeholder="e.g. USD" {...register("preferred_currency")} />
          </div>
        </div>

        <div className="pt-4 border-t space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Additional Preferences</h3>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Visa Sponsorship</Label>
              <p className="text-sm text-muted-foreground">I require visa sponsorship to work.</p>
            </div>
            <Switch 
              checked={watch("visa_sponsorship")} 
              onCheckedChange={(val) => setValue("visa_sponsorship", val)} 
            />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base font-medium">Willing to Relocate</Label>
              <p className="text-sm text-muted-foreground">I am open to relocating for the right opportunity.</p>
            </div>
            <Switch 
              checked={watch("willing_to_relocate")} 
              onCheckedChange={(val) => setValue("willing_to_relocate", val)} 
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-8">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  );
}
