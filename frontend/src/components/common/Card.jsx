import React from 'react';
import { motion } from 'framer-motion';

export default function Card({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  const baseStyles = 'bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm backdrop-blur-sm';
  const interactiveStyles = onClick || hoverEffect ? 'cursor-pointer hover:shadow-md dark:hover:border-slate-600 transition-all duration-300' : '';

  if (onClick || hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
        className={`${baseStyles} ${interactiveStyles} ${className}`}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>
  );
}
