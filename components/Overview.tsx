
import React from 'react';
import { OVERVIEW_CONTENT, SOCIAL_LINKS } from '../constants.tsx';

export const Overview: React.FC = () => {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-24 animate-in fade-in duration-1000 pb-32">
      {/* HERO IMAGE CONTAINER - THE SHIZZY BEGINNING RESTORED */}
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

      {/* MAIN BRANDING SECTION - INNOVATION FIRST MEDIA */}
      <section className="space-y-10 max-w-4xl pt-4">
        <div className="flex items-start gap-6 md:gap-10">
          {/* THE BLUE VERTICAL BAR FROM ORIGINAL DESIGN */}
          <div className="w-2.5 h-14 md:h-24 bg-blue-600 rounded-sm shrink-0 mt-1"></div>
          
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <img src={SOCIAL_LINKS.innovationFirstLogo} alt="Innovation First" className="h-6 md:h-8 opacity-80" />
              <div className="h-px w-8 bg-blue-600/30"></div>
            </div>
            
            <h1 className="text-4xl md:text-8xl font-black font-inter tracking-tighter leading-none flex flex-wrap items-baseline gap-x-3 md:gap-x-4">
              <span className="text-slate-900 dark:text-white uppercase">{OVERVIEW_CONTENT.hero.title}</span>
              <span className="text-blue-600 uppercase italic font-black">{OVERVIEW_CONTENT.hero.suffix}</span>
            </h1>
            
            <p className="text-xl md:text-3xl font-medium text-slate-800 dark:text-slate-200 leading-snug max-w-3xl opacity-95">
              {OVERVIEW_CONTENT.hero.subtitle}
            </p>
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
