
import React, { useState } from 'react';
import { Youtube, Sun, Moon, Menu, X, Mail, Check, Copy } from 'lucide-react';
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
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);

  const navItems: { label: string; view: View }[] = [
    { label: 'HOME', view: 'home' },
    { label: 'AI NEWS', view: 'ainews' },
    { label: 'CRYPTO NEWS', view: 'cryptonews' },
    { label: 'AI COINS', view: 'aicoins' },
    { label: 'TAO ALPHA', view: 'tao-alpha' },
    { label: 'RESEARCH', view: 'research' },
    { label: 'DEFI', view: 'defi' },
    { label: 'BUBBLES', view: 'bubbles' },
    { label: 'VIDEOS', view: 'videos' },
  ];

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    window.location.href = `mailto:${SOCIAL_LINKS.email}`;
    navigator.clipboard.writeText(SOCIAL_LINKS.email);
    setShowCopyFeedback(true);
    setTimeout(() => setShowCopyFeedback(false), 2000);
  };

  return (
    <header className="relative z-[100] border-b border-slate-200 dark:border-white/5 bg-white dark:bg-[#0b0e14] transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 h-24 md:h-32 flex items-center justify-between">
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 group"
        >
          <img 
            src={SOCIAL_LINKS.logo} 
            alt="Shizzy Unchained" 
            className="h-16 md:h-24 transition-transform group-hover:scale-105"
          />
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                currentView === item.view 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-4 pr-6 border-r border-slate-200 dark:border-white/10">
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <XIcon />
            </a>
            <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Youtube size={20} />
            </a>
            <button 
              onClick={handleEmailClick}
              className="relative p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors group"
            >
              {showCopyFeedback ? <Check size={20} className="text-emerald-500" /> : <Mail size={20} />}
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button 
            className="lg:hidden p-2 text-slate-500 dark:text-slate-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/5 py-8 px-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`block w-full text-left text-sm font-black uppercase tracking-widest ${
                currentView === item.view 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
