
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
import { AIHistory } from './components/AIHistory.tsx';
import { WalletChecker } from './components/WalletChecker.tsx';
import { View } from './types.ts';
import { SOCIAL_LINKS } from './constants.tsx';
import { Mail, ExternalLink, Youtube, Music, Send } from 'lucide-react';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

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
      else if (hash === '#/daily-rips') setCurrentView('daily-rips');
      else if (hash === '#/tools') setCurrentView('tools');
      else if (hash === '#/ai-history') setCurrentView('ai-history');
      else if (hash === '#/wallet-checker') setCurrentView('wallet-checker');
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
    if (currentView === 'daily-rips') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <DailyRipsFeed />
      </div>
    );
    if (currentView === 'tools') return <ToolsHub onNavigate={handleViewChange} />;
    if (currentView === 'ai-history') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <AIHistory />
      </div>
    );
    if (currentView === 'wallet-checker') return (
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        <WalletChecker />
      </div>
    );

    return <Overview />;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0e14] transition-colors duration-300 font-inter text-slate-900 dark:text-slate-200">
      <Ticker />
      <Header darkMode={darkMode} toggleTheme={() => setDarkMode(!darkMode)} onViewChange={handleViewChange} currentView={currentView} />
      <main className="mt-8">
        {renderContent()}
      </main>
      
      {currentView !== 'bubbles' && (
        <footer className="max-w-[1400px] mx-auto px-6 py-20 mt-12 border-t border-slate-200 dark:border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Branding & Mission */}
            <div className="space-y-8">
              <div className="text-4xl font-black font-space italic text-slate-900 dark:text-white uppercase tracking-tighter">
                SHIZZY<span className="text-blue-600">UNCHAINED</span>
              </div>
              <p className="text-sm text-slate-500 font-mono uppercase tracking-[0.2em] leading-relaxed max-w-md">
                SHIZZYUNCHAINED is an independent AI and crypto research entity.<br/>
                Strategic intelligence. On-chain validation. Not financial advice.
              </p>
            </div>

            {/* Social & Connect Card - Reorganized based on user request */}
            <div className="bg-[#0f172a] dark:bg-[#0f172a] rounded-[2.5rem] p-10 md:p-14 border border-white/5 shadow-2xl space-y-10">
              {/* Social Channels Section */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SOCIAL CHANNELS</h4>
                
                <div className="space-y-4">
                  {/* Personal X */}
                  <a href={SOCIAL_LINKS.personalX} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-black rounded-xl border border-white/10 group-hover:border-blue-500/50 transition-colors">
                        <XIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl md:text-2xl font-black font-space italic text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">SHIZZY (X)</span>
                    </div>
                    <ExternalLink size={20} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </a>

                  {/* Unchained X - Moved back up to SOCIAL CHANNELS */}
                  <a href={SOCIAL_LINKS.unchainedX} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-black rounded-xl border border-white/10 group-hover:border-blue-500/50 transition-colors">
                        <XIcon className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xl md:text-2xl font-black font-space italic text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">UNCHAINED (X)</span>
                    </div>
                    <ExternalLink size={20} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                  </a>

                  {/* YouTube */}
                  <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-red-600/20 rounded-xl border border-red-600/20 group-hover:border-red-600 transition-colors">
                        <Youtube className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-xl md:text-2xl font-black font-space italic text-white uppercase tracking-tight group-hover:text-red-500 transition-colors">YOUTUBE</span>
                    </div>
                    <ExternalLink size={20} className="text-slate-600 group-hover:text-red-500 transition-colors" />
                  </a>

                  {/* TikTok */}
                  <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                      <div className="p-3 bg-purple-600/20 rounded-xl border border-purple-600/20 group-hover:border-purple-600 transition-colors">
                        <Music className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="text-xl md:text-2xl font-black font-space italic text-white uppercase tracking-tight group-hover:text-purple-500 transition-colors">TIKTOK</span>
                    </div>
                    <ExternalLink size={20} className="text-slate-600 group-hover:text-purple-500 transition-colors" />
                  </a>
                </div>
              </div>

              {/* Divider */}
              <div className="h-[1px] bg-white/10"></div>

              {/* Connect Section - Reorganized based on user request */}
              <div className="space-y-6">
                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">CONNECT</h4>
                
                <div className="space-y-4">
                  {/* Telegram */}
                  <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 group">
                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 group-hover:border-blue-600 transition-colors">
                      <Send className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-lg md:text-xl font-black font-space italic text-white uppercase tracking-tight group-hover:text-blue-500 transition-colors">TELEGRAM</span>
                  </a>

                  {/* Email */}
                  <a href={`mailto:${SOCIAL_LINKS.email}`} className="flex items-center gap-6 group">
                    <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-600/20 group-hover:border-blue-600 transition-colors">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <span className="text-lg md:text-xl font-mono font-bold text-blue-400 group-hover:text-blue-300 transition-colors lowercase tracking-tight break-all">
                      {SOCIAL_LINKS.email}
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-20 pt-10 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest">© 2026 SHIZZYUNCHAINED ARCHIVE. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-8">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                UPLINK SECURE
              </span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
