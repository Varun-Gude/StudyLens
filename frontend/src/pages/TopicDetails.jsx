import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Compass, Milestone, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import ResearchTimeline from '../components/research/ResearchTimeline';
import Loader from '../components/common/Loader';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

export default function TopicDetails() {
  const { topic: topicId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    fetchTopicData();
  }, [topicId]);

  const fetchTopicData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getTopicDetails(topicId);
      setTopic(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader type="page" />;
  }

  if (!topic) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold">Research topic details not found</h3>
        <Button variant="primary" onClick={() => navigate('/')} className="mt-4">
          Return to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Header Back bar */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Analysis Report
          </span>
          <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-slate-100 mt-1">
            {topic.name}
          </h1>
        </div>
      </div>

      {/* Overview Card */}
      <Card hoverEffect={false} className="p-6 md:p-8 space-y-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
            Literature Assessment & Context
          </h2>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {topic.summary?.executiveSummary}
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed pt-2">
          {topic.literatureReview}
        </p>
      </Card>

      {/* Interactive React Flow Timeline */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <Milestone className="w-4 h-4 text-brand-500" />
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Research Evolution Pathway
          </h2>
        </div>
        <ResearchTimeline timeline={topic.timeline} />
      </div>

    </div>
  );
}
