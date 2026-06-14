import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center px-4 md:px-8 mx-auto">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <BrainCircuit className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              AI Job Finder
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium hidden md:flex">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search placeholder if needed */}
          </div>
          <nav className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:flex">Login</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" className="hidden sm:flex">Register</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
