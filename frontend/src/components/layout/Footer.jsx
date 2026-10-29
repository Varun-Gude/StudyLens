import React from 'react';
import { GraduationCap, Github, Mail, ShieldAlert } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-brand-500 rounded-lg text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold tracking-tight text-slate-900 dark:text-white">
                StudyLens
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              Discover and chart the landscape of scientific fields. An AI-powered semantic graph mapping the pathways of academic progress.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a href="https://scholar.google.com" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400">
                  Google Scholar
                </a>
              </li>
              <li>
                <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-600 hover:text-brand-500 dark:text-slate-400 dark:hover:text-brand-400">
                  arXiv e-Print
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Contact */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>support@StudyLens.org</span>
              </li>
              <li className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <ShieldAlert className="w-4 h-4 text-slate-400" />
                <span>Security Guidelines</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} StudyLens. All rights reserved. Built for modern academic exploration.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <a href="#" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
