import React from 'react';

// Definitions mapping for educational learning
const getTechAndDefinition = (title, abstract) => {
  const t = (title || '').toLowerCase();
  const a = (abstract || '').toLowerCase();
  
  const techPool = [
    {
      keys: ['transformer', 'attention', 'self-attention'],
      name: 'Transformer Architecture',
      def: 'A neural network architecture that relies on self-attention mechanisms to compute representations of its input and output. It forms the foundation of modern Generative AI and Large Language Models.'
    },
    {
      keys: ['bert', 'bidirectional encoder'],
      name: 'BERT (Bidirectional Encoder Representations)',
      def: 'A transformer-based model pre-trained in a bidirectional manner, allowing it to capture context from both left and right sides of a word in all layers. Extremely useful for text understanding and semantic search.'
    },
    {
      keys: ['federated', 'decentralized learning'],
      name: 'Federated Learning',
      def: 'A decentralized machine learning framework where models are trained locally on user devices or siloed data sources. Only model parameters (weights) are aggregated, keeping private raw data secure.'
    },
    {
      keys: ['explainable', 'interpretability', 'interpretable', 'lime', 'shap'],
      name: 'Explainable AI (XAI)',
      def: 'A suite of methodologies that makes deep learning models transparent, providing attribution metrics (like SHAP values) so humans can interpret, explain, and verify the model\'s reasoning pathways.'
    },
    {
      keys: ['gan', 'generative adversarial'],
      name: 'Generative Adversarial Networks (GAN)',
      def: 'An architecture featuring two models—a Generator producing synthetic samples and a Discriminator classification engine—competing against each other to produce highly realistic synthetic data.'
    },
    {
      keys: ['diffusion'],
      name: 'Diffusion Generative Models',
      def: 'A class of generative models that learn to generate data by gradually reversing a progressive noise process, widely used for state-of-the-art text-to-image and text-to-video synthesis.'
    },
    {
      keys: ['large language model', 'llm', 'gpt', 'llama'],
      name: 'Large Language Models (LLM)',
      def: 'Powerful deep neural networks containing billions of parameters, pre-trained on massive text datasets to predict next tokens and follow instructions across multiple linguistic domains.'
    },
    {
      keys: ['convolutional', 'cnn', 'image classification'],
      name: 'Convolutional Neural Network (CNN)',
      def: 'A feed-forward neural network that uses convolution layers to extract localized spatial features (like edges, textures, and objects) from multi-dimensional arrays, primarily images.'
    },
    {
      keys: ['recurrent', 'rnn', 'lstm', 'gru'],
      name: 'Recurrent Neural Network & LSTM',
      def: 'Neural networks containing feedback loops designed to remember sequential states, making them highly effective for time-series forecasting, audio processing, and natural language translation.'
    },
    {
      keys: ['graph neural', 'gnn', 'graph representation'],
      name: 'Graph Neural Networks (GNN)',
      def: 'A class of deep learning models designed to process data structured as graphs. Nodes update their states by passing vectors to neighbors, enabling deep molecular and social node-level inferences.'
    },
    {
      keys: ['transfer learning', 'domain adaptation'],
      name: 'Transfer Learning',
      def: 'A machine learning approach where a model trained on one extensive target dataset is fine-tuned to solve a separate, smaller target dataset, dramatically boosting accuracy and convergence speed.'
    },
    {
      keys: ['self-supervised', 'contrastive learning'],
      name: 'Self-Supervised Contrastive Learning',
      def: 'An unsupervised technique where models learn useful representations by predicting masked inputs or matching augmented views of the same sample, avoiding the need for manual labels.'
    },
    {
      keys: ['reinforcement learning', 'policy gradient', 'q-learning'],
      name: 'Reinforcement Learning (RL)',
      def: 'A dynamic learning process where an agent discovers optimal behaviors (policies) by interacting with an environment, maximizing cumulative scalar rewards through trial-and-error.'
    }
  ];

  for (const item of techPool) {
    if (item.keys.some(k => t.includes(k) || a.includes(k))) {
      return { name: item.name, def: item.def };
    }
  }

  // Fallback keyword extraction
  const stopWords = new Set([
    'the', 'a', 'an', 'of', 'in', 'on', 'for', 'with', 'and', 'to', 'using', 'based', 'approach', 'framework',
    'analysis', 'system', 'model', 'method', 'study', 'design', 'evaluation', 'results', 'data', 'learning',
    'deep', 'networks', 'network', 'algorithm', 'algorithms', 'application', 'applications', 'performance'
  ]);
  const words = (title || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4 && !stopWords.has(w));

  const keyword = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Machine Learning';
  
  return {
    name: `${keyword} Modeling`,
    def: `A methodology utilizing systematic ${keyword.toLowerCase()} layers and parameters to map inputs, train networks, and optimize validation correctness across domain benchmarks.`
  };
};

export default function ResearchTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
        <p className="text-sm text-slate-400">No evolution pathway recorded.</p>
      </div>
    );
  }

  // Clean and extract short description (3 sentences)
  const getShortDescription = (abstract) => {
    if (!abstract || abstract === 'Abstract not available.') {
      return 'Provides empirical benchmarks and methodology optimizations to address the target research goals.';
    }
    const sentences = abstract.split(/(?<=[.!?])\s+/);
    if (sentences.length <= 3) {
      return abstract;
    }
    return sentences.slice(0, 3).join(' ');
  };

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-800 pl-6 ml-4 space-y-8 py-4 font-sans">
      {timeline.map((item, index) => {
        const isCurrentState = item.year === 'Current State';
        
        // Extract paper info or fallback
        const paper = item.paper;
        const titleText = paper ? paper.title : item.event;
        const descriptionText = paper ? getShortDescription(paper.abstract) : item.desc;
        const authorsText = paper 
          ? (Array.isArray(paper.authors) ? paper.authors.join(', ') : paper.authors)
          : null;

        // Extract Tech details
        const techInfo = paper ? getTechAndDefinition(paper.title, paper.abstract) : null;

        return (
          <div key={index} className="relative group">
            {/* Timeline Marker Point */}
            <div className="absolute -left-[31px] top-1.5 w-4 h-4 bg-white dark:bg-slate-900 border-2 border-brand-500 rounded-full group-hover:bg-brand-500 transition-colors duration-150" />

            {/* Academic Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-colors duration-150 space-y-4 max-w-4xl">
              {/* Year & Title Row */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-md shrink-0 uppercase tracking-wider self-start">
                  Year: {item.year}
                </span>
                {paper?.url && paper.url !== '#' && (
                  <a
                    href={paper.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:underline sm:self-center"
                  >
                    Open Paper
                  </a>
                )}
              </div>

              {/* Title */}
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {titleText}
              </h4>

              {/* Authors if available */}
              {authorsText && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Authors:</span> {authorsText}
                </div>
              )}

              {/* Description */}
              <div className="space-y-1">
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                  {isCurrentState ? 'Synthesis Summary:' : 'Milestone Description:'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {descriptionText}
                </p>
              </div>

              {/* Learning Technology Block (For Students) */}
              {techInfo && (
                <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/50 rounded-md p-4 space-y-2 mt-2">
                  <div className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                    Core Technology Used: {techInfo.name}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Student Learning Resource:</span> {techInfo.def}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
