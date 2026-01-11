
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
import { ArrowLeft, Search as SearchIcon, X, Calendar, Terminal } from 'lucide-react';
import { SOCIAL_LINKS, HOT_STORIES, JAM_ARTICLE, CYCLE_ARTICLE, TAO_ARTICLE, PROVEX_ARTICLE, AGENT_CYCLE_ARTICLE, OCT_10_ARTICLE } from './constants.tsx';

const LIVE_STREAMS = [
  { id: 'l5', title: '🚨SURVIVE & THRIVE in 2026!🔥 The ONLY Guide to Stay SANE Until Valhalla 🤯🚀', thumbnail: 'https://img.youtube.com/vi/lkxQv50MOSI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=lkxQv50MOSI&t=6971s', type: 'live' as const },
  { id: 'l4', title: '🚨FED & STIMULUS DECIDE 2026?!💥 What Happens NEXT Could MAKE or BREAK Crypto!📈😱', thumbnail: 'https://img.youtube.com/vi/X6Lr9ZkZOLc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=X6Lr9ZkZOLc&t=5420s', type: 'live' as const },
  { id: 'l3', title: '🚨IS THIS PUMP FOR REAL?!🔥 Or Is It Another BRUTAL TRAP Before the NEXT DUMP?!😱📉', thumbnail: 'https://img.youtube.com/vi/PVn2HW2NMuM/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=PVn2HW2NMuM&t=60s', type: 'live' as const },
  { id: 'l2', title: '🚨Prediction Markets Set to EXPLODE?!🔥 The BIGGEST Retail Money Play in Web3 for 2026 🤯🚀', thumbnail: 'https://img.youtube.com/vi/AVgD7BNCPtE/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=AVgD7BNCPtE&t=4121s', type: 'live' as const },
  { id: 'l1', title: '🚨These Crypto Sectors Could EXPLODE in 2026!🔥 Momentum Is Building FAST — Don’t Miss This!🚀', thumbnail: 'https://img.youtube.com/vi/yGqZFtoLDxI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=yGqZFtoLDxI&t=2472s', type: 'live' as const },
];

const SHORTS = [
  { id: 's1', title: 'XRP PRICE TARGETS: Is 2025 The Year? 💎', thumbnail: 'https://img.youtube.com/vi/FH0q1ICQqnA/hqdefault.jpg', url: 'https://www.youtube.com/shorts/FH0q1ICQqnA', type: 'short' as const },
  { id: 's2', title: 'ON-CHAIN ALPHA: Whale Movements Explained 🐋', thumbnail: 'https://img.youtube.com/vi/s4JMTqzyq54/hqdefault.jpg', url: 'https://www.youtube.com/shorts/s4JMTqzyq54', type: 'short' as const },
  { id: 's3', title: 'CRYPTO MARKET PSYCHOLOGY 🧠', thumbnail: 'https://img.youtube.com/vi/m3pMAB6qbNM/hqdefault.jpg', url: 'https://www.youtube.com/shorts/m3pMAB6qbNM', type: 'short' as const },
  { id: 's4', title: 'BITCOIN VS BANKS: The On-Chain Revolution 🚀', thumbnail: 'https://img.youtube.com/vi/MQxTLZI1XPA/hqdefault.jpg', url: 'https://www.youtube.com/shorts/MQxTLZI1XPA', type: 'short' as const },
  { id: 's5', title: 'SOLANA: The High-Speed Ecosystem ⚡️', thumbnail: 'https://img.youtube.com/vi/yFllDUzV_HQ/hqdefault.jpg', url: 'https://www.youtube.com/shorts/yFllDUzV_HQ', type: 'short' as const },
  { id: 's6', title: 'ETHEREUM BURN RATE EXPLAINED 🔥', thumbnail: 'https://img.youtube.com/vi/FH0q1ICQqnA/mqdefault.jpg', url: 'https://www.youtube.com/shorts/FH0q1ICQqnA', type: 'short' as const },
  { id: 's7', title: 'STABLECOIN WARS: Who Wins? 🏛️', thumbnail: 'https://img.youtube.com/vi/s4JMTqzyq54/mqdefault.jpg', url: 'https://www.youtube.com/shorts/s4JMTqzyq54', type: 'short' as const },
];

const App: React.FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(OCT_10_ARTICLE);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticle = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('10/10') || t.includes('downward spiral')) {
      setFeaturedArticle(OCT_10_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('2019') || t.includes('liquidity roadmap')) {
      setFeaturedArticle(CYCLE_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('jam') || t.includes('blueprint')) {
      setFeaturedArticle(JAM_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('tao') || t.includes('cash flows')) {
      setFeaturedArticle(TAO_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('provex') || t.includes('richard heart')) {
      setFeaturedArticle(PROVEX_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('agent') || t.includes('x402') || t.includes('8004')) {
      setFeaturedArticle(AGENT_CYCLE_ARTICLE);
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentView('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoHome = () => {
    setCurrentView('home');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('class');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const filteredStreams = useMemo(() => {
    return LIVE_STREAMS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredShorts = useMemo(() => {
    return SHORTS.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const filteredStories = useMemo(() => {
    return HOT_STORIES.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const renderContent = () => {
    if (currentView === 'research') {
      return (
        <div className="max-w-[1400px] mx-auto py-10 animate-in fade-in duration-500 px-6">
          <div className="mb-12">
            <button 
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
            </button>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-5xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-4">
                  Research <span className="text-blue-600">Terminal</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed max-w-2xl">
                  Deep on-chain intelligence and real-time market categorization powered by the <span className="text-blue-500 font-black">coingecko terminal.</span>
                </p>
              </div>
              <div className="hidden lg:block p-4 border border-blue-500/20 bg-blue-500/5 rounded-2xl">
                <div className="flex items-center gap-3 text-blue-500 mb-1">
                  <Terminal size={18} />
                  <span className="text-[10px] font-black font-mono uppercase tracking-widest">System Status</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-tight">
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Proxy Layer Active</div>
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Cache Sync: Healthy</div>
                  <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Data Ingress: 20ms</div>
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
              onClick={() => setCurrentView('home')}
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
              onStoryClick={(title) => fetchArticle(title)} 
              onViewAll={() => { setCurrentView('all-stories'); window.scrollTo(0,0); }}
            />
          </div>

          <div className="space-y-16">
            <VideoSection 
              title="Onchain revolution daily live videos" 
              videos={LIVE_STREAMS} 
              aspectRatio="video" 
              limit={5}
              onViewAll={() => { setCurrentView('all-streams'); window.scrollTo(0,0); }}
            />

            <VideoSection 
              title="Daily Shorts" 
              videos={SHORTS} 
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
            onClick={() => { setCurrentView('home'); setSearchQuery(''); }}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                All Hot Takes
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs uppercase tracking-widest">
                Deep dives and on-chain analysis by Shizzy
              </p>
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
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filteredStories.map((story) => (
              <button 
                key={story.id} 
                onClick={() => fetchArticle(story.title)}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-blue-500/50 transition-all text-left group"
              >
                <div className="space-y-2">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {story.title}
                  </h4>
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

          {filteredStories.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">
                No matching stories found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      );
    }

    const isStreams = currentView === 'all-streams';
    const items = isStreams ? filteredStreams : filteredShorts;
    const title = isStreams ? "Onchain revolution daily live videos" : "All Shorts";
    const aspectRatio = isStreams ? "video" : "portrait";

    return (
      <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500 px-6">
        <button 
          onClick={() => { setCurrentView('home'); setSearchQuery(''); }}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
              {title}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium font-mono text-xs uppercase tracking-widest">
              Exploring the full archive of OnChain Revolution
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder={`Search ${isStreams ? 'streams' : 'shorts'}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-800 dark:text-white"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {items.length > 0 ? (
          <VideoSection 
            title="" 
            videos={items} 
            aspectRatio={aspectRatio as any} 
          />
        ) : (
          <div className="py-20 text-center">
            <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">No matching content found for "{searchQuery}"</p>
          </div>
        )}
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
              <a 
                href={SOCIAL_LINKS.website}
                target="_blank"
                rel="noopener noreferrer"
                className="h-20 block"
              >
                <img 
                  src={SOCIAL_LINKS.logo} 
                  alt="Logo" 
                  className="h-full w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer dark:invert-0" 
                />
              </a>
            </div>
            <div className="text-slate-500 dark:text-slate-600 text-[11px] leading-relaxed max-w-lg font-medium opacity-80">
              SHIZZY'S ONCHAIN INSIGHTS provides data-driven perspectives for educational purposes only. This content is not financial advice. Always consult a professional before making investment decisions. All analysis powered by the OnChain Revolution engine.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
