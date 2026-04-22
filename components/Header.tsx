
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Menu, X, ChevronDown } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';
import { View } from '../types.ts';

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

  const navItems: { label: string; view?: View; url?: string; icon?: React.ReactNode }[] = [
    { label: 'HOME', view: 'home' as View },
    { label: 'VIDEOS', view: 'videos' as View },
    { label: 'BITTENSOR', view: 'bittensor-subnets' as View },
    { label: 'PORTFOLIO', view: 'portfolio' as View },
    { label: 'TOOLS', view: 'tools' as View, icon: <ChevronDown size={14} /> },
  ];

  return (
    <header className="sticky top-0 z-[100] transition-all duration-500 glass border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-16 md:h-20 flex items-center justify-between">
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
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navItems.map((item) => (
            item.url ? (
              <motion.a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] font-space transition-all duration-300 hover:text-slate-900 dark:hover:text-white group text-slate-500 dark:text-slate-400"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
                <span className="absolute -bottom-2 left-0 h-[2px] bg-orange-500 transition-all duration-500 w-0 group-hover:w-1/2" />
              </motion.a>
            ) : (
              <motion.button
                key={item.view}
                onClick={() => handleNavClick(item.view!)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] font-space transition-all duration-300 hover:text-slate-900 dark:hover:text-white group ${
                  currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-[2px] bg-orange-500 transition-all duration-500 ${currentView === item.view ? 'w-full' : 'w-0 group-hover:w-1/2'}`} />
              </motion.button>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <motion.a 
            href="https://shop.ledger.com/?r=49c0bef9b376"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className="hidden lg:flex items-center px-2 xl:px-4 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] font-space transition-colors"
          >
            GET LEDGER
          </motion.a>

          <motion.a 
            href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzyunchained"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -2 }}
            className="hidden lg:flex items-center px-2 xl:px-4 py-2 text-slate-500 hover:text-blue-500 dark:text-slate-400 dark:hover:text-blue-400 text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] font-space transition-colors"
          >
            GET VPN
          </motion.a>
          
          <motion.button 
            id="send-tip-btn-header"
            onClick={() => handleNavClick('send-tip')}
            whileHover={{ y: -2 }}
            className="hidden md:block px-2 xl:px-4 py-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] font-space transition-colors"
          >
            TIP CREATOR
          </motion.button>
          
          <motion.button 
            id="contact-btn-header"
            onClick={() => handleNavClick('contact')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 xl:px-5 py-2 bg-[#FF6321] text-white rounded-xl text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] font-space hover:bg-[#E5591D] transition-all shadow-lg shadow-orange-500/20 shadow-[0_0_15px_rgba(255,99,33,0.3)]"
          >
            CONTACT SHIZZY
          </motion.button>
          
          <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-500"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            className="lg:hidden w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile/Hamburger Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/5 py-12 px-8 space-y-8 shadow-2xl animate-in fade-in slide-in-from-top-4 z-[100]">
          <nav className="space-y-6">
            {navItems.map((item) => (
              item.url ? (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic text-slate-400 dark:text-slate-500"
                >
                  {item.label}
                </a>
              ) : (
                <button 
                  key={item.view}
                  onClick={() => handleNavClick(item.view!)} 
                  className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                    currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {item.label}
                </button>
              )
            ))}
            <a 
              href="https://shop.ledger.com/?r=49c0bef9b376"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic text-slate-900 dark:text-white"
            >
              GET LEDGER
            </a>
            <a 
              href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzyunchained"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic text-blue-500"
            >
              GET VPN
            </a>
            <button 
              onClick={() => handleNavClick('send-tip')}
              className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                currentView === 'send-tip' ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              TIP CREATOR
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                currentView === 'contact' ? 'text-orange-600' : 'text-slate-400 dark:text-slate-500'
              }`}
            >
              CONTACT SHIZZY
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
