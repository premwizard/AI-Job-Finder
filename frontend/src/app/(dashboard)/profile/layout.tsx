"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  User, Briefcase, GraduationCap, Award, FolderGit2, FileText, 
  Settings2, Share2, Sparkles, BookOpen, LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProfileProgress } from "@/components/profile/ProfileProgress";

const NAV_ITEMS = [
  { href: "/profile", label: "Overview", icon: LayoutDashboard },
  { href: "/profile/personal", label: "Personal Info", icon: User },
  { href: "/profile/summary", label: "Professional Summary", icon: BookOpen },
  { href: "/profile/skills", label: "Skills", icon: Sparkles },
  { href: "/profile/experience", label: "Work Experience", icon: Briefcase },
  { href: "/profile/education", label: "Education", icon: GraduationCap },
  { href: "/profile/certifications", label: "Certifications", icon: Award },
  { href: "/profile/projects", label: "Projects", icon: FolderGit2 },
  { href: "/profile/resume", label: "Resume Center", icon: FileText },
  { href: "/profile/preferences", label: "Career Preferences", icon: Settings2 },
  { href: "/profile/social", label: "Social Profiles", icon: Share2 },
  { href: "/profile/ai", label: "AI Preferences", icon: Sparkles },
];

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Career Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your professional identity.
            </p>
          </div>
          
          <nav className="flex flex-col space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <ProfileProgress />
          <div className="bg-card border rounded-lg shadow-sm">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  );
}
