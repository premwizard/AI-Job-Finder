"use client";

import { useAuthStore } from "@/store/auth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loading = useAuthStore((state) => state.loading);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const router = useRouter();
  const pathname = usePathname();
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token && !isAuthenticated) {
        await refreshUser();
      }
      setIsInitializing(false);
    };
    initAuth();
  }, [token, isAuthenticated, refreshUser]);

  useEffect(() => {
    if (!isInitializing && !loading && !isAuthenticated) {
      router.push(`/login?redirect=${pathname}`);
    }
  }, [isInitializing, loading, isAuthenticated, router, pathname]);

  if (isInitializing || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
