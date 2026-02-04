
import React, { useState, useEffect, useMemo } from 'react';
import { newsService } from '../services/newsService.ts';
import { AINewsItem } from '../types.ts';
import { AINewsCard } from './AINewsCard.tsx';
import { Loader2, Zap, Filter, ChevronDown, RefreshCw, AlertTriangle } from 'lucide-react';

export const AINewsFeed: React.FC = () => {
  const [items, setItems] = useState<AINewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'latest' | 'top'>('latest');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchData = async (force = false) => {
    if (force) setIsSyncing(true);
    try {
      const data = await newsService.fetchAllFeeds();
      setItems(data);
    } catch (e) {
      console.error('Error fetching news:', e);
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 5 minutes
    const interval = setInterval(() => fetchData(true), 5 * 60 * 1000);
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

    if (activeTab === 'top') {
      // Prioritize OpenAI and major sources for 'Top'
      return result.sort((a, b) => {
        const aVal = a.source === 'OpenAI' ? 100 : 0;
        const bVal = b.source === 'OpenAI' ? 100 : 0;
        return bVal - aVal;
      }).slice(0, 30);
    }

    return result.slice(0, 30);
  }, [items, activeTab, sourceFilter]);

  if (loading && items.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.5em] animate-pulse">Syncing AI Data Streams...</span>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {/* Header & Filters - High Contrast for visibility */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
            <Zap size={12} className={isSyncing ? 'animate-spin' : 'animate-pulse'} /> 
            {isSyncing ? 'Synchronizing Node' : 'AI Intelligence Pipeline'}
          </div>
          <h2 className="text-5xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-[0.9]">
            INTEL <span className="text-blue-600">FEED</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5 shadow-inner">
            <button
              onClick={() => setActiveTab('latest')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'latest' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Latest
            </button>
            <button
              onClick={() => setActiveTab('top')}
              className={`px-8 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === 'top' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Top
            </button>
          </div>

          <div className="relative group min-w-[180px]">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full appearance-none bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-12 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer shadow-sm"
            >
              {sources.map(s => <option key={s} value={s} className="bg-white dark:bg-[#0b0e14]">{s}</option>)}
            </select>
            <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <button 
            onClick={() => fetchData(true)}
            disabled={isSyncing}
            className="p-3.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all disabled:opacity-50 shadow-sm"
            title="Refresh Intelligence"
          >
            <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Grid Content */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredItems.map(item => (
            <AINewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="py-48 text-center space-y-6">
          <div className="inline-block p-10 bg-slate-100 dark:bg-white/5 rounded-[2rem] border border-dashed border-slate-200 dark:border-white/10 mb-4">
            <AlertTriangle size={48} className="text-orange-500 mx-auto" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase font-space tracking-tight">Signal Lost</h3>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
              Feed synchronization interrupted. Adjust filters or check your network connection.
            </p>
          </div>
          <button 
            onClick={() => fetchData(true)}
            className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/20"
          >
            Reconnect Node
          </button>
        </div>
      )}

      {/* Persistence Status */}
      <div className="flex flex-col items-center justify-center pt-16 border-t border-slate-200 dark:border-white/10 gap-4">
        <div className="flex items-center gap-3 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">
          <span className={`w-2.5 h-2.5 rounded-full ${isSyncing ? 'bg-blue-500 animate-spin' : 'bg-emerald-500 animate-pulse'}`} />
          Network Pipeline Secure
        </div>
        <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest opacity-50">Auto-refresh active: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  );
};
