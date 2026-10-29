import React from 'react';
import { ExternalLink, Database, Cpu, CheckCircle2, AlertTriangle, XCircle, Award } from 'lucide-react';

export default function ResearchGapCard({ paper, topicGaps = [] }) {
  if (!paper) return null;

  const difficulty = (paper.difficulty || 'MEDIUM').toUpperCase();
  const technologies = Array.isArray(paper.technologies) && paper.technologies.length > 0 
    ? paper.technologies 
    : ['Python', 'Machine Learning', 'Data Processing', 'Neural Networks'];

  const datasetInfo = paper.datasetInfo || paper.dataset_info || {
    name: 'Standard Domain Dataset',
    type: 'Benchmark Dataset',
    purpose: 'Used for empirical model evaluation and benchmarking.',
    source: 'N/A',
    is_suggested: true
  };

  const feasibility = paper.feasibility || {
    level: 'Suitable for Final Year Project',
    reason: 'Well-scoped dataset and standard algorithm stack suitable for student implementation timelines.'
  };

  const researchGap = paper.researchGap || paper.research_gap || null;
  const suggestedResearchDirection = paper.suggestedResearchDirection || paper.suggested_research_direction || paper.researchAssumption || paper.research_assumption || null;

  // Clean and extract short description (3-4 lines, around 3 sentences)
  const getShortDescription = (abstract) => {
    if (!abstract || abstract === 'Abstract not available.') {
      return 'This paper explores advanced methodologies and framework designs in the context of the search topic, presenting empirical findings and validation results.';
    }
    const sentences = abstract.split(/(?<=[.!?])\s+/);
    if (sentences.length <= 3) {
      return abstract;
    }
    return sentences.slice(0, 3).join(' ');
  };

  // Generate 4 paper-specific gaps based on title, abstract, and topic-level gaps
  const getPaperGaps = (title, abstract) => {
    if (researchGap) {
      // If AI returned a specific gap, include it alongside generated items
    }
    const getCleanKeywords = (text) => {
      if (!text) return [];
      const stopWords = new Set([
        'the', 'a', 'an', 'of', 'in', 'on', 'for', 'with', 'and', 'to', 'using', 'based', 'approach', 'framework',
        'analysis', 'system', 'model', 'method', 'study', 'design', 'evaluation', 'results', 'data', 'learning',
        'deep', 'networks', 'network', 'algorithm', 'algorithms', 'application', 'applications', 'performance',
        'proposed', 'novel', 'new', 'efficient', 'effective', 'classification', 'detection', 'prediction', 'neural',
        'towards', 'via', 'from', 'with', 'by'
      ]);
      return text.toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 4 && !stopWords.has(w));
    };

    const getDeterministicHash = (str) => {
      let hash = 0;
      if (!str) return hash;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash |= 0;
      }
      return Math.abs(hash);
    };

    const titleKws = getCleanKeywords(title);
    const abstractKws = getCleanKeywords(abstract === 'Abstract not available.' ? '' : abstract);
    const combinedKws = [...new Set([...titleKws, ...abstractKws])];

    const kw1 = combinedKws[0] ? combinedKws[0].charAt(0).toUpperCase() + combinedKws[0].slice(1) : 'Methodology';
    const kw2 = combinedKws[1] || 'validation';
    const kw3 = combinedKws[2] || 'performance';
    const kw4 = combinedKws[3] || 'deployment';

    const hash = getDeterministicHash(title || 'paper');

    const templates = [
      `Insufficient empirical validation of the proposed {kw} mechanism under extreme out-of-distribution scenarios.`,
      `Lack of comparative benchmarking against traditional non-deep learning baselines for {kw} tasks.`,
      `High computational latency and memory footprints, limiting real-time deployment of {kw} models in low-resource edge systems.`,
      `The absence of interpretability layers to explain how the {kw} model reaches its intermediate feature representations.`,
      `No formal assessment of model sensitivity to input perturbation or adversarially corrupted {kw} datasets.`,
      `Lack of clinician or domain-expert feedback loops to evaluate the practical utility of {kw} outputs.`,
      `Limited dataset diversity, as the model was evaluated primarily on homogeneous, pre-processed {kw} benchmarks.`,
      `No analysis of long-term model drift or catastrophic forgetting when adapting the {kw} system to new distributions.`,
      `Lack of standardized evaluation metrics specifically designed to measure the qualitative correctness of {kw} predictions.`,
      `Unexplored integration paths between the proposed {kw} methodology and hybrid classical-quantum paradigms.`,
      `No thorough examination of how privacy-preserving mechanisms impact the accuracy of the {kw} framework.`,
      `Limited scalability analysis when scaling the model parameter count or input dimension for massive {kw} datasets.`
    ];

    const idx1 = hash % 12;
    const idx2 = (hash + 3) % 12 === idx1 ? (hash + 4) % 12 : (hash + 3) % 12;
    const idx3 = (hash + 6) % 12 === idx1 || (hash + 6) % 12 === idx2 ? (hash + 7) % 12 : (hash + 6) % 12;

    const selectedTemplates = [templates[idx1], templates[idx2], templates[idx3]];
    const kws = [kw1, kw2, kw3];

    const generated = selectedTemplates.map((template, index) => {
      const selectedKw = kws[index] || kws[0];
      return template.replace(/\{kw\}/g, selectedKw);
    });

    if (researchGap) {
      return [researchGap, ...generated];
    }
    return [
      `Lack of real-time validation for ${kw1} in production environments.`,
      ...generated
    ];
  };

  const description = getShortDescription(paper.abstract);
  const paperGaps = getPaperGaps(paper.title, paper.abstract);
  const authorsText = Array.isArray(paper.authors) 
    ? paper.authors.join(', ') 
    : (paper.authors || 'Unknown Authors');

  // Styling helper for Difficulty Badge
  const getDifficultyBadgeStyle = (diff) => {
    switch (diff) {
      case 'EASY':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'HARD':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'MEDIUM':
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
    }
  };

  // Styling helper for Feasibility Section
  const getFeasibilityConfig = (feas) => {
    const levelStr = typeof feas === 'string' ? feas : (feas?.level || 'Suitable for Final Year Project');
    const reasonStr = typeof feas === 'object' ? feas?.reason : null;

    if (levelStr.includes('Suitable') || levelStr.includes('Undergraduate')) {
      return {
        icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />,
        badgeText: '✔ Suitable for Final Year Project',
        containerStyle: 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200',
        badgeStyle: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
        reason: reasonStr || 'This topic is well-scoped with accessible tools, standard datasets, and reasonable compute requirements suitable for undergraduate engineering projects.'
      };
    } else if (levelStr.includes('Requires Advanced') || levelStr.includes('Moderate')) {
      return {
        icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />,
        badgeText: '⚠ Requires Advanced Research Resources',
        containerStyle: 'bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200',
        badgeStyle: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
        reason: reasonStr || 'Implementation requires specialized cloud compute, multi-GPU clusters, or extensive custom data annotation.'
      };
    } else {
      return {
        icon: <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />,
        badgeText: '❌ Not Recommended for Undergraduate Level',
        containerStyle: 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200',
        badgeStyle: 'bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
        reason: reasonStr || 'Involves complex hardware integration, quantum formulations, or high-risk theoretical research beyond standard timelines.'
      };
    }
  };

  const feasConfig = getFeasibilityConfig(feasibility);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 space-y-6">
      
      {/* 1. Header Row: Title & Top-Right Difficulty Badge */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="space-y-1 max-w-2xl">
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-sans leading-snug">
            {paper.title || 'Untitled Seminal Paper'}
          </h4>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-3 font-sans pt-1">
            <span><strong className="font-semibold text-slate-700 dark:text-slate-300">Authors:</strong> {authorsText}</span>
            <span>•</span>
            <span><strong className="font-semibold text-slate-700 dark:text-slate-300">Year:</strong> {paper.year || 'N/A'}</span>
            {paper.citations !== undefined && (
              <>
                <span>•</span>
                <span><strong className="font-semibold text-slate-700 dark:text-slate-300">Citations:</strong> {paper.citations}</span>
              </>
            )}
          </div>
        </div>

        {/* Top-Right Difficulty Badge */}
        <div className="flex items-center gap-3 shrink-0 self-start">
          <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase border ${getDifficultyBadgeStyle(difficulty)} shadow-xs`}>
            [ {difficulty} ]
          </span>
          {paper.url && paper.url !== '#' && (
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline"
            >
              <span>Paper</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* 2. Feasibility Indicator Section */}
      <div className={`p-4 rounded-lg border space-y-1.5 font-sans transition-colors ${feasConfig.containerStyle}`}>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            {feasConfig.icon}
            <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Student Project Feasibility
            </span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${feasConfig.badgeStyle}`}>
            {feasConfig.badgeText}
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90 pl-7 font-medium">
          {feasConfig.reason}
        </p>
      </div>

      {/* 3. Technologies Used Section */}
      <div className="space-y-2 font-sans">
        <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Cpu className="w-4 h-4 text-brand-500" />
          <span>Technologies Used:</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {technologies.map((tech, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
            >
              • {tech}
            </span>
          ))}
        </div>
      </div>

      {/* 4. Dataset Information Section */}
      <div className="space-y-3 font-sans">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          <Database className="w-4.5 h-4.5 text-brand-600 dark:text-brand-400" />
          <span>Dataset Information:</span>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {(Array.isArray(paper.datasets) && paper.datasets.length > 0 ? paper.datasets : [datasetInfo]).map((ds, index) => {
            const isSuggested = ds.is_suggested;
            const hasLink = ds.source && ds.source !== 'N/A' && ds.source.startsWith('http');
            
            return (
              <div 
                key={index} 
                className="bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg p-4 space-y-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Dataset Name: <span className="font-semibold text-brand-700 dark:text-brand-400">{ds.name || 'Domain Benchmark Dataset'}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                    isSuggested
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  }`}>
                    {isSuggested ? 'Suggested Dataset' : 'Used Dataset'}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Dataset Type:</span> {ds.type || 'Benchmark Corpus'}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block mt-1">Purpose:</span> 
                    <span className="leading-relaxed">{ds.purpose || 'Used for model training, testing, and validation.'}</span>
                  </div>
                </div>

                {isSuggested && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 italic bg-amber-50/50 dark:bg-amber-950/20 px-3 py-1.5 rounded-md border border-amber-200/40 dark:border-amber-900/30">
                    "This dataset is recommended based on the research domain and methodology but was not explicitly mentioned in the paper."
                  </p>
                )}

                <div className="pt-1 flex items-center gap-3">
                  {hasLink ? (
                    <a
                      href={ds.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm hover:shadow-md transition-all duration-150"
                    >
                      <span>{isSuggested ? 'Explore Dataset' : 'Open Dataset'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-700 cursor-not-allowed"
                    >
                      <span>No Dataset Link Found</span>
                    </button>
                  )}
                  {ds.source && ds.source !== 'N/A' && !hasLink && (
                    <span className="text-[10px] text-slate-500 font-mono italic">Source: {ds.source}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Summary Section */}
      <div className="space-y-1 font-sans">
        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Summary:
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* 6. Research Gaps Section */}
      <div className="space-y-1.5 font-sans">
        <div className="font-semibold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Research Gaps:
        </div>
        <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
          {paperGaps.map((gapItem, idx) => (
            <li key={idx} className="flex items-start">
              <span className="mr-2 text-brand-500 font-bold select-none">•</span>
              <span>{gapItem}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 7. Suggested Research Direction Section */}
      {suggestedResearchDirection && (
        <div className="space-y-2 font-sans pt-1">
          <div className="flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest">
              Suggested Research Direction
            </div>
          </div>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 rounded-lg px-4 py-3 font-medium">
            {suggestedResearchDirection}
          </p>
        </div>
      )}
    </div>
  );
}

