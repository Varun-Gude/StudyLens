import React, { useEffect } from 'react';
import {
  X, Target, AlertCircle, CheckCircle2, Database, Cpu, Layout,
  ListOrdered, TrendingUp, Rocket, BookOpen, ExternalLink
} from 'lucide-react';

const SectionBlock = ({ icon: Icon, iconColor, title, children }) => (
  <div className="space-y-2">
    <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest ${iconColor}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{title}</span>
    </div>
    <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
      {children}
    </div>
  </div>
);

const Divider = () => (
  <div className="border-t border-slate-100 dark:border-slate-800" />
);

export default function RoadmapModal({ scope, type = 'project', onClose }) {
  if (!scope) return null;

  const roadmap = scope.roadmap || {};
  const datasetInfo = scope.datasetInfo || scope.dataset_info || null;
  const technologies = scope.technologies || [];
  const isProject = type === 'project';

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const objectives = Array.isArray(roadmap.objectives) ? roadmap.objectives : [roadmap.objectives].filter(Boolean);
  const implementationSteps = Array.isArray(roadmap.implementation_steps) ? roadmap.implementation_steps : [roadmap.implementation_steps].filter(Boolean);
  const publicationOpportunities = Array.isArray(roadmap.publication_opportunities) ? roadmap.publication_opportunities : [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />

      {/* Modal Panel */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-6 border-b border-slate-100 dark:border-slate-800 ${isProject ? 'bg-gradient-to-r from-emerald-50/60 dark:from-emerald-950/30 to-transparent' : 'bg-gradient-to-r from-purple-50/60 dark:from-purple-950/30 to-transparent'}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border ${isProject ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 border-purple-300 dark:border-purple-800'}`}>
                {isProject ? 'Project Concept Roadmap' : 'Publication Pathway Roadmap'}
              </span>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-snug mt-2">
                {scope.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {scope.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6 custom-scroll">

          {/* Problem Statement */}
          {roadmap.problem_statement && (
            <>
              <SectionBlock icon={AlertCircle} iconColor="text-rose-600 dark:text-rose-400" title="Problem Statement">
                <p>{roadmap.problem_statement}</p>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Research Gap */}
          {roadmap.research_gap && (
            <>
              <SectionBlock icon={Target} iconColor="text-amber-600 dark:text-amber-400" title="Research Gap">
                <p>{roadmap.research_gap}</p>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Objectives */}
          {objectives.length > 0 && (
            <>
              <SectionBlock icon={CheckCircle2} iconColor="text-brand-600 dark:text-brand-400" title="Objectives">
                <ul className="space-y-2">
                  {objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-[10px] font-black flex items-center justify-center border border-brand-200 dark:border-brand-800">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Dataset Information */}
          {datasetInfo && (
            <>
              <SectionBlock icon={Database} iconColor="text-teal-600 dark:text-teal-400" title="Dataset Information">
                <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {datasetInfo.name || 'Domain Benchmark Dataset'}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${datasetInfo.is_suggested ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'}`}>
                      {datasetInfo.is_suggested ? 'Suggested Dataset' : 'Used Dataset'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Type: </span>
                      {datasetInfo.type || 'Benchmark Corpus'}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">Purpose: </span>
                      {datasetInfo.purpose || 'Model evaluation and benchmarking.'}
                    </div>
                  </div>
                  {datasetInfo.source && datasetInfo.source !== 'N/A' && (
                    <a
                      href={datasetInfo.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md transition-all duration-150"
                    >
                      <span>{datasetInfo.is_suggested ? 'Explore Dataset' : 'Open Dataset'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Technology Stack */}
          {technologies.length > 0 && (
            <>
              <SectionBlock icon={Cpu} iconColor="text-indigo-600 dark:text-indigo-400" title="Technology Stack">
                <div className="flex flex-wrap gap-2 pt-1">
                  {technologies.map((tech, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      • {tech}
                    </span>
                  ))}
                </div>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* System Architecture */}
          {roadmap.system_architecture && (
            <>
              <SectionBlock icon={Layout} iconColor="text-cyan-600 dark:text-cyan-400" title="System Architecture">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 font-mono text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 leading-relaxed">
                  {roadmap.system_architecture}
                </div>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Implementation Steps */}
          {implementationSteps.length > 0 && (
            <>
              <SectionBlock icon={ListOrdered} iconColor="text-orange-600 dark:text-orange-400" title="Implementation Steps">
                <ol className="space-y-2.5">
                  {implementationSteps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 text-[11px] font-black flex items-center justify-center border border-orange-200 dark:border-orange-800 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Expected Outcomes */}
          {roadmap.expected_outcomes && (
            <>
              <SectionBlock icon={TrendingUp} iconColor="text-emerald-600 dark:text-emerald-400" title="Expected Outcomes">
                <p>{roadmap.expected_outcomes}</p>
              </SectionBlock>
              <Divider />
            </>
          )}

          {/* Future Enhancements */}
          {roadmap.future_enhancements && (
            <>
              <SectionBlock icon={Rocket} iconColor="text-violet-600 dark:text-violet-400" title="Future Enhancements">
                <p>{roadmap.future_enhancements}</p>
              </SectionBlock>
            </>
          )}

          {/* Publication Opportunities (publications only) */}
          {!isProject && publicationOpportunities.length > 0 && (
            <>
              <Divider />
              <SectionBlock icon={BookOpen} iconColor="text-purple-600 dark:text-purple-400" title="Publication Opportunities">
                <div className="flex flex-wrap gap-2 pt-1">
                  {publicationOpportunities.map((venue, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      {venue}
                    </span>
                  ))}
                </div>
              </SectionBlock>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
}
