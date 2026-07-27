'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, UserCheck, Building2, Map, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "AI Job Discovery",
    description: "Find relevant opportunities using intelligent search, personalized recommendations, and skill matching.",
    icon: <Search className="w-6 h-6 text-[#62466b]" />
  },
  {
    title: "Resume Intelligence",
    description: "Receive AI-powered resume analysis, ATS optimization, and tailored improvement suggestions.",
    icon: <FileText className="w-6 h-6 text-[#62466b]" />
  },
  {
    title: "Interview Copilot",
    description: "Practice technical, HR, and behavioral interviews with personalized AI feedback.",
    icon: <UserCheck className="w-6 h-6 text-[#62466b]" />
  },
  {
    title: "Company Insights",
    description: "Research companies, salary trends, technologies, hiring patterns, and employee insights.",
    icon: <Building2 className="w-6 h-6 text-[#62466b]" />
  },
  {
    title: "Career Roadmaps",
    description: "Generate personalized learning paths based on your target role and skill gaps.",
    icon: <Map className="w-6 h-6 text-[#62466b]" />
  },
  {
    title: "Career Analytics",
    description: "Track applications, interviews, offers, progress, and career growth using powerful dashboards.",
    icon: <BarChart3 className="w-6 h-6 text-[#62466b]" />
  }
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-[#14110f] mb-4"
            style={{ fontFamily: 'var(--font-space-grotesk)' }}
          >
            Why Crown Atlas?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#7e7f83] max-w-2xl mx-auto font-medium"
          >
            Everything you need to navigate your career journey, powered by advanced artificial intelligence.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#f3f3f4] rounded-2xl p-8 border border-[#7e7f83]/10 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-[#14110f] mb-3">{feature.title}</h3>
              <p className="text-[#7e7f83] leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
