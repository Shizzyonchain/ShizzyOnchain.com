import React, { useState, useEffect } from 'react';
import { MessageSquare, ThumbsUp, Clock, ArrowLeft } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}

export const AllComments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const savedComments = localStorage.getItem('shizzy_portfolio_comments');
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error('Failed to parse comments', e);
      }
    }
  }, []);

  const handleLike = (id: string) => {
    const updated = comments.map(c => {
      if (c.id === id) {
        return { ...c, likes: c.isLiked ? c.likes - 1 : c.likes + 1, isLiked: !c.isLiked };
      }
      return c;
    });
    setComments(updated);
    localStorage.setItem('shizzy_portfolio_comments', JSON.stringify(updated));
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
      <button 
        onClick={() => window.location.hash = '#/portfolio'}
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-600 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Portfolio
      </button>

      <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
        <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-8">
          <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Comment on Shizzy's Portfolio
            </h3>
            <p className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              All Comments ({comments.length})
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/20 flex items-center justify-center text-orange-500 border border-orange-500/20 font-black font-space uppercase">
                  {comment.author.charAt(0)}
                </div>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-tight">
                    {comment.author}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-slate-400">
                    <Clock size={12} />
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <button 
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      comment.isLiked 
                        ? 'text-orange-500' 
                        : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    <ThumbsUp size={14} className={comment.isLiked ? 'fill-current' : ''} />
                    {comment.likes}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-slate-500 dark:text-slate-400 text-sm font-mono text-center py-8">
              No comments yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
