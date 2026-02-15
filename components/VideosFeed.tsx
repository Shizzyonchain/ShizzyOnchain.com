
import React, { useState, useEffect } from 'react';
import { youtubeService } from '../services/youtubeService.ts';
import { VideoItem } from '../types.ts';
import { Loader2, Play, ArrowRight, Zap, Smartphone, Clapperboard } from 'lucide-react';
import { SOCIAL_LINKS } from '../constants.tsx';

export const VideosFeed: React.FC = () => {
  const [videos, setVideos] = useState<{ lives: VideoItem[], shorts: VideoItem[] }>({ lives: [], shorts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const data = await youtubeService.getLatestVideos();
      setVideos(data);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-6">
        <Loader2 className="animate-spin text-blue-600" size={48} />
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Media Archive...</span>
      </div>
    );
  }

  const featuredVideo = videos.lives[0];
  const remainingLongForm = videos.lives.slice(1);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6 space-y-24 animate-in fade-in duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-end justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-blue-600/20">
            <Zap size={10} fill="currentColor" className="animate-pulse" />
            MEDIA UPLINK ACTIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none">
            SHIZZYUNCHAINED <span className="text-blue-600">VIDEO</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl leading-relaxed">
            The archive of long-form breakdowns and vertical intelligence.
          </p>
        </div>
      </div>

      {/* FEATURED INTEL HERO */}
      {featuredVideo && (
        <section className="space-y-8">
          <div className="flex items-center gap-4">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] font-mono">FEATURED INTELLIGENCE</h3>
             <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/5"></div>
          </div>
          
          <a 
            href={featuredVideo.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative block w-full aspect-video rounded-[2.5rem] lg:rounded-[4rem] overflow-hidden border border-slate-200 dark:border-white/10 bg-black shadow-2xl transition-all hover:border-blue-500/50"
          >
            <img 
              src={featuredVideo.thumbnail} 
              alt={featuredVideo.title}
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 group-hover:scale-110 transition-transform duration-500">
                  <Play size={40} fill="currentColor" className="ml-2" />
               </div>
            </div>

            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 right-10 md:right-20 space-y-4">
               <span className="px-4 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-xl font-mono">LATEST UPLOAD</span>
               <h2 className="text-3xl md:text-6xl font-black text-white font-space uppercase italic tracking-tighter leading-none group-hover:text-blue-400 transition-colors">
                 {featuredVideo.title}
               </h2>
            </div>
          </a>
        </section>
      )}

      {/* LONG FORM SECTION */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 text-blue-600 rounded-2xl">
              <Clapperboard size={24} />
            </div>
            <h3 className="text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">LONG FORM INTEL</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">
            {remainingLongForm.length} ARCHIVED REPORTS
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remainingLongForm.map((video) => (
            <a 
              key={video.id} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col space-y-6 bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-6 hover:border-blue-500/30 transition-all hover:shadow-2xl hover:shadow-blue-500/5"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="p-4 rounded-full bg-blue-600 text-white shadow-xl">
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                   </div>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight font-space uppercase tracking-tight italic group-hover:text-blue-500 transition-colors">
                  {video.title}
                </h4>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-400 transition-colors">
                  Watch Breakdown <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SHORTS SECTION */}
      <section className="space-y-12">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-600/10 text-red-600 rounded-2xl">
              <Smartphone size={24} />
            </div>
            <h3 className="text-3xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">SHORTS</h3>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-4 py-2 bg-slate-100 dark:bg-white/5 rounded-full border border-slate-200 dark:border-white/5">
            {videos.shorts.length} VERTICAL CLIPS
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {videos.shorts.map((video) => (
            <a 
              key={video.id} 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex flex-col space-y-4"
            >
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 group-hover:border-red-500/50 transition-all shadow-lg">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white">
                      <Play size={18} fill="currentColor" className="ml-0.5" />
                   </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                   <h4 className="text-[10px] md:text-xs font-black text-white leading-tight font-space uppercase tracking-tight italic line-clamp-2">
                     {video.title}
                   </h4>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* FOOTER DIAGNOSTIC */}
      <div className="pt-20 flex flex-col items-center justify-center gap-8 opacity-60">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          MEDIA ARCHIVE NODES: SYNCED
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
        <img src={SOCIAL_LINKS.logo} alt="Logo" className="h-8 md:h-12" />
      </div>
    </div>
  );
};
