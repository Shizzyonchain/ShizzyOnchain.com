
import React from 'react';
import { motion } from 'motion/react';
import { OVERVIEW_CONTENT, SOCIAL_LINKS, TICKER_SIGNALS } from '../constants.tsx';
import { ArrowUpRight, Zap, ShieldCheck, Wallet, ArrowRight } from 'lucide-react';

export const Overview: React.FC = () => {
  const { hero } = OVERVIEW_CONTENT;

  return (
    <div className="relative min-h-screen overflow-hidden pb-12">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent dark:from-orange-500/10 pointer-events-none" />
      
      <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[5%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 space-y-12 pt-8 md:pt-12">
        
        {/* HERO SECTION */}
        <section className="relative z-10 text-center space-y-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
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

            <div className="flex flex-col items-center justify-center pt-4">
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
                className="flex flex-col items-center gap-4 max-w-2xl mx-auto px-4"
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

        {/* BITTENSOR FOR BEGINNERS SECTION */}
        <section className="space-y-8">
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
            className="group space-y-4 max-w-4xl mx-auto"
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

      </div>
    </div>
  );
};
