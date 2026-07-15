'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function FinalCTA() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Magnetic button setup
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const buttonX = useSpring(useTransform(mouseX, [-40, 40], [-15, 15]), springConfig);
  const buttonY = useSpring(useTransform(mouseY, [-40, 40], [-15, 15]), springConfig);

  const handleMouseMoveButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    if (Math.abs(x) < 40 && Math.abs(y) < 40) {
      mouseX.set(x);
      mouseY.set(y);
    } else {
      mouseX.set(0);
      mouseY.set(0);
    }
  };

  const handleMouseLeaveButton = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    // Generate clustered nodes that are fully connected
    const nodes: {x: number, y: number, r: number, alpha: number}[] = [];
    const numNodes = window.innerWidth < 768 ? 80 : 150;
    
    // Central "you" node
    const userNode = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      r: 4,
      alpha: 1
    };

    for (let i = 0; i < numNodes; i++) {
      nodes.push({
        x: window.innerWidth / 2 + (Math.random() - 0.5) * window.innerWidth * 0.8,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * window.innerHeight * 0.8,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = (time: number) => {
      ctx.fillStyle = '#0A0B0F';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

      // Pulse
      const pulse = prefersReducedMotion ? 1 : 1 + Math.sin(time * 0.002) * 0.2;

      // Draw lines from user to nodes (fully connected)
      nodes.forEach(n => {
        const dist = Math.hypot(n.x - userNode.x, n.y - userNode.y);
        if (dist < 400) {
          ctx.beginPath();
          ctx.moveTo(userNode.x, userNode.y);
          ctx.lineTo(n.x, n.y);
          ctx.strokeStyle = `rgba(242, 184, 75, ${((400 - dist) / 400) * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Draw nodes
      nodes.forEach((n, i) => {
        const driftY = prefersReducedMotion ? 0 : Math.sin(time * 0.0005 + i) * 5;
        
        ctx.beginPath();
        ctx.arc(n.x, n.y + driftY, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 184, 75, ${n.alpha})`;
        ctx.fill();
      });

      // Draw user node
      ctx.beginPath();
      ctx.arc(userNode.x, userNode.y, userNode.r * pulse, 0, Math.PI * 2);
      ctx.fillStyle = '#E8F4FF';
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#E8F4FF';
      ctx.fill();
      ctx.shadowBlur = 0;

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
    };
  }, []);

  return (
    <section className="relative w-full h-screen bg-[#0A0B0F] overflow-hidden flex items-center justify-center">
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
      />
      
      <div className="z-10 flex flex-col items-center text-center px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold text-[#E8F4FF] mb-8"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          Your constellation awaits.
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.button
            ref={buttonRef}
            style={{ x: buttonX, y: buttonY }}
            onMouseMove={handleMouseMoveButton}
            onMouseLeave={handleMouseLeaveButton}
            className="bg-[#E8F4FF] text-[#0A0B0F] font-semibold px-8 py-4 text-lg rounded-sm hover:bg-white transition-colors shadow-[0_0_30px_rgba(232,244,255,0.3)]"
          >
            Find my matches
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
