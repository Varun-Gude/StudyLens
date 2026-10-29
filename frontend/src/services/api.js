import axios from 'axios';

// Create Axios Instance targeting the FastAPI backend API prefix
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper utility: Parse structured lists from standard backend text fields
function parseTextToList(text, defaultTitle = 'Insight') {
  if (!text) return [];
  
  // Split the text into lines and clean whitespace
  const lines = text.split(/\n+/).map(l => l.trim()).filter(l => l);
  const list = [];
  
  for (let line of lines) {
    // If the line starts with a list bullet or number indicator
    if (line.match(/^[-*•\d.]+/)) {
      const cleaned = line.replace(/^[-*•\d.]+\s*/, '');
      const parts = cleaned.split(/[:\-–—]/);
      const title = parts[0]?.trim() || defaultTitle;
      const desc = parts.slice(1).join(':')?.trim() || cleaned;
      list.push({ title, desc, description: desc });
    } else if (line.includes(':') || line.includes('-')) {
      const parts = line.split(/[:\-–—]/);
      const title = parts[0]?.trim() || defaultTitle;
      const desc = parts.slice(1).join(':')?.trim() || line;
      list.push({ title, desc, description: desc });
    } else {
      // Standard line formatting
      list.push({ title: defaultTitle, desc: line, description: line });
    }
  }
  return list;
}

// Helper utility: Compute publication/citation analytics per year from papers
const computeTrendsFromPapers = (papers) => {
  if (!papers || papers.length === 0) return [];
  const yearMap = {};
  
  papers.forEach(p => {
    const yr = p.year;
    if (!yr) return;
    if (!yearMap[yr]) {
      yearMap[yr] = { year: String(yr), publications: 0, citations: 0 };
    }
    yearMap[yr].publications += 1;
    yearMap[yr].citations += (p.citation_count || p.citations || 0);
  });
  
  // Sort chronologically ascending
  return Object.values(yearMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
};

// Helper utility: Compute interactive nodes for the React Flow Timeline
const computeTimelineFromPapersAndReport = (papers, report) => {
  if (!papers || papers.length === 0) return [];
  
  // Sort papers chronologically ascending
  const sortedPapers = [...papers]
    .filter(p => p.year)
    .sort((a, b) => a.year - b.year);
    
  const timelineEvents = [];
  const papersByYear = {};
  
  // Group by year selecting the most prominent paper for that year
  sortedPapers.forEach(paper => {
    if (!papersByYear[paper.year] || (paper.citation_count && papersByYear[paper.year].citation_count < paper.citation_count)) {
      papersByYear[paper.year] = paper;
    }
  });
  
  Object.keys(papersByYear).sort((a, b) => parseInt(a) - parseInt(b)).forEach(year => {
    const paper = papersByYear[year];
    const firstAuthor = Array.isArray(paper.authors) && paper.authors.length > 0 
      ? paper.authors[0] 
      : (typeof paper.authors === 'string' ? paper.authors.split(',')[0] : 'Unknown');
      
    timelineEvents.push({
      year: String(year),
      event: paper.title,
      desc: `Key discovery published by ${firstAuthor} (Citations: ${paper.citation_count || 0}).`,
      paper: paper
    });
  });
  
  // Append current state summary from the report conclusion
  if (report && report.conclusion) {
    timelineEvents.push({
      year: 'Current State',
      event: 'Synthesis of Literature',
      desc: report.conclusion.length > 120 ? report.conclusion.slice(0, 120) + '...' : report.conclusion,
      paper: null
    });
  }
  
  return timelineEvents;
};

// Adapter: Formats flat backend models to fit React components expectations
const formatBackendTopic = (backendData) => {
  if (!backendData) return null;
  const topicName = backendData.topic;
  const report = backendData.report || {};
  const rawPapers = backendData.papers || [];

  // Parse raw papers list — these 7 papers feed the Identified Research Gaps section
  const papers = rawPapers.slice(0, 7).map((p, index) => ({
    id: p.id || `paper-${index}`,
    title: p.title || 'Untitled Seminal Paper',
    authors: Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || 'Unknown Authors'),
    year: p.year || 2024,
    citations: p.citation_count ?? 0,
    abstract: p.abstract || 'Abstract not available.',
    url: p.url || '#',
    journal: 'OpenAlex Index',
    difficulty: p.difficulty || 'MEDIUM',
    technologies: Array.isArray(p.technologies) ? p.technologies : [],
    datasetInfo: p.dataset_info || null,
    datasets: Array.isArray(p.datasets) ? p.datasets : (p.dataset_info ? [p.dataset_info] : []),
    feasibility: p.feasibility || null,
    researchGap: p.research_gap || '',
    suggestedResearchDirection: p.suggested_research_direction || p.research_assumption || '',
    researchAssumption: p.research_assumption || p.suggested_research_direction || ''
  }));


  // Parse seminal papers — displayed in the Seminal Research Papers grid (separate from gap-analysis papers)
  const rawSeminalPapers = backendData.seminal_papers || [];
  const seminalPapers = rawSeminalPapers.map((p, index) => ({
    id: p.id || `seminal-${index}`,
    title: p.title || 'Untitled Paper',
    authors: Array.isArray(p.authors) ? p.authors.join(', ') : (p.authors || 'Unknown Authors'),
    year: p.year || 2024,
    citations: p.citation_count ?? 0,
    abstract: p.abstract || 'Abstract not available.',
    url: p.url || '#',
    journal: 'OpenAlex Index'
  }));

  // Parse sections
  const keyTechnologies = parseTextToList(report.technologies, 'Technology').map(tech => ({
    name: tech.title,
    desc: tech.desc
  }));

  const gaps = parseTextToList(report.research_gaps, 'Research Gap').map((g, i) => {
    const severities = ['High', 'Medium', 'Low'];
    return {
      title: g.title,
      description: g.desc,
      severity: severities[i % 3],
      focus: 'Requires validation and empirical testing.'
    };
  });

  const challenges = parseTextToList(report.challenges, 'Challenge').map(c => ({
    title: c.title,
    desc: c.desc
  }));

  let projects = [];
  try {
    const parsed = JSON.parse(report.project_ideas);
    if (Array.isArray(parsed)) {
      projects = parsed.map(p => ({
        title: p.title || 'Untitled Project Idea',
        description: p.description || p.desc || '',
        difficulty: p.difficulty || 'MEDIUM',
        technologies: p.technologies || [],
        datasetInfo: p.dataset_info || null,
        developmentTime: p.development_time || '3-4 Months',
        innovationScore: p.innovation_score ?? 8,
        feasibility: p.feasibility || { level: 'Suitable for Final Year Project', reason: '' },
        studentFeasibility: (p.feasibility && p.feasibility.level) || p.student_feasibility || 'Final Year Project',
        publicationPotential: p.publication_potential || 'Medium',
        careerRelevance: p.career_relevance || [],
        industryDemand: p.industry_demand || 'High',
        roadmap: p.roadmap || null
      }));
    } else {
      throw new Error("Not an array");
    }
  } catch (e) {
    projects = parseTextToList(report.project_ideas, 'Project Idea').map(p => ({
      title: p.title,
      description: p.desc || '',
      difficulty: 'MEDIUM',
      technologies: ['Python', 'Machine Learning'],
      datasetInfo: { name: 'Suggested Domain Dataset', type: 'Benchmark Dataset', purpose: 'Evaluation and benchmarking.', source: 'N/A', is_suggested: true },
      developmentTime: '3-4 Months',
      innovationScore: 7,
      feasibility: { level: 'Suitable for Final Year Project', reason: 'Standard student project scope.' },
      careerRelevance: ['ML Engineer'],
      industryDemand: 'Medium',
      roadmap: {
        problem_statement: p.desc || 'No detailed roadmap available.',
        research_gap: 'Limited public benchmarks and evaluation frameworks.',
        objectives: ['Analyze domain requirements', 'Develop inference engine', 'Validate performance'],
        system_architecture: 'Standard Model serving architecture with a front-end UI.',
        implementation_steps: ['Download dataset and preprocess.', 'Train baseline model.', 'Integrate deployment serving container.', 'Evaluate results and create documentation.'],
        expected_outcomes: 'Inference model meeting performance targets with interactive frontend.',
        future_enhancements: 'Integrate active learning loops.'
      }
    }));
  }

  let publications = [];
  try {
    const parsed = JSON.parse(report.publication_ideas);
    if (Array.isArray(parsed)) {
      publications = parsed.map(p => ({
        title: p.title || 'Untitled Publication Pathway',
        description: p.description || p.desc || '',
        difficulty: p.difficulty || 'MEDIUM',
        technologies: p.technologies || [],
        datasetInfo: p.dataset_info || null,
        developmentTime: p.development_time || '5-6 Months',
        innovationScore: p.innovation_score ?? 8,
        feasibility: p.feasibility || { level: 'Requires Research Resources', reason: '' },
        studentFeasibility: (p.feasibility && p.feasibility.level) || p.student_feasibility || 'Final Year Project',
        publicationPotential: p.publication_potential || 'High',
        careerRelevance: p.career_relevance || [],
        industryDemand: p.industry_demand || 'High',
        roadmap: p.roadmap || null
      }));
    } else {
      throw new Error("Not an array");
    }
  } catch (e) {
    publications = parseTextToList(report.publication_ideas, 'Publication Idea').map(p => ({
      title: p.title,
      description: p.desc || '',
      difficulty: 'MEDIUM',
      technologies: ['PyTorch', 'LaTeX'],
      datasetInfo: { name: 'Suggested Academic Dataset', type: 'Research Dataset', purpose: 'Comparative literature analysis.', source: 'N/A', is_suggested: true },
      developmentTime: '5-6 Months',
      innovationScore: 8,
      feasibility: { level: 'Requires Advanced Research Resources', reason: 'Needs specialized compute resources for comparative benchmarking.' },
      publicationPotential: 'Medium',
      careerRelevance: ['AI Researcher'],
      industryDemand: 'Medium',
      roadmap: {
        problem_statement: p.desc || 'No detailed roadmap available.',
        research_gap: 'Limited comparative research baseline.',
        objectives: ['Define research hypothesis', 'Conduct literature benchmark experiments', 'Write conference draft'],
        system_architecture: 'Proposed scientific baseline evaluation framework.',
        implementation_steps: ['Select model checkpoints.', 'Run comparative evaluation.', 'Analyze precision and recalls.', 'Draft manuscript using target template.'],
        expected_outcomes: 'Detailed comparative analysis paper draft ready for submission.',
        future_enhancements: 'Extend benchmarks to out-of-distribution transfer.',
        publication_opportunities: ['IEEE Access', 'ACM Computing Surveys']
      }
    }));
  }


  const trends = computeTrendsFromPapers(papers);
  const timeline = computeTimelineFromPapersAndReport(papers, report);

  return {
    id: topicName.toLowerCase().replace(/\s+/g, '-'),
    name: topicName,
    topic: topicName,
    summary: {
      executiveSummary: report.executive_summary || 'No summary available.',
      overview: report.overview || 'No overview available.',
      keyTechnologies: keyTechnologies.length > 0 ? keyTechnologies : [{ name: 'Data Mining', desc: 'Parsing scholarly databases.' }]
    },
    literatureReview: report.literature_review || 'No literature review generated.',
    challenges: challenges.length > 0 ? challenges : [{ title: 'Explainability', desc: 'Providing clear audit trails for research inferences.' }],
    gaps: gaps.length > 0 ? gaps : [{ title: 'Standardized Validation Sets', description: 'Need unified benchmarks.', severity: 'High', focus: 'Evaluation' }],
    futureScope: {
      projects: projects.length > 0 ? projects : [{ title: 'Adaptive Predictor Engine', description: 'Distilled local model.', approach: 'Distillation' }],
      publications: publications.length > 0 ? publications : [{ title: 'A Survey of Modern Architectures', description: 'Meta-analysis of systems.', approach: 'Survey Paper' }]
    },
    papers,           // Analysis papers → Research Gaps section
    seminalPapers,    // Separate batch → Seminal Research Papers grid
    trends,
    timeline,
    popularity: 85,
    report
  };
};

export const apiService = {
  // 1. Search Research Topic (calls backend search router, formats response, returns inside an array)
  searchResearchTopic: async (topic) => {
    try {
      const res = await apiClient.get('/search', { params: { topic } });
      const formatted = formatBackendTopic(res.data);
      return formatted ? [formatted] : [];
    } catch (error) {
      console.error('API Search Topic Error:', error);
      throw error;
    }
  },

  // Retrieve topic details (maps to the search endpoint wrapper)
  getTopicDetails: async (topicId) => {
    try {
      const topicName = topicId.replace(/-/g, ' ');
      const results = await apiService.searchResearchTopic(topicName);
      if (results && results.length > 0) {
        return results[0];
      }
      throw new Error(`Topic details not found for ${topicId}`);
    } catch (error) {
      console.error('API Get Topic Details Error:', error);
      throw error;
    }
  },

  // 2. Get Bookmarks
  getBookmarks: async () => {
    try {
      const res = await apiClient.get('/bookmarks');
      return res.data.map(item => ({
        id: item.id,
        name: item.topic,
        topic: item.topic,
        summary: {
          executiveSummary: 'Saved research topic. Click to generate/retrieve the full AI analysis dashboard and citation pathways.',
          keyTechnologies: [{ name: 'Scientific Research', desc: 'Topic listed in the user registry.' }]
        },
        popularity: 80
      }));
    } catch (error) {
      console.error('API Get Bookmarks Error:', error);
      throw error;
    }
  },

  // 3. Save Bookmark
  saveBookmark: async (topicData) => {
    try {
      const topicName = topicData.name || topicData.topic;
      await apiClient.post('/bookmarks', { topic: topicName });
      return apiService.getBookmarks();
    } catch (error) {
      console.error('API Save Bookmark Error:', error);
      throw error;
    }
  },

  // 4. Remove Bookmark
  removeBookmark: async (topicId) => {
    try {
      await apiClient.delete(`/bookmarks/${topicId}`);
      return apiService.getBookmarks();
    } catch (error) {
      console.error('API Remove Bookmark Error:', error);
      throw error;
    }
  },

  // 5. Get Search History
  getHistory: async () => {
    try {
      const res = await apiClient.get('/history');
      return res.data;
    } catch (error) {
      console.error('API Get History Error:', error);
      throw error;
    }
  },

  getSearchHistory: async () => {
    return apiService.getHistory();
  },

  // 6. Clear Search History
  clearHistory: async () => {
    try {
      await apiClient.delete('/history');
      return [];
    } catch (error) {
      console.error('API Clear History Error:', error);
      throw error;
    }
  }
};
