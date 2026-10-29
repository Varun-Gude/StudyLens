import React, { useState, useEffect } from 'react';
import { Bookmark, ExternalLink, Share2, Quote, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

export default function PaperCard({ paper, onBookmarkToggle }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkBookmarkStatus();
  }, [paper]);

  const checkBookmarkStatus = async () => {
    try {
      const bookmarks = await apiService.getBookmarks();
      setIsBookmarked(bookmarks.some((b) => b.id === paper.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleBookmark = async () => {
    try {
      await apiService.saveBookmark(paper);
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(paper);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCitation = () => {
    const citation = `${paper.authors}. (${paper.year}). "${paper.title}." *${paper.journal}*.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all">
      <div className="space-y-3">
        {/* Header Metadata */}
        <div className="flex items-start justify-between">
          <span className="text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {paper.journal ? paper.journal.split(' ')[0] : 'Conference'}
          </span>
          <span className="text-xs text-slate-400 font-medium">Published: {paper.year}</span>
        </div>

        {/* Paper Title */}
        <h3 className="text-base md:text-lg font-bold text-slate-800 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 leading-snug">
          <a href={paper.url || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1">
            {paper.title}
            <ExternalLink className="w-4 h-4 shrink-0 inline text-slate-400 group-hover:text-brand-500" />
          </a>
        </h3>

        {/* Authors */}
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium italic">
          {paper.authors}
        </p>

        {/* Abstract */}
        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
          {paper.abstract}
        </p>

        {/* Research Gap & Assumption Section */}
        {(paper.researchGap || paper.researchAssumption) && (
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 text-left">
            {paper.researchGap && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-rose-500 dark:text-rose-450 uppercase tracking-widest block">
                  Identified Research Gap
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/30 dark:border-rose-900/20 p-2.5 rounded-lg font-medium">
                  {paper.researchGap}
                </p>
              </div>
            )}
            
            {paper.researchAssumption && (
              <div className="space-y-1">
                <span className="text-[10px] font-black text-emerald-500 dark:text-emerald-450 uppercase tracking-widest block">
                  Research Assumption
                </span>
                <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/20 p-2.5 rounded-lg font-medium">
                  {paper.researchAssumption}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <div className="flex items-center space-x-2">
          {/* Cite trigger */}
          <button
            onClick={handleCopyCitation}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Copy BibTeX style citation"
          >
            {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Quote className="w-4 h-4" />}
          </button>

          {/* Bookmark toggle */}
          <button
            onClick={handleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked
                ? 'text-brand-500 bg-brand-50 dark:bg-brand-950/20'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </Card>
  );
}
