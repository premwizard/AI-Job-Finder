import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/10 blur-[100px]" />
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2">
        <BrainCircuit className="h-6 w-6 text-primary" />
        <span className="font-bold">AI Job Finder</span>
      </Link>
      <div className="z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
