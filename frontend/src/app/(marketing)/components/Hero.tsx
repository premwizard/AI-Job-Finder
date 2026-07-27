'use client';

import React, { useEffect, useRef, useState, FormEvent } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  alpha: number;
}

interface ConstellationLine {
  target: Particle;
  progress: number;
}

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isAnimatingLines, setIsAnimatingLines] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let lines: ConstellationLine[] = [];
    
    // Check reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Mouse tracking for parallax
    let mx = 0;
    let my = 0;
    let targetMx = 0;
    let targetMy = 0;

    const handleMouseMoveCanvas = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      targetMx = (e.clientX / window.innerWidth) * 2 - 1;
      targetMy = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMoveCanvas);

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initParticles();
    };

    let userParticle: Particle;

    const initParticles = () => {
      particles = [];
      const numParticles = window.innerWidth < 768 ? 100 : 200;
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          z: Math.random(), // 0 to 1
          baseRadius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.5 + 0.1,
        });
      }

      // The "You" particle, centered initially
      userParticle = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        z: 0.9,
        baseRadius: 4,
        alpha: 1,
      };
      
      lines = [];
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = (time: number) => {
      ctx.fillStyle = '#f3f3f4';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Smooth parallax interpolation
      if (!prefersReducedMotion) {
        mx += (targetMx - mx) * 0.05;
        my += (targetMy - my) * 0.05;
      }

      // Draw normal particles
      particles.forEach((p, i) => {
        // Ambient drift + Parallax
        const driftX = prefersReducedMotion ? 0 : Math.sin(time * 0.0005 + i) * 10 * p.z;
        const driftY = prefersReducedMotion ? 0 : Math.cos(time * 0.0005 + i) * 10 * p.z;
        
        const parallaxX = mx * 100 * p.z;
        const parallaxY = my * 100 * p.z;

        const finalX = p.x + driftX + parallaxX;
        const finalY = p.y + driftY + parallaxY;

        ctx.beginPath();
        ctx.arc(finalX, finalY, p.baseRadius * (1 + p.z * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(98, 70, 107, ${p.alpha * (0.3 + p.z * 0.4)})`; // Vintage Grape highlight on light background
        ctx.fill();
        
        // Store computed position for lines
        (p as any)._cx = finalX;
        (p as any)._cy = finalY;
      });

      // Draw User Particle
      const userPx = userParticle.x + mx * 100 * userParticle.z;
      const userPy = userParticle.y + my * 100 * userParticle.z;
      
      // Pulse effect
      const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(time * 0.003) * 0.3;
      
      ctx.beginPath();
      ctx.arc(userPx, userPy, userParticle.baseRadius * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#62466b';
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#7a5a85';
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // Draw Lines
      if (lines.length > 0) {
        lines.forEach(line => {
          if (line.progress < 1 && !prefersReducedMotion) {
            line.progress += 0.02; // Animate stroke
          } else if (prefersReducedMotion) {
            line.progress = 1;
          }
          
          const targetX = (line.target as any)._cx;
          const targetY = (line.target as any)._cy;
          
          const currentX = userPx + (targetX - userPx) * Math.min(line.progress, 1);
          const currentY = userPy + (targetY - userPy) * Math.min(line.progress, 1);
          
          ctx.beginPath();
          ctx.moveTo(userPx, userPy);
          ctx.lineTo(currentX, currentY);
          ctx.strokeStyle = `rgba(98, 70, 107, ${0.4 * line.progress})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      if ((window as any).__startConstellation) {
        (window as any).__startConstellation = false;
        
        // Pick 5 random particles nearby
        const sorted = [...particles].sort((a, b) => {
          const distA = Math.hypot(a.x - userParticle.x, a.y - userParticle.y);
          const distB = Math.hypot(b.x - userParticle.x, b.y - userParticle.y);
          return distA - distB;
        });
        
        lines = sorted.slice(0, 5).map(p => ({ target: p, progress: 0 }));
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    if (!prefersReducedMotion) {
      animationFrameId = requestAnimationFrame(draw);
    } else {
      draw(0);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMoveCanvas);
    };
  }, []);


  return (
    <section ref={containerRef} className="relative w-full h-screen overflow-hidden bg-[#f3f3f4] flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-0"
      />
      
      <div className="z-10 flex flex-col items-center text-center max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 inline-flex items-center rounded-full border border-[#7e7f83]/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-[#62466b] backdrop-blur-sm"
        >
          ✨ Powered by Infinity Crown
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-[#14110f] tracking-tight mb-6"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Navigate Your Career with AI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-[#7e7f83] mb-10 max-w-3xl font-normal leading-relaxed"
        >
          Crown Atlas is an AI-powered career intelligence platform that helps you discover jobs, optimize resumes, prepare for interviews, analyze companies, and make smarter career decisions—all from one intelligent workspace.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <a
            href="/register"
            className="inline-flex items-center justify-center bg-[#62466b] hover:bg-[#7a5a85] text-[#f3f3f4] font-semibold px-8 py-4 rounded-md transition-colors shadow-[0_4px_20px_rgba(98,70,107,0.3)] focus:outline-none focus:ring-2 focus:ring-[#62466b] focus:ring-offset-2 focus:ring-offset-[#f3f3f4] text-lg"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="inline-flex items-center justify-center bg-white border border-[#7e7f83]/30 text-[#34312d] hover:bg-[#f3f3f4] font-semibold px-8 py-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#7e7f83] focus:ring-offset-2 focus:ring-offset-[#f3f3f4] text-lg"
          >
            Explore Features
          </a>
        </motion.div>
      </div>
    </section>
  );
}
