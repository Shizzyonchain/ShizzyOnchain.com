import React from 'react';
import { Layers, PieChart } from 'lucide-react';

const PORTFOLIO_DATA = [
  { sn: 'SN62', name: 'Ridges', percent: 19.7 },
  { sn: 'SN3', name: 'Templar', percent: 14.0 },
  { sn: 'SN4', name: 'Targon', percent: 12.1 },
  { sn: 'SN64', name: 'Chutes', percent: 12.0 },
  { sn: 'SN120', name: 'Affine', percent: 11.9 },
  { sn: 'SN44', name: 'Score', percent: 7.4 },
  { sn: 'SN81', name: 'Grail', percent: 6.3 },
  { sn: 'SN39', name: 'Basilica', percent: 5.4 },
  { sn: 'SN58', name: 'Handshake', percent: 3.4 },
  { sn: 'SN105', name: 'Beam', percent: 2.6 },
  { sn: 'SN9', name: 'iota', percent: 2.49 },
  { sn: 'SN97', name: 'distil', percent: 1.42 },
  { sn: 'SN46', name: 'RESI', percent: 1.08 },
  { sn: 'SN93', name: 'Bitcast', percent: 0.26 },
];

export const Portfolio: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-20 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <PieChart size={10} strokeWidth={3} className="animate-pulse" />
            PORTFOLIO ALLOCATION
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            SHIZZY'S <span className="text-orange-600">PORTFOLIO</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl leading-relaxed italic">
            Current Bittensor Subnet Allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Image Section */}
        <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0b0e14] p-4">
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
          <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="block relative z-10 rounded-3xl overflow-hidden">
            <img 
              src="https://i.postimg.cc/Wz78T7C9/2f40ed52-9425-4dc0-860e-b49cccf86a47.jpg" 
              alt="Shizzy's Portfolio" 
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>

        {/* Data Section */}
        <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 text-orange-500 pointer-events-none">
            <Layers size={200} />
          </div>
          
          <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic mb-8 relative z-10">
            Subnet Breakdown
          </h3>
          
          <div className="space-y-6 relative z-10">
            {PORTFOLIO_DATA.map((item, index) => (
              <div key={item.sn} className="space-y-2 group">
                <div className="flex justify-between items-end text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400 w-12">{item.sn}</span>
                    <span className="font-black uppercase tracking-widest text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{item.percent.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
