
import React from 'react';
import { View } from '../types.ts';
import { 
  Cpu, 
  Layers, 
  Zap, 
  ChevronRight, 
  Coins
} from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  view?: View;
  url?: string;
  colorClass: string;
  onNavigate: (view: View) => void;
  badge?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, view, url, colorClass, onNavigate, badge }) => {
  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (view) {
      onNavigate(view);
    }
  };

  return (
    <button 
      onClick={handleClick}
      className="group relative flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/5 text-left overflow-hidden h-full"
    >
      <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
        {icon}
      </div>
      
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl w-fit ${colorClass} bg-opacity-10 dark:bg-opacity-10 border border-current border-opacity-20`}>
          {React.cloneElement(icon as React.ReactElement, { size: 28 })}
        </div>
        {badge && (
          <span className="px-3 py-1 bg-orange-600/10 text-orange-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            {badge}
          </span>
        )}
      </div>
      
      <div className="space-y-4 relative z-10 flex-grow">
        <h3 className="text-2xl md:text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic group-hover:text-orange-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-inter leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {description}
        </p>
      </div>
      
      <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 group-hover:translate-x-2 transition-transform duration-300">
        GO TO SITE <ChevronRight size={14} />
      </div>
    </button>
  );
};

export const ToolsHub: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const tools = [
    {
      title: 'AI COINS',
      description: 'Infrastructure monitoring of the emerging AI and Big Data economy with live data feeds from global nodes.',
      icon: <Cpu />,
      view: 'aicoins' as View,
      colorClass: 'text-orange-500'
    },
    {
      title: 'CRYPTO COINS',
      description: 'Macro scale dominance tracking and market leader analysis for the global onchain asset landscape.',
      icon: <Coins />,
      view: 'cryptocoins' as View,
      colorClass: 'text-emerald-500'
    },
    {
      title: 'BUBBLES',
      description: 'High-performance interactive data visualization mapping market movements and volatility across the top 500 assets.',
      icon: <Layers />,
      view: 'bubbles' as View,
      colorClass: 'text-teal-500'
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-20 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <Zap size={10} strokeWidth={3} className="animate-pulse" />
            ANALYSIS ARSENAL ACTIVE
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            THE <span className="text-orange-600">TOOLKIT</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl leading-relaxed italic">
            Strategic terminals for high-signal onchain navigation. No fluff. Just data.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.title}
            {...tool}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};
