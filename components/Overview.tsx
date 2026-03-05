
import React from 'react';
import { motion } from 'motion/react';
import { OVERVIEW_CONTENT } from '../constants.tsx';
import { ArrowUpRight, Shield, Zap, Globe, Cpu } from 'lucide-react';

export const Overview: React.FC = () => {
  const { hero, latestSignal, coverage, credibility } = OVERVIEW_CONTENT;

  return (
    <div className="relative min-h-screen overflow-hidden pb-48">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-blue-500/5 via-transparent to-transparent dark:from-blue-500/10 pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 space-y-48 pt-24 md:pt-40">
        
        {/* HERO SECTION */}
        <section className="relative z-10 text-center space-y-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-[110px] font-black tracking-tighter text-[#111111] dark:text-white leading-[0.9] font-space uppercase italic">
              {hero.headline.split(' | ').map((part, i, arr) => (
                <span 
                  key={i} 
                  className={`block ${
                    i === 1 ? 'text-3xl md:text-7xl opacity-80' : 
                    i === arr.length - 1 ? 'text-2xl md:text-5xl mt-4' : ''
                  }`}
                >
                  {part}
                </span>
              ))}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
              {hero.subheadline}
            </p>
          </motion.div>
        </section>

        {/* LATEST CONTENT SECTION */}
        <section id="latest-videos" className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-6xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
                Shizzy Unchained Videos
              </h3>
            </div>
            <div className="h-[1px] flex-grow hidden md:block mx-12 bg-slate-200 dark:bg-white/10"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
              Real-time analysis of the decentralized AI landscape and liquidity flows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {latestSignal.cards.map((card, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="group space-y-6"
              >
                <div className="aspect-video relative bg-slate-100 dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl transition-all duration-500 group-hover:border-blue-500/50">
                  <iframe
                    src={card.link}
                    title={card.title}
                    className="w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 glass rounded-full text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {card.category}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <h3 className="text-2xl font-black font-space italic leading-tight text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">
                    {card.title}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Watch Now <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHAT I COVER SECTION - BENTO GRID */}
        <section className="space-y-16">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500">
              {coverage.title}
            </h2>
            <h3 className="text-4xl md:text-6xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
              The Research Stack
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coverage.items.map((item, i) => (
              <div 
                key={i} 
                className={`p-10 rounded-[2.5rem] border transition-all duration-500 group ${
                  i === 0 
                    ? 'md:col-span-2 bg-slate-900 dark:bg-white text-white dark:text-black border-transparent' 
                    : 'bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/5 text-slate-900 dark:text-white'
                }`}
              >
                <div className="h-full flex flex-col justify-between gap-12">
                  <div className="flex justify-between items-start">
                    <div className={`p-4 rounded-2xl ${i === 0 ? 'bg-white/10 dark:bg-black/10' : 'bg-slate-100 dark:bg-white/5'}`}>
                      {i === 0 ? <Zap size={32} /> : i === 1 ? <Globe size={32} /> : <Cpu size={32} />}
                    </div>
                    <ArrowUpRight className={`opacity-20 group-hover:opacity-100 transition-opacity ${i === 0 ? 'text-white dark:text-black' : 'text-slate-900 dark:text-white'}`} size={32} />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl md:text-4xl font-black font-space italic uppercase tracking-tighter">Tao Subnets</h4>
                    <p className={`text-lg leading-relaxed ${i === 0 ? 'text-white/70 dark:text-black/70' : 'text-slate-500 dark:text-slate-400'}`}>
                      Real-time tracking of all 128 Bittensor subnets. Emissions, stake, and market dynamics in USD.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WHY LISTEN SECTION - TECHNICAL LIST */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <div className="space-y-12">
            <div className="space-y-4">
              <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 dark:text-slate-500">
                {credibility.title}
              </h2>
              <h3 className="text-4xl md:text-7xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
                Proven <br /> Signal.
              </h3>
            </div>
            
            <div className="space-y-10">
              {credibility.points.map((point, i) => (
                <div key={i} className="flex gap-8 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center font-black italic text-xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                    0{i + 1}
                  </div>
                  <p className="text-xl md:text-2xl font-bold leading-tight text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
            <div className="relative glass rounded-[3rem] p-12 space-y-8 border-white/20 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Shield size={24} />
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-widest text-slate-400">Status</div>
                  <div className="text-lg font-black font-space italic uppercase tracking-tight">Verified Analyst</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[94%] bg-gradient-to-r from-blue-500 to-emerald-500" />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Accuracy</span>
                  <span>94.2%</span>
                </div>
              </div>
              <div className="pt-8 border-t border-white/10">
                <p className="text-sm font-medium italic text-slate-500 leading-relaxed">
                  "The goal isn't to be first. The goal is to be right when it matters most. We track the flows that others ignore."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* COMMUNITY SECTION REMOVED */}
      </div>
    </div>
  );
};
