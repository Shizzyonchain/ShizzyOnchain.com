import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header.tsx';
import { Ticker } from './components/Ticker.tsx';
import { NewsCard } from './components/NewsCard.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { VideoSection } from './components/VideoSection.tsx';
import { NewsArticle } from './types.ts';
import { ArrowLeft, Search as SearchIcon, X } from 'lucide-react';
import { SOCIAL_LINKS, HOT_STORIES, JAM_ARTICLE, CYCLE_ARTICLE, TAO_ARTICLE } from './constants.tsx';

const LIVE_STREAMS = [
  { id: 'l5', title: '🚨SURVIVE & THRIVE in 2026!🔥 The ONLY Guide to Stay SANE Until Valhalla 🤯🚀', thumbnail: 'https://img.youtube.com/vi/lkxQv50MOSI/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=lkxQv50MOSI&t=6971s', type: 'live' as const },
  { id: 'l4', title: '🚨FED & STIMULUS DECIDE 2026?!💥 What Happens NEXT Could MAKE or BREAK Crypto!📈😱', thumbnail: 'https://img.youtube.com/vi/X6Lr9ZkZOLc/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=X6Lr9ZkZOLc&t=5420s', type: 'live' as const },
  { id: 'l3', title: '🚨IS THIS PUMP FOR REAL?!🔥 Or Is It Another BRUTAL TRAP Before the NEXT DUMP?!😱📉', thumbnail: 'https://img.youtube.com/vi/PVn2HW2MMuM/maxresdefault.jpg', url: 'https://www.youtube.com/watch?v=PVn2HW2MMuM&t=10s', type: 'live' as const },
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

type View = 'home' | 'all-streams' | 'all-shorts';

const App: React.FC = () => {
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(TAO_ARTICLE);
  const [darkMode, setDarkMode] = useState(true);
  const [currentView, setCurrentView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchArticle = (topic: string) => {
    const t = topic.toLowerCase();
    if (t.includes('2019') || t.includes('liquidity roadmap')) {
      setFeaturedArticle(CYCLE_ARTICLE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('jam') || t.includes('blueprint')) {
      setFeaturedArticle(JAM_ARTICLE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (t.includes('tao') || t.includes('cash flows')) {
      setFeaturedArticle(TAO_ARTICLE);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.remove('dark');
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

  const renderContent = () => {
    if (currentView === 'home') {
      return (
        <div className="space-y-12">
          <div className={`grid grid-cols-1 ${HOT_STORIES.length > 0 ? 'lg:grid-cols-[1fr_360px]' : 'lg:grid-cols-1'} gap-12`}>
            <div className="w-full">
              {featuredArticle && <NewsCard article={featuredArticle} />}
            </div>

            <Sidebar onStoryClick={(title) => fetchArticle(title)} />
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

    const isStreams = currentView === 'all-streams';
    const items = isStreams ? filteredStreams : filteredShorts;
    const title = isStreams ? "Onchain revolution daily live videos" : "All Shorts";
    const aspectRatio = isStreams ? "video" : "portrait";

    return (
      <div className="max-w-6xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
    <div className="min-h-screen pb-20 selection:bg-blue-600/30 bg-slate-50 dark:bg-[#0b0e14] transition-colors duration-300">
      <Ticker />
      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="max-w-[1400px] mx-auto px-6 mt-8 md:mt-10">
        {renderContent()}
      </main>

      <footer className="max-w-[1400px] mx-auto px-6 mt-32 pt-16 border-t border-slate-200 dark:border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="flex flex-col gap-4 items-center md:items-start">
            <a 
              href={SOCIAL_LINKS.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="h-12 block"
            >
              <img 
                src={SOCIAL_LINKS.logo} 
                alt="Logo" 
                className="h-full w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer dark:invert-0" 
              />
            </a>
          </div>
          <div className="text-slate-500 dark:text-slate-600 text-[11px] leading-relaxed max-w-lg font-medium opacity-80">
            Shizzy's Insights provides data-driven perspectives for educational purposes only. This content is not financial advice. Always consult a professional before making investment decisions. All analysis powered by the OnChain Revolution engine.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;