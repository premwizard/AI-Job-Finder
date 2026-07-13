"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { AuthBackground } from "./AuthBackground";
import { ShieldCheck, Sparkles, BrainCircuit } from "lucide-react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-background flex-col lg:flex-row">
      {/* Left Panel: Branding & Marketing (Hidden on smaller screens, shown on desktop) */}
      <div className="relative hidden lg:flex flex-col justify-between w-1/2 p-12 text-white overflow-hidden bg-zinc-950">
        <AuthBackground />
        
        {/* Content overlaid on background */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 shadow-lg shadow-blue-600/20">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AI Job Finder</span>
          </div>

          {/* Main Marketing Copy */}
          <div className="mt-auto mb-auto max-w-lg space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
              Find Your Next AI Career Opportunity.
            </h1>
            <p className="text-lg text-zinc-300 font-medium leading-relaxed">
              Powered by intelligent job matching, resume analysis, and automated career assistance.
            </p>
            
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center overflow-hidden">
                    <img 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}&backgroundColor=b6e3f4`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium text-zinc-300">
                Join <span className="text-white font-semibold">10,000+</span> engineers.
              </div>
            </div>
          </div>

          {/* Trust indicator footer */}
          <div className="mt-auto pt-12 flex items-center gap-6 text-sm font-medium text-zinc-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Enterprise-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              <span>AI-Powered Matching</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Authentication Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 lg:p-24 relative bg-background">
        
        {/* Mobile Header (Only visible when Left Panel is hidden) */}
        <div className="lg:hidden flex items-center gap-2 absolute top-8 left-8">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">AI Job Finder</span>
        </div>

        {/* Form Container with Entrance Animation */}
        <div className="w-full max-w-[440px] animate-in fade-in zoom-in-95 duration-500 slide-in-from-bottom-4">
          {children}
        </div>
        
        {/* Footer Links (Anchored to bottom) */}
        <div className="absolute bottom-8 flex items-center justify-center gap-4 text-xs text-muted-foreground w-full">
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <span>&middot;</span>
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <span>&middot;</span>
          <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
        </div>
      </div>
    </div>
  );
}
