"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { verifyResetToken, resetPassword } from "@/features/auth/services/auth.api";
import { useAuthStore } from "@/store/auth";
import { BrainCircuit, Loader2, CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const resetPasswordSchema = z.object({
  otp: z.string().length(6, "Verification code must be exactly 6 digits"),
  new_password: passwordSchema,
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const logout = useAuthStore((state) => state.logout);
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useHookForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", new_password: "", confirm_password: "" },
  });

  const passwordValue = form.watch("new_password");

  // Basic password strength meter calculation
  const calculateStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };
  
  const strengthScore = calculateStrength(passwordValue);
  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-slate-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-amber-500";
    if (score <= 4) return "bg-emerald-400";
    return "bg-emerald-600";
  };

  useEffect(() => {
    async function checkToken() {
      if (!token) {
        setIsVerifying(false);
        return;
      }
      try {
        const res = await verifyResetToken(token);
        if (res.valid) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
        }
      } catch (err) {
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    }
    checkToken();
  }, [token]);

  async function onSubmit(data: ResetPasswordFormValues) {
    if (!token) return;
    
    setIsLoading(true);
    setError("");
    try {
      await resetPassword({
        token,
        otp: data.otp,
        new_password: data.new_password,
        confirm_password: data.confirm_password,
      });
      // Invalidate current session
      await logout();
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Verifying secure link...</p>
        </div>
      </div>
    );
  }

  if (!token || !tokenValid) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-destructive">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <XCircle className="h-10 w-10 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-destructive">Link Expired or Invalid</CardTitle>
            <CardDescription className="text-base mt-2">
              This password reset link is invalid or has expired. For your security, reset links are only valid for 10 minutes and can only be used once.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild className="w-full">
              <Link href="/forgot-password">Request New Link</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <BrainCircuit className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create New Password</CardTitle>
            <CardDescription className="text-sm mt-2">
              Enter the 6-digit verification code sent to your email along with your new password.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <CheckCircle2 className="h-16 w-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Password Changed Successfully!</h3>
                <p className="mt-2 text-muted-foreground text-sm">
                  Your password has been updated and all active sessions have been signed out. 
                  Please sign in with your new password.
                </p>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>6-Digit Verification Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="000000" 
                          maxLength={6}
                          className="text-center tracking-[0.5em] font-mono text-lg"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </FormControl>
                      
                      {/* Password Strength Indicator */}
                      <div className="flex gap-1 h-1.5 mt-2 mb-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div 
                            key={level} 
                            className={cn(
                              "h-full flex-1 rounded-full transition-colors duration-300",
                              strengthScore >= level ? getStrengthColor(strengthScore) : "bg-slate-200 dark:bg-slate-700"
                            )}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2">
                        Must contain 8+ characters, uppercase, lowercase, number, and special character.
                      </p>
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {error && (
                  <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium text-center">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Change Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
