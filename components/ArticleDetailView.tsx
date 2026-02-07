
import React, { useMemo } from 'react';
import { NewsArticle } from '../types.ts';
import { 
  PANIC_SELLING_ARTICLE, 
  BEAR_RUNNERS_ARTICLE, 
  OCT_10_ARTICLE, 
  PROVEX_ARTICLE, 
  TAO_ARTICLE, 
  JAM_ARTICLE,
  MOLTBOOK_ARTICLE,
  CLAUDE_46_ARTICLE,
  GPT_53_CODEX_ARTICLE,
  CLAUDE_VS_GPT_ARTICLE,
  TWITTER_SKILL_TRAP_ARTICLE
} from '../constants.tsx';
import { newsService } from '../services/newsService.ts';
import { cryptoNewsService } from '../services/cryptoNewsService.ts';
import { ChevronLeft, Share2, User, Link2, Check } from 'lucide-react';

interface ArticleDetailViewProps {
  articleId: string;
  onBack: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({ articleId, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const article = useMemo(() => {
    // Check constants
    const articles = [
      TWITTER_SKILL_TRAP_ARTICLE, PANIC_SELLING_ARTICLE, BEAR_RUNNERS_ARTICLE, OCT_10_ARTICLE, 
      PROVEX_ARTICLE, TAO_ARTICLE, 
      JAM_ARTICLE, MOLTBOOK_ARTICLE, CLAUDE_46_ARTICLE, GPT_53_CODEX_ARTICLE,
      CLAUDE_VS_GPT_ARTICLE
    ];
    const found = articles.find(a => a.id === articleId);
    if (found) return found;

    // Check AI News
    const aiNews = newsService.getLatestSnapshotItems().items;
    const aiFound = aiNews.find(a => a.id === articleId);
    if (aiFound) {
      return {
        id: aiFound.id,
        title: aiFound.title,
        category: "AI NEWS",
        author: aiFound.source,
        timestamp: "",
        summary: aiFound.excerpt.split('\n')[0],
        content: aiFound.excerpt.split('\n\n'),
        imageUrl: aiFound.image_url,
        snapshots: []
      } as NewsArticle;
    }

    // Check Crypto News
    const cryptoNews = cryptoNewsService.getLatestItems().items;
    const cryptoFound = cryptoNews.find(a => a.id === articleId);
    if (cryptoFound) {
      return {
        id: cryptoFound.id,
        title: cryptoFound.title,
        category: "CRYPTO NEWS",
        author: cryptoFound.source,
        timestamp: "",
        summary: cryptoFound.excerpt.split('\n')[0],
        content: cryptoFound.excerpt.split('\n\n'),
        imageUrl: cryptoFound.image_url,
        snapshots: []
      } as NewsArticle;
    }

    return null;
  }, [articleId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!article) {
    return (
      <div className="max-w-[800px] mx-auto py-20 text-center space-y-6">
        <h2 className="text-3xl font-black uppercase text-slate-400">Article Not Found</h2>
        <button onClick={onBack} className="text-blue-600 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mx-auto">
          <ChevronLeft size={16} /> Return to Feed
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-[1000px] mx-auto px-6 py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <button 
        onClick={onBack}
        className="mb-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-colors group"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to News
      </button>

      <article className="space-y-12">
        {/* Header Section */}
        <header className="space-y-8">
          <div className="flex flex-wrap items-center gap-4">
            <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded shadow-lg shadow-blue-500/20">
              {article.category}
            </span>
            <div className="flex items-center gap-4 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
              <div className="flex items-center gap-1.5"><User size={12} className="text-blue-500" /> {article.author}</div>
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-black font-space text-slate-900 dark:text-white uppercase italic leading-[0.95] tracking-tighter">
            {article.title}
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed border-l-4 border-blue-600 pl-6 italic">
            {article.summary}
          </p>
        </header>

        {/* Feature Image */}
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/5 shadow-2xl bg-black">
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          
          <button 
            onClick={handleShare}
            className="absolute top-6 right-6 p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all group"
          >
            {copied ? <Check size={20} className="text-emerald-400" /> : <Link2 size={20} />}
          </button>
        </div>

        {/* Snapshots if available */}
        {article.snapshots && article.snapshots.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {article.snapshots.map((snap, i) => (
              <div key={i} className="p-6 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl space-y-2">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/10 pb-2">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{snap.asset}</span>
                  <span className="text-sm font-black text-blue-600 font-mono">{snap.price}</span>
                </div>
                <p className="text-[10px] text-slate-500 italic leading-relaxed">{snap.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Body Content */}
        <div className="space-y-10 prose dark:prose-invert max-w-none">
          {article.content.map((p, i) => (
            <p key={i} className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-inter opacity-90 first-letter:text-blue-600 first-letter:font-black">
              {p}
            </p>
          ))}
        </div>

        {/* Actions Footer */}
        <div className="pt-16 border-t border-slate-200 dark:border-white/5 flex items-center justify-between gap-6">
          <button 
            onClick={onBack}
            className="text-[10px] font-black uppercase tracking-[0.2em] px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl hover:scale-105 transition-all shadow-xl"
          >
            Return to Feed
          </button>
          
          <button 
            onClick={handleShare}
            className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-colors"
          >
            <Share2 size={16} /> Share Intelligence
          </button>
        </div>
      </article>
    </div>
  );
};
