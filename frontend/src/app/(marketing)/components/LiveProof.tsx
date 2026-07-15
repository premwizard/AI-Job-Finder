'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const STATIC_NODES = [
  { id: 1, x: 150, y: 100, label: 'Senior Backend', match: 85 },
  { id: 2, x: 400, y: 50, label: 'ML Engineer', match: 92 },
  { id: 3, x: 600, y: 200, label: 'Tech Lead', match: 78 },
  { id: 4, x: 100, y: 300, label: 'Data Scientist', match: 65 },
  { id: 5, x: 500, y: 350, label: 'Full Stack', match: 88 },
];

export function LiveProof() {
  const containerRef = useRef<HTMLDivElement>(null);
  const userX = useMotionValue(300);
  const userY = useMotionValue(200);
  const [nodes, setNodes] = useState(STATIC_NODES);
  const [windowWidth, setWindowWidth] = useState(1000);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust nodes based on window width to keep them centered/responsive
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scaledNodes = STATIC_NODES.map(n => ({
        ...n,
        x: (n.x / 800) * rect.width,
        y: (n.y / 500) * rect.height,
      }));
      setNodes(scaledNodes);
      userX.set(rect.width / 2);
      userY.set(rect.height / 2);
    }
  }, [windowWidth, userX, userY]);

  // Using a separate SVG for lines
  const [lines, setLines] = useState<{ id: number, x: number, y: number, opacity: number }[]>([]);

  useEffect(() => {
    const updateLines = () => {
      const ux = userX.get();
      const uy = userY.get();
      
      const newLines = nodes.map(node => {
        const dist = Math.hypot(node.x - ux, node.y - uy);
        // Max distance for connection is ~300px
        const maxDist = 300;
        let opacity = 0;
        if (dist < maxDist) {
          opacity = 1 - (dist / maxDist);
        }
        return {
          id: node.id,
          x: node.x,
          y: node.y,
          opacity: opacity * (node.match / 100) // Factor in base match score
        };
      });
      setLines(newLines);
    };

    const unsubscribeX = userX.on('change', updateLines);
    const unsubscribeY = userY.on('change', updateLines);
    
    updateLines(); // Initial update
    
    return () => {
      unsubscribeX();
      unsubscribeY();
    };
  }, [nodes, userX, userY]);

  return (
    <section className="w-full py-32 bg-[#0A0B0F] flex flex-col items-center">
      <div className="max-w-4xl w-full px-6 text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-[#E8F4FF] mb-6" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
          Real-time Match Strength
        </h2>
        <p className="text-[#B8BCC8] text-lg">
          Move your profile node to see how distance to required skills dynamically calculates your fit.
        </p>
      </div>

      <div 
        ref={containerRef}
        className="relative w-full max-w-4xl h-[500px] border border-white/5 rounded-xl bg-[#0A0B0F]/50 overflow-hidden mx-6"
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {lines.map(line => {
            // Read current value via state, it's ok for react re-renders on drag if performance holds.
            // For true 60fps, we'd use a canvas or framer-motion svg paths, but this is lightweight enough.
            // Actually, to avoid react re-renders on drag, we can use framer motion SVG lines
            return null; 
          })}
        </svg>

        {/* Framer motion SVG for 60fps lines without re-renders */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {nodes.map(node => {
            // We can't easily use useTransform for path d attribute with multiple inputs in standard React.
            // Let's use a specialized component or just rely on state (at 5 nodes, state update is fine).
            return (
              <MotionLine 
                key={node.id} 
                node={node} 
                userX={userX} 
                userY={userY} 
              />
            );
          })}
        </svg>

        {/* Static Roles */}
        {nodes.map(node => (
          <div 
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: node.x, top: node.y }}
          >
            <div className="w-3 h-3 rounded-full bg-[#F2B84B] shadow-[0_0_15px_rgba(242,184,75,0.6)] mb-2" />
            <span className="text-xs text-[#B8BCC8] font-medium whitespace-nowrap bg-black/50 px-2 py-1 rounded">
              {node.label}
            </span>
          </div>
        ))}

        {/* Draggable User Node */}
        <motion.div
          drag
          dragConstraints={containerRef}
          dragElastic={0.1}
          dragMomentum={false}
          style={{ x: userX, y: userY }}
          className="absolute top-0 left-0 -ml-4 -mt-4 w-8 h-8 rounded-full bg-[#E8F4FF] shadow-[0_0_20px_rgba(232,244,255,0.8)] cursor-grab active:cursor-grabbing flex items-center justify-center z-10"
        >
          <div className="w-full h-full rounded-full animate-ping bg-[#E8F4FF] opacity-30 absolute inset-0" />
        </motion.div>
        
        <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
          <span className="text-[#8A8D98] text-sm uppercase tracking-widest font-medium opacity-50">Drag the glowing node</span>
        </div>
      </div>
    </section>
  );
}

// Helper to prevent re-renders of the whole parent on drag
function MotionLine({ node, userX, userY }: { node: any, userX: any, userY: any }) {
  const [props, setProps] = useState({ x1: userX.get(), y1: userY.get(), opacity: 0 });

  useEffect(() => {
    const update = () => {
      const ux = userX.get();
      const uy = userY.get();
      const dist = Math.hypot(node.x - ux, node.y - uy);
      const maxDist = 300;
      let opacity = 0;
      if (dist < maxDist) {
        opacity = 1 - (dist / maxDist);
      }
      setProps({ x1: ux, y1: uy, opacity: opacity * (node.match / 100) });
    };

    const unsubX = userX.on('change', update);
    const unsubY = userY.on('change', update);
    update();
    return () => { unsubX(); unsubY(); };
  }, [node, userX, userY]);

  return (
    <line
      x1={props.x1}
      y1={props.y1}
      x2={node.x}
      y2={node.y}
      stroke="#F2B84B"
      strokeWidth={2}
      strokeOpacity={props.opacity}
    />
  );
}
