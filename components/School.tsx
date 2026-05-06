
import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, GraduationCap, ChevronRight, Zap, Target, Users, BookOpen, Star } from 'lucide-react';

export const School: React.FC = () => {
  useEffect(() => {
    // Dynamically load Calendly widget script
    const script = document.createElement('script');
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const courses = [
    {
      title: "Beginner TAO Onboarding",
      description: "Fast-track your entry into the Bittensor ecosystem. Wallets, staking, and basic subnet logic.",
      icon: <Zap className="text-orange-500" />,
      duration: "60 Min",
      tag: "CORE"
    },
    {
      title: "Building a Subnet Portfolio",
      description: "Strategic allocation across the network. Learn how to evaluate alpha and manage risk.",
      icon: <Target className="text-emerald-500" />,
      duration: "90 Min",
      tag: "STRATEGY"
    },
    {
      title: "Bittensor Deep Dive",
      description: "Advanced protocol mechanics, validator dynamics, and emission scheduling breakdown.",
      icon: <BookOpen className="text-blue-500" />,
      duration: "2 Hours",
      tag: "ADVANCED"
    },
    {
      title: "Content Creator Strategy",
      description: "How to build a brand and distribution layer in the decentralized AI space.",
      icon: <Star className="text-purple-500" />,
      duration: "60 Min",
      tag: "GROWTH"
    },
    {
      title: "1-on-1 Consulting",
      description: "Direct access for customized strategy, technical troubleshooting, or market analysis.",
      icon: <Users className="text-rose-500" />,
      duration: "Custom",
      tag: "PRIVATE"
    },
    {
      title: "Private Community Calls",
      description: "Bi-weekly group sessions covering live market shifts and new subnet launches.",
      icon: <GraduationCap className="text-amber-500" />,
      duration: "Recurring",
      tag: "COMMUNITY"
    }
  ];

  return (
    <div className="relative min-h-screen pb-24 overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-orange-500/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative max-w-[1400px] mx-auto px-6 pt-16 md:pt-28 space-y-16">
        
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
            Master the Bittensor network with high-signal consulting and structured onboarding. Book your slot below.
          </motion.p>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -5 }}
              className="p-8 bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                {React.cloneElement(course.icon as React.ReactElement, { size: 120 })}
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center border border-slate-100 dark:border-white/10 group-hover:scale-110 transition-transform duration-500">
                    {React.cloneElement(course.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full text-slate-400">
                    {course.tag}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <Calendar size={14} />
                    {course.duration}
                  </div>
                  <ChevronRight size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Calendly Integration Section */}
        <section className="space-y-12 pt-20 border-t border-slate-200 dark:border-white/5">
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white">
              Secure Your <span className="text-orange-500">Sync</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl mx-auto">
              Direct integration with Stripe and Google Calendar ensures immediate confirmation and zero scheduling friction.
            </p>
          </div>

          <div 
            className="calendly-inline-widget w-full rounded-[3rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl bg-white dark:bg-[#0b0e14]" 
            data-url="https://calendly.com/shizzyunchained?hide_landing_page_details=1&hide_gdpr_banner=1" 
            style={{ minWidth: '320px', height: '800px' }} 
          />
        </section>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-20">
          <div className="space-y-8 p-12 bg-orange-500 rounded-[3rem] text-white shadow-2xl shadow-orange-500/20">
            <h3 className="text-4xl font-black italic uppercase tracking-tighter leading-none">
              High-Signal <br /> Consulting
            </h3>
            <div className="space-y-6">
              {[
                "1-on-1 access to Shizzy's private network",
                "Proven subnet analysis framework",
                "Portfolio optimization strategies",
                "Direct onboarding into TAO ecosystem"
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
