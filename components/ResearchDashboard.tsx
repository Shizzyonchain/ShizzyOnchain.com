
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin, GeckoCategory } from '../types.ts';
import { 
  Pin, 
  TrendingUp, 
  Loader2, 
  AlertCircle, 
  Zap, 
  ChevronDown, 
  RefreshCw, 
  Search, 
  Cpu, 
  ExternalLink, 
  X,
  ChevronUp,
  ArrowUpDown
} from 'lucide-react';

const CATEGORIES_CONFIG = [
  { id: 'ai-agents', name: 'AI Agents' },
  { id: 'artificial-intelligence', name: 'Artificial Intelligence' },
  { id: 'layer-2', name: 'Layer 2 (L2)' },
  { id: 'x402-ecosystem', name: 'x402 Ecosystem' }
];

type SortField = 
  | 'price_change_percentage_1h_in_currency' 
  | 'price_change_percentage_24h_in_currency' 
  | 'price_change_percentage_7d_in_currency' 
  | 'market_cap' 
  | 'total_volume'
  | 'current_price'
  | 'market_cap_rank';

export const ResearchDashboard: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES_CONFIG[0].id);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categoryStats, setCategoryStats] = useState<Record<string, GeckoCategory>>({});
  const [marketData, setMarketData] = useState<Record<string, GeckoCoin[]>>({});
  const [pinnedCoinIds, setPinnedCoinIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [sortConfig, setSortConfig] = useState<Record<string, { field: SortField, direction: 'asc' | 'desc' }>>({});
  const [error, setError] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const savedActiveCat = localStorage.getItem('onchainrev_research_active_tab');
    if (savedActiveCat && CATEGORIES_CONFIG.some(c => c.id === savedActiveCat)) {
      setActiveCategoryId(savedActiveCat);
    }

    const savedPins = localStorage.getItem('Shizzy_pinned_coins');
    if (savedPins) {
      setPinnedCoinIds(JSON.parse(savedPins));
    }

    // Initial Metadata Load (SWR)
    coinGeckoProxy.getCategoriesStats((newData) => {
      const statsMap: Record<string, GeckoCategory> = {};
      newData.forEach(s => {
        if (CATEGORIES_CONFIG.some(c => c.id === s.id)) {
           statsMap[s.id] = s;
        }
      });
      setCategoryStats(prev => ({ ...prev, ...statsMap }));
    }).then(initialData => {
      if (initialData.length > 0) {
        const statsMap: Record<string, GeckoCategory> = {};
        initialData.forEach(s => {
          if (CATEGORIES_CONFIG.some(c => c.id === s.id)) {
            statsMap[s.id] = s;
          }
        });
        setCategoryStats(prev => ({ ...prev, ...statsMap }));
      }
    });
  }, []);

  const fetchMarketData = async (catId: string, force = false) => {
    const hasData = !!marketData[catId];
    if (!force && hasData) return;

    if (!hasData) setLoading(prev => ({ ...prev, [catId]: true }));
    setError(null);

    try {
      const initial = await coinGeckoProxy.getCategoryMarkets(catId, (updated) => {
        setMarketData(prev => ({ ...prev, [catId]: updated }));
        setLoading(prev => ({ ...prev, [catId]: false }));
      });
      
      if (initial && initial.length > 0) {
        setMarketData(prev => ({ ...prev, [catId]: initial }));
        setLoading(prev => ({ ...prev, [catId]: false }));
      }
    } catch (e: any) {
      if (!marketData[catId]) {
        setError(`DATA STREAM INTERRUPTED: ${e.message || 'Network node timed out'}.`);
      }
    } finally {
      setLoading(prev => ({ ...prev, [catId]: false }));
    }
  };

  useEffect(() => {
    fetchMarketData(activeCategoryId);
    localStorage.setItem('onchainrev_research_active_tab', activeCategoryId);
  }, [activeCategoryId]);

  useEffect(() => {
    localStorage.setItem('Shizzy_pinned_coins', JSON.stringify(pinnedCoinIds));
  }, [pinnedCoinIds]);

  const togglePin = (coinId: string) => {
    setPinnedCoinIds(prev => 
      prev.includes(coinId) ? prev.filter(id => id !== coinId) : [...prev, coinId]
    );
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prev => {
      const current = prev[activeCategoryId];
      const direction = current?.field === field && current.direction === 'desc' ? 'asc' : 'desc';
      return { ...prev, [activeCategoryId]: { field, direction } };
    });
  };

  const getSortedData = (categoryId: string) => {
    const data = [...(marketData[categoryId] || [])];
    const config = sortConfig[categoryId];
    if (!config) return data;

    return data.sort((a, b) => {
      const valA = (a as any)[config.field] ?? 0;
      const valB = (b as any)[config.field] ?? 0;
      return config.direction === 'asc' ? valA - valB : valB - valA;
    });
  };

  const pinnedCoins = useMemo(() => {
    const all = Object.values(marketData).flat() as GeckoCoin[];
    const uniqueMap = new Map<string, GeckoCoin>();
    all.forEach(c => uniqueMap.set(c.id, c));
    return pinnedCoinIds.map(id => uniqueMap.get(id)).filter((c): c is GeckoCoin => !!c);
  }, [marketData, pinnedCoinIds]);

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(val);

  const formatPercent = (val: number | null) => {
    if (val === null || val === undefined) return <span className="text-slate-400 font-mono">---</span>;
    const color = val >= 0 ? 'text-emerald-400' : 'text-rose-400';
    return <span className={`font-mono font-bold ${color}`}>{val.toFixed(2)}%</span>;
  };

  const activeCategory = CATEGORIES_CONFIG.find(c => c.id === activeCategoryId)!;

  const SortHeader = ({ label, field, className = "" }: { label: string, field: SortField, className?: string }) => {
    const active = sortConfig[activeCategoryId]?.field === field;
    const direction = sortConfig[activeCategoryId]?.direction;

    return (
      <th className={`px-6 py-5 ${className}`}>
        <button 
          onClick={() => handleSort(field)}
          className={`flex items-center gap-2 group hover:text-blue-500 transition-colors uppercase tracking-widest ${active ? 'text-blue-500' : 'text-slate-400 dark:text-slate-500'}`}
        >
          {label}
          <span className="flex flex-col">
            {active ? (
              direction === 'asc' ? <ChevronUp size={12} strokeWidth={3} /> : <ChevronUp size={12} className="rotate-180" strokeWidth={3} />
            ) : (
              <ArrowUpDown size={10} className="opacity-30 group-hover:opacity-100" />
            )}
          </span>
        </button>
      </th>
    );
  };

  return (
    <div className="w-full space-y-8 pb-12">
      <div className="sticky top-[140px] z-30 bg-white/95 dark:bg-[#0b0e14]/95 backdrop-blur-2xl border-y border-slate-200 dark:border-white/5 py-4 transition-all">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <div className="flex-shrink-0 flex items-center gap-2 px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg border border-slate-200 dark:border-white/10">
              <Cpu size={12} />
              <span className="text-[9px] font-black uppercase tracking-[0.1em]">Research Node</span>
            </div>

            <div className="relative w-full md:w-64" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] border border-slate-200 dark:border-white/10 transition-all hover:bg-slate-200 dark:hover:bg-white/10"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${loading[activeCategoryId] ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                  <span>{activeCategory.name}</span>
                </div>
                <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="p-1.5 space-y-0.5">
                    {CATEGORIES_CONFIG.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveCategoryId(cat.id);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                          activeCategoryId === cat.id 
                            ? 'bg-blue-600 text-white' 
                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchMarketData(activeCategoryId, true)}
              disabled={loading[activeCategoryId]}
              className="group flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-500 transition-all disabled:opacity-50"
            >
              <RefreshCw size={12} className={`${loading[activeCategoryId] ? 'animate-spin' : ''}`} />
              Sync Node
            </button>
          </div>
        </div>
      </div>

      {pinnedCoins.length > 0 && (
        <div className="bg-slate-50/50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl p-6 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/5 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Pin size={14} className="text-white fill-white" />
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white font-space">Watchlist</h3>
                <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-0.5">Priority Monitoring</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {pinnedCoins.map(coin => (
              <div key={coin.id} className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-2xl p-4 flex items-center gap-3 group transition-all hover:border-blue-500/30 relative">
                <img src={coin.image} alt={coin.name} className="w-8 h-8 object-contain" />
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-[9px] font-bold uppercase font-mono text-slate-400 truncate">{coin.symbol}</span>
                    <span className={`text-[9px] font-bold font-mono ${coin.price_change_percentage_24h_in_currency >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {coin.price_change_percentage_24h_in_currency?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm font-black font-mono tracking-tight text-slate-900 dark:text-white truncate">
                    {formatCurrency(coin.current_price)}
                  </div>
                </div>
                <button 
                  onClick={() => togglePin(coin.id)}
                  className="absolute -top-1 -right-1 p-1 bg-rose-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={8} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="animate-in fade-in duration-500">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8 pb-8 border-b border-slate-200 dark:border-white/10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <Zap size={10} strokeWidth={3} className="animate-pulse" />
              Live Intel
            </div>
            <h2 className="text-4xl md:text-6xl font-black font-space uppercase tracking-tighter text-slate-900 dark:text-white leading-[1] italic">
              {activeCategory.name}
            </h2>
            
            {categoryStats[activeCategoryId] && (
              <div className="flex flex-wrap gap-10 font-mono text-[11px] uppercase tracking-widest font-bold">
                <div className="flex flex-col gap-2">
                  <span className="text-slate-400">Market Cap</span>
                  <span className="text-slate-900 dark:text-white text-2xl tracking-tighter leading-none">{formatCompact(categoryStats[activeCategoryId].market_cap)}</span>
                </div>
                <div className="flex flex-col gap-2 lg:border-l lg:border-slate-200 dark:border-white/10 lg:pl-10">
                  <span className="text-slate-400">24H Volume</span>
                  <span className="text-slate-900 dark:text-white text-2xl tracking-tighter leading-none">{formatCompact(categoryStats[activeCategoryId].volume_24h)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0b0e14] shadow-sm">
          {loading[activeCategoryId] && !marketData[activeCategoryId] ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-6">
              <Loader2 className="animate-spin text-blue-600" size={40} strokeWidth={2} />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Establishing Node Link...</span>
            </div>
          ) : error && !marketData[activeCategoryId] ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-6 p-10 text-center">
              <AlertCircle size={40} className="text-rose-500" />
              <div className="space-y-4">
                <h3 className="text-lg font-bold uppercase tracking-widest text-slate-900 dark:text-white">Connection Error</h3>
                <p className="text-xs font-mono text-slate-500 uppercase italic max-w-md">{error}</p>
                <button 
                  onClick={() => fetchMarketData(activeCategoryId, true)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-105 transition-all"
                >
                  Retry Link
                </button>
              </div>
            </div>
          ) : !marketData[activeCategoryId] || marketData[activeCategoryId].length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center gap-6 p-10 text-center">
              <Search size={40} className="text-slate-300 dark:text-white/10" />
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">No Data Ingress</h3>
                <p className="text-[10px] font-mono text-slate-500 uppercase italic">Try another category or resync.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-white/[0.02] text-[10px] font-black uppercase tracking-widest border-b border-slate-200 dark:border-white/10">
                    <SortHeader label="Rank" field="market_cap_rank" className="w-20 text-center" />
                    <th className="px-8 py-5 text-slate-400 dark:text-slate-500">Asset</th>
                    <SortHeader label="Price" field="current_price" />
                    <SortHeader label="1H" field="price_change_percentage_1h_in_currency" />
                    <SortHeader label="24H" field="price_change_percentage_24h_in_currency" />
                    <SortHeader label="7D" field="price_change_percentage_7d_in_currency" />
                    <SortHeader label="Market Cap" field="market_cap" />
                    <SortHeader label="Volume" field="total_volume" />
                    <th className="px-8 py-5 text-center text-slate-400 dark:text-slate-500">Pin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {getSortedData(activeCategoryId).map((coin) => (
                    <tr 
                      key={coin.id} 
                      className={`group transition-all hover:bg-slate-50/50 dark:hover:bg-blue-600/5 ${pinnedCoinIds.includes(coin.id) ? 'bg-blue-600/5 dark:bg-blue-600/10' : ''}`}
                    >
                      <td className="px-8 py-4 text-center font-mono font-bold text-slate-300 dark:text-slate-700 transition-colors text-2xl italic">
                        {coin.market_cap_rank.toString().padStart(2, '0')}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-4">
                          <img src={coin.image} alt={coin.symbol} className="w-8 h-8 object-contain" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-black uppercase text-slate-900 dark:text-white tracking-tight leading-none mb-1 truncate">{coin.name}</span>
                            <span className="text-[9px] font-mono font-bold text-blue-500 uppercase tracking-widest">{coin.symbol}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`px-8 py-4 font-mono font-bold text-base tracking-tight transition-colors ${sortConfig[activeCategoryId]?.field === 'current_price' ? 'text-blue-500' : 'text-slate-900 dark:text-white'}`}>
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-8 py-4 text-sm font-bold">{formatPercent(coin.price_change_percentage_1h_in_currency)}</td>
                      <td className="px-8 py-4 text-sm font-bold">{formatPercent(coin.price_change_percentage_24h_in_currency)}</td>
                      <td className="px-8 py-4 text-sm font-bold">{formatPercent(coin.price_change_percentage_7d_in_currency)}</td>
                      <td className={`px-8 py-4 font-mono text-[11px] font-bold transition-colors ${sortConfig[activeCategoryId]?.field === 'market_cap' ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatCompact(coin.market_cap)}
                      </td>
                      <td className={`px-8 py-4 font-mono text-[11px] font-bold transition-colors ${sortConfig[activeCategoryId]?.field === 'total_volume' ? 'text-blue-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatCompact(coin.total_volume)}
                      </td>
                      <td className="px-8 py-4 text-center">
                        <button 
                          onClick={() => togglePin(coin.id)}
                          className={`p-3 rounded-xl transition-all border ${
                            pinnedCoinIds.includes(coin.id) 
                              ? 'text-white bg-blue-600 border-blue-600 shadow-lg shadow-blue-500/20' 
                              : 'text-slate-300 dark:text-slate-700 border-transparent hover:border-blue-500/50 hover:text-blue-500'
                          }`}
                        >
                          <Pin size={16} className={pinnedCoinIds.includes(coin.id) ? 'fill-white' : ''} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <footer className="pt-16 pb-8 flex flex-col items-center gap-8">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          Research v3.2
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-4 bg-slate-900 dark:bg-white px-6 py-3 rounded-xl shadow-lg">
            <TrendingUp size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white dark:text-black">CoinGecko Intel Secured</span>
          </div>
          <a href="https://onchainrevolution.io/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 transition-all group">
            Audit Ecosystem <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </a>
        </div>
      </footer>
    </div>
  );
};
