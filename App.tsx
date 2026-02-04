
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Ticker } from './components/Ticker.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { Overview } from './components/Overview.tsx';
import { View } from './types.ts';
import { SOCIAL_LINKS } from './constants.tsx';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/home';
      if (hash === '#/overview') setCurrentView('overview');
      else if (hash === '#/research') setCurrentView('research');
      else if (hash === '#/defi') setCurrentView('defi');
      else if (hash === '#/bubbles') setCurrentView('bubbles');
      else setCurrentView('home');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  const handleViewChange = (view: View, scrollToSection?: string) => {
    window.location.hash = `#/${view}`;
    if (scrollToSection) {
      setTimeout(() => {
        const el = document.getElementById(scrollToSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const renderContent = () => {
    if (currentView === 'research') return (
      <div className="max-w-[1400px] mx-auto py-10 px-6">
        <ResearchDashboard />
      </div>
    );
    if (currentView === 'defi') return (
      <div className="max-w-[1400px] mx-auto py-10 px-6">
        <DefiDashboard />
      </div>
    );
    if (currentView === 'bubbles') return <BubblesDashboard />;

    // Overview acts as the primary Home screen
    return <Overview />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0e14] transition-colors duration-300 font-inter">
      <Ticker />
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} onViewChange={handleViewChange} currentView={currentView} />
      <main className="mt-8">
        {renderContent()}
      </main>
      {currentView !== 'bubbles' && (
        <footer className="max-w-[1400px] mx-auto px-6 py-20 border-t border-slate-200 dark:border-white/5 text-center">
          <img src={SOCIAL_LINKS.logo} alt="Logo" className="h-16 mx-auto mb-8 opacity-50 hover:opacity-100 transition-opacity" />
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
            SHIZZY UNCHAINED: Manual AI Intelligence Node.<br/>
            Educational purposes only. No financial advice.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
