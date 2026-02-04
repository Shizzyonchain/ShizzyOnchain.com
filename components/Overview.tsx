
import React, { useState } from 'react';
import { SOCIAL_LINKS, OVERVIEW_CONTENT } from '../constants.tsx';
import { Youtube, Twitch, Mail, ExternalLink, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { AINewsFeed } from './AINewsFeed.tsx';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.106 8.106 0 01-1.89-1.43c-.02 2.22-.01 4.44-.02 6.66 0 2.25-.43 4.58-1.92 6.27-1.48 1.73-3.8 2.53-5.99 2.28-2.2-.25-4.22-1.68-5.11-3.71-.96-2.13-.56-4.75 1.11-6.42 1.34-1.34 3.39-1.9 5.24-1.4v4.07c-1.12-.21-2.33.15-2.98 1.11-.69.96-.54 2.37.38 3.12.92.74 2.45.62 3.23-.38.56-.7.59-1.64.58-2.52V.02h.01z" />
  </svg>
);

export const Overview: React.FC = () => {
  const [showNews, setShowNews] = useState(false);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 animate-in fade-in duration-700">
      {/* Hero Image Section */}
      <div className="relative w-full aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl mb-16 bg-black">
        <img 
          src={SOCIAL_LINKS.heroImage} 
          alt="Shizzy Unchained Hero" 
          className="w-full h-full object-contain object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Text Area */}
        <div className="lg:col-span-8 space-y-12">
          {/* THE HOTTEST 5 TRIGGER */}
          <div className="relative group">
            <button 
              onClick={() => setShowNews(!showNews)}
              className={`w-full flex items-center justify-between p-10 rounded-[2.5rem] border-2 transition-all duration-500 text-left ${
                showNews 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/40' 
                  : 'bg-white dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white hover:border-blue-500/50'
              }`}
            >
              <div className="space-y-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md ${showNews ? 'bg-white/20' : 'bg-blue-600/10 text-blue-600'}`}>
                  <Zap size={10} fill="currentColor" />
                  REAL-TIME INTEL
                </div>
                <h2 className="text-3xl md:text-5xl font-black font-space uppercase italic tracking-tighter">
                  THE <span className={showNews ? 'text-white' : 'text-blue-600'}>HOTTEST</span> 5 AI NEWS
                </h2>
                <p className={`text-xs font-mono uppercase tracking-[0.2em] ${showNews ? 'text-white/70' : 'text-slate-500'}`}>
                  Direct access to X-based social intelligence
                </p>
              </div>
              <div className="shrink-0">
                {showNews ? <ChevronUp size={32} /> : <ChevronDown size={32} className="animate-bounce" />}
              </div>
            </button>

            {/* News Dropdown Content */}
            {showNews && (
              <div className="mt-8 animate-in slide-in-from-top-4 duration-500">
                <AINewsFeed />
              </div>
            )}
          </div>

          <section className="space-y-6 pt-10">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space border-l-[8px] border-blue-600 pl-8">
              ABOUT SHIZZY UNCHAINED
            </h2>
            <p className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed font-inter">
              {OVERVIEW_CONTENT.intro}
            </p>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-inter">
              {OVERVIEW_CONTENT.philosophy}
            </p>
          </section>

          <section className="bg-slate-50 dark:bg-white/[0.02] rounded-[2rem] p-10 border border-slate-200 dark:border-white/5">
            <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 font-space flex items-center gap-4">
              <span className="w-10 h-1 bg-blue-600 rounded-full"></span>
              CORE FOCUS AREAS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {OVERVIEW_CONTENT.offerings.map((offering, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-blue-600 dark:text-blue-400 font-black text-sm uppercase tracking-widest">{offering.title}</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{offering.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Contact/Social Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          <div className="bg-white dark:bg-[#1e293b]/40 rounded-3xl p-8 border border-slate-200 dark:border-white/5 shadow-xl">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] mb-8 font-mono">Connect With Shizzy</h3>
            
            <div className="space-y-4">
              <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-slate-900 text-white rounded-lg"><XIcon /></div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Shizzy (X)</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>

              <a href={SOCIAL_LINKS.xUnchained} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-blue-600 text-white rounded-lg"><XIcon /></div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Shizzy Unchained</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>

              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-red-600 text-white rounded-lg"><Youtube size={18} /></div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">YouTube</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>

              <a href={SOCIAL_LINKS.twitch} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-600 text-white rounded-lg"><Twitch size={18} /></div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Twitch</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>

              <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group p-4 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-black text-white rounded-lg"><TikTokIcon /></div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">TikTok</span>
                </div>
                <ExternalLink size={16} className="text-slate-400 group-hover:text-blue-500" />
              </a>
            </div>

            <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 font-mono">Business Inquiries</h4>
              <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-3 text-blue-600 dark:text-blue-500 font-bold hover:underline transition-all">
                <Mail size={18} />
                {SOCIAL_LINKS.email}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
