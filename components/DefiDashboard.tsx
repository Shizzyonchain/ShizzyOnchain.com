
import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, 
  Layers, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  Loader2,
  AlertCircle,
  Globe,
  Activity,
  ArrowRight,
  Clock,
  ShieldCheck,
  X,
  Target,
  Maximize2
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
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);

  useEffect(() => {
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
    fetchData();
  }, []);

  // Matrix calculation data
  const matrixData = useMemo(() => {
    return topChains.map(chain => {
      const revData = revChains.find(r => r.name === chain.name);
      const revenue = revData?.revenue24h || 0;
      const tvl = chain.tvl || 1; // Prevent div by zero
      // Annualized efficiency: (Daily Rev / TVL) * 365
      const efficiency = (revenue / tvl) * 365;
      return {
        ...chain,
        revenue,
        efficiency: efficiency * 100 // as percentage
      };
    }).sort((a, b) => b.tvl - a.tvl);
  }, [topChains, revChains]);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, style: 'currency', currency: 'USD' }).format(val);

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
                <td className="py-2.5 font-bold text-slate-900 dark:text-slate-200 truncate max-w-[100px] border-b border-transparent group-hover:border-blue-500/20">
                  {item.name}
                </td>
                <td className="py-2.5 text-right font-mono font-black text-slate-900 dark:text-white">
                  {formatCompact(type === 'stables' ? item.circulating : item.tvl)}
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
      {/* Global Matrix HUD Overlay */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in zoom-in-95 fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/95 dark:bg-[#0b0e14]/98 backdrop-blur-2xl" onClick={() => setIsMatrixOpen(false)}></div>
          
          <div className="relative w-full max-w-7xl h-full max-h-[92vh] bg-white dark:bg-[#111827] border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col transition-colors">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3.5 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30 text-white">
                  <Target size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white font-space italic">Efficiency Matrix</h2>
                  <p className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Annualized Capital Productivity vs. Logarithmic TVL Ingress</p>
                </div>
              </div>
              <button 
                onClick={() => setIsMatrixOpen(false)}
                className="p-3 bg-slate-200 dark:bg-white/10 hover:bg-rose-500 dark:hover:bg-rose-600 rounded-full transition-all text-slate-600 dark:text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow p-10 lg:p-14 flex flex-col overflow-hidden">
              <div className="relative flex-grow border-l-2 border-b-2 border-slate-200 dark:border-white/10 mb-14 ml-16">
                
                {/* Y-Axis Label - Fixed rotation and positioning */}
                <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-500 whitespace-nowrap opacity-60 pointer-events-none">
                  ANNUALIZED EFFICIENCY (%)
                </div>

                {/* X-Axis Label */}
                <div className="absolute left-1/2 -bottom-14 -translate-x-1/2 text-[11px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-500 whitespace-nowrap opacity-60 pointer-events-none">
                  TOTAL VALUE LOCKED (LOG TVL)
                </div>
                
                {/* Zone Indicators */}
                <div className="absolute top-8 right-8 text-[10px] font-black text-emerald-500/20 dark:text-emerald-500/30 uppercase tracking-[0.4em] font-mono border border-emerald-500/10 dark:border-emerald-500/20 px-4 py-2 rounded-full">The Gold Mine</div>
                <div className="absolute top-8 left-8 text-[10px] font-black text-blue-500/20 dark:text-blue-400/30 uppercase tracking-[0.4em] font-mono border border-blue-500/10 dark:border-blue-400/20 px-4 py-2 rounded-full">Hidden Gems</div>
                <div className="absolute bottom-8 left-8 text-[10px] font-black text-rose-500/20 dark:text-rose-500/30 uppercase tracking-[0.4em] font-mono border border-rose-500/10 dark:border-rose-500/20 px-4 py-2 rounded-full">Ghost Towns</div>
                <div className="absolute bottom-8 right-8 text-[10px] font-black text-slate-500/20 dark:text-slate-500/30 uppercase tracking-[0.4em] font-mono border border-slate-500/10 dark:border-slate-500/20 px-4 py-2 rounded-full">Blue Chips</div>

                {/* Plot Nodes with LOGARITHMIC SCALE */}
                {matrixData.map((node, i) => {
                  if (node.tvl <= 0) return null;
                  
                  // LOG SCALING for X-axis (handling outliers like ETH)
                  const minTvl = Math.min(...matrixData.map(n => n.tvl));
                  const maxTvl = Math.max(...matrixData.map(n => n.tvl));
                  
                  // Math.log10 gives a cleaner linear distribution for powers of 10
                  const logMin = Math.log10(Math.max(minTvl, 1e6)); // Floor at $1M
                  const logMax = Math.log10(maxTvl);
                  const logCurrent = Math.log10(Math.max(node.tvl, 1e6));
                  
                  const left = ((logCurrent - logMin) / (logMax - logMin)) * 88 + 4;

                  // LINEAR SCALING for Y-axis (Efficiency)
                  const maxEff = Math.max(...matrixData.map(n => n.efficiency), 10); // Minimum 10% for scale
                  const bottom = (node.efficiency / maxEff) * 85 + 5;

                  return (
                    <div 
                      key={node.name}
                      className="absolute group z-10"
                      style={{ left: `${left}%`, bottom: `${bottom}%` }}
                    >
                      <div className="relative -translate-x-1/2 translate-y-1/2">
                        {/* The Point */}
                        <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-blue-600 border-[3px] border-white dark:border-[#111827] shadow-lg group-hover:scale-150 transition-all cursor-pointer group-hover:bg-emerald-500 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]"></div>
                        
                        {/* Dynamic Label */}
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap pointer-events-none transition-colors group-hover:text-blue-500">
                          {node.name}
                        </div>

                        {/* Tooltip */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-[#0b0e14] text-white p-5 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 whitespace-nowrap border border-white/10 shadow-2xl scale-90 group-hover:scale-100 translate-y-4 group-hover:translate-y-0">
                          <div className="flex items-center gap-3 mb-3 border-b border-white/5 pb-2">
                             <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                             <div className="text-sm font-black uppercase tracking-tight">{node.name}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                             <div>
                                <div className="text-[8px] uppercase font-mono font-black text-slate-500 mb-1">Total Liquidity</div>
                                <div className="text-sm font-black font-mono tracking-tighter">{formatCompact(node.tvl)}</div>
                             </div>
                             <div>
                                <div className="text-[8px] uppercase font-mono font-black text-slate-500 mb-1">Efficiency</div>
                                <div className="text-sm font-black font-mono text-emerald-400 tracking-tighter">{node.efficiency.toFixed(2)}%</div>
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Grid Lines Overlay */}
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.05] pointer-events-none">
                   {[...Array(16)].map((_, i) => <div key={i} className="border border-slate-500"></div>)}
                </div>
              </div>

              {/* Bottom Insight Bar */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                 <div className="p-7 bg-slate-100 dark:bg-white/5 rounded-3xl border border-slate-200 dark:border-white/10 shadow-sm">
                    <div className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-3 font-mono italic">Efficiency Insight</div>
                    <div className="text-xl font-black text-slate-900 dark:text-white uppercase leading-tight font-space italic">Liquidity Velocity</div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">The ratio of fee accrual vs collateralized TVL. High efficiency indicates an active, productive ecosystem.</p>
                 </div>
                 <div className="md:col-span-3 p-7 bg-blue-600/5 dark:bg-blue-600/10 rounded-3xl border border-blue-600/20 flex items-center justify-between shadow-inner">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500">
                          <Activity size={24} />
                       </div>
                       <div className="space-y-1">
                          <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Economic Leader</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Maximum Capital Yield Ingress</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <div className="text-3xl font-black text-slate-900 dark:text-white uppercase font-space italic">{matrixData.sort((a,b) => b.efficiency - a.efficiency)[0]?.name}</div>
                       <div className="text-xs font-bold text-emerald-500 font-mono">+{matrixData.sort((a,b) => b.efficiency - a.efficiency)[0]?.efficiency.toFixed(1)}% Annualized</div>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header Strategy Block */}
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
            Unfiltered economic output and liquidity monitoring across the modular financial stack.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl group hover:border-blue-500/50 transition-colors">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">24h Vol Leader</div>
            <div className="text-3xl font-black font-space text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              {volChains[0]?.name || '---'}
            </div>
            <div className="text-[10px] text-blue-500 font-bold mt-1 font-mono uppercase tracking-tighter">Velocity Hub</div>
          </div>
          <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl group hover:border-emerald-500/50 transition-colors">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">24h Rev Leader</div>
            <div className="text-3xl font-black font-space text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">
              {revChains[0]?.name || '---'}
            </div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1 font-mono uppercase tracking-tighter">Economic Engine</div>
          </div>
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
          <div className="text-center space-y-2">
            <p className="font-mono text-xs uppercase tracking-widest text-rose-500 font-bold">Node Sync Failed</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Global Ingress Temporarily Blocked</p>
          </div>
        </div>
      ) : (
        <div className="space-y-20">
          {/* FUNDAMENTALS SECTION */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20 text-white">
                <Globe size={20} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white font-space italic">Fundamentals</h3>
                <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">Global On-Chain Liquidity Map</p>
              </div>
              <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/5 ml-4"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FundamentalCard title="Top Chains by TVL" data={topChains} type="chains" />
              <FundamentalCard title="Top Apps by TVL" data={protocols} type="protocols" />
              <FundamentalCard title="Top Stablecoins" data={stables} type="stables" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 pt-10">
            {/* VOLUME SECTION */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white flex items-center gap-4">
                  <div className="p-2 bg-blue-600/10 rounded-lg text-blue-600">
                    <BarChart3 size={16} />
                  </div>
                  Network Volume
                </h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">24H DEX Summary</span>
              </div>
              
              <div className="space-y-4">
                {volChains.length > 0 ? volChains.map((c, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-blue-500/30 transition-all hover:translate-x-1 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-300 dark:text-slate-700 font-black italic text-xl">{String(i+1).padStart(2, '0')}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors tracking-tighter">{formatCompact(c.volume24h || 0)}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Trading Vol</div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-40 italic text-sm font-mono uppercase tracking-widest border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem]">No Volume Ingress</div>
                )}
              </div>
            </div>

            {/* REVENUE SECTION */}
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black uppercase tracking-[0.4em] text-slate-900 dark:text-white flex items-center gap-4">
                   <div className="p-2 bg-emerald-600/10 rounded-lg text-emerald-500">
                    <TrendingUp size={16} />
                  </div>
                  Network Revenue
                </h3>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">24H Fee Accrual</span>
              </div>
              
              <div className="space-y-4">
                {revChains.length > 0 ? revChains.map((c, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all hover:translate-x-1 shadow-sm">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-slate-300 dark:text-slate-700 font-black italic text-xl">{String(i+1).padStart(2, '0')}</span>
                      <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black font-mono text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors tracking-tighter">{formatCompact(c.revenue24h || 0)}</div>
                      <div className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 opacity-60">Fees Accrued</div>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center opacity-40 italic text-sm font-mono uppercase tracking-widest border border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem]">No Revenue Ingress</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Intel */}
      <div className="pt-20 border-t border-slate-200 dark:border-white/5 flex flex-col items-center gap-8">
        <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10">
           <Activity size={14} strokeWidth={3} className="text-emerald-500 animate-pulse" />
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Protocol Node v2.2 (Fundamentals Linked) Active</span>
        </div>
        <div className="flex items-center gap-10">
          <div className="flex flex-col items-center gap-1">
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Powered by</span>
             <div className="flex items-center gap-2">
                <Zap size={12} className="text-blue-600 fill-blue-600" />
                <span className="text-sm font-black text-slate-900 dark:text-white uppercase font-space">DeFiLlama</span>
             </div>
          </div>
          <button 
            onClick={() => setIsMatrixOpen(true)}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20 group font-space italic"
          >
            Open Efficiency Matrix <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
