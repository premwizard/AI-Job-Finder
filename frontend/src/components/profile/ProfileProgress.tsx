"use client";

import { useQuery } from "@tanstack/react-query";
import { getFullProfile } from "@/features/profile/services/profile.api";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Trophy } from "lucide-react";

export function ProfileProgress() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getFullProfile,
  });

  const completion = profile?.completion_percentage || 0;

  if (isLoading) {
    return (
      <Card className="mb-8 border-none bg-muted/50">
        <CardContent className="p-6">
          <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-8 border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Profile Strength</h3>
              <p className="text-sm text-muted-foreground">
                {completion === 100 
                  ? "Outstanding! You have an All-Star profile."
                  : "Complete your profile to unlock AI matching."}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold text-primary">{completion}%</span>
            <span className="text-sm text-muted-foreground ml-1">Complete</span>
          </div>
        </div>
        
        <Progress value={completion} className="h-2.5" />
        
        {completion < 100 && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 p-2 rounded-md">
            <Sparkles className="w-4 h-4" />
            <span>Suggestion: Add your Work Experience to boost your score!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
