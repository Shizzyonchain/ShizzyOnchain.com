import React from 'react';
import { NewsArticle } from '../types.ts';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  return (
    <div className="bg-white dark:bg-[#1e293b]/20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/5 transition-all shadow-2xl dark:shadow-none dark:hover:border-white/10 group">
      <div className="relative w-full overflow-hidden bg-slate-200 dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-auto min-h-[300px] object-cover opacity-100 group-hover:scale-[1.02] transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none"></div>
      </div>

      <div className="p-8 md:p-10 space-y-10">
        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="bg-blue-600 text-white text-[11px] font-black px-3 py-1.5 rounded-md uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 font-mono">
              {article.category}
            </span>
            <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-bold font-mono uppercase tracking-widest">
              <span className="text-blue-500">BY {article.author}</span>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
              <span>{article.timestamp}</span>
            </div>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.2] tracking-tighter font-space">
            {article.title}
          </h2>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium border-l-[6px] border-blue-500/60 pl-8 py-2">
            {article.summary}
          </p>
        </div>

        <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-2xl border border-slate-100 dark:border-white/5">
          <h3 className="text-blue-600 dark:text-blue-400 font-black text-[11px] mb-6 uppercase tracking-[0.4em] font-space flex items-center gap-3">
            <span className="w-8 h-[1px] bg-blue-500/30"></span>
            Crypto Snapshot
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.snapshots?.map((snap, idx) => (
              <li key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="font-black text-slate-900 dark:text-slate-200 uppercase text-xs tracking-widest font-mono">{snap.asset}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-black text-base">{snap.price}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium italic">
                  {snap.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-8 pt-4">
          <div className="flex items-center gap-4">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-space uppercase">Market Intelligence</h3>
             <div className="flex-grow h-[1px] bg-slate-100 dark:bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {article.content.map((p, i) => (
              <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-inter opacity-90">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};