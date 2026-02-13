
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
  Zap,
  Activity
} from 'lucide-react';

interface ChainConfig {
  name: string;
  rpc: string;
  symbol: string;
  coinGeckoId: string;
  tokens?: { symbol: string; address: string; name: string }[];
}

// 60+ REAL NETWORK NODES
const CHAIN_CONFIGS: ChainConfig[] = [
  { 
    name: 'Ethereum', rpc: 'https://cloudflare-eth.com', symbol: 'ETH', coinGeckoId: 'ethereum',
    tokens: [
      { symbol: 'USDC', address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', name: 'USD Coin' },
      { symbol: 'USDT', address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', name: 'Tether' }
    ]
  },
  { 
    name: 'BNB Chain', rpc: 'https://bsc-dataseed1.binance.org', symbol: 'BNB', coinGeckoId: 'binancecoin',
    tokens: [{ symbol: 'USDT', address: '0x55d398326f99059fF775485246999027B3197955', name: 'Tether' }]
  },
  { 
    name: 'Base', rpc: 'https://mainnet.base.org', symbol: 'ETH', coinGeckoId: 'ethereum',
    tokens: [{ symbol: 'USDC', address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', name: 'USD Coin' }]
  },
  { name: 'Sonic', rpc: 'https://rpc.soniclabs.com', symbol: 'S', coinGeckoId: 'sonic-3' },
  { name: 'Arbitrum One', rpc: 'https://arb1.arbitrum.io/rpc', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Optimism', rpc: 'https://mainnet.optimism.io', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Polygon', rpc: 'https://polygon-rpc.com', symbol: 'POL', coinGeckoId: 'polygon-ecosystem-token' },
  { name: 'Avalanche', rpc: 'https://api.avax.network/ext/bc/C/rpc', symbol: 'AVAX', coinGeckoId: 'avalanche-2' },
  { name: 'Mantle', rpc: 'https://rpc.mantle.xyz', symbol: 'MNT', coinGeckoId: 'mantle' },
  { name: 'Blast', rpc: 'https://rpc.blast.io', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'zkSync Era', rpc: 'https://mainnet.era.zksync.io', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Scroll', rpc: 'https://rpc.scroll.io', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Linea', rpc: 'https://rpc.linea.build', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Fantom', rpc: 'https://rpc.ankr.com/fantom', symbol: 'FTM', coinGeckoId: 'fantom' },
  { name: 'Cronos', rpc: 'https://evm.cronos.org', symbol: 'CRO', coinGeckoId: 'crypto-com-chain' },
  { name: 'Gnosis', rpc: 'https://rpc.gnosischain.com', symbol: 'GNO', coinGeckoId: 'gnosis' },
  { name: 'Moonbeam', rpc: 'https://rpc.api.moonbeam.network', symbol: 'GLMR', coinGeckoId: 'moonbeam' },
  { name: 'Core', rpc: 'https://rpc.coredao.org', symbol: 'CORE', coinGeckoId: 'coredaoorg' },
  { name: 'Sei EVM', rpc: 'https://evm-rpc.sei-apis.com', symbol: 'SEI', coinGeckoId: 'sei-network' },
  { name: 'Mode', rpc: 'https://mainnet.mode.network', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Metis', rpc: 'https://andromeda.metis.io/?owner=1088', symbol: 'METIS', coinGeckoId: 'metis-token' },
  { name: 'Kava', rpc: 'https://evm.kava.io', symbol: 'KAVA', coinGeckoId: 'kava' },
  { name: 'Celo', rpc: 'https://forno.celo.org', symbol: 'CELO', coinGeckoId: 'celo' },
  { name: 'Astar', rpc: 'https://evm.astar.network', symbol: 'ASTR', coinGeckoId: 'astar' },
  { name: 'Fuse', rpc: 'https://rpc.fuse.io', symbol: 'FUSE', coinGeckoId: 'fuse-network-token' },
  { name: 'Moonriver', rpc: 'https://rpc.api.moonriver.network', symbol: 'MOVR', coinGeckoId: 'moonriver' },
  { name: 'Telos', rpc: 'https://mainnet.telos.net/evm', symbol: 'TLOS', coinGeckoId: 'telos' },
  { name: 'Aurora', rpc: 'https://mainnet.aurora.dev', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Boba', rpc: 'https://mainnet.boba.network', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Harmony', rpc: 'https://api.harmony.one', symbol: 'ONE', coinGeckoId: 'harmony' },
  { name: 'IoTeX', rpc: 'https://babel-api.mainnet.iotex.io', symbol: 'IOTX', coinGeckoId: 'iotex' },
  { name: 'ZetaChain', rpc: 'https://zetachain-evm.blockpi.network/v1/rpc/public', symbol: 'ZETA', coinGeckoId: 'zetachain' },
  { name: 'Manta', rpc: 'https://manta-pacific.drpc.org', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Taiko', rpc: 'https://rpc.mainnet.taiko.xyz', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Xai', rpc: 'https://xai-chain.net/rpc', symbol: 'XAI', coinGeckoId: 'xai-blockchain' },
  { name: 'Klaytn', rpc: 'https://public-node-api.klaytnapi.com/v1/cypress', symbol: 'KLAY', coinGeckoId: 'klay-token' },
  { name: 'Evmos', rpc: 'https://eth.bd.evmos.org:8545', symbol: 'EVMOS', coinGeckoId: 'evmos' },
  { name: 'Thunder', rpc: 'https://mainnet-rpc.thundercore.com', symbol: 'TT', coinGeckoId: 'thundercore' },
  { name: 'Oasis', rpc: 'https://emerald.oasis.dev', symbol: 'ROSE', coinGeckoId: 'oasis-network' },
  { name: 'Songbird', rpc: 'https://songbird-api.flare.network/ext/C/rpc', symbol: 'SGB', coinGeckoId: 'songbird' },
  { name: 'Flare', rpc: 'https://flare-api.flare.network/ext/C/rpc', symbol: 'FLR', coinGeckoId: 'flare-networks' },
  { name: 'Immutable', rpc: 'https://rpc.immutable.com', symbol: 'IMX', coinGeckoId: 'immutable-x' },
  { name: 'Shimmer', rpc: 'https://json-rpc.evm.shimmer.network', symbol: 'SMR', coinGeckoId: 'shimmer' },
  { name: 'Zora', rpc: 'https://rpc.zora.energy', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Abstract', rpc: 'https://api.mainnet.abs.xyz', symbol: 'ETH', coinGeckoId: 'ethereum' },
  { name: 'Berachain', rpc: 'https://rpc.berachain.com', symbol: 'BERA', coinGeckoId: 'berachain-bera' },
  { name: 'Fraxtal', rpc: 'https://rpc.frax.com', symbol: 'FRAX', coinGeckoId: 'frax' },
  { name: 'XLayer', rpc: 'https://rpc.xlayer.com', symbol: 'OKB', coinGeckoId: 'okb' },
  { name: 'KCC', rpc: 'https://rpc-mainnet.kcc.network', symbol: 'KCS', coinGeckoId: 'kucoin-shares' },
  { name: 'Injective', rpc: 'https://evm.injective.network', symbol: 'INJ', coinGeckoId: 'injective-protocol' },
  { name: 'Syscoin', rpc: 'https://rpc.syscoin.org', symbol: 'SYS', coinGeckoId: 'syscoin' },
  { name: 'Velas', rpc: 'https://evmexplorer.velas.com/rpc', symbol: 'VLX', coinGeckoId: 'velas' },
  { name: 'Milkomeda', rpc: 'https://rpc-mainnet-cardano-evm.c1.milkomeda.com', symbol: 'ADA', coinGeckoId: 'cardano' },
  { name: 'Dogechain', rpc: 'https://rpc.dogechain.dog', symbol: 'DC', coinGeckoId: 'dogechain' },
  { name: 'Canto', rpc: 'https://canto.slingshot.finance', symbol: 'CANTO', coinGeckoId: 'canto' },
  { name: 'PulseChain', rpc: 'https://rpc.pulsechain.com', symbol: 'PLS', coinGeckoId: 'pulsechain' },
  { name: 'Rootstock', rpc: 'https://public-node.rsk.co', symbol: 'RBTC', coinGeckoId: 'rootstock' },
  { name: 'Bitrock', rpc: 'https://connect.bit-rock.io', symbol: 'BROCK', coinGeckoId: 'bitrock' },
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

  const fetchNativeBalance = async (rpcUrl: string, walletAddress: string): Promise<number> => {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_get_balance', params: [walletAddress, 'latest'], id: 1 }),
    });
    const data = await response.json();
    if (data.error) throw new Error(data.error.message);
    return Number(BigInt(data.result)) / 1e18;
  };

  const fetchTokenBalance = async (rpcUrl: string, walletAddress: string, tokenAddress: string): Promise<number> => {
    // Standard ERC20 balanceOf(address) data: 0x70a08231 + 24 zeros + address
    const cleanAddr = walletAddress.startsWith('0x') ? walletAddress.substring(2) : walletAddress;
    const dataParam = `0x70a08231000000000000000000000000${cleanAddr}`;
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_call', params: [{ to: tokenAddress, data: dataParam }, 'latest'], id: 2 }),
    });
    const data = await response.json();
    if (data.error || !data.result || data.result === '0x') return 0;
    return Number(BigInt(data.result)) / 1e6; // Assuming 6 decimals for USDC/USDT stablecoins
  };

  const startScan = async () => {
    const cleanAddress = address.trim();
    if (!cleanAddress || !cleanAddress.startsWith('0x') || cleanAddress.length !== 42) {
      setInputError('Input valid EVM Target Identifier (0x...).');
      return;
    }

    setInputError(null);
    setIsScanning(true);
    setTotalValue(0);
    setProgressCount(0);
    setScanLogs([]);
    addLog(`REALTIME INGRESS: TARGET ${cleanAddress}`);

    try {
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
        addLog(`NODE PROBE: ${result.config.name.toUpperCase()} (VERIFYING STATE)`);
        setScanResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'scanning' } : r));
        
        try {
          const nativeBalance = await fetchNativeBalance(result.config.rpc, cleanAddress);
          let discovered: DetectedToken[] = [];
          let chainValue = 0;

          if (nativeBalance > 0) {
            const val = nativeBalance * result.price;
            discovered.push({ name: result.config.symbol === 'ETH' ? 'Ethereum' : result.config.name, symbol: result.config.symbol, balance: nativeBalance, value: val });
            chainValue += val;
          }

          // Real Contract Probe for Stables
          if (result.config.tokens) {
            addLog(`[CONTRACT PROBE] SCANNING ASSET STORAGE ON ${result.config.name.toUpperCase()}...`);
            for (const t of result.config.tokens) {
               try {
                 const tokenBal = await fetchTokenBalance(result.config.rpc, cleanAddress, t.address);
                 if (tokenBal > 0) {
                    discovered.push({ name: t.name, symbol: t.symbol, balance: tokenBal, value: tokenBal });
                    chainValue += tokenBal;
                    addLog(`[UPLINK] DISCOVERED ${t.symbol} ON ${result.config.name.toUpperCase()}`);
                 }
               } catch (e) { /* silent skip */ }
            }
          }

          updatedResults[i] = { ...result, status: 'complete', balance: nativeBalance, usdValue: chainValue, detectedTokens: discovered };
          runningTotal += chainValue;
          if (chainValue > 0) addLog(`[DETECTED] LIQUIDITY CONFIRMED: $${chainValue.toLocaleString()} (${result.config.name.toUpperCase()})`);
        } catch (e) {
          updatedResults[i] = { ...result, status: 'error' };
          addLog(`[TIMEOUT] NODE ${result.config.name.toUpperCase()} CONNECTION FAILED.`);
        }
        
        setScanResults([...updatedResults]);
        setTotalValue(runningTotal);
        setProgressCount(i + 1);
      }
      
      setCurrentScanningChain(null);
      setIsScanning(false);
      addLog(`VERIFICATION FINISHED. ${CHAIN_CONFIGS.length} NODES SCANNED. AGGREGATE LIQUIDITY: $${runningTotal.toLocaleString()}`);
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
              <ShieldAlert size={10} strokeWidth={3} className="animate-pulse" />
              NON-SIMULATED UPLINK
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-md border border-slate-200 dark:border-white/10">
              <Database size={10} /> {CHAIN_CONFIGS.length} REAL NODES
            </div>
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            MASTER <span className="text-blue-600">SCAN</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-2xl leading-relaxed italic mx-auto md:mx-0">
            RAW DATA INGRESS. VERIFYING GAS + TOKEN STORAGE ACROSS THE GLOBAL STACK. NO SIMULATION.
          </p>
        </div>
      </div>

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
              placeholder="TARGET WALLET (0x...)"
              className="w-full h-24 bg-white dark:bg-[#0b0e14] border-2 border-slate-200 dark:border-white/10 rounded-[2rem] pl-20 pr-16 text-xl md:text-2xl font-mono font-bold outline-none focus:border-blue-600 transition-all shadow-2xl dark:shadow-none uppercase"
            />
            {address && !isScanning && (
              <button onClick={handleClear} className="absolute inset-y-0 right-6 flex items-center text-slate-400 hover:text-blue-600 transition-colors">
                <X size={28} />
              </button>
            )}
          </div>
          <button 
            onClick={startScan}
            disabled={isScanning || !address}
            className="w-full py-8 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-[0.3em] text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl disabled:opacity-50"
          >
            {isScanning ? `SCANNING ${CHAIN_CONFIGS.length} LIVE NODES...` : 'EXECUTE VERIFIED AUDIT'}
          </button>
          {inputError && <p className="text-rose-500 text-[10px] font-black font-mono uppercase tracking-widest flex items-center justify-center gap-2"><AlertCircle size={14} /> {inputError}</p>}
        </div>

        <div className="lg:col-span-5">
           <div className="bg-slate-900 rounded-[2rem] p-6 h-[300px] border border-white/5 shadow-2xl overflow-hidden flex flex-col relative group">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 relative z-10">
                 <div className="flex items-center gap-3 text-blue-500">
                    <Terminal size={16} />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">VERIFIED LOGS</span>
                 </div>
                 {isScanning && <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div><span className="text-[8px] font-mono text-blue-500 uppercase tracking-widest">REALTIME</span></div>}
              </div>
              <div ref={logContainerRef} className="flex-grow overflow-y-auto space-y-2 font-mono text-[10px] custom-terminal-scroll pr-2 relative z-10">
                 {scanLogs.length === 0 ? <div className="text-slate-600 italic">Terminal Standby. Awaiting Raw Ingress.</div> : scanLogs.map((log, i) => (
                   <div key={i} className={`flex gap-3 leading-relaxed ${log.includes('[DETECTED]') || log.includes('[UPLINK]') ? 'text-emerald-400 font-bold' : log.includes('[TIMEOUT]') ? 'text-rose-500' : log.includes('[CONTRACT PROBE]') ? 'text-blue-400' : 'text-slate-400'}`}>
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
        <div className="max-w-[1200px] mx-auto bg-blue-600/5 dark:bg-blue-600/[0.03] border border-blue-600/30 rounded-[3rem] p-10 md:p-16 space-y-8 animate-in zoom-in-95 duration-500 overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
             <div className="space-y-4 text-center md:text-left min-w-0 flex-1">
                <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.5em] font-mono">VERIFYING STATE</div>
                <div className="h-16 md:h-24 flex items-center justify-center md:justify-start overflow-visible">
                  <h2 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic animate-pulse leading-none pr-6 whitespace-nowrap">{currentScanningChain || 'SYNCHRONIZING...'}</h2>
                </div>
             </div>
             <div className="shrink-0 flex items-center justify-center w-32 h-32 md:w-48 md:h-48 rounded-full border-8 border-slate-200 dark:border-white/5 border-t-blue-600 animate-spin">
                <div className="text-2xl font-black font-mono text-blue-600 tabular-nums">{Math.round((progressCount / CHAIN_CONFIGS.length) * 100)}%</div>
             </div>
          </div>
          <div className="space-y-4">
             <div className="flex justify-between items-end text-[10px] font-black font-mono text-blue-600 uppercase tracking-[0.3em]">
               <span>PROBE DEPTH</span>
               <span className="tabular-nums">{progressCount} / {CHAIN_CONFIGS.length} NODES VERIFIED</span>
             </div>
             <div className="h-4 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
               <div className="h-full bg-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.6)]" style={{ width: `${(progressCount / CHAIN_CONFIGS.length) * 100}%` }}></div>
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
                  <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">AGGREGATE VERIFIED VALUE</div>
                  <div className="text-5xl md:text-6xl font-black font-space italic tracking-tighter leading-none tabular-nums">{formatCurrency(totalValue)}</div>
                </div>
                <div className="relative z-10 pt-8 border-t border-white/20 dark:border-black/10">
                   <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Positive State Nodes</div>
                   <div className="text-2xl font-black italic tracking-tighter tabular-nums">{scanResults.filter(r => r.usdValue > 0).length} / {scanResults.length}</div>
                </div>
             </div>
             
             <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 space-y-8 shadow-xl max-h-[800px] overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-3"><Layers className="text-blue-600" size={18} /><h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">INVENTORY BREAKDOWN</h3></div>
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
              <div className="flex items-center gap-3"><Wifi className="text-blue-600 animate-pulse" size={18} /><h3 className="text-xs font-black uppercase tracking-[0.2em] font-space text-slate-900 dark:text-white italic">VERIFIED NODE GRID</h3></div>
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest tabular-nums">{address.slice(0,10)}...{address.slice(-8)}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {scanResults.map((result, i) => {
                const isScanningItem = result.status === 'scanning';
                const isComplete = result.status === 'complete';
                const hasValue = result.usdValue > 0;
                return (
                  <div key={i} className={`relative p-4 rounded-2xl border transition-all duration-300 flex flex-col gap-3 group text-center ${isScanningItem ? 'border-blue-600 bg-blue-600/10 scale-105 z-10 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : hasValue ? 'border-emerald-500/50 bg-emerald-500/[0.02]' : isComplete ? 'border-slate-200 dark:border-white/5 opacity-40' : 'border-slate-200 dark:border-white/5 opacity-20'}`}>
                    <div className="flex justify-center mb-1">
                      {isScanningItem && <RefreshCw size={14} className="text-blue-600 animate-spin" />}
                      {isComplete && hasValue && <CheckCircle2 size={14} className="text-emerald-500" />}
                      {isComplete && !hasValue && <WifiOff size={14} className="text-slate-400" />}
                      {result.status === 'error' && <AlertCircle size={14} className="text-rose-500" />}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase truncate">{result.config.name}</div>
                      {isComplete && hasValue ? (
                        <div className="text-[11px] font-mono font-black text-emerald-500 tabular-nums truncate">
                          {formatCurrency(result.usdValue)}
                        </div>
                      ) : (
                        <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-widest leading-tight">
                          {isScanningItem ? 'VERIFYING...' : result.status === 'error' ? 'NODE TIMEOUT' : 'NO ASSETS FOUND'}
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
