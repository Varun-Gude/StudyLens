import React, { useState } from 'react';
import {
  Lightbulb, FileText, Cpu, Database, ExternalLink,
  Clock, Zap, Users, Globe, TrendingUp, ChevronRight, Star, Flame, Briefcase
} from 'lucide-react';
import RoadmapModal from './RoadmapModal';

/* ─────────────────────────────────────────────────────────────── */
/*  Difficulty badge                                               */
/* ─────────────────────────────────────────────────────────────── */
function DifficultyBadge({ level }) {
  const map = {
    EASY: {
      label: 'EASY',
      cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
      dot: 'bg-emerald-400',
    },
    MEDIUM: {
      label: 'MEDIUM',
      cls: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
      dot: 'bg-amber-400',
    },
    HARD: {
      label: 'HARD',
      cls: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
      dot: 'bg-rose-400',
    },
  };
  const key = (level || 'MEDIUM').toUpperCase();
  const cfg = map[key] || map.MEDIUM;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${cfg.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Innovation score ring                                          */
/* ─────────────────────────────────────────────────────────────── */
function InnovationScore({ score }) {
  const val = Math.min(10, Math.max(0, Number(score) || 0));
  const pct = (val / 10) * 100;
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  const color = val >= 7 ? '#10b981' : val >= 4 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width="52" height="52" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="22" cy="22" r={r} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        <text x="22" y="26" textAnchor="middle" fontSize="10" fontWeight="800" fill={color}>
          {val}/10
        </text>
      </svg>
      <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Innovation</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Mini stat pill                                                 */
/* ─────────────────────────────────────────────────────────────── */
function StatPill({ icon: Icon, label, value, iconCls = 'text-slate-400' }) {
  return (
    <div className="flex items-center gap-1.5 py-1.5 px-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 rounded-lg text-xs">
      <Icon className={`w-3 h-3 shrink-0 ${iconCls}`} />
      <span className="font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{label}:</span>
      <span className="font-bold text-slate-800 dark:text-slate-200 truncate">{value || '—'}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Tag chip                                                       */
/* ─────────────────────────────────────────────────────────────── */
function TagChip({ label, colorCls }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${colorCls}`}>
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────── */
/*  Main component                                                 */
/* ─────────────────────────────────────────────────────────────── */
export default function FutureScopeCard({ scope, type = 'project' }) {
  const [showModal, setShowModal] = useState(false);
  if (!scope) return null;

  const isProject = type === 'project';

  const technologies = Array.isArray(scope.technologies) ? scope.technologies : [];
  const careerTags = Array.isArray(scope.careerRelevance) ? scope.careerRelevance : [];
  const datasetInfo = scope.datasetInfo || scope.dataset_info || null;

  return (
    <>
      {/* ── Card ─────────────────────────────────────────────── */}
      <div className={`group flex flex-col rounded-2xl bg-white dark:bg-slate-800/80 border shadow-sm backdrop-blur-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${isProject ? 'border-slate-200/70 dark:border-slate-700/50 hover:border-emerald-300 dark:hover:border-emerald-700/60' : 'border-slate-200/70 dark:border-slate-700/50 hover:border-purple-300 dark:hover:border-purple-700/60'}`}>

        {/* Coloured top strip */}
        <div className={`h-1 w-full ${isProject ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-purple-400 to-fuchsia-500'}`} />

        <div className="p-5 flex flex-col gap-4 flex-1">

          {/* ── Header row ────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-3">
            {/* Type badge + Icon */}
            <div className="flex items-center gap-2 min-w-0">
              <div className={`p-1.5 rounded-lg shrink-0 ${isProject ? 'bg-emerald-100 dark:bg-emerald-950/40' : 'bg-purple-100 dark:bg-purple-950/40'}`}>
                {isProject
                  ? <Lightbulb className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  : <FileText className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                }
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${isProject ? 'text-emerald-600 dark:text-emerald-400' : 'text-purple-600 dark:text-purple-400'}`}>
                {isProject ? 'Project Concept Idea' : 'Publication Pathway'}
              </span>
            </div>

            {/* Difficulty badge */}
            <DifficultyBadge level={scope.difficulty} />
          </div>

          {/* ── Title & Description ───────────────────────────── */}
          <div className="space-y-1.5">
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
              {scope.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              {scope.description}
            </p>
          </div>

          {/* ── Technology Stack tags ─────────────────────────── */}
          {technologies.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                Technology Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {technologies.slice(0, 5).map((tech, i) => (
                  <TagChip
                    key={i}
                    label={tech}
                    colorCls="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  />
                ))}
                {technologies.length > 5 && (
                  <span className="text-[10px] text-slate-400 self-center">+{technologies.length - 5} more</span>
                )}
              </div>
            </div>
          )}

          {/* ── Dataset card ──────────────────────────────────── */}
          {datasetInfo && (
            <div className="rounded-xl border border-teal-200/70 dark:border-teal-800/50 bg-teal-50/40 dark:bg-teal-950/20 p-3 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400 flex items-center gap-1">
                  <Database className="w-2.5 h-2.5" />
                  {datasetInfo.is_suggested ? 'Suggested Dataset' : 'Dataset Used'}
                </p>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{datasetInfo.name}</p>
                {datasetInfo.type && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{datasetInfo.type}</p>
                )}
              </div>
              {datasetInfo.source && datasetInfo.source !== 'N/A' && (
                <a
                  href={datasetInfo.source}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide bg-teal-600 hover:bg-teal-700 text-white shadow-sm hover:shadow-md transition-all"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {datasetInfo.is_suggested ? 'Explore' : 'Open'}
                </a>
              )}
            </div>
          )}

          {/* ── Stats grid ────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2">
            <StatPill
              icon={Clock}
              label="Dev Time"
              value={scope.developmentTime}
              iconCls="text-amber-500"
            />
            <StatPill
              icon={Users}
              label="Feasibility"
              value={scope.studentFeasibility}
              iconCls="text-sky-500"
            />
            <StatPill
              icon={Star}
              label="Pub. Potential"
              value={scope.publicationPotential}
              iconCls="text-purple-500"
            />
            <StatPill
              icon={Flame}
              label="Industry Demand"
              value={scope.industryDemand}
              iconCls="text-rose-500"
            />
          </div>

          {/* ── Career tags ───────────────────────────────────── */}
          {careerTags.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Career Relevance
              </p>
              <div className="flex flex-wrap gap-1.5">
                {careerTags.slice(0, 4).map((tag, i) => (
                  <TagChip
                    key={i}
                    label={tag}
                    colorCls="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Card Footer ───────────────────────────────────────── */}
        <div className={`px-5 pb-5 pt-3 border-t mt-auto border-slate-100 dark:border-slate-700/40 flex items-center justify-between`}>
          {/* Innovation score */}
          <InnovationScore score={scope.innovationScore} />

          {/* View Full Roadmap */}
          <button
            onClick={() => setShowModal(true)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:shadow-md transition-all duration-200 ${isProject
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
              : 'bg-gradient-to-r from-purple-500 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-700 text-white'}`}
          >
            <span>View Full Roadmap</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ── Roadmap Modal ─────────────────────────────────────── */}
      {showModal && (
        <RoadmapModal
          scope={scope}
          type={type}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
