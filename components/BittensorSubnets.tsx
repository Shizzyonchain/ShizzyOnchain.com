import React from 'react';
import { ArrowLeft, Activity, Database } from 'lucide-react';

const SUBNETS_DATA = [
  { sn: 1, name: "Apex", category: "AI Agents / AI Tools", description: "Decentralized AI agent infrastructure built for real usage, inference, and task execution." },
  { sn: 2, name: "DSperse", category: "Compute", description: "Distributed compute layer powering decentralized AI inference across the network." },
  { sn: 3, name: "Teutonic", category: "AI Training", description: "AI training subnet using market-driven incentives to improve model performance." },
  { sn: 4, name: "Targon", category: "Compute", description: "Scalable GPU compute and inference infrastructure for real-world AI applications." },
  { sn: 5, name: "Hone", category: "AI Training", description: "Training systems focused on improving reasoning and advancing model intelligence." },
  { sn: 6, name: "Numinous", category: "Predictive Systems", description: "AI agents competing to generate high-quality forecasts and real-world predictions." },
  { sn: 7, name: "Allways", category: "Infrastructure / Other", description: "Cross-chain transaction layer enabling trustless movement of value across networks." },
  { sn: 8, name: "Vanta", category: "DeFi / Trading", description: "Decentralized trading infrastructure for liquidity, execution, and market activity." },
  { sn: 9, name: "Iota", category: "AI Training", description: "Pretraining subnet focused on building language models across distributed compute." },
  { sn: 10, name: "Swap", category: "DeFi / Trading", description: "Onchain swap and exchange infrastructure for moving assets across ecosystems." },
  { sn: 11, name: "TrajectoryRL", category: "AI Training", description: "Reinforcement learning subnet improving agent behavior through competition." },
  { sn: 12, name: "Compute Horde", category: "Compute", description: "Decentralized GPU marketplace supplying compute for AI training and inference." },
  { sn: 13, name: "Data Universe", category: "Data", description: "Large-scale decentralized data layer powering AI training and aggregation." },
  { sn: 14, name: "TAOHash", category: "Infrastructure / Other", description: "Network-level compute and hashing infrastructure supporting the broader system." },
  { sn: 15, name: "ORO", category: "AI Agents / AI Tools", description: "Agent platform focused on real-world actions like commerce and task execution." },
  { sn: 16, name: "BitAds", category: "AI Agents / AI Tools", description: "AI-powered advertising system focused on verified actions and conversion tracking." },
  { sn: 17, name: "404-GEN", category: "Generative AI", description: "Generative AI subnet producing synthetic content across digital environments." },
  { sn: 18, name: "Zeus", category: "Predictive Systems", description: "Decentralized forecasting system focused on weather and environmental prediction." },
  { sn: 19, name: "BlockMachine", category: "Compute", description: "Infrastructure subnet supporting RPC and machine-level network operations." },
  { sn: 20, name: "GroundLayer", category: "AI Agents / AI Tools", description: "Evaluation and tooling layer for language model agents performing real tasks." },
  { sn: 21, name: "ADTAO", category: "AI Training / AdTech", description: "AI-driven optimization subnet focused on improving ad performance and delivery." },
  { sn: 22, name: "Desearch", category: "Data", description: "Decentralized search engine indexing the web for AI retrieval and discovery." },
  { sn: 23, name: "Trishool", category: "AI Safety", description: "AI safety subnet focused on alignment, monitoring, and secure model behavior." },
  { sn: 24, name: "Quasar", category: "AI Agents / AI Tools", description: "Long-context AI subnet built for deep reasoning and extended memory tasks." },
  { sn: 25, name: "Mainframe", category: "Infrastructure / Other", description: "Core infrastructure subnet supporting foundational network services." },
  { sn: 26, name: "Kinitro", category: "Robotics", description: "Embodied AI agents designed to operate across real-world environments and robotics systems." },
  { sn: 27, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 28, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 29, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 30, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 31, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 32, name: "ItS-AI", category: "AI Safety", description: "Detection and verification layer for identifying AI-generated content." },
  { sn: 33, name: "ReadyAI", category: "Data", description: "Multimodal data platform powering training datasets across the network." },
  { sn: 34, name: "BitMind", category: "AI Safety", description: "Detection and classification of AI-generated media and deepfakes." },
  { sn: 35, name: "OxMarkets", category: "DeFi / Trading", description: "AI-powered decentralized trading platform for managing liquidity and execution." },
  { sn: 36, name: "Eirel", category: "AI Agents / AI Tools", description: "Model deployment and feedback layer for real-world AI usage." },
  { sn: 37, name: "Aurelius", category: "Data", description: "Adversarial dataset validation improving training data quality." },
  { sn: 38, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 39, name: "Basilica", category: "AI Training", description: "Part of the decentralized training stack supporting model development." },
  { sn: 40, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 41, name: "Almanac", category: "Predictive Systems", description: "AI-driven forecasting platform focused on sports and event outcomes." },
  { sn: 42, name: "Gopher", category: "AI Training", description: "Focused on advancing model intelligence through decentralized training." },
  { sn: 43, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 44, name: "Score", category: "Vision Models", description: "Large-scale vision models trained to understand real-world visual data." },
  { sn: 45, name: "Talisman AI", category: "DeFi / Trading", description: "Wallet intelligence evolving into AI-driven command and execution systems." },
  { sn: 46, name: "RESI", category: "Data", description: "Real estate data network powering AI-driven valuation and analysis." },
  { sn: 47, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 48, name: "Quantum", category: "Compute", description: "Marketplace for quantum compute circuits and experimental workloads." },
  { sn: 49, name: "Nepher", category: "Robotics", description: "Simulation environment for training AI in physical and autonomous systems." },
  { sn: 50, name: "Synth", category: "Predictive Systems", description: "Probabilistic forecasting across crypto and traditional markets." },
  { sn: 51, name: "lium.io", category: "Compute", description: "Decentralized compute and GPU marketplace for AI workloads." },
  { sn: 52, name: "Dojo", category: "Data", description: "Human feedback and data collection subnet focused on improving AI training quality." },
  { sn: 53, name: "Efficient Frontier", category: "DeFi / Trading", description: "AI-driven trading subnet built around risk-weighted market strategies." },
  { sn: 54, name: "WebGenieAI", category: "Generative AI", description: "Turns prompts, sketches, and ideas into ready-to-deploy projects." },
  { sn: 55, name: "Precog", category: "Predictive Systems", description: "Bitcoin forecasting subnet built around market intelligence and predictive signals." },
  { sn: 56, name: "Gradients", category: "AI Training", description: "Open training infrastructure designed to make model training more accessible on Bittensor." },
  { sn: 57, name: "Sparket", category: "Unknown", description: "TaoStats currently shows the name Sparket, but the role is not clear enough to label harder." },
  { sn: 58, name: "Handshake", category: "AI Agents / AI Tools", description: "Payment and transaction rails designed for AI agents." },
  { sn: 59, name: "Babelbit", category: "Unknown", description: "TaoStats currently shows the name Babelbit, but the role is not clear enough to label harder." },
  { sn: 60, name: "Bitsec", category: "AI Safety", description: "AI-powered security subnet focused on code vulnerability detection." },
  { sn: 61, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 62, name: "Ridges", category: "AI Agents / AI Tools", description: "Competitive coding agents built to solve real software tasks." },
  { sn: 63, name: "Enigma", category: "Unknown", description: "TaoStats currently shows the name Enigma, but the role is not clear enough to label harder." },
  { sn: 64, name: "Chutes", category: "Compute", description: "Serverless AI compute layer built to run models at scale." },
  { sn: 65, name: "TAO Private Network", category: "Privacy / Infrastructure", description: "Private network infrastructure focused on secure and geographically distributed access." },
  { sn: 66, name: "ninja", category: "AI Agents / AI Tools", description: "Coding-focused subnet aimed at solving software and engineering tasks." },
  { sn: 67, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 68, name: "NOVA", category: "DeSci", description: "Decentralized drug discovery subnet using AI to accelerate therapeutic research." },
  { sn: 69, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 70, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 71, name: "Leadpoet", category: "Unknown", description: "TaoStats currently shows the name Leadpoet, but the role is not clear enough to label harder." },
  { sn: 72, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 73, name: "Unverified", category: "Unknown", description: "No clearly confirmed subnet identity or role available." },
  { sn: 74, name: "Gittensor", category: "Unknown", description: "TaoStats currently shows the name Gittensor, but the role is not clear enough to label harder." },
  { sn: 75, name: "Hippius", category: "Data / Storage", description: "Decentralized storage infrastructure built for persistent data availability." }
];

export const BittensorSubnets: React.FC = () => {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-8">
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
            Live network directory
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SUBNETS_DATA.map((subnet) => (
          <div 
            key={subnet.sn}
            className="group flex flex-col bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 md:p-8 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 flex-shrink-0 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-lg border border-orange-500/20">
                  {subnet.sn}
                </div>
                <div>
                  <h3 className="text-xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                    {subnet.name}
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-white/5 rounded-md mt-1 inline-block">
                    {subnet.category}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed flex-grow mt-2">
              {subnet.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
