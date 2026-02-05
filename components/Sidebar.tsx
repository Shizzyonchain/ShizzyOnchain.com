
import React from 'react';
import { HOT_STORIES } from '../constants.tsx';
import { Flame, ChevronRight } from 'lucide-react';

interface SidebarProps {
  onStoryClick: (id: string) => void;
  onViewAll?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onStoryClick, onViewAll }) => {
  if (HOT_STORIES.length === 0) {
    return null;
  }

  const displayStories = HOT_STORIES.slice(0, 10);

  const handleStoryClick = (id: string) => {
    window.location.hash = `#/article/${id}`;
  };

  return (
    <aside className="space-y-6">
      <div className="bg-white dark:bg-[#1e293b]/40 rounded-2xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-orange-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-space uppercase">Shizzy's Hot takes</h3>
          </div>
        </div>

        <div className="space-y-8">
          {displayStories.map((story) => (
            <button 
              key={story.id} 
              onClick={() => handleStoryClick(story.id)}
              className="group w-full text-left focus:outline-none block"
            >
              <h4 className="text-[14px] md:text-[15px] font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-inter uppercase">
                {story.title}
              </h4>
            </button>
          ))}
        </div>

        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="w-full mt-10 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2 text-xs font-black font-mono text-blue-600 dark:text-blue-500 hover:text-blue-500 transition-colors uppercase tracking-[0.2em] group"
          >
            View All Insights <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </aside>
  );
};
