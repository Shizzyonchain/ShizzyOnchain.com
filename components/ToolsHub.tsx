
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
  TrendingUp,
  Youtube,
  MessageSquare
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
      title: 'TAOSWAP',
      description: 'TaoSwap is a decentralized exchange for the Bittensor ecosystem. Swap TAO and alpha tokens, stake on subnets, explore validators, and manage your portfolio.',
      icon: <Coins />,
      url: 'https://taoswap.org/',
      colorClass: 'text-[#10b981]',
      badge: 'DEX'
    },
    {
      title: 'SUBNETRADAR',
      description: 'Real-time Bittensor subnet analytics with smart money tracking, validator comparison, health scores, emission data, and portfolio tools.',
      icon: <TrendingUp />,
      url: 'https://subnetradar.com/',
      colorClass: 'text-orange-500',
      badge: 'ANALYTICS'
    },
    {
      title: 'TAO YIELD CALCULATOR',
      description: 'Estimate your TAO holdings via staking in subnets and earning APY yield.',
      icon: <TrendingUp />,
      url: 'https://taoyield.com/',
      colorClass: 'text-[#10b981]',
      badge: 'TOOL'
    },
    {
      title: 'NAMETENSOR',
      description: 'NameTensor is a fully on-chain domain and identity protocol built for the Bittensor ecosystem. It allows users to register permanent human-readable .tao domains that resolve directly to wallet addresses, making it easier to send, receive, and represent identity on the network.',
      icon: <Network />,
      url: 'https://nametensor.io/',
      colorClass: 'text-orange-500',
      badge: 'IDENTITY LAYER'
    },
    {
      title: 'SUBNET SYNERGIES',
      description: "Your go-to map for every interaction across Bittensor's subnets. Navigate the network and track connections with clarity.",
      icon: <Network />,
      url: 'https://www.subnetsynergies.com/',
      colorClass: 'text-orange-500',
      badge: 'MAP'
    },
    {
      title: 'MAGELLAN',
      description: 'Interactive mind map for learning and exploring the Bittensor ecosystem.',
      icon: <Search />,
      url: 'https://app.xmind.com/',
      colorClass: 'text-orange-500',
      badge: 'VISUAL GUIDE'
    },
    {
      title: 'TAO GALAXY',
      description: 'Discovery platform and research tool for the Bittensor ecosystem featuring a subnet explorer and analysis reports.',
      icon: <Search />,
      url: 'https://taogalaxy.com/', 
      colorClass: 'text-orange-500',
      badge: 'SUBNET EXPLORER'
    },
    {
      title: 'TAO YIELD',
      description: 'Subnet explorer and TAO yield discovery platform offering real-time validator/subnet APY insights.',
      icon: <Coins />,
      url: 'https://taoyield.com/',
      colorClass: 'text-[#10b981]',
      badge: 'APY DISCOVERY'
    },
    {
      title: 'TRUSTEDSTAKE',
      description: 'Our platform handles the deep research, automated strategy, and professional management across the Bittensor ecosystem. You keep complete custody. We focus on one thing: maximizing your position in the future of AI.',
      icon: <Wallet />,
      url: 'https://trustedstake.ai/',
      colorClass: 'text-orange-500',
      badge: 'STAKING'
    },
    {
      title: 'SUBNET ALPHA',
      description: 'Comprehensive directory and discovery hub for Bittensor subnets, featuring profiles, metrics, and updates.',
      icon: <Search />,
      url: 'https://subnetalpha.ai/',
      colorClass: 'text-orange-500',
      badge: 'DIRECTORY'
    },
    {
      title: 'BITTENSOR QUEST',
      description: 'Bittensor Quest is a dashboard for current and future miners.',
      icon: <Cpu />,
      url: 'https://bittensor.quest/',
      colorClass: 'text-[#10b981]',
      badge: 'MINER DASHBOARD'
    },
    {
      title: 'TAO MERCH',
      description: 'TAO-branded apparel store showcasing Bittensor-themed shirts, hoodies, hats, and accessories.',
      icon: <Layers />,
      url: 'https://taomerch.store/',
      colorClass: 'text-[#10b981]',
      badge: 'APPAREL'
    },
    {
      title: 'TAO DOMAINS',
      description: 'Human-readable .tao naming system for Bittensor wallets and on-chain identities.',
      icon: <Wallet />,
      url: 'https://tns.network/',
      colorClass: 'text-[#10b981]',
      badge: 'NAMING SERVICE'
    },
    {
      title: 'TAOMARKETCAP',
      description: 'Fundamental subnet market and TAO token insight platform with pricing, volume, and growth analytics.',
      icon: <TrendingUp />,
      url: 'https://taomarketcap.com/',
      colorClass: 'text-orange-500',
      badge: 'SUBNET MARKET'
    },
    {
      title: 'LAMIDA',
      description: 'Lamida is a Bittensor focused US-based company for Subnet Incubation, Subnet Investment, Validator ops, Miner Infrastructure, and Subnet Consulting.',
      icon: <Building2 />,
      url: 'https://lamidaglobal.com/',
      colorClass: 'text-orange-500',
      badge: 'SUBNET INCUBATION'
    },
    {
      title: 'vTAO',
      description: 'Open source, no fee, TAO LST and bridge to Base, Ethereum, etc.',
      icon: <Network />,
      url: 'https://www.tao.app/bridge',
      colorClass: 'text-[#10b981]',
      badge: 'LST HUB'
    },
    {
      title: 'SUBNETSUMMER',
      description: 'Central Telegram group for real-time discussion on Bittensor subnets and ecosystem activity.',
      icon: <MessageSquare />,
      url: 'https://t.me/+mesMGOLRwE83NGE1',
      colorClass: 'text-blue-500',
      badge: 'COMMUNITY'
    },
    {
      title: 'MENTAT',
      description: 'Mentat is a non-custodial TAO delegation manager for optimized yields in Bittensor.',
      icon: <Coins />,
      url: 'https://mentatminds.com/',
      colorClass: 'text-orange-500',
      badge: 'DELEGATION'
    },
    {
      title: 'TAO TEMPLAR',
      description: 'Educational channel delivering concise, hands-on Bittensor tutorials, covering mining setups, staking guides, tokenomics, and subnet walkthroughs.',
      icon: <Youtube />,
      url: 'https://www.youtube.com/@TAOTemplar',
      colorClass: 'text-[#ff0000]',
      badge: 'TUTORIALS'
    },
    {
      title: 'TAO.APP',
      description: 'Web3 dashboard and wallet for managing TAO portfolio, staking, and network interactions.',
      icon: <Wallet />,
      url: 'https://tao.app/',
      colorClass: 'text-orange-500',
      badge: 'WALLET'
    },
    {
      title: 'TENSIA.BOT',
      description: 'Tensia Bot is a real-time Bittensor watcher that pushes alerts to Telegram: wallet activity, whale moves, price impacts, subnet lifecycle, coldkey swaps.',
      icon: <MessageSquare />,
      url: 'https://web.telegram.org/a/#8286824634',
      colorClass: 'text-blue-500',
      badge: 'TRACKER'
    },
    {
      title: 'TENSIA.FOUNDATION',
      description: 'Tensia Foundation is a collective dedicated to the analysis and accessible communication of the Bittensor ecosystem.',
      icon: <Search />,
      url: 'https://tensia.foundation/',
      colorClass: 'text-orange-500',
      badge: 'RESEARCH'
    },
    {
      title: 'BITTENSOR WHITEPAPER',
      description: 'Foundational research paper detailing the decentralized, peer-to-peer intelligence market protocol of Bittensor.',
      icon: <Layers />,
      url: 'https://bittensor.com/whitepaper',
      colorClass: 'text-[#10b981]',
      badge: 'PROTOCOL'
    },
    {
      title: 'TIPTAO',
      description: 'TIPTAO is a native support layer for the Bittensor ecosystem. It enables contributors to create public donation pages linked to their NameTensor identity.',
      icon: <Coins />,
      url: 'https://tiptao.io/',
      colorClass: 'text-[#10b981]',
      badge: 'DONATION LAYER'
    },
    {
      title: 'TAONSQUARE',
      description: 'Discover products and services powered by the Bittensor network. Directory and MCP-enabled catalog for discovering Bittensor subnet products, services, pricing, API availability, and market data.',
      icon: <Layers />,
      url: 'https://taonsquare.com/',
      colorClass: 'text-orange-500',
      badge: 'DIRECTORY'
    },
    {
      title: 'TAO.COM',
      description: 'The original Bittensor wallet app for buying TAO and trading subnet tokens.',
      icon: <Wallet />,
      url: 'https://tao.com/',
      colorClass: 'text-orange-500',
      badge: 'WALLET'
    },
    {
      title: 'TAO INSTITUTE',
      description: 'Institutional-grade Bittensor subnet analytics, rankings, and investment risk platform.',
      icon: <TrendingUp />,
      url: 'https://taoinstitute.io',
      colorClass: 'text-emerald-500',
      badge: 'ANALYTICS'
    },
    {
      title: 'TAO BUBBLES',
      description: 'Real-time visualization of Bittensor subnets and performance.',
      icon: <Layers />,
      url: 'https://taobubbles.net',
      colorClass: 'text-orange-500',
      badge: 'VISUALIZER'
    },
    {
      title: 'TAO FLUTE',
      description: 'Comprehensive overview and analytics for Bittensor subnets.',
      icon: <Layers />,
      url: 'https://taoflute.com/',
      colorClass: 'text-orange-500',
      badge: 'ANALYTICS'
    },
    {
      title: 'CRUCIBLE WALLET',
      description: 'Securely manage your TAO assets with the Crucible Wallet Chrome extension.',
      icon: <Wallet />,
      url: 'https://chromewebstore.google.com/detail/crucible-wallet/capjnhbneiilplogojhmhepiocnjpgee',
      colorClass: 'text-orange-500',
      badge: 'WALLET'
    },
    {
      title: 'TAOSTATS',
      description: 'Comprehensive block explorer and analytics dashboard for Bittensor with real-time staking, subnet, and token insights.',
      icon: <Search />,
      url: 'https://taostats.io/',
      colorClass: 'text-orange-500',
      badge: 'EXPLORER'
    },
    {
      title: 'TAOSTATS WALLET',
      description: 'The official Bittensor Chrome Wallet by Taostats.',
      icon: <Wallet />,
      url: 'https://taostats.io/bittensor-chrome-wallet',
      colorClass: 'text-orange-500',
      badge: 'WALLET'
    },
    {
      title: 'BITSTARTER',
      description: 'Bitstarter is a launchpad for the Bittensor economy. We help high-potential subnets raise capital, grow their communities, and scale faster.',
      icon: <Rocket />,
      url: 'https://www.bitstarter.ai/',
      colorClass: 'text-orange-500',
      badge: 'LAUNCHPAD'
    },
    {
      title: 'TAO.APP EXPLORER',
      description: 'Explore the TAO blockchain and track wallet activity.',
      icon: <Search />,
      url: 'https://www.tao.app/explorer',
      colorClass: 'text-orange-500',
      badge: 'EXPLORER'
    },
    {
      title: 'STILLCORE CAPITAL',
      description: 'A U.S. fund exclusively dedicated to Bittensor — bridging traditional capital to the decentralized AI revolution.',
      icon: <Building2 />,
      url: 'https://stillcorecapital.com/',
      colorClass: 'text-orange-500',
      badge: 'FUND'
    },
    {
      title: 'YUMA AI',
      description: 'Yuma powers transformative projects on Bittensor that will reshape our futures.',
      icon: <Cpu />,
      url: 'https://www.yumaai.com/',
      colorClass: 'text-orange-500',
      badge: 'INCUBATOR'
    },
    {
      title: 'SIMPLY TAO',
      description: 'Educational resources, tutorials, and deep dives into the Bittensor ecosystem.',
      icon: <Network />,
      url: 'https://simplytao.ai/blog',
      colorClass: 'text-orange-500',
      badge: 'EDUCATION'
    },
    {
      title: 'TAO DAILY',
      description: 'Daily news, key updates, and essential insights from across the Bittensor network.',
      icon: <TrendingUp />,
      url: 'https://taodaily.io/',
      colorClass: 'text-orange-500',
      badge: 'NEWS'
    },
    {
      title: 'HASHRATE PODCAST',
      description: "Mark Jeffrey's Hashrate series providing valuable insights into Bittensor Subnets and decentralized AI.",
      icon: <Youtube />,
      url: 'https://www.youtube.com/@markjeffrey',
      colorClass: 'text-[#ff0000]',
      badge: 'PODCAST'
    },
    {
      title: 'JESUS MARTINEZ CRYPTO',
      description: 'Deep dives, analysis, and insights on Bittensor (TAO) and decentralized AI.',
      icon: <Youtube />,
      url: 'https://www.youtube.com/@JesusMartinezCrypto',
      colorClass: 'text-[#ff0000]',
      badge: 'YOUTUBE'
    },
    {
      title: 'GORDON FRAYNE',
      description: 'News, reviews, and insights into the expanding Bittensor and AI ecosystem.',
      icon: <Youtube />,
      url: 'https://www.youtube.com/@gordonfrayne',
      colorClass: 'text-[#ff0000]',
      badge: 'YOUTUBE'
    },
    {
      title: 'BITTENSOR DISCORD',
      description: 'The official Discord community for Bittensor developers, miners, validators, and enthusiasts.',
      icon: <MessageSquare />,
      url: 'https://discord.com/invite/qasY3HA9F9',
      colorClass: 'text-[#5865F2]',
      badge: 'COMMUNITY'
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
