import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#7e7f83]/20 bg-white py-8 text-[#34312d]">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8 mx-auto">
        <div className="flex flex-col items-center gap-4 px-8 md:items-start md:gap-1 md:px-0">
          <div className="flex items-center gap-3">
            <BrainCircuit className="h-6 w-6 text-[#62466b]" />
            <span className="font-bold text-lg text-[#14110f]" style={{ fontFamily: 'var(--font-space-grotesk)' }}>Crown Atlas</span>
          </div>
          <p className="text-center text-sm text-[#7e7f83] md:text-left font-medium">
            Powered by Infinity Crown
          </p>
          <p className="text-center text-xs text-[#7e7f83] md:text-left">
            &copy; 2026 Infinity Crown. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-sm font-medium text-[#7e7f83]">
          <Link href="/about" className="hover:text-[#62466b] transition-colors underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#62466b] transition-colors underline-offset-4">
            Contact
          </Link>
          <Link href="/privacy" className="hover:text-[#62466b] transition-colors underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#62466b] transition-colors underline-offset-4">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
