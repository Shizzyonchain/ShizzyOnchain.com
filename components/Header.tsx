
import React, { useState } from 'react';
import { Sun, Moon, Menu, X, MessageSquare, ChevronDown } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';
import { View } from '../types.ts';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface HeaderProps {
  darkMode: boolean;
  toggleTheme: () => void;
  onViewChange: (view: View) => void;
  currentView: View;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, toggleTheme, onViewChange, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'HOME', view: 'home' as View },
    { label: 'AI SIGNALS', view: 'ainews' as View },
    { label: 'CRYPTO SIGNALS', view: 'cryptonews' as View },
    { label: 'TOOLS', view: 'tools' as View, icon: <ChevronDown size={14} /> },
  ];

  return (
    <header className="relative z-[100] bg-white dark:bg-[#0b0e14] transition-colors duration-300 border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 md:h-28 flex items-center justify-between">
        {/* Logo Section */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 group shrink-0"
        >
          <img 
            src={SOCIAL_LINKS.logo} 
            alt="SHIZZYUNCHAINED" 
            className="h-12 md:h-16 object-contain transition-transform group-hover:scale-105" 
          />
        </button>

        {/* Desktop Navigation - Exact match to screenshot */}
        <nav className="hidden lg:flex items-center gap-10">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`flex items-center gap-2 text-[13px] font-black uppercase tracking-[0.15em] font-space transition-colors hover:text-slate-900 dark:hover:text-white ${
                currentView === item.view ? 'text-slate-900 dark:text-white underline underline-offset-8 decoration-2' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right-aligned Utility Icons */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <a 
            href={SOCIAL_LINKS.unchainedX} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors hidden sm:flex"
          >
            <XIcon className="w-5 h-5" />
          </a>
          
          <button
            onClick={toggleTheme}
            className="p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className="lg:hidden p-3 md:p-4 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile/Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/5 py-12 px-8 space-y-8 shadow-2xl animate-in fade-in slide-in-from-top-4 z-[100]">
          <nav className="space-y-6">
            {navItems.map((item) => (
              <button 
                key={item.view}
                onClick={() => handleNavClick(item.view)} 
                className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                  currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
