"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import ProtectedRoute from "@/components/common/ProtectedRoute";

// Simplified for now, should include all 7 sections with proper UI components
export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
      current_job_title: "",
      preferred_role: "",
      years_of_experience: "",
      highest_education: "",
      current_company: "",
      expected_salary: "",
    }
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    // API call to PUT /api/profile
    setLoading(false);
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-10 max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Professional Profile</h1>
        <p className="text-muted-foreground text-lg">
          Complete your profile to unlock AI Job Matching and personalized recommendations.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle>1. Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input {...register("first_name")} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input {...register("last_name")} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Email</Label>
                <Input {...register("email")} disabled />
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Professional Info */}
          <Card>
            <CardHeader>
              <CardTitle>2. Professional Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Job Title</Label>
                <Input {...register("current_job_title")} />
              </div>
              <div className="space-y-2">
                <Label>Preferred Role</Label>
                <Input {...register("preferred_role")} />
              </div>
              <div className="space-y-2">
                <Label>Years of Experience</Label>
                <Input {...register("years_of_experience")} />
              </div>
              <div className="space-y-2">
                <Label>Highest Education</Label>
                <Input {...register("highest_education")} />
              </div>
            </CardContent>
          </Card>

          {/* Stick Save Button */}
          <div className="sticky bottom-4 z-10 flex justify-end">
            <Button type="submit" size="lg" className="shadow-lg" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
