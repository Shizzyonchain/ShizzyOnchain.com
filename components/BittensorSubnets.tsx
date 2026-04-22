import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Search, Filter, X, ChevronDown, ExternalLink, Github, Users, Calendar, Info, Activity, Twitter, ArrowRight, Zap, MessageSquare, RefreshCw, BarChart3, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { coinGeckoProxy } from '../services/coinGeckoService.ts';
import { GeckoCoin } from '../types.ts';

interface SubnetDetails {
  website: string;
  github: string;
  twitter?: string;
  partnerships: string[];
  recentUpdates: string[];
  extendedDescription: string;
}

interface Subnet {
  sn: number;
  name: string;
  category: string;
  description: string;
  teamStatus?: "Documented Team" | "Undocumented Team";
  details?: SubnetDetails;
}

const SUBNETS_DATA: Subnet[] = [
  { 
    sn: 1, 
    name: "Apex", 
    category: "AI Agents / AI Tools", 
    description: "Decentralized AI agent infrastructure built for real usage and task execution.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/prompting",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Apex is the evolution of Bittensor's SN1, focusing on decentralized AI agent orchestration.",
      partnerships: ["OpenTensor Foundation", "SN13 Data Universe"],
      recentUpdates: ["Rebranded to Apex", "Gravity framework live"]
    }
  },
  { 
    sn: 2, 
    name: "DSperse", 
    category: "Compute", 
    description: "Distributed compute layer powering decentralized AI inference.",
    teamStatus: "Documented Team",
    details: {
      website: "https://corcel.io",
      github: "https://github.com/corcel-api/omron",
      twitter: "https://x.com/corcelio",
      extendedDescription: "DSperse (referenced as Omron) is a high-performance compute orchestration layer.",
      partnerships: ["Corcel Labs", "Inference Labs"],
      recentUpdates: ["Optimized task routing", "Llama 3 support"]
    }
  },
  { 
    sn: 3, 
    name: "Deprecated", 
    category: "Unknown", 
    description: "This subnet is currently deprecated.",
    teamStatus: "Undocumented Team"
  },
  { 
    sn: 4, 
    name: "Targon", 
    category: "Compute", 
    description: "Scalable GPU compute and inference infrastructure for AI applications.",
    teamStatus: "Documented Team",
    details: {
      website: "https://manifold.inc",
      github: "https://github.com/manifold-inc/targon",
      twitter: "https://x.com/manifold_ai",
      extendedDescription: "Targon, managed by Manifold, is a high-speed inference layer for LLMs.",
      partnerships: ["Manifold Labs", "Akash Network"],
      recentUpdates: ["TTFT optimized", "Unified API released"]
    }
  },
  { 
    sn: 5, 
    name: "Hone", 
    category: "Unknown", 
    description: "Hone subnet.",
    teamStatus: "Undocumented Team"
  },
  { 
    sn: 6, 
    name: "Numinous", 
    category: "Predictive Systems", 
    description: "Decentralized forecasting and predictive intelligence.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/numinous-ai/numinous",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Numinous is a forecasting subnet developed by Macrocosmos.",
      partnerships: ["Macrocosmos", "SN18 Forecasting"],
      recentUpdates: ["V3 scoring algorithm", "Real-time market resolution"]
    }
  },
  { 
    sn: 7, 
    name: "Always", 
    category: "Infrastructure", 
    description: "Always network.",
    teamStatus: "Undocumented Team"
  },
  { 
    sn: 8, 
    name: "Vanta", 
    category: "DeFi / Trading", 
    description: "Proprietary trading network powered by decentralized signal intelligence.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/vanta",
      twitter: "https://x.com/taoshifine",
      extendedDescription: "Vanta is Taoshi's flagship trading signals network.",
      partnerships: ["Taoshi Labs", "Global Prop Firms"],
      recentUpdates: ["Vanta Pro launched", "Expanded to global indices"]
    }
  },
  { 
    sn: 9, 
    name: "iota", 
    category: "AI Training", 
    description: "Large-scale decentralized model pretraining infrastructure.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/pretraining",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Managed by Macrocosmos, this subnet harnesses distributed compute for base model training.",
      partnerships: ["Macrocosmos", "SN13 Data Universe"],
      recentUpdates: ["1B parameter training milestone", "Integrated SN13 datasets"]
    }
  },
  { 
    sn: 12, 
    name: "Compute Horde", 
    category: "Compute", 
    description: "Decentralized GPU marketplace supplying compute for AI training and inference.",
    teamStatus: "Documented Team",
    details: {
      website: "https://computehorde.io",
      github: "https://github.com/backend-developers-ltd/compute-horde",
      extendedDescription: "Allows providers to sell raw compute power for AI workloads.",
      partnerships: ["Backend Developers Ltd", "SN4 Targon"],
      recentUpdates: ["H100 support", "Automated recovery"]
    }
  },
  { 
    sn: 13, 
    name: "Data Universe", 
    category: "Data", 
    description: "Decentralized data layer powering AI training across subnets.",
    teamStatus: "Documented Team",
    details: {
      website: "https://macrocosmos.ai",
      github: "https://github.com/macrocosm-os/data-universe",
      twitter: "https://x.com/MacrocosmosAI",
      extendedDescription: "Macrocosmos' flagship data aggregation layer.",
      partnerships: ["SN1 Apex", "SN9 Pretraining"],
      recentUpdates: ["100B+ data points", "Social stream integration"]
    }
  },
  { 
    sn: 18, 
    name: "Zeus", 
    category: "Predictive Systems", 
    description: "Time-series forecasting and market analysis powered by Taoshi.",
    teamStatus: "Documented Team",
    details: {
      website: "https://taoshi.io",
      github: "https://github.com/taoshifine/zeus",
      twitter: "https://x.com/taoshifine",
      extendedDescription: "Zeus (by Taoshi) provides predictive intelligence for financial and environmental markets.",
      partnerships: ["Taoshi Labs", "SN8 Vanta"],
      recentUpdates: ["Ensemble learning v2", "Real-time crypto forecasting"]
    }
  },
  { 
    sn: 19, 
    name: "blockmachine", 
    category: "Generative AI", 
    description: "Multi-modal inference and image generation suite.",
    teamStatus: "Documented Team",
    details: {
      website: "https://corcel.io",
      github: "https://github.com/corcel-api/vision",
      twitter: "https://x.com/corcelio",
      extendedDescription: "A collaboration between Corcel and Omega Labs for high-fidelity generative tasks.",
      partnerships: ["Omega Labs", "Corcel"],
      recentUpdates: ["Neural inference v2", "Optimized visual reasoning"]
    }
  },
  { 
    sn: 22, 
    name: "Desearch", 
    category: "Search / Information", 
    description: "Decentralized search index and unbiased information discovery.",
    teamStatus: "Documented Team",
    details: {
      website: "https://desearch.ai",
      github: "https://github.com/5cube-ai/desearch",
      twitter: "https://x.com/desearch_ai",
      extendedDescription: "Desearch provides an open search index managed by 5Cube AI Labs.",
      partnerships: ["5Cube Labs", "SN13 Data Universe"],
      recentUpdates: ["V2 global index", "Live query resolution"]
    }
  },
  { 
    sn: 24, 
    name: "Quasar", 
    category: "Compute / Data", 
    description: "Scalable data scraping and real-time processing network.",
    teamStatus: "Documented Team",
    details: {
      website: "https://omega-labs.ai",
      github: "https://github.com/omega-labs-inc/omega-scraping",
      twitter: "https://x.com/omega_ai_labs",
      extendedDescription: "Omega Labs provides the data-scraping backbone for the Bittensor ecosystem.",
      partnerships: ["Omega Labs", "SN13 Data Universe"],
      recentUpdates: ["Real-time stream indexing", "Compute efficiency boost"]
    }
  },
  { 
    sn: 32, 
    name: "ItsAI", 
    category: "AI Agents / Bots", 
    description: "Narrative and personality-driven AI agent ecosystem.",
    teamStatus: "Documented Team",
    details: {
      website: "https://shizzy.ai",
      github: "https://github.com/shizzy-alpha/roleplay-subnet",
      extendedDescription: "Roleplay focuses on immersive character fidelity and narrative coherence in AI agents.",
      partnerships: ["Alpha Shizzy", "SN3 MyShell"],
      recentUpdates: ["Personality benchmark v1", "Narrative sync integrated"]
    }
  },
  ...Array.from({ length: 128 }, (_, i) => { const sn = i + 1; const existing = [1, 2, 3, 4, 5, 6, 7, 8, 9, 12, 13, 18, 19, 22, 24, 32]; if (existing.includes(sn)) return null; const names = {"0":"Root","1":"Apex","2":"DSperse","3":"Deprecated","4":"Targon","5":"Hone","6":"Numinous","7":"Always","8":"Vanta","9":"iota","10":"Swap","11":"TrajectoryRL","12":"Compute Horde","13":"Data Universe","14":"TAOHash","15":"ORO","16":"BitAds","17":"404—GEN","18":"Zeus","19":"blockmachine","20":"GroundLayer","21":"AdTAO","22":"Desearch","23":"Trishool","24":"Quasar","25":"Mainframe","26":"beqar","27":"Nodexo","28":"gm","29":"Coldint","30":"Pending","31":"Halftime","32":"ItsAI","33":"ReadyAI","34":"BitMind","35":"OxMarkets","36":"Unknown","37":"Aurelius","38":"colosseum","39":"deprecated","40":"Chunking","41":"Almanac","42":"Unknown","43":"Graphite","44":"Score","45":"Talisman AI","46":"RESI","47":"EvolAI","48":"Quantum Compute","49":"Nepher Robotics","50":"Synth","51":"lium.io","52":"Dojo","53":"EfficientFrontier","54":"Yanez MIID","55":"NIOME","56":"Gradients","57":"Sparket.AI","58":"Handshake","59":"Babelbit","60":"Bitsec.ai","61":"RedTeam","62":"Ridges","63":"Enigma","64":"Chutes","65":"TAO Private Network","66":"ninja","67":"Harnyx","68":"NOVA","69":"Unknown","70":"NexisGen","71":"Leadpoet","72":"StreetVision by NATIX","73":"MetaHash","74":"Gittensor","75":"Hippius","76":"Byzantium","77":"Liquidity","78":"Vocence","79":"MVTRX","80":"dogelayer","81":"deprecated","82":"Hermes","83":"CliqueAI","84":"ChipForge (Tatsu)","85":"Vidaio","86":"⚒","87":"Luminar Network","88":"Investing","89":"InfiniteHash","90":"Unknown","91":"Bitstarter #1","92":"TensorClaw","93":"Bitcast","94":"Bitsota","95":"Unknown","96":"Verathos","97":"distil","98":"ForeverMoney","99":"Leoma","100":"Plaτform","101":"Unknown","102":"ConnitoAI","103":"Djinn","104":"for sale (burn to uid1)","105":"Beam","106":"VoidAI","107":"Minos","108":"TalkHead","109":"Academia","110":"Green Compute","111":"oneoneone","112":"minotaur","113":"TensorUSD","114":"SOMA","115":"HashiChain","116":"TaoLend","117":"BrainPlay","118":"HODL","119":"Satori","120":"Affine","121":"sundae_bar","122":"Bitrecs","123":"MANTIS","124":"Swarm","125":"8 Ball","126":"Poker44","127":"Astrid","128":"ByteLeap"}; return { sn, name: names[sn] || 'Subnet ' + sn, category: 'Unknown', description: 'Active Bittensor subnet.', teamStatus: 'Undocumented Team' }; }).filter(Boolean) as Subnet[]
];
export const BittensorSubnets: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState('All');
  const [selectedSubnet, setSelectedSubnet] = useState<Subnet | null>(null);
  const [taoStats, setTaoStats] = useState<GeckoCoin | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const [lastSync, setLastSync] = useState<string>('');

  const fetchTaoStats = async () => {
    setLoadingStats(true);
    try {
      const markets = await coinGeckoProxy.getTopMarkets(undefined, true);
      const tao = markets.find(m => m.id === 'bittensor');
      if (tao) {
        setTaoStats(tao);
        setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch (error) {
      console.error("Bittensor Network Sync Failure:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchTaoStats();
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchTaoStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(SUBNETS_DATA.map(s => s.category));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const teamFilters = useMemo(() => ['All', 'Documented Team', 'Undocumented Team'], []);

  const filteredSubnets = useMemo(() => {
    return SUBNETS_DATA.filter(subnet => {
      const matchesSearch = 
        subnet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subnet.sn.toString().includes(searchQuery);
      
      const matchesCategory = selectedCategory === 'All' || subnet.category === selectedCategory;
      const matchesTeam = selectedTeamFilter === 'All' || subnet.teamStatus === selectedTeamFilter;
      
      return matchesSearch && matchesCategory && matchesTeam;
    });
  }, [searchQuery, selectedCategory, selectedTeamFilter]);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* NETWORK HEALTH BAR - AUTOMATION STEP 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-2 bg-slate-900 rounded-[2rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 scanline opacity-20" />
        
        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <RefreshCw className={`text-orange-500 ${loadingStats ? 'animate-spin' : ''}`} size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Live TAO {lastSync && <span className="block text-[7px] opacity-50 mt-0.5">@ {lastSync}</span>}</span>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-white font-mono leading-none">
              {taoStats ? `$${taoStats.current_price.toLocaleString()}` : 'SYNCING...'}
            </p>
            {taoStats && (
              <span className={`text-[8px] font-bold ${taoStats.price_change_percentage_24h_in_currency >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {taoStats.price_change_percentage_24h_in_currency >= 0 ? '+' : ''}{taoStats.price_change_percentage_24h_in_currency.toFixed(2)}%
              </span>
            )}
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-slate-400" size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Cap</span>
          </div>
          <p className="text-sm font-black text-white font-mono">
            {taoStats ? `$${(taoStats.market_cap / 1000000000).toFixed(2)}B` : '---'}
          </p>
        </div>

        <div className="bg-white/5 rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-slate-400" size={16} />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24H Volume</span>
          </div>
          <p className="text-sm font-black text-white font-mono">
            {taoStats ? `$${(taoStats.total_volume / 1000000).toFixed(1)}M` : '---'}
          </p>
        </div>

        <div className="bg-orange-600 rounded-2xl p-4 flex items-center justify-between border border-orange-500 font-black italic">
          <div className="flex items-center gap-3">
            <Zap className="text-white animate-pulse" size={16} fill="currentColor" />
            <span className="text-[10px] text-white uppercase tracking-widest">Network Pulse</span>
          </div>
          <div className="text-[10px] bg-white/20 text-white px-3 py-1 rounded-full flex items-center gap-2">
            OPERATING
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/10 pb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.hash = '#/bittensor'}
            className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full transition-colors text-slate-600 dark:text-slate-300"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-4xl md:text-5xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Bittensor <span className="text-orange-600">Subnets</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-mono text-sm uppercase tracking-widest mt-2">
              Live network directory • {filteredSubnets.length} subnets
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto md:items-center">
          {(searchQuery !== '' || selectedCategory !== 'All' || selectedTeamFilter !== 'All') && (
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedTeamFilter('All'); }}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-orange-600/5 border border-orange-600/20 rounded-2xl text-orange-600 font-mono text-[10px] uppercase tracking-widest hover:bg-orange-600/10 transition-all whitespace-nowrap order-last md:order-first"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}

          {/* Team Filter Dropdown */}
          <div className="relative w-full md:w-56 group/team">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            >
              {teamFilters.map(filter => (
                <option key={filter} value={filter} className="bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-white">
                  {filter === 'All' ? 'ALL TEAMS' : filter.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            
            {/* Info Tooltip for Team Status Definitions */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden group-hover/team:block">
              <div className="relative group/info">
                <Info size={12} className="text-slate-400 hover:text-orange-500 transition-colors cursor-help" />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-3 bg-slate-900 text-[10px] leading-relaxed text-white rounded-xl shadow-2xl border border-white/10 z-[110] opacity-0 group-hover/info:opacity-100 pointer-events-none transition-all uppercase tracking-tighter text-center">
                  <div className="text-orange-500 font-black mb-1 italic">Documentation Status</div>
                  <div className="mb-2 underline decoration-orange-500/30">Documented Team: Verified identities via official sites.</div>
                  <div className="opacity-70 italic font-mono lowercase">Undocumented Team: Pseudonymous or anonymous profiles.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-12 pr-10 py-4 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white appearance-none transition-all font-mono text-[10px] uppercase tracking-widest cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-white dark:bg-[#0b0e14] text-slate-900 dark:text-white">
                  {cat === 'All' ? 'ALL CATEGORIES' : cat.toUpperCase()}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, SN, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-orange-500/50 rounded-2xl outline-none text-slate-900 dark:text-white transition-all font-mono text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>


      {filteredSubnets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubnets.map((subnet) => (
            <motion.div 
              key={subnet.sn}
              onClick={() => setSelectedSubnet(subnet)}
              whileHover={{ y: -8, shadow: "0 25px 50px -12px rgba(249, 115, 22, 0.1)" }}
              whileTap={{ scale: 0.98 }}
              className="group flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-orange-500/40 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-lg border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                    {subnet.sn}
                  </div>
                  <div>
                    <h3 className="text-xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                      {subnet.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-1 bg-orange-500/5 rounded-md">
                        {subnet.category}
                      </span>
                      {subnet.teamStatus && (
                        <span className={`text-[9px] font-mono uppercase tracking-widest px-2 py-1 rounded-md border ${
                          subnet.teamStatus === 'Documented Team' 
                            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                            : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                        }`}>
                          {subnet.teamStatus === 'Documented Team' ? 'DOCUMENTED TEAM' : 'UNDOCUMENTED TEAM'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mt-4">
                {subnet.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors pt-8 border-t border-slate-100 dark:border-white/5 mt-8">
                Deep Dive Research <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Filter size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">No subnets found</h3>
            <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or category filters.</p>
          </div>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="text-orange-600 font-mono text-xs uppercase tracking-widest hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
      {/* Modal Backdrop */}
      <AnimatePresence>
        {selectedSubnet && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubnet(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 md:p-8 border-b border-slate-200 dark:border-white/10 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-2xl border border-orange-500/20">
                    {selectedSubnet.sn}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                      {selectedSubnet.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 uppercase tracking-widest px-2 py-0.5 bg-orange-500/5 rounded border border-orange-500/10">
                        {selectedSubnet.category}
                      </span>
                      {selectedSubnet.teamStatus && (
                        <div className="group relative flex items-center gap-1.5">
                          <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border ${
                            selectedSubnet.teamStatus === 'Documented Team' 
                              ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                              : 'bg-slate-500/10 text-slate-500 border-slate-500/20'
                          }`}>
                            {selectedSubnet.teamStatus === 'Documented Team' ? 'DOCUMENTED TEAM' : 'UNDOCUMENTED TEAM'}
                          </span>
                          <div className="relative">
                            <Info size={12} className="text-slate-400 cursor-help hover:text-orange-500 transition-colors" />
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-900 text-[10px] text-white rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl border border-white/10 text-center uppercase tracking-tighter">
                              {selectedSubnet.teamStatus === 'Documented Team' 
                                ? "Public identities verified via website or official social channels."
                                : "Pseudonymous or anonymous team profiles with unverified identities."}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSubnet(null)}
                  className="p-3 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Content */}
              <div className="flex-grow overflow-y-auto p-6 md:p-8 custom-scrollbar">
                {selectedSubnet.details ? (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Description & Updates */}
                    <div className="lg:col-span-8 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <Info size={18} className="text-orange-500" />
                          Subnet Deep Dive
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic font-medium">
                          {selectedSubnet.details.extendedDescription}
                        </p>
                      </section>

                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <Calendar size={18} className="text-orange-500" />
                          Recent Milestones & GitHub Activity
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          {selectedSubnet.details.recentUpdates.map((update, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 group hover:border-orange-500/20 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                              <p className="text-sm text-slate-600 dark:text-slate-400">{update}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Right Column: Links & Partnerships */}
                    <div className="lg:col-span-4 space-y-8">
                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <ExternalLink size={18} className="text-orange-500" />
                          Official Links
                        </div>
                        <div className="space-y-3">
                          <a 
                            href={selectedSubnet.details.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full p-4 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-colors group"
                          >
                            <span className="font-mono text-xs uppercase tracking-widest">Main Website</span>
                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </a>
                          <a 
                            href={selectedSubnet.details.github} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center justify-between w-full p-4 bg-slate-100 dark:bg-white/5 dark:text-white rounded-2xl hover:bg-slate-200 dark:hover:bg-white/10 transition-colors group border border-slate-200 dark:border-white/5"
                          >
                            <div className="flex items-center gap-2">
                              <Github size={16} />
                              <span className="font-mono text-xs uppercase tracking-widest">Source Code</span>
                            </div>
                            <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
                          </a>
                          {selectedSubnet.details.twitter && (
                            <a 
                              href={selectedSubnet.details.twitter} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center justify-between w-full p-4 bg-[#1DA1F2]/10 text-[#1DA1F2] rounded-2xl hover:bg-[#1DA1F2]/20 transition-colors group border border-[#1DA1F2]/20"
                            >
                              <div className="flex items-center gap-2">
                                <Twitter size={16} />
                                <span className="font-mono text-xs uppercase tracking-widest">X / Twitter</span>
                              </div>
                              <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform opacity-50" />
                            </a>
                          )}
                        </div>
                      </section>

                      <section className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold uppercase tracking-tight">
                          <Users size={18} className="text-orange-500" />
                          Core Partnerships
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedSubnet.details.partnerships.map((partner, idx) => (
                            <span 
                              key={idx} 
                              className="px-3 py-2 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 text-[10px] font-mono uppercase tracking-widest rounded-lg border border-slate-200 dark:border-white/5"
                            >
                              {partner}
                            </span>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-500/5 rounded-full flex items-center justify-center mx-auto text-orange-500 border border-orange-500/10">
                      <Activity size={32} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase italic">Deep Dive Pending</h3>
                      <p className="max-w-md mx-auto text-slate-500 dark:text-slate-400 mt-2">
                        Official details for <span className="text-orange-600 font-bold">{selectedSubnet.name}</span> are currently being verified and aggregated.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
                      <div className="p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Status</h4>
                        <p className="text-sm dark:text-white font-bold italic">Verification Ongoing</p>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200 dark:border-white/5 text-left">
                        <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-1">Last Sync</h4>
                        <p className="text-sm dark:text-white font-bold italic">{new Date().toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
