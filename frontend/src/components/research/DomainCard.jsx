import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Brain, Activity, Atom, ShieldCheck, Sun, ExternalLink } from 'lucide-react';
import { apiService } from '../../services/api';
import Loader from '../common/Loader';
import ResearchTimeline from './ResearchTimeline';

// High-fidelity mock details database for local/offline demo fallback
const MOCK_DETAILS = {
  'artificial-intelligence': {
    name: 'Artificial Intelligence',
    summary: {
      executiveSummary: 'Artificial Intelligence (AI) has undergone a major paradigm shift with the advent of Large Language Models and Foundation Models. Current research is focusing on enhancing model explainability, sample efficiency, and multi-modal alignment. Synthesized papers show a 140% increase in attention-mechanism optimizations over the last 3 years.',
      keyTechnologies: [
        { name: 'Self-Attention Networks', desc: 'Core transformer layers mapping sequence contextual vectors.' },
        { name: 'Contrastive Pre-training', desc: 'Unsupervised representation matching across image/text pairs.' }
      ]
    },
    literatureReview: 'A comprehensive review of recent literature shows that traditional reinforcement learning is being augmented by human feedback pipelines (RLHF) and direct preference optimization (DPO). However, issues regarding hallucination, safety guardrails, and context window limitations remain critical bottlenecks for deployment in mission-critical environments.',
    gaps: [
      { title: 'Hallucination Mitigation', description: 'Lack of deterministic verification layers for LLM outputs.', severity: 'High', focus: 'Evaluation' },
      { title: 'Multi-modal Alignment', description: 'Aligning temporal video sequences with unstructured text tokens.', severity: 'Medium', focus: 'Model Training' }
    ],
    futureScope: {
      projects: [
        { title: 'Deterministic Guardrail Engine', description: 'Distilled transformer validator checking logical entailment.', approach: 'Model Distillation' },
        { title: 'Real-time Fact Checker', description: 'Retrieval Augmented Generation (RAG) integrated with structured knowledge graphs.', approach: 'System Integration' }
      ]
    },
    papers: [
      { id: 'p1', title: 'Attention Is All You Need', authors: 'Vaswani et al.', year: 2017, citations: 120500, abstract: 'We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.', url: 'https://arxiv.org/abs/1706.03762', researchGap: 'Lacks temporal memory modeling and dynamic multi-modal representation.', researchAssumption: 'Extending self-attention with state space grids or recurrent decay might capture long-range multi-modal dependencies.' },
      { id: 'p2', title: 'Language Models are Few-Shot Learners', authors: 'Brown et al. (OpenAI)', year: 2020, citations: 28000, abstract: 'We demonstrate that scaling up language models greatly improves few-shot performance, sometimes even matching prior supervised task accuracy.', url: 'https://arxiv.org/abs/2005.14165', researchGap: 'Suffers from severe hallucination when generating reasoning chains for complex logic.', researchAssumption: 'Interleaving external verifiable APIs and knowledge graphs with few-shot prompts could prune hallucination pathways.' }
    ],
    timeline: [
      { year: '2017', event: 'Attention Is All You Need', desc: 'Key discovery published by Vaswani et al. introducing the Transformer architecture.' },
      { year: '2020', event: 'GPT-3 Breakthrough', desc: 'Few-shot learning performance shown to scale with massive parameter sizes.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Focus is now on multi-modal models, reinforcement learning from human feedback, and computational efficiency.' }
    ]
  },
  'machine-learning': {
    name: 'Machine Learning',
    summary: {
      executiveSummary: 'Machine Learning research is shifting from static, batch-oriented model training towards continuous, federated, and resource-efficient learning models. Standard algorithms are being re-engineered for edge computing deployment, with high interest in parameter-efficient fine-tuning (PEFT).',
      keyTechnologies: [
        { name: 'LoRA & QLoRA', desc: 'Low-rank adaptation layers that freeze base weights to reduce training VRAM requirements.' },
        { name: 'Gradient Quantization', desc: 'Reducing weight representation precision from FP32 to INT4/INT8.' }
      ]
    },
    literatureReview: 'The literature indicates that training models at scale requires substantial carbon footprints, prompting research into green computing and sparse model architectures (MoE). Furthermore, tabular machine learning still relies heavily on tree-based architectures like XGBoost, though neural approaches are closing the performance gap.',
    gaps: [
      { title: 'Edge Hardware Constraints', description: 'Running complex models on low-power microcontrollers.', severity: 'High', focus: 'Deployment' },
      { title: 'Data Shift Drift', description: 'Detecting and self-correcting statistical drift in production data streams.', severity: 'Medium', focus: 'Monitoring' }
    ],
    futureScope: {
      projects: [
        { title: 'Self-Adapting Edge Classifier', description: 'On-device online training framework using tinyML libraries.', approach: 'Device Compilation' }
      ]
    },
    papers: [
      { id: 'ml1', title: 'LoRA: Low-Rank Adaptation of Large Language Models', authors: 'Hu et al.', year: 2021, citations: 6500, abstract: 'LoRA reduces the number of trainable parameters by 10,000 times and GPU memory requirements by 3 times while matching performance.', url: 'https://arxiv.org/abs/2106.09685', researchGap: 'Fine-tuning memory bounds are still prohibitive for ultra-low power edge devices.', researchAssumption: 'Combining low-rank adaptation matrix decomposition with structural weight pruning should fit large models on microcontrollers.' }
    ],
    timeline: [
      { year: '2021', event: 'LoRA Adaptation Release', desc: 'Low-Rank Adaptation technique introduced, democratizing model adaptation.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Widespread application of sparse mixture-of-experts and hardware-aware compilation.' }
    ]
  },
  'machine-learning-in-healthcare': {
    name: 'Healthcare AI',
    summary: {
      executiveSummary: 'Healthcare AI covers computer vision in diagnostics, clinical NLP for electronic health records, and predictive modeling for patient deterioration. Current work prioritizes high reliability, bias mitigation, and patient privacy under HIPAA and GDPR.',
      keyTechnologies: [
        { name: 'Federated Health Networks', desc: 'Training diagnostic models across hospitals without sharing sensitive patient records.' },
        { name: 'Semantic Segmentation', desc: 'Pixel-level neural classification of MRI, CT, and X-ray images for tumor detection.' }
      ]
    },
    literatureReview: 'Medical AI has shown expert-level accuracy in specific image classification domains (e.g. dermatology, ophthalmology). However, standard clinical practice integration is limited by the "black box" nature of deep learning, lack of multi-institutional clinical trials, and domain shifts between patient demographics.',
    gaps: [
      { title: 'Explainable Clinical Pathways', description: 'Lack of step-by-step diagnostic reasoning that clinical boards can audit.', severity: 'High', focus: 'Trust' },
      { title: 'Out-of-Distribution Diagnostics', description: 'Drop in diagnostic performance when models encounter images from new scanners.', severity: 'High', focus: 'Robustness' }
    ],
    futureScope: {
      projects: [
        { title: 'Multi-Modal Patient Synthesis Dashboard', description: 'Combining genomic, tabular EHR, and imaging data into a unified predictive risk score.', approach: 'Data Integration' }
      ]
    },
    papers: [
      { id: 'hc1', title: 'Dermatologist-level classification of skin cancer with deep neural networks', authors: 'Esteva et al.', year: 2017, citations: 14200, abstract: 'We demonstrate dermatologist-level classification accuracy on biopsy-confirmed skin lesions using a single deep convolutional neural network.', url: 'https://www.nature.com/articles/nature21056', researchGap: 'Diagnostic models are highly sensitive to acquisition shifts from scanners and suffer out-of-distribution drop.', researchAssumption: 'Unsupervised domain-adversarial retraining on multi-center scanner datasets may align and robustify diagnostic features.' }
    ],
    timeline: [
      { year: '2017', event: 'Nature Dermatology Milestone', desc: 'Deep learning demonstrated to match board-certified dermatologist diagnostic accuracy.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Expanding to federated diagnostics, patient risk predictions, and generative medical reports.' }
    ]
  },
  'quantum-computing': {
    name: 'Quantum Computing',
    summary: {
      executiveSummary: 'Quantum Computing researches quantum algorithms, error correction, and quantum hardware topologies (superconducting qubits, trapped ions, silicon spin). Current focus is on Noisy Intermediate-Scale Quantum (NISQ) algorithms.',
      keyTechnologies: [
        { name: 'Quantum Error Correction (QEC)', desc: 'Encoding physical qubits into logical qubits to tolerate environmental noise.' },
        { name: 'Variational Quantum Eigensolvers', desc: 'Hybrid quantum-classical algorithms optimized for chemical simulations.' }
      ]
    },
    literatureReview: 'Quantum supremacy was demonstrated in specific sampling tasks, but practical utility requires logical qubits with error rates below 10^-3. Current literature explores hybrid classical-quantum models, tensor networks, and quantum chemistry applications.',
    gaps: [
      { title: 'High Qubit Decoherence', description: 'Short coherence times limiting circuit depth for meaningful calculations.', severity: 'High', focus: 'Hardware' },
      { title: 'Quantum Software Toolchains', description: 'Compiling high-level quantum circuits to hardware-specific pulse sequences efficiently.', severity: 'Medium', focus: 'Software' }
    ],
    futureScope: {
      projects: [
        { title: 'NISQ Optimization Suite', description: 'Error-mitigating compiler plugin mapping QAOA circuits to physical topologies.', approach: 'Algorithm Compilation' }
      ]
    },
    papers: [
      { id: 'qc1', title: 'Quantum supremacy using a programmable superconducting processor', authors: 'Arute et al. (Google)', year: 2019, citations: 7800, abstract: 'We report the use of a processor with 53 programmable superconducting qubits to demonstrate quantum supremacy over classical supercomputers.', url: 'https://www.nature.com/articles/s41586-019-1666-5', researchGap: 'Superconducting processors run in NISQ regime with extreme noise and lack logical error correction scale.', researchAssumption: 'Applying logical code clustering and surface code syndromes can suppress environmental decoherence at scale.' }
    ],
    timeline: [
      { year: '2019', event: 'Google Supremacy Demo', desc: 'First demonstration of quantum supremacy on a superconducting quantum processor.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Developing topological qubits, advanced surface code error-correction, and hybrid quantum machine learning.' }
    ]
  },
  'cyber-security': {
    name: 'Cyber Security',
    summary: {
      executiveSummary: 'Cybersecurity research focuses on automated threat detection, zero-trust network architectures, cryptography (including post-quantum cryptosystems), and security auditing of software supply chains.',
      keyTechnologies: [
        { name: 'Post-Quantum Cryptography (PQC)', desc: 'Lattice-based encryption algorithms designed to resist quantum computer decryption attempts.' },
        { name: 'Extended Detection & Response (XDR)', desc: 'Consolidating security logs across endpoints, cloud systems, and networks with AI triage.' }
      ]
    },
    literatureReview: 'With the expansion of containerized cloud workloads, traditional perimeter security is obsolete. Literature emphasizes zero-trust policies and software bills of materials (SBOM). Additionally, machine learning-driven anomaly detection is highly sensitive but suffers from high false-alarm rates.',
    gaps: [
      { title: 'Adversarial Prompt Injection', description: 'Exploiting LLM-based system agents via malicious prompt payloads.', severity: 'High', focus: 'Agent Defense' },
      { title: 'False Positive Reductions', description: 'Distinguishing benign developer activity from novel zero-day attack footprints.', severity: 'Medium', focus: 'ML Classification' }
    ],
    futureScope: {
      projects: [
        { title: 'Adversarial Jailbreak Shield', description: 'Real-time semantic filtering proxy evaluating user inputs before LLM consumption.', approach: 'Security Proxy' }
      ]
    },
    papers: [
      { id: 'cs1', title: 'Certified Robustness for Deep Neural Networks', authors: 'Wong & Kolter', year: 2018, citations: 2100, abstract: 'We propose a method to train deep neural networks that are provably robust to adversarial perturbations.', url: 'https://arxiv.org/abs/1711.00851', researchGap: 'Certified robustness certificates introduce high computational search loops and conservative predictions.', researchAssumption: 'Adversarial noise training using smoothed randomized parameter spaces can generate tighter certificates faster.' }
    ],
    timeline: [
      { year: '2018', event: 'Adversarial Defense Breakthrough', desc: 'Provable certified robustness training techniques introduced for neural networks.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Securing generative AI pipelines, software supply chains, and transitioning to NIST post-quantum encryption.' }
    ]
  },
  'renewable-energy': {
    name: 'Renewable Energy',
    summary: {
      executiveSummary: 'Renewable energy engineering researches next-generation solar photovoltaics (perovskite materials), smart grid optimization via machine learning, and high-capacity battery energy storage systems.',
      keyTechnologies: [
        { name: 'Perovskite-Silicon Tandem Cells', desc: 'Layering perovskite materials over silicon to break theoretical solar efficiency limits.' },
        { name: 'Smart Grid Load Balancing', desc: 'Predictive neural networks routing energy storage reserves during peak load fluctuations.' }
      ]
    },
    literatureReview: 'Decarbonizing the energy grid requires scalable storage solutions to combat solar and wind intermittency. Literature focuses heavily on lithium-sulfur batteries, solid-state batteries, and optimizing hydrogen fuel cell catalytic reactions using machine learning molecular simulations.',
    gaps: [
      { title: 'Battery Degradation Forecasting', description: 'Predicting electro-chemical lifespan decay profiles under extreme thermal stresses.', severity: 'Medium', focus: 'Predictive Modeling' },
      { title: 'Grid Decentralization', description: 'Peer-to-peer micro-grid trading protocols using secure distributed ledger technologies.', severity: 'High', focus: 'Systems Engineering' }
    ],
    futureScope: {
      projects: [
        { title: 'GridMind Load Forecaster', description: 'Recurrent Transformer tracking grid-level weather and consumer demand patterns.', approach: 'Time-series forecasting' }
      ]
    },
    papers: [
      { id: 're1', title: 'Perovskite-silicon tandem solar cells with 29.15% efficiency', authors: 'Al-Ashouri et al.', year: 2020, citations: 3400, abstract: 'We report tandem solar cells combining a silicon bottom cell and a perovskite top cell reaching 29.15% power conversion efficiency.', url: 'https://www.science.org/doi/10.1126/science.abd4016', researchGap: 'Tandem solar cell manufacturing suffers chemical instability and high cell degradation rates.', researchAssumption: 'Co-depositing fluorinated molecular layers during cell synthesis could lock the perovskite structure and extend solar panel lifetimes.' }
    ],
    timeline: [
      { year: '2020', event: 'Tandem Solar Efficiency Peak', desc: 'Perovskite-silicon tandem cells demonstrate 29%+ efficiency milestone.' },
      { year: 'Current State', event: 'Literature Synthesis', desc: 'Focus on scaling manufacturing stability of tandem cells and AI-driven grid-scale battery dispatch.' }
    ]
  }
};

export default function DomainCard({
  id,
  name,
  category,
  description,
  icon: Icon,
  color = 'text-brand-400 bg-brand-950/40 border border-brand-900/30'
}) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('synthesis'); // 'synthesis' | 'timeline' | 'gaps' | 'papers'

  const handleToggleDetails = async (e) => {
    e.stopPropagation();

    // Prevent toggle if clicking on links or other active sub-elements
    if (e.target.closest('a') || e.target.closest('button.tab-btn')) {
      return;
    }

    if (isDetailsOpen) {
      setIsDetailsOpen(false);
      return;
    }

    setIsDetailsOpen(true);
    if (!details) {
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getTopicDetails(id);
        if (data) {
          setDetails(data);
        } else {
          throw new Error("No analysis details found for this topic");
        }
      } catch (err) {
        console.warn("API request failed, falling back to mock details for:", id, err);
        const fallbackData = MOCK_DETAILS[id];
        if (fallbackData) {
          setDetails(fallbackData);
        } else {
          setError(err.message || "Failed to retrieve topic details.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 25 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
          }
        }
      }}
      whileHover={{ 
        y: isDetailsOpen ? 0 : -4, 
        transition: { duration: 0.2 } 
      }}
      onClick={handleToggleDetails}
      className={`group w-full bg-slate-950/50 backdrop-blur-md border rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 shadow-lg cursor-pointer ${
        isDetailsOpen 
          ? 'border-brand-500/60 bg-slate-900/40 shadow-[0_0_40px_rgba(99,102,241,0.1)]' 
          : 'border-slate-800/80 hover:border-brand-500/50 hover:bg-slate-900/60 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full">
        <div className="flex items-start sm:items-center space-x-4 text-left">
          {/* Icon wrapper */}
          <div className={`p-4 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center shadow-inner ${color}`}>
            <Icon className="w-6 h-6" />
          </div>
          
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">
              {category}
            </span>
            <h3 className="text-lg font-extrabold text-slate-100 group-hover:text-brand-400 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="sm:self-center shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleDetails(e);
            }}
            className="inline-flex items-center justify-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-brand-500/25 active:scale-95 group/btn w-full sm:w-auto"
          >
            <span>{isDetailsOpen ? 'Hide Insights' : 'Explore Insights'}</span>
            <motion.span
              animate={{ rotate: isDetailsOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <ChevronDown className="w-4 h-4 text-white" />
            </motion.span>
          </button>
        </div>
      </div>

      {/* Expanded Details Pane */}
      <AnimatePresence initial={false}>
        {isDetailsOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden w-full border-t border-slate-800/80 mt-6 pt-6"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader type="spinner" />
                <span className="text-xs text-slate-450 font-semibold animate-pulse tracking-wide">
                  Synthesizing Literature & Mapping Evolution Pathway...
                </span>
              </div>
            ) : error || !details ? (
              <div className="text-center py-8 text-sm text-slate-500 font-medium">
                {error || 'Could not retrieve domain details. Please try again.'}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tabs Row */}
                <div className="flex flex-wrap gap-2 border-b border-slate-800/60 pb-3">
                  {[
                    { key: 'synthesis', label: 'Synthesis & Context' },
                    { key: 'timeline', label: 'Evolution Timeline' },
                    { key: 'gaps', label: 'Gaps & Opportunities' },
                    { key: 'papers', label: 'Seminal Papers' }
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveTab(tab.key);
                      }}
                      className={`tab-btn px-4 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                        activeTab === tab.key
                          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/15'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-850 hover:bg-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Active Tab Panel */}
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-left w-full"
                >
                  {activeTab === 'synthesis' && (
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest">Executive Summary</h4>
                        <p className="text-sm text-slate-350 leading-relaxed font-normal">
                          {details.summary?.executiveSummary}
                        </p>
                      </div>
                      
                      <div className="space-y-3 pt-1">
                        <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest">Key Enabling Technologies</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {details.summary?.keyTechnologies?.map((tech, idx) => (
                            <div key={idx} className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 hover:border-slate-800 transition-colors">
                              <div className="text-xs font-extrabold text-slate-200">{tech.name}</div>
                              <div className="text-xs text-slate-450 mt-1 leading-relaxed font-medium">{tech.desc}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {details.literatureReview && (
                        <div className="space-y-2 pt-1 border-t border-slate-850 mt-2">
                          <h4 className="text-xs font-black text-brand-400 uppercase tracking-widest mt-3">Literature Assessment</h4>
                          <p className="text-xs text-slate-400 leading-relaxed font-medium">
                            {details.literatureReview}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div className="py-2 overflow-x-auto">
                      <ResearchTimeline timeline={details.timeline} />
                    </div>
                  )}

                  {activeTab === 'gaps' && (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-xs font-black text-rose-400 uppercase tracking-widest">Critical Research Gaps</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {details.gaps?.map((gap, idx) => (
                            <div key={idx} className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 space-y-2 relative overflow-hidden">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-slate-200">{gap.title}</span>
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                                  gap.severity === 'High' ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' :
                                  gap.severity === 'Medium' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/30' :
                                  'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                                }`}>
                                  {gap.severity} Severity
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                                {gap.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3 pt-1 border-t border-slate-850">
                        <h4 className="text-xs font-black text-emerald-400 uppercase tracking-widest mt-4">AI-Generated Abstractions & Projects</h4>
                        <div className="space-y-3">
                          {details.futureScope?.projects?.map((project, idx) => (
                            <div key={idx} className="p-4 bg-slate-900/40 rounded-xl border border-slate-850 space-y-2 hover:border-slate-800 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-slate-200">{project.title}</span>
                                <span className="text-[10px] font-bold text-slate-400 bg-slate-950/50 border border-slate-850 px-2 py-0.5 rounded-md uppercase tracking-wider">{project.approach}</span>
                              </div>
                              <p className="text-xs text-slate-400 leading-relaxed">
                                {project.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'papers' && (
                    <div className="space-y-4">
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest">Seminal Literature Base</h4>
                      <div className="space-y-4">
                        {details.papers?.map((paper, idx) => (
                          <div key={idx} className="p-5 bg-slate-900/40 rounded-xl border border-slate-850 space-y-3 hover:border-slate-800 transition-colors">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-850 pb-2">
                              <span className="text-xs font-extrabold text-slate-200 leading-snug">{paper.title}</span>
                              {paper.url && paper.url !== '#' && (
                                <a
                                  href={paper.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-brand-400 hover:text-brand-300 font-bold hover:underline shrink-0 flex items-center space-x-1"
                                >
                                  <span>Open Source</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] text-slate-455">
                              <span><span className="font-semibold text-slate-400">Authors:</span> {paper.authors}</span>
                              <span><span className="font-semibold text-slate-400">Year:</span> {paper.year}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed font-normal">
                              {paper.abstract}
                            </p>
                            
                            {/* Research Gap & Assumption Section */}
                            {(paper.researchGap || paper.researchAssumption) && (
                              <div className="space-y-3 pt-3 border-t border-slate-850 mt-3 text-left">
                                {paper.researchGap && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-rose-500 dark:text-rose-455 uppercase tracking-widest block">
                                      Identified Research Gap
                                    </span>
                                    <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed bg-rose-95/10 border border-rose-900/20 p-2.5 rounded-lg font-medium">
                                      {paper.researchGap}
                                    </p>
                                  </div>
                                )}
                                
                                {paper.researchAssumption && (
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-455 uppercase tracking-widest block">
                                      Research Assumption
                                    </span>
                                    <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed bg-emerald-95/10 border border-emerald-900/20 p-2.5 rounded-lg font-medium">
                                      {paper.researchAssumption}
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
