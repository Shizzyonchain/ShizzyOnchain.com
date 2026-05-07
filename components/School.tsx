
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Zap, Target, Star, X, Loader2, Wallet, Copy, Check } from 'lucide-react';

const SOL_ADDRESS = '5Gsp2ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM';
const ETH_ADDRESS = '0x76f2ee7758b5AceBF5cab1819A810983EFcd1CCE';
const TAO_ADDRESS = '5HEf8ZkPSCpdscVem8NsE6qEUyjEGSf6YtKx6j1hy1ToG9VM'; // Example TAO address

export const School: React.FC = () => {
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
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 pt-16 md:pt-28 space-y-12">
        
        {/* Header Section */}
        <div className="max-w-4xl space-y-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-orange-500 font-black uppercase tracking-[0.3em] text-xs"
          >
            <div className="w-8 h-[2px] bg-orange-500" />
            UNCHAINED ACADEMY
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-[0.9]"
          >
            SHIZZY <span className="text-transparent border-text">SCHOOL</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed"
          >
            Master the Bittensor network with high-signal structured onboarding and elite strategy sessions.
          </motion.p>
        </div>

        {/* Course List - Single Column Rectangles */}
        <div className="flex flex-col gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i }}
              className="p-6 md:p-10 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm relative overflow-hidden group hover:border-orange-500/30 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                
                <div className="flex items-start md:items-center gap-6 flex-grow">
                  <div className="w-16 h-16 shrink-0 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(course.icon as React.ReactElement, { size: 32 })}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                        {course.title}
                      </h3>
                      <span className="hidden md:block text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
                        {course.tag}
                      </span>
                    </div>
                    <p className="text-base text-slate-500 dark:text-slate-400 font-medium max-w-2xl leading-relaxed">
                      {course.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end md:gap-12 pt-6 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-white/5">
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <Calendar size={18} className="text-orange-500" />
                      {course.duration}
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                      {course.price}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => openModal(course.title)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 transition-all"
                  >
                    SELECT & BOOK <ChevronRight size={18} />
                  </motion.button>
                </div>
              </div>

              {/* Faded Background Icon */}
              <div className="absolute top-1/2 right-12 -translate-y-1/2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none hidden lg:block">
                {React.cloneElement(course.icon as React.ReactElement, { size: 200 })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20">
          <div className="space-y-8 p-12 bg-orange-500 rounded-[3rem] text-white shadow-2xl shadow-orange-500/20">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              Academy <br /> Advantages
            </h3>
            <div className="space-y-6">
              {[
                "Exclusive access to the Unchained private network",
                "Proven subnet analysis framework",
                "Hands-on portfolio optimization",
                "Structured onboarding into the TAO ecosystem"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 text-orange-100 font-medium">
                  <Zap size={18} className="shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 p-12 bg-slate-900 dark:bg-white rounded-[3rem] text-white dark:text-black shadow-2xl">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              The Protocol <br /> Advantage
            </h3>
            <div className="space-y-6">
              {[
                "Priority booking for new launches",
                "Access to Unchained Insider research",
                "Custom research deep-dive requests",
                "Lifetime connection to the Academy"
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-400 dark:text-slate-600 font-medium">
                  <Zap size={18} className="shrink-0" />
                  {benefit}
                </div>
              ))}
            </div>
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
                        <span className="text-[10px] font-black uppercase tracking-[0.25em]">SECURE_TRANSACTION_SESSION</span>
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
                          href="https://calendly.com/shizzyunchained/shizzy-academy"
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
                        <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">PAYMENT_TOTAL</span>
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">SELECT_CHANNEL</label>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LAYER_1_NETWORKS</span>
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
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">DESTINATION_ADDR</label>
                            <div className="flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                               <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">ACTIVE_ROUTE</span>
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
                                  ADDRESS_COPIED_TO_CLIPBOARD
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
                          Awaiting Operator Verification Node
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
