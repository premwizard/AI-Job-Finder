"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmail } from "@/features/auth/services/auth.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token provided.");
      return;
    }

    let isMounted = true;

    verifyEmail(token)
      .then(() => {
        if (!isMounted) return;
        setStatus("success");
        // Re-fetch user profile if authenticated to update is_verified state globally
        if (isAuthenticated) {
          refreshUser().catch(console.error);
        }
      })
      .catch((err: any) => {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage(
          err.response?.data?.detail || "This verification link is invalid or has expired."
        );
      });

    return () => {
      isMounted = false;
    };
  }, [token, isAuthenticated, refreshUser]);

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-center">
          Email Verification
        </CardTitle>
        <CardDescription className="text-center">
          {status === "loading" && "We are verifying your email address..."}
          {status === "success" && "Your email has been successfully verified."}
          {status === "error" && "Verification failed."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
        {status === "loading" && (
          <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
        )}
        
        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <Button className="w-full mt-4" onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </>
        )}
        
        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive" />
            <div className="text-center text-sm text-muted-foreground bg-destructive/10 p-3 rounded-md w-full">
              {errorMessage}
            </div>
            <div className="flex flex-col space-y-3 w-full mt-4">
              <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard to Resend
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500">
      <Suspense fallback={
        <Card className="w-full">
          <CardContent className="flex items-center justify-center p-10">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </CardContent>
        </Card>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}
