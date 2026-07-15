'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const stepsEl = stepsRef.current;
    if (!canvas || !container || !stepsEl) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas setup
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    // Data for constellation
    const nodes: {x: number, y: number, r: number, targetGroup: number}[] = [];
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: Math.random() * 2 + 1,
        targetGroup: Math.floor(Math.random() * 3), // 3 groups
      });
    }

    const state = { progress: 0 };

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      const p = state.progress; // 0 to 1

      nodes.forEach((node, i) => {
        // Calculate clustered position based on group
        const groupX = (window.innerWidth / 4) * (node.targetGroup + 1);
        const groupY = window.innerHeight / 2;
        
        // Interpolate between random and clustered based on scroll progress
        const currentX = node.x + (groupX - node.x) * p;
        const currentY = node.y + (groupY - node.y) * p;

        ctx.beginPath();
        ctx.arc(currentX, currentY, node.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 184, 75, ${0.3 + p * 0.7})`; // Fade in brightness
        ctx.fill();

        // Draw connections if highly progressed
        if (p > 0.5) {
          nodes.forEach((otherNode, j) => {
            if (i < j && node.targetGroup === otherNode.targetGroup) {
              const otherGroupX = (window.innerWidth / 4) * (otherNode.targetGroup + 1);
              const otherGroupY = window.innerHeight / 2;
              const otherCurrentX = otherNode.x + (otherGroupX - otherNode.x) * p;
              const otherCurrentY = otherNode.y + (otherGroupY - otherNode.y) * p;

              const dist = Math.hypot(currentX - otherCurrentX, currentY - otherCurrentY);
              if (dist < 100 * p) { // Connect nodes that are close
                ctx.beginPath();
                ctx.moveTo(currentX, currentY);
                ctx.lineTo(otherCurrentX, otherCurrentY);
                ctx.strokeStyle = `rgba(242, 184, 75, ${((100 * p - dist) / 100) * 0.5 * (p - 0.5) * 2})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });
        }
      });
    };

    // Initial draw
    draw();

    // GSAP ScrollTrigger
    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: '+=300%', // Pin for 3 viewport heights
      pin: true,
      scrub: 0.5,
      animation: gsap.to(state, {
        progress: 1,
        ease: 'none',
        onUpdate: draw
      })
    });

    // Step fading logic
    const stepElements = Array.from(stepsEl.children);
    stepElements.forEach((step, index) => {
      gsap.fromTo(step, 
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: container,
            start: `${index * 33}% top`,
            end: `${(index + 1) * 33}% top`,
            scrub: true,
          }
        }
      );
      
      // Fade out logic
      if (index < stepElements.length - 1) {
        gsap.to(step, {
          opacity: 0,
          y: -50,
          scrollTrigger: {
            trigger: container,
            start: `${(index + 0.8) * 33}% top`,
            end: `${(index + 1) * 33}% top`,
            scrub: true,
          }
        });
      }
    });

    return () => {
      window.removeEventListener('resize', resize);
      st.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-[#0A0B0F] overflow-hidden">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center pointer-events-none">
        <div ref={stepsRef} className="relative w-full max-w-4xl text-center">
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-[#E8F4FF] mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Understands you
            </h2>
            <p className="text-[#B8BCC8] text-lg">We map your unique trajectory—not just keywords.</p>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-[#E8F4FF] mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Scans everything
            </h2>
            <p className="text-[#B8BCC8] text-lg">Thousands of active roles processed in milliseconds.</p>
          </div>

          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-6 opacity-0">
            <h2 className="text-3xl md:text-5xl font-bold text-[#E8F4FF] mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
              Draws the match
            </h2>
            <p className="text-[#B8BCC8] text-lg">You only see the roles where you're a definitive fit.</p>
          </div>
          
        </div>
      </div>
    </section>
  );
}
