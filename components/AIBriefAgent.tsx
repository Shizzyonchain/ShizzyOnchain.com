
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  BrainCircuit, 
  Zap, 
  RefreshCw, 
  Settings, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Plus,
  Link2,
  Mail,
  Rss,
  Globe
} from 'lucide-react';
import { newsService } from '../services/newsService.ts';

const DEFAULT_SOURCES = [
  { id: '1', name: 'Market Intel (X)', type: 'Social', enabled: true, category: 'release-factual' },
  { id: '2', name: 'Arxiv AI Papers', type: 'RSS', enabled: true, category: 'research' },
  { id: '3', name: 'OpenAI Blog', type: 'Direct', enabled: true, category: 'releases' },
  { id: '4', name: 'Anthropic News', type: 'Direct', enabled: true, category: 'releases' },
  { id: '5', name: 'Tech Aggregators', type: 'Newsletter', enabled: true, category: 'newsletter' },
];

export const AIBriefAgent: React.FC = () => {
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(true);
  const [progress, setProgress] = useState(0);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const generateBrief = async () => {
    setIsGenerating(true);
    setBrief(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? prev : prev + 5));
    }, 300);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentNews = newsService.getLatestSnapshotItems().items;
      
      const prompt = `You are a world-class AI Analyst. 
      Your job is to synthesize intelligence and filter out market noise.
      Input Data: ${JSON.stringify(currentNews.map(n => n.title + ": " + n.excerpt))}
      Instructions:
      1. Synthesize this into a "Weekly AI Intelligence Brief". Filter for HIGH SIGNAL only.
      2. Structure with: CRITICAL SIGNALS, RECALIBRATION, NOISE REMOVAL.
      3. Tone: Clinical, visionary, direct. Output in beautiful Markdown.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setBrief(response.text || "Failed to synthesize intelligence.");
      setProgress(100);
      setShowConfig(false);
    } catch (err: any) {
      console.error("Agent failed:", err);
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-purple-600/20">
            <BrainCircuit size={10} strokeWidth={3} className="animate-pulse" />
            WEEKLY SYNTHESIS AGENT
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            SIGNAL <span className="text-purple-600">ENGINE</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Direct intelligence scan. Filter noise. Identify macro shifts.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
             onClick={generateBrief}
             disabled={isGenerating}
             className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 shadow-2xl disabled:opacity-50"
           >
             <Zap size={14} className={isGenerating ? 'animate-pulse' : ''} />
             {isGenerating ? 'SYNTHESIZING...' : 'EXECUTE WORKFLOW'}
           </button>
           <button onClick={() => setShowConfig(!showConfig)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
             <Settings size={14} /> {showConfig ? 'CLOSE SETUP' : 'RECONFIGURE'}
           </button>
        </div>
      </div>

      {showConfig && (
        <div className="space-y-12 animate-in slide-in-from-top-8 duration-700">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm">01</div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space">Intake Channels</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {sources.map(source => (
                <button 
                  key={source.id} 
                  onClick={() => toggleSource(source.id)}
                  className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 text-center ${source.enabled ? 'bg-white dark:bg-white/5 border-purple-500' : 'opacity-40 border-transparent bg-slate-100 dark:bg-black/20'}`}
                >
                  <div className={`p-4 rounded-2xl ${source.enabled ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
                    {source.type === 'Social' && <MessageSquare size={24} />}
                    {source.type === 'RSS' && <Rss size={24} />}
                    {source.type === 'Newsletter' && <Mail size={24} />}
                    {source.type === 'Direct' && <Globe size={24} />}
                  </div>
                  <div className="text-[11px] font-black uppercase tracking-tight truncate w-full">{source.name}</div>
                </button>
              ))}
              <button className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 opacity-40 cursor-not-allowed">
                 <Plus size={24} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Custom Node</span>
              </button>
            </div>
          </div>

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm">02</div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space">Automation Workflow</h2>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-4">
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 w-full max-w-sm">
                <Rss className="text-blue-600" size={32} />
                <h3 className="text-sm font-black uppercase tracking-widest">RSS TRIGGER</h3>
              </div>
              <ChevronRight className="hidden lg:block text-slate-300" size={32} />
              <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 w-full max-w-sm">
                <Link2 className="text-emerald-600" size={32} />
                <h3 className="text-sm font-black uppercase tracking-widest">HTTP REQUEST</h3>
              </div>
              <ChevronRight className="hidden lg:block text-slate-300" size={32} />
              <div className="bg-purple-600 text-white p-8 rounded-[2.5rem] flex flex-col items-center gap-4 w-full max-w-sm shadow-2xl">
                <BrainCircuit size={40} />
                <h3 className="text-sm font-black uppercase tracking-widest">SYNTHESIS</h3>
              </div>
            </div>
          </div>
        </div>
      )}

      {!showConfig && (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
          {isGenerating ? (
            <div className="h-[600px] border border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-[#0b0e14] flex flex-col items-center justify-center space-y-12">
               <RefreshCw size={64} className="text-purple-600 animate-spin opacity-20" />
               <div className="space-y-6 w-full max-w-md text-center">
                 <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest font-mono">NODE SCANNING: {progress}%</div>
                 <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                   <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                 </div>
               </div>
            </div>
          ) : brief && (
            <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl max-w-[900px] mx-auto">
               <div className="bg-purple-600 px-10 py-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Sparkles className="text-white" size={22} fill="currentColor" />
                    <h3 className="text-white text-xl font-black uppercase tracking-widest font-space italic">SYNTHESIZED REPORT</h3>
                  </div>
               </div>
               
               <div className="p-10 md:p-16">
                  <div className="prose prose-purple dark:prose-invert max-w-none text-lg md:text-xl font-inter leading-relaxed space-y-8">
                    {brief?.split('\n').map((line, i) => {
                      if (line.startsWith('###')) return <h3 key={i} className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-12 mb-6 border-l-4 border-purple-600 pl-6 italic">{line.replace('###', '')}</h3>;
                      if (line.startsWith('**')) return <p key={i} className="font-black text-purple-600 uppercase tracking-tight text-base mt-8">{line.replace(/\*\*/g, '')}</p>;
                      if (line.startsWith('-')) return <p key={i} className="ml-4 text-slate-600 dark:text-slate-400 flex items-start gap-3"><ChevronRight size={16} className="text-purple-500 mt-1 shrink-0" /> {line.replace('-', '')}</p>;
                      return <p key={i} className="text-slate-700 dark:text-slate-300">{line}</p>;
                    })}
                  </div>

                  <div className="mt-20 pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                      <ShieldCheck size={20} className="text-emerald-500" />
                      <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Signal Verified</div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setShowConfig(true)} className="px-8 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest">RECONFIGURE</button>
                      <button onClick={() => window.print()} className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest">SAVE ARCHIVE</button>
                    </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
