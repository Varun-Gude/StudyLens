import React from 'react';
import { Sparkles, Library, Cpu } from 'lucide-react';
import Card from '../common/Card';

export default function ResearchSummary({ summary }) {
  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Executive Summary & Overview Card */}
      <Card hoverEffect={false} className="space-y-6 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 md:p-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="w-5 h-5 text-brand-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              Executive AI Summary
            </h2>
          </div>
          <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {summary.executiveSummary}
          </p>
        </div>

        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Library className="w-4 h-4 text-brand-500" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Domain Overview & Context
            </h3>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {summary.overview}
          </p>
        </div>
      </Card>

      {/* Key Enabling Technologies Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Key Enabling Technologies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {summary.keyTechnologies?.map((tech, idx) => (
            <Card key={idx} hoverEffect={true} className="flex flex-col space-y-3 p-5 hover:border-brand-500">
              <div className="p-2 bg-brand-50 dark:bg-brand-950/20 text-brand-500 rounded-lg w-fit">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                {tech.name}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {tech.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
