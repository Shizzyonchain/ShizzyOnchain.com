
import React from 'react';
import { AINewsItem } from '../types.ts';
import { ExternalLink, Clock } from 'lucide-react';

interface AINewsCardProps {
  item: AINewsItem;
}

export const AINewsCard: React.FC<AINewsCardProps> = ({ item }) => {
  const dateStr = new Date(item.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group flex flex-col bg-white dark:bg-[#1e293b]/20 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl dark:hover:bg-white/[0.04]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img 
          src={item.image_url} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest font-mono">
            {item.source}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4 text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest">
          <Clock size={12} className="text-blue-500" />
          <span>{dateStr}</span>
        </div>
        
        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-space italic uppercase tracking-tight">
          {item.title}
        </h3>
        
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 font-inter leading-relaxed flex-grow">
          {item.excerpt}
        </p>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
          <span className="text-[9px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em] font-mono group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
            Read Intel <ExternalLink size={12} />
          </span>
        </div>
      </div>
    </a>
  );
};
