
import React from 'react';
import { OVERVIEW_CONTENT, SOCIAL_LINKS } from '../constants.tsx';
import { Youtube, Music, Send, Mail } from 'lucide-react';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Overview: React.FC = () => {
  const { hero, latestSignal, coverage, credibility, community, footer } = OVERVIEW_CONTENT;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12 md:py-24 space-y-32 animate-in fade-in duration-1000 pb-48">
      
      {/* HERO SECTION */}
      <section className="space-y-10 text-center max-w-4xl mx-auto py-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-[#111111] dark:text-white leading-[1.05]">
            {hero.headline}
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {hero.subheadline}
          </p>
        </div>
        <div className="flex flex-col items-center gap-8 pt-8">
          <a 
            href={SOCIAL_LINKS.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 py-4 bg-[#111111] dark:bg-white text-white dark:text-[#111111] rounded-full font-bold text-lg hover:scale-[1.02] transition-all shadow-lg shadow-black/5 active:scale-[0.98] inline-block"
          >
            {hero.primaryCTA}
          </a>
          
          <div className="max-w-xs mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            <a href="https://postimg.cc/Pvv0RDWC" target="_blank" rel="noopener noreferrer" className="block group">
              <img 
                src="https://i.postimg.cc/prsxyYyJ/IMG-3724.jpg" 
                alt="Telegram Community" 
                className="rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>
        </div>
      </section>

      {/* LATEST CONTENT SECTION */}
      <section id="latest-videos" className="space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {latestSignal.title}
          </h2>
          <div className="h-[1px] flex-grow ml-8 bg-slate-200 dark:bg-white/10"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestSignal.cards.map((card, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-video bg-slate-100 dark:bg-white/5 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/5 shadow-xl">
                <iframe
                  src={card.link}
                  title={card.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{card.category}</span>
                <h3 className="text-xl font-semibold leading-tight text-slate-900 dark:text-white">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHAT I COVER SECTION */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {coverage.title}
          </h2>
          <div className="space-y-12">
            {coverage.items.map((item, i) => (
              <div key={i} className="space-y-2">
                <h4 className="text-2xl font-bold">{item.label}</h4>
                <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* WHY LISTEN SECTION */}
        <div className="space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {credibility.title}
          </h2>
          <div className="space-y-8">
            {credibility.points.map((point, i) => (
              <div key={i} className="flex gap-6 items-start">
                <div className="text-slate-900 dark:text-white font-bold text-xl">0{i + 1}</div>
                <p className="text-xl font-medium leading-snug">
                  {point}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY SECTION */}
      <section className="space-y-12">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
          {community.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {community.links.map((link, i) => (
            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="p-8 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-200 dark:border-white/5 hover:border-slate-900 dark:hover:border-white transition-all group">
              <h4 className="text-lg font-bold mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{link.platform}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {link.description}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER / FOLLOW SECTION */}
      <section className="pt-24 border-t border-slate-200 dark:border-white/10 space-y-12 text-center">
        <div className="space-y-6">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            {footer.cta}
          </h2>
          <div className="flex flex-col items-center gap-8 justify-center">
            <a 
              href={SOCIAL_LINKS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-xl hover:scale-105 transition-transform inline-block"
            >
              Follow Updates
            </a>
            
            <div className="max-w-[200px] mx-auto opacity-60 hover:opacity-100 transition-opacity">
              <a href="https://postimg.cc/Pvv0RDWC" target="_blank" rel="noopener noreferrer" className="block group">
                <img 
                  src="https://i.postimg.cc/prsxyYyJ/IMG-3724.jpg" 
                  alt="Telegram Community" 
                  className="rounded-xl shadow-xl border border-slate-200 dark:border-white/10 group-hover:scale-[1.02] transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
          </div>
        </div>
        <p className="text-sm text-slate-400 font-medium max-w-md mx-auto">
          {footer.disclaimer}
        </p>
      </section>
    </div>
  );
};
