"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Check, X } from "lucide-react";

const registerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const calculateStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 7) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strength = calculateStrength(passwordValue);
  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    try {
      await register({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        confirm_password: data.confirm_password,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "An error occurred during registration.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details to get started with AI Job Finder
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input 
                  id="first_name" 
                  className="h-11 transition-all focus-visible:ring-blue-500"
                  placeholder="John"
                  {...registerField("first_name")} 
                />
                {errors.first_name && <p className="text-xs text-destructive animate-in fade-in">{errors.first_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input 
                  id="last_name" 
                  className="h-11 transition-all focus-visible:ring-blue-500"
                  placeholder="Doe"
                  {...registerField("last_name")} 
                />
                {errors.last_name && <p className="text-xs text-destructive animate-in fade-in">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="h-11 transition-all focus-visible:ring-blue-500"
                {...registerField("email")} 
              />
              {errors.email && <p className="text-xs text-destructive animate-in fade-in">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-11 pr-10 transition-all focus-visible:ring-blue-500"
                  {...registerField("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              
              {/* Strength Indicator */}
              {passwordValue && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <div className="flex gap-1 mt-2">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 w-full rounded-full transition-all duration-300 ${
                          i < strength ? getStrengthColor() : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Requirements Checklist */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      {passwordValue.length >= 8 ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                      <span className={passwordValue.length >= 8 ? "text-foreground" : ""}>8+ characters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/[A-Z]/.test(passwordValue) ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                      <span className={/[A-Z]/.test(passwordValue) ? "text-foreground" : ""}>Uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/[a-z]/.test(passwordValue) ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                      <span className={/[a-z]/.test(passwordValue) ? "text-foreground" : ""}>Lowercase letter</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {/[0-9]/.test(passwordValue) ? <Check className="w-3 h-3 text-green-500" /> : <X className="w-3 h-3 text-muted-foreground" />}
                      <span className={/[0-9]/.test(passwordValue) ? "text-foreground" : ""}>Number</span>
                    </div>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive animate-in fade-in">{errors.password.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type={showPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className="h-11 transition-all focus-visible:ring-blue-500"
                {...registerField("confirm_password")}
              />
              {errors.confirm_password && <p className="text-xs text-destructive animate-in fade-in">{errors.confirm_password.message}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Create Account
          </Button>
        </form>

        <div className="mt-6">
          <SocialAuthButtons />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-foreground hover:text-blue-600 hover:underline transition-colors">
            Sign In
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
