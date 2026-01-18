
import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { Ticker } from './components/Ticker.tsx';
import { NewsCard } from './components/NewsCard.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { VideoSection } from './components/VideoSection.tsx';
import { ResearchDashboard } from './components/ResearchDashboard.tsx';
import { DefiDashboard } from './components/DefiDashboard.tsx';
import { BubblesDashboard } from './components/BubblesDashboard.tsx';
import { NewsArticle, View } from './types.ts';
import { ArrowLeft, Search as SearchIcon, X, Calendar, Terminal, RefreshCcw } from 'lucide-react';
import { SOCIAL_LINKS, HOT_STORIES, JAM_ARTICLE, CYCLE_ARTICLE, TAO_ARTICLE, PROVEX_ARTICLE, AGENT_CYCLE_ARTICLE, OCT_10_ARTICLE } from './constants.tsx';
import { youtubeService } from './services/youtubeService.ts';

export interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url?: string;
  type: 'live' | 'short';
}

const ALL_ARTICLES: Record<string, NewsArticle> = {
  'oct-10-spiral': OCT_10_ARTICLE,
  'agent-money': AGENT_CYCLE_ARTICLE,
  'provex': PROVEX_ARTICLE,
  'tao': TAO_ARTICLE,
  'cycle': CYCLE_ARTICLE,
  'jam': JAM_ARTICLE
};

// Cleared initial data to allow for fresh manual/dynamic population
const INITIAL_LIVE_STREAMS: VideoItem[] = [];
const INITIAL_SHORTS: VideoItem[] = [];

const App: React.FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(OCT_10_ARTICLE);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [liveStreams, setLiveStreams] = useState<VideoItem[]>(INITIAL_LIVE_STREAMS);
  const [shorts, setShorts] = useState<VideoItem[]>(INITIAL_SHORTS);
  const [isSyncing, setIsSyncing] = useState(false);

  // Parse Routing from Hash for deep-linking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/home';
      
      if (hash.startsWith('#/article/')) {
        const id = hash.replace('#/article/', '');
        const article = ALL_ARTICLES[id];
        if (article) {
          setFeaturedArticle(article);
          setCurrentView('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '#/research') {
        setCurrentView('research');
      } else if (hash === '#/defi') {
        setCurrentView('defi');
      } else if (hash === '#/bubbles') {
        setCurrentView('bubbles');
      } else if (hash === '#/home') {
        setCurrentView('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run on mount

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const data = await youtubeService.getLatestVideos();
      if (data.lives.length > 0) {
        setLiveStreams(data.lives);
      }
      if (data.shorts.length > 0) {
        setShorts(data.shorts);
      }
    } catch (e) {
      console.error("Manual YouTube sync failed:", e);
    } finally {
      setIsSyncing(false);
    }
  };

  const navigateToArticle = (id: string) => {
    window.location.hash = `#/article/${id}`;
  };

  const handleViewChange = (view: View, scrollToSection?: string) => {
    if (view === 'home' && !scrollToSection) {
      window.location.hash = '#/home';
    } else if (view === 'research') {
      window.location.hash = '#/research';
    } else if (view === 'defi') {
      window.location.hash = '#/defi';
    } else if (view === 'bubbles') {
      window.location.hash = '#/bubbles';
    }

    if (scrollToSection) {
      setTimeout(() => {
        const element = document.getElementById(scrollToSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const filteredStreams = useMemo(() => {
    return liveStreams.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, liveStreams]);

  const filteredShorts = useMemo(() => {
    return shorts.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery, shorts]);

  const filteredStories = useMemo(() => {
    return HOT_STORIES.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const renderContent = () => {
    if (currentView === 'research') {
      return (
        <div className="max-w-[1400px] mx-auto py-10 animate-in fade-in duration-500 px-6">
          <div className="mb-12">
            <button 
              onClick={() => handleViewChange('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-4 italic">
                  Research <span className="text-blue-600">Terminal</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
                  Deep on-chain intelligence powered by SHIZZY UNCHAINED.
                </p>
              </div>
              <div className="hidden lg:block p-4 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
                <div className="flex items-center gap-3 text-blue-500 mb-1">
                  <Terminal size={18} />
                  <span className="text-[10px] font-black font-mono uppercase tracking-widest">System Status</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-tight">
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Proxy Layer Active</div>
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Data Ingress: Stable</div>
                </div>
              </div>
            </div>
          </div>
          <ResearchDashboard />
        </div>
      );
    }

    if (currentView === 'defi') {
      return (
        <div className="max-w-[1400px] mx-auto py-10 animate-in fade-in duration-500 px-6">
          <div className="mb-12">
            <button 
              onClick={() => handleViewChange('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
          </div>
          <DefiDashboard />
        </div>
      );
    }

    if (currentView === 'bubbles') {
      return (
        <div className="w-full h-[150vh] animate-in fade-in duration-500 relative">
          <BubblesDashboard />
        </div>
      );
    }

    if (currentView === 'home') {
      return (
        <div className="max-w-[1400px] mx-auto px-6 space-y-12">
          <div className={`grid grid-cols-1 ${HOT_STORIES.length > 0 ? 'lg:grid-cols-[1fr_360px]' : 'lg:grid-cols-1'} gap-12`}>
            <div className="w-full">
              {featuredArticle && <NewsCard article={featuredArticle} />}
            </div>
            <Sidebar 
              onStoryClick={(id) => navigateToArticle(id)} 
              onViewAll={() => { setCurrentView('all-stories'); window.scrollTo(0,0); }}
            />
          </div>

          <div id="video-explorer" className="space-y-16 pt-12 scroll-mt-24">
            <div className="relative">
              <div className="flex justify-between items-center">
                <div className="relative">
                  <h2 className="text-xl md:text-2xl font-extrabold font-space text-slate-900 dark:text-white uppercase tracking-tight italic">
                    Shizzy Unchained Videos
                  </h2>
                  <div className="absolute -bottom-1.5 left-0 w-8 h-1 bg-blue-600 rounded-full"></div>
                </div>
                <button 
                  onClick={handleManualSync} 
                  disabled={isSyncing}
                  className="flex items-center gap-2 text-[10px] font-mono font-bold text-blue-500 hover:text-blue-400 uppercase tracking-widest transition-colors disabled:opacity-50"
                >
                  <RefreshCcw size={14} className={isSyncing ? 'animate-spin' : ''} />
                  {isSyncing ? 'Establishing Link...' : 'Sync YouTube'}
                </button>
              </div>
              
              <VideoSection 
                title="" 
                videos={liveStreams} 
                aspectRatio="video" 
                limit={5}
                onViewAll={() => { setCurrentView('all-streams'); window.scrollTo(0,0); }}
              />
            </div>

            <VideoSection 
              title="Shizzy Unchained Shorts" 
              videos={shorts} 
              aspectRatio="portrait" 
              limit={7}
              onViewAll={() => { setCurrentView('all-shorts'); window.scrollTo(0,0); }}
            />
          </div>
        </div>
      );
    }

    if (currentView === 'all-stories') {
      return (
        <div className="max-w-4xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6">
          <button 
            onClick={() => { handleViewChange('home'); setSearchQuery(''); }}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">All Hot Takes</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs uppercase tracking-widest">Shizzy Unchained</p>
            </div>
            <div className="relative w-full md:w-80">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6">
            {filteredStories.map((story) => (
              <button 
                key={story.id} 
                onClick={() => navigateToArticle(story.id)}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-500/50 transition-all text-left group"
              >
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{story.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono uppercase tracking-widest font-bold">
                    <Calendar size={12} className="text-blue-500" />
                    <span>{story.date}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-blue-500 font-black font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                  Read More <ArrowLeft size={14} className="rotate-180" />
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    const isStreams = currentView === 'all-streams';
    const items = isStreams ? filteredStreams : filteredShorts;
    const title = isStreams ? "Shizzy Unchained Videos" : "Shizzy Unchained Shorts";
    const aspectRatio = isStreams ? "video" : "portrait";

    return (
      <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6">
        <button 
          onClick={() => { handleViewChange('home'); setSearchQuery(''); }}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-2 italic">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs uppercase tracking-widest">Shizzy Unchained Archive</p>
          </div>
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={`Search...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
            />
          </div>
        </div>
        <VideoSection title="" videos={items} aspectRatio={aspectRatio as any} />
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-20 selection:bg-[#f97316]/30 bg-slate-50 dark:bg-[#0b0e14] transition-colors duration-300">
      <Ticker />
      <Header 
        darkMode={darkMode} 
        toggleTheme={toggleTheme} 
        onViewChange={handleViewChange}
        currentView={currentView}
      />
      <main className={`w-full mx-auto ${currentView === 'bubbles' ? 'mt-0' : 'mt-8 md:mt-10'}`}>
        {renderContent()}
      </main>
      {currentView !== 'bubbles' && (
        <footer className="max-w-[1400px] mx-auto px-6 mt-32 pt-16 border-t border-slate-200 dark:border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
            <div className="flex flex-col gap-4 items-center md:items-start">
              <button 
                onClick={() => handleViewChange('home')}
                className="h-20 block"
              >
                <img src={SOCIAL_LINKS.logo} alt="Shizzy Unchained" className="h-full w-auto opacity-60 hover:opacity-100 transition-all cursor-pointer dark:invert-0 brightness-0 dark:brightness-100 dark:opacity-40 hover:dark:opacity-100" />
              </button>
            </div>
            <div className="text-slate-500 dark:text-slate-600 text-[11px] leading-relaxed max-w-lg font-medium opacity-80">
              SHIZZY UNCHAINED provides data-driven perspectives for educational purposes only. This content is not financial advice.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
