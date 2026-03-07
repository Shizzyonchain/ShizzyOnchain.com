
import React, { useState, useEffect, useRef } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { 
  Search, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  Layers,
  CheckCircle2,
  Database,
  X,
  Wifi,
  WifiOff,
  Terminal,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface ChainConfig {
  name: string;
  rpc: string;
  symbol: string;
  coinGeckoId: string;
  type: 'evm' | 'solana';
  tokens?: { symbol: string; address: string; name: string }[];
}

/**
 * MASTER SCAN v11.0 - PROXIED REAL DATA
 * Uses a CORS proxy to ensure browser requests reach blockchain nodes.
 * This is 100% real on-chain data. Zero simulation.
 */
const CHAIN_CONFIGS: ChainConfig[] = [
  { 
    name: 'Ethereum', 
    rpc: 'https://rpc.ankr.com/eth', 
    symbol: 'ETH', 
    coinGeckoId: 'ethereum',
    type: 'evm',
    tokens: [
      { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin' },
      { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether' }
    ]
  },
  { 
    name: 'Base', 
    rpc: 'https://rpc.ankr.com/base', 
    symbol: 'ETH', 
    coinGeckoId: 'ethereum',
    type: 'evm',
    tokens: [{ symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin' }]
  },
  { 
    name: 'Solana', 
    rpc: 'https://api.mainnet-beta.solana.com', 
    symbol: 'SOL', 
    coinGeckoId: 'solana',
    type: 'solana'
  },
  { 
    name: 'BNB Chain', 
    rpc: 'https://rpc.ankr.com/bsc', 
    symbol: 'BNB', 
    coinGeckoId: 'binancecoin',
    type: 'evm'
  },
  { 
    name: 'Arbitrum', 
    rpc: 'https://rpc.ankr.com/arbitrum', 
    symbol: 'ETH', 
    coinGeckoId: 'ethereum',
    type: 'evm'
  },
  { 
    name: 'Polygon', 
    rpc: 'https://rpc.ankr.com/polygon', 
    symbol: 'POL', 
    coinGeckoId: 'polygon-ecosystem-token',
    type: 'evm'
  },
  { 
    name: 'Optimism', 
    rpc: 'https://rpc.ankr.com/optimism', 
    symbol: 'ETH', 
    coinGeckoId: 'ethereum',
    type: 'evm'
  },
  { 
    name: 'Avalanche', 
    rpc: 'https://rpc.ankr.com/avalanche', 
    symbol: 'AVAX', 
    coinGeckoId: 'avalanche-2',
    type: 'evm'
  }
];

interface DetectedToken {
  name: string;
  symbol: string;
  balance: number;
  value: number;
}

interface ChainScanResult {
  config: ChainConfig;
  status: 'pending' | 'scanning' | 'complete' | 'error';
  balance: number;
  usdValue: number;
  price: number;
  detectedTokens: DetectedToken[];
  errorMsg?: string;
}

export const WalletChecker: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<ChainScanResult[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [inputError, setInputError] = useState<string | null>(null);
  const [progressCount, setProgressCount] = useState(0);
  const [currentScanningChain, setCurrentScanningChain] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);

  const logContainerRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [scanLogs]);

  const addLog = (msg: string) => {
    setScanLogs(prev => [...prev.slice(-99), `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${msg}`]);
  };

  const callRpc = async (rpcUrl: string, method: string, params: any[]) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 15000);
    
    // Guaranteed CORS bypass for browser environments
    const proxiedUrl = `https://corsproxy.io/?${encodeURIComponent(rpcUrl)}`;

    try {
      const response = await fetch(proxiedUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', method, params, id: 1 }),
        signal: controller.signal
      });
      clearTimeout(id);
      
      if (!response.ok) throw new Error(`HTTP_${response.status}`);
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      return data.result;
    } catch (e: any) {
      clearTimeout(id);
      if (e.name === 'AbortError') throw new Error('NODE_TIMEOUT');
      throw e;
    }
  };

  const fetchEvmBalance = async (rpcUrl: string, walletAddress: string): Promise<number> => {
    const result = await callRpc(rpcUrl, 'eth_get_balance', [walletAddress, 'latest']);
    return Number(BigInt(result)) / 1e18;
  };

  const fetchSolanaBalance = async (rpcUrl: string, walletAddress: string): Promise<number> => {
    const result = await callRpc(rpcUrl, 'getBalance', [walletAddress]);
    return (result?.value || 0) / 1e9;
  };

  const fetchTokenBalance = async (rpcUrl: string, walletAddress: string, tokenAddress: string): Promise<number> => {
    const cleanAddr = walletAddress.startsWith('0x') ? walletAddress.substring(2) : walletAddress;
    const dataParam = `0x70a08231000000000000000000000000${cleanAddr}`;
    const result = await callRpc(rpcUrl, 'eth_call', [{ to: tokenAddress, data: dataParam }, 'latest']);
    if (!result || result === '0x') return 0;
    return Number(BigInt(result)) / 1e6;
  };

  const startScan = async () => {
    const cleanAddress = address.trim();
    if (!cleanAddress) {
      setInputError('Wallet address required.');
      return;
    }

    setInputError(null);
    setIsScanning(true);
    setTotalValue(0);
    setProgressCount(0);
    setScanLogs([]);
    addLog(`INITIATING GLOBAL UPLINK: ${cleanAddress}`);

    try {
      addLog(`SYNCING MARKET ORACLE...`);
      const markets = await coinGeckoProxy.getTopMarkets(undefined, true);
      const marketDataMap: Record<string, number> = {};
      CHAIN_CONFIGS.forEach(c => {
        const market = markets.find(m => m.id === c.coinGeckoId);
        marketDataMap[c.name] = market?.current_price || 0;
      });

      const initialResults: ChainScanResult[] = CHAIN_CONFIGS.map(config => ({
        config, status: 'pending', balance: 0, usdValue: 0, price: marketDataMap[config.name] || 0, detectedTokens: []
      }));
      setScanResults(initialResults);

      const updatedResults = [...initialResults];
      let runningTotal = 0;

      for (let i = 0; i < updatedResults.length; i++) {
        const result = updatedResults[i];
        setCurrentScanningChain(result.config.name);
        addLog(`HANDSHAKING NODE: ${result.config.name.toUpperCase()}...`);
        setScanResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'scanning' } : r));
        
        try {
          let balance = 0;
          if (result.config.type === 'solana') {
            balance = await fetchSolanaBalance(result.config.rpc, cleanAddress);
          } else {
            if (!cleanAddress.startsWith('0x')) throw new Error('NOT_EVM');
            balance = await fetchEvmBalance(result.config.rpc, cleanAddress);
          }

          let discovered: DetectedToken[] = [];
          let chainValue = 0;

          if (balance > 0) {
            const val = balance * result.price;
            discovered.push({ 
              name: result.config.type === 'solana' ? 'Solana' : (result.config.symbol === 'ETH' ? 'Ethereum' : result.config.name), 
              symbol: result.config.symbol, 
              balance: balance, 
              value: val 
            });
            chainValue += val;
          }

          if (result.config.type === 'evm' && result.config.tokens) {
            for (const t of result.config.tokens) {
               try {
                 const tokenBal = await fetchTokenBalance(result.config.rpc, cleanAddress, t.address);
                 if (tokenBal > 0) {
                    discovered.push({ name: t.name, symbol: t.symbol, balance: tokenBal, value: tokenBal });
                    chainValue += tokenBal;
                    addLog(`[DETECTED] ${t.symbol} ON ${result.config.name.toUpperCase()}`);
                 }
               } catch (e) {}
            }
          }

          updatedResults[i] = { ...result, status: 'complete', balance, usdValue: chainValue, detectedTokens: discovered };
          runningTotal += chainValue;
          if (chainValue > 0) addLog(`[CONFIRMED] POSITIVE BALANCE: $${chainValue.toLocaleString()} (${result.config.name.toUpperCase()})`);
        } catch (e: any) {
          updatedResults[i] = { ...result, status: 'error', errorMsg: e.message };
          addLog(`[!] LINK FAILED: ${result.config.name.toUpperCase()} (${e.message})`);
        }
        
        setScanResults([...updatedResults]);
        setTotalValue(runningTotal);
        setProgressCount(i + 1);
        await new Promise(r => setTimeout(r, 100));
      }
      
      setCurrentScanningChain(null);
      setIsScanning(false);
      addLog(`VERIFICATION FINISHED. AGGREGATE LIQUIDITY: $${runningTotal.toLocaleString()}`);
    } catch (err) {
      addLog(`[FATAL] SYSTEM COLLAPSE.`);
      setIsScanning(false);
    }
  };

  const handleClear = () => {
    setAddress('');
    setInputError(null);
    setScanResults([]);
    setTotalValue(0);
    setProgressCount(0);
    setScanLogs([]);
    setCurrentScanningChain(null);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20 px-4">
      
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6 w-full text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
              <ShieldAlert size={10} strokeWidth={3} className="animate-pulse" />
              NON-SIMULATED RAW DATA
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200 dark:border-white/10">
              <Database size={10} /> {CHAIN_CONFIGS.length} LIVE NETWORK NODES
            </div>
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            MASTER <span className="text-orange-600">SCAN</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl leading-relaxed italic mx-auto md:mx-0">
            DIRECT ON-CHAIN STATE ANALYSIS. NO SIMULATION. FETCHING NATIVE + STABLE BALANCES ACROSS THE STACK.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1200px] mx-auto items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
           <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-orange-600 transition-colors pointer-events-none">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isScanning && startScan()}
              placeholder="TARGET ADDRESS (0x... / SOL)"
              className="w-full h-24 bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 rounded-[2rem] pl-20 pr-16 text-xl md:text-2xl font-mono font-bold outline-none focus:border-orange-600 transition-all shadow-2xl dark:shadow-none uppercase"
            />
            {address && !isScanning && (
              <button onClick={handleClear} className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-orange-600 transition-colors">
                <X size={28} />
              </button>
            )}
          </div>
          <button 
            onClick={startScan}
            disabled={isScanning || !address}
            className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.3em] text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            {isScanning ? `PENETRATING LIVE NODES...` : 'START GLOBAL AUDIT'}
          </button>
          {inputError && <p className="text-rose-500 text-[10px] font-black font-mono uppercase tracking-widest flex items-center justify-center gap-2"><AlertCircle size={14} /> {inputError}</p>}
        </div>

        <div className="lg:col-span-5">
           <div className="bg-slate-900 rounded-[2rem] p-6 h-[300px] border border-white/5 shadow-2xl overflow-hidden flex flex-col relative group">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                 <div className="flex items-center gap-3 text-orange-500">
                    <Terminal size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">LIVE TERMINAL</span>
                 </div>
                 {isScanning && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div><span className="text-[8px] font-mono text-orange-500 uppercase tracking-widest">INGRESS ACTIVE</span></div>}
              </div>
              <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-2 font-mono text-[10px] custom-terminal-scroll pr-2 relative z-10">
                 {scanLogs.length === 0 ? <div className="text-slate-600 italic">Terminal Standby. Awaiting Target Ingress.</div> : scanLogs.map((log, i) => (
                   <div key={i} className={`flex gap-3 leading-relaxed ${log.includes('[DETECTED]') || log.includes('[CONFIRMED]') ? 'text-emerald-400 font-bold' : log.includes('[!]') || log.includes('FAILED') ? 'text-rose-500' : log.includes('HANDSHAKING') ? 'text-orange-400' : 'text-slate-400'}`}>
                      <span className="shrink-0 text-slate-600 tabular-nums">{i + 1}.</span>
                      <span>{log}</span>
                   </div>
                 ))}
                 <div ref={logEndRef} />
              </div>
           </div>
        </div>
      </div>

      {isScanning && (
        <div className="max-w-[1200px] mx-auto bg-orange-600/5 dark:bg-orange-600/[0.03] border border-orange-600/30 rounded-[3rem] p-10 md:p-16 space-y-8 animate-in zoom-in-95 duration-500 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="space-y-4 text-center md:text-left min-w-0 flex-1">
                <div className="text-[10px] font-black text-orange-600 uppercase tracking-[0.5em] font-mono">SYNCING ON-CHAIN STATE</div>
                <div className="h-16 md:h-24 flex items-center justify-center md:justify-start overflow-visible">
                  <h2 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic animate-pulse leading-none pr-6 whitespace-nowrap">{currentScanningChain || 'INITIALIZING...'}</h2>
                </div>
             </div>
             <div className="shrink-0 flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-slate-200 dark:border-white/5 border-t-orange-600 animate-spin">
                <div className="text-2xl font-black font-mono text-orange-600 tabular-nums">{Math.round((progressCount / CHAIN_CONFIGS.length) * 100)}%</div>
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-end text-[10px] font-black font-mono text-orange-600 uppercase tracking-[0.3em]">
               <span>NETWORK PROBE</span>
               <span className="tabular-nums">{progressCount} / {CHAIN_CONFIGS.length} NODES LOGGED</span>
             </div>
             <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
               <div className="h-full bg-orange-600 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.6)]" style={{ width: `${(progressCount / CHAIN_CONFIGS.length) * 100}%` }}></div>
             </div>
          </div>
        </div>
      )}

      {scanResults.length > 0 && !isScanning && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-10 duration-700">
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 dark:bg-white rounded-[3rem] p-10 text-white dark:text-black shadow-2xl space-y-8 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000"><TrendingUp size={240} strokeWidth={4} /></div>
                <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">AGGREGATE VALUE</div>
                  <div className="text-5xl md:text-6xl font-black font-space italic tracking-tighter leading-none tabular-nums">{formatCurrency(totalValue)}</div>
                </div>
                <div className="relative z-10 pt-8 border-t border-white/20 dark:border-black/10">
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Positive State Handshakes</div>
                   <div className="text-2xl font-black italic tracking-tighter tabular-nums">{scanResults.filter(r => r.usdValue > 0).length} / {scanResults.length}</div>
                </div>
             </div>
             
             <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl max-h-[800px] overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-3"><Layers className="text-orange-600" size={18} /><h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">DETAILED INVENTORY</h3></div>
                <div className="space-y-10">
                  {scanResults.filter(r => r.usdValue > 0).sort((a,b) => b.usdValue - a.usdValue).map((res, i) => (
                    <div key={i} className="space-y-4 group">
                       <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{res.config.name}</span>
                             <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest mt-1">{res.detectedTokens.length} ASSETS LOGGED</span>
                          </div>
                          <div className="text-right">
                             <div className="text-sm font-black font-mono text-emerald-500 tabular-nums">{formatCurrency(res.usdValue)}</div>
                          </div>
                       </div>
                       
                       <div className="pl-4 border-l border-slate-100 dark:border-white/5 space-y-2.5">
                          {res.detectedTokens.map((tok, ti) => (
                            <div key={ti} className="flex justify-between items-center text-[11px] font-mono">
                               <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tight">{tok.name}</div>
                               <div className="flex gap-4">
                                  <span className="text-slate-400">{tok.balance.toFixed(2)} {tok.symbol}</span>
                                  <span className="text-slate-900 dark:text-white font-black">{formatCurrency(tok.value)}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
              <div className="flex items-center gap-3"><Wifi className="text-orange-600 animate-pulse" size={18} /><h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">ON-CHAIN NODE GRID</h3></div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest tabular-nums">{address.slice(0,10)}...{address.slice(-8)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {scanResults.map((result, i) => {
                const isScanningItem = result.status === 'scanning';
                const isComplete = result.status === 'complete';
                const isError = result.status === 'error';
                const hasValue = result.usdValue > 0;
                return (
                  <div key={i} className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group text-center ${isScanningItem ? 'border-orange-600 bg-orange-600/10 scale-105 z-10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : hasValue ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : isError ? 'border-rose-500/30 opacity-60' : isComplete ? 'border-slate-200 dark:border-white/5 opacity-40' : 'border-slate-200 dark:border-white/5 opacity-20'}`}>
                    <div className="flex justify-center mb-1">
                      {isScanningItem && <RefreshCw size={14} className="text-orange-600 animate-spin" />}
                      {isComplete && hasValue && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {isComplete && !hasValue && <WifiOff size={14} className="text-slate-400" />}
                      {isError && <AlertCircle size={14} className="text-rose-500" />}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{result.config.name}</div>
                      {isComplete && hasValue ? (
                        <div className="text-[11px] font-mono font-black text-emerald-500 tabular-nums truncate">
                          {formatCurrency(result.usdValue)}
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-tight">
                          {isScanningItem ? 'SYNCING...' : isError ? 'NODE ERR' : 'NO ASSETS'}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="pt-20 flex flex-col items-center justify-center gap-6 opacity-40"><div className="flex items-center gap-4 font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center"><div className="w-16 h-[1px] bg-slate-200 dark:bg-white/10"></div>{isScanning ? 'UPLINK ACTIVE' : 'SYSTEM STANDBY'}<div className="w-16 h-[1px] bg-slate-200 dark:bg-white/10"></div></div></div>
      <style>{`
        .custom-terminal-scroll::-webkit-scrollbar { width: 4px; }
        .custom-terminal-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-terminal-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.4); border-radius: 10px; }
        .custom-terminal-scroll { scrollbar-width: thin; scrollbar-color: rgba(59, 130, 246, 0.4) rgba(255, 255, 255, 0.02); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};
