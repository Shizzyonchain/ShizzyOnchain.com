
import React from 'react';
import { Search, Youtube, Sun, Moon } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';
import { View } from '../types.ts';

const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onViewChange: (view: View, scrollToSection?: string) => void;
  currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleTheme, 
  onViewChange,
  currentView
}) => {
  const navItems = [
    { label: 'Home', view: 'home' as View },
    { label: 'Videos', view: 'home' as View, scrollTo: 'video-explorer' },
    { label: 'Research', view: 'research' as View },
    { label: 'Onchain Data', view: 'defi' as View },
    { label: 'Crypto Bubbles', view: 'bubbles' as View },
    { 
      label: 'Nord VPN Security & Privacy', 
      url: 'https://nordvpn.com/special/?utm_medium=affiliate&utm_term=&utm_content&utm_source=aff107682&utm_campaign=off15' 
    },
    { 
      label: 'Ledger', 
      url: 'https://shop.ledger.com/?r=72709e075f30' 
    },
  ];

  const handleNavClick = (item: { label: string; view?: View; url?: string; scrollTo?: string }) => {
    if (item.url) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else if (item.view) {
      onViewChange(item.view, item.scrollTo);
    }
  };

  return (
    <div className="sticky top-[44px] z-40 bg-white dark:bg-[#0b0e14] transition-all duration-300 shadow-sm dark:shadow-none">
      {/* Top Header Row */}
      <header className="px-6 h-16 md:h-20 flex items-center justify-between border-b border-slate-100 dark:border-white/5">
        <div className="flex items-center pl-2 md:pl-6 h-full">
          <button 
            onClick={() => onViewChange('home')}
            className="h-[85%] block hover:opacity-80 transition-all duration-300 z-50 flex items-center"
          >
            <img 
              src={SOCIAL_LINKS.logo} 
              alt="Shizzy Unchained" 
              className="h-full w-auto object-contain dark:brightness-100 dark:invert-0 brightness-90"
            />
          </button>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 text-center hidden lg:block">
          <button onClick={() => onViewChange('home')} className="group">
            <h1 className="text-xl md:text-2xl font-black tracking-[-0.06em] font-outfit text-slate-900 dark:text-white uppercase italic">
              SHIZZY UNCHAINED
            </h1>
          </button>
        </div>

        <div className="flex items-center gap-1 md:gap-4 pr-2">
          <button className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2" aria-label="Search">
            <Search size={20} />
          </button>

          <button 
            onClick={toggleTheme}
            className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2 flex items-center" aria-label="X">
            <XIcon />
          </a>
          
          <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-blue-500 transition-colors p-2 flex items-center" aria-label="YouTube">
            <Youtube size={22} />
          </a>
        </div>
      </header>

      {/* Navigation Bar (Home Bar) */}
      <nav className="border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#0b0e14] overflow-x-auto scrollbar-hide">
        <div className="max-w-[1400px] mx-auto flex items-center px-8">
          <div className="flex items-center gap-8 h-12">
            {navItems.map((item) => {
              const actuallyActive = 
                (item.label === 'Home' && currentView === 'home') || 
                (item.label === 'Research' && currentView === 'research') || 
                (item.label === 'Onchain Data' && currentView === 'defi') ||
                (item.label === 'Crypto Bubbles' && currentView === 'bubbles');

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item)}
                  className={`relative h-full text-sm font-bold whitespace-nowrap transition-colors duration-200 uppercase tracking-tight ${
                    actuallyActive 
                      ? 'text-blue-600 dark:text-[#f97316]' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {actuallyActive && !item.scrollTo && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 dark:bg-[#f97316]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
};