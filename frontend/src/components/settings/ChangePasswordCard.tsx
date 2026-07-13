"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Eye, EyeOff, Check, X } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { requestPasswordChange, verifyPasswordChange } from "@/features/settings/services/settings.api";
import { ChangePasswordOTPDialog } from "./ChangePasswordOTPDialog";
import { useAuthStore } from "@/store/auth";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((data) => data.newPassword !== data.currentPassword, {
  message: "New password cannot be the same as your current password",
  path: ["newPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export function ChangePasswordCard() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isRequesting, setIsRequesting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuthStore();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const { watch } = form;
  const newPassword = watch("newPassword");

  const checkRequirement = (regex: RegExp) => regex.test(newPassword || "");
  const requirements = [
    { label: "At least 8 characters", met: (newPassword || "").length >= 8 },
    { label: "Uppercase letter", met: checkRequirement(/[A-Z]/) },
    { label: "Lowercase letter", met: checkRequirement(/[a-z]/) },
    { label: "Number", met: checkRequirement(/[0-9]/) },
    { label: "Special character", met: checkRequirement(/[^A-Za-z0-9]/) },
  ];
  
  const strengthScore = requirements.filter(r => r.met).length;
  const getStrengthColor = () => {
    if (strengthScore === 0) return "bg-border";
    if (strengthScore <= 2) return "bg-red-500";
    if (strengthScore <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const onSubmit = async (data: PasswordFormValues) => {
    setIsRequesting(true);
    try {
      await requestPasswordChange({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });
      setShowDialog(true);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.detail || "Failed to request password change. Please try again.",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  const handleVerify = async (otp: string) => {
    try {
      await verifyPasswordChange({ otp });
      toast({
        title: "Success",
        description: "Your password has been changed successfully.",
      });
      setShowDialog(false);
      form.reset();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: error.response?.data?.detail || "Invalid code. Please try again.",
      });
      throw error; // Rethrow to let dialog handle loading state
    }
  };

  const handleResend = async () => {
    const data = form.getValues();
    try {
      await requestPasswordChange({
        current_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      });
      toast({
        title: "Code sent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.detail || "Failed to resend code.",
      });
      throw error;
    }
  };

  return (
    <>
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password to keep your account secure.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem className="max-w-md">
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showCurrentPassword ? "text" : "password"} 
                          placeholder="••••••••" 
                          {...field} 
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="max-w-md space-y-4 pt-2">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showNewPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Password Strength Meter */}
                      {newPassword && newPassword.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <div className="flex gap-1 h-1.5 w-full">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <div 
                                key={level} 
                                className={`h-full flex-1 rounded-full transition-colors ${
                                  level <= strengthScore ? getStrengthColor() : "bg-muted"
                                }`} 
                              />
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-xs">
                            {requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center gap-1.5">
                                {req.met ? (
                                  <Check className="h-3 w-3 text-green-500" />
                                ) : (
                                  <X className="h-3 w-3 text-muted-foreground/50" />
                                )}
                                <span className={req.met ? "text-foreground" : "text-muted-foreground"}>
                                  {req.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="••••••••" 
                            {...field} 
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                          )}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isRequesting || !form.formState.isValid}>
                {isRequesting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Requesting...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <ChangePasswordOTPDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onVerify={handleVerify}
        onResend={handleResend}
        email={user?.email}
      />
    </>
  );
}
