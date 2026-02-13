
import React, { useState, useEffect, useRef } from 'react';
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
  Lock,
  Database,
  X,
  Coins,
  Shield,
  SortAsc,
  Cpu,
  Wifi,
  WifiOff,
  Terminal,
  ChevronRight
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
  { name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://avatars.githubusercontent.com/u/108554348?v=4' },
  { name: 'Sonic Mainnet', rpc: 'https://rpc.soniclabs.com', symbol: 'S', coinGeckoId: 'sonic-3', icon: 'https://sonic.xyz/favicon.ico' },
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
  { name: 'Merlin Chain', rpc: 'https://rpc.merlinchain.io', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://i.postimg.cc/8PzL7x9P/linea.png' },
  { name: 'BOB', rpc: 'https://rpc.gobob.xyz', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/mD83W4vW/blast.png' },
  { name: 'Bitlayer', rpc: 'https://rpc.bitlayer.org', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://i.postimg.cc/wT7mH7Yg/core.png' },
  { name: 'Botanix', rpc: 'https://node.botanixlabs.com', symbol: 'BTC', coinGeckoId: 'bitcoin', icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { name: 'Cyber', rpc: 'https://cyber-mainnet.alt.technology', symbol: 'CYBER', coinGeckoId: 'cyberconnect', icon: 'https://i.postimg.cc/gjFGnVCS/5D00FCFA-101B-4B9A-9E08-03F617D4BA2C.png' },
  { name: 'Astar zkEVM', rpc: 'https://rpc.startale.com/astar-zkevm', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://cryptologos.cc/logos/astar-astr-logo.png' },
  { name: 'Immutable zkEVM', rpc: 'https://rpc.immutable.com', symbol: 'IMX', coinGeckoId: 'immutable-x', icon: 'https://cryptologos.cc/logos/immutable-x-imx-logo.png' },
  { name: 'Polygon zkEVM', rpc: 'https://zkevm-rpc.com', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { name: 'Gravity', rpc: 'https://rpc.gravity.xyz', symbol: 'G', coinGeckoId: 'gravity-2', icon: 'https://i.postimg.cc/mrhz3Wv7/sei.png' },
  { name: 'Xai', rpc: 'https://xai-chain.net/rpc', symbol: 'XAI', coinGeckoId: 'xai-blockchain', icon: 'https://i.postimg.cc/qM6V3q0x/mode.png' },
  { name: 'Neon EVM', rpc: 'https://neon-proxy-mainnet.solana.p2p.org', symbol: 'NEON', coinGeckoId: 'neon', icon: 'https://i.postimg.cc/mD83W4vW/blast.png' },
  { name: 'Shape', rpc: 'https://mainnet.shape.network', symbol: 'ETH', coinGeckoId: 'ethereum', icon: 'https://i.postimg.cc/Sxp2hC2w/zora.png' },
  { name: 'Etherlink', rpc: 'https://node.etherlink.com', symbol: 'XTZ', coinGeckoId: 'tezos', icon: 'https://cryptologos.cc/logos/tezos-xtz-logo.png' },
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
    setScanLogs(prev => [...prev.slice(-49), `[${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}] ${msg}`]);
  };

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
      setInputError('Provide valid 0x identifier.');
      return;
    }

    setInputError(null);
    setIsScanning(true);
    setTotalValue(0);
    setProgressCount(0);
    setScanLogs([]);
    addLog(`INITIATING GLOBAL ARCHITECTURAL SCAN FOR ${cleanAddress.slice(0, 10)}...`);

    try {
      const markets = await coinGeckoProxy.getTopMarkets(undefined, true);
      const marketDataMap: Record<string, { price: number; mcap: number }> = {};
      
      CHAIN_CONFIGS.forEach(c => {
        const market = markets.find(m => m.id === c.coinGeckoId);
        marketDataMap[c.name] = {
          price: market?.current_price || 0,
          mcap: market?.market_cap || 0
        };
      });

      const sortedConfigs = [...CHAIN_CONFIGS].sort((a, b) => a.name.localeCompare(b.name));

      const initialResults: ChainScanResult[] = sortedConfigs.map(config => ({
        config,
        status: 'pending',
        balance: 0,
        usdValue: 0,
        price: marketDataMap[config.name]?.price || 0,
        marketCap: marketDataMap[config.name]?.mcap || 0
      }));
      setScanResults(initialResults);

      const updatedResults = [...initialResults];
      let runningTotal = 0;

      for (let i = 0; i < updatedResults.length; i++) {
        const result = updatedResults[i];
        setCurrentScanningChain(result.config.name);
        addLog(`PINGING NODE: ${result.config.name}...`);
        
        setScanResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'scanning' } : r));
        await new Promise(r => setTimeout(r, 60)); 

        try {
          const balance = await fetchBalance(result.config.rpc, cleanAddress);
          const usdValue = balance * result.price;
          updatedResults[i] = { ...result, status: 'complete', balance, usdValue };
          runningTotal += usdValue;
          
          if (balance > 0.0001) {
             addLog(`[DETECTED] ${balance.toFixed(4)} ${result.config.symbol} ON ${result.config.name.toUpperCase()}`);
          }
        } catch (e) {
          updatedResults[i] = { ...result, status: 'error', error: 'RPC Error' };
          addLog(`[ERROR] ${result.config.name} RPC UNREACHABLE`);
        }

        setScanResults([...updatedResults]);
        setTotalValue(runningTotal);
        setProgressCount(i + 1);
      }

      setCurrentScanningChain(null);
      addLog(`SCAN COMPLETE. TOTAL NATIVE VALUE DETECTED: $${runningTotal.toLocaleString()}`);
      setIsScanning(false);

    } catch (err) {
      addLog(`[FATAL] GLOBAL NODE SYNC INTERRUPTED.`);
      setInputError("Node sync interrupted.");
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
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6 w-full text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <Database size={10} strokeWidth={3} className="animate-pulse" />
              {CHAIN_CONFIGS.length} LIVE NODES MAPPED
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <SortAsc size={10} />
              ALPHABETICAL ORDERING
            </div>
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            MASTER <span className="text-blue-600">SCAN</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl leading-relaxed italic mx-auto md:mx-0">
            Real-time direct-to-node intelligence. Mapping portfolio dominance across the global architectural stack.
          </p>
        </div>
      </div>

      {/* INPUT & ACTION - STABILIZED GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-[1200px] mx-auto items-stretch">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
           <div className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center text-slate-400 group-focus-within:text-blue-600 transition-colors pointer-events-none">
              <Search size={24} />
            </div>
            <input 
              type="text" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isScanning && startScan()}
              placeholder="Enter Wallet (0x...)"
              className="w-full h-20 md:h-24 bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 rounded-2xl md:rounded-[2.5rem] pl-20 pr-16 text-lg md:text-xl font-mono font-bold outline-none focus:border-blue-600 transition-all shadow-2xl dark:shadow-none"
            />
            {address && !isScanning && (
              <button 
                onClick={handleClear}
                className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-blue-600 transition-colors active:scale-90"
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
              className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.2em] text-[12px] md:text-[14px] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/10 disabled:opacity-50"
            >
              {isScanning ? `NODE SYNC ACTIVE...` : 'PULL GLOBAL BLOCKCHAIN DATA'}
            </button>
            
            {inputError && (
              <p className="text-rose-500 text-[10px] font-black font-mono uppercase tracking-widest flex items-center justify-center gap-2">
                <AlertCircle size={14} /> {inputError}
              </p>
            )}
          </div>
        </div>

        {/* LIVE SCAN LOG - CONSTRAINED HEIGHT WITH VISIBLE SCROLL */}
        <div className="lg:col-span-5">
           <div className="bg-slate-900 rounded-[2rem] p-6 h-[260px] md:h-[300px] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                 <div className="flex items-center gap-3 text-blue-500">
                    <Terminal size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">SYSTEM LOGS</span>
                 </div>
                 {isScanning && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div><span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest">REALTIME</span></div>}
              </div>
              <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-2 font-mono text-[10px] custom-terminal-scroll pr-2">
                 {scanLogs.length === 0 ? (
                   <div className="text-slate-600 italic">Terminal idle. Awaiting node uplink...</div>
                 ) : (
                   scanLogs.map((log, i) => (
                     <div key={i} className={`flex gap-3 leading-relaxed ${log.includes('[DETECTED]') ? 'text-emerald-400 font-bold' : log.includes('[ERROR]') ? 'text-rose-500' : 'text-slate-400'}`}>
                        <span className="shrink-0 text-slate-600 tabular-nums">{i + 1}.</span>
                        <span>{log}</span>
                     </div>
                   ))
                 )}
                 <div ref={logEndRef} />
              </div>
           </div>
        </div>
      </div>

      {/* SCANNING HUD - STABILIZED CONTAINER WITH NO TRUNCATION */}
      <div className="max-w-[1200px] mx-auto">
        {isScanning ? (
          <div className="bg-blue-600/5 dark:bg-blue-600/[0.03] border border-blue-600/30 rounded-[3rem] p-10 md:p-16 space-y-8 animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="space-y-4 text-center md:text-left min-w-0 flex-1">
                  <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] font-mono">CURRENTLY PINGING NODE</div>
                  <div className="h-16 md:h-24 flex items-center justify-center md:justify-start overflow-visible">
                    <h2 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic animate-pulse leading-none pr-6 whitespace-nowrap">
                       {currentScanningChain || 'INITIALIZING...'}
                    </h2>
                  </div>
               </div>
               <div className="shrink-0 flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-slate-200 dark:border-white/5 border-t-blue-600 animate-spin">
                  <div className="text-2xl font-black font-mono text-blue-600 tabular-nums">{Math.round((progressCount / CHAIN_CONFIGS.length) * 100)}%</div>
               </div>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-end text-[10px] font-black font-mono text-blue-600 uppercase tracking-[0.3em]">
                 <span>GLOBAL BLOCKCHAIN MAPPING</span>
                 <span className="tabular-nums">{progressCount} / {CHAIN_CONFIGS.length} NODES</span>
               </div>
               <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
                 <div 
                   className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.6)]"
                   style={{ width: `${(progressCount / CHAIN_CONFIGS.length) * 100}%` }}
                 ></div>
               </div>
            </div>
          </div>
        ) : (
          <div className="h-0 opacity-0 pointer-events-none transition-all duration-500"></div>
        )}
      </div>

      {/* RESULTS GRID */}
      {scanResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
             <div className="bg-slate-900 dark:bg-white rounded-[3rem] p-10 text-white dark:text-black shadow-2xl space-y-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                  <TrendingUp size={240} strokeWidth={4} />
                </div>
                <div className="relative z-10 space-y-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">AGGREGATE VALUE</div>
                  <div className="text-5xl md:text-6xl font-black font-space italic tracking-tighter leading-none tabular-nums">
                    {formatCurrency(totalValue)}
                  </div>
                </div>
                <div className="relative z-10 pt-8 border-t border-white/20 dark:border-black/10">
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Active Nodes Detected</div>
                   <div className="text-2xl font-black italic tracking-tighter tabular-nums">{scanResults.filter(r => r.balance > 0.0001).length} / {scanResults.length}</div>
                </div>
             </div>

             <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl">
                <div className="flex items-center gap-3">
                  <Layers className="text-blue-600" size={18} />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">PORTFOLIO MIX</h3>
                </div>
                <div className="space-y-6">
                  {scanResults.filter(r => r.balance > 0.0001).sort((a,b) => b.usdValue - a.usdValue).slice(0, 5).map((res, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <img src={res.config.icon} alt={res.config.symbol} className="w-8 h-8 object-contain" />
                          <div className="flex flex-col">
                             <span className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter">{res.config.symbol}</span>
                             <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">{res.config.name}</span>
                          </div>
                       </div>
                       <div className="text-right">
                          <div className="text-sm font-black font-mono text-slate-900 dark:text-white tabular-nums">{formatCurrency(res.usdValue)}</div>
                       </div>
                    </div>
                  ))}
                  {scanResults.filter(r => r.balance > 0.0001).length === 0 && (
                    <div className="text-center py-4 opacity-40 italic text-xs font-mono">No native assets found.</div>
                  )}
                </div>
             </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
              <div className="flex items-center gap-3">
                <Wifi className="text-blue-600 animate-pulse" size={18} />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">NETWORK INTEL GRID</h3>
              </div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest tabular-nums">{address.slice(0,6)}...{address.slice(-4)}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
              {scanResults.map((result, i) => {
                const isScanningItem = result.status === 'scanning';
                const isComplete = result.status === 'complete';
                const hasBalance = result.balance > 0.0001;

                return (
                  <div 
                    key={i} 
                    className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group ${
                      isScanningItem ? 'border-blue-600 bg-blue-600/10 shadow-[0_0_25px_rgba(37,99,235,0.4)] scale-105 z-10' :
                      hasBalance ? 'border-emerald-500/50 bg-emerald-500/[0.02]' :
                      isComplete ? 'border-slate-200 dark:border-white/5 opacity-40' :
                      'border-slate-200 dark:border-white/5 opacity-20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <img src={result.config.icon} alt={result.config.symbol} className={`w-6 h-6 object-contain transition-transform ${isScanningItem ? 'scale-125 animate-pulse' : ''}`} />
                      <div className="flex gap-1">
                        {isScanningItem && <RefreshCw size={12} className="text-blue-600 animate-spin" />}
                        {isComplete && hasBalance && <CheckCircle2 size={12} className="text-emerald-500" />}
                        {isComplete && !hasBalance && <WifiOff size={12} className="text-slate-400" />}
                      </div>
                    </div>
                    
                    <div className="space-y-0.5">
                      <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{result.config.name}</div>
                      {isComplete && hasBalance ? (
                        <div className="text-[11px] font-mono font-black text-emerald-500 tabular-nums">
                          {result.balance.toFixed(4)} {result.config.symbol}
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase">
                          {isScanningItem ? 'SYNCING...' : isComplete ? 'EMPTY' : 'WAITING'}
                        </div>
                      )}
                    </div>

                    {isScanningItem && (
                      <div className="absolute bottom-0 left-0 w-full h-[3px] overflow-hidden rounded-b-2xl">
                        <div className="h-full bg-blue-600 animate-marquee"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="pt-20 flex flex-col items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-4 font-mono text-[9px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-16 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          {isScanning ? 'NODE SYNC IN PROGRESS' : 'TERMINAL IDLE'}
          <div className="w-16 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
      </div>

      <style>{`
        @keyframes marquee-scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-marquee {
          animation: marquee-scan 1s linear infinite;
        }
        
        .custom-terminal-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .custom-terminal-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
        }
        .custom-terminal-scroll::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 10px;
        }
        .custom-terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.6);
        }
        .custom-terminal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(59, 130, 246, 0.4) rgba(255, 255, 255, 0.02);
        }
      `}</style>
    </div>
  );
};
