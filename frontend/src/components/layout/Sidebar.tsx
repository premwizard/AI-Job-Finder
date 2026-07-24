"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Briefcase, 
  MessageSquare, 
  Target, 
  Users, 
  FileText, 
  FileSearch, 
  Bookmark,
  User,
  Settings,
  BrainCircuit,
  Sparkles,
  Database,
  LogOut,
  Server,
  Search,
  Building2
} from "lucide-react";

import { useAuthStore } from "@/store/auth";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Recommended Jobs", href: "/jobs/recommended", icon: Target },
  { name: "Jobs Explorer", href: "/jobs", icon: Briefcase },
  { name: "Job Analytics", href: "/jobs/analytics", icon: Sparkles },
  { name: "Vector Engine", href: "/jobs/embeddings", icon: Database },
  { name: "AI Chat", href: "/ai-chat", icon: MessageSquare },
  { name: "Skill Gap", href: "/profile/skill-gap", icon: Target },
  { name: "Interview Prep", href: "/interview", icon: Users },
  { name: "Cover Letters", href: "/cover-letter", icon: FileText },
  { name: "Resume", href: "/resume", icon: FileSearch },
  { name: "Saved Jobs", href: "/saved", icon: Bookmark },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
  { name: "Advanced Search", href: "/search", icon: Search },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Resume Optimizer", href: "/resume/optimizer", icon: FileSearch },
  { name: "Admin RAG", href: "/admin/rag", icon: Server },
];

import { useRestrictedFeature } from "@/hooks/useRestrictedFeature";
import VerificationDialog from "@/components/auth/VerificationDialog";
import { BadgeCheck, AlertCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { isVerified, setShowVerificationDialog, showVerificationDialog } = useRestrictedFeature();

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-card/50 backdrop-blur-sm sticky top-0">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-primary">
          <BrainCircuit className="h-6 w-6" />
          <span>AI Job Finder</span>
        </Link>
      </div>
      
      {user && (
        <div className="px-4 py-3 border-b border-border/50">
          <div className="text-sm font-medium truncate">{user.first_name} {user.last_name}</div>
          <div className="text-xs text-muted-foreground truncate mb-2">{user.email}</div>
          {isVerified ? (
            <div className="flex items-center text-xs font-medium text-green-600 dark:text-green-500">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" />
              Verified Account
            </div>
          ) : (
            <button 
              onClick={() => setShowVerificationDialog(true)}
              className="flex items-center text-xs font-medium text-amber-600 dark:text-amber-500 hover:underline cursor-pointer"
            >
              <AlertCircle className="mr-1 h-3.5 w-3.5" />
              Not Verified - Click to fix
            </button>
          )}
        </div>
      )}

      <div className="flex-1 overflow-auto py-4">
        <nav className="grid gap-1 px-2">
          {sidebarItems.map((item, index) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={index} href={item.href}>
                <span
                  className={cn(
                    "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "transparent"
                  )}
                >
                  <item.icon className={cn("mr-2 h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.name}</span>
                </span>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="border-t p-4">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
      <VerificationDialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog} />
    </div>
  );
}
