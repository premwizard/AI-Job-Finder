import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#7e7f83]/20 bg-white/90 backdrop-blur-md shadow-xs">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-8 mx-auto justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2.5">
            <BrainCircuit className="h-6 w-6 text-[#62466b]" />
            <span className="font-bold text-lg text-[#14110f] tracking-tight">
              AI Job Finder
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="text-[#7e7f83] hover:text-[#62466b] transition-colors duration-200"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-[#7e7f83] hover:text-[#62466b] transition-colors duration-200"
            >
              How It Works
            </Link>
            <Link
              href="#pricing"
              className="text-[#7e7f83] hover:text-[#62466b] transition-colors duration-200"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:flex text-[#34312d] hover:bg-[#f3f3f4] hover:text-[#14110f]">Login</Button>
          </Link>
          <Link href="/register">
            <Button variant="outline" className="hidden sm:flex border-[#7e7f83]/30 text-[#34312d] hover:bg-[#f3f3f4]">Register</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#62466b] hover:bg-[#7a5a85] text-[#f3f3f4] font-semibold transition-all duration-300 shadow-md">Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
