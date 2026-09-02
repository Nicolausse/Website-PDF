import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import DynamicIcon from './DynamicIcon';

export const ToolCard = ({ tool, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(tool.id)}
      className="group relative flex flex-col justify-between p-6 rounded-2xl glass-card cursor-pointer border border-slate-200/80 dark:border-slate-800/80 hover:border-primary-500/50 dark:hover:border-primary-400/50 hover:shadow-xl hover:shadow-primary-500/5 transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Top Section: Icon and Badge */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-110 transition-transform duration-300`}>
            <DynamicIcon name={tool.icon} className="w-6 h-6" />
          </div>

          {tool.badge && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
              tool.badge.includes('AI') 
                ? 'bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800' 
                : tool.badge.includes('Populer')
                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                : 'bg-primary-100 dark:bg-primary-950/80 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800'
            }`}>
              {tool.badge.includes('AI') && <Sparkles className="w-3 h-3 mr-1 text-violet-500" />}
              {tool.badge}
            </span>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1 mb-1.5">
          {tool.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {tool.description}
        </p>
      </div>

      {/* Bottom Action Section */}
      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-primary-600 dark:text-primary-400">
        <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
          {tool.categoryName}
        </span>
        <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
          <span>Gunakan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default ToolCard;
