"use client";

import { PersonalInfoForm } from "@/features/profile/components/PersonalInformation";

export default function PersonalInfoPage() {
  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Personal Information</h2>
        <p className="text-muted-foreground mt-2">
          Manage your personal details. These details help personalize your profile and improve AI-powered recommendations.
        </p>
      </div>

      <PersonalInfoForm />
    </div>
  );
}
