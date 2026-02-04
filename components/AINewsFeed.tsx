
import React, { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService.ts';
import { AINewsItem } from '../types.ts';
import { AINewsCard } from './AINewsCard.tsx';
import { Zap, Filter, ChevronDown, RefreshCw, Layers, Globe } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-white dark:bg-white/5 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 h-[450px] animate-pulse">
    <div className="aspect-[16/10] bg-slate-200 dark:bg-white/10" />
    <div className="p-8 space-y-4">
      <div className="h-2 w-24 bg-slate-200 dark:bg-white/10 rounded" />
      <div className="h-8 w-full bg-slate-200 dark:bg-white/10 rounded" />
      <div className="h-4 w-2/3 bg-slate-200 dark:bg-white/10 rounded" />
    </div>
  </div>
);

export const AINewsFeed: React.FC = () => {
  const [items, setItems] = useState<AINewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async (force = false) => {
    if (force) setIsSyncing(true);
    try {
      const data = await newsService.fetchAllFeeds();
      setItems(data);
    } catch (e) {
      console.error('Pipeline error:', e);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(true), 300000); // 5 min sync
    return () => clearInterval(interval);
  }, []);

  const sources = useMemo(() => {
    const s = new Set(items.map(i => i.source));
    return ['All Sources', ...Array.from(s)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (sourceFilter !== 'All Sources') {
      result = result.filter(i => i.source === sourceFilter);
    }
    return result.slice(0, 24);
  }, [items, sourceFilter]);

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header & Pipeline Status */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
            <div className={`w-1.5 h-1.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
            Pipeline: {isSyncing ? 'Synchronizing Global Node' : 'Latest AI News Secured'}
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-[0.9]">
            LATEST AI <span className="text-blue-600">NEWS</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="relative group min-w-[200px]">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-12 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer shadow-sm"
            >
              {sources.map(s => <option key={s} value={s} className="bg-white dark:bg-[#0b0e14]">{s}</option>)}
            </select>
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => fetchData(true)}
            disabled={isSyncing}
            className="p-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50 shadow-sm"
            title="Refresh Stream"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {loading && items.length === 0 ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredItems.map(item => <AINewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Hybrid Footer Info */}
      <div className="pt-10 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="flex items-center gap-3 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">
          <Globe size={14} className="text-blue-500" /> Decentralized Global News Synthesis Active
        </div>
      </div>
    </div>
  );
};
