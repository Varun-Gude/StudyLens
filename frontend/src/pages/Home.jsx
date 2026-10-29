import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SearchBar from '../components/research/SearchBar';
import ResearchDomains from '../components/research/ResearchDomains';

export default function Home() {
  const navigate = useNavigate();

  const handleSearchSubmit = (query) => {
    // Navigate to SearchResults page with query
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };



  return (
    <div className="space-y-16 py-12 md:py-20 max-w-5xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Explore Research.{' '}
            <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Discover Knowledge.
            </span>{' '}
            Generate Insights.
          </h1>

          <p className="text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            AI-powered research assistant that analyzes scientific papers and discovers research opportunities.
          </p>
        </motion.div>

        {/* Central Searchbar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="px-4"
        >
          <SearchBar
            onSearch={handleSearchSubmit}
            placeholder="Search research topics (e.g. Machine Learning in Healthcare)"
          />
        </motion.div>
      </section>

      {/* Explore Research Domains Section */}
      <section className="px-4">
        <ResearchDomains />
      </section>
    </div>
  );
}
