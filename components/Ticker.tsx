import React from 'react';
import { INITIAL_COINS } from '../constants.tsx';

export const Ticker: React.FC = () => {
  return (
    <div className="bg-[#111827] border-b border-white/5 h-[44px] flex items-center overflow-hidden whitespace-nowrap sticky top-0 z-50">
      <div className="flex animate-marquee">
        {[...INITIAL_COINS, ...INITIAL_COINS].map((coin, idx) => (
          <div key={idx} className="inline-flex items-center px-10 gap-3">
            <span className="font-bold text-sm md:text-base text-slate-400">{coin.symbol}</span>
            <span className="font-mono text-sm md:text-base font-bold text-white">${coin.price.toLocaleString()}</span>
            <span className={`text-xs md:text-sm font-bold ${coin.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {coin.change >= 0 ? '▲' : '▼'} {Math.abs(coin.change)}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};