"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Mail, 
  MapPin, 
  Briefcase, 
  FileText, 
  Bookmark, 
  Edit3,
  Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth";

export default function ProfilePage() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: authService.getCurrentUser
  });

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-semibold">Could not load profile</h2>
      </div>
    );
  }

  const initials = user.full_name?.substring(0, 2).toUpperCase() || 'U';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Profile</h2>
          <p className="text-muted-foreground mt-1">
            Manage your personal information, career preferences, and skills.
          </p>
        </div>
        <Button className="gap-2">
          <Edit3 className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 text-center">
            <CardContent className="pt-6">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary mb-4 border-4 border-background shadow-md">
                {initials}
              </div>
              <h3 className="text-xl font-bold">{user.full_name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{user.preferred_role || 'Not specified'}</p>
              
              <div className="flex flex-col gap-2 text-sm text-left">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm">Resumes</span>
                </div>
                <span className="font-semibold">1 Active</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm">Saved Jobs</span>
                </div>
                <span className="font-semibold">View Dashboard</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Career Preferences</CardTitle>
              <CardDescription>What you are looking for in your next role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Target Roles</Label>
                  <p className="font-medium">{user.preferred_role || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Experience Level</Label>
                  <p className="font-medium">{user.experience ? `${user.experience} years` : 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Work Mode</Label>
                  <p className="font-medium capitalize">{user.work_preference || 'Not specified'}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Education</Label>
                  <p className="font-medium">{user.education || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Skills & Technologies</CardTitle>
              <CardDescription>Skills extracted from your resume and profile.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-primary/10 text-primary">Pending Analysis</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
