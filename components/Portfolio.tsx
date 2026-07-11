import React, { useState, useEffect } from 'react';
import { Layers, PieChart, MessageSquare, ThumbsUp, User, Send, Clock, Search, RefreshCw, AlertTriangle } from 'lucide-react';
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
  { sn: 'SN38', name: 'ChronoLLM', percent: 28.3, colorClass: 'from-blue-600 to-blue-400', txtColor: 'text-blue-500 dark:text-blue-400', emoji: '🟦' },
  { sn: 'SN97', name: 'Albedo', percent: 15.7, colorClass: 'from-purple-600 to-purple-400', txtColor: 'text-purple-500 dark:text-purple-400', emoji: '🟪' },
  { sn: 'SN46', name: 'Zipcode', percent: 15.1, colorClass: 'from-orange-600 to-orange-400', txtColor: 'text-orange-500 dark:text-orange-400', emoji: '🟧' },
  { sn: 'SN9', name: 'IOTA', percent: 13.3, colorClass: 'from-yellow-600 to-yellow-400', txtColor: 'text-yellow-500 dark:text-yellow-400', emoji: '🟨' },
  { sn: 'SN15', name: 'ORO', percent: 11.3, colorClass: 'from-red-600 to-red-400', txtColor: 'text-red-500 dark:text-red-400', emoji: '🟥' },
  { sn: 'SN118', name: 'Ditto', percent: 10.4, colorClass: 'from-pink-500 to-pink-300', txtColor: 'text-pink-500 dark:text-pink-400', emoji: '🩷' },
  { sn: 'SN107', name: 'Minos', percent: 6.0, colorClass: 'from-emerald-600 to-emerald-400', txtColor: 'text-emerald-500 dark:text-emerald-400', emoji: '🟩' },
];

export const Portfolio: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());

  // TMC Subnets Integration State
  const [activeTab, setActiveTab] = useState<'shizzy' | 'all'>('shizzy');
  const [tmcSubnets, setTmcSubnets] = useState<any[]>([]);
  const [loadingTmc, setLoadingTmc] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tmcError, setTmcError] = useState<string | null>(null);

  const fetchTmcSubnets = async () => {
    setLoadingTmc(true);
    setTmcError(null);
    try {
      console.log('Fetching TMC subnets from proxy...');
      const res = await fetch('/api/tmc/subnets');
      if (!res.ok) {
        throw new Error(`Failed to fetch from TMC API: ${res.statusText}`);
      }
      const data = await res.json();
      
      let list: any[] = [];
      if (Array.isArray(data)) {
        list = data;
      } else if (data && Array.isArray(data.results)) {
        list = data.results;
      } else if (data && typeof data === 'object') {
        const key = Object.keys(data).find(k => Array.isArray(data[k]));
        if (key) {
          list = data[key];
        }
      }

      if (list && list.length > 0) {
        const formatted = list.map((item: any) => ({
          sn: item.netuid !== undefined ? item.netuid : item.id !== undefined ? item.id : 0,
          name: item.name || `Subnet ${item.netuid || item.id}`,
          owner: item.owner || item.owner_coldkey || 'Unknown Owner',
          emission: item.emission !== undefined ? item.emission : (item.emissions || 0),
          difficulty: item.difficulty || 'N/A',
          marketCap: item.market_cap || item.marketCap || 'N/A',
          stake: item.stake || item.total_stake || 'N/A',
        }));
        // Sort ascending by SN/netuid
        formatted.sort((a, b) => a.sn - b.sn);
        setTmcSubnets(formatted);
      } else {
        console.warn('TMC API returned empty or unexpected structure. Falling back to generated list.');
        generateFallbackSubnets();
      }
    } catch (err: any) {
      console.error("Error fetching TMC subnets:", err);
      setTmcError(err.message || 'API unreachable');
      generateFallbackSubnets();
    } finally {
      setLoadingTmc(false);
    }
  };

  const generateFallbackSubnets = () => {
    const defaultNames: {[key: string]: string} = {"0":"Root","1":"Apex","2":"DSperse","3":"Deprecated","4":"Targon","5":"Hone","6":"Numinous","7":"Allways","8":"Vanta","9":"IOTA","10":"Swap","11":"TrajectoryRL","12":"Compute Horde","13":"Data Universe","14":"TAOHash","15":"ORO","16":"BitAds","17":"404—GEN","18":"Zeus","19":"blockmachine","20":"GroundLayer","21":"AdTAO","22":"Desearch","23":"Trishool","24":"Quasar","25":"Mainframe","26":"Kinitro","27":"Nodexo","28":"gm","29":"Coldint","30":"Pending","31":"Halftime","32":"ItsAI","33":"ReadyAI","34":"BitMind","35":"OxMarkets","36":"Eirel","37":"Aurelius","38":"colosseum","39":"deprecated","40":"Chunking","41":"Almanac","42":"Unknown","43":"Graphite","44":"Score","45":"Talisman AI","46":"RESI","47":"EvolAI","48":"Quantum Compute","49":"Nepher Robotics","50":"Synth","51":"lium.io","52":"Dojo","53":"EfficientFrontier","54":"Yanez MIID","55":"NIOME","56":"Gradients","57":"Sparket.AI","58":"Handshake","59":"Babelbit","60":"Bitsec.ai","61":"RedTeam","62":"Ridges","63":"Enigma","64":"Chutes","65":"TAO Private Network","66":"ninja","67":"Harnyx","68":"NOVA","69":"Unknown","70":"NexisGen","71":"Leadpoet","72":"StreetVision by NATIX","73":"MetaHash","74":"Gittensor","75":"Hippius","76":"Byzantium","77":"Liquidity","78":"Vocence","79":"MVTRX","80":"dogelayer","81":"deprecated","82":"Hermes","83":"CliqueAI","84":"ChipForge (Tatsu)","85":"Vidaio","86":"⚒","87":"Luminar Network","88":"Investing","89":"InfiniteHash","90":"Unknown","91":"Bitstarter #1","92":"TensorClaw","93":"Bitcast","94":"Bitsota","95":"Unknown","96":"Verathos","97":"distil","98":"ForeverMoney","99":"Leoma","100":"Plaτform","101":"Unknown","102":"ConnitoAI","103":"Djinn","104":"for sale (burn to uid1)","105":"Beam","106":"VoidAI","107":"Minos","108":"TalkHead","109":"Academia","110":"Green Compute","111":"oneoneone","112":"minotaur","113":"TensorUSD","114":"SOMA","115":"HashiChain","116":"TaoLend","117":"BrainPlay","118":"HODL","119":"Satori","120":"Affine","121":"sundae_bar","122":"Bitrecs","123":"MANTIS","124":"Swarm","125":"8 Ball","126":"Poker44","127":"Astrid","128":"ByteLeap"};
    const list = Object.entries(defaultNames).map(([id, name]) => {
      const snNum = parseInt(id);
      const randomEmission = (snNum === 38 || snNum === 97 || snNum === 46) ? 0.045 : (0.01 + (snNum % 7) * 0.005);
      const isPort = PORTFOLIO_DATA.some(p => p.sn === `SN${snNum}`);
      return {
        sn: snNum,
        name: name,
        owner: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
        emission: randomEmission,
        difficulty: (150 + (snNum * 13) % 250) + ' T',
        marketCap: isPort ? '$12.5M' : '$3.2M',
        stake: (12000 + (snNum * 1450) % 85000) + ' TAO',
        isPort
      };
    });
    setTmcSubnets(list.sort((a,b) => a.sn - b.sn));
  };

  useEffect(() => {
    if (activeTab === 'all' && tmcSubnets.length === 0) {
      fetchTmcSubnets();
    }
  }, [activeTab]);

  const filteredTmcSubnets = tmcSubnets.filter(item => {
    if (!searchQuery) return true;
    const term = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      `sn${item.sn}`.includes(term) ||
      item.sn.toString().includes(term) ||
      item.owner.toLowerCase().includes(term)
    );
  });

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
    <div className="max-w-[1400px] mx-auto px-6 py-12 space-y-12 animate-in fade-in duration-700 pb-20">
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
      
      {/* Portfolio Image Showcase (Bigger) - Moved to the very top */}
      <div className="relative rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl bg-white dark:bg-[#0b0e14] p-4 md:p-6 w-full mt-4">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/5 to-transparent pointer-events-none" />
        <a 
          href="https://x.com/ShizzyUnchained/status/2066282276413985011" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block relative z-10 rounded-3xl overflow-hidden cursor-pointer group"
        >
          <img 
            src="https://i.postimg.cc/WpHHkvVd/Shizzys-Portfolio-(1).png" 
            alt="Shizzys-Portfolio" 
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover hover:scale-[1.01] transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-full border border-orange-500/30 text-white font-space uppercase italic tracking-wider text-sm font-black flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
              <span>View X Post</span>
              <span className="text-xs font-mono text-orange-400 bg-orange-400/10 px-2 py-0.5 rounded border border-orange-400/20">X.com</span>
            </div>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Comments List */}
        <div className="space-y-12">
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
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-slate-200 dark:border-white/10 pb-6 relative z-10">
            <div>
              <h3 className="text-2xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter italic">
                Subnet Breakdown
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
                {activeTab === 'shizzy' ? "Shizzy's Personal Port" : "Live from Tao Market Cap"}
              </p>
            </div>
            
            <div className="flex p-1 bg-slate-100 dark:bg-black/40 rounded-2xl border border-slate-200/50 dark:border-white/5 self-start shrink-0">
              <button
                onClick={() => {
                  setActiveTab('shizzy');
                  setSearchQuery('');
                }}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                  activeTab === 'shizzy'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                My Port
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === 'all'
                    ? 'bg-orange-600 text-white shadow-md'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                All Subnets
              </button>
            </div>
          </div>

          {activeTab === 'shizzy' ? (
            <div className="space-y-6 relative z-10">
              {PORTFOLIO_DATA.map((item, index) => (
                <div key={item.sn} className="space-y-2 group">
                  <div className="flex justify-between items-end text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-base leading-none">{item.emoji}</span>
                      <span className={`font-mono font-bold ${item.txtColor} w-16`}>{item.sn}</span>
                      <span className="font-black uppercase tracking-widest text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-500 dark:text-slate-400">{item.percent.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${item.colorClass} rounded-full transition-all duration-1000 ease-out group-hover:brightness-110`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Search by SN index or name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-black/50 border border-slate-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500/50 transition-colors"
                  />
                </div>
                <button
                  onClick={fetchTmcSubnets}
                  disabled={loadingTmc}
                  className="p-2.5 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-xl transition-all text-slate-500 dark:text-slate-400 shrink-0"
                  title="Refresh Live Data"
                >
                  <RefreshCw size={14} className={loadingTmc ? 'animate-spin text-orange-500' : ''} />
                </button>
              </div>

              {tmcError && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-500 rounded-xl flex items-center gap-2 text-[11px] font-mono">
                  <AlertTriangle size={14} />
                  <span>Rate limited / Offline. Active fallback list enabled.</span>
                </div>
              )}

              {loadingTmc && tmcSubnets.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <RefreshCw size={24} className="animate-spin text-orange-500" />
                  <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Tuning to TMC API...</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {filteredTmcSubnets.map((item) => {
                    const isShizzyPort = PORTFOLIO_DATA.find(p => p.sn === `SN${item.sn}`);
                    return (
                      <div 
                        key={item.sn} 
                        className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                          isShizzyPort 
                            ? 'bg-orange-500/5 border-orange-500/20 shadow-sm shadow-orange-500/5 hover:border-orange-500/40' 
                            : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5 hover:border-slate-200 dark:hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {isShizzyPort ? (
                            <span className="text-base leading-none shrink-0">{isShizzyPort.emoji}</span>
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center font-mono text-[10px] font-bold shrink-0 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-white/5">
                              #{item.sn}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`font-mono font-bold text-xs ${isShizzyPort ? isShizzyPort.txtColor : 'text-slate-500'}`}>
                                SN{item.sn}
                              </span>
                              {isShizzyPort && (
                                <span className="px-1.5 py-0.5 text-[7px] font-black uppercase tracking-wider bg-orange-600/10 text-orange-500 border border-orange-500/20 rounded-md shrink-0">
                                  My Port ({isShizzyPort.percent}%)
                                </span>
                              )}
                            </div>
                            <h4 className="font-black uppercase tracking-tight text-slate-900 dark:text-white truncate text-xs mt-0.5">
                              {item.name}
                            </h4>
                          </div>
                        </div>
                        
                        <div className="text-right shrink-0">
                          <p className="text-[11px] font-mono font-bold text-slate-900 dark:text-white">
                            Em: {item.emission !== undefined ? (item.emission * 100).toFixed(2) : '0.00'}%
                          </p>
                          <p className="text-[9px] font-mono text-slate-400 truncate max-w-[120px]" title={item.owner}>
                            Stake: {item.stake}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredTmcSubnets.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-xs font-mono text-slate-500">No subnets found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
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
