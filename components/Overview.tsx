import React from 'react';
import { SOCIAL_LINKS } from '../constants.tsx';
import { View } from '../types.ts';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Zap, 
  CheckCircle, 
  Play, 
  Shield, 
  Terminal, 
  Activity, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  TrendingUp, 
  GraduationCap, 
  Cpu 
} from 'lucide-react';

interface OverviewProps {
  onNavigate?: (view: View) => void;
}

export const Overview: React.FC<OverviewProps> = ({ onNavigate }) => {
  return (
    <div className="relative min-h-screen bg-[#06080c] text-white overflow-hidden pb-24">
      
      {/* Premium Backlighting & Ambient Depth Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[700px] bg-gradient-to-b from-cyan-500/5 via-blue-500/[0.02] to-transparent pointer-events-none blur-[140px] z-0" />
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/[0.02] rounded-full pointer-events-none blur-[150px] z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-cyan-600/[0.02] rounded-full pointer-events-none blur-[180px] z-0" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#111726_1px,transparent_1px),linear-gradient(to_bottom,#111726_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none z-0" />

      <div className="relative max-w-[1200px] mx-auto px-6 pt-16 md:pt-24 space-y-32 z-10">
        
        {/* SECTION 1: HERO SECTION */}
        <section className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center" id="hero-section">
          
          {/* Hero Content Left */}
          <div className="lg:col-span-7 space-y-8 text-left">
            

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-space tracking-tight leading-[1.05] uppercase text-white">
              Find The Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-400">
                Bittensor Subnet Runner
              </span> <br />
              Before The Crowd
            </h1>

            {/* Supporting Subheadline */}
            <p className="text-lg md:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl font-sans">
              ShizzyUnchained breaks down TAO, subnets, alpha tools, interviews, and market moves for retail users who want <strong className="text-cyan-400 font-semibold">signal, not noise</strong>.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => onNavigate?.('alphagap')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white font-black uppercase text-xs tracking-widest rounded-xl transition-all shadow-[0_4px_25px_rgba(6,182,212,0.30)] hover:shadow-[0_8px_30px_rgba(6,182,212,0.45)] transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                id="btn-hero-masterclass"
              >
                <GraduationCap size={16} /> ALPHAGAP MASTERCLASS
              </button>
              <button 
                onClick={() => onNavigate?.('videos')}
                className="px-8 py-4 bg-[#0a0e17] hover:bg-[#121824] border border-cyan-500/20 text-white font-bold uppercase text-xs tracking-widest rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 hover:border-cyan-500/50"
                id="btn-hero-latest-show"
              >
                <Play size={14} className="fill-current text-cyan-400" /> Watch The Latest Show
              </button>
            </div>


          </div>

          {/* Hero Decorative Right Graphic */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-[460px]">
              {/* Outer frame neon gradient glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 via-teal-400 to-indigo-500 rounded-3xl p-0.5 blur-lg opacity-25" />
              
              {/* Main Media Deck Box */}
              <div className="relative bg-[#0d1321] border border-cyan-500/20 rounded-3xl overflow-hidden p-8 space-y-7 shadow-[0_10px_40px_rgba(6,182,212,0.15)]">
                
                {/* Visual Terminal Overlay with actual Shizzy image */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-[#212d42] bg-[#03060a]">
                  <img 
                    src="https://i.postimg.cc/X7BGRP29/Copy-of-SU-Shizzy-Background-new-(1).png" 
                    alt="Shizzy Unchained HQ" 
                    className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle technical gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d1321] via-transparent to-transparent opacity-90" />
                  
                  {/* Internal Status Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-cyan-400 text-xs font-mono font-bold border border-cyan-500/30 rounded shadow-md">
                      TAO INSIDER: ON
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-black">SHIZZY UNCHAINED</span>
                      <h3 className="text-xl font-black uppercase text-white font-space tracking-tight">FOUNDER & HOST</h3>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                </div>

                {/* Info Text & Quick Start Action block */}
                <div className="space-y-6">
                  <p className="text-sm text-slate-300 leading-relaxed font-sans italic border-l-2 border-cyan-400/50 pl-4 py-1">
                    "Decentralized AI is the asymmetric gold-rush of this cycle, but 99% of retail will buy the wrong vaporware subnets. We track commits, emissions, and raw code to bypass the noise."
                  </p>
                  
                  <a 
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-5 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-500 hover:to-teal-500 text-white font-edo uppercase tracking-widest transition-all block text-center rounded-2xl text-sm sm:text-base shadow-[0_4px_30px_rgba(6,182,212,0.4)] hover:shadow-[0_8px_40px_rgba(6,182,212,0.6)] transform hover:-translate-y-1 active:scale-[0.98] duration-300"
                    id="hero-telegram-join"
                  >
                    JOIN UNCHAINED INSIDERS TELEGRAM
                  </a>
                </div>

              </div>
            </div>
          </div>

        </section>

        {/* SECTION 2: START HERE / QUICK PATHS */}
        <section className="space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold">MY X & YOUTUBE</h2>
            <p className="text-3xl md:text-4xl font-space font-black uppercase tracking-tight text-white mb-2">
              Accelerate Your Edge
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="quick-paths-grid">
            
            {/* Card 1: X (Twitter) */}
            <div className="p-6 rounded-2xl bg-[#0a0e17] border border-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-5">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black relative">
                  <img 
                    src="https://i.postimg.cc/wTHxbwGM/75e66bf8-7be9-4857-b95c-e7f413959394.png" 
                    alt="X (Twitter) Preview" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">REAL-TIME FEEDS</span>
                    <h3 className="text-lg font-bold uppercase text-white group-hover:text-cyan-400 transition-colors">
                      Official X Account
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Follow real-time onchain alpha, immediate validation alerts, dynamic subnet adjustments, and rapid breaking news takes.
                </p>
              </div>
              <div className="pt-6">
                <a 
                  href={SOCIAL_LINKS.unchainedX}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#111827] hover:bg-[#1f2937] text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  Follow on X <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 2: YouTube */}
            <div className="p-6 rounded-2xl bg-[#0a0e17] border border-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-5">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black relative">
                  <img 
                    src="https://i.postimg.cc/k4z6bWJg/7adc4f37-3644-4af8-974b-395f766e632d.png" 
                    alt="YouTube Channel Preview" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <Play size={16} className="fill-current text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">VIDEO DISPATCHES</span>
                    <h3 className="text-lg font-bold uppercase text-white group-hover:text-cyan-400 transition-colors">
                      YouTube Channel
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Subscribe for deep dives, unfiltered live broadcast streams, weekly token staking tutorials, and technical subnet code reviews.
                </p>
              </div>
              <div className="pt-6">
                <a 
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#111827] hover:bg-[#1f2937] text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  Launch YouTube <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

            {/* Card 3: Community Join */}
            <div className="p-6 rounded-2xl bg-[#0a0e17] border border-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group shadow-xl">
              <div className="space-y-5">
                <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black relative">
                  <img 
                    src="https://i.postimg.cc/TPWXPb4z/8f5769e6-e42d-41e8-b2e7-15179aed489a.png" 
                    alt="Telegram Join Preview" 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">INTEL TELEGRAM</span>
                    <h3 className="text-lg font-bold uppercase text-white group-hover:text-cyan-400 transition-colors">
                      Join Insider Circle
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Gain immediate access to our telegram list where premium signals, validator pings, and community discussions are hosted daily.
                </p>
              </div>
              <div className="pt-6">
                <a 
                  href={SOCIAL_LINKS.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#111827] hover:bg-[#1f2937] text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 text-center"
                >
                  Join Telegram <ArrowUpRight size={14} />
                </a>
              </div>
            </div>

          </div>
        </section>




        {/* SECTION 5: CREDIBILITY & SOCIAL PROOF */}
        <section className="space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold">CREDIBILITY INDEX</h2>
            <p className="text-3xl md:text-4xl font-space font-black uppercase tracking-tight text-white mb-2">
              Why Listen to ShizzyUnchained
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center" id="credibility-stats">
            
            {/* Stat Item 1 */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
              <span className="block text-4xl font-space font-black text-cyan-400">250</span>
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">TELEGRAM INSIDERS</span>
            </div>
 
            {/* Stat Item 2 */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
              <span className="block text-4xl font-space font-black text-cyan-400">1,000+</span>
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">YOUTUBE VIDEOS</span>
            </div>
 
            {/* Stat Item 3 */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
              <span className="block text-4xl font-space font-black text-cyan-400">128</span>
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">SUBNETS MONITORED</span>
            </div>
 
            {/* Stat Item 4 */}
            <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 space-y-2">
              <span className="block text-4xl font-space font-black text-cyan-400">500k+</span>
              <span className="block text-[10px] font-mono font-semibold uppercase tracking-widest text-slate-400">PLATFORM VIEWS</span>
            </div>
 
          </div>

          {/* Core Philosophy Paragraphs */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-slate-400 text-sm leading-relaxed font-sans">
              ShizzyUnchained is built strictly on independent developer coverage. We run full-stack validators and node clients. We do not participate in paid venture capital dumping programs or accept corporate board seats that leverage retail capital. Pure, unfiltered alpha.
            </p>
          </div>

        </section>

        {/* SECTION 6: RECOMMENDED TOOLS / CAPITAL SPONSORS */}
        <section className="space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold">RECOMMENDED ARSENAL</h2>
            <p className="text-3xl md:text-4xl font-space font-black uppercase tracking-tight text-white mb-2">
              Trusted Onchain Tools & Partners
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto" />
            <p className="text-xs text-slate-450 max-w-xl mx-auto leading-relaxed">
              These are verified integrations we use at our active terminals to delegate TAO, secure server setups, and maintain network privacy.
            </p>
          </div>

          <div className="flex flex-col gap-6 max-w-4xl mx-auto" id="sponsors-grid">
            
            {/* Sponsor Card 1: AlphaGap */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#03150f] border border-emerald-500/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 shadow-xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex items-center justify-between w-full sm:w-auto self-start">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 border border-[#111] shadow-md shrink-0">
                    <img 
                      src="https://i.postimg.cc/wvQ7j51G/q-IVTImp-C-400x400.jpg" 
                      alt="AlphaGap Signature" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="sm:hidden px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[9px] font-mono rounded uppercase tracking-wider">
                    FEATURED PARTNER
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="hidden sm:inline-flex items-center">
                    <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 text-[9px] font-mono rounded uppercase tracking-wider">
                      FEATURED PARTNER
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-space text-white uppercase group-hover:text-emerald-400 transition-colors">AlphaGap Protocol</h4>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                    Bypass the retail trap. Secure institutional signals, customized algorithmic trackers, execution APIs, and automated tools designed for macro-yield miners.
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <button 
                  onClick={() => onNavigate?.('alphagap')}
                  className="w-full md:w-auto px-6 py-2.5 bg-[#0b1b15] hover:bg-emerald-950 text-emerald-400 border border-emerald-500/20 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  ACQUIRE STRATEGY <ArrowRight size={12} />
                </button>
              </div>
            </div>

            {/* Sponsor Card 2: Mentat Minds */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#090b1c] border border-blue-500/10 hover:border-blue-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 shadow-xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex items-center justify-between w-full sm:w-auto self-start">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 border border-[#111] shadow-md shrink-0">
                    <img 
                      src="https://i.postimg.cc/7PNmppZV/0h-Aj-Uve3-400x400.jpg" 
                      alt="Mentat Minds Signature" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="sm:hidden px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[9px] font-mono rounded uppercase tracking-wider">
                    STAKING PARTNER
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="hidden sm:inline-flex items-center">
                    <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 text-[9px] font-mono rounded uppercase tracking-wider">
                      STAKING PARTNER
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-space text-white uppercase group-hover:text-blue-400 transition-colors">Mentat Minds</h4>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                    Maximize your block allocations. Delegate and stake TAO via top-tier low-latency high-reliability bare-metal staking validators.
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <a 
                  href="https://mentatminds.com/mentat-plus/?origin=ShizzyUnchained" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#0b1022] hover:bg-blue-950 text-blue-300 border border-blue-500/20 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  DELEGATE TAO <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Sponsor Card 3: Ledger */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#1c0f0a] border border-orange-500/10 hover:border-orange-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 shadow-xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex items-center justify-between w-full sm:w-auto self-start">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 border border-[#111] shadow-md shrink-0">
                    <img 
                      src="https://i.postimg.cc/hPkzMGRm/QQRj-VYhi-400x400.jpg" 
                      alt="Ledger Signature" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="sm:hidden px-2 py-0.5 bg-orange-500/15 text-orange-400 text-[9px] font-mono rounded uppercase tracking-wider">
                    SELF-CUSTODY KEYS
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="hidden sm:inline-flex items-center">
                    <span className="px-2 py-0.5 bg-orange-500/15 text-orange-400 text-[9px] font-mono rounded uppercase tracking-wider">
                      SELF-CUSTODY KEYS
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-space text-white uppercase group-hover:text-orange-400 transition-colors">Ledger Vault</h4>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                    The cold standard. Never store your seed phrases on volatile network hosting. Secure physical access coordinates using Ledger hardware vaults.
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <a 
                  href={SOCIAL_LINKS.ledger} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#20120a] hover:bg-orange-950 text-orange-300 border border-orange-500/20 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  ACQUIRE HARDWARE <ArrowRight size={12} />
                </a>
              </div>
            </div>

            {/* Sponsor Card 4: NordVPN */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#030d22] border border-cyan-500/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8 shadow-xl relative overflow-hidden group">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="flex items-center justify-between w-full sm:w-auto self-start">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 border border-[#111] shadow-md shrink-0">
                    <img 
                      src="https://i.postimg.cc/3xfvTssD/5d00cbe9-bb57-4596-92cb-752fccac831d.png" 
                      alt="NordVPN Signature" 
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="sm:hidden px-2 py-0.5 bg-cyan-500/15 text-cyan-400 text-[9px] font-mono rounded uppercase tracking-wider">
                    NETWORK SECURITY
                  </span>
                </div>
                <div className="space-y-2 text-left">
                  <div className="hidden sm:inline-flex items-center">
                    <span className="px-2 py-0.5 bg-cyan-500/15 text-cyan-400 text-[9px] font-mono rounded uppercase tracking-wider">
                      NETWORK SECURITY
                    </span>
                  </div>
                  <h4 className="text-lg font-bold font-space text-white uppercase group-hover:text-cyan-400 transition-colors">NordVPN</h4>
                  <p className="text-slate-300 text-xs leading-relaxed max-w-xl">
                    Protect your server terminals and node deployments. Encrypt onchain footprints, bypass geo-restrictions, and maintain total node infrastructure anonymity.
                  </p>
                </div>
              </div>
              <div className="shrink-0 w-full md:w-auto">
                <a 
                  href={SOCIAL_LINKS.nordVpn} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-6 py-2.5 bg-[#0a1735] hover:bg-[#122e5a] text-cyan-300 border border-cyan-500/20 font-mono text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  SECURE CONNECTION <ArrowRight size={12} />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 7: MERCH OR BRAND EXTRAS */}
        <section className="space-y-12">
          
          <div className="text-center space-y-4">
            <h2 className="text-sm font-mono text-cyan-400 tracking-[0.25em] uppercase font-bold">MERCH DECK</h2>
            <p className="text-3xl md:text-4xl font-space font-black uppercase tracking-tight text-white mb-2">
              SHIZZY UNCHAINED COLLECTION
            </p>
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-indigo-500 mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <a 
              href="https://shizzyunchained.printful.me/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block group relative overflow-hidden rounded-2xl border border-slate-800 bg-[#070b12] shadow-2xl transition-all duration-300 hover:border-cyan-500/30"
            >
              <img 
                src="https://i.postimg.cc/rshrw7D7/0a9195dd-f840-4eca-a630-a5161e3a186a.png" 
                alt="SHIZZY UNCHAINED COLLECTION" 
                className="w-full h-auto block transition-transform duration-500 ease-out group-hover:scale-[1.01]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#06b6d4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </a>
          </div>

        </section>



      </div>
    </div>
  );
};
