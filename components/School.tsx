
import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Zap, Target, Star } from 'lucide-react';

export const School: React.FC = () => {
  const courses = [
    {
      title: "Beginner TAO Onboarding",
      description: "Fast-track your entry into the Bittensor ecosystem. Wallets, staking, and basic subnet logic.",
      icon: <Zap className="text-orange-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "CORE",
      bookingUrl: "https://calendly.com/shizzyunchained/beginner-tao"
    },
    {
      title: "Building a Subnet Portfolio",
      description: "Strategic allocation across the network. Learn how to evaluate alpha and manage risk.",
      icon: <Target className="text-emerald-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "STRATEGY",
      bookingUrl: "https://calendly.com/shizzyunchained/portfolio-strategy"
    },
    {
      title: "Content Creator Strategy",
      description: "How to build a brand and distribution layer in the decentralized AI space.",
      icon: <Star className="text-purple-500" />,
      duration: "60 Min",
      price: "$100",
      tag: "GROWTH",
      bookingUrl: "https://calendly.com/shizzyunchained/creator-strategy"
    }
  ];

  const handleBooking = (url: string) => {
    window.location.href = url;
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
                    onClick={() => handleBooking(course.bookingUrl)}
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
    </div>
  );
};
