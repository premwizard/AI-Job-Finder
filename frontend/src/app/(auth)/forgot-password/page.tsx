"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-form-hooks"; // wait, the project uses react-hook-form
import { useForm as useHookForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { forgotPassword } from "@/features/auth/services/auth.api";
import { BrainCircuit, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  const form = useHookForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  async function onSubmit(data: ForgotPasswordFormValues) {
    if (countdown > 0) return;
    
    setIsLoading(true);
    setError("");
    try {
      await forgotPassword(data);
      setIsSuccess(true);
      setCountdown(60);
    } catch (err: any) {
      setError(err.response?.data?.detail || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <BrainCircuit className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-base mt-2">
              Enter your email and we'll send you a recovery link and verification code.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="rounded-lg bg-green-50 p-4 text-green-800 border border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-green-900">Check your email</h4>
              </div>
              <p className="text-sm">
                We've sent a recovery link and verification code to your email address. 
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="name@example.com" 
                          type="email" 
                          autoComplete="email" 
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
                
                <Button type="submit" className="w-full" disabled={isLoading || countdown > 0}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {countdown > 0 ? `Resend available in ${countdown}s` : "Send Recovery Email"}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t p-4 bg-muted/20">
          <Link href="/login" className="flex items-center text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
