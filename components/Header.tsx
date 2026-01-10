import React from 'react';
import { Search, Youtube, Sun, Moon } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme }) => {
  return (
    <header className="px-6 py-0 h-20 md:h-24 flex items-center justify-between border-b border-black/5 dark:border-white/5 bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-xl sticky top-[44px] z-40 transition-all duration-300">
      <div className="flex items-center pl-6 md:pl-16 h-full">
        <a 
          href={SOCIAL_LINKS.website} 
          target="_blank" 
          rel="noopener noreferrer"
          className="h-[80%] block hover:scale-105 transition-transform duration-300 z-50 flex items-center"
        >
          <img 
            src={SOCIAL_LINKS.logo} 
            alt="OnChain Revolution" 
            className="h-full w-auto object-contain dark:brightness-110 drop-shadow-2xl"
          />
        </a>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none hidden sm:block">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-[-0.02em] font-space text-slate-900 dark:text-white opacity-95 uppercase">
          SHIZZY'S INSIGHTS
        </h1>
      </div>

      <div className="flex items-center gap-1 md:gap-3 pr-2 h-full">
        <button className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2" aria-label="Search">
          <Search size={22} />
        </button>

        <button 
          onClick={toggleTheme}
          className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2"
          aria-label="Toggle Theme"
        >
          {darkMode ? <Sun size={22} /> : <Moon size={22} />}
        </button>

        <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2" aria-label="X (Twitter)">
          <XIcon />
        </a>
        <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2" aria-label="YouTube">
          <Youtube size={26} />
        </a>
      </div>
    </header>
  );
};