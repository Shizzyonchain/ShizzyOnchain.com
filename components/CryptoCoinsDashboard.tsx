
import React, { useState, useEffect } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';
import { 
  Loader2, 
  Activity, 
  Globe, 
  BarChart3, 
  RefreshCw, 
  Zap,
  ChevronRight,
  TrendingUp,
  Coins
} from 'lucide-react';

export const CryptoCoinsDashboard: React.FC = () => {
  const [coins, setCoins] = useState<GeckoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastSync, setLastSync] = useState<string>('');

  const fetchCryptoData = async (force = false) => {
    setLoading(true);
    try {
      // Fetch the top 100 markets
      const topCoins = await coinGeckoProxy.getTopMarkets(undefined, force);
      setCoins(topCoins);
      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("Crypto Sector Load Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, []);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, style: 'currency', currency: 'USD' }).format(val);

  const totalMarketCap = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0);
  const totalVolume = coins.reduce((acc, c) => acc + (c.total_volume || 0), 0);

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-md shadow-lg shadow-emerald-500/20">
              <TrendingUp size={10} strokeWidth={3} className="animate-pulse" />
              GLOBAL LIQUIDITY UPLINK
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200 dark:border-white/10">
              <Globe size={10} />
              REALTIME MARKET FEED
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            CRYPTO <span className="text-emerald-500">DOMINANCE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Macro scale infrastructure monitoring of the global onchain economy. 
            <span className="block mt-1 text-emerald-500/80 font-bold uppercase">Source: High-Fidelity Intelligence Node</span>
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
             onClick={() => fetchCryptoData(true)}
             disabled={loading}
             className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-2xl active:scale-95"
           >
             <RefreshCw size={14} className={loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
             {loading ? 'Establishing Link...' : 'Sync Global Data'}
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
           <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
             <BarChart3 size={18} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Captured Cap</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             {totalMarketCap > 0 ? formatCompact(totalMarketCap) : '---'}
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Aggregated Top 100 Valuation</p>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
             <Activity size={18} />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">24H Activity</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             {totalVolume > 0 ? formatCompact(totalVolume) : '---'}
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Global Transaction Velocity</p>
        </div>
        <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-4">
           <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
             <Zap size={18} className="fill-current" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">Network Core</span>
           </div>
           <div className="text-3xl font-black font-space text-slate-900 dark:text-white italic tracking-tighter">
             Top 100 Assets
           </div>
           <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest italic">Verified Market Leaders</p>
        </div>
      </div>

      {/* Main Asset Grid */}
      {loading && coins.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-emerald-600" size={64} strokeWidth={1.5} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Global Market Grid...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {coins.map((coin, idx) => (
            <div 
              key={coin.id} 
              className="group bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 hover:border-emerald-500/40 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/5 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Coins size={80} strokeWidth={1} />
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
                   <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">Global Rank</div>
                   <div className="text-base font-black text-slate-800 dark:text-slate-200 font-mono italic">
                     #{coin.market_cap_rank}
                   </div>
                </div>
              </div>

              <div className="pt-2">
                 <a 
                   href={`https://www.coingecko.com/en/coins/${coin.id}`}
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-emerald-600 hover:border-emerald-500/50 transition-all group/btn"
                 >
                   Market Intelligence <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
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
           <Activity size={20} className="text-emerald-500" />
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
        </div>
        <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em] text-center italic">
          High Fidelity Global Asset Monitor • Signal Integrity Verified
        </p>
      </div>
    </div>
  );
};
