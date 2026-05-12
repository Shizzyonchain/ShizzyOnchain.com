import React from 'react';
import { motion } from 'framer-motion';

export const LatestNews: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-16 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            LATEST DROPS
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            LATEST <span className="text-orange-600">NEWS</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {/* Post 1 */}
        <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="group relative flex flex-col w-full"
        >
            <div className="w-full bg-slate-100 dark:bg-black/50 overflow-hidden mb-6 relative">
              <a href="https://postimg.cc/1nCXWxcy" target="_blank" rel="noopener noreferrer">
                <img 
                  src="https://i.postimg.cc/yxBR8sD3/41557947-336d-4756-b4ed-50de4705f346.png" 
                  alt="Latest News Graphic" 
                  className="w-full h-auto object-cover" 
                  referrerPolicy="no-referrer"
                />
              </a>
            </div>
            
            <div className="flex items-center justify-between px-4">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">MAY 11, 2026 // MARKET UPDATE</span>
                <a href="https://postimg.cc/1nCXWxcy" target="_blank" rel="noopener noreferrer" className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 hover:text-orange-400 transition-colors">
                  VIEW FULL SIZE
                </a>
            </div>
        </motion.div>
      </div>
    </div>
  );
};
