import { Sidebar } from "@/components/layout/Sidebar";
import VerificationBanner from "@/components/auth/VerificationBanner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* We can add a top header here later if needed, e.g., for mobile menu toggle or user profile */}
        <header className="h-14 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm shrink-0">
          <h1 className="font-semibold text-lg hidden md:block">AI Career Assistant</h1>
          <div className="flex items-center gap-4">
            {/* Notification bell or user avatar */}
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              J
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
