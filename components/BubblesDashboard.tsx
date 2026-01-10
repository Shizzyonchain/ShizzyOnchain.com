
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';
import { 
  Loader2, 
  Search, 
  X, 
  Pin, 
  RefreshCw,
  TrendingUp,
  BarChart3,
  ChevronDown,
  LayoutGrid,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type Timeframe = '1h' | '24h' | '7d' | '30d' | '1y';
type SizeMetric = 'market_cap' | 'total_volume';

interface BubbleNode extends GeckoCoin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  imgElement?: HTMLImageElement;
}

const RANK_RANGES = [
  { label: '1 - 100', page: 1 },
  { label: '101 - 200', page: 2 },
  { label: '201 - 300', page: 3 },
  { label: '301 - 400', page: 4 },
  { label: '401 - 500', page: 5 }
];

// Symbols to exclude (Stables and Wrapped tokens)
const EXCLUDED_SYMBOLS = [
  'USDT', 'USDC', 'DAI', 'BUSD', 'FDUSD', 'TUSD', 'USDP', 'USDD', 'PYUSD', 'FRAX', 'LUSD', 'GHO', 'CRVUSD', 'MIM', 'USTC', 'EURC',
  'WBTC', 'WETH', 'WBNB', 'WAVAX', 'WMATIC', 'WFTM', 'WSTRK', 'WADA', 'WDOT', 'WSOL', 'STETH', 'CBETH', 'RETH', 'FRXETH'
];

export const BubblesDashboard: React.FC = () => {
  const [coins, setCoins] = useState<GeckoCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<Timeframe>('24h');
  const [sizeMetric, setSizeMetric] = useState<SizeMetric>('market_cap');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoin, setSelectedCoin] = useState<GeckoCoin | null>(null);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<BubbleNode[]>([]);
  const requestRef = useRef<number>();
  const hoveredNodeRef = useRef<BubbleNode | null>(null);
  const imagesCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    const saved = localStorage.getItem('onchainrev_bubbles_pinned');
    if (saved) setPinnedIds(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('onchainrev_bubbles_pinned', JSON.stringify(pinnedIds));
  }, [pinnedIds]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await coinGeckoProxy.getBubbleMarkets({
        limit: 100,
        page,
        onUpdate: (updated) => setCoins(updated)
      });
      setCoins(data);
    } catch (e) {
      console.error("Bubble fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    if (autoRefresh) {
      const interval = setInterval(fetchData, 60000);
      return () => clearInterval(interval);
    }
  }, [page, autoRefresh]);

  const getTimeframeKey = (tf: Timeframe) => {
    switch (tf) {
      case '1h': return 'price_change_percentage_1h_in_currency';
      case '7d': return 'price_change_percentage_7d_in_currency';
      case '30d': return 'price_change_percentage_30d_in_currency';
      case '1y': return 'price_change_percentage_1y_in_currency';
      default: return 'price_change_percentage_24h_in_currency';
    }
  };

  const filteredCoins = useMemo(() => {
    return coins.filter(c => {
      const symbol = c.symbol.toUpperCase();
      const isExcluded = EXCLUDED_SYMBOLS.includes(symbol);
      const matchesSearch = symbol.includes(searchQuery.toUpperCase()) || c.name.toUpperCase().includes(searchQuery.toUpperCase());
      return !isExcluded && matchesSearch;
    });
  }, [coins, searchQuery]);

  const pinnedCoins = useMemo(() => {
    return coins.filter(c => pinnedIds.includes(c.id));
  }, [coins, pinnedIds]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || filteredCoins.length === 0) return;

    const updateCanvasSize = () => {
      const width = container.offsetWidth;
      const height = container.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      return { width, height };
    };

    let { width, height } = updateCanvasSize();

    const tfKey = getTimeframeKey(timeframe);
    const currentNodes = nodesRef.current;

    nodesRef.current = filteredCoins.map(coin => {
      const existing = currentNodes.find(n => n.id === coin.id);
      const val = Math.abs(coin[sizeMetric] || 0);
      const change = (coin as any)[tfKey] || 0;
      const absChange = Math.abs(change);
      
      // Radius Logic: Shrink bubbles with low movement (0-1%)
      // If movement is < 2%, we reduce the base contribution
      const scaleFactor = absChange < 2 ? 0.6 : 1.0; 
      const baseRadius = Math.log(val + 1) * 1.5 * scaleFactor;
      const changeWeight = Math.sqrt(absChange) * 28; 
      
      // Minimum radius is smaller for low movement
      const minRadius = absChange < 1.5 ? 28 : 42;
      const radius = Math.min(Math.max(baseRadius + changeWeight - 12, minRadius), 220); 
      
      if (!imagesCacheRef.current.has(coin.id)) {
        const img = new Image();
        img.src = coin.image;
        imagesCacheRef.current.set(coin.id, img);
      }

      return {
        ...coin,
        radius,
        x: existing?.x || Math.random() * width,
        y: existing?.y || Math.random() * height,
        vx: existing?.vx || (Math.random() - 0.5) * 0.03,
        vy: existing?.vy || (Math.random() - 0.5) * 0.03,
        imgElement: imagesCacheRef.current.get(coin.id)
      };
    });

    const simulate = () => {
      const nodes = nodesRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const friction = 0.975; // More calm physics for the larger space
      const charge = 0.14;   
      const centerX = width / 2;
      const centerY = height / 2;
      const attractionForce = 0.00008; 

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.vx += (centerX - a.x) * attractionForce;
        a.vy += (centerY - a.y) * attractionForce;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = a.radius + b.radius + 14;

          if (distance < minDistance) {
            const force = (minDistance - distance) / distance * charge;
            const fx = dx * force;
            const fy = dy * force;
            a.vx -= fx;
            a.vy -= fy;
            b.vx += fx;
            b.vy += fy;
          }
        }

        a.x += a.vx;
        a.y += a.vy;
        a.vx *= friction;
        a.vy *= friction;

        if (a.x < a.radius) { a.x = a.radius; a.vx *= -0.15; }
        if (a.x > width - a.radius) { a.x = width - a.radius; a.vx *= -0.15; }
        if (a.y < a.radius) { a.y = a.radius; a.vy *= -0.15; }
        if (a.y > height - a.radius) { a.y = height - a.radius; a.vy *= -0.15; }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

      const drawNode = (node: BubbleNode) => {
        const change = (node as any)[tfKey] || 0;
        const isPositive = change >= 0;
        const isHovered = hoveredNodeRef.current?.id === node.id;

        const neonGreen = '#14b8a6';
        const neonRed = '#f43f5e';
        const darkGreen = '#064e3b';
        const darkRed = '#4c0519';
        
        const baseColor = isPositive ? neonGreen : neonRed;
        const fadeColor = isPositive ? darkGreen : darkRed;

        ctx.save();
        ctx.translate(node.x, node.y);

        if (isHovered) {
          ctx.shadowBlur = 60;
          ctx.shadowColor = baseColor;
        }

        const grad = ctx.createRadialGradient(0, -node.radius*0.1, 0, 0, 0, node.radius);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(0.7, fadeColor);
        grad.addColorStop(1, '#000000');

        ctx.beginPath();
        ctx.arc(0, 0, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.strokeStyle = isPositive ? '#14b8a6aa' : '#f43f5eaa';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.strokeStyle = '#ffffffcc';
        ctx.lineWidth = 0.5;
        ctx.stroke();

        if (node.imgElement && node.imgElement.complete && node.radius > 28) {
          const iconSize = node.radius * 0.44;
          ctx.save();
          ctx.beginPath();
          ctx.arc(0, -node.radius * 0.38, iconSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(node.imgElement, -iconSize / 2, -node.radius * 0.38 - iconSize / 2, iconSize, iconSize);
          ctx.restore();
        }

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        
        const symbolSize = Math.max(node.radius * 0.36, 11);
        ctx.font = `900 ${symbolSize}px "Outfit", sans-serif`;
        ctx.fillText(node.symbol.toUpperCase(), 0, node.radius > 32 ? 10 : 5);

        const percentSize = Math.max(node.radius * 0.22, 9);
        ctx.font = `700 ${percentSize}px "JetBrains Mono", monospace`;
        ctx.fillText(`${isPositive ? '+' : ''}${change.toFixed(1)}%`, 0, node.radius > 32 ? (symbolSize + 14) : (symbolSize + 2));

        ctx.restore();
      };

      nodes.forEach(node => {
        if (hoveredNodeRef.current?.id !== node.id) drawNode(node);
      });
      if (hoveredNodeRef.current) drawNode(hoveredNodeRef.current);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      requestRef.current = requestAnimationFrame(simulate);
    };

    requestRef.current = requestAnimationFrame(simulate);
    
    const handleResize = () => {
      const size = updateCanvasSize();
      width = size.width;
      height = size.height;
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(requestRef.current!);
      window.removeEventListener('resize', handleResize);
    };
  }, [filteredCoins, timeframe, sizeMetric]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const hovered = nodesRef.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < node.radius;
    });

    hoveredNodeRef.current = hovered || null;
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNodeRef.current) {
      setSelectedCoin(hoveredNodeRef.current);
    }
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 6 : 2 }).format(val);

  const formatCompact = (val: number) => 
    new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2, style: 'currency', currency: 'USD' }).format(val);

  return (
    <div className="w-full h-full flex flex-col bg-[#0b0e14] font-space select-none overflow-hidden">
      <div className="z-[70] bg-[#0b0e14] border-b border-green-500 px-6 py-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex bg-[#161b22] p-1 rounded-md border border-white/5 overflow-hidden">
            {[
              { id: '1h', label: 'Hour' },
              { id: '24h', label: 'Day' },
              { id: '7d', label: 'Week' },
              { id: '30d', label: 'Month' },
              { id: '1y', label: 'Year' }
            ].map(tf => (
              <button
                key={tf.id}
                onClick={() => setTimeframe(tf.id as Timeframe)}
                className={`px-4 py-1.5 rounded-md text-[12px] font-bold tracking-tight transition-all border ${
                  timeframe === tf.id ? 'bg-[#14b8a6] text-white border-[#14b8a6]' : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block"></div>

          <div className="flex items-center gap-2 bg-[#161b22] px-4 py-2 rounded-md border border-[#14b8a6]/40 cursor-pointer hover:bg-white/5 transition-all">
             <span className="text-[11px] font-bold text-white uppercase">{sizeMetric === 'market_cap' ? 'Market Cap' : 'Volume'} & {timeframe === '24h' ? 'Day' : timeframe}</span>
             <ChevronDown size={14} className="text-slate-400" />
          </div>

          <div className="p-2 bg-[#161b22] border border-white/10 rounded-md text-slate-400 hover:text-white cursor-pointer transition-all">
            <Settings size={16} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input 
              type="text"
              placeholder="Search cryptocurrency"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#161b22] border border-white/10 rounded-md pl-9 pr-4 py-2 text-[12px] font-medium text-white focus:border-[#14b8a6] outline-none w-64 transition-all"
            />
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center bg-[#161b22] rounded-md border border-white/10 overflow-hidden">
              <select 
                value={page}
                onChange={(e) => setPage(Number(e.target.value))}
                className="bg-transparent pl-4 pr-1 py-2 text-[12px] font-bold text-white focus:outline-none cursor-pointer appearance-none"
              >
                {RANK_RANGES.map(range => <option key={range.page} value={range.page} className="bg-[#161b22]">{range.label}</option>)}
              </select>
              <div className="pr-3 text-slate-500 pointer-events-none"><ChevronDown size={14} /></div>
            </div>
            
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="p-2 bg-[#161b22] border border-white/10 rounded-md text-slate-400 hover:text-white transition-all disabled:opacity-30"
              disabled={page === 1}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-[#161b22] border border-white/10 rounded-md text-slate-400 hover:text-white transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex items-center gap-2 bg-[#161b22] px-4 py-2 rounded-md border border-white/10">
             <span className="text-[12px] font-bold text-slate-400">$</span>
             <span className="text-[12px] font-bold text-white">USD</span>
             <ChevronDown size={14} className="text-slate-400" />
          </div>

          <div className="flex items-center gap-1 bg-[#161b22] p-1 rounded-md border border-white/10">
             <button onClick={() => setSizeMetric(sizeMetric === 'market_cap' ? 'total_volume' : 'market_cap')} className={`p-1.5 rounded transition-all ${sizeMetric === 'total_volume' ? 'bg-[#14b8a6] text-white' : 'text-slate-400 hover:text-white'}`}><LayoutGrid size={14} /></button>
             <button className="p-1.5 rounded text-slate-400 hover:text-white transition-all"><Settings size={14} /></button>
          </div>
        </div>
      </div>

      {pinnedCoins.length > 0 && (
        <div className="bg-[#111827]/50 border-b border-white/5 px-6 py-2 flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Watchlist</span>
          {pinnedCoins.map(coin => (
            <div 
              key={coin.id} 
              onClick={() => setSelectedCoin(coin)}
              className="flex items-center gap-2 px-3 py-1 bg-[#161b22] rounded-md border border-white/5 cursor-pointer hover:border-[#14b8a6]/50 transition-all shrink-0"
            >
              <img src={coin.image} alt="" className="w-3 h-3" />
              <span className="text-[10px] font-black text-white">{coin.symbol.toUpperCase()}</span>
              <span className={`text-[10px] font-mono font-bold ${(coin as any)[getTimeframeKey(timeframe)] >= 0 ? 'text-[#14b8a6]' : 'text-[#f43f5e]'}`}>
                {((coin as any)[getTimeframeKey(timeframe)] || 0).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      )}

      <div ref={containerRef} className="relative flex-grow overflow-hidden bg-[#0b0e14]">
        {loading && coins.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-50">
            <Loader2 className="animate-spin text-[#14b8a6]" size={50} strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-[11px] font-black text-[#14b8a6] uppercase tracking-[0.4em] animate-pulse">Syncing Liquidity Matrix</p>
            </div>
          </div>
        ) : (
          <canvas 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
            className="w-full h-full block cursor-crosshair"
          />
        )}

        {/* Updated Side Panel to match User Image & Requirement */}
        <div className={`fixed inset-y-0 right-0 h-screen w-full lg:w-[440px] bg-[#0b0e14] border-l border-white/10 z-[100] transition-transform duration-500 shadow-2xl flex flex-col ${selectedCoin ? 'translate-x-0' : 'translate-x-full'}`}>
          {selectedCoin && (
            <div className="flex-grow flex flex-col p-6 lg:p-10 overflow-y-auto scrollbar-hide">
              <button 
                onClick={() => setSelectedCoin(null)}
                className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors z-50"
              >
                <X size={24} />
              </button>

              <div className="mt-4 space-y-8">
                {/* Header Section */}
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    <img src={selectedCoin.image} alt={selectedCoin.name} className="w-12 h-12" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{selectedCoin.name}</h3>
                    <p className="text-[#14b8a6] font-mono text-[10px] font-bold uppercase tracking-widest mt-1">{selectedCoin.symbol.toUpperCase()} / USD</p>
                  </div>
                </div>

                {/* Performance & Value Section matching image */}
                <div className="space-y-4">
                  <div className="bg-[#161b22] border border-white/5 rounded-2xl p-6">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Live Valuation</div>
                    <div className="text-4xl font-black font-mono text-white tracking-tighter">
                      {formatCurrency(selectedCoin.current_price)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#161b22] border border-white/5 rounded-2xl p-5">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">Market Cap</div>
                      <div className="text-xl font-black font-mono text-white">{formatCompact(selectedCoin.market_cap)}</div>
                    </div>
                    <div className="bg-[#161b22] border border-white/5 rounded-2xl p-5">
                      <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">24h Volume</div>
                      <div className="text-xl font-black font-mono text-white">{formatCompact(selectedCoin.total_volume)}</div>
                    </div>
                  </div>
                </div>

                {/* Node Performance Section matching image */}
                <div className="space-y-4">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-1 mb-2 font-mono">Node Performance</div>
                  <div className="space-y-2">
                    {[
                      { tf: '1h', label: '1 Hour' },
                      { tf: '24h', label: '24 Hours' },
                      { tf: '7d', label: '7 Days' },
                      { tf: '30d', label: '30 Days' },
                      { tf: '1y', label: '1 Year' }
                    ].map(item => {
                      const val = (selectedCoin as any)[getTimeframeKey(item.tf as Timeframe)] || 0;
                      return (
                        <div key={item.tf} className="flex justify-between items-center p-5 bg-[#161b22] border border-white/5 rounded-xl">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">{item.label}</span>
                          <span className={`text-sm font-bold font-mono ${val >= 0 ? 'text-[#14b8a6]' : 'text-[#f43f5e]'}`}>
                            {val >= 0 ? '+' : ''}{val.toFixed(2)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => {
                      const id = selectedCoin.id;
                      setPinnedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
                    }}
                    className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-[0.2em] text-[10px] transition-all ${
                      pinnedIds.includes(selectedCoin.id)
                        ? 'bg-[#f43f5e] text-white'
                        : 'bg-[#14b8a6] text-white hover:scale-[1.02]'
                    }`}
                  >
                    <Pin size={16} className={pinnedIds.includes(selectedCoin.id) ? 'fill-white' : ''} />
                    {pinnedIds.includes(selectedCoin.id) ? 'Remove Watchlist' : 'Add to Watchlist'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#0b0e14] py-1 border-t border-white/5 flex flex-col items-center gap-0">
        <div className="flex items-center gap-6 font-mono text-[7px] font-bold uppercase tracking-[0.5em] text-slate-800 text-center">
          Powered by CoinGecko Market Data
        </div>
      </footer>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};
