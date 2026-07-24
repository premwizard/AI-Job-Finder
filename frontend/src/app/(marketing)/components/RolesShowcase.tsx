'use client';

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

const MOCK_ROLES = [
  {
    id: 1,
    title: 'Senior Full Stack Engineer',
    company: 'TechNova',
    match: 94,
    skills: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Lead the development of our next-generation AI platform. You will be responsible for architecting scalable microservices and building responsive UIs.',
  },
  {
    id: 2,
    title: 'Machine Learning Researcher',
    company: 'DeepMind',
    match: 89,
    skills: ['Python', 'PyTorch', 'Transformers'],
    description: 'Push the boundaries of NLP and LLMs. Work with a world-class team to train foundation models and optimize inference.',
  },
  {
    id: 3,
    title: 'Frontend Architect',
    company: 'Vercel',
    match: 98,
    skills: ['Next.js', 'TypeScript', 'React'],
    description: 'Design the frontend architecture for our core product. Ensure maximum performance, accessibility, and developer experience.',
  },
];

export function RolesShowcase() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const selectedRole = MOCK_ROLES.find(r => r.id === selectedId);

  return (
    <section className="w-full py-32 bg-[#d9c5b2]/30 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#14110f] mb-4" style={{ fontFamily: 'var(--font-space-grotesk)' }}>
            Curated For You
          </h2>
          <p className="text-[#7e7f83] text-lg max-w-2xl mx-auto font-medium">
            These aren't just job postings. They are high-confidence matches based on your specific skills and trajectory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 perspective-[1000px]">
          {MOCK_ROLES.map(role => (
            <TiltCard key={role.id} role={role} onClick={() => setSelectedId(role.id)} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedId && selectedRole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#14110f]/60 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
            />
            <motion.div 
              layoutId={`card-${selectedRole.id}`}
              className="bg-white border border-[#62466b]/40 rounded-xl p-8 max-w-2xl w-full relative z-10 shadow-2xl"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <motion.h3 layoutId={`title-${selectedRole.id}`} className="text-2xl font-bold text-[#14110f] mb-1">
                    {selectedRole.title}
                  </motion.h3>
                  <motion.p layoutId={`company-${selectedRole.id}`} className="text-[#7e7f83] text-lg font-medium">
                    {selectedRole.company}
                  </motion.p>
                </div>
                <motion.div layoutId={`match-${selectedRole.id}`} className="bg-[#62466b]/15 text-[#62466b] border border-[#62466b]/30 px-3 py-1 rounded-md font-semibold text-sm">
                  {selectedRole.match}% Match
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedRole.skills.map(skill => (
                    <span key={skill} className="bg-[#f3f3f4] border border-[#7e7f83]/20 text-[#34312d] px-2.5 py-1 text-sm rounded-md font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <h4 className="text-[#14110f] font-semibold mb-2">About the role</h4>
                <p className="text-[#34312d] mb-8 leading-relaxed font-normal">
                  {selectedRole.description}
                </p>

                <div className="flex justify-end gap-4">
                  <button onClick={() => setSelectedId(null)} className="px-4 py-2 text-[#7e7f83] hover:text-[#14110f] transition-colors font-medium">
                    Close
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#62466b] hover:bg-[#7a5a85] text-[#f3f3f4] font-semibold px-6 py-2 rounded-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-[#62466b]"
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TiltCard({ role, onClick }: { role: any, onClick: () => void }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      layoutId={`card-${role.id}`}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="bg-white border border-[#7e7f83]/20 rounded-xl p-6 cursor-pointer hover:border-[#62466b]/50 transition-all duration-300 relative group shadow-[0_4px_20px_rgba(20,17,15,0.06)] hover:shadow-[0_10px_25px_rgba(98,70,107,0.15)]"
    >
      {/* Glare effect */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" 
           style={{ background: 'radial-gradient(circle at 50% 0%, rgba(98,70,107,0.08) 0%, transparent 70%)' }} 
      />

      <div style={{ transform: "translateZ(30px)" }}>
        <div className="flex justify-between items-start mb-4">
          <motion.div layoutId={`match-${role.id}`} className="bg-[#62466b]/15 text-[#62466b] border border-[#62466b]/30 px-2.5 py-1 rounded-md text-xs font-semibold">
            {role.match}% Match
          </motion.div>
        </div>
        <motion.h3 layoutId={`title-${role.id}`} className="text-xl font-bold text-[#14110f] mb-1">
          {role.title}
        </motion.h3>
        <motion.p layoutId={`company-${role.id}`} className="text-[#7e7f83] text-sm mb-4 font-medium">
          {role.company}
        </motion.p>
        
        <div className="flex flex-wrap gap-2 mt-auto">
          {role.skills.slice(0, 3).map((skill: string) => (
            <span key={skill} className="bg-[#f3f3f4] text-[#34312d] text-xs px-2.5 py-1 rounded-md border border-[#7e7f83]/20 font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
