import React from 'react';
import { HOT_STORIES } from '../constants';
import { Flame, Clock } from 'lucide-react';

interface SidebarProps {
  onStoryClick: (title: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onStoryClick }) => {
  if (HOT_STORIES.length === 0) {
    return null;
  }

  return (
    <aside className="space-y-6">
      <div className="bg-slate-100 dark:bg-[#1e293b]/40 rounded-xl p-6 border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-none transition-colors">
        <div className="flex items-center gap-2 mb-6">
          <Flame size={18} className="text-orange-500" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight font-space uppercase">Shizzy's Hot takes</h3>
        </div>
        <div className="space-y-6">
          {HOT_STORIES.map((story) => (
            <button 
              key={story.id} 
              onClick={() => onStoryClick(story.title)}
              className="group w-full text-left focus:outline-none"
            >
              <h4 className="text-[15px] font-semibold text-slate-700 dark:text-slate-200 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-inter">
                {story.title}
              </h4>
              <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-500 dark:text-slate-500 font-bold font-mono uppercase tracking-widest">
                <Clock size={11} className="text-blue-500" />
                <span>{story.timeAgo}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};