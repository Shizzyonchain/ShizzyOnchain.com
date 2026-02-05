import React, { useState } from 'react';
import { cryptoNewsService } from '../services/cryptoNewsService.ts';
import { SOCIAL_LINKS } from '../constants.tsx';
import { Clock, ArrowRight } from 'lucide-react';

interface CryptoNewsFeedProps {
  hideHeader?: boolean;
}

export const CryptoNewsFeed: React.FC<CryptoNewsFeedProps> = ({ hideHeader = false }) => {
  const [snapshotData] = useState(() => cryptoNewsService.getLatestItems());

  const { items, lastUpdate } = snapshotData;

  const lastUpdateStr = lastUpdate 
    ? new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const navigateToArticle = (id: string) => {
    window.location.hash = `#/article/${id}`;
  };

  return (
    <div className={`max-w-[1000px] mx-auto space-y-16 animate-in fade-in duration-1000 ${hideHeader ? 'py-0' : 'py-10'} px-4`}>
      {/* High-Impact Header - Conditional */}
      {!hideHeader && (
        <div className="text-center space-y-6">
          <h1 className="text-6xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
            CRYPTO <span className="text-emerald-500">NEWS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
            The critical events shaping the global crypto landscape.
          </p>
        </div>
      )}

      {/* The Article List */}
      <div className="space-y-6">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => navigateToArticle(item.id)}
            className="group w-full text-left relative border border-slate-200 dark:border-white/5 rounded-[2rem] transition-all duration-500 overflow-hidden bg-white dark:bg-white/[0.02] hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-8 focus:outline-none"
          >
            <div className="w-full md:w-48 aspect-video md:aspect-square shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-zinc-900">
              <img 
                src={item.image_url} 
                alt={item.title} 
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
            </div>

            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
                  {item.source}
                </span>
              </div>
              
              <h2 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white leading-[1.2] font-space italic uppercase tracking-tight group-hover:text-emerald-500 transition-colors">
                {item.title}
              </h2>

              <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base line-clamp-2 font-inter leading-relaxed">
                {item.excerpt}
              </p>
            </div>
            
            <div className="shrink-0 p-4 rounded-full border border-slate-200 dark:border-white/10 text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-500/50 transition-all group-hover:translate-x-1">
              <ArrowRight size={24} />
            </div>
          </button>
        ))}
      </div>

      {/* Footer Diagnostic - Conditional */}
      {!hideHeader && (
        <div className="pt-10 flex flex-col items-center justify-center gap-6 opacity-60">
          <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">
            <img src={SOCIAL_LINKS.logo} alt="Logo" className="w-5 h-5 object-contain" />
            UNCHAINED SIGNAL: VERIFIED
          </div>
          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center">
            SHIZZY MEDIA NODE • LAST SYNC {lastUpdateStr}
          </p>
        </div>
      )}
    </div>
  );
};