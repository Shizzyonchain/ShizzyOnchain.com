
import React from 'react';
import { SOCIAL_LINKS, OVERVIEW_CONTENT } from '../constants.tsx';
import { Youtube, ExternalLink, Mail, Twitch, Send, Zap, ArrowRight, Layers, Archive } from 'lucide-react';
import { newsService } from '../services/newsService.ts';
import { cryptoNewsService } from '../services/cryptoNewsService.ts';

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
  const { items: cryptoItems } = cryptoNewsService.getLatestItems();
  
  const latestArticle = aiItems[0]; 
  // Archive includes older crypto reports and research articles
  const archiveArticles = cryptoItems.filter(item => 
    item.id !== 'panic-selling-ai-macro' && 
    item.id !== 'binance-cease-desist'
  );

  const socialItems = [
    { 
      label: 'Shizzy (X)', 
      url: SOCIAL_LINKS.x, 
      icon: <div className="bg-zinc-900 dark:bg-black p-2.5 rounded-xl"><XIcon className="w-5 h-5 text-white" /></div> 
    },
    { 
      label: 'Shizzy Unchained', 
      url: SOCIAL_LINKS.xUnchained, 
      icon: <div className="bg-blue-600 p-2.5 rounded-xl"><XIcon className="w-5 h-5 text-white" /></div> 
    },
    { 
      label: 'YouTube', 
      url: SOCIAL_LINKS.youtube, 
      icon: <div className="bg-red-600 p-2.5 rounded-xl"><Youtube className="w-5 h-5 text-white" /></div> 
    },
    { 
      label: 'Twitch', 
      url: SOCIAL_LINKS.twitch, 
      icon: <div className="bg-purple-600 p-2.5 rounded-xl"><Twitch className="w-5 h-5 text-white" /></div> 
    },
    { 
      label: 'TikTok', 
      url: SOCIAL_LINKS.tiktok, 
      icon: <div className="bg-black p-2.5 rounded-xl"><TikTokIcon className="w-5 h-5 text-white" /></div> 
    },
  ];

  const handleArticleClick = (id?: string) => {
    const targetId = id || latestArticle?.id;
    if (targetId) {
      window.location.hash = `#/article/${targetId}`;
    }
  };

  const philosophyBody = OVERVIEW_CONTENT.philosophy
    .replace(/^AI Needs Crypto\. Crypto Needs AI\.\n\n/, '');

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-32 animate-in fade-in duration-1000">
      
      {/* 1. BRAND HERO SECTION */}
      <section className="space-y-16">
        <div className="relative w-full aspect-[21/9] rounded-[2rem] lg:rounded-[4rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-black shadow-2xl">
          <img 
            src={SOCIAL_LINKS.heroImage} 
            alt="Shizzy Hero" 
            className="w-full h-full object-contain opacity-90 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          <div className="lg:col-span-8 space-y-20">
            
            {/* BRANDING INTRO */}
            <div className="space-y-8">
              <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-[0.9] border-l-8 border-blue-600 pl-8">
                INNOVATION FIRST <span className="text-blue-600">MEDIA</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-2xl">
                {OVERVIEW_CONTENT.intro}
              </p>
            </div>

            {/* PHILOSOPHY SECTION */}
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                 <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest font-space">AI Needs Crypto. Crypto Needs AI.</h3>
                 <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
              </div>
              <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-loose text-lg font-inter italic">
                {philosophyBody.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>

            {/* THE ONE LATEST STORY - MOVED BELOW PHILOSOPHY */}
            {latestArticle && (
              <div className="space-y-10 group cursor-pointer pt-10" onClick={() => handleArticleClick()}>
                <div className="flex items-center gap-4">
                  <div className="px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-600/20 flex items-center gap-2">
                    <Zap size={12} className="fill-current animate-pulse" />
                    NEWEST SIGNAL
                  </div>
                  <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
                </div>

                <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-zinc-900 shadow-xl group-hover:border-blue-500/50 transition-all duration-500">
                  <img 
                    src={latestArticle.image_url} 
                    alt={latestArticle.title}
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] tracking-tighter font-space uppercase italic group-hover:text-blue-600 transition-colors duration-300">
                    {latestArticle.title}
                  </h2>
                  <p className="text-lg text-slate-500 dark:text-slate-400 line-clamp-2 font-inter leading-relaxed max-w-3xl">
                    {latestArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-blue-600 font-black text-[11px] uppercase tracking-[0.3em] group-hover:translate-x-2 transition-transform duration-300">
                    READ FULL SIGNAL <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SOCIAL LINKS SIDEBAR */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-12 sticky top-32">
              <div className="space-y-10">
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] text-left font-mono">
                  SHIZZY UNCHAINED CONTENT LINKS
                </h3>
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

      {/* THE AI-CRYPTO STACK SECTION */}
      <section className="pt-20 space-y-16">
        <div className="flex items-center gap-8">
           <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-xl shadow-blue-500/20">
             <Layers size={24} />
           </div>
           <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic">THE AI–CRYPTO STACK</h3>
           <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {OVERVIEW_CONTENT.offerings.map((offering, idx) => (
            <div 
              key={idx} 
              className="relative p-10 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[3rem] space-y-6 hover:border-blue-500/40 transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap size={80} strokeWidth={1} />
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 dark:bg-white/5 text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Zap size={20} className="fill-current" />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic leading-none group-hover:text-blue-600 transition-colors">
                  {offering.title}
                </h4>
                <div className="w-12 h-[2px] bg-blue-600/30 group-hover:w-24 transition-all duration-500"></div>
                <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed font-inter font-medium italic">
                  {offering.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SIGNAL ARCHIVE SECTION */}
      {archiveArticles.length > 0 && (
        <section className="pt-20 space-y-16">
          <div className="flex items-center gap-8">
             <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl shadow-xl">
               <Archive size={24} />
             </div>
             <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic">SIGNAL ARCHIVE</h3>
             <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {archiveArticles.map((article) => (
              <div 
                key={article.id} 
                onClick={() => handleArticleClick(article.id)}
                className="group cursor-pointer space-y-8 p-10 bg-white dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-[3rem] hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 flex flex-col h-full"
              >
                <div className="relative aspect-video rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-zinc-900 shadow-inner">
                  <img 
                    src={article.image_url} 
                    alt={article.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
                <div className="space-y-4 flex-grow">
                   <div className="flex items-center gap-3">
                     <div className="text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.3em] font-mono italic">
                       RESTORED INTELLIGENCE
                     </div>
                   </div>
                   <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter font-space italic leading-tight group-hover:text-blue-500 transition-colors">
                     {article.title}
                   </h4>
                   <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 font-inter leading-relaxed italic opacity-80 group-hover:opacity-100 transition-opacity">
                     {article.excerpt}
                   </p>
                </div>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex items-center justify-between group-hover:translate-x-1 transition-transform">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">DECRYPT SIGNAL</span>
                   <ArrowRight size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
