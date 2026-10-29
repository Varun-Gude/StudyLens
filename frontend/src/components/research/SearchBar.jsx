import React, { useState, useEffect } from 'react';
import { Search, Sparkles, X, Clock } from 'lucide-react';
import { apiService } from '../../services/api';

export default function SearchBar({ onSearch, placeholder = 'Search research topics, GNNs, RAG...' }) {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiService.getHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowHistory(false);
      loadHistory(); // Reload history after search
    }
  };

  const handleHistoryItemClick = (item) => {
    setQuery(item);
    onSearch(item);
    setShowHistory(false);
  };

  const clearHistory = async (e) => {
    e.stopPropagation();
    try {
      await apiService.clearHistory();
      setHistory([]);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto z-20">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-slate-300 dark:hover:border-slate-700 transition-all overflow-hidden focus-within:ring-2 focus-within:ring-brand-500/50">
          <div className="pl-4 text-slate-400">
            <Search className="w-5 h-5" />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => setTimeout(() => setShowHistory(false), 200)}
            placeholder={placeholder}
            className="w-full py-4 pl-3 pr-12 text-sm md:text-base text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-24 p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium text-sm flex items-center space-x-1 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore</span>
          </button>
        </div>
      </form>

      {/* History / Suggestions dropdown */}
      {showHistory && history.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden z-30">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-400 font-semibold uppercase tracking-wider">
            <span>Recent Queries</span>
            <button
              onClick={clearHistory}
              className="text-slate-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul className="divide-y divide-slate-50 dark:divide-slate-800">
            {history.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseDown={() => handleHistoryItemClick(item.query)}
                  className="w-full flex items-center space-x-2.5 px-4 py-3 text-left text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="flex-1 truncate">{item.query}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
