
import React from 'react';
import { newsService } from '../services/newsService.ts';
import { Flame, ChevronRight, Zap } from 'lucide-react';

interface SidebarProps {
  onStoryClick: (id: string) => void;
  onViewAll?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onStoryClick, onViewAll }) => {
  const { items } = newsService.getLatestSnapshotItems();

  if (items.length === 0) {
    return null;
  }

  const displayStories = items.slice(0, 10);

  const handleStoryClick = (item: any) => {
    if (item.url.startsWith('http')) {
      window.open(item.url, '_blank');
    } else {
      window.location.hash = item.url;
    }
  };

  return (
    <aside className="space-y-6">
      <div className="bg-white dark:bg-[#1e293b]/40 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-2xl dark:shadow-none transition-colors">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3">
            <Zap size={18} className="text-orange-500 fill-orange-500 animate-pulse" />
            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-[0.2em] font-space uppercase italic">VIDEOS</h3>
          </div>
        </div>

        <div className="space-y-10">
          {displayStories.map((story) => (
            <button 
              key={story.id} 
              onClick={() => handleStoryClick(story)}
              className="group w-full text-left focus:outline-none block space-y-2"
            >
              <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className="w-1 h-1 bg-orange-600 rounded-full"></span>
                <span className="text-[9px] font-black uppercase tracking-widest font-mono text-slate-500 dark:text-slate-400">{story.source}</span>
              </div>
              <h4 className="text-[14px] md:text-[15px] font-black text-slate-800 dark:text-slate-200 leading-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-space uppercase italic">
                {story.title}
              </h4>
            </button>
          ))}
        </div>

        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="w-full mt-12 pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-center gap-2 text-[10px] font-black font-mono text-orange-600 dark:text-orange-500 hover:text-orange-500 transition-colors uppercase tracking-[0.3em] group"
          >
            All Signals <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </aside>
  );
};
