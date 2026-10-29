import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export default function TrendChart({ data = [], papers = [] }) {
  const [activeTab, setActiveTab] = useState('publications'); // 'publications' | 'citations' | 'growth'

  // Calculate datasets dynamically
  const hasPapers = papers && papers.length > 0;
  
  // 1. Publications count by year
  let publicationsData = [];
  if (hasPapers) {
    const yearMap = {};
    papers.forEach(p => {
      const yr = p.year;
      if (!yr) return;
      if (!yearMap[yr]) {
        yearMap[yr] = { year: String(yr), count: 0 };
      }
      yearMap[yr].count += 1;
    });
    publicationsData = Object.values(yearMap).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  } else if (data && data.length > 0) {
    publicationsData = data.map(item => ({
      year: String(item.year),
      count: item.publications || 0
    }));
  }

  // 2. Citation Distribution (citations per paper)
  let citationsData = [];
  if (hasPapers) {
    citationsData = papers.map((p, idx) => {
      const shortTitle = p.title && p.title.length > 25 ? p.title.slice(0, 22) + '...' : (p.title || `Paper #${idx + 1}`);
      return {
        name: shortTitle,
        citations: p.citations || 0,
        fullTitle: p.title || 'Untitled'
      };
    }).sort((a, b) => b.citations - a.citations);
  } else if (data && data.length > 0) {
    citationsData = data.map((item, idx) => ({
      name: item.year ? `Year ${item.year}` : `Index ${idx + 1}`,
      citations: item.citations || 0
    }));
  }

  // 3. Research Growth Trend (cumulative citations and publications over time)
  let growthData = [];
  if (hasPapers || (data && data.length > 0)) {
    const baseData = hasPapers 
      ? Object.values(
          papers.reduce((acc, p) => {
            const yr = p.year;
            if (!yr) return acc;
            if (!acc[yr]) acc[yr] = { year: String(yr), publications: 0, citations: 0 };
            acc[yr].publications += 1;
            acc[yr].citations += (p.citations || 0);
            return acc;
          }, {})
        ).sort((a, b) => parseInt(a.year) - parseInt(b.year))
      : [...data].sort((a, b) => parseInt(a.year) - parseInt(b.year));

    let cumulativePubs = 0;
    let cumulativeCits = 0;
    growthData = baseData.map(item => {
      cumulativePubs += (item.publications || item.count || 1);
      cumulativeCits += (item.citations || 0);
      return {
        year: String(item.year),
        'Cumulative Citations': cumulativeCits,
        'Cumulative Publications': cumulativePubs
      };
    });
  }

  // If no data is available
  if (publicationsData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-slate-50 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-sm text-slate-400">No trend metrics available.</p>
      </div>
    );
  }

  return (
    <div className="w-full p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm space-y-6">
      {/* Header and Tabs layout */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Literature Analytics Dashboard
          </h3>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Select a visualization metric below</p>
        </div>
        <div className="flex flex-wrap gap-1.5 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl w-fit border border-slate-200/50 dark:border-slate-800/80">
          <button
            onClick={() => setActiveTab('publications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'publications'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/30'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
            }`}
          >
            Publications by Year
          </button>
          <button
            onClick={() => setActiveTab('citations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'citations'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/30'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
            }`}
          >
            Citation Distribution
          </button>
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'growth'
                ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/30'
                : 'text-slate-500 hover:text-slate-850 dark:hover:text-slate-300'
            }`}
          >
            Research Growth Trend
          </button>
        </div>
      </div>

      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'publications' ? (
            <BarChart data={publicationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#10b981" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="count" name="Publications Count" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : activeTab === 'citations' ? (
            <BarChart data={citationsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#3d52f5" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
                formatter={(value) => [value, 'Citations']}
              />
              <Bar dataKey="citations" name="Paper Citations" fill="#3d52f5" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" className="dark:stroke-slate-800" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6366f1" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  border: 'none',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Line type="monotone" dataKey="Cumulative Citations" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="Cumulative Publications" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
