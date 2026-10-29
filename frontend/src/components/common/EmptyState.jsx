import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Search,
  title = 'No results found',
  description = 'Try adjusting your search terms or keywords.',
  actionText,
  onActionClick
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 max-w-md mx-auto shadow-sm">
      <div className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full">
        <Icon className="w-8 h-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionText && onActionClick && (
        <Button variant="secondary" size="sm" onClick={onActionClick}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
