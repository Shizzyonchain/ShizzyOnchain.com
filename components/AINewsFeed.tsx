
import React, { useState, useEffect } from 'react';
import { newsService } from '../services/newsService.ts';
import { AINewsItem } from '../types.ts';
import { SOCIAL_LINKS } from '../constants.tsx';
import { ExternalLink, Zap, Clock, TrendingUp } from 'lucide-react';

export const AINewsFeed: React.FC = () => {
  const [snapshotData, setSnapshotData] = useState(() => newsService.getLatestSnapshotItems());
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Manual sync is simple now
    setIsSyncing(true);
    setTimeout(() => {
      setSnapshotData(newsService.getLatestSnapshotItems());
      setIsSyncing(false);
    }, 500);
  }, []);

  const { items, lastUpdate } = snapshotData;

  const lastUpdateStr = lastUpdate 
    ? new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="max-w-[1000px] mx-auto space-y-16 animate-in fade-in duration-1000 py-10">
      {/* High-Impact Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-lg border border-blue-600/20 shadow-sm">
          <Zap size={12} fill="currentColor" className="animate-pulse" />
          MANUAL INTELLIGENCE INGRESS ACTIVE
        </div>
        <h1 className="text-6xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
          AI <span className="text-blue-600">NEWS</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl mx-auto leading-relaxed">
          The only 5 signals that actually matter in AI right now. Zero noise. All signal.
        </p>
      </div>

      {/* The List */}
      <div className="space-y-6">
        {items.map((item, idx) => (
          <a 
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center gap-8 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-8 md:p-12 rounded-[2.5rem] transition-all duration-500 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-white/5 shadow-sm hover:shadow-2xl active:scale-[0.99] overflow-hidden"
          >
            {/* Number Background */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 text-[180px] font-black text-slate-100 dark:text-white/[0.02] pointer-events-none italic font-space leading-none select-none">
              {idx + 1}
            </div>

            <div className="relative flex-grow flex flex-col md:flex-row items-center gap-10">
              <div className="w-full md:w-[320px] aspect-video overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 shrink-0 shadow-lg">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
              </div>

              <div className="space-y-4 flex-grow">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest font-mono">
                    {item.source}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-bold font-mono">
                    <Clock size={12} /> {new Date(item.published_at).toLocaleDateString()}
                  </div>
                </div>

                <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.1] font-space italic uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>

                <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed line-clamp-2">
                  {item.excerpt}
                </p>

                <div className="pt-4 flex items-center gap-2 text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] font-mono group-hover:translate-x-2 transition-transform">
                  READ INTELLIGENCE <ExternalLink size={14} className="text-blue-600" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Footer Diagnostic */}
      <div className="pt-10 flex flex-col items-center justify-center gap-6 opacity-60">
        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">
          <img src={SOCIAL_LINKS.logo} alt="Logo" className="w-5 h-5 object-contain" />
          Node Health: Optimized
        </div>
        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest text-center">
          Curated by ShizzyOnChain • Updated {lastUpdateStr}
        </p>
      </div>
    </div>
  );
};
