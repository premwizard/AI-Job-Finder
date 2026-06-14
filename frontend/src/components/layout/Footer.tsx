import Link from "next/link";
import { BrainCircuit } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-8 mx-auto">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for modern job seekers. The AI Career Assistant you deserve.
          </p>
        </div>
        <div className="flex gap-4 text-sm font-medium text-muted-foreground">
          <Link href="/about" className="hover:underline underline-offset-4">
            About
          </Link>
          <Link href="/contact" className="hover:underline underline-offset-4">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline underline-offset-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:underline underline-offset-4">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
