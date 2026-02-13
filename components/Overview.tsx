
import React from 'react';
import { SOCIAL_LINKS, OVERVIEW_CONTENT, DAILY_RIP_POSTS } from '../constants.tsx';
import { ExternalLink, Mail, Send, Zap, ArrowRight, MessageSquare, Quote, ChevronRight } from 'lucide-react';
import { newsService } from '../services/newsService.ts';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Overview: React.FC = () => {
  const { items: aiItems } = newsService.getLatestSnapshotItems();
  const latestArticle = aiItems[0]; 
  
  const socialItems = [
    { label: 'Shizzy (X)', url: SOCIAL_LINKS.x, icon: <div className="bg-zinc-900 dark:bg-black p-2.5 rounded-xl"><XIcon className="w-5 h-5 text-white" /></div> },
  ];

  const handleArticleClick = (id?: string) => {
    const targetId = id || latestArticle?.id;
    if (targetId) window.location.hash = `#/article/${targetId}`;
  };

  const navigateToAllRips = () => {
    window.location.hash = `#/daily-rips`;
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-32 animate-in fade-in duration-1000 pb-20">
      
      <section className="space-y-16">
        <div className="relative w-full aspect-[21/9] rounded-[2rem] lg:rounded-[4rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-black shadow-2xl">
          <img src={SOCIAL_LINKS.heroImage} alt="Shizzy Hero" className="w-full h-full object-contain opacity-90 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-20">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-[0.9] border-l-8 border-blue-600 pl-8">
                UNCHAINED <span className="text-blue-600">MEDIA</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">{OVERVIEW_CONTENT.intro}</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest font-space">The Mission</h3>
                 <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 font-inter italic leading-relaxed">
                {OVERVIEW_CONTENT.philosophy}
              </p>
            </div>

            {latestArticle && (
              <div className="space-y-10 group cursor-pointer pt-10" onClick={() => handleArticleClick()}>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-600/20 flex items-center gap-2">
                    <Zap size={12} className="fill-current animate-pulse" /> NEWEST SIGNAL
                  </div>
                  <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
                </div>
                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-zinc-900 shadow-xl group-hover:border-blue-500/50 transition-all duration-500">
                  <img src={latestArticle.image_url} alt={latestArticle.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000 ease-out" />
                </div>
                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter font-space uppercase italic group-hover:text-blue-600 transition-colors duration-300">{latestArticle.title}</h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-2 font-inter leading-relaxed max-w-3xl">{latestArticle.excerpt}</p>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform duration-300">READ FULL SIGNAL <ArrowRight size={16} /></div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-12 sticky top-32">
              <div className="space-y-10">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] text-left font-mono">SOCIAL CHANNELS</h3>
                <div className="space-y-6">
                  {socialItems.map((item, idx) => (
                    <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group transition-all">
                      <div className="flex items-center gap-6">
                        <div className="shrink-0 transition-transform group-hover:scale-110 duration-300">{item.icon}</div>
                        <span className="text-lg font-black text-slate-900 dark:text-slate-200 uppercase tracking-tight font-space italic group-hover:text-blue-500 transition-colors">{item.label}</span>
                      </div>
                      <ExternalLink size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-10 border-t border-slate-200 dark:border-white/10 space-y-6">
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">CONNECT</div>
                 <div className="space-y-4">
                   <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-4 text-blue-600 dark:text-blue-400 hover:text-blue-300 transition-colors text-lg font-black font-mono tracking-tight"><Mail size={22} /> {SOCIAL_LINKS.email}</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-8 border-slate-900 dark:border-white pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                <MessageSquare size={12} fill="currentColor" /> HIGH SIGNAL
              </div>
              <h3 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic leading-none">THE DAILY <span className="text-red-600">RIP</span></h3>
           </div>
           <button 
              onClick={navigateToAllRips}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 hover:text-blue-500 transition-colors group"
           >
              ALL DAILY RIPS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DAILY_RIP_POSTS.slice(0, 10).map((post) => (
            <div key={post.id} className="relative group bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2rem] p-8 space-y-8 hover:border-red-500/30 transition-all duration-500 shadow-sm hover:shadow-2xl flex flex-col h-full">
              <div className="absolute top-6 right-8 text-slate-100 dark:text-white/5 -z-0 pointer-events-none">
                <Quote size={80} strokeWidth={4} />
              </div>
              <div className="flex flex-col relative z-10">
                <span className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-space italic leading-none">{post.author}</span>
                <span className="text-xs font-mono font-bold text-red-600 uppercase tracking-widest mt-1.5">{post.handle}</span>
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
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
