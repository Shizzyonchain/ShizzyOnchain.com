
import React, { useState, useEffect } from 'react';
import { taoStatsService } from '../services/taoStatsService.ts';
import { CoinData } from '../types.ts';

export const Ticker: React.FC = () => {
  const [subnets, setSubnets] = useState<any[]>([]);

  const fetchSubnets = async () => {
    try {
      const data = await taoStatsService.getSubnets();
      if (data && data.length > 0) {
        // Take top 15 subnets by emission for the ticker
        setSubnets(data.slice(0, 15));
      }
    } catch (e) {
      console.error("Ticker live sync failed:", e);
    }
  };

  useEffect(() => {
    fetchSubnets();
    const interval = setInterval(fetchSubnets, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-[44px] flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-[101] transition-colors duration-300 select-none">
      <div className="flex items-center min-w-full marquee-content">
        {[0, 1, 2, 3].map((setIndex) => (
          <div key={setIndex} className="flex items-center">
            {subnets.map((subnet, idx) => (
              <div key={`${setIndex}-${idx}`} className="inline-flex items-center px-12 gap-4">
                <span className="font-black text-[10px] text-slate-400 dark:text-slate-500 font-space uppercase tracking-widest">
                  {subnet.name}
                </span>
                <span className="font-mono text-sm font-black text-slate-900 dark:text-white tabular-nums">
                  ${subnet.price_usd.toLocaleString(undefined, { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </span>
                <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-500`}>
                  {(subnet.emission * 100).toFixed(2)}% EM
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
