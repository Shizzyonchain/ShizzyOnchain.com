
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Layers, 
  ArrowUpDown,
  ExternalLink
} from 'lucide-react';
import { taoStatsService } from '../services/taoStatsService.ts';
import { TaoSubnet } from '../types.ts';

type SortField = 'netuid' | 'emission' | 'market_cap' | 'stake' | 'price_usd' | 'daily_rewards';

export const TaoAlphaDashboard: React.FC = () => {
  const [subnets, setSubnets] = useState<TaoSubnet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>('emission');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const fetchSubnets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await taoStatsService.getSubnets();
      setSubnets(data);
    } catch (err: any) {
      setError('Establishing link to Taostats Node failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubnets();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedSubnets = useMemo(() => {
    return [...subnets].sort((a, b) => {
      const valA = (a as any)[sortField] || 0;
      const valB = (b as any)[sortField] || 0;
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }, [subnets, sortField, sortDirection]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(val);

  const SortHeader = ({ label, field }: { label: string, field: SortField }) => (
    <th className="px-6 py-5 cursor-pointer group" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-orange-500 transition-colors">
        {label}
        <ArrowUpDown size={12} className={`opacity-0 group-hover:opacity-100 transition-opacity ${sortField === field ? 'opacity-100 text-orange-500' : ''}`} />
      </div>
    </th>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <Cpu size={10} strokeWidth={3} className="animate-pulse" />
            BITTENSOR TAOSTATS UPLINK
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            TAO <span className="text-orange-600">SUBNETS</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed">
            Real-time tracking of all 128 Bittensor subnets. Emissions, stake, and market dynamics in USD.
            <span className="block mt-1 text-orange-500/80 italic font-bold">Source: Taostats API Node</span>
          </p>
        </div>

        <button 
          onClick={fetchSubnets}
          disabled={loading}
          className="group flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          {loading ? 'SYNCING...' : 'REFRESH DATA'}
        </button>
      </div>

      {loading && subnets.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6">
          <Loader2 className="animate-spin text-orange-600" size={48} />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] animate-pulse">Scanning Subnet Incentive Vectors...</span>
        </div>
      ) : error && subnets.length === 0 ? (
        <div className="h-96 flex flex-col items-center justify-center gap-6 p-10 border border-dashed border-rose-500/20 rounded-[3rem]">
          <AlertCircle className="text-rose-500" size={48} />
          <p className="font-mono text-xs uppercase tracking-widest text-rose-500 font-bold text-center">{error}</p>
          <button onClick={fetchSubnets} className="text-orange-500 font-black uppercase tracking-widest text-[10px] hover:underline">Retry UPLINK</button>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10">
                  <SortHeader label="NETUID" field="netuid" />
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Subnet Name</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Token</th>
                  <SortHeader label="Emission" field="emission" />
                  <SortHeader label="Stake" field="stake" />
                  <SortHeader label="Mkt Cap" field="market_cap" />
                  <SortHeader label="Daily Rewards" field="daily_rewards" />
                  <SortHeader label="Price" field="price_usd" />
                  <th className="px-6 py-5 text-center text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">Explorer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {sortedSubnets.map((subnet) => (
                  <tr key={subnet.netuid} className="group hover:bg-orange-600/[0.03] transition-colors">
                    <td className="px-6 py-6 font-mono font-black text-orange-600 dark:text-orange-400 text-lg italic">
                      {String(subnet.netuid).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="text-base font-black uppercase tracking-tight text-slate-900 dark:text-white italic">{subnet.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="inline-flex px-2 py-1 bg-slate-100 dark:bg-white/5 rounded text-[10px] font-black font-mono text-slate-500 dark:text-slate-400 uppercase">
                        {subnet.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={14} className="text-emerald-500" />
                        <span className="font-mono font-bold text-slate-900 dark:text-slate-200">
                          {(subnet.emission * 100).toFixed(2)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {formatCompact(subnet.stake || 0)} <span className="text-[9px] opacity-40 uppercase">TAO</span>
                    </td>
                    <td className="px-6 py-6 font-mono font-bold text-slate-600 dark:text-slate-400">
                      {formatCompact(subnet.market_cap || 0)}
                    </td>
                    <td className="px-6 py-6 font-mono font-bold text-emerald-500">
                      {formatCurrency(subnet.daily_rewards || 0)}
                    </td>
                    <td className="px-6 py-6 font-mono font-black text-slate-900 dark:text-white text-base">
                      {formatCurrency(subnet.price_usd || 0)}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <a 
                        href={`https://taostats.io/subnets/netuid-${subnet.netuid}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex p-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-orange-600 hover:border-orange-500/50 transition-all"
                      >
                        <ExternalLink size={16} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <footer className="pt-20 flex flex-col items-center gap-8 opacity-40">
        <div className="flex items-center gap-4">
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
           <Layers size={20} className="text-orange-500" />
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
        </div>
        <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em] text-center italic">
          DECENTRALIZED INTELLIGENCE PROTOCOL • TAO UPLINK SECURE
        </p>
      </footer>
    </div>
  );
};
