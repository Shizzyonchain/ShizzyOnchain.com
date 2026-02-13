
import React, { useState, useEffect } from 'react';
import { INITIAL_COINS } from '../constants.tsx';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { CoinData } from '../types.ts';

export const Ticker: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>(INITIAL_COINS);

  const fetchLivePrices = async () => {
    try {
      const markets = await coinGeckoProxy.getTopMarkets();
      
      if (markets && markets.length > 0) {
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
    const interval = setInterval(fetchLivePrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-white/5 h-[44px] flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-[100] transition-colors duration-300 select-none">
      <div className="flex items-center min-w-full marquee-content">
        {/* We repeat the content 4 times to ensure a seamless loop even on ultra-wide screens */}
        {[0, 1, 2, 3].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {coins.map((coin, idx) => (
              <div key={`${setIndex}-${idx}`} className="inline-flex items-center px-10 gap-3">
                <span className="font-bold text-xs md:text-sm text-slate-500 dark:text-slate-400 font-mono tracking-tighter">
                  {coin.symbol}
                </span>
                <span className="font-mono text-sm md:text-base font-black text-slate-900 dark:text-white tabular-nums">
                  ${coin.price.toLocaleString(undefined, { 
                    minimumFractionDigits: coin.price < 1 ? 4 : 2, 
                    maximumFractionDigits: coin.price < 1 ? 6 : 2 
                  })}
                </span>
                <span className={`text-[10px] md:text-xs font-black font-mono ${coin.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {coin.change >= 0 ? '▲' : '▼'}{Math.abs(coin.change).toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <style>{`
        .marquee-content {
          display: flex;
          animation: ticker-glide 80s linear infinite;
          will-change: transform;
        }
        .marquee-content:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-glide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
