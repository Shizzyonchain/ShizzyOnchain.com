import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  BrainCircuit, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Settings, 
  ChevronRight, 
  MessageSquare,
  Sparkles,
  ShieldCheck,
  X,
  Plus,
  Link2,
  Mail,
  Rss,
  Globe,
  LayoutGrid
} from 'lucide-react';
import { newsService } from '../services/newsService.ts';

const DEFAULT_SOURCES = [
  { id: '1', name: '@ShizzyUnchained (X)', type: 'Social', enabled: true, category: 'release-factual' },
  { id: '2', name: '@PeterGyang (X)', type: 'Social', enabled: true, category: 'market-intel' },
  { id: '3', name: 'Arxiv AI Papers', type: 'RSS', enabled: true, category: 'research' },
  { id: '4', name: 'OpenAI Blog', type: 'Direct', enabled: true, category: 'releases' },
  { id: '5', name: 'Anthropic News', type: 'Direct', enabled: true, category: 'releases' },
  { id: '6', name: 'The Rundown AI', type: 'Newsletter', enabled: true, category: 'newsletter' },
];

export const AIBriefAgent: React.FC = () => {
  const [sources, setSources] = useState(DEFAULT_SOURCES);
  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<string | null>(null);
  const [showConfig, setShowConfig] = useState(true); // Default to true to show the setup
  const [progress, setProgress] = useState(0);

  const toggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const generateBrief = async () => {
    setIsGenerating(true);
    setBrief(null);
    setProgress(0);

    // Progress simulation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 5;
      });
    }, 300);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentNews = newsService.getLatestSnapshotItems().items;
      
      const prompt = `You are a high-signal AI Agent built for Shizzy Unchained. 
      Your job is to act as an "Anxiety Killer" for someone who is overwhelmed by AI news.
      
      Context: It is the end of the week. 
      Input Data (Week's Raw Signals): ${JSON.stringify(currentNews.map(n => n.title + ": " + n.excerpt))}
      
      Instructions:
      1. Synthesize this information into a "Weekly AI Brief".
      2. Filter for HIGH SIGNAL only. Ignore hype.
      3. Structure the response with:
         - THE TOP 3 (The three things that actually matter this week)
         - RECALIBRATION (How the user should think about the AI market now)
         - NOISE REMOVAL (One thing everyone is talking about that doesn't actually matter)
      4. Use a world-class, slightly provocative, clinical, and visionary tone.
      5. Output in beautiful Markdown format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setBrief(response.text || "Failed to synthesize intelligence.");
      setProgress(100);
      setShowConfig(false); // Hide config once generated
    } catch (error) {
      console.error("Agent failed:", error);
      setBrief("### TRANSMISSION ERROR\n\nUnable to establish link with Intelligence Node. Verify API key and try again.");
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-purple-600/20">
            <BrainCircuit size={10} strokeWidth={3} className="animate-pulse" />
            WEEKLY SYNTHESIS AGENT
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            ANXIETY <span className="text-purple-600">KILLER</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Catch the full week's AI noise and deliver the signal directly to your context.
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
           <button 
             onClick={generateBrief}
             disabled={isGenerating}
             className="group flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 shadow-2xl active:scale-95"
           >
             <Zap size={14} className={isGenerating ? 'animate-pulse' : 'group-hover:rotate-12 transition-transform'} />
             {isGenerating ? 'SYNTHESIZING...' : 'GENERATE WEEKLY BRIEF'}
           </button>
           <button 
             onClick={() => setShowConfig(!showConfig)}
             className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-purple-500 transition-colors"
           >
             <Settings size={14} /> {showConfig ? 'CLOSE SETUP' : 'RECONFIGURE WORKFLOW'}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Setup Workflow View (n8n style) */}
        {showConfig && (
          <div className="lg:col-span-12 space-y-12 animate-in slide-in-from-top-8 duration-700">
             
             {/* Step 1: Define Sources */}
             <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-purple-600/20">01</div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space">Define Your Sources</h2>
                 <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
                 <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic">5-10 Reliable Inputs</span>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                 {sources.map(source => (
                   <button 
                     key={source.id}
                     onClick={() => toggleSource(source.id)}
                     className={`relative p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 text-center ${
                       source.enabled 
                         ? 'bg-white dark:bg-white/5 border-purple-500 shadow-xl shadow-purple-500/5' 
                         : 'bg-slate-50 dark:bg-black/20 border-transparent text-slate-400 opacity-60'
                     }`}
                   >
                     {source.enabled && <div className="absolute top-4 right-4 text-purple-600"><CheckCircle2 size={16} /></div>}
                     <div className={`p-4 rounded-2xl ${source.enabled ? 'bg-purple-600 text-white' : 'bg-slate-200 dark:bg-white/10 text-slate-400'}`}>
                        {source.type === 'Social' && <MessageSquare size={24} />}
                        {source.type === 'RSS' && <Rss size={24} />}
                        {source.type === 'Newsletter' && <Mail size={24} />}
                        {source.type === 'Direct' && <Globe size={24} />}
                     </div>
                     <div className="space-y-1">
                        <div className="text-[11px] font-black uppercase tracking-tight truncate w-full">{source.name}</div>
                        <div className="text-[8px] font-mono font-bold uppercase tracking-widest opacity-60">{source.category}</div>
                     </div>
                   </button>
                 ))}
                 <button className="flex flex-col items-center justify-center gap-4 p-6 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2rem] text-slate-400 hover:border-purple-500/50 hover:text-purple-500 transition-all">
                    <Plus size={24} />
                    <span className="text-[10px] font-black uppercase tracking-widest">New Source</span>
                 </button>
               </div>
             </div>

             {/* Step 2: Configure Intake Nodes */}
             <div className="space-y-8">
               <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-sm shadow-xl shadow-purple-600/20">02</div>
                 <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space">Configure Intake Nodes</h2>
                 <div className="flex-grow h-[1px] bg-slate-200 dark:bg-white/10"></div>
                 <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest italic">Workflow Automation (SWR)</span>
               </div>

               <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-10">
                  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 w-full max-w-sm relative">
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block text-slate-300"><ChevronRight size={32} /></div>
                     <div className="p-4 bg-blue-600/10 text-blue-600 rounded-2xl"><Rss size={32} /></div>
                     <h3 className="text-sm font-black uppercase tracking-widest">RSS TRIGGER</h3>
                     <p className="text-[10px] text-slate-500 font-mono text-center">Auto-polling 12 endpoints every Saturday 09:00 UTC</p>
                  </div>
                  
                  <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center gap-4 w-full max-w-sm relative">
                     <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden lg:block text-slate-300"><ChevronRight size={32} /></div>
                     <div className="p-4 bg-emerald-600/10 text-emerald-600 rounded-2xl"><Link2 size={32} /></div>
                     <h3 className="text-sm font-black uppercase tracking-widest">HTTP REQUEST</h3>
                     <p className="text-[10px] text-slate-500 font-mono text-center">Fetching X content and platform release notes via proxy</p>
                  </div>

                  <div className="bg-white dark:bg-white/5 border border-purple-600 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 w-full max-w-sm shadow-2xl shadow-purple-600/20 ring-4 ring-purple-600/10">
                     <div className="p-5 bg-purple-600 text-white rounded-3xl shadow-xl"><BrainCircuit size={40} /></div>
                     <div className="text-center space-y-2">
                       <h3 className="text-base font-black uppercase tracking-[0.2em] text-purple-600">GEMINI SYNTHESIS</h3>
                       <p className="text-[11px] text-slate-500 font-mono">Filtering noise and generating intelligence report</p>
                     </div>
                  </div>
               </div>
             </div>

             <div className="flex justify-center pt-8">
                <button 
                  onClick={generateBrief}
                  className="px-16 py-6 bg-purple-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-sm hover:scale-105 transition-all shadow-2xl shadow-purple-600/40 active:scale-95 flex items-center gap-4"
                >
                  <Sparkles size={20} /> EXECUTE WORKFLOW
                </button>
             </div>
          </div>
        )}

        {/* Intelligence Output */}
        {!showConfig && (
          <div className="lg:col-span-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {isGenerating ? (
              <div className="h-[600px] border border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-[#0b0e14] p-12 flex flex-col items-center justify-center space-y-12">
                 <div className="relative w-32 h-32 flex items-center justify-center">
                   <RefreshCw size={64} className="text-purple-600 animate-spin opacity-20" />
                   <BrainCircuit size={40} className="text-purple-600 absolute animate-pulse" />
                 </div>
                 <div className="space-y-6 w-full max-w-md">
                   <div className="flex justify-between text-[10px] font-black text-purple-600 uppercase tracking-widest font-mono">
                     <span>Processing Intake Nodes...</span>
                     <span>{progress}%</span>
                   </div>
                   <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-600 transition-all duration-300" style={{ width: `${progress}%` }}></div>
                   </div>
                   <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest text-center italic">
                     Identifying structural shifts, removing noise, and preparing final transmission.
                   </p>
                 </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/10 rounded-[3rem] overflow-hidden shadow-2xl max-w-[900px] mx-auto">
                 <div className="bg-purple-600 px-10 py-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white/20 rounded-xl text-white">
                        <Sparkles size={22} fill="currentColor" />
                      </div>
                      <h3 className="text-white text-xl font-black uppercase tracking-widest font-space italic">INTELLIGENCE REPORT: {new Date().toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                    </div>
                    <div className="text-white/60 font-mono text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                      SYNC ID: {Math.random().toString(36).substring(7).toUpperCase()}
                    </div>
                 </div>
                 
                 <div className="p-10 md:p-16">
                    <div className="prose prose-purple dark:prose-invert max-w-none text-lg md:text-xl font-inter leading-relaxed space-y-8">
                      {brief?.split('\n').map((line, i) => {
                        if (line.startsWith('###')) return <h3 key={i} className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mt-12 mb-6 border-l-4 border-purple-600 pl-6 italic">{line.replace('###', '')}</h3>;
                        if (line.startsWith('**')) return <p key={i} className="font-black text-purple-600 uppercase tracking-tight text-base mt-8">{line.replace(/\*\*/g, '')}</p>;
                        if (line.startsWith('-')) return <li key={i} className="ml-4 text-slate-600 dark:text-slate-400 list-none flex items-start gap-3"><ChevronRight size={16} className="text-purple-500 mt-1 shrink-0" /> {line.replace('-', '')}</li>;
                        return <p key={i} className="text-slate-700 dark:text-slate-300">{line}</p>;
                      })}
                    </div>

                    <div className="mt-20 pt-12 border-t border-slate-100 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400">
                           <ShieldCheck size={20} />
                         </div>
                         <div>
                           <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Signal Verified</div>
                           <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">No hype detected in this transmission</div>
                       </div>
                     </div>
                     <div className="flex gap-4">
                       <button 
                          onClick={() => setShowConfig(true)}
                          className="px-8 py-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-purple-500 transition-all"
                       >
                         RECONFIGURE SETUP
                       </button>
                       <button 
                          onClick={() => window.print()}
                          className="px-8 py-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
                       >
                         SAVE ARCHIVE
                       </button>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Diagnostic */}
      <div className="pt-10 flex flex-col items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          INTELLIGENCE TRANSMISSION PROTOCOL: V2.1
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};