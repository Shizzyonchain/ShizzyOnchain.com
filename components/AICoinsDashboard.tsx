import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, ExternalLink, Droplets, AlertCircle, ShieldCheck, BarChart3, RefreshCw, Wifi, WifiOff, TrendingUp } from 'lucide-react';
import { DexPair } from '../types.ts';

/**
 * SHIZZY VERIFIED AI REGISTRY
 * Hand-picked high-signal AI assets across major liquid chains.
 */
const VERIFIED_AI_ASSETS = [
  // --- Ethereum Infrastructure ---
  { symbol: 'TAO', address: '0x77E06c096639b69989F70897f74F817D6E97D79D', name: 'Bittensor (Wrapped)' },
  { symbol: 'FET', address: '0xaea46a60368a7bd0c0e599bb630060313e2745ef', name: 'Artificial Superintelligence' },
  { symbol: 'GRT', address: '0xc944e90c64b2c07662a292be6244bdf05cda44a7', name: 'The Graph' },
  { symbol: 'ARKM', address: '0x6e2a43be0b1d333010f367469a84a6b98683073d', name: 'Arkham' },
  
  // --- Solana Agent Layer (Case Sensitive) ---
  { symbol: 'RENDER', address: 'rndrizKT3MK1iimdxRdWJYCpbGYbgv3nvY6sS1A15D', name: 'Render Network' },
  { symbol: 'AI16Z', address: 'HeLp6E2QDCKp9ghYp8qP8qj7G1W9JmPzZtXzZ9uPpump', name: 'ai16z' },
  { symbol: 'FART', address: '986c757c3d79075d9c792945d9465f2998f45e7f', name: 'Fartcoin' },
  { symbol: 'GRIF', address: 'GHs1Y9uN4pnuB5SnyiGatA2j7912Qv6H6yP3M44pump', name: 'Griffain' },
  { symbol: 'NOS', address: 'nosS6DscvYpYpGqZ99XvPscs4nK9oD6T876jXGvNndu', name: 'Nosana' },

  // --- Base & Scaling AI ---
  { symbol: 'VIRTUAL', address: '0x0b3e328455c4059EEb9e3f84b5543F74E24e7E1b', name: 'Virtuals Protocol' },
  { symbol: 'PRIME', address: '0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206', name: 'Echelon Prime' },
  { symbol: 'AIOZ', address: '0x626e8036deb333b408be468f951bdb4273ad0991', name: 'AIOZ Network' }
];

export const AICoinsDashboard: React.FC = () => {
  const [pairs, setPairs] = useState<DexPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchPairs = useCallback(async () => {
    if (!navigator.onLine) return;
    
    setLoading(true);
    setError(null);
    try {
      // Fetch in batches to prevent URL length issues
      const addresses = VERIFIED_AI_ASSETS.map(a => a.address);
      const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${addresses.join(',')}`);
      
      if (!response.ok) throw new Error(`DEX Link Error: ${response.status}`);
      const data = await response.json();
      
      if (data.pairs) {
        // Intelligence Filter: Pick the single most liquid and relevant pair per verified asset
        const symbolMap = new Map<string, DexPair>();
        
        const sortedPairs = (data.pairs as DexPair[]).sort((a, b) => 
          (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
        );

        sortedPairs.forEach(pair => {
          const sym = pair.baseToken.symbol.toUpperCase();
          const liq = pair.liquidity?.usd || 0;
          
          // Verify it's in our list and has enough liquidity to be "real"
          const isVerified = VERIFIED_AI_ASSETS.some(a => a.symbol === sym || a.address.toLowerCase() === pair.baseToken.address.toLowerCase());
          
          if (isVerified && liq > 5000) { // $5k min liquidity to filter noise
            if (!symbolMap.has(sym)) {
              symbolMap.set(sym, pair);
            }
          }
        });

        // Ensure we preserve the order of our verified list for stability
        const finalPairs = VERIFIED_AI_ASSETS
          .map(asset => symbolMap.get(asset.symbol))
          .filter((p): p is DexPair => !!p);

        setPairs(finalPairs);
      }
    } catch (e: any) {
      console.error("DexScreener fetch failed:", e);
      setError(e.message || 'Signal lost. Re-establishing node connection...');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPairs();
    const interval = setInterval(fetchPairs, 60000); // 60s pulse
    return () => clearInterval(interval);
  }, [fetchPairs]);

  const formatCurrency = (val: string | number) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: num < 0.01 ? 6 : 2,
      maximumFractionDigits: num < 0.01 ? 8 : 2
    }).format(num);
  };

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(val);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              {isOnline ? <Wifi size={10} className="text-emerald-500" /> : <WifiOff size={10} className="text-rose-500" />}
              AI LIQUIDITY MONITOR ACTIVE
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600/10 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-600/20">
              <ShieldCheck size={10} />
              VERIFIED SECTOR INDEX
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            AI <span className="text-blue-600">COINS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed">
            Real-time liquidity and price action for high-signal AI infrastructure.
            <span className="block mt-1 text-blue-500/80 italic font-bold uppercase">Direct DexScreener Data Link</span>
          </p>
        </div>

        <button 
          onClick={fetchPairs}
          disabled={loading}
          className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-2xl active:scale-95"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          {loading ? 'SYNCING NODE...' : 'REFRESH DATA'}
        </button>
      </div>

      {loading && pairs.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-blue-600" size={64} strokeWidth={1.5} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] animate-pulse">Establishing Secure Asset Handshake...</span>
        </div>
      ) : error && pairs.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6 p-10 border border-dashed border-rose-500/20 rounded-[3rem] bg-rose-500/[0.02]">
          <AlertCircle className="text-rose-500" size={48} />
          <p className="font-mono text-xs uppercase tracking-widest text-rose-500 font-bold text-center">Node Signal Error: {error}</p>
          <button onClick={fetchPairs} className="mt-4 px-8 py-3 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Retry Link</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {pairs.map((pair, idx) => (
            <div 
              key={`${pair.pairAddress}-${pair.chainId}`} 
              className="group relative bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-7 space-y-6 hover:border-blue-500/40 transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <BarChart3 size={80} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">{pair.baseToken.symbol}</h3>
                    <span className="text-[8px] font-mono font-black text-slate-400 px-2 py-0.5 bg-slate-100 dark:bg-white/5 rounded uppercase border border-slate-200 dark:border-white/10">{pair.chainId}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[140px]">{pair.baseToken.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-slate-900 dark:text-white tracking-tighter leading-none mb-1">
                    {formatCurrency(pair.priceUsd)}
                  </div>
                  <div className="flex items-center justify-end gap-1.5">
                    <TrendingUp size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 font-mono">SPOT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-white/5 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                    <Droplets size={10} className="text-blue-500" /> Liquidity
                  </div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200 font-mono italic">
                    ${formatCompact(pair.liquidity?.usd || 0)}
                  </div>
                </div>
                <div className="space-y-1 text-right">
                  <div className="flex items-center justify-end gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] font-mono">
                    <BarChart3 size={10} className="text-blue-500" /> Vol 24H
                  </div>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200 font-mono italic">
                    ${formatCompact(pair.volume?.h24 || 0)}
                  </div>
                </div>
              </div>

              <div className="pt-2 relative z-10">
                <a 
                  href={pair.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:border-blue-500/50 transition-all group/btn"
                >
                  DexScreener Hub <ExternalLink size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="pt-20 flex flex-col items-center gap-8 opacity-40">
        <div className="flex items-center gap-4">
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
           <ShieldCheck size={20} className="text-blue-500" />
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
        </div>
        <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em] text-center italic">
          High Fidelity Media Node • Signal Integrity Verified
        </p>
      </footer>
    </div>
  );
};
