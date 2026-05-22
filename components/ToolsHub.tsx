
import React from 'react';
import { View } from '../types.ts';
import { 
  Cpu, 
  Layers, 
  Zap, 
  ChevronRight, 
  Coins,
  Wallet,
  Rocket,
  Search,
  Building2,
  Server,
  Network,
  TrendingUp
} from 'lucide-react';

interface ToolCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  view?: View;
  url?: string;
  internalRoute?: string;
  colorClass: string;
  onNavigate: (view: View) => void;
  badge?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, description, icon, view, url, internalRoute, colorClass, onNavigate, badge }) => {
  const handleClick = () => {
    if (internalRoute) {
      window.location.hash = internalRoute;
    } else if (url) {
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
        <p className="text-slate-500 dark:text-slate-400 font-inter leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity whitespace-pre-line">
          {description}
        </p>
      </div>
      
      <div className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-orange-600 group-hover:translate-x-2 transition-transform duration-300">
        {internalRoute ? 'VIEW SITE' : ((view === 'alphagap' || view === 'emissions-explained') ? 'VIEW GUIDE' : 'GO TO SITE')} <ChevronRight size={14} />
      </div>
    </button>
  );
};

export const ToolsHub: React.FC<{ onNavigate: (view: View) => void }> = ({ onNavigate }) => {
  const tools = [
    {
      title: 'ALPHAGAP MASTERCLASS',
      description: 'Bridge the gap between retail and institutional intelligence. Highly recommended for students of global macro and onchain signals.',
      icon: <Zap />,
      view: 'alphagap' as View,
      colorClass: 'text-[#10b981]'
    },
    {
      title: 'BITTENSOR EMISSIONS EXPLAINED',
      description: 'Cozy, simple math guide breaking down TAO pool deposits (tao_in) vs. participant Alpha minting (alpha_out). Includes an live interactive values simulator for quick reference.',
      icon: <Layers />,
      view: 'emissions-explained' as View,
      colorClass: 'text-[#10b981]'
    },
    {
      title: 'TAONSQUARE',
      description: 'Discover products and services powered by the Bittensor network. An open market of decentralized intelligence that anyone can contribute to and use.',
      icon: <Layers />,
      url: 'https://taonsquare.com/',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAO.COM',
      description: 'The original Bittensor wallet app for buying TAO and trading subnet tokens.',
      icon: <Wallet />,
      url: 'https://tao.com/',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAO INSTITUTE',
      description: 'Institutional-grade Bittensor subnet analytics, rankings, and investment risk platform.',
      icon: <TrendingUp />,
      url: 'https://taoinstitute.io',
      colorClass: 'text-emerald-500'
    },
    {
      title: 'TAO BUBBLES',
      description: 'Real-time visualization of Bittensor subnets and performance.',
      icon: <Layers />,
      url: 'https://taobubbles.net',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAO FLUTE',
      description: 'Comprehensive overview and analytics for Bittensor subnets.',
      icon: <Layers />,
      url: 'https://taoflute.com/d/c043704a-865a-4eaf-8d41-7ffdbcaad6c7/subnets-overview?orgId=2&from=now-6h&to=now&timezone=browser&kiosk=&var-target_subnets=$__all',
      colorClass: 'text-orange-500'
    },
    {
      title: 'CRUCIBLE WALLET',
      description: 'Securely manage your TAO assets with the Crucible Wallet Chrome extension.',
      icon: <Wallet />,
      url: 'https://chromewebstore.google.com/detail/crucible-wallet/capjnhbneiilplogojhmhepiocnjpgee?authuser=5&hl=en',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAOSTATS',
      description: 'The leading block explorer and analytics platform for the Bittensor network.',
      icon: <Search />,
      url: 'https://taostats.io/',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAOSTATS WALLET',
      description: 'The official Bittensor Chrome Wallet by Taostats.',
      icon: <Wallet />,
      url: 'https://taostats.io/bittensor-chrome-wallet',
      colorClass: 'text-orange-500'
    },
    {
      title: 'BITSTARTER',
      description: 'Discover new teams\nPre-vetted by protocol pros\nPledge TAO\nBack the alpha before it\'s Alpha\nLaunch new subnets\nGet subnet tokens at pre-launch rates',
      icon: <Rocket />,
      url: 'https://www.bitstarter.ai/',
      colorClass: 'text-orange-500'
    },
    {
      title: 'TAO.APP EXPLORER',
      description: 'Explore the TAO blockchain and track wallet activity.',
      icon: <Search />,
      url: 'https://www.tao.app/explorer',
      colorClass: 'text-orange-500'
    },
    {
      title: 'STILLCORE CAPITAL',
      description: 'A U.S. fund exclusively dedicated to Bittensor — bridging traditional capital to the decentralized AI revolution.',
      icon: <Building2 />,
      url: 'https://stillcorecapital.com/',
      colorClass: 'text-orange-500'
    },
    {
      title: 'YUMA AI',
      description: 'Yuma powers transformative\nprojects on Bittensor that will\nreshape our futures.',
      icon: <Cpu />,
      url: 'https://www.yumaai.com/',
      colorClass: 'text-orange-500'
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
            INFORMATION <span className="text-orange-600">HUB</span>
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
