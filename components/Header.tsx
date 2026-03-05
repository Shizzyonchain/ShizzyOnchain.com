
import React, { useState } from 'react';
import { Sun, Moon, Menu, X, MessageSquare, ChevronDown, Phone } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';
import { View } from '../types.ts';
import { ContactModal } from './ContactModal.tsx';

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
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleNavClick = (view: View) => {
    onViewChange(view);
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'HOME', view: 'home' as View },
    { label: 'VIDEOS', view: 'ainews' as View },
    { label: 'TAO SUBNETS', view: 'cryptonews' as View },
    { label: 'TOOLS', view: 'tools' as View, icon: <ChevronDown size={14} /> },
  ];

  return (
    <header className="sticky top-[44px] z-[100] transition-all duration-500 glass border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Section */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 group shrink-0"
        >
          <img 
            src={SOCIAL_LINKS.logo} 
            alt="SHIZZYUNCHAINED" 
            className="h-10 md:h-14 object-contain transition-all duration-500 group-hover:scale-110 group-hover:rotate-[-2deg]" 
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-12">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavClick(item.view)}
              className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] font-space transition-all duration-300 hover:text-slate-900 dark:hover:text-white group ${
                currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
              <span className={`absolute -bottom-2 left-0 h-[2px] bg-blue-500 transition-all duration-500 ${currentView === item.view ? 'w-full' : 'w-0 group-hover:w-1/2'}`} />
            </button>
          ))}
        </nav>

        {/* Right-aligned Utility Icons */}
        <div className="flex items-center gap-3 md:gap-6 shrink-0">
          <button 
            id="contact-btn-header"
            onClick={() => setIsContactOpen(true)}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] font-space italic hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-500/20"
          >
            CONTACT
          </button>
          
          <button
            onClick={toggleTheme}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button 
            className="lg:hidden w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
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
            <button 
              onClick={() => {
                setIsContactOpen(true);
                setIsMenuOpen(false);
              }}
              className="block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic text-blue-600"
            >
              CONTACT
            </button>
          </nav>
        </div>
      )}

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </header>
  );
};
