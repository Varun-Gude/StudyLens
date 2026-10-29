import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bookmark, Sparkles, AlertCircle, FileText, Lightbulb, Library, Compass } from 'lucide-react';
import { apiService } from '../services/api';
import PaperCard from '../components/research/PaperCard';
import ResearchSummary from '../components/research/ResearchSummary';
import ResearchGapCard from '../components/research/ResearchGapCard';
import FutureScopeCard from '../components/research/FutureScopeCard';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Card from '../components/common/Card';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [sortBy, setSortBy] = useState('citations');
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < 5 ? prev + 1 : prev));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (query) {
      performSearch();
    } else {
      setLoading(false);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const results = await apiService.searchResearchTopic(query);
      if (results && results.length > 0) {
        const topic = results[0];
        setTopicData(topic);
        checkBookmarkStatus(topic.id);
      } else {
        setTopicData(null);
      }
    } catch (e) {
      console.error(e);
      const msg = e.response?.data?.detail || e.message || 'Unable to retrieve research insights';
      setError(msg);
      setTopicData(null);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async (topicId) => {
    try {
      const list = await apiService.getBookmarks();
      setIsBookmarked(list.some(b => b.id === topicId));
    } catch (e) {
      console.error(e);
    }
  };

  const toggleBookmark = async () => {
    if (!topicData) return;
    try {
      if (isBookmarked) {
        await apiService.removeBookmark(topicData.id);
      } else {
        await apiService.saveBookmark(topicData);
      }
      setIsBookmarked(!isBookmarked);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    const steps = [
      "Fetching seminal research papers from OpenAlex...",
      "Analyzing literature metadata & author citations...",
      "Generating AI executive summaries & context...",
      "Identifying open research gaps & limitations...",
      "Extracting future engineering concepts & projects...",
      "Structuring the final literature visualization timeline..."
    ];
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-md">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-6 text-base text-slate-100 font-extrabold tracking-wider animate-pulse max-w-md text-center">
          {steps[loadingStep]}
        </p>
        <span className="mt-2 text-xs text-slate-500">Please hold on, synthesizing knowledge...</span>
      </div>
    );
  }

  // Seminal papers grid uses a DIFFERENT set than the research gaps analysis papers.
  // Falls back to analysis papers only if the seminal list is empty (offline/cached responses).
  const seminalPaperSource = (topicData?.seminalPapers?.length > 0)
    ? topicData.seminalPapers
    : topicData?.papers || [];

  const sortedPapers = [...seminalPaperSource].sort((a, b) => {
      if (sortBy === 'citations') {
        return (b.citations || 0) - (a.citations || 0);
      } else if (sortBy === 'year') {
        return (b.year || 0) - (a.year || 0);
      }
      return 0;
    });

  if (!query) {
    return (
      <div className="py-20">
        <EmptyState
          title="No search query entered"
          description="Type a search topic (such as 'Machine Learning in Healthcare') to get AI-powered insights."
          actionText="Back to Home"
          onActionClick={() => navigate('/')}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20">
        <EmptyState
          title="Unable to load research insights"
          description={typeof error === 'string' ? error : 'A server error occurred while retrieving research insights. Please try again.'}
          actionText="Retry Search"
          onActionClick={performSearch}
        />
      </div>
    );
  }

  if (!topicData) {
    return (
      <div className="py-20">
        <EmptyState
          title="No research topics found"
          description={`No research papers or literature could be analyzed for "${query}". Try searching for another topic.`}
          actionText="Back to Home"
          onActionClick={() => navigate('/')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-10 py-6 max-w-6xl mx-auto">
      {/* Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
              Research Explorer
            </span>
            <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1 flex items-center gap-2">
              <span>{topicData.name}</span>
            </h1>
          </div>
        </div>

        {/* Explore details & Bookmarks Actions */}
        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="md" onClick={() => navigate(`/topic/${topicData.id}`)}>
            <Compass className="w-4 h-4 mr-1.5" />
            <span>Interactive Timeline</span>
          </Button>

          <button
            onClick={toggleBookmark}
            className={`p-3 rounded-xl border transition-all flex items-center space-x-1.5 text-xs font-semibold ${
              isBookmarked
                ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/30 dark:border-brand-900 dark:text-brand-400'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            <span>{isBookmarked ? 'Topic Saved' : 'Bookmark Topic'}</span>
          </button>
        </div>
      </div>

      {/* AI Summary and Technologies */}
      <section>
        <ResearchSummary summary={topicData.summary} />
      </section>

      {/* Literature Review Panel */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Literature Review History
        </h3>
        <Card hoverEffect={false} className="p-6 md:p-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-brand-50 dark:bg-brand-950/20 text-brand-500 rounded-lg">
              <Library className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Historical Foundations</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {topicData.literatureReview}
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Identified Research Gaps Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span>Identified Research Gaps</span>
        </h3>
        
        {/* List of paper-specific cards */}
        <div className="space-y-4">
          {topicData.papers?.map((paper, i) => (
            <ResearchGapCard key={i} paper={paper} topicGaps={topicData.gaps} />
          ))}
        </div>

        {/* Common Research Gap Patterns Summary Section */}
        <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg space-y-3 font-sans">
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Common Research Gap Patterns
          </h4>
          <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
            {topicData.gaps?.map((gap, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2 select-none">•</span>
                <span>{gap.title && gap.title !== 'Research Gap' ? `${gap.title}: ${gap.description}` : gap.description}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-slate-400 mt-2 italic">
            This section summarizes the most common gaps found across all analyzed papers.
          </p>
        </div>
      </section>

      {/* Key Research Challenges Section */}
      <section className="space-y-4">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span>Key Research Challenges</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topicData.challenges?.map((chall, idx) => (
            <Card key={idx} hoverEffect={true} className="p-5 hover:border-slate-300 dark:hover:border-slate-700">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{chall.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{chall.desc}</p>
            </Card>
          ))}
        </div>
      </section>


      {/* Future Scope Opportunities */}
      <section className="space-y-6">
        <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-brand-500" />
          <span>Future Research Opportunities</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Ideas */}
          {topicData.futureScope?.projects?.map((proj, idx) => (
            <FutureScopeCard key={idx} scope={proj} type="project" />
          ))}

          {/* Publication Ideas */}
          {topicData.futureScope?.publications?.map((pub, idx) => (
            <FutureScopeCard key={idx} scope={pub} type="publication" />
          ))}
        </div>
      </section>

      {/* Scholarly Seminal Papers */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Library className="w-4 h-4 text-brand-500" />
            <span>Seminal Research Papers</span>
            {sortedPapers.length > 0 && (
              <span className="text-[10px] font-bold bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/50 px-1.5 py-0.5 rounded-full">
                {sortedPapers.length} papers
              </span>
            )}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300 font-semibold focus:outline-none focus:border-brand-500 transition-colors"
            >
              <option value="citations">Citations (High to Low)</option>
              <option value="year">Publication Year (Newest First)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedPapers.map((paper) => (
            <PaperCard key={paper.id} paper={paper} />
          ))}
        </div>
      </section>
    </div>
  );
}
