
import React, { useState, useEffect } from 'react';
import { INITIAL_COINS } from '../constants.tsx';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { CoinData } from '../types.ts';

export const Ticker: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>(INITIAL_COINS);

  const fetchLivePrices = async () => {
    try {
      // Fetch the top 100 markets which is highly reliable
      const markets = await coinGeckoProxy.getTopMarkets();
      
      if (markets && markets.length > 0) {
        // Define the specific symbols we want to highlight in the ticker
        const preferredSymbols = ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'DOGE', 'TRX', 'PEPE', 'SUI', 'AVAX', 'LINK'];
        
        const liveCoins: CoinData[] = markets
          .filter(m => preferredSymbols.includes(m.symbol.toUpperCase()))
          .map(m => ({
            symbol: m.symbol.toUpperCase(),
            price: m.current_price,
            change: m.price_change_percentage_24h_in_currency || 0
          }));

        if (liveCoins.length > 0) {
          setCoins(liveCoins);
        }
      }
    } catch (e) {
      console.error("Ticker live sync failed:", e);
    }
  };

  useEffect(() => {
    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); // Refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-white/5 h-[44px] flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50 transition-colors duration-300">
      <div className="flex animate-marquee">
        {[...coins, ...coins, ...coins].map((coin, idx) => (
          <div key={idx} className="inline-flex items-center px-10 gap-3">
            <span className="font-bold text-sm md:text-base text-slate-500 dark:text-slate-400">{coin.symbol}</span>
            <span className="font-mono text-sm md:text-base font-bold text-slate-900 dark:text-white">
              ${coin.price.toLocaleString(undefined, { minimumFractionDigits: coin.price < 1 ? 4 : 2, maximumFractionDigits: coin.price < 1 ? 6 : 2 })}
            </span>
            <span className={`text-xs md:text-sm font-bold ${coin.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
