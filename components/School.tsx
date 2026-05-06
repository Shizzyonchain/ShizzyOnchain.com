
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, ChevronRight, Zap, Target, Star, X, Loader2 } from 'lucide-react';

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
  const [formData, setFormData] = useState({ name: '', email: '', preferredTime: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openModal = (title: string) => {
    setSelectedCourse(title);
    setError(null);
  };

  const closeModal = () => {
    setSelectedCourse(null);
    setFormData({ name: '', email: '', preferredTime: '' });
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseTitle: selectedCourse,
          name: formData.name,
          email: formData.email,
          preferredTime: formData.preferredTime
        })
      });
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned an invalid response.');
      }

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      console.error('Payment Error:', err);
      setError(err.message || 'Failed to initiate payment. Please try again.');
      setIsSubmitting(false);
    }
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>

              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-2">
                    Request Booking
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {selectedCourse} - $100
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold rounded-xl">
                    {error}
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Name</label>
                    <input 
                      type="text" 
                      required
                      disabled={isSubmitting}
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
                      placeholder="Satoshi Nakamoto"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Email</label>
                    <input 
                      type="email" 
                      required
                      disabled={isSubmitting}
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
                      placeholder="satoshirunes@gmail.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 pl-1">Preferred Time / Day</label>
                    <input 
                      type="text" 
                      required
                      disabled={isSubmitting}
                      value={formData.preferredTime}
                      onChange={e => setFormData({...formData, preferredTime: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-medium focus:outline-none focus:border-orange-500/50 transition-colors"
                      placeholder="e.g. Wednesday afternoons (EST)"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden flex items-center justify-center gap-2 px-8 py-4 bg-orange-500 text-white rounded-xl font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay $100 & Request <ChevronRight size={18} />
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-4">
                    You will receive an email from Shizzy to finalize the exact time.
                  </p>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
