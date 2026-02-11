
import React, { useState, useRef } from 'react';
import { Youtube, Sun, Moon, Menu, X, Mail, Check, ChevronDown, MessageSquare, BrainCircuit, ShieldAlert, Radio, Library } from 'lucide-react';
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimerRef = useRef<number | null>(null);

  const navItems: { label: string; view: View }[] = [
    { label: 'HOME', view: 'home' },
    { label: 'AI NEWS', view: 'ainews' },
    { label: 'CRYPTO NEWS', view: 'cryptonews' },
    { label: 'DAILY RIPS', view: 'daily-rips' },
    { label: 'TOOLS', view: 'tools' },
    { label: 'VIDEOS', view: 'videos' },
  ];

  const toolItems = [
    { label: 'HISTORY OF AI', view: 'ai-history' as View, icon: <Library size={10} /> },
    { label: 'NARRATIVE PULSE', view: 'narrative-pulse' as View, icon: <Radio size={10} /> },
    { label: 'ARCHITECT AUDITOR', view: 'architect-auditor' as View, icon: <ShieldAlert size={10} /> },
    { label: 'AI BRIEF', view: 'ai-brief' as View, icon: <BrainCircuit size={10} /> },
    { label: 'RESEARCH', view: 'research' as View, icon: null },
    { label: 'DEFI', view: 'defi' as View, icon: null },
    { label: 'AI COINS', view: 'aicoins' as View, icon: null },
    { label: 'CRYPTO COINS', view: 'cryptocoins' as View, icon: null },
    { label: 'BUBBLES', view: 'bubbles' as View, icon: null },
  ];

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const openDropdown = (name: string) => {
    if (dropdownTimerRef.current) window.clearTimeout(dropdownTimerRef.current);
    setActiveDropdown(name);
  };

  const closeDropdown = () => {
    dropdownTimerRef.current = window.setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
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
          <button
            onClick={() => handleNavClick('home')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'home' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            HOME
          </button>
          <button
            onClick={() => handleNavClick('ainews')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'ainews' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            AI NEWS
          </button>
          <button
            onClick={() => handleNavClick('cryptonews')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'cryptonews' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            CRYPTO NEWS
          </button>

          <button
            onClick={() => handleNavClick('daily-rips')}
            className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'daily-rips' 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400'
            }`}
          >
            <MessageSquare size={12} fill="currentColor" className="opacity-70" />
            DAILY RIPS
          </button>

          <div 
            className="relative"
            onMouseEnter={() => openDropdown('tools')}
            onMouseLeave={closeDropdown}
          >
            <button
              onClick={() => handleNavClick('tools')}
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
                currentView === 'tools' || toolItems.some(item => item.view === currentView)
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              TOOLS <ChevronDown size={12} className={`transition-transform duration-300 ${activeDropdown === 'tools' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'tools' && (
              <div className="absolute top-full -left-4 pt-4 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden p-2">
                  <button
                    onClick={() => handleNavClick('tools')}
                    className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all mb-1 ${
                      currentView === 'tools' 
                        ? 'bg-blue-600 text-white' 
                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    TOOLS HUB
                  </button>
                  <div className="h-[1px] bg-slate-100 dark:bg-white/5 mx-2 my-1"></div>
                  {toolItems.map((item) => (
                    <button
                      key={item.view}
                      onClick={() => handleNavClick(item.view)}
                      className={`w-full text-left px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-between ${
                        currentView === item.view 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {item.label}
                      {item.icon && <span className="opacity-50">{item.icon}</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('videos')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${
              currentView === 'videos' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            VIDEOS
          </button>
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
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

      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/5 py-8 px-6 space-y-6 shadow-2xl animate-in fade-in slide-in-from-top-4 z-[100]">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`block w-full text-left text-sm font-black uppercase tracking-widest py-2 ${
                currentView === item.view 
                  ? 'text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 pl-4 -ml-4' 
                  : 'text-slate-500 dark:text-slate-400 pl-4'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="h-[1px] bg-slate-100 dark:bg-white/10"></div>
          {toolItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`block w-full text-left text-[11px] font-black uppercase tracking-widest py-2 ${
                currentView === item.view ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
              } pl-4`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
