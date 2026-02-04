
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { Ticker } from './components/Ticker.tsx';
import { VideoSection } from './components/VideoSection.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { Overview } from './components/Overview.tsx';
import { AINewsFeed } from './components/AINewsFeed.tsx';
import { NewsArticle, View } from './types.ts';
import { ArrowLeft, Search as SearchIcon, Terminal, RefreshCcw } from 'lucide-react';
import { SOCIAL_LINKS } from './constants.tsx';
import { youtubeService } from './services/youtubeService.ts';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url?: string;
  type: 'live' | 'short';
}

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [liveStreams, setLiveStreams] = useState<VideoItem[]>([]);
  const [shorts, setShorts] = useState<VideoItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const data = await youtubeService.getLatestVideos();
      if (data.lives.length > 0) setLiveStreams(data.lives);
      if (data.shorts.length > 0) setShorts(data.shorts);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleViewChange = (view: View, scrollToSection?: string) => {
    window.location.hash = `#/${view}`;
    if (scrollToSection) {
      setTimeout(() => {
        document.getElementById(scrollToSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const renderContent = () => {
    if (currentView === 'overview') return <Overview />;
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

    return (
      <div className="max-w-[1400px] mx-auto px-6 space-y-20 pb-20">
        <AINewsFeed />
        
        <div id="video-explorer" className="pt-20 border-t border-slate-200 dark:border-white/10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">Intelligence Briefings</h2>
            <button 
              onClick={handleManualSync} 
              disabled={isSyncing}
              className="flex items-center gap-2 text-[10px] font-mono font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest disabled:opacity-50"
            >
              <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Linking...' : 'Sync Video'}
            </button>
          </div>
          <VideoSection title="" videos={liveStreams} aspectRatio="video" limit={5} />
          <VideoSection title="Shorts" videos={shorts} aspectRatio="portrait" limit={7} />
        </div>
      </div>
    );
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
            SHIZZY UNCHAINED: AI Intelligence & Narrative Analysis.<br/>
            Educational purposes only. No financial advice.
          </p>
        </footer>
      )}
    </div>
  );
};

export default App;
