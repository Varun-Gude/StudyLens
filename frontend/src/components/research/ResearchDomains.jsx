import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Sparkles, Brain, Activity, Atom, ShieldCheck, Sun, ChevronDown } from 'lucide-react';
import DomainCard from './DomainCard';

export default function ResearchDomains() {
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      id: 'artificial-intelligence',
      name: 'Artificial Intelligence',
      category: 'Computer Science',
      description: 'Explore AI trends, applications, and research gaps.',
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-950/40 border border-indigo-900/30'
    },
    {
      id: 'machine-learning',
      name: 'Machine Learning',
      category: 'Data Science',
      description: 'Analyze ML models, techniques, and innovations.',
      icon: Brain,
      color: 'text-blue-400 bg-blue-950/40 border border-blue-900/30'
    },
    {
      id: 'machine-learning-in-healthcare',
      name: 'Healthcare AI',
      category: 'Medical Systems',
      description: 'Discover AI applications in healthcare and medicine.',
      icon: Activity,
      color: 'text-rose-400 bg-rose-950/40 border border-rose-900/30'
    },
    {
      id: 'quantum-computing',
      name: 'Quantum Computing',
      category: 'Hardware Physics',
      description: 'Explore quantum technologies and future opportunities.',
      icon: Atom,
      color: 'text-amber-400 bg-amber-950/40 border border-amber-900/30'
    },
    {
      id: 'cyber-security',
      name: 'Cyber Security',
      category: 'Networks',
      description: 'Research cybersecurity challenges and solutions.',
      icon: ShieldCheck,
      color: 'text-cyan-400 bg-cyan-950/40 border border-cyan-900/30'
    },
    {
      id: 'renewable-energy',
      name: 'Renewable Energy',
      category: 'Environmental Engineering',
      description: 'Investigate sustainable energy innovations.',
      icon: Sun,
      color: 'text-emerald-400 bg-emerald-950/40 border border-emerald-900/30'
    }
  ];

  const containerVariants = {
    hidden: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.4, ease: "easeInOut" },
        opacity: { duration: 0.2 },
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    show: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.5, ease: "easeOut" },
        opacity: { duration: 0.3 },
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 space-y-6">
      {/* Main Gradient Card */}
      <motion.div
        whileHover={{ y: -6, scale: 1.01 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative group overflow-hidden rounded-[24px] p-8 md:p-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-700 dark:via-indigo-800 dark:to-purple-900 shadow-[0_20px_50px_rgba(99,102,241,0.25)] border border-white/20 dark:border-white/10 text-white text-center flex flex-col items-center justify-center space-y-6 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Glow Effects behind card */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-[24px] blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 pointer-events-none" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

        {/* Icon */}
        <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20 shadow-lg text-white group-hover:scale-110 transition-transform duration-300">
          <FlaskConical className="w-8 h-8" />
        </div>

        {/* Texts */}
        <div className="space-y-2 z-10">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-sm">
            Explore Research Domains
          </h2>
          <p className="text-white/80 max-w-md mx-auto text-sm md:text-base font-medium leading-relaxed">
            Discover trending research areas and explore AI-powered insights
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent duplicate toggle since card has onClick
            setIsOpen(!isOpen);
          }}
          className="relative z-10 inline-flex items-center space-x-3 px-6 py-3.5 bg-white text-indigo-600 font-extrabold text-sm rounded-xl shadow-lg hover:shadow-xl hover:bg-slate-50 transition-all duration-200 active:scale-95 group/btn"
        >
          <span>Browse Research Areas</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <ChevronDown className="w-4 h-4 text-indigo-600" />
          </motion.div>
        </button>
      </motion.div>

      {/* Expandable Section */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={containerVariants}
            className="overflow-hidden w-full flex flex-col gap-4"
          >
            {categories.map((category) => (
              <DomainCard key={category.id} {...category} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
