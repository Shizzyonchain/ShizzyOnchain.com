import React from 'react';
import { AI_HISTORY_TIMELINE, SOCIAL_LINKS } from '../constants.tsx';
import { Library, Zap, ChevronRight, Info } from 'lucide-react';

export const AIHistory: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop';
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-32 animate-in fade-in duration-1000 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-indigo-600/20">
            <Library size={10} strokeWidth={3} className="animate-pulse" />
            VISUAL ARCHIVE NODE ACTIVE
          </div>
          <h1 className="text-6xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            HISTORY <span className="text-indigo-600">OF AI</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-2xl leading-relaxed italic">
            The complete timeline of the intelligence revolution. From Turing’s core question to the autonomous agent supercycle.
          </p>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex items-center gap-6">
           <div className="text-right">
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Time Elapsed</div>
              <div className="text-2xl font-black font-space text-slate-900 dark:text-white italic">76 YEARS</div>
           </div>
           <div className="w-[1px] h-10 bg-slate-100 dark:bg-white/10"></div>
           <div>
              <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Current Phase</div>
              <div className="text-2xl font-black font-space text-indigo-600 italic">AGENTIC</div>
           </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="space-y-40">
        {AI_HISTORY_TIMELINE.map((era, eraIdx) => (
          <section key={eraIdx} className="space-y-16">
            <div className="flex items-center gap-6">
               <div className="h-px flex-grow bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
               <h2 className="text-2xl md:text-4xl font-black font-space text-slate-900 dark:text-white uppercase italic tracking-widest opacity-40">
                 {era.era}
               </h2>
               <div className="h-px flex-grow bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {era.events.map((event, eventIdx) => (
                <div key={eventIdx} className="group relative flex flex-col space-y-8">
                  <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-zinc-900 shadow-2xl transition-all duration-700 group-hover:border-indigo-500/50 group-hover:-translate-y-2">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      onError={handleImageError}
                      className="w-full h-full object-cover opacity-80 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60"></div>
                    
                    <div className="absolute top-8 left-8">
                       <span className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl font-mono">
                         {event.date}
                       </span>
                    </div>

                    <div className="absolute bottom-10 left-8 right-8 space-y-4">
                       <h3 className="text-3xl font-black text-white font-space uppercase italic tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">
                         {event.title}
                       </h3>
                    </div>
                  </div>

                  <div className="px-4 space-y-6">
                    <p className="text-lg text-slate-600 dark:text-slate-400 font-inter leading-relaxed italic border-l-4 border-indigo-600 pl-6">
                      "{event.description}"
                    </p>
                    
                    <div className="bg-slate-50 dark:bg-white/[0.03] p-6 rounded-2xl border border-slate-100 dark:border-white/5 space-y-3">
                       <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-indigo-500 font-mono">
                          <Info size={12} /> INTELLIGENCE LOG: IMPACT
                       </div>
                       <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic">
                         {event.impact}
                       </p>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-500 transition-colors">
                       ARCHIVE ENTRY LOGGED <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* FOOTER */}
      <div className="pt-32 border-t border-slate-200 dark:border-white/5 flex flex-col items-center gap-12">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          END OF ARCHIVE TRANSMISSION
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
        
        <div className="bg-slate-900 dark:bg-white p-8 rounded-[3rem] w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
           <div className="space-y-2 text-center md:text-left">
              <h4 className="text-2xl font-black text-white dark:text-black font-space uppercase italic tracking-tighter">THE FUTURE IS UNWRITTEN</h4>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Shizzy Unchained Intelligence Hub</p>
           </div>
           <button 
             onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
             className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-xl active:scale-95"
           >
             RETURN TO START
           </button>
        </div>

        <img src={SOCIAL_LINKS.logo} alt="Logo" className="h-16 opacity-50 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
};
