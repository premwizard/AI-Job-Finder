'use client';

import React from 'react';
import { motion } from 'framer-motion';

const stats = [
  { label: 'AI Features', value: '10+' },
  { label: 'Career Tools', value: '15+' },
  { label: 'Smart Insights', value: '100+' },
  { label: 'Growing Platform', value: '24/7' },
];

export function LiveProof() {
  return (
    <section className="w-full py-24 bg-[#62466b] text-[#f3f3f4]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center justify-center space-y-2"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-extrabold" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
                {stat.value}
              </div>
              <div className="text-[#f3f3f4]/80 font-medium text-lg">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
