
import React from 'react';
import { View } from '../types.ts';
import { 
  Cpu, 
  Layers, 
  Activity, 
  BarChart3, 
  Zap, 
  ChevronRight, 
  Search,
  ShieldCheck,
  Coins,
  BrainCircuit,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  view: View;
  colorClass: string;
  onNavigate: (view: View) => void;
  badge?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, view, colorClass, onNavigate, badge }) => (
  <button 
    onClick={() => onNavigate(view)}
    className="group relative flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 text-left overflow-hidden h-full"
  >
    <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${colorClass}`}>
      {icon}
    </div>
    
    <div className="flex justify-between items-start mb-8">
      <div className={`p-4 rounded-2xl w-fit ${colorClass} bg-opacity-10 dark:bg-opacity-10 border border-current border-opacity-20`}>
        {React.cloneElement(icon as React.ReactElement, { size: 28 })}
      </div>
      {badge && (
        <span className="px-3 py-1 bg-red-600/10 text-red-600 text-[9px] font-black uppercase tracking-widest rounded-md border border-red-600/20">
          {badge}
        </span>
      )}
    </div>
    
    <div className="space-y-4 relative z-10 flex-grow">
      <h3 className="text-2xl md:text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic group-hover:text-blue-600 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 dark:text-slate-400 font-inter leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
        {description}
      </p>
    </div>
    
    <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 group-hover:translate-x-2 transition-transform duration-300">
      ENTER TERMINAL <ChevronRight size={14} />
    </div>
  </button>
);

export const ToolsHub: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const tools = [
    {
      title: 'ARCHITECT AUDITOR',
      description: 'The high-signal filter. Performs an intense structural analysis of any AI or Crypto project. Designed to find technical weaknesses and "hype-wrappers".',
      icon: <ShieldAlert />,
      view: 'architect-auditor' as View,
      colorClass: 'text-orange-600',
      badge: 'BULLSHIT FILTER'
    },
    {
      title: 'AI BRIEF AGENT',
      description: 'The single biggest anxiety killer. A dedicated agent that catches all weekly AI noise and delivers a filtered summary to your context.',
      icon: <BrainCircuit />,
      view: 'ai-brief' as View,
      colorClass: 'text-purple-600',
      badge: 'ANXIETY KILLER'
    },
    {
      title: 'RESEARCH',
      description: 'Advanced market intelligence dashboard with sector filtering, real-time pinning, and high-fidelity coin analysis.',
      icon: <Search />,
      view: 'research' as View,
      colorClass: 'text-blue-600'
    },
    {
      title: 'DEFI INTEL',
      description: 'Global onchain economic output and chain-level liquidity monitoring powered by verified DeFiLlama node data.',
      icon: <ShieldCheck />,
      view: 'defi' as View,
      colorClass: 'text-emerald-600'
    },
    {
      title: 'AI COINS',
      description: 'Infrastructure monitoring of the emerging AI and Big Data economy with live data feeds from global nodes.',
      icon: <Cpu />,
      view: 'aicoins' as View,
      colorClass: 'text-blue-500'
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
            <Zap size={10} strokeWidth={3} className="animate-pulse" />
            ANALYSIS ARSENAL ACTIVE
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            THE <span className="text-blue-600">TOOLKIT</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl leading-relaxed italic">
            Strategic terminals for high-signal onchain navigation. No fluff. Just data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map((tool) => (
          <ToolCard 
            key={tool.view}
            {...tool}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
};
