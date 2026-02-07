import React from 'react';
import { DAILY_RIP_POSTS } from '../constants.tsx';
import { MessageSquare, Quote, ArrowRight, ChevronLeft } from 'lucide-react';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const DailyRipsFeed: React.FC = () => {
  const onBack = () => {
    window.location.hash = '#/home';
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-16 animate-in fade-in duration-1000 px-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-8 border-slate-900 dark:border-white pb-10">
         <div className="space-y-6">
            <button 
              onClick={onBack}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-600 transition-colors group"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              BACK TO TERMINAL
            </button>
            <div className="space-y-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                 <MessageSquare size={12} fill="currentColor" /> INTELLIGENCE FEED
               </div>
               <h1 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic leading-none">THE DAILY <span className="text-red-600">RIP</span></h1>
            </div>
         </div>
         <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-sm text-right leading-relaxed italic">
           Full intelligence archive. History of market recalibrations and architectural shifts.
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {DAILY_RIP_POSTS.map((post) => (
          <div 
            key={post.id} 
            className="relative group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 space-y-8 hover:border-red-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-red-500/5 flex flex-col h-full"
          >
            <div className="absolute top-6 right-8 text-slate-100 dark:text-white/5 -z-0 pointer-events-none">
              <Quote size={80} strokeWidth={4} />
            </div>

            <div className="flex flex-col relative z-10">
              <a 
                href={post.profileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col hover:opacity-80 transition-opacity w-fit"
              >
                <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-space italic leading-none">{post.author}</span>
                <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mt-1.5">{post.handle}</span>
              </a>
            </div>

            <div className="relative z-10 flex-grow pt-4">
              <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed font-inter italic">
                "{post.content}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 font-mono">
                <XIcon className="w-3.5 h-3.5" /> INTELLIGENCE LOGGED
              </div>
              <a 
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 transition-transform group-hover:translate-x-1 p-2"
              >
                <ArrowRight size={22} />
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 flex justify-center pb-20">
         <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 font-mono">
            <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/5"></div>
            END OF ARCHIVE TRANSMISSION
            <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/5"></div>
         </div>
      </div>
    </div>
  );
};