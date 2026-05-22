import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  TrendingUp, 
  Gauge, 
  Terminal, 
  Users, 
  Flame, 
  ArrowUpRight, 
  Activity, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Workflow, 
  ShieldAlert,
  ArrowRight,
  BookOpen,
  Eye,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';

interface ScreenData {
  id: string;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  plainEnglish: string;
  masterClass: string;
  details: string;
  howToUse: string;
  strongSigns: string[];
  watchOut: string;
}

export const AlphaGapExplanation: React.FC = () => {
  const [activeScreenTab, setActiveScreenTab] = useState<string>('score');
  const [activeSetupTab, setActiveSetupTab] = useState<string>('best');
  const [selectedScreenModal, setSelectedScreenModal] = useState<ScreenData | null>(null);

  // External referral link
  const alphagapUrl = "https://alphagap.io/?ref=SHIZ";

  const screens: ScreenData[] = [
    {
      id: 'score',
      title: 'AlphaGap Score',
      icon: <Zap size={22} />,
      colorClass: 'text-[#10b981] bg-[#10b981]/15',
      plainEnglish: 'Is this subnet doing more than price gives it credit for?',
      masterClass: 'AlphaGap Score is the main radar. It tells you where the opportunity gap might be, but then you still have to research why.',
      details: 'Identifies subnets where technical and fundamental indicators are stronger than the current market valuation / price level.',
      howToUse: 'Start here to find subnets worth deeper research. A high score suggests it\'s time to drill into the adjacent matrices.',
      strongSigns: [
        'High base AlphaGap Score',
        'Score trending upwards over multiple intervals',
        'Strong underlying development index',
        'Real-world product evidence is present',
        'Current valuation is in early baseline phase'
      ],
      watchOut: 'A high score is not a buy button. You must examine liquidity, actual product metrics, emissions, and whether the score is currently expanding or fading.'
    },
    {
      id: 'flow',
      title: 'Flow / Momentum',
      icon: <TrendingUp size={22} />,
      colorClass: 'text-emerald-400 bg-emerald-400/15',
      plainEnglish: 'Are buyers actually showing up?',
      masterClass: 'Flow tells you whether the market is starting to care. Fundamentals can be strong, but Flow shows whether capital is actually moving.',
      details: 'Tracks volume surges, onchain accumulation trends, smart money/whale transfers, and structural price momentum across multiple key timeframes.',
      howToUse: 'Use Flow as physical confirmation. A strong AlphaGap score coupled with rising Flow means the market index is waking up and aligning with underlying strength.',
      strongSigns: [
        'Sustained rising volume',
        'Positive net taker buy pressure',
        'Whale and protocol builder accumulation',
        'Consolidated strength across hourly, daily, and weekly timeframes'
      ],
      watchOut: 'A single, high-magnitude candle is not sustained flow. Watch out for thin orderbooks, influencer pump dynamics, or hidden whales distributing behind short term pumps.'
    },
    {
      id: 'velocity',
      title: 'Velocity',
      icon: <Gauge size={22} />,
      colorClass: 'text-teal-400 bg-teal-400/15',
      plainEnglish: 'Is the setup waking up fast, or is it fading?',
      masterClass: 'Velocity is the acceleration meter. It tells you whether a setup is heating up right now instead of just looking good on an old score.',
      details: 'Measures the rate of change and momentum acceleration of a subnet\'s score. Shift structures (e.g., jumping from 50 to 80 points) represent immediate momentum.',
      howToUse: 'Catch immediate inflection points. If Velocity rises while the base AlphaGap Score and corresponding metrics are strong, that signal warrants immediate focus.',
      strongSigns: [
        'Velocity accelerating rapidly upwards',
        'Base AlphaGap score remains in premium territory',
        'Flow and liquidity density is steadily expanding',
        'Social and development index staying solid'
      ],
      watchOut: 'Velocity spikes are fleeting. They can drop to zero instantly if they aren\'t backed by a functional product, stable emission changes, or high-conviction capital.'
    },
    {
      id: 'dev',
      title: 'Development',
      icon: <Terminal size={22} />,
      colorClass: 'text-blue-400 bg-blue-400/15',
      plainEnglish: 'Are they actually building, or just talking?',
      masterClass: 'Development is the anti-hype check. It shows whether there is real work happening behind the scenes.',
      details: 'Audit log of continuous development directly on GitHub/HuggingFace. This metrics profiles code quality, deployment speed, and operational releases.',
      howToUse: 'Separate smoke from execution weight. Cross-reference high scores against actual code modifications, raw contributors, and model weight upgrades.',
      strongSigns: [
        'Consistent and non-cosmetic commits',
        'Closed pull requests and structural code review logs',
        'Functional new releases and model changes',
        'Multiple active, credentialed project contributors',
        'Direct HuggingFace or open model checkpoint updates'
      ],
      watchOut: 'Beware of dummy or cosmetic commits (e.g., editing README files repeatedly to fake output), completely abandoned repositories, or loud marketing statements with empty repos.'
    },
    {
      id: 'product',
      title: 'Product & Utility',
      icon: <Activity size={22} />,
      colorClass: 'text-cyan-400 bg-cyan-400/15',
      plainEnglish: 'Is this becoming a real product with real demand?',
      masterClass: 'Product & Utility is the early alpha detector. Development means they are building. Product means the thing they are building may actually matter.',
      details: 'Measures product maturity, ecosystem integration steps, verified developer API usage, client request throughput, and real-world demand indications.',
      howToUse: 'Differentiate simple speculative shells from actual operating utilities. Verify whether a subnet has external entities paying for its outputs, APIs, or physical computational metrics.',
      strongSigns: [
        'Regular volume of queries and client requests',
        'Third-party external integrations and frontends',
        'Verified enterprise or protocol sandbox customers',
        'Solid competitive performance on objective benchmarks',
        'Measurable revenue signals and payment flows'
      ],
      watchOut: 'High development activity with zero users is typical of early networks. A subnet that solely survives on speculative incentive emissions without external demand is highly vulnerable.'
    },
    {
      id: 'social',
      title: 'Social',
      icon: <Users size={22} />,
      colorClass: 'text-purple-400 bg-purple-400/15',
      plainEnglish: 'Is awareness building?',
      masterClass: 'Social is the attention layer. It helps you see when the story is spreading, but social alone is not substance.',
      details: 'Aggregated social footprint, prominent key opinion leader (KOL) sentiment analysis, ecosystem community discussions, or general discussion volume on X and Discord.',
      howToUse: 'Layer in Social only after verifying Product and Development. Narrative tailwinds are most effective and permanent when confirming a real fundamental change.',
      strongSigns: [
        'In-depth breakdown threads by respected practitioners',
        'Clear, constructive technical updates from team founders',
        'Organic discussion scaling inside developer groups',
        'Cohesive catalyst alignment discussed by multiple unrelated channels'
      ],
      watchOut: 'Social activity is often a trailing indicator or outright manipulation. Paid marketing channels, hyper-coordinated marketing schemes, or narrative noise with zero product substantiation are clear trap zones.'
    },
    {
      id: 'emissions',
      title: 'Emission Change',
      icon: <Flame size={22} />,
      colorClass: 'text-rose-400 bg-rose-400/15',
      plainEnglish: 'Is the network rewarding this subnet more than before?',
      masterClass: 'Emission Change shows network conviction. In Bittensor, emissions matter because they are resource allocation, not just attention.',
      details: 'Real-time allocation variance of the network-wide emissions. Positive direction indicates key validators are actively dedicating more consensus delegation weights block-by-block.',
      howToUse: 'Match overall network allocation shifts against retail market valuation. Increasing emissions paired with top-tier product dynamics validates subnet trajectory.',
      strongSigns: [
        'Positive delta in delegated emission weights',
        'High code execution score and validator alignment',
        'Emissions rising concurrently with product/utility utility expansion',
        'Top-tier validators staking long-term conviction'
      ],
      watchOut: 'Negative emission deltas combined with stagnant social metric and velocity decreases is a danger warning. Emissions can also contain transient, temporary noise.'
    }
  ];

  const setups = [
    {
      id: 'best',
      name: 'Best Setup',
      desc: 'The ultimate convergent setup where all radars are aligned simultaneously.',
      formula: 'High Score + High Dev + High Utility + Rising Flow + Rising Velocity + Green Emissions',
      consequence: 'This forms the absolute highest quality research profile. It is not an automatic buy indicator, but it signifies that the AlphaGap radar has hit lock-on status.',
      color: 'border-[#10b981] bg-[#10b981]/5 text-[#10b981]'
    },
    {
      id: 'sleeper',
      name: 'Early Sleeper',
      desc: 'High-quality engineering blocks operating ahead of public interest.',
      formula: 'High Dev + High Product/Utility + Low Social',
      consequence: 'This profile is highly favored by macro-focused players. It points out extreme fundamental action happening in complete silence before the public retail narrative hits.',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-400'
    },
    {
      id: 'momentum',
      name: 'Momentum Setup',
      desc: 'Technically waking up with strong velocity surges.',
      formula: 'High AlphaGap Score + Rising Flow + Rising Velocity',
      consequence: 'The market is starting to establish physical buy pressure. The setup is accelerating, creating liquid structural trends.',
      color: 'border-teal-500/30 bg-teal-500/5 text-teal-400'
    },
    {
      id: 'rotation',
      name: 'Network Rotation',
      desc: 'Consensus voting shifts prior to market validation.',
      formula: 'Green Emissions + Rising Flow + Rising Velocity',
      consequence: 'Indicates the overarching Bittensor validator consensus is voting to redirect emissions to this subnet before the market recognizes the move. Very powerful onchain indicator.',
      color: 'border-orange-500/30 bg-orange-500/5 text-orange-400'
    },
    {
      id: 'trap',
      name: 'Hype Trap',
      desc: 'Saturated visual presence completely void of core engineering.',
      formula: 'High Social + Weak Dev + Weak Product + No Flow + No Emissions',
      consequence: 'A core caution profile. Hype with no back-end delivery is extremely fragile and prone to fast degradation.',
      color: 'border-rose-500/30 bg-rose-500/5 text-rose-400'
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16 space-y-16">
      
      {/* Header Section */}
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-[#10b981]/10 text-[#10b981] text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-[#10b981]/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
          <Sparkles size={11} className="animate-pulse" />
          RESEARCH TERMINAL CODENAME: ALPHAGAP
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
          ALPHAGAP <span className="text-[#10b981]">MASTER CLASS</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed">
          The ultimate analytical radar designed to measure Bittensor subnets. Learn the exact frameworks to spot opportunity gaps between code fundamentals and market pricing.
        </p>

        {/* Big Entry Call to Action */}
        <div className="pt-4">
          <motion.a 
            href={alphagapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-10 py-5 bg-[#10b981] hover:bg-[#0fa370] text-white font-black uppercase tracking-[0.18em] text-sm rounded-2xl shadow-xl shadow-[#10b981]/15 transition-all cursor-pointer border border-[#10b981]/50"
          >
            LAUNCH ALPHAGAP INTEL TERMINAL
            <ArrowUpRight size={18} />
          </motion.a>
        </div>
      </div>

      {/* Main Idea Hero Callout */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#061a14] to-[#010907] border border-[#10b981]/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          <div className="p-6 rounded-3xl bg-[#10b981]/10 border border-[#10b981]/30 shrink-0 text-[#10b981]">
            <BookOpen size={48} className="animate-pulse" />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-[#10b981]">THE LOGICAL MANDATE</h3>
            <h2 className="text-3xl md:text-4xl font-black font-space italic uppercase tracking-tight text-white leading-tight">
              Is this subnet doing more in fundamentals than the market is currently pricing in?
            </h2>
            <p className="text-slate-400 font-inter leading-relaxed max-w-3xl">
              That copy is the single, core thesis of AlphaGap. It acts as an active search radar across Bittensor subnets. Let's discard single-dimensional metrics. Real alpha is formed when multiple crucial vectors converge.
            </p>
          </div>
        </div>

        {/* Matrix indicators */}
        <div className="mt-12 pt-8 border-t border-white/[0.05] grid grid-cols-2 md:grid-cols-5 gap-6">
          {[
            { label: 'STRONG FUNDAMENTALS', icon: <Terminal size={14} /> },
            { label: 'REAL PRODUCT USAGE', icon: <Activity size={14} /> },
            { label: 'MARKET FLOW', icon: <TrendingUp size={14} /> },
            { label: 'RISING ATTENTION', icon: <Users size={14} /> },
            { label: 'EMISSION VELOCITY', icon: <Flame size={14} /> }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-4 bg-white/[0.02] rounded-2xl border border-white/5">
              <div className="text-[#10b981] flex items-center gap-1.5 font-mono text-[10px] font-bold">
                {item.icon} {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="text-xs font-black uppercase tracking-wider text-slate-300 font-space italic">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 7 Interactive Screens Breakdown */}
      <div className="space-y-10">
        <div className="text-center md:text-left space-y-3">
          <h2 className="text-3xl md:text-5xl font-black font-space italic uppercase tracking-tight text-slate-900 dark:text-white leading-none">
            THE SEVEN RADAR SCREENS
          </h2>
          <p className="text-[#10b981] font-mono text-xs uppercase tracking-[0.3em] font-black">
            DEEP-DIVE METRICS AND PLAYBOOKS
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-[#10b981] text-xs font-mono uppercase rounded-xl border border-[#10b981]/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]"></span>
              </span>
              💡 <span className="font-bold">INACTIVE CHECK FIXED:</span> CLICK ANY METRIC BUTTON TO OPEN THE DETAILED INTERACTIVE STUDY POPUP
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Tabs Column */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {screens.map((screen) => {
              const isActive = activeScreenTab === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setActiveScreenTab(screen.id);
                    setSelectedScreenModal(screen);
                  }}
                  className={`flex items-center justify-between p-5 rounded-2xl border text-left transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer hover:shadow-lg ${
                    isActive 
                      ? 'bg-gradient-to-r from-[#0a231b] to-[#04100c] border-[#10b981] text-white shadow-lg' 
                      : 'bg-white dark:bg-[#0b0e14] border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                  title="Click to open popup details"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isActive ? 'text-[#10b981] bg-white/15' : screen.colorClass
                    }`}>
                      {screen.icon}
                    </div>
                    <div>
                      <span className={`block text-[14px] font-black uppercase tracking-wider font-space italic ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-300'}`}>
                        {screen.title}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-[#10b981]/80 uppercase block mt-0.5 animate-pulse">
                        ✦ Click to open popup
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`${isActive ? 'text-[#10b981] scale-125' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Details Screen Panel */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {screens.map((screen) => {
                if (screen.id !== activeScreenTab) return null;
                return (
                  <motion.div
                    key={screen.id}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedScreenModal(screen)}
                    className="p-8 md:p-10 bg-white dark:bg-[#080b0f] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden cursor-pointer hover:border-[#10b981]/40 transition-all duration-300 group"
                    title="Click to expand popup screen"
                  >
                    {/* Floating top badge */}
                    <div className="absolute right-6 top-6 z-10 flex items-center gap-2 px-3 py-1 bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 rounded-full text-[9px] font-mono font-black uppercase tracking-widest animate-pulse">
                      <Sparkles size={10} /> LAUNCH POPUP TERMINAL
                    </div>

                    {/* Decorative Watermark Grid */}
                    <div className="absolute right-0 top-0 text-[10rem] font-black font-space italic uppercase tracking-tighter text-slate-100 dark:text-white/[0.01] pointer-events-none select-none translate-x-12 -translate-y-12">
                      {screen.id.substring(0, 4)}
                    </div>
                    
                    {/* Header line of tab */}
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6">
                      <div className={`p-4 rounded-2xl ${screen.colorClass}`}>
                        {screen.icon}
                      </div>
                      <div>
                        <div className="text-[10px] font-mono tracking-[0.3em] text-[#10b981] uppercase font-black">RADAR SCREEN SECTION</div>
                        <h3 className="text-3xl font-black font-space uppercase italic text-slate-900 dark:text-white tracking-tight">
                          {screen.title}
                        </h3>
                      </div>
                    </div>

                    {/* Plain English & Master Class callout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div className="p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl space-y-2">
                        <div className="text-[10px] font-mono font-black uppercase text-[#10b981] tracking-wider flex items-center gap-2">
                          <Eye size={12} /> PLAIN ENGLISH PROBING
                        </div>
                        <p className="text-base font-black font-space italic uppercase tracking-tight text-slate-800 dark:text-slate-200">
                          "{screen.plainEnglish}"
                        </p>
                      </div>

                      <div className="p-5 bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl space-y-2">
                        <div className="text-[10px] font-mono font-black uppercase text-[#10b981] tracking-wider flex items-center gap-2">
                          <BookOpen size={12} /> MASTER CLASS INSIGHT
                        </div>
                        <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-[#10b981]/80">
                          {screen.masterClass}
                        </p>
                      </div>
                    </div>

                    {/* How to use */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#10b981]">OPERATIONAL HANDBOOK (HOW TO USE IT)</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400 font-inter leading-relaxed whitespace-pre-line">
                        {screen.howToUse}
                      </p>
                    </div>

                    {/* Strong Signs & Warnings Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
                      
                      {/* Positive Signs */}
                      <div className="md:col-span-7 space-y-4">
                        <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 size={14} /> EXTREME CONVIXION SIGNALS
                        </h5>
                        <ul className="space-y-2">
                          {screen.strongSigns.map((sign, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400">
                              <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5 font-bold font-mono text-[9px] w-4.5 h-4.5 flex items-center justify-center">
                                {idx + 1}
                              </span>
                              <span className="font-medium leading-relaxed">{sign}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Warnings */}
                      <div className="md:col-span-5 p-5 bg-rose-500/[0.03] border border-rose-500/10 rounded-2xl space-y-3">
                        <h5 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                          <ShieldAlert size={14} /> CAUTION PROFILE
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-rose-400/80 font-medium leading-relaxed">
                          {screen.watchOut}
                        </p>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* How the Screens Work Together Section */}
      <div className="space-y-10 pt-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-5xl font-black font-space italic uppercase tracking-tight text-slate-900 dark:text-white leading-none">
            CONVERGENCE SETUPS
          </h2>
          <p className="text-[#10b981] font-mono text-xs uppercase tracking-[0.3em] font-black">
            HOW THE SCREENS WORK TOGETHER
          </p>
        </div>

        {/* Setups List Selector */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {setups.map((setup) => {
            const isActive = activeSetupTab === setup.id;
            return (
              <button
                key={setup.id}
                onClick={() => setActiveSetupTab(setup.id)}
                className={`py-4 px-5 rounded-2xl border text-center font-black uppercase font-space tracking-wider italic text-xs transition-all ${
                  isActive 
                    ? 'bg-[#10b981] border-[#10b981] text-white shadow-xl'
                    : 'bg-white dark:bg-[#0b0e14] border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10'
                }`}
              >
                {setup.name}
              </button>
            );
          })}
        </div>

        {/* Setup Details Panel */}
        <AnimatePresence mode="wait">
          {setups.map((setup) => {
            if (setup.id !== activeSetupTab) return null;
            return (
              <motion.div
                key={setup.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`p-8 rounded-[2.5rem] border-2 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 ${setup.color}`}
              >
                <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-current opacity-[0.03] rounded-full blur-[100px] pointer-events-none" />
                
                <div className="space-y-4 max-w-2xl relative z-10 text-left">
                  <div className="flex items-center gap-3">
                    <Workflow size={20} />
                    <h4 className="text-xl font-black uppercase font-space italic tracking-tight text-slate-900 dark:text-white">
                      {setup.name} CONFIGURATION
                    </h4>
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">
                    {setup.desc}
                  </p>
                  
                  {/* Formula visualizer */}
                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl font-mono text-xs font-black uppercase text-center tracking-widest text-slate-300">
                    {setup.formula}
                  </div>
                </div>

                <div className="p-6 bg-black/60 border border-white/5 rounded-2xl md:max-w-sm shrink-0 space-y-2 text-left relative z-10 w-full md:w-auto">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-orange-500">OPERATIONAL OUTCOME</span>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {setup.consequence}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Clean stream script */}
      <div className="p-8 md:p-12 bg-white dark:bg-[#06080c] border border-slate-200 dark:border-white/5 rounded-[2.5rem] space-y-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 left-0 h-1 bg-[#10b981] w-full" />
        
        <div className="flex items-center gap-3">
          <BookOpen className="text-[#10b981]" size={22} />
          <h3 className="text-xl font-black uppercase tracking-[0.2em] font-space text-slate-950 dark:text-white italic">
            HIGH-SIGNAL FLOW SCRIPT
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { tag: 'INDEX SCORE', desc: 'AlphaGap Score tells us where the market may be behind the actual fundamentals.' },
            { tag: 'FUNDAMENTAL WEIGHT', desc: 'Development and Product tell us whether the subnet is real, not just another chart with a story attached.' },
            { tag: 'VELOCITY INDICATIVE', desc: 'Flow and Velocity tell us whether money is starting to wake up right now.' },
            { tag: 'NARRATIVE VECTOR', desc: 'Social tells us if the narrative is spreading, but social without product is usually noise.' },
            { tag: 'STAKING COMMITMENT', desc: 'Emission Change tells us whether the Bittensor network itself is allocating more resources toward the subnet.' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col gap-3 p-5 bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-xl group hover:border-[#10b981]/30 transition-all">
              <span className="text-[9px] font-mono tracking-widest font-black text-[#10b981]">{item.tag}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 bg-[#10b981]/5 border border-[#10b981]/20 rounded-xl flex items-center justify-center text-center">
          <span className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-[#10b981]">
            THE HIGHEST QUALITY SETUP IS WHEN ALL OF THESE START LINING UP AT THE SAME TIME.
          </span>
        </div>
      </div>

      {/* Quote callout summary */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="relative p-8 md:p-10 border border-slate-200 dark:border-white/10 rounded-[2rem] bg-white dark:bg-transparent shadow-xl">
          <p className="text-lg md:text-xl font-black font-space uppercase italic tracking-tight text-slate-800 dark:text-white leading-relaxed">
            "AlphaGap Score shows the opportunity gap. Development and Product show if it is real. Flow and Velocity show if the market is waking up. Social shows if attention is spreading. Emission Change shows if the network is backing it."
          </p>
        </div>

        {/* Big Entry Call to Action */}
        <div className="pt-6">
          <motion.a 
            href={alphagapUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-12 py-6 bg-[#10b981] hover:bg-[#0fa370] text-white font-black uppercase tracking-[0.25em] text-sm rounded-2xl shadow-2xl transition-all cursor-pointer border border-[#10b981]/60"
          >
            LAUNCH ALPHAGAP PLATFORM
            <ArrowRight size={18} />
          </motion.a>
        </div>
      </div>

      {/* Immersive Explanatory Pop up Modal */}
      <AnimatePresence>
        {selectedScreenModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedScreenModal(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white dark:bg-[#080d14] border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-10 my-8 overflow-hidden space-y-8 select-text text-left max-h-[90vh] overflow-y-auto"
            >
              {/* Decorative watermark top-right */}
              <div className="absolute right-0 top-0 text-[10rem] md:text-[14rem] font-black font-space italic uppercase tracking-tighter text-slate-100 dark:text-white/[0.01] pointer-events-none select-none translate-x-20 -translate-y-16">
                {selectedScreenModal.id.slice(0, 4)}
              </div>

              {/* Close Button & Header Info */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-2xl ${selectedScreenModal.colorClass}`}>
                    {selectedScreenModal.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.3em] text-[#10b981] uppercase font-black">ACTIVE POPUP TERMINAL</div>
                    <h3 className="text-2xl md:text-3xl font-space font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
                      {selectedScreenModal.title}
                    </h3>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedScreenModal(null)}
                  className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all rounded-full cursor-pointer border border-transparent dark:border-white/10 shadow-sm"
                  title="Close popup"
                  id="btn-close-alphagap-modal"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Probing block */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 rounded-2xl space-y-3">
                  <div className="text-[10px] font-mono font-black uppercase text-[#10b981] tracking-wider flex items-center gap-2">
                    <Eye size={12} /> PLAIN ENGLISH QUEST
                  </div>
                  <p className="text-lg md:text-xl font-black font-space italic uppercase tracking-tight text-slate-800 dark:text-slate-100">
                    "{selectedScreenModal.plainEnglish}"
                  </p>
                </div>

                <div className="p-6 bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl space-y-3">
                  <div className="text-[10px] font-mono font-black uppercase text-[#10b981] tracking-wider flex items-center gap-2">
                    <BookOpen size={12} /> THE MASTER CLASS LINE
                  </div>
                  <p className="text-sm font-semibold leading-relaxed text-slate-600 dark:text-[#10b981]/80">
                    {selectedScreenModal.masterClass}
                  </p>
                </div>
              </div>

              {/* Core description block */}
              <div className="p-6 bg-slate-50 dark:bg-white/[0.01] border border-slate-100 dark:border-white/5 rounded-2xl relative z-10 space-y-2">
                <h4 className="text-xs font-mono font-bold text-slate-400 tracking-widest uppercase">SECTION DESCRIPTION</h4>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedScreenModal.details}
                </p>
              </div>

              {/* operational steps */}
              <div className="space-y-3 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#10b981]">OPERATIONAL HANDBOOK (HOW TO USE IT)</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 font-inter leading-relaxed whitespace-pre-line">
                  {selectedScreenModal.howToUse}
                </p>
              </div>

              {/* Signals checklist / Danger */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 relative z-10">
                {/* Positive Signs */}
                <div className="md:col-span-7 space-y-4">
                  <h5 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={14} /> EXTREME CONVICTION SIGNALS
                  </h5>
                  <ul className="space-y-2.5">
                    {selectedScreenModal.strongSigns.map((sign, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-xs text-slate-600 dark:text-slate-300">
                        <span className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5 font-bold font-mono text-[9px] w-5 h-5 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="font-medium leading-relaxed">{sign}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Warnings */}
                <div className="md:col-span-5 p-6 bg-rose-500/[0.03] border border-rose-500/10 rounded-2xl space-y-3">
                  <h5 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <ShieldAlert size={14} /> CAUTION DANGER PROFILE
                  </h5>
                  <p className="text-xs text-slate-500 dark:text-rose-400/85 font-medium leading-relaxed">
                    {selectedScreenModal.watchOut}
                  </p>
                </div>
              </div>

              {/* Close Button Footer */}
              <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-white/5 relative z-10">
                <button 
                  onClick={() => setSelectedScreenModal(null)}
                  className="px-6 py-3 bg-[#10b981] hover:bg-[#0fa370] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  DISMISS TERMINAL
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
