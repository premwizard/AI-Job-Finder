"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { sendVerificationEmail } from "@/features/auth/services/auth.api";
import { Mail, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VerificationDialog({ open, onOpenChange }: VerificationDialogProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSendEmail = async () => {
    setLoading(true);
    setError("");
    setSuccess(false);
    
    try {
      await sendVerificationEmail();
      setSuccess(true);
      // Don't auto-close so they can see success message
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation finishes
    setTimeout(() => {
      setSuccess(false);
      setError("");
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-blue-600" />
            Verify Your Email
          </DialogTitle>
          <DialogDescription>
            We will send a secure verification link to your email address. It will expire in 24 hours.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {success ? (
            <Alert className="bg-green-50 border-green-200 text-green-800">
              <CheckCircle2 className="h-4 w-4 stroke-green-600" />
              <AlertDescription className="ml-2 font-medium">
                Verification email sent successfully! Please check your inbox and spam folders.
              </AlertDescription>
            </Alert>
          ) : error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="ml-2">
                {error}
              </AlertDescription>
            </Alert>
          ) : (
            <p className="text-sm text-muted-foreground">
              By verifying your email, you prove that you are not a robot and unlock all advanced AI features.
            </p>
          )}
        </div>

        <DialogFooter className="sm:justify-end">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          {!success && (
            <Button onClick={handleSendEmail} disabled={loading} className="gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Verification Link
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
