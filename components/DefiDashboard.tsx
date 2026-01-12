
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Zap, 
  TrendingUp, 
  Loader2,
  AlertCircle,
  Globe,
  Clock,
  ShieldCheck,
  CalendarDays
} from 'lucide-react';
import { defiLlamaService } from '../services/defiLlamaService.ts';
import { LlamaChain, LlamaProtocol, LlamaStablecoin } from '../types.ts';

export const DefiDashboard: React.FC = () => {
  const [volChains, setVolChains] = useState<LlamaChain[]>([]);
  const [revChains, setRevChains] = useState<LlamaChain[]>([]);
  const [topChains, setTopChains] = useState<LlamaChain[]>([]);
  const [protocols, setProtocols] = useState<LlamaProtocol[]>([]);
  const [stables, setStables] = useState<LlamaStablecoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, rData, pData, cData, sData] = await Promise.all([
        defiLlamaService.getChainsByVolume(),
        defiLlamaService.getChainsByRevenue(),
        defiLlamaService.getTopProtocols(),
        defiLlamaService.getTopChains(),
        defiLlamaService.getTopStablecoins()
      ]);
      setVolChains(vData);
      setRevChains(rData);
      setProtocols(pData);
      setTopChains(cData);
      setStables(sData);
      setLastUpdate(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrencyExact = (val: number) => {
    if (val === 0) return '$0';
    if (val >= 1000000) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        notation: 'compact', 
        maximumFractionDigits: 2 
      }).format(val);
    }
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(val);
  };

  const FundamentalCard = ({ title, data, type }: { title: string, data: any[], type: 'chains' | 'protocols' | 'stables' }) => (
    <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 shadow-sm overflow-hidden flex flex-col min-h-[440px]">
      <div className="flex items-center justify-between mb-6 px-1">
        <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white flex items-center gap-3">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
          {title}
        </h4>
        <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-md">
          <Clock size={10} />
          {lastUpdate || '--:--'}
        </div>
      </div>
      <div className="flex-grow overflow-hidden">
        <table className="w-full text-left text-[11px] border-separate border-spacing-y-2">
          <thead>
            <tr className="text-slate-400 font-black uppercase tracking-widest opacity-60">
              <th className="pb-3 font-mono">{type === 'chains' ? 'Chain' : type === 'protocols' ? 'App' : 'Asset'}</th>
              <th className="pb-3 text-right font-mono">{type === 'stables' ? 'M.Cap' : 'TVL'}</th>
              <th className="pb-3 text-right font-mono">1D</th>
              <th className="pb-3 text-right font-mono">7D</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((item, i) => (
              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-all group">
                <td className="py-2.5 font-bold text-slate-900 dark:text-slate-200 truncate max-w-[100px]">{item.name}</td>
                <td className="py-2.5 text-right font-mono font-black text-slate-900 dark:text-white">
                  {formatCurrencyExact(type === 'stables' ? item.circulating : item.tvl)}
                </td>
                <td className="py-2.5 text-right font-mono font-bold">
                  <span className={item.change_1d >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                    {item.change_1d?.toFixed(1)}%
                  </span>
                </td>
                <td className="py-2.5 text-right font-mono font-bold">
                  <span className={item.change_7d >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                    {item.change_7d?.toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
            <ShieldCheck size={10} strokeWidth={3} className="animate-pulse" />
            Strategic On-Chain Sentinel Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            ONCHAIN <span className="text-blue-600">INTELLIGENCE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed">
            Unfiltered economic output and chain-level liquidity monitoring powered by DeFiLlama.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-blue-600" size={48} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Establishing Llama Node Sync...</span>
        </div>
      ) : error ? (
        <div className="h-96 flex flex-col items-center justify-center gap-4 p-10 border border-dashed border-rose-500/20 rounded-[3rem]">
          <AlertCircle className="text-rose-500" size={48} />
          <p className="font-mono text-xs uppercase tracking-widest text-rose-500 font-bold text-center">Node Sync Failed</p>
        </div>
      ) : (
        <div className="space-y-20">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white"><Globe size={20} strokeWidth={2.5} /></div>
              <div><h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white font-space italic">Fundamentals</h3></div>
              <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/5 ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FundamentalCard title="Top Chains by TVL" data={topChains} type="chains" />
              <FundamentalCard title="Top Apps by TVL" data={protocols} type="protocols" />
              <FundamentalCard title="Top Stablecoins" data={stables} type="stables" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white flex items-center gap-4"><div className="p-2 bg-blue-600/10 rounded-lg text-blue-600"><BarChart3 size={16} /></div>Network Volume</h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">24H DEX Summary</span>
              </div>
              <div className="space-y-4">
                {volChains.map((c, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-3xl hover:border-blue-500/30 transition-all hover:translate-x-1 shadow-sm">
                    <div className="flex items-center gap-4"><span className="font-mono text-slate-300 dark:text-slate-700 font-black italic text-xl">{String(i+1).padStart(2, '0')}</span><span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</span></div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors tracking-tighter">{formatCurrencyExact(c.volume24h || 0)}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Trading Vol</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white flex items-center gap-4"><div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-500"><TrendingUp size={16} /></div>Chain Fees</h3>
                <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> NETWORK ACCRUAL
                </div>
              </div>
              <div className="space-y-3">
                {revChains.map((c, i) => (
                  <div key={i} className="group flex flex-col p-6 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2rem] hover:border-emerald-500/30 transition-all shadow-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-slate-300 dark:text-slate-700 font-black italic text-xl">{String(i+1).padStart(2, '0')}</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">{c.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black font-mono text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors tracking-tighter italic">
                          {formatCurrencyExact(c.revenue24h || 0)}
                        </div>
                        <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-mono mt-1">Fees 24H</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5"><CalendarDays size={8} /> Fees 7D</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono italic">{formatCurrencyExact(c.revenue7d || 0)}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest font-mono">Fees 30D</span>
                        <span className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono italic">{formatCurrencyExact(c.revenue30d || 0)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 border-t border-slate-200 dark:border-white/5 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Validated Node Pipeline</span>
          <div className="flex items-center gap-2"><Zap size={14} className="text-blue-600 fill-blue-600" /><span className="text-sm font-black text-slate-900 dark:text-white uppercase font-space">DeFiLlama L1/L2 Intel</span></div>
        </div>
      </div>
    </div>
  );
};
