
import React from 'react';
import { OVERVIEW_CONTENT, SOCIAL_LINKS } from '../constants.tsx';
import { Youtube, Music, Send, Mail } from 'lucide-react';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Overview: React.FC = () => {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-24 animate-in fade-in duration-1000 pb-32">
      {/* HERO IMAGE CONTAINER */}
      <section className="w-full">
        <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
          <img 
            src={SOCIAL_LINKS.heroImage} 
            alt="Shizzy Unchained Hero" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=1200';
            }}
          />
        </div>
      </section>

      {/* MAIN BRANDING SECTION */}
      <section className="space-y-10 max-w-4xl pt-4">
        <div className="flex items-start gap-6 md:gap-10">
          <div className="w-2.5 h-14 md:h-24 bg-blue-600 rounded-sm shrink-0 mt-1"></div>
          
          <div className="space-y-10">
            <h1 className="text-4xl md:text-8xl font-black font-inter tracking-tighter leading-none flex flex-wrap items-baseline gap-x-3 md:gap-x-4">
              <span className="text-slate-900 dark:text-white uppercase">{OVERVIEW_CONTENT.hero.title}</span>
              <span className="text-blue-600 uppercase italic font-black">{OVERVIEW_CONTENT.hero.suffix}</span>
            </h1>
            
            <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-3xl opacity-95">
              {OVERVIEW_CONTENT.hero.subtitle}
            </p>

            {/* QUICK LINKS - BROUGHT HIGHER */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a href={SOCIAL_LINKS.unchainedX} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <XIcon className="w-4 h-4" /> X / TWITTER
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Youtube size={16} /> YOUTUBE
              </a>
              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Music size={16} /> TIKTOK
              </a>
              <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 bg-blue-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Send size={16} /> TELEGRAM
              </a>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-3 px-5 py-3 bg-slate-200 dark:bg-white/10 text-slate-900 dark:text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                <Mail size={16} /> EMAIL
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* THE MISSION SECTION */}
      <section className="space-y-12 pt-8">
        <div className="flex items-center gap-6">
          <h2 className="text-[12px] md:text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] font-space shrink-0 italic">
            {OVERVIEW_CONTENT.mission.title}
          </h2>
          <div className="h-[1px] flex-grow bg-slate-200 dark:bg-white/10 opacity-50"></div>
        </div>

        <div className="max-w-4xl">
          <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 font-inter italic leading-relaxed font-medium">
            {OVERVIEW_CONTENT.mission.text}
          </p>
        </div>
      </section>
    </div>
  );
};
