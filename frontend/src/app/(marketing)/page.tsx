import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { AboutSection } from './components/AboutSection';
import { LiveProof } from './components/LiveProof';
import { RolesShowcase } from './components/RolesShowcase';
import { FinalCTA } from './components/FinalCTA';

export default function MarketingPage() {
  return (
    <main className="bg-[#f3f3f4] min-h-screen text-[#34312d] overflow-hidden">
      <Hero />
      <HowItWorks />
      <AboutSection />
      <LiveProof />
      <RolesShowcase />
      <FinalCTA />
    </main>
  );
}
