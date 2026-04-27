
import React from 'react';
import { motion } from 'motion/react';
import { OVERVIEW_CONTENT, SOCIAL_LINKS, TICKER_SIGNALS } from '../constants.tsx';
import { ArrowUpRight, Zap, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

export const Overview: React.FC = () => {
  const { hero, latestSignal } = OVERVIEW_CONTENT;

  return (
    <div className="relative min-h-screen overflow-hidden pb-48">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent dark:from-orange-500/10 pointer-events-none" />
      
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 space-y-40 pt-16 md:pt-28">
        
        {/* NETWORK STATUS HUD - STEP 1 TO A 10 */}
        <div className="absolute top-8 left-6 right-6 flex items-center justify-between pointer-events-none opacity-50">
          <div className="flex items-center gap-4 text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-slate-400">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            GLOBAL_NODE_SYNC: ACTIVE
          </div>
          <div className="hidden md:flex items-center gap-6 text-[9px] font-mono font-bold uppercase tracking-[0.4em] text-slate-400">
            <span>UPLINK: SHIZZY_INSIDER_FEED</span>
            <div className="flex gap-1 items-center">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`w-0.5 h-2.5 rounded-full ${i <= 4 ? 'bg-orange-500' : 'bg-slate-800'}`} />
              ))}
            </div>
          </div>
        </div>
        
        {/* HERO SECTION */}
        <section className="relative z-10 text-center space-y-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-12"
          >
            <h1 className="text-5xl md:text-[110px] font-black tracking-normal text-white leading-[0.9] font-edo uppercase italic text-outline">
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

            <div className="flex flex-col items-center justify-center pt-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative w-full max-w-2xl mx-auto"
              >
                <img 
                  src="https://i.postimg.cc/Bn74GKFX/Untitled-(500-x-200-mm).png" 
                  alt="UNCHAINED INSIDERS" 
                  className="w-full h-auto object-contain drop-shadow-[0_0_30px_rgba(255,99,33,0.3)] mb-4"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col items-center gap-8 max-w-2xl mx-auto px-4"
              >
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-lg leading-relaxed text-center">
                  The premier Bittensor alpha group on Telegram. Get exclusive subnet analysis and high-signal market intelligence before the crowd.
                </p>

                <motion.a 
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, shadow: "0 25px 50px -12px rgba(249, 115, 22, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-12 md:px-16 py-5 md:py-6 bg-[#FF6321] text-white rounded-2xl text-base md:text-lg font-black uppercase tracking-[0.2em] font-edo italic transition-all shadow-2xl shadow-orange-500/40 flex items-center gap-4 text-outline"
                >
                  <Zap size={24} className="fill-current" />
                  JOIN THE ALPHA
                </motion.a>
              </motion.div>
            </div>
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
                <div className="aspect-video relative bg-slate-100 dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl transition-all duration-500 group-hover:border-orange-500/50">
                  <iframe
                    src={card.link}
                    title={card.title}
                    className="w-full h-full grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="space-y-3 px-2">
                  <h3 className="text-2xl font-black font-space italic leading-tight text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
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

        {/* BITTENSOR FOR BEGINNERS SECTION */}
        <section className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-6xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
                Bittensor for Beginners
              </h3>
            </div>
            <div className="h-[1px] flex-grow hidden md:block mx-12 bg-slate-200 dark:bg-white/10"></div>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs text-sm">
              Your starting point for understanding the decentralized AI revolution.
            </p>
          </div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="group space-y-6 max-w-4xl mx-auto"
          >
            <div className="aspect-video relative bg-slate-100 dark:bg-[#0a0a0a] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl transition-all duration-500 group-hover:border-orange-500/50">
              <iframe
                src="https://www.youtube.com/embed/1_-bAGtRdHY"
                title="Getting Started with Bittensor Tao Subnets"
                className="w-full h-full grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="space-y-3 px-2 text-center">
              <h3 className="text-3xl font-black font-space italic leading-tight text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-orange-500 transition-colors">
                Getting Started with Bittensor Tao Subnets
              </h3>
              <div className="flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500 text-sm font-bold uppercase tracking-widest">
                Watch Now <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>
        </section>

        {/* PROMOTIONAL BANNERS SECTION */}
        <section className="space-y-16 pt-20 border-t border-slate-200 dark:border-white/5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <h3 className="text-4xl md:text-6xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
                SECURE YOUR SESSION & ASSETS
              </h3>
            </div>
            <div className="h-[1px] flex-grow hidden md:block mx-12 bg-slate-200 dark:bg-white/10"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* NordVPN Banner */}
            <motion.a 
              href={SOCIAL_LINKS.nordVpn}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#0B3D91] to-[#011627] border border-white/10 p-10 h-[300px] flex flex-col justify-between shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <ShieldCheck size={120} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  STAY PRIVATE
                </div>
                <h4 className="text-4xl font-black font-space text-white uppercase italic tracking-tighter leading-none">
                  GET NORDVPN
                </h4>
                <p className="text-white/70 max-w-[200px] text-sm font-medium">
                  Shield your connection and browse the decentralized web with total privacy.
                </p>
              </div>
              <div className="relative z-10 mt-auto flex items-center gap-4 text-white text-xs font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-500 w-fit px-6 py-3 rounded-xl transition-colors shadow-xl">
                UPGRADE SECURITY <ArrowUpRight size={16} />
              </div>
            </motion.a>

            {/* Ledger Banner */}
            <motion.a 
              href={SOCIAL_LINKS.ledger}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#333333] to-[#000000] border border-white/10 p-10 h-[300px] flex flex-col justify-between shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
                <Wallet size={120} className="text-white" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  SELF CUSTODY
                </div>
                <h4 className="text-4xl font-black font-space text-white uppercase italic tracking-tighter leading-none">
                  GET A LEDGER
                </h4>
                <p className="text-white/70 max-w-[200px] text-sm font-medium">
                  The standard for hardware security. Secure your TAO and assets onchain.
                </p>
              </div>
              <div className="relative z-10 mt-auto flex items-center gap-4 text-white text-xs font-black uppercase tracking-widest bg-orange-600 hover:bg-orange-500 w-fit px-6 py-3 rounded-xl transition-colors shadow-xl">
                GET THE WALLET <ArrowUpRight size={16} />
              </div>
            </motion.a>
            {/* Mentat Minds Banner */}
            <motion.a 
              href="https://mentatminds.com/mentat-plus/?origin=ShizzyUnchained"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#2b25ff] to-[#110e82] border border-white/10 p-10 md:h-[200px] flex flex-col justify-between shadow-2xl md:col-span-2 md:flex-row md:items-center"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700 pointer-events-none w-full h-full">
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 space-y-4 md:space-y-2 md:max-w-[60%]">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-white text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  STAKING
                </div>
                <h4 className="text-4xl font-black font-space text-white uppercase italic tracking-tighter leading-none">
                  DELEGATE YOUR TAO WITH MENTAT MINDS
                </h4>
                <p className="text-white/80 text-sm font-medium">
                  Less risk, more returns, one click: stake TAO with Mentat Minds. Delegate to start earning TAO.
                </p>
              </div>
              <div className="relative z-10 mt-8 md:mt-0 flex items-center gap-4 text-blue-900 text-xs font-black uppercase tracking-widest bg-white hover:bg-slate-200 px-6 py-4 rounded-xl transition-colors shadow-xl shrink-0">
                START EARNING TAO <ArrowUpRight size={16} />
              </div>
            </motion.a>
          </div>
        </section>

      </div>
    </div>
  );
};
