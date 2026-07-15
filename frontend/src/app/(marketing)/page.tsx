import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { LiveProof } from './components/LiveProof';
import { RolesShowcase } from './components/RolesShowcase';
import { FinalCTA } from './components/FinalCTA';

export default function MarketingPage() {
  return (
    <main className="bg-[#0A0B0F] min-h-screen text-[#B8BCC8] overflow-hidden">
      <Hero />
      <HowItWorks />
      <LiveProof />
      <RolesShowcase />
      <FinalCTA />
    </main>
  );
}
