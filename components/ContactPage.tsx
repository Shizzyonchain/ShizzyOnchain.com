import React from 'react';
import { motion } from 'motion/react';
import { Youtube, Send, Mail } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';

const XIcon = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const ContactPage: React.FC = () => {
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
      name: 'TELEGRAM',
      url: SOCIAL_LINKS.contactTelegram,
      icon: <Send className="w-6 h-6" />,
      color: 'bg-orange-600/20 text-orange-500',
      hoverColor: 'group-hover:text-orange-500'
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
    <div className="max-w-[1400px] mx-auto px-6 py-10 space-y-12 animate-in fade-in duration-700">
      <div className="flex flex-col items-center text-center space-y-6">
        <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
          CONTACT <span className="text-orange-600">SHIZZY</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed">
          SECURE UPLINK ESTABLISHED
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {links.map((link, i) => (
          <a
            key={i}
            href={link.url}
            target={link.isEmail ? undefined : "_blank"}
            rel={link.isEmail ? undefined : "noopener noreferrer"}
            className="group flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 hover:border-orange-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`p-5 rounded-2xl ${link.color} flex items-center justify-center`}>
              {link.icon}
            </div>
            <span className={`text-sm font-black font-space italic text-slate-900 dark:text-white uppercase tracking-tight ${link.hoverColor} transition-colors text-center`}>
              {link.name}
            </span>
          </a>
        ))}
      </div>

      <div className="max-w-5xl mx-auto bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-sm p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          <img 
            src="https://i.postimg.cc/5tD4hg9d/SU-Shizzy-Background-new-(26).png" 
            alt="Shizzy" 
            className="w-64 h-64 object-cover rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div className="space-y-6 text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
            <p>
              Shizzy is a creator, commentator, and builder focused on the collision course between artificial intelligence, crypto, and decentralized systems.
            </p>
            <p>
              After co-founding OnChain Revolution, Shizzy launched Shizzy Unchained as a more personal, independent brand built around conviction, curiosity, and raw unfiltered commentary.
            </p>
            <p>
              The brand follows the rise of decentralized AI, Bittensor, subnet ecosystems, autonomous agents, and the builders creating the next wave of onchain intelligence.
            </p>
            <p>
              Shizzy is not coming at this from a corporate media background. He is a real working-class guy, a CNC machinist by trade, learning, building, and documenting the future in real time.
            </p>
            <p>
              That perspective matters. Shizzy Unchained is for people who want signal without the polished fake-expert act.
            </p>
            <p>
              The content blends market commentary, builder interviews, subnet research, AI tool exploration, product ideas, and hard opinions on where the world is heading.
            </p>
            <p>
              Shizzy is especially focused on Bittensor, TAO, subnet economies, decentralized inference, and the pick-and-shovel businesses powering the AI shift.
            </p>
            <p>
              More than a media brand, Shizzy Unchained is becoming a platform for tracking opportunity early, before the crowd understands what is happening.
            </p>
            <p>
              The voice is direct, honest, and a little rough around the edges on purpose. It is meant to feel real, not manufactured.
            </p>
            <p className="font-bold text-slate-900 dark:text-white italic">
              At its core, Shizzy Unchained is about one thing: following the biggest shift of this era and bringing the audience along for the ride.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
