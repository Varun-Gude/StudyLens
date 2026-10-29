import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, ArrowUpRight, Compass, Library } from 'lucide-react';
import { apiService } from '../services/api';
import Card from '../components/common/Card';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';

export default function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = async () => {
    setLoading(true);
    try {
      const data = await apiService.getBookmarks();
      setBookmarks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (e, topicId) => {
    e.stopPropagation(); // Prevent card navigation trigger
    try {
      const updated = await apiService.removeBookmark(topicId);
      setBookmarks(updated);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return <Loader type="page" />;
  }

  return (
    <div className="space-y-8 py-6 max-w-6xl mx-auto">
      {/* Title */}
      <div className="flex items-center space-x-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        <Library className="w-5 h-5 text-brand-500" />
        <h1 className="text-xl md:text-3xl font-black text-slate-800 dark:text-slate-100">
          Saved Research Domain Registry
        </h1>
        <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
          {bookmarks.length} Domains
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-16">
          <EmptyState
            icon={Bookmark}
            title="Registry is currently empty"
            description="Explore scientific topics from the home search page and click 'Bookmark Topic' to keep track of your literature lists."
            actionText="Go to Search"
            onActionClick={() => navigate('/')}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarks.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => navigate(`/search?q=${encodeURIComponent(topic.name)}`)}
              className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {topic.summary?.keyTechnologies?.[0]?.name || 'Scientific Research'}
                  </span>
                  
                  {/* Remove Button */}
                  <button
                    onClick={(e) => handleRemoveBookmark(e, topic.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors flex items-center justify-between">
                    <span>{topic.name}</span>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-brand-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </h3>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {topic.summary?.executiveSummary}
                  </p>
                </div>
              </div>

              {/* View Timeline Action */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Literature Popularity: {topic.popularity}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/topic/${topic.id}`);
                  }}
                  className="flex items-center space-x-1 font-bold text-brand-600 dark:text-brand-400 hover:underline"
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
