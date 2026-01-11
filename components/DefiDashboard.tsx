
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BarChart3, 
  Zap, 
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
  Info,
  Search,
  Maximize2,
  Filter,
  Share2,
  Plus,
  HelpCircle,
  Copy,
  CheckCircle2,
  Download,
  RotateCcw
} from 'lucide-react';
import { defiLlamaService } from '../services/defiLlamaService.ts';
import { LlamaChain, LlamaProtocol, LlamaStablecoin } from '../types.ts';

// --- MOCK DATA FOR THE MATRIX ---
// Used to ensure the matrix is populated with diverse nodes for the interactive experience
const MATRIX_NODES = [
  { id: 'ethereum', name: 'Ethereum', type: 'L1', tvl: 58000000000, revenue: 12000000, efficiency: 7.5, color: '#627EEA', rank: 1, delta: 2.4 },
  { id: 'solana', name: 'Solana', type: 'L1', tvl: 8500000000, revenue: 4200000, efficiency: 38.2, color: '#14F195', rank: 2, delta: 12.1 },
  { id: 'arbitrum', name: 'Arbitrum', type: 'L2', tvl: 3400000000, revenue: 150000, efficiency: 1.6, color: '#28A0F0', rank: 4, delta: -0.5 },
  { id: 'base', name: 'Base', type: 'L2', tvl: 2100000000, revenue: 280000, efficiency: 4.8, color: '#0052FF', rank: 5, delta: 5.2 },
  { id: 'optimism', name: 'Optimism', type: 'L2', tvl: 1800000000, revenue: 95000, efficiency: 1.9, color: '#FF0420', rank: 6, delta: 0.2 },
  { id: 'hyperliquid', name: 'Hyperliquid L1', type: 'App Chain', tvl: 850000000, revenue: 950000, efficiency: 40.5, color: '#FFFFFF', rank: 3, delta: 18.4 },
  { id: 'avalanche', name: 'Avalanche', type: 'L1', tvl: 1200000000, revenue: 45000, efficiency: 1.4, color: '#E84142', rank: 7, delta: -1.2 },
  { id: 'bsc', name: 'BSC', type: 'L1', tvl: 5400000000, revenue: 1100000, efficiency: 7.4, color: '#F3BA2F', rank: 8, delta: 0.8 },
  { id: 'tron', name: 'Tron', type: 'L1', tvl: 8200000000, revenue: 3800000, efficiency: 16.9, color: '#FF0013', rank: 9, delta: 3.1 },
  { id: 'bitcoin', name: 'Bitcoin', type: 'L1', tvl: 1200000000, revenue: 50000, efficiency: 1.5, color: '#F7931A', rank: 10, delta: 0.1 },
  { id: 'plasma', name: 'Plasma', type: 'L2', tvl: 120000000, revenue: 12000, efficiency: 3.6, color: '#9333ea', rank: 11, delta: 4.5 }
];

const QUADRANTS = {
  GOLD_MINE: { label: 'The Gold Mine', desc: 'Large TVL plus high velocity. These are the current economic leaders of the space.', color: 'emerald' },
  BLUE_CHIPS: { label: 'Blue Chips', desc: 'Large TVL, stable protocols. Efficiency varies but liquidity is deeply entrenched.', color: 'slate' },
  HIDDEN_GEMS: { label: 'Hidden Gems', desc: 'Improving velocity with emerging TVL. High growth potential but liquidity is still building.', color: 'blue' },
  GHOST_TOWNS: { label: 'Ghost Towns', desc: 'High velocity relative to very low TVL, or stagnant TVL. Potentially unstable or niche.', color: 'rose' }
};

export const DefiDashboard: React.FC = () => {
  const [volChains, setVolChains] = useState<LlamaChain[]>([]);
  const [revChains, setRevChains] = useState<LlamaChain[]>([]);
  const [topChains, setTopChains] = useState<LlamaChain[]>([]);
  const [protocols, setProtocols] = useState<LlamaProtocol[]>([]);
  const [stables, setStables] = useState<LlamaStablecoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  
  // --- MATRIX MODAL STATE ---
  const [isMatrixOpen, setIsMatrixOpen] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('solana');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D'>('30D');
  const [activeMetric, setActiveMetric] = useState<'velocity' | 'revenue' | 'fees'>('velocity');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState(false);
  const [activeInfoQuadrant, setActiveInfoQuadrant] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1, style: 'currency', currency: 'USD' }).format(val);

  const formatNumber = (val: number) => 
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(val);

  // Filtered nodes for the matrix
  const filteredNodes = useMemo(() => {
    return MATRIX_NODES.filter(node => {
      const matchesSearch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = !filterType || node.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);

  const selectedNode = useMemo(() => 
    MATRIX_NODES.find(n => n.id === selectedNodeId) || null
  , [selectedNodeId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilterType(null);
    setTimeframe('30D');
    setActiveMetric('velocity');
    setSelectedNodeId('solana');
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
      
      {/* EFFICIENCY MATRIX MODAL - THE FULL UPGRADE */}
      {isMatrixOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-8 animate-in zoom-in-95 fade-in duration-300">
          <div className="absolute inset-0 bg-[#0b0e14]/98 backdrop-blur-3xl" onClick={() => setIsMatrixOpen(false)}></div>
          
          <div className="relative w-full max-w-[1440px] h-full max-h-[100vh] md:max-h-[95vh] bg-[#0b0e14] border border-white/5 md:rounded-[4rem] overflow-hidden shadow-[0_40px_150px_-20px_rgba(0,0,0,1)] flex flex-col font-space">
            
            {/* 1. TOP HEADER SECTION */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 md:p-12 border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full"></div>
                  <div className="relative p-4 bg-blue-600 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white">
                    <Target size={32} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white italic leading-none">Efficiency Matrix</h2>
                  <p className="text-[10px] md:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">Annualized Capital Productivity vs. Logarithmic TVL Ingress</p>
                </div>
              </div>

              {/* 2. CONTROLS BAR */}
              <div className="flex flex-wrap items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search node..." 
                    className="bg-black/40 border border-white/5 rounded-xl pl-10 pr-4 py-2 text-[11px] font-bold text-white uppercase tracking-widest outline-none focus:border-blue-500 transition-all w-32 md:w-48"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="h-6 w-[1px] bg-white/10 hidden sm:block"></div>

                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg">
                  {['7D', '30D', '90D'].map(t => (
                    <button 
                      key={t}
                      onClick={() => setTimeframe(t as any)}
                      className={`px-3 py-1.5 rounded-md text-[10px] font-black tracking-widest transition-all ${timeframe === t ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <select 
                  className="bg-black/40 border border-white/5 rounded-xl px-3 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none cursor-pointer hover:border-blue-500 transition-all"
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value as any)}
                >
                  <option value="velocity">Liquidity Velocity</option>
                  <option value="revenue">Revenue per TVL</option>
                  <option value="fees">Fees per TVL</option>
                </select>

                <div className="flex items-center gap-1">
                  {['L1', 'L2'].map(type => (
                    <button 
                      key={type}
                      onClick={() => setFilterType(filterType === type ? null : type)}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] border transition-all ${filterType === type ? 'bg-blue-600 border-blue-600 text-white' : 'bg-transparent border-white/10 text-slate-500 hover:text-white'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleReset}
                  className="p-2 text-slate-500 hover:text-blue-500 transition-colors"
                  title="Reset Matrix"
                >
                  <RotateCcw size={16} />
                </button>

                <button 
                  onClick={() => setIsMatrixOpen(false)}
                  className="p-3 bg-white/5 hover:bg-rose-600 rounded-xl transition-all text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 3. CENTER CHART PLOT */}
            <div className="flex-grow p-6 md:p-12 lg:p-16 flex flex-col overflow-hidden relative">
              <div className="relative flex-grow border-l border-b border-white/10 mb-24 md:mb-32 ml-16 md:ml-32 mt-4">
                
                {/* AXIS LABELS */}
                <div className="absolute -left-20 md:-left-28 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-blue-500 whitespace-nowrap opacity-50 flex items-center gap-4">
                  ANNUALIZED CAPITAL PRODUCTIVITY (%)
                </div>

                <div className="absolute left-1/2 -bottom-20 md:-bottom-24 -translate-x-1/2 text-[10px] md:text-[12px] font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-blue-500 whitespace-nowrap opacity-50">
                  TOTAL VALUE LOCKED (LOG TVL)
                </div>
                
                {/* QUADRANT LABELS WITH INFO POPUPS */}
                {[
                  { key: 'GOLD_MINE', pos: 'top-10 right-10', info: QUADRANTS.GOLD_MINE },
                  { key: 'HIDDEN_GEMS', pos: 'top-10 left-10', info: QUADRANTS.HIDDEN_GEMS },
                  { key: 'GHOST_TOWNS', pos: 'bottom-10 left-10', info: QUADRANTS.GHOST_TOWNS },
                  { key: 'BLUE_CHIPS', pos: 'bottom-10 right-10', info: QUADRANTS.BLUE_CHIPS }
                ].map(q => (
                  <div 
                    key={q.key} 
                    className={`absolute ${q.pos} z-30 flex items-center gap-3 bg-[#111827]/60 border border-white/5 px-6 py-2.5 rounded-full backdrop-blur-md transition-all group cursor-help`}
                    onMouseEnter={() => setActiveInfoQuadrant(q.key)}
                    onMouseLeave={() => setActiveInfoQuadrant(null)}
                  >
                    <div className={`w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] ${
                      q.key === 'GOLD_MINE' ? 'text-emerald-500 bg-emerald-500' :
                      q.key === 'HIDDEN_GEMS' ? 'text-blue-500 bg-blue-500' :
                      q.key === 'GHOST_TOWNS' ? 'text-rose-500 bg-rose-500' : 'text-slate-500 bg-slate-500'
                    }`}></div>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] font-mono group-hover:text-white transition-colors">{q.info.label}</span>
                    <HelpCircle size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {activeInfoQuadrant === q.key && (
                      <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-64 p-4 bg-black/90 border border-white/10 rounded-2xl shadow-2xl z-[60] animate-in fade-in zoom-in-95 pointer-events-none">
                        <div className="text-[10px] font-black uppercase text-blue-500 mb-2">{q.info.label}</div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-mono">{q.info.desc}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* SCATTER NODES */}
                <div className="absolute inset-0 z-20">
                  {filteredNodes.map(node => {
                    const logMin = 7.5; // ~$30M
                    const logMax = 11.5; // ~$300B
                    const logVal = Math.log10(node.tvl);
                    const left = ((logVal - logMin) / (logMax - logMin)) * 85 + 5;
                    const bottom = (node.efficiency / 50) * 85 + 5;

                    const isSelected = selectedNodeId === node.id;
                    const isHovered = hoveredNodeId === node.id;
                    const isDimmed = selectedNodeId && selectedNodeId !== node.id;

                    return (
                      <div 
                        key={node.id}
                        className={`absolute cursor-pointer transition-all duration-500 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}
                        style={{ left: `${left}%`, bottom: `${bottom}%` }}
                        onMouseEnter={() => setHoveredNodeId(node.id)}
                        onMouseLeave={() => setHoveredNodeId(null)}
                        onClick={() => setSelectedNodeId(node.id)}
                      >
                        <div className="relative -translate-x-1/2 translate-y-1/2">
                          {/* Main Bubble */}
                          <div 
                            className={`rounded-full border-[5px] border-[#0b0e14] transition-all duration-300 flex items-center justify-center ${isSelected ? 'w-12 h-12 scale-125' : 'w-8 h-8'} ${isHovered ? 'scale-110' : ''}`}
                            style={{ 
                              backgroundColor: node.color, 
                              boxShadow: (isSelected || isHovered) ? `0 0 40px ${node.color}cc` : 'none' 
                            }}
                          >
                             {isSelected && <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>}
                          </div>
                          
                          {/* Label */}
                          <div className={`absolute top-14 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${isSelected ? 'text-blue-400 opacity-100' : 'text-white/30 group-hover:text-white'}`}>
                            {node.name}
                          </div>

                          {/* Hover Tooltip */}
                          {isHovered && !isSelected && (
                            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#161b22] border border-white/10 p-5 rounded-[1.5rem] backdrop-blur-xl z-[100] shadow-2xl pointer-events-none min-w-[200px] animate-in fade-in zoom-in-95">
                              <div className="text-sm font-black text-white italic mb-3 border-b border-white/5 pb-2 uppercase tracking-tight flex items-center justify-between">
                                {node.name}
                                <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-slate-500 font-mono">RANK {node.rank}</span>
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase">Velocity</span>
                                  <span className="text-[11px] font-black text-emerald-400 font-mono">{node.efficiency.toFixed(1)}%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase">TVL</span>
                                  <span className="text-[11px] font-black text-white font-mono">{formatCompact(node.tvl)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-[9px] font-mono text-slate-500 uppercase">Window</span>
                                  <span className="text-[11px] font-black text-blue-500 font-mono">{timeframe}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Plot Grid */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.04] grid grid-cols-4 grid-rows-4">
                  {[...Array(16)].map((_, i) => <div key={i} className="border border-white/30"></div>)}
                </div>
              </div>

              {/* 4. BOTTOM INFO HUD */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch h-auto md:h-64">
                
                {/* INSIGHT CARD (Bottom Left) */}
                <div className="bg-white/5 rounded-[2.5rem] border border-white/5 p-8 flex flex-col justify-between group transition-all hover:bg-white/[0.08] relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-blue-500 mb-6">
                      <Zap size={18} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] font-mono italic">Efficiency Insight</span>
                    </div>
                    
                    {selectedNode ? (
                      <div className="animate-in fade-in slide-in-from-left-2">
                        <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-4">{selectedNode.name} Thesis</h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed font-mono max-w-xl">
                          {selectedNode.efficiency > 25 ? 
                            `Aggressive capital productivity profile. Every $1 of TVL is currently processing ${selectedNode.efficiency.toFixed(1)}% of its value in fees annually. High velocity indicates a massive per-capita productive user base.` : 
                            `Stable institutional liquidity moat. Scale of TVL provides deep orderbook support, even if annualized velocity (${selectedNode.efficiency.toFixed(1)}%) is lower relative to emerging high-yield L1s.`}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="text-2xl font-black text-white uppercase italic leading-none mb-4">Liquidity Velocity</h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed font-mono">Select a node to analyze its specific economic engine and risk profile.</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-6 mt-6">
                    <button 
                      onClick={() => setIsFormulaModalOpen(true)}
                      className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                    >
                      <Info size={14} /> Documentation & Formulas
                    </button>
                    <div className="flex-grow h-[1px] bg-white/5"></div>
                  </div>
                  
                  {/* Subtle Background Icon */}
                  <div className="absolute -bottom-4 -right-4 opacity-5 pointer-events-none">
                    <Target size={160} />
                  </div>
                </div>

                {/* SELECTED NODE CARD (Bottom Right) */}
                <div className="bg-blue-600/5 rounded-[2.5rem] border border-blue-600/20 p-8 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden transition-all group hover:bg-blue-600/[0.08]">
                  {selectedNode ? (
                    <>
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/20 blur-2xl animate-pulse"></div>
                          <div 
                            className="w-20 h-20 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl bg-[#0b0e14] relative overflow-hidden"
                            style={{ boxShadow: `0 0 30px ${selectedNode.color}33` }}
                          >
                             <Activity size={32} strokeWidth={2.5} style={{ color: selectedNode.color }} />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">{selectedNode.name}</h3>
                             <span className="text-[8px] bg-white/5 px-2 py-0.5 rounded font-black text-slate-500 uppercase tracking-widest">RANK {selectedNode.rank}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-2">
                             <div className="flex flex-col">
                               <span className="text-[8px] text-slate-500 uppercase font-mono font-bold tracking-widest">TVL</span>
                               <span className="text-xs font-black text-white font-mono">{formatCompact(selectedNode.tvl)}</span>
                             </div>
                             <div className="w-[1px] h-6 bg-white/10"></div>
                             <div className="flex flex-col">
                               <span className="text-[8px] text-slate-500 uppercase font-mono font-bold tracking-widest">Growth</span>
                               <span className={`text-xs font-black font-mono ${selectedNode.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                 {selectedNode.delta > 0 ? '+' : ''}{selectedNode.delta}%
                               </span>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-8 md:pl-8 md:border-l border-white/10 relative z-10">
                         <div className="text-center md:text-right">
                           <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.3em] font-mono mb-2">Ann. Productivity</div>
                           <div className="text-6xl font-black text-white font-space italic leading-none tracking-tighter">
                             {selectedNode.efficiency.toFixed(1)}%
                           </div>
                         </div>

                         <div className="flex md:flex-col gap-2 w-full md:w-auto">
                            <button 
                              className="flex-grow md:w-40 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                            >
                              <Plus size={14} /> Watchlist
                            </button>
                            <button 
                              onClick={handleShare}
                              className="flex-grow md:w-40 py-3 bg-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                              {isCopied ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Share2 size={14} />} 
                              {isCopied ? 'Copied' : 'Share'}
                            </button>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                       <Target size={40} className="text-blue-500" />
                       <span className="text-[10px] font-black uppercase tracking-[0.5em] font-mono">Select a Node to Decode Performance</span>
                    </div>
                  )}
                </div>
              </div>

              {/* DATA FOOTER */}
              <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[9px] font-mono font-bold text-slate-600 uppercase tracking-widest">
                 <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Source: DefiLlama Node 01</div>
                    <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Aggregation: Mean Probability</div>
                    <div className="flex items-center gap-2"><Clock size={12} /> Sync: {lastUpdate}</div>
                 </div>
                 <div className="flex items-center gap-6">
                    <button className="hover:text-white transition-colors flex items-center gap-2"><Download size={12} /> Export PNG</button>
                    <span className="text-slate-800">|</span>
                    <span>Algorithm v4.2.0 (Optimized Log)</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORMULA EXPLANATION MODAL */}
      {isFormulaModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setIsFormulaModalOpen(false)}></div>
          <div className="relative bg-[#111827] border border-white/10 rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl font-space">
             <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-blue-600 rounded-2xl text-white">
                   <Target size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-white uppercase italic">On-Chain Logic Framework</h3>
               </div>
               <button onClick={() => setIsFormulaModalOpen(false)} className="p-3 bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                 <X size={20} />
               </button>
             </div>
             
             <div className="space-y-8">
                <div className="bg-black/40 p-8 rounded-3xl border border-white/5">
                   <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3 font-mono">Core Efficiency Equation</div>
                   <div className="text-4xl font-black text-white font-mono tracking-tighter mb-4">E = (Σ Fees / TVL) × 365</div>
                   <p className="text-xs text-slate-500 leading-relaxed font-mono italic">Efficiency (E) represents the annualized capital productivity. It answers: "If this protocol held $100, how many dollars in fees would it produce in a year?"</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Why Logarithmic TVL?</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-mono">Blockchain liquidity follows a power law. Log scaling allows us to compare massive networks like Ethereum ($50B+) alongside emerging high-velocity chains ($500M) on the same visibility plane.</p>
                   </div>
                   <div className="space-y-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Timeframe Bias</div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-mono">Daily volume is smoothed over the selected window (7D/30D/90D) to prevent "one-day-wonders" or wash trading spikes from distorting the economic thesis.</p>
                   </div>
                </div>

                <div className="pt-8 border-t border-white/5">
                   <button 
                    onClick={() => setIsFormulaModalOpen(false)}
                    className="w-full py-5 bg-blue-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95"
                   >
                     System Synchronization Complete
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- DASHBOARD BACKGROUND (RESTORED TO PREVIOUS LOOK) --- */}
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
            className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-blue-500/30 group font-space italic"
          >
            Launch Efficiency Matrix <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
