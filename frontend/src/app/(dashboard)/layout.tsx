"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import VerificationBanner from "@/components/auth/VerificationBanner";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, loading, user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    // Wait until loading finishes before deciding to redirect
    if (!loading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [loading, isAuthenticated, router]);

  // Show a loading spinner while auth state is being checked
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render dashboard content until authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm shrink-0">
          <h1 className="font-semibold text-lg hidden md:block">AI Career Assistant</h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {user?.first_name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <VerificationBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
