
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

  const navItems = [
    { label: 'HOME', view: 'home' as View },
    { label: 'VIDEOS', view: 'videos' as View },
    { label: 'PORTFOLIO', view: 'portfolio' as View },
    { label: 'SHOP', url: 'https://shizzyunchained.printful.me/' },
    { label: 'SHIZ UNIVERSITY', view: 'shiz-university' as View },
    { 
      label: 'RESOURCES', 
      type: 'dropdown',
      items: [
        { label: 'INFORMATION HUB', view: 'tools' as View },
        { label: 'ALPHAGAP', view: 'alphagap' as View },
        { label: 'MENTAT', url: 'https://mentatminds.com/mentat-plus/?origin=ShizzyUnchained' },
        { label: 'LATEST ARTICLES', view: 'latest-articles' as View },
        { label: 'TIP CREATOR', view: 'send-tip' as View },
        { label: 'GET LEDGER', url: 'https://shop.ledger.com/?r=49c0bef9b376' },
        { label: 'GET VPN', url: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzyunchained' },
      ]
    },
  ];

  return (
    <header className="sticky top-0 z-[100] transition-all duration-500 glass border-b border-slate-200 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 h-20 md:h-24 flex items-center justify-between">
        {/* Logo Section */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-4 group shrink-0"
        >
          <img 
            src={SOCIAL_LINKS.logo} 
            alt="SHIZZYUNCHAINED" 
            className="h-24 md:h-32 object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-[-1deg]" 
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-10">
          {navItems.map((item) => (
            item.type === 'dropdown' ? (
              <div key={item.label} className="relative group py-4">
                <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] font-space text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer">
                  {item.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-0 w-56 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 overflow-hidden">
                  <div className="p-2 space-y-1">
                    {item.items?.map((subItem) => (
                      subItem.url ? (
                        <a
                          key={subItem.label}
                          href={subItem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-orange-500 rounded-xl transition-all"
                        >
                          {subItem.label}
                        </a>
                      ) : (
                        <button
                          key={subItem.label}
                          onClick={() => handleNavClick(subItem.view!)}
                          className={`w-full flex items-center px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${
                            currentView === subItem.view 
                              ? 'bg-orange-500/10 text-orange-600' 
                              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-orange-500'
                          }`}
                        >
                          {subItem.label}
                        </button>
                      )
                    ))}
                  </div>
                </div>
              </div>
            ) : item.url ? (
              <motion.a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] font-space transition-all duration-300 hover:text-slate-900 dark:hover:text-white group text-slate-500 dark:text-slate-400"
              >
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
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-[2px] bg-orange-500 transition-all duration-500 ${currentView === item.view ? 'w-full' : 'w-0 group-hover:w-1/2'}`} />
              </motion.button>
            )
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <motion.button 
            id="contact-btn-header"
            onClick={() => handleNavClick('contact')}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 xl:px-5 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-xl text-[10px] xl:text-[11px] font-black uppercase tracking-[0.2em] font-space hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg shadow-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
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
        <>
          {/* Dark blurred backdrop to cover background content and prevent peeking */}
          <div 
            className="fixed inset-0 top-20 md:top-24 bg-black/80 backdrop-blur-md z-[90]"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Main Menu Panel */}
          <div className="absolute top-full left-0 w-full bg-white dark:bg-[#0b0e14] border-b border-slate-200 dark:border-white/5 py-12 px-8 space-y-8 shadow-2xl animate-in fade-in slide-in-from-top-4 z-[100] max-h-[85vh] overflow-y-auto">
            <nav className="space-y-6">
              {navItems.map((item) => (
                item.type === 'dropdown' ? (
                  <div key={item.label} className="space-y-4">
                    <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <div className="pl-4 space-y-4">
                      {item.items?.map((subItem) => (
                        subItem.url ? (
                          <a
                            key={subItem.label}
                            href={subItem.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-2xl font-black uppercase tracking-tighter font-space italic text-slate-400 hover:text-cyan-500"
                          >
                            {subItem.label}
                          </a>
                        ) : (
                          <button 
                            key={subItem.label}
                            onClick={() => handleNavClick(subItem.view!)} 
                            className={`block text-2xl font-black uppercase tracking-tighter font-space italic ${
                              currentView === subItem.view ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-cyan-500'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        )
                      ))}
                    </div>
                  </div>
                ) : item.url ? (
                  <a
                    key={item.label}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic text-slate-400 hover:text-cyan-500 dark:text-slate-500 dark:hover:text-cyan-500"
                  >
                    {item.label}
                  </a>
                ) : (
                  <button 
                    key={item.view}
                    onClick={() => handleNavClick(item.view!)} 
                    className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                      currentView === item.view ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-cyan-500 dark:text-slate-500 dark:hover:text-cyan-500'
                    }`}
                  >
                    {item.label}
                  </button>
                )
              ))}
              <button 
                onClick={() => handleNavClick('contact')}
                className={`block w-full text-left text-2xl font-black uppercase tracking-tighter font-space italic ${
                  currentView === 'contact' ? 'text-cyan-500' : 'text-slate-400 hover:text-cyan-500 dark:text-slate-500 dark:hover:text-cyan-500'
                }`}
              >
                CONTACT SHIZZY
              </button>
            </nav>
          </div>
        </>
      )}
    </header>
  );
};
