import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Workflow, 
  Layers, 
  HelpCircle, 
  Zap, 
  TrendingUp, 
  ShieldAlert, 
  ChevronRight, 
  HelpCircle as HelpIcon, 
  CheckCircle2, 
  Calculator, 
  Clock, 
  Award, 
  GraduationCap, 
  Coins, 
  Wallet,
  Play,
  RotateCcw,
  ArrowRight
} from 'lucide-react';

interface PartData {
  id: number;
  title: string;
  badge: string;
  excerpt: string;
  content: string | React.ReactNode;
}

export const EmissionsExplained: React.FC = () => {
  const [activePart, setActivePart] = useState<number>(1);
  const [simSubnetPercent, setSimSubnetPercent] = useState<number>(10);
  const [simAlphaOut, setSimAlphaOut] = useState<number>(1);
  const [simMinerBurn, setSimMinerBurn] = useState<number>(0);
  const [showSimTooltips, setShowSimTooltips] = useState<boolean>(true);

  useEffect(() => {
    const handleUrlHash = () => {
      try {
        const hash = window.location.hash || '';
        const match = hash.match(/emissions-explained[\/\-?part=]*(\d+)/i);
        if (match && match[1]) {
          const parsed = parseInt(match[1], 10);
          if (parsed >= 1 && parsed <= 16) {
            setActivePart(parsed);
            setTimeout(() => {
              const el = document.getElementById(`part-card-${parsed}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 300);
          }
        }
      } catch (e) {
        console.warn('Hash sync error inside sandbox context:', e);
      }
    };

    // Initial load scroll
    handleUrlHash();

    window.addEventListener('hashchange', handleUrlHash);
    return () => {
      window.removeEventListener('hashchange', handleUrlHash);
    };
  }, []);

  // Calculates math for the current inputs
  const rawTaoPerBlock = 0.5;
  const blocksPerTempo = 360;

  const subnetTaoPerBlock = rawTaoPerBlock * (simSubnetPercent / 100);
  const subnetTaoPerTempo = subnetTaoPerBlock * blocksPerTempo;

  const subnetOwnerAlphaBlock = simAlphaOut * 0.18;
  const subnetOwnerAlphaTempo = subnetOwnerAlphaBlock * blocksPerTempo;

  // Miner calculation with optional burn
  const originalMinerSplit = 0.41;
  const simMinerRewardRatio = Math.max(0, originalMinerSplit - simMinerBurn);
  const subnetMinersAlphaBlock = simAlphaOut * simMinerRewardRatio;
  const subnetMinersAlphaTempo = subnetMinersAlphaBlock * blocksPerTempo;

  const subnetMinersBurnedBlock = simAlphaOut * Math.min(originalMinerSplit, simMinerBurn);
  const subnetMinersBurnedTempo = subnetMinersBurnedBlock * blocksPerTempo;

  const subnetValidatorsAlphaBlock = simAlphaOut * 0.41;
  const subnetValidatorsAlphaTempo = subnetValidatorsAlphaBlock * blocksPerTempo;

  const totalEmittedAlphaBlock = subnetOwnerAlphaBlock + subnetMinersAlphaBlock + subnetValidatorsAlphaBlock;
  const totalEmittedAlphaTempo = totalEmittedAlphaBlock * blocksPerTempo;

  const parts: PartData[] = [
    {
      id: 1,
      title: 'What Happens Every Block?',
      badge: 'Part 1',
      excerpt: 'The Bittensor clock ticking and total network rewards.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            A block is like one tick of the Bittensor clock. Bittensor makes a new block about every <strong>12 seconds</strong>.
          </p>
          <div className="p-5 bg-orange-600/5 border border-orange-500/20 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono font-black uppercase text-orange-500">TOTAL EMISSION RATE</span>
              <p className="text-2xl font-black font-space italic text-slate-900 dark:text-white uppercase">
                0.5 TAO <span className="text-orange-500">per block</span>
              </p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-md">
              The official Bittensor documentation and block explorers like Taostats confirm that after the first halving, exactly <strong>0.5 TAO is emitted each block</strong> for the entire network.
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-orange-500/30 pl-4 mt-2">
            <strong>CRITICAL CONCEPT:</strong> That does not mean every subnet gets 0.5 TAO. It means the entire Bittensor network gets 0.5 TAO per block, which is then dynamically divided across all subnets.
          </p>
        </div>
      )
    },
    {
      id: 2,
      title: 'How is TAO split decided?',
      badge: 'Part 2',
      excerpt: 'Understanding TAO flow dynamics and validator scores.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Each subnet gets a specific percentage of the total 0.5 TAO block emissions. This percentage is decided based on <strong>TAO flow</strong> dynamics:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-xl space-y-2">
              <span className="text-[9px] font-mono text-emerald-500 font-black uppercase tracking-wider">POSITIVE FLOW</span>
              <h4 className="text-sm font-black font-space uppercase">Staking Activity</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If validators and stakers are actively staking more TAO into a subnet, emission percent increases.
              </p>
            </div>
            <div className="p-5 bg-rose-500/5 border border-rose-500/20 rounded-xl space-y-2">
              <span className="text-[9px] font-mono text-rose-500 font-black uppercase tracking-wider">NEGATIVE FLOW</span>
              <h4 className="text-sm font-black font-space uppercase">Unstaking/Inflows</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                If capital is leaving the subnet, emissions drop. Subnets with negative net flows can receive zero emissions.
              </p>
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-2 italic">
            💡 "More TAO flowing in means more emissions. More TAO flowing out means less emissions."
          </p>
        </div>
      )
    },
    {
      id: 3,
      title: 'The 0.5 TAO Emissions Split',
      badge: 'Part 3',
      excerpt: 'Numerical example of network-wide allocation math.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Let us look at a simple scenario involving three active subnets dividing the total 0.5 TAO per block reward:
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-black/20">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-white/5 border-b border-slate-200 dark:border-white/10 font-bold font-space uppercase text-slate-700 dark:text-slate-300">
                  <th className="p-4">Subnet ID</th>
                  <th className="p-4">Allocation %</th>
                  <th className="p-4">Emission Calc</th>
                  <th className="p-4 text-right">TAO Received (Block)</th>
                </tr>
              </thead>
              <tbody className="font-medium text-slate-600 dark:text-slate-300 divide-y divide-slate-100 dark:divide-white/5">
                <tr>
                  <td className="p-4 font-bold">Subnet A</td>
                  <td className="p-4">50%</td>
                  <td className="p-4">0.5 TAO × 50%</td>
                  <td className="p-4 text-right font-mono font-bold text-[#10b981]">0.25 TAO</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Subnet B</td>
                  <td className="p-4">30%</td>
                  <td className="p-4">0.5 TAO × 30%</td>
                  <td className="p-4 text-right font-mono font-bold text-[#10b981]">0.15 TAO</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Subnet C</td>
                  <td className="p-4">20%</td>
                  <td className="p-4">0.5 TAO × 20%</td>
                  <td className="p-4 text-right font-mono font-bold text-[#10b981]">0.10 TAO</td>
                </tr>
                <tr className="bg-slate-50 dark:bg-white/[0.02] font-bold">
                  <td className="p-4 text-slate-900 dark:text-white uppercase font-space">Total Reward</td>
                  <td className="p-4">100%</td>
                  <td className="p-4">-</td>
                  <td className="p-4 text-right font-mono font-black text-orange-500">0.50 TAO</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            The 0.5 TAO is not an absolute base number that multiplies. It represents the total maximum ceiling. It is just being divided up.
          </p>
        </div>
      )
    },
    {
      id: 4,
      title: 'Where Does That TAO Go?',
      badge: 'Part 4',
      excerpt: 'Subnet liquidity reserves and the tao_in mechanism.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-semibold text-[#10b981]">
            This is where most people get confused.
          </p>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
            The TAO does not go straight to miners. It does not go straight to validators or teams. 
            The TAO goes directly into each subnet's <strong>Liquidity Reserve (Subnet Pool)</strong>. This pool operates like a dynamic automated market maker (AMM) trading pool containing two sides:
          </p>
          <div className="relative group p-6 rounded-2xl bg-black/40 border border-white/5 flex flex-col md:flex-row items-center justify-around gap-6 text-center">
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-orange-500 uppercase bg-orange-600/10 px-2.5 py-1 rounded-md">TAO RESERVES</span>
              <p className="text-2xl font-black font-space text-white">tao_in</p>
              <p className="text-xs text-slate-500">Emissions Injected Here</p>
            </div>
            <div className="h-px md:h-12 w-12 md:w-px bg-white/10" />
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-black text-[#10b981] uppercase bg-[#10b981]/10 px-2.5 py-1 rounded-md">ALPHA RESERVES</span>
              <p className="text-2xl font-black font-space text-white">alpha_in</p>
              <p className="text-xs text-slate-500">Injected Proportionally</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Bittensor docs state TAO is injected into each subnet's TAO reserve, and the amount is determined by the emission distribution formula. That process of adding TAO to the pool is called <strong>tao_in</strong>.
          </p>
        </div>
      )
    },
    {
      id: 5,
      title: 'What is alpha_in?',
      badge: 'Part 5',
      excerpt: 'Maintaining pool dynamics and pricing stability.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            When TAO goes into the subnet pool, Alpha tokens are added to the Alpha side of the pool too to keep the ratio stable. This is called <strong>alpha_in</strong>.
          </p>
          <div className="p-6 bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono font-black text-[#10b981] uppercase">WHY INJECT ALPHA TODAY?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Because the pool has to stay balanced. If you only added TAO and did not add Alpha, the relative spot price of Alpha would spike up instantly or get pushed around weirdly. Adding <strong>alpha_in</strong> proportional to <strong>tao_in</strong> maintains proper price stability inside the AMM pool.
            </p>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            <strong>Remember:</strong> This alpha_in is strictly pool liquidity. It is not the miner reward bucket, validator bucket, or team wallet rewards. It is just added to the pool.
          </p>
        </div>
      )
    },
    {
      id: 6,
      title: 'What is alpha_out?',
      badge: 'Part 6',
      excerpt: 'The true engine that pays subnet participants.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Now we get to the core engine that actually pays active subnet participants: <strong>alpha_out</strong>.
          </p>
          <div className="p-6 bg-[#10b981]/5 border border-[#10b981]/20 rounded-2xl space-y-2">
            <span className="text-[9px] font-mono font-black text-[#10b981] uppercase tracking-wider">REWARD OUTPUT RATE</span>
            <h4 className="text-xl font-black font-space uppercase italic">1 Alpha_Out per Block</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Before a subnet undergoes its alpha halving, exactly <strong>1 Alpha per block</strong> is minted as <strong>alpha_out</strong>. This is the emission rewarded directly to the subnet owner, miners, validators, and stakeholders.
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm">
            These newly created Alpha tokens are divided up directly to compensate the physical humans and servers contributing hardware and scores inside that specific subnet economy.
          </p>
        </div>
      )
    },
    {
      id: 7,
      title: 'The Magic Split (18 / 41 / 41)',
      badge: 'Part 7',
      excerpt: 'How alpha_out is systematically shared.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The minted <strong>1 alpha_out</strong> per block is split using a rigid consensus formula:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 bg-white dark:bg-black/35 rounded-2xl border border-slate-200 dark:border-white/5 text-center space-y-2">
              <span className="text-2xl font-black font-space italic text-orange-500">18%</span>
              <p className="text-xs font-black uppercase text-slate-800 dark:text-white">Subnet Owner</p>
              <p className="text-[10px] text-slate-400">0.18 Alpha / Block</p>
            </div>
            <div className="p-5 bg-white dark:bg-black/35 rounded-2xl border border-slate-200 dark:border-white/5 text-center space-y-2">
              <span className="text-2xl font-black font-space italic text-[#10b981]">41%</span>
              <p className="text-xs font-black uppercase text-slate-800 dark:text-white">Miners Bucket</p>
              <p className="text-[10px] text-[#10b981]">0.41 Alpha / Block</p>
            </div>
            <div className="p-5 bg-white dark:bg-black/35 rounded-2xl border border-slate-200 dark:border-white/5 text-center space-y-2">
              <span className="text-2xl font-black font-space italic text-blue-500">41%</span>
              <p className="text-xs font-black uppercase text-slate-800 dark:text-white">Validators & Stakers</p>
              <p className="text-[10px] text-blue-400">0.41 Alpha / Block</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 text-center">
            Both Bittensor documentation and Taostats confirm this exact 18/41/41 distribution protocol for unhalved subnets.
          </p>
        </div>
      )
    },
    {
      id: 8,
      title: 'What Happens Over One Tempo?',
      badge: 'Part 8',
      excerpt: 'Zooming out to the standard reward cycle.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            A <strong>tempo</strong> is the core reward distribution cycle in Bittensor. For most active subnets, one tempo lasts exactly <strong>360 blocks</strong> (roughly <strong>72 minutes</strong>).
          </p>
          <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-4">
            <h4 className="text-xs font-mono text-[#10b981] font-black uppercase tracking-wider">TEMPO REWARDS SUMMARY (360 BLOCKS)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-slate-300">
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <span className="block text-[9px] text-[#10b981] font-mono">OWNER PORTION</span>
                <p className="text-lg font-black text-white mt-1">64.8 Alpha</p>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <span className="block text-[9px] text-[#10b981] font-mono">MINERS BUCKET</span>
                <p className="text-lg font-black text-white mt-1">147.6 Alpha</p>
              </div>
              <div className="p-4 bg-white/[0.02] rounded-xl border border-white/5">
                <span className="block text-[9px] text-[#10b981] font-mono">VALIDATORS / STAKERS</span>
                <p className="text-lg font-black text-white mt-1">147.6 Alpha</p>
              </div>
            </div>
            <div className="text-center pt-2">
              <span className="text-xs font-mono text-orange-500 font-black">
                TOTAL TEMPO MINT = 360 ALPHA_OUT
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: 'Who Gets the Miner Rewards?',
      badge: 'Part 9',
      excerpt: 'The competitive nature of miner allocation.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Miners do not get paid a flat fee. The miner bucket is <strong>hyper-competitive</strong>:
          </p>
          <div className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono font-black text-orange-500 uppercase flex items-center gap-2">
              <Award size={14} /> YUMA CONSENSUS TRACKING
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              The subnet invites miners to solve physical technical tasks (e.g., text generation, model optimization). Validators test their work and submit ranking scores into the <strong>Yuma Consensus</strong> engine.
            </p>
          </div>
          <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
            <p className="text-xs text-slate-600 dark:text-emerald-400 font-semibold text-center uppercase tracking-wider">
              Better Performance Score = Bigger Share of the 147.6 Alpha Miner Bucket. Zero Score = Zero Alpha.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: 'Who Gets the Validator Rewards?',
      badge: 'Part 10',
      excerpt: 'Dividend rewards shared with consensus backers.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            The validator bucket, which makes up <strong>41% of alpha_out</strong> (147.6 Alpha per tempo), rewards validators based on consensus health, validator trust (VTrust), and their backing stake.
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-sm border-l-2 border-[#10b981] pl-4 italic">
            "When people say validators get 41%, that really means validators and their active staking delegators share 41%."
          </p>
          <p className="text-slate-600 dark:text-slate-300 text-xs">
            The validator does not keep the whole 41%. It is divided and distributed directly to the delegators staking TAO/Alpha behind them, minus a custom fee.
          </p>
        </div>
      )
    },
    {
      id: 11,
      title: 'What is Validator Take?',
      badge: 'Part 11',
      excerpt: 'The operational fee kept by node validators.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Validator Take</strong> is simply the operational fee that the validator keeps before distributing rewards to their delegators.
          </p>
          <div className="p-5 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 border border-blue-500/20 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-center text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-blue-400 uppercase font-black">VALIDATOR EARNS</span>
              <p className="text-lg font-black text-white font-space">10 ALPHA</p>
            </div>
            <div className="text-center font-bold text-slate-400">⏱️ WITH 18% TAKE:</div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-orange-500 uppercase font-black">VALIDATOR KEEPS</span>
              <p className="text-lg font-black text-white font-space">1.8 ALPHA</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-[#10b981] uppercase font-black">DELEGATORS RECEIVE</span>
              <p className="text-lg font-black text-white font-space">8.2 ALPHA</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-center">
            A lower take leaves more rewards for stakers, and a higher take means the validator keeps more of the yield.
          </p>
        </div>
      )
    },
    {
      id: 12,
      title: 'What Does Miner Burn Mean?',
      badge: 'Part 12',
      excerpt: 'The critical variable: Burn vs. Real Miner Yield.',
      content: (
        <div className="space-y-4 font-inter">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong>Miner Burn</strong> refers to emissions from the miner bucket that are destroyed (burned) rather than sent to normal external miners. This usually happens if miner emissions are routed directly to the subnet owner's unregistered hotkeys.
          </p>
          <div className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl space-y-3">
            <h4 className="text-xs font-mono font-black text-rose-400 uppercase">🔥 WHAT IF MINER BURN IS ZERO?</h4>
            <p className="text-slate-600 dark:text-slate-300 text-xs font-semibold leading-relaxed">
              If miner burn is <strong>0</strong>, none of the miner tokens are destroyed. The full <strong>41% miner bucket (147.6 Alpha per tempo)</strong> is available to actual registered miners who compete on work scores.
            </p>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-xs italic">
            Note: Miner burn being 0 does not mean the owner loses their 18%. The owner still gets their normal 18% owner portion block-by-block. 
          </p>
        </div>
      )
    },
    {
      id: 13,
      title: 'Full Block Example (Start to Finish)',
      badge: 'Part 13',
      excerpt: 'Stepping through a block emission cycle with a subnets allocation.',
      content: (
        <div className="space-y-4 font-inter text-xs">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Let's trace exactly how one single block flows for a subnet with a 10% network allocation:
          </p>
          <div className="p-6 bg-slate-900/60 border border-white/5 rounded-2xl space-y-3 font-mono">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">1. Raw block emit (networkwide)</span>
              <span className="text-orange-400 font-bold">0.50 TAO</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">2. Subnet allocation (10%)</span>
              <span className="text-white font-bold">0.05 TAO (tao_in)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">3. Injection context</span>
              <span className="text-[#10b981]">Added to AMM Liquidity side</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">4. Reward minted (alpha_out)</span>
              <span className="text-white font-bold">1.00 Alpha</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1">
              <span className="text-[#10b981] font-bold">5. Distribution Split:</span>
              <span>-</span>
            </div>
            <div className="pl-4 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>✦ Owner gets:</span>
                <span>0.18 Alpha</span>
              </div>
              <div className="flex justify-between">
                <span>✦ Miners split:</span>
                <span>0.41 Alpha (Assumes Burn = 0)</span>
              </div>
              <div className="flex justify-between">
                <span>✦ Validators + Stakers:</span>
                <span>0.41 Alpha</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: 'Full Tempo Example (Start to Finish)',
      badge: 'Part 14',
      excerpt: 'Simulating the entire 360 block rewards cycle.',
      content: (
        <div className="space-y-4 font-inter text-xs">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Stretched over one full tempo (360 blocks / ~72 minutes), using the same fake 10% subnet example:
          </p>
          <div className="p-6 bg-[#080d14] border border-white/5 rounded-2xl space-y-3 font-mono">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">1. Total Network TAO Emitted</span>
              <span className="text-orange-400 font-bold">180.0 TAO</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">2. Subnet Inflow (10%)</span>
              <span className="text-white font-bold">18.0 TAO (into pool tao_in)</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-slate-400">3. Total Subnet Alpha Out</span>
              <span className="text-white font-bold">360.0 Alpha</span>
            </div>
            <div className="flex justify-between text-slate-400 pt-1">
              <span className="text-[#10b981] font-bold">4. Final split over Tempo:</span>
              <span>-</span>
            </div>
            <div className="pl-4 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>✦ Owner gets:</span>
                <span className="text-white">64.8 Alpha</span>
              </div>
              <div className="flex justify-between">
                <span>✦ Miners split:</span>
                <span className="text-white">147.6 Alpha (Burn = 0)</span>
              </div>
              <div className="flex justify-between">
                <span>✦ Validators + Stakers:</span>
                <span className="text-white">147.6 Alpha</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 15,
      title: 'The Classroom Analogy Today',
      badge: 'Part 15',
      excerpt: 'Making these concepts crystal clear for newcomers.',
      content: (
        <div className="space-y-4 font-inter text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Think of Bittensor like a school.
          </p>
          <p>
            The school gets a total budget every single block. That budget is in <strong>TAO</strong>. Currently, the school receives <strong>0.5 TAO per block</strong>.
          </p>
          <p>
            Each classroom inside the school acts as a <strong>subnet</strong>. The classrooms don't all get the same percentage. Classrooms that bring in more students and generate more activity (net staking inflow) get more of the TAO budget. This budget goes straight into the classroom's treasury pool.
          </p>
          <p>
            Inside each classroom, a separate localized points system is used to pay people. These points are <strong>Alpha tokens</strong>.
          </p>
          <ul className="list-disc pl-5 space-y-1 py-1">
            <li>The class owner gets <strong>18%</strong> of the points.</li>
            <li>The active students doing the classwork (miners) split <strong>41%</strong>.</li>
            <li>The teachers grading the work (validators) and backers split <strong>41%</strong>.</li>
          </ul>
          <p className="border-t border-slate-100 dark:border-white/5 pt-2 text-xs text-slate-500">
            If miner burn is 0, none of the students' points are destroyed. Students split the full miner budget based on who did the best work.
          </p>
        </div>
      )
    },
    {
      id: 16,
      title: 'Stream Script (Easiest way to present it)',
      badge: 'Part 16',
      excerpt: 'Clean talking points customized for livestream discussion.',
      content: (
        <div className="space-y-4 font-inter text-slate-600 dark:text-slate-300 leading-relaxed">
          <p className="text-xs font-mono font-black text-orange-500 uppercase tracking-widest">STREAMER CHEATSHEET PRESENTATION SCRIPT</p>
          <div className="p-6 bg-orange-600/5 border border-orange-500/20 rounded-2xl space-y-4 italic text-sm font-semibold select-all font-sans relative">
            <span className="absolute -top-3 left-4 bg-orange-600 text-white font-mono font-bold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">Stream Copy</span>
            <p className="leading-relaxed">
              "Bittensor emits 0.5 TAO per block across the whole network. That TAO gets split across subnets based on TAO flow. The TAO does not go straight to miners or teams. It goes into subnet pools as AMM reserves."
            </p>
            <p className="leading-relaxed">
              "Then each subnet has alpha_out, which is the reward token paid to participants. For a normal unhalved subnet, alpha_out is 1 alpha per block."
            </p>
            <p className="leading-relaxed">
              "That 1 alpha gets split 18 / 41 / 41. 18% to the subnet owner, 41% to miners, 41% to validators and stakers."
            </p>
            <p className="leading-relaxed">
              "Over one tempo, that is 360 alpha: 64.8 alpha to the owner, 147.6 alpha to miners, and 147.6 alpha to validators and stakers."
            </p>
            <p className="leading-relaxed">
              "If miner burn is 0, none of the miner bucket is burned. So the full miner bucket goes to miners based on their scores."
            </p>
            <p className="leading-relaxed font-bold text-slate-800 dark:text-white uppercase not-italic">
              "The big mistake is thinking the 0.5 TAO block reward goes directly to the team, miners, and validators. It does not. The 0.5 TAO is network-level liquidity that gets split into subnet pools. The alpha_out is what pays the people inside."
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-12 md:py-16 space-y-16">
      
      {/* Header section with deep green and orange accents */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2.5 px-4.5 py-1.5 bg-orange-600/10 text-orange-500 dark:text-orange-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-orange-600/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]">
          <Layers size={11} className="animate-pulse" />
          RESEARCH ARCHIVE — BITTENSOR PROTOCOL Series
        </div>
        
        <h1 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
          EMISSIONS <span className="text-orange-600">EXPLAINED</span>
        </h1>
        
        <p className="text-slate-500 dark:text-slate-400 font-medium text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
          Discard the complexity. Learn how newly minted TAO and subnet-specific Alpha tokens interact block-by-block across the Bittensor paradigm.
        </p>
      </div>

      {/* Key Concept Box */}
      <div className="relative group overflow-hidden rounded-[2.5rem] bg-[#0c0d12] border border-orange-500/20 p-8 md:p-12 shadow-2xl">
        <div className="absolute right-0 top-0 w-[400px] h-[400px] bg-orange-600/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          
          <div className="p-6 rounded-3xl bg-orange-600/10 border border-orange-600/30 shrink-0 text-orange-500">
            <Coins size={48} className="animate-pulse" />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-orange-500">THE CORE CONVERGENCE CONCEPT</h3>
            <h2 className="text-3xl md:text-4xl font-black font-space italic uppercase tracking-tight text-white leading-tight">
              TAO goes into subnet pools. Alpha tokens go to the people working inside each subnet.
            </h2>
            <p className="text-slate-400 font-inter leading-relaxed max-w-3xl text-sm">
              That's the entire mechanism in one core sentence. TAO is the global reserve asset that backing dynamic pools, while localized Alpha represents the functional currency rewarding the physical contributors within each subnet. Every subnet is like its own mini-economy inside Bittensor.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Mathematics Simulator Tool */}
      <div className="p-8 md:p-12 bg-white dark:bg-[#070b10] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-xl space-y-8 relative">
        <div className="absolute -top-3.5 left-8 bg-[#10b981] text-white font-mono font-bold text-[9px] uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
          <Calculator size={11} /> MASTER LIVE CALCULATOR
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-mono text-[#10b981] font-black uppercase tracking-widest block">INTERACTIVE SIMULATION</span>
          <h3 className="text-2xl md:text-3xl font-space font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
            ECOSYSTEM EMISSIONS MATH SIMULATOR
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter leading-relaxed max-w-2xl">
            Toggle the inputs below to simulate and trace exactly how emissions flow into subnet AMM pools and how rewards get distributed to builders and owners in high-fidelity TAO/Alpha metrics.
          </p>
        </div>

        {/* Sliders and Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            
            {/* Input 1: Subnet Allocation percentage */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-space font-black dark:text-slate-200 uppercase">
                <span>Subnet Allocation %</span>
                <span className="text-orange-500 font-mono text-sm">{simSubnetPercent}%</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="100" 
                step="0.1"
                value={simSubnetPercent}
                onChange={(e) => setSimSubnetPercent(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <span className="text-[9px] font-mono text-slate-400 block">Determines the share of the 0.5 TAO block reward.</span>
            </div>

            {/* Input 2: Simulated Alpha_Out per block */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-space font-black dark:text-slate-200 uppercase">
                <span>Alpha Mint out per block</span>
                <span className="text-[#10b981] font-mono text-sm">{simAlphaOut} Alpha</span>
              </div>
              <input 
                type="range" 
                min="0.1" 
                max="10" 
                step="0.1"
                value={simAlphaOut}
                onChange={(e) => setSimAlphaOut(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#10b981]"
              />
              <span className="text-[9px] font-mono text-slate-400 block">Reward output parameter (Standard is 1 Alpha prior to halving).</span>
            </div>

            {/* Input 3: Miner Burn factor */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs font-space font-black dark:text-slate-200 uppercase">
                <span>Miner Burn</span>
                <span className="text-rose-500 font-mono text-sm font-black">{simMinerBurn === 0 ? '0 (Burn = 0)' : `${(simMinerBurn * 100).toFixed(0)}%`}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="0.41" 
                step="0.01"
                value={simMinerBurn}
                onChange={(e) => setSimMinerBurn(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <span className="text-[9px] font-mono text-slate-400 block">Amount of the 41% miner emissions being burned. Keep at 0 to see full rewards!</span>
            </div>

            {/* Reset controls */}
            <button 
              onClick={() => {
                setSimSubnetPercent(10);
                setSimAlphaOut(1);
                setSimMinerBurn(0);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 font-black uppercase font-space text-[10px] tracking-widest rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw size={12} /> RESET SIMULATOR PARAMETERS
            </button>

          </div>

          {/* Calculations Output Panel */}
          <div className="lg:col-span-8 p-6 md:p-8 bg-slate-50 dark:bg-black/30 rounded-3xl border border-slate-200 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* TAO Pool Injection math */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-orange-500 font-black uppercase tracking-wider block border-b border-slate-100 dark:border-white/5 pb-2">
                1. tao_in Math (AMM Pool Injection)
              </span>
              
              <div className="space-y-4">
                <div>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">INJECTION PER BLOCK</span>
                  <div className="text-2xl font-black font-space text-slate-900 dark:text-white mt-1">
                    {subnetTaoPerBlock.toFixed(4)} <span className="text-orange-500">TAO</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#10b981] block">({simSubnetPercent}% of 0.5 TAO)</span>
                </div>

                <div>
                  <span className="text-[9px] font-mono text-slate-400 block uppercase">INJECTION PER TEMPO (360 BLOCKS)</span>
                  <div className="text-2xl font-black font-space text-slate-900 dark:text-white mt-1">
                    {subnetTaoPerTempo.toFixed(2)} <span className="text-orange-500">TAO</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#10b981] block">Inflow over ~72-minute tempo</span>
                </div>
              </div>
            </div>

            {/* Alpha block outputs math */}
            <div className="space-y-4">
              <span className="text-[10px] font-mono text-[#10b981] font-black uppercase tracking-wider block border-b border-slate-100 dark:border-white/5 pb-2">
                2. alpha_out Math (Real rewards to humans)
              </span>
              
              <div className="space-y-3 text-xs font-semibold">
                
                {/* Owner block */}
                <div className="flex justify-between items-center p-2.5 bg-slate-100 dark:bg-white/[0.02] rounded-xl">
                  <div>
                    <span className="block font-space uppercase text-[10px] text-slate-700 dark:text-slate-300">
                      Owner Share <span className="text-orange-500 font-mono text-[9px]">(18%)</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Fixed rate</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-slate-900 dark:text-white font-black">{subnetOwnerAlphaBlock.toFixed(3)} α/Blk</div>
                    <div className="text-[10px] text-slate-400">{subnetOwnerAlphaTempo.toFixed(1)} α/Tempo</div>
                  </div>
                </div>

                {/* Miner block with burn calculated */}
                <div className="flex justify-between items-center p-2.5 bg-slate-100 dark:bg-white/[0.02] rounded-xl relative overflow-hidden">
                  <div>
                    <span className="block font-space uppercase text-[10px] text-slate-700 dark:text-slate-300">
                      Miners Bucket <span className="text-[#10b981] font-mono text-[9px]">({(simMinerRewardRatio * 100).toFixed(0)}%)</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">
                      {simMinerBurn === 0 ? 'Optimal (Burn = 0)' : `${(simMinerBurn * 100).toFixed(0)}% Emissions Burned`}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-[#10b981] font-black">{subnetMinersAlphaBlock.toFixed(3)} α/Blk</div>
                    <div className="text-[10px] text-slate-400">{subnetMinersAlphaTempo.toFixed(1)} α/Tempo</div>
                  </div>
                </div>

                {/* Optional burned Alpha visualized */}
                {simMinerBurn > 0 && (
                  <div className="flex justify-between items-center p-2.5 bg-rose-500/5 border border-rose-500/15 rounded-xl">
                    <div>
                      <span className="block font-space uppercase text-[10px] text-rose-400">
                        Alpha Burned <span className="font-mono text-[9px]">({(simMinerBurn * 100).toFixed(0)}%)</span>
                      </span>
                      <span className="text-[9px] text-rose-500/80 font-mono">Tokens Destroyed</span>
                    </div>
                    <div className="text-right font-mono text-rose-400">
                      <div className="font-bold">{subnetMinersBurnedBlock.toFixed(3)} α/Blk</div>
                      <div className="text-[10px]">{subnetMinersBurnedTempo.toFixed(1)} α/Tempo</div>
                    </div>
                  </div>
                )}

                {/* Validator block */}
                <div className="flex justify-between items-center p-2.5 bg-slate-100 dark:bg-white/[0.02] rounded-xl">
                  <div>
                    <span className="block font-space uppercase text-[10px] text-slate-700 dark:text-slate-300">
                      Validators + Stakers <span className="text-blue-500 font-mono text-[9px]">(41%)</span>
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">Shared consensus rewards</span>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-blue-400 font-black">{subnetValidatorsAlphaBlock.toFixed(3)} α/Blk</div>
                    <div className="text-[10px] text-slate-400">{subnetValidatorsAlphaTempo.toFixed(1)} α/Tempo</div>
                  </div>
                </div>

                {/* Total dynamic minted alpha */}
                <div className="flex justify-between items-center p-2.5 bg-orange-600/5 border border-orange-500/10 rounded-xl pt-3">
                  <span className="block font-space uppercase text-[10px] font-black text-slate-900 dark:text-white">
                    Total Subnet Mint
                  </span>
                  <div className="text-right font-mono text-orange-500">
                    <div className="font-black text-sm">{totalEmittedAlphaBlock.toFixed(3)} α/Blk</div>
                    <div className="text-[9px] font-bold">({totalEmittedAlphaTempo.toFixed(0)} Alpha / Tempo)</div>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

        {/* Warning callout inside calculator */}
        {simMinerBurn > 0 && (
          <div className="p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex items-center gap-3">
            <ShieldAlert size={18} className="text-rose-500 shrink-0" />
            <p className="text-xs text-slate-500 dark:text-rose-400/80 font-medium">
              <strong>COGNITIVE STIMULUS:</strong> You've activated a Miner Burn of <strong>{(simMinerBurn * 100).toFixed(0)}%</strong>. Check the Miners Bucket above. It is now receiving less output per block because those rewards are designated as burned, reducing actual active miner payouts.
            </p>
          </div>
        )}
      </div>

      {/* Structured Interactive Navigation Reader */}
      <div id="module-archive" className="space-y-10 pt-4">
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-3xl md:text-5xl font-black font-space italic uppercase tracking-tight text-slate-900 dark:text-white leading-none">
            CURATED MODULE ARCHIVE
          </h2>
          <p className="text-orange-500 font-mono text-xs uppercase tracking-[0.3em] font-black">
            EXPLORE THE 16 GUIDES IN SEQUENCE
          </p>
        </div>

        {/* Layout with sticky parts index and sequential stack */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sticky directory panel on the left */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 max-h-[80vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest pl-2 mb-1">
              Table of Contents
            </span>
            {parts.map((p) => {
              const isActive = activePart === p.id;
              return (
                <button
                  key={p.id}
                  onClick={(e) => {
                    e.preventDefault();
                    setActivePart(p.id);
                    try {
                      window.location.hash = `#/emissions-explained/${p.id}`;
                    } catch (err) {
                      console.warn('Sandbox block:', err);
                    }
                    const el = document.getElementById(`part-card-${p.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={`flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-950/40 to-black border-orange-500 text-white font-bold' 
                      : 'bg-white dark:bg-[#0b0e14] border-slate-200 dark:border-white/5 text-slate-500 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold uppercase ${
                      isActive ? 'bg-orange-600 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-500'
                    }`}>
                      {p.badge}
                    </span>
                    <span className={`text-xs uppercase tracking-wider font-space italic truncate max-w-[180px] ${
                      isActive ? 'text-white font-black' : 'text-slate-800 dark:text-slate-300'
                    }`}>
                      {p.title}
                    </span>
                  </div>
                  <ChevronRight size={14} className={`${isActive ? 'text-orange-500' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Sequential stream of all 16 modules stacked underneath each other */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {parts.map((p) => {
              const isActive = activePart === p.id;
              return (
                <div
                  key={p.id}
                  id={`part-card-${p.id}`}
                  className={`p-8 md:p-10 bg-white dark:bg-[#080d12] border rounded-[2rem] shadow-xl space-y-6 transition-all duration-300 scroll-mt-24 ${
                    isActive 
                      ? 'border-orange-500/80 shadow-orange-500/5 ring-1 ring-orange-500/20' 
                      : 'border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="p-2 py-1 bg-orange-600/10 text-orange-500 dark:text-orange-400 text-xs font-mono font-black uppercase rounded-lg">
                        {p.badge}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black font-space uppercase italic text-slate-900 dark:text-white tracking-tight">
                        {p.title}
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">
                      {p.id} / 16 MODULES
                    </span>
                  </div>

                  <p className="text-xs uppercase tracking-widest text-[#10b981] font-mono font-black">
                    ✦ SUMMARY EXCERPT: {p.excerpt}
                  </p>

                  <div className="pt-2 text-slate-700 dark:text-slate-300">
                    {p.content}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Classroom Analogy Callout Quote Section */}
      <div 
        onClick={(e) => {
          e.preventDefault();
          setActivePart(15);
          try {
            window.location.hash = '#/emissions-explained/15';
          } catch (err) {
            console.warn('Sandbox block:', err);
          }
        }}
        className="p-8 md:p-12 bg-white dark:bg-[#06090f] border border-slate-200 dark:border-white/5 rounded-[2.5rem] grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl cursor-pointer hover:border-orange-500/45 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="md:col-span-4 p-8 bg-orange-600/10 border border-orange-500/20 text-orange-500 rounded-3xl text-center space-y-3 shrink-0">
          <GraduationCap size={44} className="mx-auto animate-bounce" />
          <h4 className="text-lg font-space font-black uppercase italic tracking-tight text-slate-900 dark:text-white">
            CLASSROOM PARADIGM
          </h4>
          <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest font-black">
            Bittensor School Analogy
          </p>
        </div>
        
        <div className="md:col-span-8 space-y-4 text-left">
          <span className="text-[10px] font-mono text-orange-500 font-bold block uppercase tracking-widest">WHY IS THIS SO POWERFUL?</span>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
            "Think of Bittensor like a school. The school gets a TAO budget of 0.5 per block. Each classroom is a subnet, receiving a percentage based on student activity (net inflows). Inside the classrooms, you are paid in alpha points (Alpha tokens) split 18% to the room owner, 41% to the working students (miners), and 41% to teachers and backers."
          </p>
          <p className="text-xs text-slate-500 dark:text-[#10b981] font-semibold flex items-center gap-1.5">
            <CheckCircle2 size={13} /> Simplifies the entire Tokenomics architecture into human concepts.
          </p>
        </div>
      </div>

      {/* Final Summary Quote Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="p-8 md:p-10 border border-slate-200 dark:border-white/10 rounded-[2rem] bg-slate-50 dark:bg-transparent shadow-xl">
          <p className="text-lg md:text-xl font-black font-space uppercase italic tracking-tight text-slate-800 dark:text-white leading-relaxed">
            "The big mistake is thinking the 0.5 TAO block reward goes directly to the team, miners, and validators. It does not. The 0.5 TAO is network-level liquidity that gets split into subnet pools. The alpha_out is what pays the people inside."
          </p>
        </div>

        {/* Big Entry Call to Action */}
        <div className="pt-6 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <motion.a 
            href="#/tools"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-white font-black uppercase tracking-[0.18em] text-xs rounded-xl shadow-md transition-all cursor-pointer border border-slate-200 dark:border-white/10"
          >
            BACK TO TOOLS HUB
          </motion.a>

          <motion.a 
            href="#/alphagap"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4.5 bg-[#10b981] hover:bg-[#0fa370] text-white font-black uppercase tracking-[0.18em] text-xs rounded-xl shadow-xl transition-all cursor-pointer border border-transparent"
          >
            ALPHAGAP MASTERCLASS <ArrowRight size={14} />
          </motion.a>
        </div>
      </div>

    </div>
  );
};
