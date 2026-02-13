import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { 
  Search, 
  ShieldCheck, 
  Activity, 
  Globe, 
  TrendingUp, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ExternalLink,
  PieChart,
  Layers,
  Zap,
  CheckCircle2,
  BrainCircuit,
  Lock,
  Database,
  X,
  Coins
} from 'lucide-react';

interface ChainConfig {
  name: string;
  rpc: string;
  symbol: string;
  coinGeckoId: string;
  icon: string;
}

const CHAIN_CONFIGS: ChainConfig[] = [
  { name: 'Ethereum', rpc: 'https://cloudflare-eth.com', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { name: 'BNB Chain', rpc: 'https://bsc-dataseed.binance.org', symbol: 'BNB', coinGeckoId: 'binancecoin', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  { name: 'Solana (EVM)', rpc: 'https://api.mainnet-beta.solana.com', symbol: 'SOL', coinGeckoId: 'solana', icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { name: 'Sonic Mainnet', rpc: 'https://rpc.soniclabs.com', symbol: 'S', coinGeckoId: 'sonic-3', icon: 'https://sonic.xyz/favicon.ico' },
  { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4' },
  { name: 'Arbitrum One', rpc: 'https://arb1.arbitrum.io/rpc', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://cryptologos.cc/logos/arbitrum-arb-logo.png' },
  { name: 'Optimism', rpc: 'https://mainnet.optimism.io', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://cryptologos.cc/logos/optimism-ethereum-op-logo.png' },
  { name: 'Polygon', rpc: 'https://polygon-rpc.com', symbol: 'POL', coinGeckoId: 'polygon-ecosystem-token', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { name: 'Avalanche', rpc: 'https://api.avax.network/ext/bc/C/rpc', symbol: 'AVAX', coinGeckoId: 'avalanche-2', icon: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' },
  { name: 'Mantle', rpc: 'https://rpc.mantle.xyz', symbol: 'MNT', coinGeckoId: 'mantle', icon: 'https://cryptologos.cc/logos/mantle-mnt-logo.png' },
  { name: 'Blast', rpc: 'https://rpc.blast.io', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/mD83W4vW/blast.png' },
  { name: 'zkSync Era', rpc: 'https://mainnet.era.zksync.io', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/Xv0vG0mJ/zksync.png' },
  { name: 'Scroll', rpc: 'https://rpc.scroll.io', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/7LYK1Z6G/scroll.png' },
  { name: 'Linea', rpc: 'https://rpc.linea.build', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/8PzL7x9P/linea.png' },
  { name: 'Fantom', rpc: 'https://rpc.ankr.com/fantom', symbol: 'FTM', coinGeckoId: 'fantom', icon: 'https://cryptologos.cc/logos/fantom-ftm-logo.png' },
  { name: 'Cronos', rpc: 'https://evm.cronos.org', symbol: 'CRO', coinGeckoId: 'crypto-com-chain', icon: 'https://cryptologos.cc/logos/cronos-cro-logo.png' },
  { name: 'Metis', rpc: 'https://andromeda.metis.io/?owner=1088', symbol: 'METIS', coinGeckoId: 'metis-token', icon: 'https://cryptologos.cc/logos/metis-metis-logo.png' },
  { name: 'Celo', rpc: 'https://forno.celo.org', symbol: 'CELO', coinGeckoId: 'celo', icon: 'https://cryptologos.cc/logos/celo-celo-logo.png' },
  { name: 'Gnosis', rpc: 'https://rpc.gnosischain.com', symbol: 'GNO', coinGeckoId: 'gnosis', icon: 'https://cryptologos.cc/logos/gnosis-gno-logo.png' },
  { name: 'Moonbeam', rpc: 'https://rpc.api.moonbeam.network', symbol: 'GLMR', coinGeckoId: 'moonbeam', icon: 'https://cryptologos.cc/logos/moonbeam-glmr-logo.png' },
  { name: 'Kava', rpc: 'https://evm.kava.io', symbol: 'KAVA', coinGeckoId: 'kava', icon: 'https://cryptologos.cc/logos/kava-kava-logo.png' },
  { name: 'Core', rpc: 'https://rpc.coredao.org', symbol: 'CORE', coinGeckoId: 'coredaoorg', icon: 'https://i.postimg.cc/wT7mH7Yg/core.png' },
  { name: 'ZetaChain', rpc: 'https://zetachain-evm.blockpi.network/v1/rpc/public', symbol: 'ZETA', coinGeckoId: 'zetachain', icon: 'https://i.postimg.cc/XqcLzFv0/zeta.png' },
  { name: 'Sei EVM', rpc: 'https://evm-rpc.sei-apis.com', symbol: 'SEI', coinGeckoId: 'sei-network', icon: 'https://i.postimg.cc/mrhz3Wv7/sei.png' },
  { name: 'Mode', rpc: 'https://mainnet.mode.network', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/qM6V3q0x/mode.png' },
  { name: 'Fraxtal', rpc: 'https://rpc.frax.com', symbol: 'frxETH', coinGeckoId: 'frax-ether', icon: 'https://i.postimg.cc/zX39mXGv/fraxtal.png' },
  { name: 'Taiko', rpc: 'https://rpc.mainnet.taiko.xyz', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/zBT2D0S0/taiko.png' },
  { name: 'Manta Pacific', rpc: 'https://1rpc.io/manta', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/KzMsyVvF/manta.png' },
  { name: 'opBNB', rpc: 'https://opbnb-mainnet-rpc.bnbchain.org', symbol: 'BNB', coinGeckoId: 'binancecoin', icon: 'https://cryptologos.cc/logos/bnb-bnb-logo.png' },
  { name: 'Zora', rpc: 'https://rpc.zora.energy', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/Sxp2hC2w/zora.png' },
  { name: 'Flare', rpc: 'https://flare-api.flare.network/ext/C/rpc', symbol: 'FLR', coinGeckoId: 'flare-networks', icon: 'https://i.postimg.cc/Hkvh6V9p/flare.png' },
  { name: 'PulseChain', rpc: 'https://rpc.pulsechain.com', symbol: 'PLS', coinGeckoId: 'pulsechain', icon: 'https://i.postimg.cc/QMcM1vG1/pulse.png' },
  { name: 'Lisk', rpc: 'https://rpc.api.lisk.com', symbol: 'LSK', coinGeckoId: 'lisk', icon: 'https://cryptologos.cc/logos/lisk-lsk-logo.png' },
  { name: 'X Layer', rpc: 'https://xlayerrpc.okx.com', symbol: 'OKB', coinGeckoId: 'okb', icon: 'https://cryptologos.cc/logos/okb-okb-logo.png' },
  { name: 'Kaia', rpc: 'https://public-en.node.kaia.io', symbol: 'KAIA', coinGeckoId: 'klay-token', icon: 'https://i.postimg.cc/zX39mXGv/fraxtal.png' },
  { name: 'Telos', rpc: 'https://mainnet.telos.net/evm', symbol: 'TLOS', coinGeckoId: 'telos', icon: 'https://cryptologos.cc/logos/telos-tlos-logo.png' },
  { name: 'Harmony', rpc: 'https://api.harmony.one', symbol: 'ONE', coinGeckoId: 'harmony', icon: 'https://cryptologos.cc/logos/harmony-one-logo.png' },
  { name: 'IoTeX', rpc: 'https://babel-api.mainnet.iotex.io', symbol: 'IOTX', coinGeckoId: 'iotex', icon: 'https://cryptologos.cc/logos/iotex-iotx-logo.png' },
  // BTC L2s
  { name: 'Merlin Chain', rpc: 'https://rpc.merlinchain.io', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://i.postimg.cc/8PzL7x9P/linea.png' },
  { name: 'BOB', rpc: 'https://rpc.gobob.xyz', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/mD83W4vW/blast.png' },
  { name: 'Bitlayer', rpc: 'https://rpc.bitlayer.org', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://i.postimg.cc/wT7mH7Yg/core.png' },
  { name: 'Botanix', rpc: 'https://node.botanixlabs.com', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
];

interface ChainScanResult {
  config: ChainConfig;
  status: 'pending' | 'scanning' | 'complete' | 'error';
  balance: number;
  usdValue: number;
  price: number;
  marketCap: number;
  error?: string;
}

export const WalletChecker: React.FC = () => {
  const [address, setAddress] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [scanResults, setScanResults] = useState<ChainScanResult[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [inputError, setInputError] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const fetchBalance = async (rpcUrl: string, walletAddress: string): Promise<number> => {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'eth_getBalance',
          params: [walletAddress, 'latest'],
          id: 1,
        }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error.message);
      const wei = BigInt(data.result);
      return Number(wei) / 1e18;
    } catch (e) {
      return 0;
    }
  };

  const startScan = async () => {
    const cleanAddress = address.trim();
    if (!cleanAddress || !cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
      setInputError('Please provide a valid EVM wallet address (0x...).');
      return;
    }

    setInputError(null);
    setIsScanning(true);
    setAiAnalysis(null);
    setTotalValue(0);

    try {
      // 1. Fetch Market Data for Sorting
      const markets = await coinGeckoProxy.getTopMarkets(undefined, true);
      const marketDataMap: Record<string, { price: number; mcap: number }> = {};
      
      CHAIN_CONFIGS.forEach(c => {
        const market = markets.find(m => m.id === c.coinGeckoId);
        marketDataMap[c.name] = {
          price: market?.current_price || 0,
          mcap: market?.market_cap || 0
        };
      });

      // 2. Prepare Results sorted by Market Cap
      const sortedConfigs = [...CHAIN_CONFIGS].sort((a, b) => {
        const mcapA = marketDataMap[a.name]?.mcap || 0;
        const mcapB = marketDataMap[b.name]?.mcap || 0;
        return mcapB - mcapA;
      });

      const initialResults: ChainScanResult[] = sortedConfigs.map(config => ({
        config,
        status: 'pending',
        balance: 0,
        usdValue: 0,
        price: marketDataMap[config.name]?.price || 0,
        marketCap: marketDataMap[config.name]?.mcap || 0
      }));
      setScanResults(initialResults);

      // 3. Scan Sequentially
      const updatedResults = [...initialResults];
      let runningTotal = 0;

      for (let i = 0; i < updatedResults.length; i++) {
        const result = updatedResults[i];
        setScanResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'scanning' } : r));
        
        await new Promise(r => setTimeout(r, 40));

        try {
          const balance = await fetchBalance(result.config.rpc, cleanAddress);
          const usdValue = balance * result.price;
          
          updatedResults[i] = {
            ...result,
            status: 'complete',
            balance,
            usdValue
          };
          runningTotal += usdValue;
        } catch (e) {
          updatedResults[i] = { ...result, status: 'error', error: 'RPC Error' };
        }

        setScanResults([...updatedResults]);
        setTotalValue(runningTotal);
      }

      setIsScanning(false);
      triggerAiAudit(updatedResults, runningTotal);

    } catch (err) {
      setInputError("Node gateway interrupted. Please try again.");
      setIsScanning(false);
    }
  };

  const triggerAiAudit = async (results: ChainScanResult[], total: number) => {
    setIsAuditing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const summary = results
        .filter(r => r.balance > 0.0001)
        .map(r => `${r.balance.toFixed(4)} ${r.config.symbol} on ${r.config.name}`)
        .join(', ');

      if (!summary) {
        setAiAnalysis("No native liquidity detected on scanned networks. The terminal suggests monitoring non-native token exposure via secondary explorers.");
        return;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze wallet ${address}. Assets: ${summary}. Total Native USD: $${total.toFixed(2)}. 
        Give a 3-sentence professional, aggressive "Shizzy" analysis. 
        Focus on which ecosystem they are most heavy in and give one strategic alpha tip.`,
      });

      setAiAnalysis(response.text || "Intelligence feed offline.");
    } catch (err) {
      setAiAnalysis("AI link offline. Raw node data is displayed below.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleClear = () => {
    setAddress('');
    setInputError(null);
    setScanResults([]);
    setTotalValue(0);
    setAiAnalysis(null);
  };

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: val < 1 ? 4 : 2 }).format(val);

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6 w-full text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <Database size={10} strokeWidth={3} className="animate-pulse" />
              {CHAIN_CONFIGS.length} NODES ORDERED BY MCAP
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <Globe size={10} />
              UNIVERSAL EVM INDEXER
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            MASTER <span className="text-blue-600">SCAN</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl leading-relaxed italic mx-auto md:mx-0">
            High-signal wallet intelligence. Ordered by governance dominance. Direct node-to-terminal synchronization for real-time architectural mapping.
          </p>
        </div>
      </div>

      {/* INPUT & ACTION */}
      <div className="max-w-[800px] mx-auto space-y-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
            <Search size={24} />
          </div>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isScanning && startScan()}
            placeholder="Enter EVM Wallet Address (0x...)"
            className="w-full h-20 md:h-24 bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 rounded-2xl md:rounded-[2.5rem] pl-20 pr-16 text-lg md:text-xl font-mono font-bold outline-none focus:border-blue-600 transition-all shadow-2xl dark:shadow-none"
          />
          {address && !isScanning && (
            <button 
              onClick={handleClear}
              className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-rose-500 transition-colors active:scale-90"
              title="Clear Terminal"
            >
              <X size={28} />
            </button>
          )}
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={startScan}
            disabled={isScanning || !address}
            className="w-full max-w-[400px] py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] md:text-[14px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/10 disabled:opacity-50"
          >
            {isScanning ? `SYNCING DOMINANCE NODES...` : 'PULL GLOBAL BLOCKCHAIN DATA'}
          </button>
          
          {inputError && (
            <p className="text-rose-500 text-[10px] font-black font-mono uppercase tracking-widest flex items-center justify-center gap-2">
              <AlertCircle size={14} /> {inputError}
            </p>
          )}
        </div>
      </div>

      {/* ANALYSIS BOX */}
      {(aiAnalysis || isAuditing) && (
        <div className="bg-blue-600/5 dark:bg-blue-500/[0.02] border border-blue-500/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
           <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
              <BrainCircuit size={300} strokeWidth={1} />
           </div>
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
              <div className={`shrink-0 p-6 rounded-3xl bg-blue-600 text-white shadow-2xl ${isAuditing ? 'animate-pulse' : ''}`}>
                 <BrainCircuit size={48} />
              </div>
              <div className="space-y-4 text-center md:text-left">
                 <div className="flex items-center justify-center md:justify-start gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">GLOBAL PORTFOLIO AUDIT</span>
                 </div>
                 <p className="text-xl md:text-3xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic max-w-4xl font-space">
                   {isAuditing ? `Synthesizing ${CHAIN_CONFIGS.length}-chain data ordered by market dominance...` : aiAnalysis}
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* RESULTS GRID */}
      {scanResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 dark:bg-white rounded-[3rem] p-10 text-white dark:text-black shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                  <TrendingUp size={240} strokeWidth={4} />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">AGGREGATE NATIVE VALUE</div>
                  <div className="text-5xl md:text-6xl font-black font-space italic tracking-tighter leading-none">
                    {formatCurrency(totalValue)}
                  </div>
                </div>
                <div className="relative z-10 pt-8 border-t border-white/20 dark:border-black/10">
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Active Networks Detected</div>
                   <div className="text-2xl font-black">{scanResults.filter(r => r.balance > 0.0001).length} / {scanResults.length}</div>
                </div>
             </div>

             <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl">
                <div className="flex items-center gap-3">
                  <Layers className="text-blue-600" size={18} />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white">HIGHEST BALANCES</h3>
                </div>
                <div className="space-y-6">
                  {scanResults.filter(r => r.balance > 0.0001).sort((a,b) => b.usdValue - a.usdValue).slice(0, 5).map((res, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <img src={res.config.icon} alt={res.config.symbol} className="w-8 h-8 object-contain" />
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 dark:text-white">{res.config.symbol}</span>
                             <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{res.config.name}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-black font-mono text-slate-900 dark:text-white">{formatCurrency(res.usdValue)}</div>
                       </div>
                    </div>
                  ))}
                  {scanResults.filter(r => r.balance > 0.0001).length === 0 && !isScanning && (
                    <p className="text-[10px] text-slate-400 uppercase font-bold text-center py-4 italic">No native balances found.</p>
                  )}
                </div>
             </div>
          </div>

          <div className="lg:col-span-8">
             <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] overflow-hidden shadow-2xl h-full flex flex-col transition-all duration-700">
                <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50/50 dark:bg-white/[0.01]">
                   <h3 className="text-lg font-black uppercase tracking-widest font-space text-slate-900 dark:text-white italic">{CHAIN_CONFIGS.length}-CHAIN LIVE STATE</h3>
                   <button onClick={startScan} disabled={isScanning} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-400 hover:text-blue-600 transition-all">
                      <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
                   </button>
                </div>
                
                <div className="flex-grow overflow-x-auto max-h-[600px] scrollbar-thin">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/[0.02] text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 border-b border-slate-100 dark:border-white/5 sticky top-0 z-10 backdrop-blur-md">
                        <th className="px-10 py-6">Network (by dominance)</th>
                        <th className="px-10 py-6">Status</th>
                        <th className="px-10 py-6 text-right">Balance</th>
                        <th className="px-10 py-6 text-right">USD Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {scanResults.map((res, i) => (
                        <tr key={i} className={`hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all group ${res.status === 'scanning' ? 'bg-blue-600/5' : ''}`}>
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <img src={res.config.icon} alt={res.config.name} className="w-8 h-8 object-contain rounded-full bg-black/10 p-1" />
                              <div className="flex flex-col">
                                <span className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white">
                                  {res.config.name}
                                </span>
                                <span className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-widest">MCAP: {new Intl.NumberFormat('en-US', { notation: 'compact' }).format(res.marketCap)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-10 py-6">
                             {res.status === 'scanning' ? (
                               <span className="flex items-center gap-2 text-[9px] font-black text-blue-600 animate-pulse">
                                 <RefreshCw size={10} className="animate-spin" /> SYNCING
                               </span>
                             ) : res.status === 'complete' ? (
                               <span className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                                 <CheckCircle2 size={10} className="text-blue-600" /> LIVE
                               </span>
                             ) : res.status === 'error' ? (
                               <span className="text-[9px] font-black text-rose-500 uppercase">OFFLINE</span>
                             ) : (
                               <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase">QUEUED</span>
                             )}
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
                              {res.balance > 0.00001 ? res.balance.toFixed(4) : '0.0000'} <span className="text-[9px] opacity-40">{res.config.symbol}</span>
                            </div>
                          </td>
                          <td className="px-10 py-6 text-right">
                            <div className={`text-sm font-black font-mono tracking-tighter ${res.usdValue > 0.01 ? 'text-blue-600' : 'text-slate-300 dark:text-slate-700'}`}>
                              {formatCurrency(res.usdValue)}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-10 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 bg-slate-50/30 dark:bg-white/[0.005]">
                   <div className="flex items-center gap-4 text-slate-400">
                      <Lock size={16} />
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest italic leading-relaxed">
                        UNIVERSAL NODE LINK SECURE • DOMINANCE-ORDERED SYNCHRONIZATION
                      </span>
                   </div>
                   <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                      VIEW FULL DEFI INVENTORY <ExternalLink size={14} />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* FOOTER DIAGNOSTIC */}
      <div className="pt-20 flex flex-col items-center gap-8 opacity-40">
        <div className="flex items-center gap-4">
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
           <Globe size={20} className="text-blue-600" />
           <div className="w-12 h-[1px] bg-slate-300 dark:bg-white/10"></div>
        </div>
        <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-[0.5em] text-center italic leading-relaxed">
          UNIVERSAL BLOCKCHAIN INDEXER • {CHAIN_CONFIGS.length} NODES ACTIVE • DOMINANCE VERIFIED
        </p>
      </div>
    </div>
  );
};