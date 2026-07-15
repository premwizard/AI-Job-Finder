"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial, Line, Html } from "@react-three/drei";
import * as THREE from "three";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Space_Grotesk, Inter } from "next/font/google";
import { Search, ArrowRight, MousePointer2 } from "lucide-react";

// --- Fonts ---
const space = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

// --- Design Tokens ---
const TOKENS = {
  bg: "#0A0B0F",
  primary: "#E8F4FF", // electric cyan-white
  secondary: "#F2B84B", // warm gold
  text: "#B8BCC8", // soft grey
};

// --- Utilities ---
const randomRange = (min: number, max: number) => Math.random() * (max - min) + min;

// --- 3D Components ---

// Starfield with parallax and clustering
const Starfield = ({ scrollProgress }: { scrollProgress: number }) => {
  const ref = useRef<THREE.Points>(null!);
  const count = 1500;
  
  const [positions, targetPositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Random sphere distribution
      const r = 20 * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // Group into 3 clusters for scroll animation
      const cluster = i % 3;
      const cx = cluster === 0 ? -10 : cluster === 1 ? 10 : 0;
      const cy = cluster === 0 ? 5 : cluster === 1 ? -5 : 10;
      const cz = cluster === 0 ? -5 : cluster === 1 ? -5 : -15;

      const clusterSpread = 8;
      target[i * 3] = cx + (Math.random() - 0.5) * clusterSpread;
      target[i * 3 + 1] = cy + (Math.random() - 0.5) * clusterSpread;
      target[i * 3 + 2] = cz + (Math.random() - 0.5) * clusterSpread;
    }
    return [pos, target];
  }, []);

  const currentPositions = useRef(new Float32Array(positions));

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Gentle rotation
    ref.current.rotation.y += delta * 0.05;
    
    // Mouse parallax
    const targetX = (state.mouse.x * 2);
    const targetY = (state.mouse.y * 2);
    ref.current.position.x += (targetX - ref.current.position.x) * 0.02;
    ref.current.position.y += (targetY - ref.current.position.y) * 0.02;

    // Clustering based on scroll (only applies if scroll is between 0.2 and 0.8)
    const geometry = ref.current.geometry;
    const positionsAttr = geometry.attributes.position;
    
    const targetMix = Math.max(0, Math.min(1, (scrollProgress - 0.2) * 2));
    
    for (let i = 0; i < count * 3; i++) {
      const orig = positions[i];
      const targ = targetPositions[i];
      // Lerp between original random and clustered
      const mixed = orig + (targ - orig) * targetMix;
      // Smoothly move current to mixed
      currentPositions.current[i] += (mixed - currentPositions.current[i]) * 0.05;
      positionsAttr.array[i] = currentPositions.current[i];
    }
    
    positionsAttr.needsUpdate = true;
  });

  return (
    <Points ref={ref} positions={currentPositions.current} stride={3} frustumCulled={false}>
      <PointMaterial transparent color={TOKENS.text} size={0.03} sizeAttenuation={true} depthWrite={false} opacity={0.4} />
    </Points>
  );
};

const ConnectionLines = ({ active, scrollProgress }: { active: boolean, scrollProgress: number }) => {
  const [matchNodes] = useState(() => [
    new THREE.Vector3(3, 2, -2),
    new THREE.Vector3(-4, 1.5, -1),
    new THREE.Vector3(2, -3, 1),
    new THREE.Vector3(-3, -2, -3),
    new THREE.Vector3(0, 4, -4),
  ]);

  const center = new THREE.Vector3(0, 0, 0);
  
  // Opacity driven by either the active state (typing) or final scroll state (payoff CTA)
  const isFinalPayoff = scrollProgress > 0.85;
  const targetOpacity = (active || isFinalPayoff) ? 0.8 : 0;
  const [opacity, setOpacity] = useState(0);

  useFrame(() => {
    setOpacity((prev) => prev + (targetOpacity - prev) * 0.05);
  });

  return (
    <group>
      {/* The "You" Node */}
      <mesh position={center}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color={TOKENS.primary} />
        {/* Simple glow */}
        <pointLight color={TOKENS.primary} intensity={2} distance={5} />
      </mesh>

      {/* Connection Lines and Match Nodes */}
      {matchNodes.map((node, i) => (
        <group key={i}>
          <Line
            points={[center, node]}
            color={TOKENS.secondary}
            lineWidth={1.5}
            transparent
            opacity={opacity}
          />
          <mesh position={node}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshBasicMaterial color={TOKENS.secondary} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

const Scene = ({ scrollProgress, inputFocused }: { scrollProgress: number, inputFocused: boolean }) => {
  return (
    <>
      <color attach="background" args={[TOKENS.bg]} />
      <ambientLight intensity={0.5} />
      <Starfield scrollProgress={scrollProgress} />
      <ConnectionLines active={inputFocused} scrollProgress={scrollProgress} />
      {/* Fog for depth */}
      <fog attach="fog" args={[TOKENS.bg, 5, 25]} />
    </>
  );
};

// --- UI Components ---

const MagneticButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = buttonRef.current!.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.2;
    const y = (clientY - (top + height / 2)) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative overflow-hidden px-8 py-4 bg-transparent border border-white/20 font-medium tracking-wide hover:bg-white/5 transition-colors duration-300 ${inter.className}`}
      style={{ borderRadius: "2px", color: TOKENS.primary }}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
      </span>
      {/* Subtle glow on hover */}
      <div 
        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500" 
        style={{ background: `linear-gradient(to right, transparent, ${TOKENS.primary}1A, transparent)` }}
      />
    </motion.button>
  );
};

const RoleCard = ({ title, company, matchScore, index }: { title: string, company: string, matchScore: number, index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true, margin: "-100px" }}
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: -5 }}
      style={{ transformStyle: "preserve-3d" }}
      className="p-6 bg-white/[0.03] border border-white/10 flex flex-col justify-between h-48 cursor-pointer relative overflow-hidden backdrop-blur-md"
    >
      <div className="absolute top-0 right-0 p-4">
        <div 
          className="text-xs font-bold px-2 py-1 rounded-sm"
          style={{ color: TOKENS.secondary, backgroundColor: `${TOKENS.secondary}1A` }}
        >
          {matchScore}% MATCH
        </div>
      </div>
      <div>
        <h4 className={`text-lg font-semibold mb-1 ${space.className}`} style={{ color: TOKENS.primary }}>{title}</h4>
        <p className={`text-sm ${inter.className}`} style={{ color: TOKENS.text }}>{company}</p>
      </div>
      <div className="flex items-center text-xs text-white/50 group-hover:text-white transition-colors mt-4">
        View details <ArrowRight className="w-3 h-3 ml-1" />
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function ConstellationLandingPage() {
  const [inputFocused, setInputFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const { scrollYProgress } = useScroll();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen to scroll to pass into R3F scene
    const unsubscribe = scrollYProgress.on("change", (v) => setProgress(v));
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <div className={`relative w-full min-h-screen overflow-x-hidden selection:bg-white/10`} style={{ backgroundColor: TOKENS.bg, color: 'white' }}>
      
      {/* 3D Background Canvas */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {prefersReducedMotion ? (
          // Static fallback for reduced motion / mobile
          <div className="absolute inset-0 bg-black opacity-50" />
        ) : (
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
            <Scene scrollProgress={progress} inputFocused={inputFocused} />
          </Canvas>
        )}
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        
        {/* --- 1. HERO --- */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 md:px-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl"
          >
            <h1 className={`text-5xl md:text-7xl font-bold tracking-tight mb-6 ${space.className}`} style={{ color: TOKENS.primary }}>
              Your next role is already out there.<br />
              <span className="text-white/60">We just draw the line to it.</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-12 max-w-2xl mx-auto ${inter.className}`} style={{ color: TOKENS.text }}>
              Find your exact match without the noise. Paste your skills and let the constellation form.
            </p>

            <div className="relative max-w-xl mx-auto flex items-center mb-12">
              <Search className={`absolute left-4 w-5 h-5`} style={{ color: TOKENS.text }} />
              <input 
                type="text" 
                placeholder="Paste your role or skills..." 
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                className={`w-full bg-white/5 border border-white/20 py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none transition-colors ${inter.className}`}
                style={{ borderRadius: "2px" }}
              />
              <div className="absolute right-2 pointer-events-auto">
                <MagneticButton onClick={() => setInputFocused(true)}>Find my matches</MagneticButton>
              </div>
            </div>
          </motion.div>
        </section>

        {/* --- 2. HOW IT WORKS --- */}
        <section className="py-32 px-4 md:px-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <div className={`text-sm font-medium tracking-widest uppercase ${space.className}`} style={{ color: TOKENS.secondary }}>01</div>
              <h3 className={`text-3xl font-semibold ${space.className}`} style={{ color: TOKENS.primary }}>Understands you</h3>
              <p className={`${inter.className}`} style={{ color: TOKENS.text }}>
                We map your skills and trajectory into a unique signature.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <div className={`text-sm font-medium tracking-widest uppercase ${space.className}`} style={{ color: TOKENS.secondary }}>02</div>
              <h3 className={`text-3xl font-semibold ${space.className}`} style={{ color: TOKENS.primary }}>Scans everything</h3>
              <p className={`${inter.className}`} style={{ color: TOKENS.text }}>
                Our system analyzes thousands of open roles simultaneously across the starfield.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              <div className={`text-sm font-medium tracking-widest uppercase ${space.className}`} style={{ color: TOKENS.secondary }}>03</div>
              <h3 className={`text-3xl font-semibold ${space.className}`} style={{ color: TOKENS.primary }}>Draws the match</h3>
              <p className={`${inter.className}`} style={{ color: TOKENS.text }}>
                Direct connections are made to the roles that fit your exact configuration.
              </p>
            </motion.div>
          </div>
        </section>

        {/* --- 3. LIVE FEEL / PROOF --- */}
        <section className="py-32 px-4 border-y border-white/5 bg-black/20 backdrop-blur-sm pointer-events-none">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-around text-center gap-12">
            <div>
              <div className={`text-6xl font-bold mb-2 ${space.className}`} style={{ color: TOKENS.primary }}>142k+</div>
              <div className={`text-sm tracking-wider uppercase ${inter.className}`} style={{ color: TOKENS.text }}>Active Roles Indexed</div>
            </div>
            <div>
              <div className={`text-6xl font-bold mb-2 ${space.className}`} style={{ color: TOKENS.primary }}>94%</div>
              <div className={`text-sm tracking-wider uppercase ${inter.className}`} style={{ color: TOKENS.text }}>Interview Rate</div>
            </div>
            <div>
              <div className={`text-6xl font-bold mb-2 ${space.className}`} style={{ color: TOKENS.primary }}>8.5M</div>
              <div className={`text-sm tracking-wider uppercase ${inter.className}`} style={{ color: TOKENS.text }}>Connections Drawn</div>
            </div>
          </div>
        </section>

        {/* --- 4. ROLES SHOWCASE --- */}
        <section className="py-40 px-4 md:px-20 max-w-7xl mx-auto">
          <div className="mb-16 md:w-1/2 pointer-events-none">
            <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${space.className}`} style={{ color: TOKENS.primary }}>
              Matches forming right now.
            </h2>
            <p className={`text-lg ${inter.className}`} style={{ color: TOKENS.text }}>
              {/* API INTEGRATION POINT: Map real recent matches here */}
              See how our system connects candidates to top-tier roles instantly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ perspective: 1000 }}>
            <RoleCard title="Senior Backend Engineer" company="Stripe" matchScore={98} index={0} />
            <RoleCard title="Machine Learning Researcher" company="Anthropic" matchScore={95} index={1} />
            <RoleCard title="Product Designer" company="Linear" matchScore={92} index={2} />
            <RoleCard title="DevOps Architect" company="Vercel" matchScore={89} index={3} />
            <RoleCard title="Frontend Lead" company="Raycast" matchScore={97} index={4} />
            <RoleCard title="Data Scientist" company="OpenAI" matchScore={91} index={5} />
          </div>
        </section>

        {/* --- 5. FINAL CTA --- */}
        <section className="py-40 px-4 flex flex-col items-center justify-center text-center min-h-[70vh] pointer-events-none">
          <h2 className={`text-5xl md:text-6xl font-bold mb-8 ${space.className}`} style={{ color: TOKENS.primary }}>
            Ready to find your constellation?
          </h2>
          <div className="pointer-events-auto">
            <MagneticButton onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Connect your profile
            </MagneticButton>
          </div>
        </section>

      </div>
    </div>
  );
}
