
import React from 'react';
import { Play, ChevronRight } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  url?: string;
  type: 'live' | 'short';
}

interface VideoSectionProps {
  title: string;
  videos: VideoItem[];
  aspectRatio: 'video' | 'portrait';
  onViewAll?: () => void;
  limit?: number;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ title, videos, aspectRatio, onViewAll, limit }) => {
  const isVideo = aspectRatio === 'video';
  const displayVideos = limit ? videos.slice(0, limit) : videos;

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <h2 className="text-xl md:text-2xl font-extrabold font-space text-slate-900 dark:text-white uppercase tracking-tight">
            {title}
          </h2>
          <div className="absolute -bottom-1.5 left-0 w-8 h-1 bg-blue-600 rounded-full"></div>
        </div>
        
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="flex items-center gap-1 text-[10px] md:text-xs font-bold font-mono text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest group"
          >
            View All <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
      
      {/* 
          Live Video grid: 1 col on mobile, 3 on tablet, 5 on desktop.
          Shorts grid: denser (smaller) layout with up to 8 columns on large screens.
      */}
      <div className={`grid gap-4 ${
        isVideo 
          ? 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5' 
          : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8'
      }`}>
        {displayVideos.map((video) => {
          const content = (
            <div className="group cursor-pointer">
              <div className={`relative overflow-hidden rounded-xl bg-slate-200 dark:bg-zinc-900 border border-slate-200 dark:border-white/5 transition-all group-hover:border-blue-500/50 ${isVideo ? 'aspect-video shadow-md' : 'aspect-[9/16]'}`}>
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className={`${isVideo ? 'w-10 h-10' : 'w-8 h-8'} rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform`}>
                    <Play size={isVideo ? 16 : 14} className="text-white fill-white ml-0.5" />
                  </div>
                </div>
              </div>
              <h3 className={`mt-3 ${isVideo ? 'text-[12px] md:text-sm font-bold' : 'text-[10px] md:text-xs font-bold'} text-slate-700 dark:text-slate-300 leading-tight group-hover:text-blue-500 transition-colors font-space line-clamp-2`}>
                {video.title}
              </h3>
            </div>
          );

          if (video.url) {
            return (
              <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="block outline-none">
                {content}
              </a>
            );
          }

          return <React.Fragment key={video.id}>{content}</React.Fragment>;
        })}
      </div>
    </section>
  );
};
