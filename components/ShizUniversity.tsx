
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Zap, Target, Star, X, Loader2, Wallet, Copy, Check, ArrowUpRight } from 'lucide-react';

const SOL_ADDRESS = '5AQRnR7gsQznYtZDdXRke1iZQEmdhWju7V5dgXGx9h9J';
const ETH_ADDRESS = '0x76f2ee7758b5AceBF5cab1819A810983EFcd1CCE';
const TAO_ADDRESS = '5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM';

export const ShizUniversity: React.FC = () => {
  const courses = [
    {
      title: "Beginner TAO Onboarding",
      description: "Fast-track your entry into the Bittensor ecosystem. Wallets, staking, and basic subnet logic.",
      icon: <Zap className="text-orange-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "CORE",
    },
    {
      title: "Building a Subnet Portfolio",
      description: "Strategic allocation across the network. Learn how to evaluate alpha and manage risk.",
      icon: <Target className="text-emerald-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "STRATEGY",
    },
    {
      title: "Content Creator Strategy",
      description: "How to build a brand and distribution layer in the decentralized AI space.",
      icon: <Star className="text-purple-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "GROWTH",
    },
    {
      title: "Unchained Class",
      description: "You pick the topic you pick the conversation your choice of anything",
      icon: <Check className="text-orange-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "ELITE",
    }
  ];

  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [formData, setFormData] = useState({});
  const [paymentMethod, setPaymentMethod] = useState<'solana' | 'ethereum' | 'tao'>('solana');
  const [copied, setCopied] = useState(false);
  const [showCalendarStep, setShowCalendarStep] = useState(false);

  const openModal = (title: string) => {
    setSelectedCourse(title);
    setShowCalendarStep(false);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setFormData({});
    setPaymentMethod('solana');
    setShowCalendarStep(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setShowCalendarStep(true);
  };

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden selection:bg-orange-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.08),transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 pt-20 md:pt-32 space-y-24">
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-8">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.4em] text-[10px]"
              >
                <div className="w-10 h-[1px] bg-orange-500" />
                SHIZ UNIVERSITY
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl lg:text-9xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
              >
                SHIZ <span className="text-orange-500">UNIVERSITY</span>
              </motion.h1>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6 max-w-3xl"
            >
              <p className="text-xl md:text-2xl text-slate-900 dark:text-slate-200 font-bold leading-tight uppercase tracking-tight italic">
                A private 1-on-1 learning experience built around what you actually want to master.
              </p>
              <div className="space-y-4">
                 <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                   From content creation and crypto security to onchain trading, Bitcoin, Ethereum, TAO, Bittensor subnets, portfolio structure, and risk management, each session is tailored to your goals.
                 </p>
                 <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                   Book one session or continue for as many as you need. Shizzy will help you break down the topic, understand the landscape, and think through it with real-world experience and honest commentary.
                 </p>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block pb-1"
          >
            <div className="p-8 bg-orange-500/[0.03] border border-orange-500/20 rounded-[2.5rem] backdrop-blur-sm">
              <p className="text-sm md:text-base font-black uppercase tracking-[0.1em] text-orange-500/90 italic leading-relaxed">
                Nothing here is financial or life advice. This is education, perspective, and personal commentary.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Course Selection - Unified High-Impact Grid */}
        <div className="space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-8">
             <div className="space-y-2">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">CURRICULUM SELECTION</span>
               <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">CHOOSE YOUR PATH</h2>
             </div>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Available Paths: {courses.length}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, i) => (
              <motion.div
                key={course.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="group relative p-10 bg-white dark:bg-[#0b0e14] border-2 border-orange-500/10 rounded-[3.5rem] hover:border-orange-500 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col"
                onClick={() => openModal(course.title)}
              >
                <div className="relative z-10 space-y-10 flex flex-col h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-20 h-20 shrink-0 rounded-[2rem] bg-orange-500/5 flex items-center justify-center border border-orange-500/10 group-hover:bg-orange-500 group-hover:scale-110 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]">
                      {React.cloneElement(course.icon as React.ReactElement, { size: 36, className: "group-hover:text-white transition-colors" })}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 dark:text-slate-400">
                      {course.tag}
                    </span>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.9] italic">
                      {course.title}
                    </h3>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-md">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex gap-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SESSION LENGTH</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white uppercase">{course.duration}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 underline decoration-orange-500/30 underline-offset-4">REGISTRATION</span>
                        <span className="text-xl font-black text-slate-900 dark:text-white uppercase">$100 USD</span>
                      </div>
                    </div>
                    
                    <div className="w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all shadow-xl group-hover:scale-110">
                      <ChevronRight size={28} strokeWidth={3} />
                    </div>
                  </div>
                </div>

                {/* Decorative Glow */}
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-500 opacity-[0.02] blur-[100px] rounded-full group-hover:opacity-[0.06] transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Advantages - Simplified and polished */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-8">
             <div className="space-y-2">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500">OPERATIONAL EDGE</span>
               <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">ADVANTAGES</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
            {[
              "Exclusive access to the Unchained private network",
              "1-on-1 coaching with Shizzy",
              "Content creation and crypto education",
              "Onchain trading walkthroughs",
              "Bitcoin, Ethereum, TAO, and subnet lessons",
              "Hardware wallet and security basics",
              "Portfolio structure and risk management discussion",
              "Custom research deep dives",
              "Access to Unchained Insider research",
              "Lifetime connection to the University"
            ].map((advantage, i) => (
              <motion.div 
                key={advantage}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-5 group"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white transition-all underline decoration-transparent">
                  <Check size={12} strokeWidth={4} />
                </div>
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 uppercase tracking-tighter">
                  {advantage}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* PARTNER TOOLS SECTION */}
        <div className="space-y-12 pt-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-8">
             <div className="space-y-2">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#10b981]">HIGH-SIGNAL ENVIRONMENT</span>
               <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">RESOURCES & PARTNER TOOLS</h2>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* AlphaGap Card */}
            <motion.a
              href="#/alphagap"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative p-8 bg-white dark:bg-[#061a14] border-2 border-[#10b981]/10 rounded-[2.5rem] hover:border-[#10b981] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-white p-2 border border-[#10b981]/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-[#10b981]/50 transition-all duration-300 shadow-xl overflow-hidden">
                <img 
                  src="https://i.postimg.cc/wvQ7j51G/q-IVTImp-C-400x400.jpg" 
                  alt="AlphaGap Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 flex-grow text-center md:text-left">
                <h4 className="text-2xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">ALPHAGAP</h4>
                <p className="text-sm text-slate-500 dark:text-[#10b981]/70 font-medium max-w-sm">Bridge the gap between retail and institutional intelligence. Highly recommended for students of global macro and onchain signals.</p>
              </div>
              <div className="shrink-0 w-12 h-12 bg-[#10b981]/10 text-[#10b981] rounded-full flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-all">
                <ArrowUpRight size={24} strokeWidth={3} />
              </div>
            </motion.a>

            {/* Mentat Minds Card */}
            <motion.a
              href="https://mentatminds.com/mentat-plus/?origin=ShizzyUnchained"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group relative p-8 bg-white dark:bg-[#0c0c2e] border-2 border-[#2e2ede]/10 rounded-[2.5rem] hover:border-[#2e2ede] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-white p-2 border border-[#2e2ede]/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-[#2e2ede]/50 transition-all duration-300 shadow-xl overflow-hidden">
                <img 
                  src="https://i.postimg.cc/7PNmppZV/0h-Aj-Uve3-400x400.jpg" 
                  alt="Mentat Minds Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 flex-grow text-center md:text-left">
                <h4 className="text-2xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">MENTAT MINDS</h4>
                <p className="text-sm text-slate-500 dark:text-[#2e2ede]/70 font-medium max-w-sm">High-performance TAO staking infrastructure. The standard for maximizing yield in the Bittensor network.</p>
              </div>
              <div className="shrink-0 w-12 h-12 bg-[#2e2ede]/10 text-[#2e2ede] rounded-full flex items-center justify-center group-hover:bg-[#2e2ede] group-hover:text-white transition-all">
                <ArrowUpRight size={24} strokeWidth={3} />
              </div>
            </motion.a>

            {/* Ledger Card */}
            <motion.a
              href="https://shop.ledger.com/?r=49c0bef9b376"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group relative p-8 bg-white dark:bg-[#1a1a1a] border-2 border-white/5 rounded-[2.5rem] hover:border-orange-500 transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-orange-500 transition-all duration-300 shadow-xl overflow-hidden">
                <img 
                  src="https://i.postimg.cc/hPkzMGRm/QQRj-VYhi-400x400.jpg" 
                  alt="Ledger Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 flex-grow text-center md:text-left">
                <h4 className="text-2xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">LEDGER</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm">The industry standard for self-custody. Essential hardware for securing your onchain assets and TAO earnings.</p>
              </div>
              <div className="shrink-0 w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                <ArrowUpRight size={24} strokeWidth={3} />
              </div>
            </motion.a>

            {/* NordVPN Card */}
            <motion.a
              href="https://go.nordvpn.net/aff_c?offer_id=15&aff_id=145365&source=Shizzyunchained"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group relative p-8 bg-white dark:bg-[#0c2340] border-2 border-[#1a3c6d]/10 rounded-[2.5rem] hover:border-[#2b65ba] transition-all duration-500 overflow-hidden flex flex-col md:flex-row items-center gap-6"
            >
              <div className="w-20 h-20 shrink-0 rounded-2xl bg-white p-2 border border-slate-200 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 group-hover:border-[#2b65ba] transition-all duration-300 shadow-xl overflow-hidden">
                <img 
                  src="https://i.postimg.cc/nL0L8Fgk/J6Qi3VW-400x400.jpg" 
                  alt="NordVPN Logo" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 flex-grow text-center md:text-left">
                <h4 className="text-2xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">NORDVPN</h4>
                <p className="text-sm text-slate-500 dark:text-[#a5c2eb]/70 font-medium max-w-sm">Secure your digital footprint. Recommended for students to protect privacy and access global content securely.</p>
              </div>
              <div className="shrink-0 w-12 h-12 bg-[#2b65ba]/10 text-[#2b65ba] rounded-full flex items-center justify-center group-hover:bg-[#2b65ba] group-hover:text-white transition-all">
                <ArrowUpRight size={24} strokeWidth={3} />
              </div>
            </motion.a>
          </div>
        </div>

        {/* Mobile Disclaimer */}
        <div className="lg:hidden">
          <div className="p-8 bg-orange-500/[0.03] border border-orange-500/20 rounded-[2.5rem]">
            <p className="text-sm font-black uppercase tracking-[0.1em] text-orange-500/90 italic leading-relaxed">
              Nothing here is financial or life advice. This is education, perspective, and personal commentary.
            </p>
          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-slate-900/90 backdrop-blur-md cursor-pointer"
            />
            
            {/* Modal Container to handle alignment and scrolling */}
            <div className="flex flex-col items-center justify-start md:justify-center p-4 py-20 md:p-12 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative w-full max-w-lg bg-[#0b0e14] border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(249,115,22,0.3)] pointer-events-auto"
              >
                {/* Modal Glow Header */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                
                <div className="p-8 md:p-10 space-y-8">
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-white/5 pb-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-orange-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">SECURE TRANSACTION SESSION</span>
                      </div>
                      <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
                        {selectedCourse}
                      </h3>
                    </div>
                    <button 
                      onClick={closeModal}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all shrink-0 border border-white/5"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  {showCalendarStep ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-10 space-y-10"
                    >
                      <div className="relative inline-block">
                        <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_-10px_rgba(249,115,22,0.4)]">
                          <Calendar className="text-white" size={44} strokeWidth={2.5} />
                        </div>
                      </div>
                      
                      <div className="space-y-8 px-2">
                        <div className="space-y-2">
                          <h4 className="text-4xl font-black uppercase text-white italic tracking-tighter leading-tight">
                            READ CAREFULLY <br/>BEFORE BOOKING
                          </h4>
                          <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">Mandatory step for confirmation</p>
                        </div>
                        
                        <div className="space-y-4 max-w-sm mx-auto">
                          <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl text-left space-y-3">
                            <p className="text-slate-300 font-medium leading-relaxed">
                              When booking on the calendar, you <span className="text-white font-bold underline">MUST</span> add the following to the <span className="text-orange-500 font-bold">comments field</span>:
                            </p>
                            <ul className="space-y-2 text-white font-black text-xs uppercase tracking-widest list-none">
                              <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                TX ID / Proof of Funds
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                Full Name & Email
                              </li>
                              <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                                The Class You Chose
                              </li>
                            </ul>
                          </div>

                          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                             <p className="text-[10px] font-black uppercase tracking-widest text-rose-500 text-center">
                               Applications without these details will be rejected
                             </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4">
                        <a
                          href="https://calendly.com/shizzyunchained/shiz-university"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full inline-flex items-center justify-center gap-4 px-12 py-7 bg-white text-black rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-sm hover:bg-orange-500 hover:text-white transition-all shadow-2xl active:scale-[0.98]"
                        >
                          OPEN CALENDAR <ChevronRight size={22} strokeWidth={3} />
                        </a>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="space-y-10">
                      {/* Amount Display */}
                      <div className="relative group p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-2 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.1),transparent_70%)]" />
                        <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">PAYMENT TOTAL</span>
                        <div className="relative flex items-baseline gap-2">
                          <span className="text-7xl font-black italic text-white tracking-tighter">$100</span>
                          <span className="text-lg font-black text-orange-500 opacity-80 uppercase italic tracking-tighter">USD</span>
                        </div>
                        <div className="relative mt-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                          <span className="text-[9px] font-black uppercase tracking-widest text-orange-500">STABLES / SOL / ETH / TAO</span>
                        </div>
                      </div>

                      {/* Network & Transfer Details */}
                      <div className="space-y-6">
                        {/* Selector */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SELECT CHANNEL</label>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LAYER 1 NETWORKS</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl">
                            {[
                              { id: 'solana', name: 'SOLANA', network: 'SPL' },
                              { id: 'ethereum', name: 'ERC-20', network: 'ETH' },
                              { id: 'tao', name: 'TAO', network: 'BITTENSOR' }
                            ].map((method) => (
                              <button
                                key={method.id}
                                onClick={() => setPaymentMethod(method.id as any)}
                                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl border transition-all ${
                                  paymentMethod === method.id 
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-xl shadow-orange-500/20' 
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-slate-300'
                                }`}
                              >
                                <span className="text-[11px] font-black uppercase tracking-widest leading-none">{method.name}</span>
                                <span className={`text-[8px] font-black uppercase opacity-60 ${paymentMethod === method.id ? 'text-white' : 'text-slate-600'}`}>{method.network}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Address Field */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">DESTINATION ADDRESS</label>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">ACTIVE ROUTE</span>
                            </div>
                          </div>
                          
                          <div 
                            className="relative group cursor-pointer" 
                            onClick={() => copyToClipboard(paymentMethod === 'solana' ? SOL_ADDRESS : paymentMethod === 'ethereum' ? ETH_ADDRESS : TAO_ADDRESS)}
                          >
                            <div className="w-full px-6 py-6 bg-black/40 border border-white/10 rounded-3xl group-hover:border-orange-500/40 transition-all duration-300">
                              <div className="font-mono text-[11px] break-all pr-12 text-slate-300 leading-relaxed text-left">
                                {paymentMethod === 'solana' ? SOL_ADDRESS : paymentMethod === 'ethereum' ? ETH_ADDRESS : TAO_ADDRESS}
                              </div>
                            </div>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2">
                               <div className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-white/5 text-slate-400 group-hover:bg-orange-500 group-hover:text-white'}`}>
                                {copied ? <Check size={18} strokeWidth={3} /> : <Copy size={18} />}
                               </div>
                            </div>
                            
                            <AnimatePresence>
                              {copied && (
                                <motion.div 
                                  initial={{ opacity: 0, y: 10, scale: 0.9 }} 
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                  className="absolute -top-12 left-1/2 -translate-x-1/2 text-[10px] font-black bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-2xl z-20"
                                >
                                  ADDRESS COPIED TO CLIPBOARD
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>

                      {/* Footer Alert */}
                      <div className="flex items-start gap-4 p-5 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                        <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0 border border-orange-500/20">
                          <Zap className="text-orange-500" size={20} fill="currentColor" />
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 leading-relaxed text-left uppercase tracking-wider">
                          Ensure you are sending <span className="text-white font-bold">$100 equivalent</span> on the correct network. <span className="text-orange-500 font-bold">CROSS-CHAIN TRANSFERS MIGHT BE LOST.</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="pt-2">
                        <button
                          onClick={handleBookingSubmit}
                          className="w-full h-20 bg-orange-500 hover:bg-orange-600 text-white rounded-[2rem] font-black uppercase tracking-[0.25em] text-sm shadow-[0_20px_50px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_60px_rgba(249,115,22,0.4)] transition-all flex items-center justify-center gap-4 active:scale-[0.98]"
                        >
                          BOOK CLASS <ChevronRight size={20} strokeWidth={3} />
                        </button>
                        <div className="text-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-600 mt-6 flex items-center justify-center gap-3">
                          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                          Awaiting Operator Verification
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
