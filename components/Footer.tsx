import React from 'react';
import { SOCIAL_LINKS, OVERVIEW_CONTENT } from '../constants.tsx';
import { Youtube, Send, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#050505] relative z-10 py-8 md:py-12 mt-12">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-slate-500 dark:text-slate-400">
        
        {/* Brand & Disclaimer */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img src={SOCIAL_LINKS.logo} alt="Shizzy Unchained" className="h-8 md:h-10 object-contain invert dark:invert-0" />
            <span className="font-space font-black uppercase tracking-widest text-slate-900 dark:text-white text-lg">Shizzy Unchained</span>
          </div>
          <p className="text-sm font-medium leading-relaxed max-w-sm">
            {OVERVIEW_CONTENT.footer.disclaimer}
          </p>
          <p className="text-xs font-mono uppercase tracking-widest opacity-60">
            © {new Date().getFullYear()} Innovation First LLC. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="space-y-4 md:text-center">
          <h4 className="font-space font-black uppercase tracking-widest text-slate-900 dark:text-white text-sm">
            QUICK LINKS
          </h4>
          <div className="flex flex-col gap-2 font-medium text-sm">
            <a href="#/overview" className="hover:text-orange-500 transition-colors uppercase tracking-wider">Home</a>
            <a href="#/school" className="hover:text-orange-500 transition-colors uppercase tracking-wider">Shiz University</a>
            <a href="#/bittensor" className="hover:text-orange-500 transition-colors uppercase tracking-wider">Bittensor Tracker</a>
            <a href="#/tools" className="hover:text-orange-500 transition-colors uppercase tracking-wider">Tools</a>
            <a href="#/contact" className="hover:text-orange-500 transition-colors uppercase tracking-wider">Contact</a>
          </div>
        </div>

        {/* Socials */}
        <div className="space-y-4 md:text-right">
          <h4 className="font-space font-black uppercase tracking-widest text-slate-900 dark:text-white text-sm">
            {OVERVIEW_CONTENT.footer.cta}
          </h4>
          <div className="flex gap-4 md:justify-end">
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1">
              <Youtube size={20} />
            </a>
            <a href={SOCIAL_LINKS.unchainedX} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-blue-500 hover:text-white transition-all transform hover:-translate-y-1">
              <Twitter size={20} />
            </a>
            <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-sky-500 hover:text-white transition-all transform hover:-translate-y-1">
              <Send size={20} />
            </a>
          </div>
        </div>
        
      </div>
    </footer>
  );
};
