
import React, { useState } from 'react';
import { NewsArticle } from '../types.ts';
import { Link2, Check } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    const link = `${window.location.origin}${window.location.pathname}#/article/${article.id}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#1e293b]/20 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 transition-all shadow-2xl dark:shadow-none dark:hover:border-white/10 group">
      {/* Constrained Image Area */}
      <div className="relative w-full aspect-video max-h-[450px] overflow-hidden bg-slate-200 dark:bg-zinc-900 border-b border-slate-100 dark:border-white/5">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover object-center opacity-100 group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
        
        {/* Deep Link Action */}
        <button 
          onClick={handleCopyLink}
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all active:scale-95 group/link z-10"
          title="Share direct link"
        >
          {copied ? <Check size={18} className="text-emerald-400" /> : <Link2 size={18} />}
          {copied && <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-emerald-500 text-[10px] font-black uppercase px-2 py-1 rounded-md">Copied</span>}
        </button>
      </div>

      <div className="p-8 md:p-12 space-y-12">
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
          
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter font-space italic">
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
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {article.snapshots?.map((snap, idx) => (
              <li key={idx} className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="font-black text-slate-900 dark:text-slate-200 uppercase text-[10px] tracking-widest font-mono">{snap.asset}</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-black text-lg">{snap.price}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed font-medium italic">
                  {snap.description}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-10 pt-4">
          <div className="flex items-center gap-4">
             <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-space uppercase">Market Intelligence</h3>
             <div className="flex-grow h-[1px] bg-slate-100 dark:bg-white/5"></div>
          </div>
          <div className="grid grid-cols-1 gap-10">
            {article.content.map((p, i) => (
              <p key={i} className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg font-inter opacity-90 first-letter:text-4xl first-letter:font-black first-letter:text-blue-600 first-letter:mr-1">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
