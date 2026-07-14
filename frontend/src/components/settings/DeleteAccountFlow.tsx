"use client";

import { useState, useEffect, useCallback } from "react";
import { Eye, EyeOff, AlertTriangle, Loader2, ShieldAlert, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/store/auth";
import {
  requestAccountDeletion,
  verifyDeletionOtp,
  executeAccountDeletion,
} from "@/features/settings/services/settings.api";

// Deletion flow steps
type Step =
  | "closed"
  | "warning"       // Step 1: Explain what will be deleted
  | "password"      // Step 2: Verify current password
  | "otp"           // Step 3: OTP verification
  | "confirm"       // Step 4: Type DELETE
  | "success";      // Step 5: Done

const WHAT_GETS_DELETED = [
  "Your profile and personal information",
  "All saved jobs",
  "All job applications and history",
  "Your uploaded resume",
  "AI chat and cover letter history",
  "Account preferences and settings",
];

export function DeleteAccountFlow() {
  const [step, setStep] = useState<Step>("closed");
  const [loading, setLoading] = useState(false);

  // Step 2 — Password
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Step 3 — OTP
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);

  // Step 4 — Confirm
  const [confirmText, setConfirmText] = useState("");

  const { toast } = useToast();
  const { logout } = useAuthStore();

  // OTP resend countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const resetAllState = useCallback(() => {
    setPassword("");
    setShowPassword(false);
    setPasswordError("");
    setOtp("");
    setCountdown(0);
    setConfirmText("");
    setLoading(false);
  }, []);

  const handleClose = useCallback(() => {
    if (step === "success") return; // block closing on success — auto-logout handles it
    resetAllState();
    setStep("closed");
  }, [step, resetAllState]);

  // ── Step 2: Submit password ──────────────────────────────────────────────
  const handlePasswordSubmit = async () => {
    if (!password) return;
    setLoading(true);
    setPasswordError("");
    try {
      await requestAccountDeletion(password);
      setStep("otp");
      setCountdown(60);
      toast({ title: "Code sent", description: "Check your email for the verification code." });
    } catch (err: any) {
      const detail = err.response?.data?.detail || "Failed to verify password. Please try again.";
      setPasswordError(detail);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Submit OTP ───────────────────────────────────────────────────
  const handleOtpSubmit = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await verifyDeletionOtp(otp);
      setStep("confirm");
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: err.response?.data?.detail || "Invalid code. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Resend OTP ───────────────────────────────────────────────────
  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setLoading(true);
    try {
      await requestAccountDeletion(password);
      setCountdown(60);
      setOtp("");
      toast({ title: "Code resent", description: "A new verification code has been sent." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.detail || "Failed to resend code.",
      });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 4: Execute deletion ─────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (confirmText !== "DELETE") return;
    setLoading(true);
    try {
      await executeAccountDeletion("DELETE");
      setStep("success");
      // Auto-logout after 3 seconds
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Deletion failed",
        description: err.response?.data?.detail || "An error occurred. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Card */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-xl border border-destructive/30 bg-destructive/5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-full bg-destructive/10 p-2 shrink-0">
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <div>
            <h4 className="font-semibold text-destructive">Delete Account</h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Permanently close your account and remove all associated data.
            </p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          className="shrink-0"
          onClick={() => setStep("warning")}
        >
          Delete My Account
        </Button>
      </div>

      {/* ── Step 1: Warning Dialog ── */}
      <Dialog open={step === "warning"} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-destructive mb-1">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-destructive">Delete Your Account?</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              This action is <strong>permanent and irreversible</strong>. Deleting your account will remove:
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-2 my-2">
            {WHAT_GETS_DELETED.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm font-medium text-destructive">You will not be able to undo this.</p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => setStep("password")}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Step 2: Password Dialog ── */}
      <Dialog open={step === "password"} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="h-5 w-5 text-destructive" />
              <DialogTitle>Confirm Your Identity</DialogTitle>
            </div>
            <DialogDescription>
              Enter your current password to proceed with account deletion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-2">
            <Label htmlFor="delete-password">Current Password</Label>
            <div className="relative">
              <Input
                id="delete-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                disabled={loading}
                className={passwordError ? "border-destructive" : ""}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordError && (
              <p className="text-sm text-destructive font-medium">{passwordError}</p>
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handlePasswordSubmit}
              disabled={loading || !password}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Continue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Step 3: OTP Dialog ── */}
      <Dialog open={step === "otp"} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <DialogTitle>Verify Your Email</DialogTitle>
            </div>
            <DialogDescription>
              We sent a 6-digit verification code to your registered email. Enter it below to continue.
              The code expires in <strong>10 minutes</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-2">
            <Label htmlFor="delete-otp">Verification Code</Label>
            <Input
              id="delete-otp"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              disabled={loading}
              className="text-center text-xl tracking-widest font-mono"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleOtpSubmit()}
            />
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Didn&apos;t receive it? </span>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={countdown > 0 || loading}
                className="text-primary hover:underline font-medium disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
              >
                {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
              </button>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleOtpSubmit}
              disabled={loading || otp.length !== 6}
            >
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Step 4: Type DELETE Confirmation ── */}
      <Dialog open={step === "confirm"} onOpenChange={(open) => { if (!open) handleClose(); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1 text-destructive">
              <Trash2 className="h-5 w-5" />
              <DialogTitle className="text-destructive">Final Confirmation</DialogTitle>
            </div>
            <DialogDescription className="text-left">
              This is your last chance. Once confirmed, your account and all associated data will be
              permanently removed and cannot be recovered.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 my-2">
            <Label htmlFor="delete-confirm">
              Type <span className="font-mono font-bold text-destructive">DELETE</span> to confirm
            </Label>
            <Input
              id="delete-confirm"
              placeholder="DELETE"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={loading}
              className={`font-mono font-bold tracking-widest ${confirmText === "DELETE" ? "border-destructive" : ""}`}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && confirmText === "DELETE" && handleDeleteConfirm()}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={loading || confirmText !== "DELETE"}
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Deleting Account...</>
              ) : (
                "Permanently Delete Account"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Step 5: Success Dialog ── */}
      <Dialog open={step === "success"} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Account Deleted</DialogTitle>
            <DialogDescription className="text-center space-y-2 pt-2">
              <span className="block text-5xl mb-4">👋</span>
              <span className="block">
                Your account has been successfully deleted. All your data has been removed.
              </span>
              <span className="block text-sm text-muted-foreground mt-2">
                You will be signed out automatically in a moment...
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
