
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { Overview } from './components/Overview.tsx';
import { AINewsFeed } from './components/AINewsFeed.tsx';
import { VideosFeed } from './components/VideosFeed.tsx';
import { AICoinsDashboard } from './components/AICoinsDashboard.tsx';
import { CryptoCoinsDashboard } from './components/CryptoCoinsDashboard.tsx';
import { CryptoNewsFeed } from './components/CryptoNewsFeed.tsx';
import { ToolsHub } from './components/ToolsHub.tsx';
import { BittensorSubnets } from './components/BittensorSubnets.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { SendTip } from './components/SendTip.tsx';
import { Portfolio } from './components/Portfolio.tsx';
import { AllComments } from './components/AllComments.tsx';
import { Footer } from './components/Footer.tsx';
import { Shop } from './components/Shop.tsx';
import { View } from './types.ts';

// v2.0.2 - Fixed localStorage crashes & Added Error Boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-black text-rose-500 p-10 font-mono">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-2xl font-black uppercase tracking-tighter">CRITICAL_SYSTEM_ERROR</h1>
            <p className="text-xs opacity-60 uppercase tracking-widest">The intelligence node has encountered a fatal exception.</p>
            <pre className="bg-rose-500/10 p-6 rounded-xl border border-rose-500/20 text-[10px] overflow-auto max-h-96">
              {this.state.error?.stack || this.state.error?.message}
            </pre>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-rose-500 text-black font-black uppercase tracking-widest text-[10px] rounded-lg"
            >
              Restart Node
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      else if (hash === '#/bittensor') setCurrentView('bittensor-subnets');
      else if (hash === '#/bittensor-subnets') setCurrentView('bittensor-subnets');
      else if (hash === '#/ai-history') setCurrentView('ai-history');
      else if (hash === '#/contact') setCurrentView('contact');
      else if (hash === '#/send-tip') setCurrentView('send-tip');
      else if (hash === '#/portfolio') setCurrentView('portfolio');
      else if (hash === '#/all-comments') setCurrentView('all-comments');
      else if (hash === '#/shop') setCurrentView('shop');
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
    switch (currentView) {
      case 'research': return (
        <div className="max-w-[1400px] mx-auto py-10 px-6">
          <ResearchDashboard />
        </div>
      );
      case 'defi': return (
        <div className="max-w-[1400px] mx-auto py-10 px-6">
          <DefiDashboard />
        </div>
      );
      case 'bubbles': return <BubblesDashboard />;
      case 'ainews': return (
        <div className="max-w-[1400px] mx-auto px-6">
          <AINewsFeed />
        </div>
      );
      case 'cryptonews': return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <CryptoNewsFeed />
        </div>
      );
      case 'videos': return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <VideosFeed />
        </div>
      );
      case 'aicoins': return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <AICoinsDashboard />
        </div>
      );
      case 'cryptocoins': return (
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <CryptoCoinsDashboard />
        </div>
      );
      case 'tools': return <ToolsHub onNavigate={handleViewChange} />;
      case 'bittensor-subnets':
      case 'bittensor': return <BittensorSubnets />;
      case 'contact': return <ContactPage />;
      case 'send-tip': return <SendTip />;
      case 'portfolio': return <Portfolio />;
      case 'all-comments': return <AllComments />;
      case 'shop': return <Shop onViewChange={handleViewChange} />;
      default: return <Overview />;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F7F7F8] dark:bg-[#050505] transition-colors duration-300 font-sans text-[#111111] dark:text-slate-200 relative terminal-glow">
      <div className="fixed inset-0 noise pointer-events-none z-[999] opacity-[0.03]" />
      <div className="fixed inset-0 scanline pointer-events-none z-[998]" />
      
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} onViewChange={handleViewChange} currentView={currentView} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
    </ErrorBoundary>
  );
};

export default App;
