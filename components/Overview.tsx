import React from 'react';
import { SOCIAL_LINKS, OVERVIEW_CONTENT, DAILY_RIP_POSTS } from '../constants.tsx';
import { Youtube, ExternalLink, Mail, Twitch, Send, Zap, ArrowRight, MessageSquare, Quote, ChevronRight } from 'lucide-react';
import { newsService } from '../services/newsService.ts';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={`${className} fill-current`} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.72.42-1.24 1.16-1.31 1.97-.05.41-.02.82.08 1.22.17.61.63 1.15 1.18 1.44.58.33 1.25.43 1.9.36.83-.09 1.59-.57 2.01-1.29.3-.51.44-1.1.45-1.7.02-3.11-.01-6.22.01-9.33z"/>
  </svg>
);

export const Overview: React.FC = () => {
  const { items: aiItems } = newsService.getLatestSnapshotItems();
  const latestArticle = aiItems[0]; 

  const socialItems = [
    { label: 'Shizzy (X)', url: SOCIAL_LINKS.x, icon: <div className="bg-zinc-900 dark:bg-black p-2.5 rounded-xl"><XIcon className="w-5 h-5 text-white" /></div> },
    { label: 'Shizzy Unchained', url: SOCIAL_LINKS.xUnchained, icon: <div className="bg-blue-600 p-2.5 rounded-xl"><XIcon className="w-5 h-5 text-white" /></div> },
    { label: 'YouTube', url: SOCIAL_LINKS.youtube, icon: <div className="bg-red-600 p-2.5 rounded-xl"><Youtube className="w-5 h-5 text-white" /></div> },
    { label: 'Twitch', url: SOCIAL_LINKS.twitch, icon: <div className="bg-purple-600 p-2.5 rounded-xl"><Twitch className="w-5 h-5 text-white" /></div> },
    { label: 'TikTok', url: SOCIAL_LINKS.tiktok, icon: <div className="bg-black p-2.5 rounded-xl"><TikTokIcon className="w-5 h-5 text-white" /></div> },
  ];

  const handleArticleClick = (id?: string) => {
    const targetId = id || latestArticle?.id;
    if (targetId) window.location.hash = `#/article/${targetId}`;
  };

  const navigateToAllRips = () => {
    window.location.hash = `#/daily-rips`;
  };

  const philosophyBody = OVERVIEW_CONTENT.philosophy.replace(/^AI Needs Crypto\. Crypto Needs AI\.\n\n/, '');

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-32 animate-in fade-in duration-1000 pb-20">
      
      {/* 1. BRAND HERO SECTION */}
      <section className="space-y-16">
        <div className="relative w-full aspect-[21/9] rounded-[2rem] lg:rounded-[4rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-black shadow-2xl">
          <img src={SOCIAL_LINKS.heroImage} alt="Shizzy Hero" className="w-full h-full object-contain opacity-90 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-20">
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-[0.9] border-l-8 border-blue-600 pl-8">
                INNOVATION FIRST <span className="text-blue-600">MEDIA</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">{OVERVIEW_CONTENT.intro}</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest font-space">AI Needs Crypto. Crypto Needs AI.</h3>
                 <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
              </div>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-loose text-lg font-inter italic">
                {philosophyBody.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
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
                  <img src={latestArticle.image_url} alt={latestArticle.title} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
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
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] text-left font-mono">SHIZZY UNCHAINED CONTENT LINKS</h3>
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
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] font-mono">CONNECT WITH SHIZZY</div>
                 <div className="space-y-4">
                   <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-4 text-blue-600 dark:text-blue-400 hover:text-blue-300 transition-colors text-lg font-black font-mono tracking-tight"><Mail size={22} /> {SOCIAL_LINKS.email}</a>
                   <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-blue-600 dark:text-blue-400 hover:text-blue-300 transition-colors text-lg font-black font-mono tracking-tight"><Send size={22} /> @Shizzyunchained</a>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE DAILY RIP SECTION */}
      <section className="pt-20 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-8 border-slate-900 dark:border-white pb-10">
           <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-sm">
                <MessageSquare size={12} fill="currentColor" /> HIGH SIGNAL INTELLIGENCE
              </div>
              <h3 className="text-6xl md:text-9xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic leading-none">THE DAILY <span className="text-red-600">RIP</span></h3>
           </div>
           <div className="flex flex-col items-end gap-4">
             <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-sm text-right leading-relaxed italic">
               No noise. Pure market intelligence. Curated for the few who actually listen.
             </p>
             <button 
                onClick={navigateToAllRips}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 hover:text-blue-500 transition-colors group"
             >
                ALL DAILY RIPS <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
             </button>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {DAILY_RIP_POSTS.slice(0, 10).map((post) => (
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

        <div className="pt-10 flex justify-center">
           <button 
              onClick={navigateToAllRips}
              className="group flex flex-col items-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 dark:text-slate-700 font-mono hover:text-blue-600 transition-colors"
           >
              <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/5 group-hover:bg-blue-600 transition-colors"></div>
              VIEW ALL DAILY RIPS
              <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/5 group-hover:bg-blue-600 transition-colors"></div>
           </button>
        </div>
      </section>

    </div>
  );
};