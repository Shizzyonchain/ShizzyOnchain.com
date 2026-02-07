import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Ticker } from './components/Ticker.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { Overview } from './components/Overview.tsx';
import { AINewsFeed } from './components/AINewsFeed.tsx';
import { CryptoNewsFeed } from './components/CryptoNewsFeed.tsx';
import { VideosFeed } from './components/VideosFeed.tsx';
import { ArticleDetailView } from './components/ArticleDetailView.tsx';
import { AICoinsDashboard } from './components/AICoinsDashboard.tsx';
import { CryptoCoinsDashboard } from './components/CryptoCoinsDashboard.tsx';
import { DailyRipsFeed } from './components/DailyRipsFeed.tsx';
import { ToolsHub } from './components/ToolsHub.tsx';
import { View } from './types.ts';
import { SOCIAL_LINKS } from './constants.tsx';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/home';
      
      if (hash.startsWith('#/article/')) {
        const id = hash.replace('#/article/', '');
        setSelectedArticleId(id);
        setCurrentView('article-detail');
        window.scrollTo(0, 0);
        return;
      }

      setSelectedArticleId(null);
      if (hash === '#/overview') setCurrentView('overview');
      else if (hash === '#/ainews') setCurrentView('ainews');
      else if (hash === '#/cryptonews') setCurrentView('cryptonews');
      else if (hash === '#/videos') setCurrentView('videos');
      else if (hash === '#/research') setCurrentView('research');
      else if (hash === '#/defi') setCurrentView('defi');
      else if (hash === '#/bubbles') setCurrentView('bubbles');
      else if (hash === '#/aicoins') setCurrentView('aicoins');
      else if (hash === '#/cryptocoins') setCurrentView('cryptocoins');
      else if (hash === '#/daily-rips') setCurrentView('all-daily-rips');
      else if (hash === '#/tools') setCurrentView('tools');
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
    if (view === 'all-daily-rips') {
      window.location.hash = `#/daily-rips`;
    } else {
      window.location.hash = `#/${view}`;
    }
    
    if (scrollToSection) {
      setTimeout(() => {
        const el = document.getElementById(scrollToSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const renderContent = () => {
    if (currentView === 'article-detail' && selectedArticleId) {
      return <ArticleDetailView articleId={selectedArticleId} onBack={() => window.history.back()} />;
    }
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
    if (currentView === 'ainews') return (
      <div className="max-w-[1400px] mx-auto px-6">
        <AINewsFeed />
      </div>
    );
    if (currentView === 'cryptonews') return (
      <div className="max-w-[1400px] mx-auto px-6">
        <CryptoNewsFeed />
      </div>
    );
    if (currentView === 'videos') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <VideosFeed />
      </div>
    );
    if (currentView === 'aicoins') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <AICoinsDashboard />
      </div>
    );
    if (currentView === 'cryptocoins') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <CryptoCoinsDashboard />
      </div>
    );
    if (currentView === 'all-daily-rips') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <DailyRipsFeed />
      </div>
    );
    if (currentView === 'tools') return <ToolsHub onNavigate={handleViewChange} />;

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
          <p className="text-[11px] text-slate-500 font-mono uppercase tracking-[0.2em] leading-relaxed">
            Shizzy Unchained is an independent AI and crypto media project.<br/>
            For education and discussion only. Not financial advice.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;