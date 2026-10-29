import React from 'react';

export default function Loader({
  type = 'spinner', // 'spinner' | 'skeleton' | 'page'
  className = '',
  count = 3
}) {
  if (type === 'page') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-medium tracking-wider">
          Initializing StudyLens...
        </p>
      </div>
    );
  }

  if (type === 'skeleton') {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="p-5 border border-slate-200 dark:border-slate-700/50 rounded-2xl bg-white dark:bg-slate-800/50 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-md w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-md w-1/2"></div>
            <div className="space-y-2 pt-2">
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-md w-full"></div>
              <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-md w-5/6"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center p-4 ${className}`}>
      <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
