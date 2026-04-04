import React, { useState } from 'react';
import { Copy, CheckCircle2, Wallet } from 'lucide-react';

const WALLETS = [
  {
    name: 'Tao / Bittensor Subnet Wallet',
    address: '5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM',
  },
  {
    name: 'Bitcoin',
    address: 'bc1ps0y5sw7yq5xvwsy7ca8ed9d9nca0kaw2k8g9z0vlh7sxy8untvrqa62ld4',
  },
  {
    name: 'EVM',
    address: '0x76f2ee7758b5AceBF5cab1819A810983EFcd1CCE',
  },
  {
    name: 'Solana',
    address: '5AQRnR7gsQznYtZDdXRke1iZQEmdhWju7V5dgXGx9h9J',
  }
];

export const SendTip: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-[800px] mx-auto px-6 py-20 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-16 text-center space-y-10 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-md h-32 bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="space-y-6 relative z-10">
          <div className="w-20 h-20 mx-auto bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
            <Wallet className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
            Send a Tip
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 font-inter leading-relaxed max-w-2xl mx-auto">
            Want me to look into your favorite subnet? Drop a tip to the wallet below and I will research it for a future Shizzy Portfolio Update. I am always hunting for strong Bittensor subnets, and some of the best ideas come straight from the community. If it passes the test, it could earn a spot in the portfolio.
          </p>
        </div>

        <div className="space-y-4 relative z-10 text-left">
          {WALLETS.map((wallet) => (
            <div key={wallet.name} className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-6 space-y-3">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                {wallet.name}
              </p>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <code className="flex-grow text-xs md:text-sm font-mono bg-white dark:bg-black px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white break-all w-full">
                  {wallet.address}
                </code>
                <button
                  onClick={() => handleCopy(wallet.name, wallet.address)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold uppercase tracking-wider transition-all active:scale-95 shrink-0 w-full md:w-auto"
                >
                  {copiedId === wallet.name ? (
                    <>
                      <CheckCircle2 size={18} />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
