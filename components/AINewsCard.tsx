
import React from 'react';
import { AINewsItem } from '../types.ts';
import { ExternalLink, Clock, Zap } from 'lucide-react';

interface AINewsCardProps {
  item: AINewsItem;
}

export const AINewsCard: React.FC<AINewsCardProps> = ({ item }) => {
  const dateStr = new Date(item.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <div className="relative group flex flex-col h-full">
      <a 
        href={item.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex flex-col h-full bg-white dark:bg-[#1e293b]/20 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl dark:hover:bg-white/[0.04] active:scale-[0.98] cursor-pointer"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5">
          <img 
            src={item.image_url} 
            alt={item.title}
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out opacity-90 group-hover:opacity-100"
            loading="lazy"
          />
          <div className="absolute top-5 left-5">
            <span className="bg-black/80 backdrop-blur-xl text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em] font-mono border border-white/10 shadow-lg flex items-center gap-2">
              <Zap size={10} className="text-blue-500 fill-blue-500" />
              {item.source}
            </span>
          </div>
        </div>
        
        <div className="p-8 flex flex-col flex-grow bg-gradient-to-b from-transparent to-slate-50/30 dark:to-white/[0.01]">
          <div className="flex items-center gap-3 mb-5 text-[10px] font-bold font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            <Clock size={12} className="text-blue-500" />
            <span>{dateStr}</span>
          </div>
          
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white leading-[1.15] mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-space italic uppercase tracking-tight">
            {item.title}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-8 font-inter leading-relaxed flex-grow opacity-80 group-hover:opacity-100 transition-opacity">
            {item.excerpt}
          </p>
          
          <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-white/5">
            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] font-mono inline-flex items-center gap-2 group-hover:translate-x-1 transition-transform">
              OPEN INTELLIGENCE SOURCE <ExternalLink size={14} />
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};
