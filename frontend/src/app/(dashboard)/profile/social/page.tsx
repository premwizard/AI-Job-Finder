"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getFullProfile, updateSocialProfiles } from "@/features/profile/services/profile.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Github, Linkedin, Twitter, Youtube, Link as LinkIcon } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SocialProfilesPage() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      github_url: "",
      linkedin_url: "",
      portfolio_url: "",
      kaggle_url: "",
      leetcode_url: "",
      medium_url: "",
      twitter_url: "",
      youtube_url: "",
    }
  });

  useEffect(() => {
    if (profile?.social_profiles) {
      reset({
        github_url: profile.social_profiles.github_url || "",
        linkedin_url: profile.social_profiles.linkedin_url || "",
        portfolio_url: profile.social_profiles.portfolio_url || "",
        kaggle_url: profile.social_profiles.kaggle_url || "",
        leetcode_url: profile.social_profiles.leetcode_url || "",
        medium_url: profile.social_profiles.medium_url || "",
        twitter_url: profile.social_profiles.twitter_url || "",
        youtube_url: profile.social_profiles.youtube_url || "",
      });
    }
  }, [profile, reset]);

  const mutation = useMutation({
    mutationFn: updateSocialProfiles,
    onSuccess: () => {
      toast.success("Social profiles updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update social profiles.");
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
        <h2 className="text-xl font-bold">Social Profiles</h2>
        <p className="text-sm text-muted-foreground">Add links to your professional profiles and portfolios.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-600" /> LinkedIn</Label>
            <Input placeholder="https://linkedin.com/in/yourprofile" {...register("linkedin_url")} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Github className="w-4 h-4" /> GitHub</Label>
            <Input placeholder="https://github.com/yourusername" {...register("github_url")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4" /> Portfolio / Website</Label>
            <Input placeholder="https://yourwebsite.com" {...register("portfolio_url")} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Twitter className="w-4 h-4 text-sky-500" /> X (Twitter)</Label>
            <Input placeholder="https://x.com/yourhandle" {...register("twitter_url")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-orange-500" /> LeetCode</Label>
            <Input placeholder="https://leetcode.com/yourusername" {...register("leetcode_url")} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-blue-400" /> Kaggle</Label>
            <Input placeholder="https://kaggle.com/yourusername" {...register("kaggle_url")} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><LinkIcon className="w-4 h-4 text-gray-800 dark:text-white" /> Medium</Label>
            <Input placeholder="https://medium.com/@yourusername" {...register("medium_url")} />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center gap-2"><Youtube className="w-4 h-4 text-red-600" /> YouTube</Label>
            <Input placeholder="https://youtube.com/c/yourchannel" {...register("youtube_url")} />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-8">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Profiles
          </Button>
        </div>
      </form>
    </div>
  );
}
