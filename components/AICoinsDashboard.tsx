
import React, { useState, useEffect } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin, GeckoCategory } from '../types.ts';
import { 
  Loader2, 
  Activity, 
  Cpu, 
  Globe, 
  BarChart3, 
  RefreshCw, 
  Zap,
  ChevronRight
} from 'lucide-react';

export const AICoinsDashboard: React.FC = () => {
  const [coins, setCoins] = useState<GeckoCoin[]>([]);
  const [categoryStats, setCategoryStats] = useState<GeckoCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');

  const fetchAIData = async (force = false) => {
    setLoading(true);
    try {
      // 1. Fetch AI Category Specific Markets
      const aiCoins = await coinGeckoProxy.getCategoryMarkets('artificial-intelligence', undefined, force);
      setCoins(aiCoins);

      // 2. Fetch AI Category Stats
      const categories = await coinGeckoProxy.getCategoriesStats();
      const aiCat = categories.find(c => c.id === 'artificial-intelligence' || c.name.toLowerCase().includes('artificial intelligence'));
      if (aiCat) setCategoryStats(aiCat);

      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("AI Sector Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIData();
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-orange-500/20">
              <Cpu size={10} strokeWidth={3} className="animate-pulse" />
              AI SECTOR UPLINK
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200 dark:border-white/10">
              <Globe size={10} />
              GLOBAL DATA FEED
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            AI <span className="text-orange-600">REVOLUTION</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Live infrastructure monitoring of the AI and Big Data economy. 
            <span className="block mt-1 text-orange-500/80 font-bold uppercase">Source: High-Fidelity Intelligence Node</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
             onClick={() => fetchAIData(true)}
             disabled={loading}
             className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-2xl active:scale-95"
           >
             <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
             {loading ? 'Establishing Link...' : 'Sync Sector Data'}
           </button>
           {lastSync && (
             <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest italic">
               Last Intel Sync: {lastSync}
             </span>
           )}
        </div>
      </div>

      {/* Strategic KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
             <BarChart3 size={18} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Market Cap</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             {categoryStats ? formatCompact(categoryStats.market_cap) : '---'}
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Cumulative Sector Valuation</p>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
             <Activity size={18} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">24H Volume</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             {categoryStats ? formatCompact(categoryStats.volume_24h) : '---'}
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Liquid Inflow Node</p>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="flex items-center gap-3 text-orange-600 dark:text-orange-400">
             <Zap size={18} className="fill-current" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Node Count</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             {coins.length}+ Assets
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Verified AI Protocol Layer</p>
        </div>
      </div>

      {/* Main Asset Grid */}
      {loading && coins.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-orange-600" size={64} strokeWidth={1.5} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing AI Sector Grid...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {coins.map((coin, idx) => (
            <div 
              key={coin.id} 
              className="group bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:border-orange-500/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-orange-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <BarChart3 size={80} strokeWidth={1} />
              </div>

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                   <div className="relative">
                      <img src={coin.image} alt={coin.name} className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0b0e14]"></div>
                   </div>
                   <div className="space-y-0.5">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none font-space">{coin.symbol}</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px] font-mono">{coin.name}</p>
                   </div>
                </div>
                <div className="text-right">
                   <div className="text-xl font-black font-mono text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                     {formatCurrency(coin.current_price)}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest font-mono ${coin.price_change_percentage_24h_in_currency >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                     {coin.price_change_percentage_24h_in_currency >= 0 ? '▲' : '▼'} {Math.abs(coin.price_change_percentage_24h_in_currency || 0).toFixed(2)}%
                   </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5">
                <div className="space-y-1">
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Market Cap</div>
                   <div className="text-base font-black text-slate-800 dark:text-slate-200 font-mono italic">
                     {formatCompact(coin.market_cap)}
                   </div>
                </div>
                <div className="space-y-1 text-right">
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Sector Rank</div>
                   <div className="text-base font-black text-slate-800 dark:text-slate-200 font-mono italic">
                     #{idx + 1}
                   </div>
                </div>
              </div>

              <div className="pt-2">
                 <a 
                   href={`https://www.coingecko.com/en/coins/${coin.id}`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 hover:border-orange-500/50 transition-all group/btn"
                 >
                   Deep Asset Dive <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sector Footer */}
      <div className="pt-20 flex flex-col items-center gap-8 opacity-40">
        <div className="flex items-center gap-4">
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
           <Activity size={20} className="text-orange-500" />
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
        </div>
        <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em] text-center italic">
          High Fidelity AI Sector Monitor • Signal Integrity Verified
        </p>
      </div>
    </div>
  );
};
