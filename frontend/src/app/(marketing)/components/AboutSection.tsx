'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function AboutSection() {
  return (
    <section className="py-24 bg-[#f3f3f4] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 inline-flex items-center rounded-full border border-[#7e7f83]/30 bg-white/50 px-4 py-1.5 text-sm font-medium text-[#62466b] backdrop-blur-sm"
        >
          ✨ Infinity Crown
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-[#14110f] mb-8"
          style={{ fontFamily: 'var(--font-space-grotesk)' }}
        >
          What is Crown Atlas?
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="space-y-6 text-lg md:text-xl text-[#7e7f83] font-medium leading-relaxed"
        >
          <p>
            Crown Atlas is the flagship AI career platform developed by Infinity Crown.
          </p>
          <p>
            Instead of simply searching for jobs, Crown Atlas helps professionals navigate every stage of their career—from discovering opportunities and building stronger resumes to interview preparation and long-term career planning.
          </p>
          <p>
            Our goal is to become an intelligent career companion that empowers users to make better career decisions using artificial intelligence.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
