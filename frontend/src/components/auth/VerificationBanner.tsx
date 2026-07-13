"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";
import { useState } from "react";
import VerificationDialog from "./VerificationDialog";

export default function VerificationBanner() {
  const user = useAuthStore((state) => state.user);
  const [isDismissed, setIsDismissed] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!user || user.is_verified || isDismissed) {
    return null;
  }

  return (
    <>
      <Alert variant="warning" className="mb-6 border-amber-500/50 bg-amber-50/50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300">
        <AlertCircle className="h-4 w-4 stroke-amber-600 dark:stroke-amber-500" />
        <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
          Verification Required
        </AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-4">
          <span>
            Verify your email address to unlock all AI Job Finder features, including AI Match and Applications.
          </span>
          <div className="flex items-center gap-3">
            <Button 
              size="sm" 
              variant="default"
              className="bg-amber-600 hover:bg-amber-700 text-white border-none"
              onClick={() => setDialogOpen(true)}
            >
              Verify Email
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-400 dark:hover:text-amber-200 dark:hover:bg-amber-500/20"
              onClick={() => setIsDismissed(true)}
            >
              Dismiss
            </Button>
          </div>
        </AlertDescription>
      </Alert>
      <VerificationDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
