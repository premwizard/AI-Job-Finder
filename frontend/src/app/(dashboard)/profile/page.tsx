"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getFullProfile, 
  getProfileCompletion, 
  getProfileStrength,
  uploadAvatar,
  uploadBanner
} from "@/features/profile/services/profile.api";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Loader2, Camera, User, MapPin, Briefcase, Award, FolderGit2, 
  FileText, Sparkles, CheckCircle2, CircleDashed, Edit3
} from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { toast } from "sonner";

export default function CareerProfileOverviewPage() {
  const queryClient = useQueryClient();
  const fileInputAvatarRef = useRef<HTMLInputElement>(null);
  const fileInputBannerRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const { data: completion, isLoading: isCompletionLoading } = useQuery({
    queryKey: ["profile_completion"],
    queryFn: getProfileCompletion,
  });

  const { data: strength, isLoading: isStrengthLoading } = useQuery({
    queryKey: ["profile_strength"],
    queryFn: getProfileStrength,
  });

  const avatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: () => {
      toast.success("Avatar updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update avatar.");
    }
  });

  const bannerMutation = useMutation({
    mutationFn: uploadBanner,
    onSuccess: () => {
      toast.success("Banner updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: () => {
      toast.error("Failed to update banner.");
    }
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      avatarMutation.mutate(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      bannerMutation.mutate(e.target.files[0]);
    }
  };

  const isLoading = isProfileLoading || isCompletionLoading || isStrengthLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-64 w-full rounded-t-lg" />
        <div className="p-6 pt-0 space-y-6">
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const pInfo = profile?.personal_info;
  const pSumm = profile?.professional_summary;

  const getInitials = () => {
    if (pInfo?.headline) return pInfo.headline.substring(0, 2).toUpperCase();
    return "US";
  };

  return (
    <div className="w-full">
      {/* 1. Cover Banner & Avatar */}
      <div className="relative group">
        <div className="h-48 md:h-64 w-full bg-gradient-to-r from-blue-600 to-indigo-700 rounded-t-lg overflow-hidden relative">
          {pInfo?.cover_banner_url && (
            <img 
              src={pInfo.cover_banner_url} 
              alt="Cover Banner" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="secondary" size="sm" onClick={() => fileInputBannerRef.current?.click()} disabled={bannerMutation.isPending}>
              {bannerMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Camera className="w-4 h-4 mr-2" />}
              Update Banner
            </Button>
            <input type="file" className="hidden" ref={fileInputBannerRef} accept="image/*" onChange={handleBannerChange} />
          </div>
        </div>

        <div className="absolute -bottom-16 left-6 md:left-10 group/avatar">
          <Avatar className="w-32 h-32 border-4 border-background shadow-lg bg-muted">
            <AvatarImage src={pInfo?.profile_picture_url || ""} />
            <AvatarFallback className="text-3xl">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputAvatarRef.current?.click()}>
            {avatarMutation.isPending ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
          </div>
          <input type="file" className="hidden" ref={fileInputAvatarRef} accept="image/*" onChange={handleAvatarChange} />
        </div>
        
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium flex items-center">
          <Sparkles className="w-3 h-3 text-yellow-500 mr-2" /> 
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="pt-20 px-6 md:px-10 pb-8 space-y-8">
        
        {/* 2. Professional Identity */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {pInfo?.headline ? pInfo.headline.split(' at ')[0] : "Your Name"}
            </h1>
            <p className="text-lg text-muted-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> 
              {pSumm?.current_job_title || "Role"} {pSumm?.current_company ? `at ${pSumm.current_company}` : ""}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" /> 
              {pInfo?.city || "City"}, {pInfo?.country || "Country"}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile/personal" className={buttonVariants({ variant: "default" })}>
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </Link>
            <Button variant="outline" disabled>
              Public Profile (Coming Soon)
            </Button>
          </div>
        </div>

        {pInfo?.bio && (
          <div>
            <p className="text-sm leading-relaxed">{pInfo.bio}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 3. Profile Completion */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex justify-between">
                Profile Completion
                <span className="text-primary">{completion?.completion_percentage || 0}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={completion?.completion_percentage || 0} className="h-2" />
              
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">To complete your profile:</p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  {completion?.missing_sections?.length === 0 ? (
                    <li className="flex items-center text-green-600">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> All sections completed!
                    </li>
                  ) : (
                    completion?.missing_sections?.slice(0, 4).map((section: string, i: number) => (
                      <li key={i} className="flex items-center">
                        <CircleDashed className="w-4 h-4 mr-2 text-muted-foreground/50" /> {section}
                      </li>
                    ))
                  )}
                  {completion?.missing_sections?.length > 4 && (
                    <li className="text-xs italic pl-6">+ {completion.missing_sections.length - 4} more</li>
                  )}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 4. Profile Strength */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Profile Strength</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full border-8 border-primary/20">
                  <div className="absolute inset-0 rounded-full border-8 border-primary border-r-transparent border-b-transparent transform transition-transform duration-1000 ease-in-out" style={{ transform: `rotate(${(strength?.score || 0) * 3.6 - 135}deg)` }}></div>
                  <span className="text-xl font-bold">{strength?.score || 0}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary">{strength?.category || "Beginner"}</h3>
                  <p className="text-sm text-muted-foreground">{strength?.explanation || "Complete your profile to improve visibility."}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 5. Quick Stats */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Sparkles className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{profile?.skills?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Skills</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Briefcase className="w-6 h-6 text-amber-500 mb-2" />
                <span className="text-2xl font-bold">{profile?.experiences?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Experience</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FolderGit2 className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold">{profile?.projects?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Projects</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <Award className="w-6 h-6 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{profile?.certifications?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Certifications</span>
              </CardContent>
            </Card>
            <Card className="bg-muted/50 border-none col-span-2 md:col-span-4 lg:col-span-1">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <FileText className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-2xl font-bold">{profile?.resumes?.length || 0}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Resumes</span>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 6. Quick Actions */}
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/profile/resume" className={buttonVariants({ variant: "secondary" })}>Upload Resume</Link>
            <Link href="/profile/skills" className={buttonVariants({ variant: "secondary" })}>Add Skill</Link>
            <Link href="/profile/experience" className={buttonVariants({ variant: "secondary" })}>Add Experience</Link>
            <Link href="/profile/projects" className={buttonVariants({ variant: "secondary" })}>Add Project</Link>
            <Link href="/profile/social" className={buttonVariants({ variant: "secondary" })}>Link Social</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
