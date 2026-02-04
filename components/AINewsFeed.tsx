
import React, { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService.ts';
import { AINewsItem } from '../types.ts';
import { AINewsCard } from './AINewsCard.tsx';
import { Filter, ChevronDown, RefreshCw, Globe, Search, Clock, AlertTriangle } from 'lucide-react';

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
  const [snapshotData, setSnapshotData] = useState(() => newsService.getLatestSnapshotItems());
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async (force = false) => {
    if (force) setIsSyncing(true);
    try {
      await newsService.sync(force);
      setSnapshotData(newsService.getLatestSnapshotItems());
    } catch (e) {
      console.error('Snapshot update failed:', e);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 300000); 
    return () => clearInterval(interval);
  }, []);

  const { items, lastUpdate, isConfigured } = snapshotData;

  const sources = useMemo(() => {
    const s = new Set(items.map(i => i.source));
    return ['All Sources', ...Array.from(s)];
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (sourceFilter !== 'All Sources') {
      result = result.filter(i => i.source === sourceFilter);
    }
    return result;
  }, [items, sourceFilter]);

  const lastUpdateStr = lastUpdate 
    ? new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Header & Pipeline Status */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-3 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className={`inline-flex items-center gap-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${
              isConfigured 
                ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400 border-blue-600/20' 
                : 'bg-orange-600/10 text-orange-600 dark:text-orange-400 border-orange-600/20'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${
                isSyncing ? 'bg-blue-500 animate-spin' : isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-orange-500'
              }`} />
              {isSyncing ? 'Ingesting Data' : isConfigured ? 'Snapshot Validated' : 'Seed Data Fallback'}
            </div>
            {!isConfigured && (
              <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded-md border border-orange-500/20">
                <AlertTriangle size={10} /> Config Required
              </div>
            )}
            {lastUpdate > 0 && (
              <div className="flex items-center gap-2 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest">
                <Clock size={12} /> Last Updated: {lastUpdateStr}
              </div>
            )}
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
            title="Force Snapshot Sync"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {items.length === 0 && !isSyncing ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center gap-6 text-slate-400">
            <Search size={48} className="opacity-20" />
            <div className="text-center space-y-2">
              <p className="text-xs font-mono font-bold uppercase tracking-[0.3em]">No Intelligence Snapshot Detected</p>
              <p className="text-[10px] font-mono text-slate-500 uppercase italic">Check environment variables or sync node.</p>
            </div>
            <button 
              onClick={() => fetchData(true)}
              className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
            >
              Initialize Sync
            </button>
          </div>
        ) : items.length === 0 && isSyncing ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          filteredItems.map(item => <AINewsCard key={item.id} item={item} />)
        )}
      </div>

      {/* Pipeline Status Footer */}
      <div className="pt-10 flex flex-col items-center justify-center gap-4 opacity-50">
        <div className="flex items-center gap-3 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">
          <Globe size={14} className="text-blue-500" /> Feedly Upstream Normalization Active
        </div>
      </div>
    </div>
  );
};
