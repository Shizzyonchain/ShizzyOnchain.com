
import React, { useState, useEffect } from 'react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';

export const Ticker: React.FC = () => {
  const [coins, setCoins] = useState<GeckoCoin[]>([]);

  const fetchMarkets = async () => {
    try {
      const data = await coinGeckoProxy.getTopMarkets();
      if (data && data.length > 0) {
        setCoins(data.slice(0, 15));
      }
    } catch (e) {
      console.error("Ticker live sync failed:", e);
    }
  };

  useEffect(() => {
    fetchMarkets();
    const interval = setInterval(fetchMarkets, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-[44px] flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-[101] transition-colors duration-300 select-none">
      <div className="flex items-center min-w-full marquee-content">
        {[0, 1].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {coins.map((coin, idx) => (
              <div key={`${setIndex}-${idx}`} className="inline-flex items-center px-12 gap-4">
                <span className="font-black text-[10px] text-slate-400 dark:text-slate-500 font-space uppercase tracking-widest">
                  {coin.symbol}
                </span>
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white tabular-nums">
                  ${coin.current_price.toLocaleString(undefined, { 
                    minimumFractionDigits: coin.current_price < 1 ? 4 : 2, 
                    maximumFractionDigits: coin.current_price < 1 ? 4 : 2 
                  })}
                </span>
                <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md ${coin.price_change_percentage_24h >= 0 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {coin.price_change_percentage_24h >= 0 ? '+' : ''}{coin.price_change_percentage_24h.toFixed(2)}%
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
