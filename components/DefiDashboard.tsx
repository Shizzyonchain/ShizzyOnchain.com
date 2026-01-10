
import React from 'react';
import { 
  BarChart3, 
  Layers, 
  Zap, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck,
  Cpu,
  Globe
} from 'lucide-react';

export const DefiDashboard: React.FC = () => {
  const protocols = [
    { name: 'Aave V3', tvl: '$12.4B', yield: '4.2%', risk: 'Low', color: 'bg-purple-500' },
    { name: 'Uniswap V4', tvl: '$8.1B', yield: '12.8%', risk: 'Medium', color: 'bg-pink-500' },
    { name: 'Curve Finance', tvl: '$3.2B', yield: '6.5%', risk: 'Medium', color: 'bg-blue-500' },
    { name: 'Lido Finance', tvl: '$24.8B', yield: '3.1%', risk: 'Low', color: 'bg-cyan-500' },
    { name: 'Ethena', tvl: '$2.9B', yield: '15.2%', risk: 'High', color: 'bg-black dark:bg-white' },
  ];

  return (
    <div className="w-full space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-emerald-600/20">
            <Zap size={10} strokeWidth={3} className="animate-pulse" />
            Yield Pulse
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            DEFI <span className="text-emerald-500">STRATOS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed">
            Real-time algorithmic yield intelligence and liquidity flow monitoring for the next-gen financial stack.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Total TVL (Global)</div>
            <div className="text-3xl font-black font-space text-slate-900 dark:text-white">$84.2B</div>
            <div className="text-[10px] text-emerald-500 font-bold mt-1 font-mono">+1.2% in 24h</div>
          </div>
          <div className="p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 font-mono">Yield Avg (Stable)</div>
            <div className="text-3xl font-black font-space text-slate-900 dark:text-white">7.42%</div>
            <div className="text-[10px] text-rose-500 font-bold mt-1 font-mono">-0.4% in 24h</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
              <Layers size={14} className="text-emerald-500" />
              Protocol Hierarchy
            </h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:underline">View Full Explorer</button>
          </div>

          <div className="space-y-4">
            {protocols.map((p, i) => (
              <div key={i} className="group relative flex items-center justify-between p-6 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl hover:border-emerald-500/30 transition-all hover:translate-x-1">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-2xl ${p.color} flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{p.name}</div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">TVL: {p.tvl}</span>
                      <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${p.risk === 'Low' ? 'text-emerald-500' : p.risk === 'Medium' ? 'text-orange-500' : 'text-rose-500'}`}>{p.risk} RISK</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black font-mono text-emerald-500 leading-none mb-1">{p.yield}</div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">APY Estimate</div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight size={14} className="text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-sm font-black uppercase tracking-[0.4em] text-slate-400 flex items-center gap-3">
            <ShieldCheck size={14} className="text-blue-500" />
            Risk Metrics
          </h3>
          
          <div className="p-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2rem] space-y-8">
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">System Overcollateralization</div>
              <div className="text-4xl font-black font-space italic tracking-tighter">142.8%</div>
              <div className="h-1.5 w-full bg-white/10 dark:bg-black/10 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-emerald-400"></div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-white/10 dark:border-black/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe size={16} className="opacity-60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cross-Chain Index</span>
                </div>
                <span className="text-xs font-mono font-black">94.2</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu size={16} className="opacity-60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Agent Utilization</span>
                </div>
                <span className="text-xs font-mono font-black">62.1%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp size={16} className="opacity-60" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Liquidity Depth</span>
                </div>
                <span className="text-xs font-mono font-black">OPTIMAL</span>
              </div>
            </div>

            <button className="w-full py-4 bg-emerald-500 text-black font-black uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-400 transition-colors shadow-xl shadow-emerald-500/20">
              Connect Wallet
            </button>
          </div>

          <div className="p-6 border border-slate-200 dark:border-white/10 rounded-3xl space-y-4 bg-white dark:bg-transparent">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <BarChart3 size={12} />
               On-Chain Heatmap
             </div>
             <div className="grid grid-cols-5 gap-2 h-20">
               {Array.from({ length: 25 }).map((_, i) => (
                 <div key={i} className={`rounded-sm transition-all hover:scale-110 ${i % 3 === 0 ? 'bg-emerald-500/60' : i % 5 === 0 ? 'bg-rose-500/40' : 'bg-slate-200 dark:bg-white/10'}`}></div>
               ))}
             </div>
             <p className="text-[9px] font-bold font-mono text-slate-400 uppercase leading-relaxed">
               Distribution of high-volume liquidity rotations across top 5 networks. Update interval: 120s.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};
