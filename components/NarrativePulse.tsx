
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Radio, Zap, TrendingUp, AlertCircle, RefreshCw, ChevronRight, Activity, Cpu, Sparkles, ShieldAlert } from 'lucide-react';
import { newsService } from '../services/newsService.ts';

interface Narrative {
  name: string;
  maturity: 'SIGNAL' | 'ALPHA' | 'HYPE' | 'EXIT_TRAP';
  score: number; // 0-100, 100 being purest early signal
  rationale: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export const NarrativePulse: React.FC = () => {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastScan, setLastScan] = useState<string>('');

  const runPulseScan = async () => {
    setIsLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentNews = newsService.getLatestSnapshotItems().items;
      
      const prompt = `Analyze the current AI and Crypto intersection using this week's data: ${JSON.stringify(currentNews.map(n => n.title))}. 
      Identify 5 key narratives/trends. Categorize them into a Maturity Model: 
      - SIGNAL (Early, structural innovation)
      - ALPHA (Ready for leverage, not yet mainstream)
      - HYPE (Mainstream attention, diminishing returns)
      - EXIT_TRAP (Pure retail exit liquidity)
      
      Output JSON array of objects with keys: name, maturity, score (0-100), rationale, sentiment.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                maturity: { type: Type.STRING },
                score: { type: Type.NUMBER },
                rationale: { type: Type.STRING },
                sentiment: { type: Type.STRING },
              },
              required: ["name", "maturity", "score", "rationale", "sentiment"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]') as Narrative[];
      setNarratives(data);
      setLastScan(new Date().toLocaleTimeString());
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runPulseScan();
  }, []);

  const getMaturityColor = (m: string) => {
    switch (m) {
      case 'SIGNAL': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'ALPHA': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'HYPE': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'EXIT_TRAP': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-rose-600/10 text-rose-600 dark:text-rose-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-rose-600/20">
            <Radio size={10} strokeWidth={3} className="animate-pulse" />
            NARRATIVE PULSE ACTIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            ALPHA <span className="text-rose-600">RADAR</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Detect structural shifts before they become mainstream noise. 
          </p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <button 
            onClick={runPulseScan}
            disabled={isLoading}
            className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'SCANNING PULSE...' : 'REFRESH SCAN'}
          </button>
          {lastScan && <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest italic">Last Transmission: {lastScan}</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Visual Pulse Gauge */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10">
                 <div className="w-full h-full border-2 border-rose-600 rounded-full animate-ping"></div>
              </div>
              <div className="relative w-48 h-48 rounded-full border-4 border-rose-600/20 flex items-center justify-center">
                 <Radio size={64} className="text-rose-600 animate-pulse" />
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-rose-600 text-white text-[9px] font-black rounded-full uppercase tracking-widest">LIVE RADAR</div>
              </div>
              <div className="mt-8 text-center space-y-2">
                 <div className="text-3xl font-black font-space italic text-slate-900 dark:text-white uppercase tracking-tighter">PULSE DETECTED</div>
                 <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Scanning {narratives.length} Structural Vectors</p>
              </div>
           </div>
           
           <div className="bg-slate-900 p-8 rounded-[2.5rem] space-y-6 shadow-xl">
              <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.4em] font-mono flex items-center gap-3"><Sparkles size={14} /> MATURITY MODEL</h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400"><span>SIGNAL</span><span className="text-emerald-500">Pure Early Utility</span></div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400"><span>ALPHA</span><span className="text-blue-500">Ready to Leverage</span></div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400"><span>HYPE</span><span className="text-orange-500">Crowded Entry</span></div>
                 <div className="flex items-center justify-between text-[10px] font-black uppercase text-slate-400"><span>EXIT_TRAP</span><span className="text-rose-500">Retail Exit</span></div>
              </div>
           </div>
        </div>

        {/* Narrative List */}
        <div className="lg:col-span-8">
           {isLoading ? (
             <div className="h-[500px] border border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-[#0b0e14] flex flex-col items-center justify-center space-y-6">
                <Activity size={48} className="text-rose-600 animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Syncing Narrative Maturity Nodes</span>
             </div>
           ) : (
             <div className="space-y-6">
                {narratives.map((n, idx) => (
                  <div key={idx} className="group bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 hover:border-rose-600/30 transition-all duration-500 shadow-sm hover:shadow-2xl">
                     <div className="w-full md:w-32 flex flex-col items-center gap-2">
                        <div className="text-3xl font-black font-space italic text-slate-300 dark:text-slate-800">{String(idx+1).padStart(2, '0')}</div>
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${getMaturityColor(n.maturity)}`}>
                           {n.maturity.replace('_', ' ')}
                        </div>
                     </div>
                     
                     <div className="flex-grow space-y-3">
                        <div className="flex items-center justify-between">
                           <h3 className="text-2xl font-black font-space uppercase italic text-slate-900 dark:text-white tracking-tight leading-none">{n.name}</h3>
                           <div className="flex items-center gap-2">
                              <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-widest">Alpha Score</span>
                              <span className="text-xl font-black font-mono text-rose-600 italic">{n.score}</span>
                           </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed italic border-l-2 border-slate-100 dark:border-white/5 pl-4">
                           "{n.rationale}"
                        </p>
                     </div>
                     
                     <div className="shrink-0 p-4 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-rose-600 transition-colors">
                        <ChevronRight size={24} />
                     </div>
                  </div>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* Footer Diagnostic */}
      <div className="pt-20 flex flex-col items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          NARRATIVE PULSE NODE: SECURE
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
      </div>
    </div>
  );
};
