import React, { useState, useEffect } from 'react';
import { Trash2, Plus, RefreshCw, Download, ChevronDown, ChevronRight, AlertCircle, Copy, CheckCircle2, Shield } from 'lucide-react';

interface WalletEntry {
  id: string;
  nickname: string;
  address: string;
}

interface SubnetHolding {
  netuid: number;
  name: string;
  alphaQuantity: number;
  alphaPriceTao: number;
  valueTao: number;
  valueUsd: number;
  walletsHolding: { nickname: string; address: string; quantity: number }[];
}

interface WalletResult {
  address: string;
  nickname: string;
  liquidTao: number;
  alphaValueTao: number;
  totalValueTao: number;
  totalValueUsd: number;
  numPositions: number;
  error?: string;
  holdings: {
    netuid: number;
    name: string;
    quantity: number;
    priceTao: number;
  }[];
}

const SS58_REGEX = /^5[1-9A-HJ-NP-Za-km-z]{47}$/;
const MAX_WALLETS = 25;

export const MassWalletCheck: React.FC = () => {
  const [wallets, setWallets] = useState<WalletEntry[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WalletResult[] | null>(null);
  const [sortField, setSortField] = useState<'valueTao' | 'valueUsd' | 'netuid'>('valueTao');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSubnets, setExpandedSubnets] = useState<Set<number>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [showUsd, setShowUsd] = useState(false);
  const [updatingAddress, setUpdatingAddress] = useState<string | null>(null);

  const [taoPrice, setTaoPrice] = useState<number>(0);

  useEffect(() => {
    // Fetch real TAO price
    fetch('https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=TAO-USDT')
      .then(res => res.json())
      .then(data => {
        if (data && data.data && data.data.price) {
          setTaoPrice(parseFloat(data.data.price));
        }
      })
      .catch(console.error);

    const saved = localStorage.getItem('mass_wallet_check_wallets');
    if (saved) {
      try {
        setWallets(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved wallets');
      }
    }
  }, []);

  const saveWallets = (newWallets: WalletEntry[]) => {
    setWallets(newWallets);
    localStorage.setItem('mass_wallet_check_wallets', JSON.stringify(newWallets));
  };

  const addEmptyWallet = () => {
    if (wallets.length >= MAX_WALLETS) return;
    saveWallets([...wallets, { id: crypto.randomUUID(), nickname: '', address: '' }]);
  };

  const removeWallet = (id: string) => {
    saveWallets(wallets.filter(w => w.id !== id));
  };

  const updateWallet = (id: string, field: keyof WalletEntry, value: string) => {
    saveWallets(wallets.map(w => w.id === id ? { ...w, [field]: value } : w));
  };

  const handleBulkAdd = () => {
    const lines = bulkInput.split('\n').map(l => l.trim()).filter(l => l);
    const newWallets = [...wallets];
    let added = 0;
    
    for (const line of lines) {
      if (newWallets.length >= MAX_WALLETS) break;
      
      // Simple parse, try to extract address
      const parts = line.split(/[,\s]+/).filter(Boolean);
      let address = '';
      let nickname = '';
      
      for (const p of parts) {
        if (SS58_REGEX.test(p)) {
          address = p;
        } else if (!nickname) {
          nickname = p;
        }
      }
      
      if (!address && SS58_REGEX.test(line)) {
        address = line;
      }
      
      if (address && !newWallets.find(w => w.address === address)) {
        newWallets.push({
          id: crypto.randomUUID(),
          nickname: nickname || `Wallet ${newWallets.length + 1}`,
          address
        });
        added++;
      }
    }
    
    saveWallets(newWallets);
    setBulkInput('');
    setShowBulk(false);
  };

  const isValidAddress = (addr: string) => SS58_REGEX.test(addr);

  const checkWallets = async () => {
    if (wallets.length === 0) return;
    setIsLoading(true);
    
    const validWallets = wallets.filter(w => isValidAddress(w.address));
    const newResults: WalletResult[] = [];
    
    for (const wallet of wallets) {
      if (!isValidAddress(wallet.address)) {
        newResults.push({
          address: wallet.address,
          nickname: wallet.nickname,
          liquidTao: 0,
          alphaValueTao: 0,
          totalValueTao: 0,
          totalValueUsd: 0,
          numPositions: 0,
          holdings: [],
          error: 'Invalid address format'
        });
        continue;
      }

      // Hit our backend API
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: [wallet.address] })
      });
      
      let liquidTao = 0;
      let alphaValueTao = 0;
      let holdings = [];
      let apiError = '';

      if (response.ok) {
        const data = await response.json();
        const wData = data[0];
        
        if (wData.error) {
           apiError = wData.error;
        } else {
           liquidTao = wData.liquidTao || 0;
           holdings = wData.holdings || [];
        }
      } else {
        try {
          const errData = await response.json();
          apiError = errData.error || 'API Request Failed';
        } catch {
          apiError = 'API Request Failed';
        }
      }

      if (apiError) {
        newResults.push({
          address: wallet.address,
          nickname: wallet.nickname,
          liquidTao: 0,
          alphaValueTao: 0,
          totalValueTao: 0,
          totalValueUsd: 0,
          numPositions: 0,
          holdings: [],
          error: apiError
        });
        continue;
      }
      
      holdings.forEach((h: any) => alphaValueTao += (h.quantity * h.priceTao));
      
      newResults.push({
        address: wallet.address,
        nickname: wallet.nickname,
        liquidTao,
        alphaValueTao,
        totalValueTao: liquidTao + alphaValueTao,
        totalValueUsd: (liquidTao + alphaValueTao) * taoPrice,
        numPositions: holdings.length,
        holdings
      });
    }
    
    setResults(newResults);
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  const checkSingleWallet = async (address: string) => {
    const wallet = wallets.find(w => w.address === address);
    if (!wallet) return;

    setUpdatingAddress(address);

    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: [wallet.address] })
      });
      
      let liquidTao = 0;
      let alphaValueTao = 0;
      let holdings = [];
      let apiError = '';

      if (response.ok) {
        const data = await response.json();
        const wData = data[0];
        
        if (wData.error) {
           apiError = wData.error;
        } else {
           liquidTao = wData.liquidTao || 0;
           holdings = wData.holdings || [];
        }
      } else {
        try {
          const errData = await response.json();
          apiError = errData.error || 'API Request Failed';
        } catch {
          apiError = 'API Request Failed';
        }
      }

      let newResult: WalletResult;
      
      if (apiError) {
        newResult = {
          address: wallet.address,
          nickname: wallet.nickname,
          liquidTao: 0,
          alphaValueTao: 0,
          totalValueTao: 0,
          totalValueUsd: 0,
          numPositions: 0,
          holdings: [],
          error: apiError
        };
      } else {
        holdings.forEach((h: any) => alphaValueTao += (h.quantity * h.priceTao));
        
        newResult = {
          address: wallet.address,
          nickname: wallet.nickname,
          liquidTao,
          alphaValueTao,
          totalValueTao: liquidTao + alphaValueTao,
          totalValueUsd: (liquidTao + alphaValueTao) * taoPrice,
          numPositions: holdings.length,
          holdings
        };
      }

      setResults(prev => prev ? prev.map(r => r.address === address ? newResult : r) : null);
      setLastUpdated(new Date());

    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingAddress(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const exportToCsv = () => {
    if (!results) return;
    
    let csv = 'Nickname,Address,Liquid TAO,Alpha TAO,Total TAO,Total USD,Positions\n';
    results.forEach(r => {
      csv += `"${r.nickname}","${r.address}",${r.liquidTao},${r.alphaValueTao},${r.totalValueTao},${r.totalValueUsd},${r.numPositions}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mass_wallet_check.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const combinedHoldings = React.useMemo(() => {
    if (!results) return [];
    
    const map = new Map<number, SubnetHolding>();
    
    results.forEach(r => {
      if (r.error) return;
      
      r.holdings.forEach(h => {
        let entry = map.get(h.netuid);
        if (!entry) {
          entry = {
            netuid: h.netuid,
            name: h.name,
            alphaQuantity: 0,
            alphaPriceTao: h.priceTao,
            valueTao: 0,
            valueUsd: 0,
            walletsHolding: []
          };
          map.set(h.netuid, entry);
        }
        
        entry.alphaQuantity += h.quantity;
        entry.valueTao += (h.quantity * h.priceTao);
        entry.valueUsd += (h.quantity * h.priceTao * taoPrice);
        entry.walletsHolding.push({
          nickname: r.nickname,
          address: r.address,
          quantity: h.quantity
        });
      });
    });
    
    let list = Array.from(map.values());
    
    // Sort
    list.sort((a, b) => {
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      if (sortField === 'valueTao') return (a.valueTao - b.valueTao) * multiplier;
      if (sortField === 'valueUsd') return (a.valueUsd - b.valueUsd) * multiplier;
      return (a.netuid - b.netuid) * multiplier;
    });
    
    // Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(h => h.name.toLowerCase().includes(q) || h.netuid.toString().includes(q));
    }
    
    return list;
  }, [results, sortField, sortOrder, searchQuery]);

  const totals = React.useMemo(() => {
    if (!results) return { tao: 0, usd: 0, liquid: 0, alpha: 0, validWallets: 0, positions: 0 };
    
    let tao = 0, usd = 0, liquid = 0, alpha = 0, validWallets = 0, positions = 0;
    
    results.forEach(r => {
      if (!r.error) {
        tao += r.totalValueTao;
        usd += r.totalValueUsd;
        liquid += r.liquidTao;
        alpha += r.alphaValueTao;
        validWallets++;
        positions += r.numPositions;
      }
    });
    
    return { tao, usd, liquid, alpha, validWallets, positions };
  }, [results]);

  const toggleSort = (field: 'valueTao' | 'valueUsd' | 'netuid') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const toggleSubnetExpand = (netuid: number) => {
    const next = new Set(expandedSubnets);
    if (next.has(netuid)) next.delete(netuid);
    else next.add(netuid);
    setExpandedSubnets(next);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 text-slate-900 dark:text-white font-sans min-h-screen">
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black font-space uppercase tracking-tight text-slate-900 dark:text-white mb-4">
          Mass Wallet Check
        </h1>
        <p className="text-xl text-cyan-600 dark:text-cyan-400 mb-6">
          Check all your Bittensor wallets at the same time.
        </p>
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-xl flex items-start gap-3">
          <Shield className="text-cyan-500 shrink-0 mt-0.5" size={18} />
          <p className="text-sm font-mono text-cyan-700 dark:text-cyan-300 uppercase tracking-widest">
            <strong>Security Notice:</strong> Enter public wallet addresses only. Never enter your seed phrase or private keys.
          </p>
        </div>
      </div>

      {/* Inputs Section */}
      {!results && (
        <div className="bg-white dark:bg-[#06080c] border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold font-space uppercase">Wallets ({wallets.length}/{MAX_WALLETS})</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowBulk(!showBulk)}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                {showBulk ? 'Hide Bulk Paste' : 'Bulk Paste'}
              </button>
              <button 
                onClick={() => {
                  if (window.confirm('Clear all wallets?')) saveWallets([]);
                }}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {showBulk && (
            <div className="mb-6 p-4 bg-slate-50 dark:bg-[#0a0e17] rounded-xl border border-slate-200 dark:border-white/5">
              <p className="text-xs text-slate-500 mb-2">Paste one address per line. You can also include nicknames (e.g., "5xxx... Cold Storage").</p>
              <textarea 
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value)}
                className="w-full h-32 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-lg p-3 text-sm font-mono focus:outline-none focus:border-cyan-500 resize-none mb-3"
                placeholder="5...\n5..."
              />
              <button 
                onClick={handleBulkAdd}
                className="px-6 py-2 bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-cyan-600 transition-colors"
              >
                Import Addresses
              </button>
            </div>
          )}

          <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto pr-2">
            {wallets.map((wallet, index) => {
              const isInvalid = wallet.address && !isValidAddress(wallet.address);
              return (
                <div key={wallet.id} className={`flex flex-col sm:flex-row gap-3 p-3 rounded-xl border ${isInvalid ? 'bg-red-500/5 border-red-500/30' : 'bg-slate-50 dark:bg-[#0a0e17] border-slate-200 dark:border-white/5'}`}>
                  <input 
                    type="text" 
                    placeholder={`Nickname ${index + 1} (Optional)`}
                    value={wallet.nickname}
                    onChange={e => updateWallet(wallet.id, 'nickname', e.target.value)}
                    className="sm:w-1/3 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                  />
                  <input 
                    type="text" 
                    placeholder="Public Address (5...)"
                    value={wallet.address}
                    onChange={e => updateWallet(wallet.id, 'address', e.target.value)}
                    className="flex-1 bg-white dark:bg-black/50 border border-slate-300 dark:border-white/10 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:border-cyan-500"
                  />
                  <button 
                    onClick={() => removeWallet(wallet.id)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors flex items-center justify-center shrink-0"
                  >
                    <Trash2 size={18} />
                  </button>
                  {isInvalid && <div className="w-full sm:hidden text-xs text-red-500">Invalid SS58 format</div>}
                </div>
              );
            })}
            
            {wallets.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-sm">
                No wallets added yet. Add a wallet or use Bulk Paste.
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
            <button 
              onClick={addEmptyWallet}
              disabled={wallets.length >= MAX_WALLETS}
              className="px-4 py-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-sm font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} /> Add Wallet
            </button>
            <button 
              onClick={checkWallets}
              disabled={wallets.length === 0 || isLoading}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_25px_rgba(6,182,212,0.30)] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : 'Check All Wallets'}
            </button>
          </div>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          
          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#06080c] p-4 rounded-xl border border-slate-200 dark:border-white/10 shadow-lg">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setResults(null)}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Edit Wallets
              </button>
              <button 
                onClick={checkWallets}
                disabled={isLoading}
                className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh
              </button>
              {lastUpdated && (
                <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                  Updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowUsd(!showUsd)}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Show {showUsd ? 'TAO' : 'USD'}
              </button>
              <button 
                onClick={exportToCsv}
                className="px-4 py-2 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2"
              >
                <Download size={14} /> CSV
              </button>
            </div>
          </div>

          {/* Combined Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0e17] border border-slate-200 dark:border-white/5 shadow-xl">
              <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block mb-2">Total Portfolio</span>
              <div className="text-2xl md:text-3xl font-black font-space tracking-tight">
                {showUsd ? `$${totals.usd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : `${totals.tao.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 𝞃`}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0e17] border border-slate-200 dark:border-white/5 shadow-xl">
              <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block mb-2">Liquid Balance</span>
              <div className="text-2xl md:text-3xl font-black font-space tracking-tight">
                {showUsd ? `$${(totals.liquid * taoPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : `${totals.liquid.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 𝞃`}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0e17] border border-slate-200 dark:border-white/5 shadow-xl">
              <span className="text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest block mb-2">Alpha Value</span>
              <div className="text-2xl md:text-3xl font-black font-space tracking-tight">
                {showUsd ? `$${(totals.alpha * taoPrice).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : `${totals.alpha.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 𝞃`}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#0a0e17] border border-slate-200 dark:border-white/5 shadow-xl flex flex-col justify-center">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Wallets Checked</span>
                <span className="font-bold">{totals.validWallets} / {wallets.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase tracking-widest font-mono">Total Positions</span>
                <span className="font-bold">{totals.positions}</span>
              </div>
            </div>
          </div>

          {/* Wallet Breakdown */}
          <div className="bg-white dark:bg-[#06080c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/5">
              <h3 className="text-lg font-bold font-space uppercase">Wallet Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-white/5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4 pl-6">Wallet</th>
                    <th className="p-4">Address</th>
                    <th className="p-4 text-right">Liquid TAO</th>
                    <th className="p-4 text-right">Alpha Value</th>
                    <th className="p-4 text-right">Total Value</th>
                    <th className="p-4 text-right">Positions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {results.map((r, i) => (
                    <tr key={i} className={`hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors ${r.error ? 'bg-red-500/5' : ''}`}>
                      <td className="p-4 pl-6 font-bold">{r.nickname}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs opacity-70">
                            {r.address.substring(0,6)}...{r.address.substring(42)}
                          </span>
                          <button 
                            onClick={() => copyToClipboard(r.address)}
                            className="text-slate-400 hover:text-cyan-500 transition-colors"
                            title="Copy Address"
                          >
                            {copiedAddress === r.address ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                          <button 
                            onClick={() => checkSingleWallet(r.address)}
                            disabled={updatingAddress === r.address}
                            className={`text-slate-400 hover:text-cyan-500 transition-colors ${updatingAddress === r.address ? 'opacity-50' : ''}`}
                            title="Refresh Wallet"
                          >
                            <RefreshCw size={14} className={updatingAddress === r.address ? 'animate-spin text-cyan-500' : ''} />
                          </button>
                        </div>
                        {r.error && (
                          <div className="text-[10px] text-red-500 mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1"><AlertCircle size={10} /> {r.error}</span>
                            <button 
                              onClick={() => checkSingleWallet(r.address)}
                              disabled={updatingAddress === r.address}
                              className="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <RefreshCw size={10} className={updatingAddress === r.address ? 'animate-spin' : ''} /> Retry
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right font-mono">{r.liquidTao.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                      <td className="p-4 text-right font-mono">{r.alphaValueTao.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                      <td className="p-4 text-right font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                        {showUsd ? `$${r.totalValueUsd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}` : `${r.totalValueTao.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 𝞃`}
                      </td>
                      <td className="p-4 text-right font-mono">{r.numPositions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Combined Subnet Holdings */}
          <div className="bg-white dark:bg-[#06080c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h3 className="text-lg font-bold font-space uppercase">Combined Subnet Holdings</h3>
              <input 
                type="text" 
                placeholder="Search subnets..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 w-full sm:w-64"
              />
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 dark:bg-white/5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="p-4 pl-6 cursor-pointer hover:text-cyan-500" onClick={() => toggleSort('netuid')}>
                      Subnet {sortField === 'netuid' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 text-right">Alpha Qty</th>
                    <th className="p-4 text-right">Price (𝞃)</th>
                    <th className="p-4 text-right cursor-pointer hover:text-cyan-500" onClick={() => toggleSort('valueTao')}>
                      Value (𝞃) {sortField === 'valueTao' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 text-right cursor-pointer hover:text-cyan-500 hidden sm:table-cell" onClick={() => toggleSort('valueUsd')}>
                      Value ($) {sortField === 'valueUsd' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="p-4 text-right">% of Port</th>
                    <th className="p-4 text-right pr-6">Wallets</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {combinedHoldings.length === 0 ? (
                    <tr><td colSpan={7} className="p-8 text-center text-slate-500">No holdings found</td></tr>
                  ) : combinedHoldings.map((h) => {
                    const pct = totals.alpha > 0 ? (h.valueTao / totals.alpha) * 100 : 0;
                    const isExpanded = expandedSubnets.has(h.netuid);
                    
                    return (
                      <React.Fragment key={h.netuid}>
                        <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="p-4 pl-6">
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => toggleSubnetExpand(h.netuid)}
                                className="w-6 h-6 rounded flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                              >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              <div>
                                <div className="font-bold">{h.name}</div>
                                <div className="text-[10px] font-mono text-slate-500">SN{h.netuid}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right font-mono">{h.alphaQuantity.toLocaleString(undefined, {maximumFractionDigits:4})}</td>
                          <td className="p-4 text-right font-mono">{h.alphaPriceTao.toLocaleString(undefined, {maximumFractionDigits:4})}</td>
                          <td className="p-4 text-right font-mono text-cyan-600 dark:text-cyan-400 font-bold">{h.valueTao.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                          <td className="p-4 text-right font-mono hidden sm:table-cell">${h.valueUsd.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                          <td className="p-4 text-right font-mono">
                            <div className="flex items-center justify-end gap-2">
                              <span>{pct.toFixed(1)}%</span>
                              <div className="w-16 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, pct)}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-right pr-6 font-mono">{h.walletsHolding.length}</td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-slate-50 dark:bg-white/[0.02]">
                            <td colSpan={7} className="p-0">
                              <div className="py-3 px-6 pl-14">
                                <table className="w-full text-xs">
                                  <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                                    {h.walletsHolding.map((wh, idx) => (
                                      <tr key={idx}>
                                        <td className="py-2 text-slate-500 font-medium w-1/3">{wh.nickname}</td>
                                        <td className="py-2 font-mono text-slate-400 w-1/3">...{wh.address.substring(wh.address.length - 8)}</td>
                                        <td className="py-2 text-right font-mono text-slate-300">{wh.quantity.toLocaleString(undefined, {maximumFractionDigits:4})} α</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      )}

    </div>
  );
};
