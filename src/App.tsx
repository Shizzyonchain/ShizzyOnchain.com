import React, { useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import { motion } from 'motion/react';

interface WalletResult {
  address: string;
  freeTao: string;
  totalAlphaValue: string;
  totalValue: string;
  positions: any[];
}

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<WalletResult[]>([]);
  const [error, setError] = useState('');

  const formatTao = (raoStr: string) => {
    const rao = BigInt(raoStr);
    const tao = Number(rao) / 1e9;
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(tao);
  };

  const handleCheck = async () => {
    if (!input.trim()) return;
    
    // Parse input
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
    const uniqueAddresses = [...new Set(lines)];
    
    if (uniqueAddresses.length === 0) {
      setError('Please enter valid wallet addresses');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ addresses: uniqueAddresses }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallet data');
      }

      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSingleCheck = async (address: string) => {
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addresses: [address] }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to refresh');
      
      setResults(prev => prev.map(r => r.address === address ? data[0] : r));
    } catch (err: any) {
      alert(`Failed to refresh ${address}: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
            <Layers className="w-8 h-8 text-blue-500" />
            Shizzy Unchained
          </h1>
          <p className="text-zinc-400">Mass Wallet Check - Direct Blockchain Access</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="p-6 space-y-4">
            <label className="block text-sm font-medium text-zinc-300">
              Paste Bittensor Coldkey Addresses (One per line)
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="5Gn8DDfSnMwVUga4r5DNZjg7WsKoUnGUrKrYJVYCdDacQRej&#10;5EHa6XrS2YUMEwUg53vvEfUuzk4G2zq4evPbxuQHPnbxKXeH"
              className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-zinc-300 font-mono text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
            />
            
            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handleCheck}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Querying Blockchain...
                </>
              ) : (
                'Check Wallets'
              )}
            </button>
          </div>
        </motion.div>

        {results.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-semibold text-zinc-200 px-1">Results</h2>
            {results.map((result, idx) => (
              <motion.div
                key={result.address}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1 overflow-hidden">
                  <div className="text-sm text-zinc-400">Address</div>
                  <div className="font-mono text-zinc-200 truncate" title={result.address}>
                    {result.address}
                  </div>
                </div>
                
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="space-y-1">
                    <div className="text-sm text-zinc-400">Total Value</div>
                    <div className="font-medium text-xl text-emerald-400">
                      {formatTao(result.totalValue)} τ
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSingleCheck(result.address)}
                    className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title="Refresh this wallet"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-5 flex items-center justify-between">
              <div className="text-zinc-400 font-medium">Combined Portfolio Total</div>
              <div className="text-2xl font-bold text-white">
                {formatTao(results.reduce((acc, r) => acc + BigInt(r.totalValue), 0n).toString())} τ
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
