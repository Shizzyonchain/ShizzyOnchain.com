
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { Overview } from './components/Overview.tsx';
import { AINewsFeed } from './components/AINewsFeed.tsx';
import { VideosFeed } from './components/VideosFeed.tsx';
import { AICoinsDashboard } from './components/AICoinsDashboard.tsx';
import { CryptoCoinsDashboard } from './components/CryptoCoinsDashboard.tsx';
import { TaoAlphaDashboard } from './components/TaoAlphaDashboard.tsx';
import { ToolsHub } from './components/ToolsHub.tsx';
import { BittensorHub } from './components/BittensorHub.tsx';
import { BittensorSubnets } from './components/BittensorSubnets.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { SendTip } from './components/SendTip.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { AllComments } from './components/AllComments.tsx';
import { View } from './types.ts';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/home';
      
      if (hash === '#/overview') setCurrentView('overview');
      else if (hash === '#/ainews') setCurrentView('ainews');
      else if (hash === '#/cryptonews') setCurrentView('cryptonews');
      else if (hash === '#/videos') setCurrentView('videos');
      else if (hash === '#/research') setCurrentView('research');
      else if (hash === '#/defi') setCurrentView('defi');
      else if (hash === '#/bubbles') setCurrentView('bubbles');
      else if (hash === '#/aicoins') setCurrentView('aicoins');
      else if (hash === '#/cryptocoins') setCurrentView('cryptocoins');
      else if (hash === '#/tools') setCurrentView('tools');
      else if (hash === '#/bittensor') setCurrentView('bittensor');
      else if (hash === '#/bittensor-subnets') setCurrentView('bittensor-subnets');
      else if (hash === '#/ai-history') setCurrentView('ai-history');
      else if (hash === '#/contact') setCurrentView('contact');
      else if (hash === '#/send-tip') setCurrentView('send-tip');
      else if (hash === '#/portfolio') setCurrentView('portfolio');
      else if (hash === '#/all-comments') setCurrentView('all-comments');
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
    if (currentView === 'ainews') return (
      <div className="max-w-[1400px] mx-auto px-6">
        <AINewsFeed />
      </div>
    );
    if (currentView === 'cryptonews') return (
      <TaoAlphaDashboard />
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
    if (currentView === 'tools') return <ToolsHub onNavigate={handleViewChange} />;
    if (currentView === 'bittensor') return <BittensorHub />;
    if (currentView === 'bittensor-subnets') return <BittensorSubnets />;
    if (currentView === 'contact') return <ContactPage />;
    if (currentView === 'send-tip') return <SendTip />;
    if (currentView === 'portfolio') return <Portfolio />;
    if (currentView === 'all-comments') return <AllComments />;

    return <Overview />;
  };

  return (
    <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#050505] transition-colors duration-300 font-sans text-[#111111] dark:text-slate-200 relative">
      <div className="fixed inset-0 noise pointer-events-none z-[999]" />
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} onViewChange={handleViewChange} currentView={currentView} />
      <main className="relative z-10">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
