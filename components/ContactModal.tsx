
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Youtube, Music, Send, Mail, ExternalLink } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const links = [
    {
      name: 'SHIZZYUNCHAINED (X)',
      url: SOCIAL_LINKS.unchainedX,
      icon: <XIcon className="w-6 h-6" />,
      color: 'bg-black',
      hoverColor: 'group-hover:text-slate-300'
    },
    {
      name: 'YOUTUBE',
      url: SOCIAL_LINKS.youtube,
      icon: <Youtube className="w-6 h-6" />,
      color: 'bg-red-600/20 text-red-500',
      hoverColor: 'group-hover:text-red-500'
    },
    {
      name: 'TIKTOK',
      url: SOCIAL_LINKS.tiktok,
      icon: <Music className="w-6 h-6" />,
      color: 'bg-purple-600/20 text-purple-500',
      hoverColor: 'group-hover:text-purple-500'
    },
    {
      name: 'TELEGRAM',
      url: SOCIAL_LINKS.telegram,
      icon: <Send className="w-6 h-6" />,
      color: 'bg-blue-600/20 text-blue-500',
      hoverColor: 'group-hover:text-blue-500'
    },
    {
      name: 'EMAIL',
      url: `mailto:${SOCIAL_LINKS.email}`,
      icon: <Mail className="w-6 h-6" />,
      color: 'bg-emerald-600/20 text-emerald-500',
      hoverColor: 'group-hover:text-emerald-500',
      isEmail: true
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl z-[201] p-6"
          >
            <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl">
              <div className="p-8 md:p-12 space-y-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-black font-space italic uppercase tracking-tighter text-slate-900 dark:text-white">
                    CONNECT <span className="text-blue-600">INTEL</span>
                  </h2>
                  <button 
                    onClick={onClose}
                    className="p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  {links.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target={link.isEmail ? undefined : "_blank"}
                      rel={link.isEmail ? undefined : "noopener noreferrer"}
                      className="group flex items-center justify-between p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 hover:border-blue-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-6">
                        <div className={`p-4 rounded-2xl ${link.color} flex items-center justify-center`}>
                          {link.icon}
                        </div>
                        <span className={`text-xl md:text-2xl font-black font-space italic text-slate-900 dark:text-white uppercase tracking-tight ${link.hoverColor} transition-colors`}>
                          {link.name}
                        </span>
                      </div>
                      <ExternalLink size={20} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                    </a>
                  ))}
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-white/5 text-center">
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-[0.4em]">
                    SECURE UPLINK ESTABLISHED
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
