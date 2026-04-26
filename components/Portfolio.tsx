import React, { useState, useEffect } from 'react';
import { Layers, PieChart, MessageSquare, ThumbsUp, User, Send, Clock } from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, orderBy, increment } from 'firebase/firestore';
import { db } from '../firebase';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: number;
  likes: number;
  isLiked?: boolean;
}

const PORTFOLIO_DATA = [
  { sn: 'SN44', name: 'Score', percent: 21.7 },
  { sn: 'SN4', name: 'Targon', percent: 14.7 },
  { sn: 'SN64', name: 'Chutes', percent: 14.6 },
  { sn: 'SN66', name: 'NINJA', percent: 9.7 },
  { sn: 'SN58', name: 'Handshake', percent: 9.1 },
  { sn: 'SN62', name: 'Ridges', percent: 8.4 },
  { sn: 'SN5', name: 'Hone', percent: 6.1 },
  { sn: 'SN105', name: 'Beam', percent: 5.8 },
  { sn: 'SN68', name: 'NOVA', percent: 4.26 },
  { sn: 'SN97', name: 'DISTIL', percent: 4.11 },
  { sn: 'SN46', name: 'RESI', percent: 0.9 },
  { sn: 'SN93', name: 'Bitcast', percent: 0.9 },
];

export const Portfolio: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load liked comments from local storage
    try {
      const savedLikes = localStorage.getItem('shizzy_liked_comments');
      if (savedLikes) {
        setLikedComments(new Set(JSON.parse(savedLikes)));
      }
    } catch (e) {
      console.warn('localStorage blocked in Portfolio', e);
    }

    // Subscribe to Firestore comments
    const q = query(collection(db, 'portfolio_comments'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedComments: Comment[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        fetchedComments.push({
          id: doc.id,
          author: data.author,
          content: data.content,
          timestamp: data.timestamp,
          likes: data.likes || 0,
        });
      });
      setComments(fetchedComments);
    }, (error) => {
      console.error("Error fetching comments:", error);
    });

    return () => unsubscribe();
  }, []);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await addDoc(collection(db, 'portfolio_comments'), {
        author: authorName.trim() || 'Anonymous Alpha',
        content: newComment.trim(),
        timestamp: Date.now(),
        likes: 0,
      });
      setNewComment('');
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleLike = async (id: string) => {
    const isLiked = likedComments.has(id);
    const commentRef = doc(db, 'portfolio_comments', id);
    
    try {
      if (isLiked) {
        // Unlike
        await updateDoc(commentRef, {
          likes: increment(-1)
        });
        const newLiked = new Set(likedComments);
        newLiked.delete(id);
        setLikedComments(newLiked);
        try {
          localStorage.setItem('shizzy_liked_comments', JSON.stringify(Array.from(newLiked)));
        } catch (e) {}
      } else {
        // Like
        await updateDoc(commentRef, {
          likes: increment(1)
        });
        const newLiked = new Set(likedComments);
        newLiked.add(id);
        setLikedComments(newLiked);
        try {
          localStorage.setItem('shizzy_liked_comments', JSON.stringify(Array.from(newLiked)));
        } catch (e) {}
      }
    } catch (error) {
      console.error("Error updating like:", error);
    }
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
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-20 animate-in fade-in duration-700 pb-20">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(249, 115, 22, 0.2);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(249, 115, 22, 0.5);
        }
      `}</style>
      
      <div className="flex flex-col md:flex-row items-end justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-16">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <PieChart size={10} strokeWidth={3} className="animate-pulse" />
            PORTFOLIO ALLOCATION
          </div>
          <h1 className="text-5xl md:text-9xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            SHIZZY'S <span className="text-orange-600">PORTFOLIO</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.4em] max-w-xl leading-relaxed italic">
            Current Bittensor Subnet Allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image + Comments List */}
        <div className="space-y-12">
          {/* Image Section */}
          <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0b0e14] p-4">
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
            <a href="https://x.com/ShizzyUnchained/status/2046078217430151554" target="_blank" rel="noopener noreferrer" className="block relative z-10 rounded-3xl overflow-hidden">
              <img 
                src="https://i.postimg.cc/yYSCP7hM/Gemini-Generated-Image-b6revyb6revyb6re.png" 
                alt="Shizzy's Portfolio" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>

          {/* Comments List */}
          <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 shadow-2xl shadow-orange-500/5">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6 mb-6">
              <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                  Comment on Shizzy's Portfolio
                </h3>
              </div>
            </div>

            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {comments.slice(0, 5).map((comment) => (
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
                          likedComments.has(comment.id) 
                            ? 'text-orange-500' 
                            : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                        }`}
                      >
                        <ThumbsUp size={14} className={likedComments.has(comment.id) ? 'fill-current' : ''} />
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-slate-500 dark:text-slate-400 text-sm font-mono text-center py-8">
                  No comments yet. Be the first to share your thoughts below!
                </p>
              )}
              {comments.length > 5 && (
                <button
                  onClick={() => window.location.hash = '#/all-comments'}
                  className="w-full mt-4 py-4 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-500 hover:border-orange-500/30 transition-all bg-slate-50 dark:bg-white/5"
                >
                  View All {comments.length} Comments
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Data Section */}
        <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 text-orange-500 pointer-events-none">
            <Layers size={200} />
          </div>
          
          <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic mb-8 relative z-10">
            Subnet Breakdown
          </h3>
          
          <div className="space-y-6 relative z-10">
            {PORTFOLIO_DATA.map((item, index) => (
              <div key={item.sn} className="space-y-2 group">
                <div className="flex justify-between items-end text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-orange-600 dark:text-orange-400 w-12">{item.sn}</span>
                    <span className="font-black uppercase tracking-widest text-slate-900 dark:text-white">{item.name}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{item.percent.toFixed(2)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-orange-500/5 relative overflow-hidden mt-12">
        <div className="absolute top-0 right-0 p-12 opacity-5 text-orange-500 pointer-events-none">
          <MessageSquare size={200} />
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
              Share Your Thoughts
            </h3>
            <p className="text-sm font-mono text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
              Drop your alpha below
            </p>
          </div>

          <form onSubmit={handlePostComment} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 border border-slate-200 dark:border-white/10">
                  <User size={20} />
                </div>
              </div>
              <div className="flex-grow space-y-4">
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full md:w-64 bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <div className="relative">
                  <textarea
                    placeholder="Share your thoughts on this allocation..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-orange-500/50 transition-colors resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:hover:bg-orange-600 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
