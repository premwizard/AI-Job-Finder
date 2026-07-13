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
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";
import { AuthLayout } from "@/components/auth/AuthLayout";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((state) => state.login);
  const checkAuthentication = useAuthStore((state) => state.checkAuthentication);
  const loading = useAuthStore((state) => state.loading);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle social auth redirect
    const urlError = searchParams.get("error");
    if (urlError) {
      setError(urlError);
    }
    
    const accessToken = searchParams.get("access_token");
    if (accessToken) {
      // Set the token and check auth which will fetch user and update store
      localStorage.setItem("auth_token", accessToken);
      checkAuthentication().then(() => {
        router.replace("/dashboard");
      });
    }
  }, [searchParams, checkAuthentication, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Invalid email or password.");
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        <div className="flex flex-col space-y-2 text-center mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/10 rounded-md animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                className="h-11 transition-all focus-visible:ring-blue-500"
                {...register("email")} 
              />
              {errors.email && <p className="text-xs text-destructive animate-in fade-in">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 hover:underline transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-11 pr-10 transition-all focus-visible:ring-blue-500"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive animate-in fade-in">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="rememberMe"
              className="h-4 w-4 rounded border-input text-blue-600 focus:ring-blue-500 bg-background accent-blue-600 cursor-pointer"
              {...register("rememberMe")}
            />
            <Label htmlFor="rememberMe" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
              Remember me for 30 days
            </Label>
          </div>

          <Button type="submit" className="w-full h-11 text-base font-medium shadow-sm transition-all hover:shadow-md" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
            Sign In
          </Button>
        </form>

        <div className="mt-6">
          <SocialAuthButtons />
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/register" className="font-medium text-foreground hover:text-blue-600 hover:underline transition-colors">
            Create account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
