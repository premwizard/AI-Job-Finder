"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ChangePasswordOTPDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  email?: string;
}

export function ChangePasswordOTPDialog({
  open,
  onOpenChange,
  onVerify,
  onResend,
  email,
}: ChangePasswordOTPDialogProps) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (open && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [open, countdown]);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) { // eslint-disable-next-line react-hooks/set-state-in-effect
      setOtp("");
      setCountdown(60);
      setLoading(false);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return;
    
    setLoading(true);
    try {
      await onVerify(otp);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    await onResend();
    setCountdown(60);
  };

  return (
    <Dialog open={open} onOpenChange={loading ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Identity</DialogTitle>
          <DialogDescription>
            We sent a verification code to {email ? <span className="font-medium text-foreground">{email}</span> : "your registered email"}.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={loading}
              className="text-center text-lg tracking-widest font-mono"
              autoFocus
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={otp.length !== 6 || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Change Password"
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn&apos;t receive the code? </span>
              <button
                type="button"
                onClick={handleResend}
                disabled={countdown > 0 || loading}
                className="text-primary hover:underline font-medium disabled:text-muted-foreground disabled:hover:no-underline disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
