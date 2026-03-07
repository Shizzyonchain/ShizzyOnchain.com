import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Radio, RefreshCw, Activity, ChevronRight } from 'lucide-react';
import { newsService } from '../services/newsService.ts';

interface Narrative {
  name: string;
  maturity: 'SIGNAL' | 'ALPHA' | 'HYPE' | 'EXIT_TRAP';
  score: number;
  rationale: string;
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'WARNING';
}

export const NarrativePulse: React.FC = () => {
  const [narratives, setNarratives] = useState<Narrative[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runPulseScan = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentNews = newsService.getLatestSnapshotItems().items;
      
      const context = currentNews.map(n => n.title).join(', ');
      const prompt = `Analyze current AI-Crypto trends using this context: ${context}. Identify 5 key narratives. Output JSON array.`;

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

      const text = response.text;
      if (!text) throw new Error("Intelligence node returned empty response.");
      setNarratives(JSON.parse(text.trim()) as Narrative[]);
    } catch (err: any) {
      console.error("Narrative Pulse failed:", err);
      setError(err.message);
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
      case 'ALPHA': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
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
        </div>
        <button 
          onClick={runPulseScan}
          disabled={isLoading}
          className="flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          {isLoading ? 'SCANNING...' : 'REFRESH'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
              <Radio size={64} className="text-rose-600 animate-pulse" />
              <div className="mt-8 text-center">
                 <div className="text-3xl font-black font-space italic text-slate-900 dark:text-white uppercase tracking-tighter">PULSE DETECTED</div>
              </div>
           </div>
        </div>

        <div className="lg:col-span-8">
           {isLoading ? (
             <div className="h-[400px] flex flex-col items-center justify-center space-y-6">
                <Activity size={48} className="text-rose-600 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">Filtering White Noise...</span>
             </div>
           ) : (
             <div className="space-y-6">
                {narratives.map((n, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#0b0e14] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 hover:border-rose-600/30 transition-all">
                     <div className="w-full md:w-32 flex flex-col items-center">
                        <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap ${getMaturityColor(n.maturity)}`}>
                           {n.maturity.replace('_', ' ')}
                        </div>
                     </div>
                     <div className="flex-grow space-y-3">
                        <h3 className="text-2xl font-black font-space uppercase italic text-slate-900 dark:text-white leading-none">{n.name}</h3>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 italic border-l-2 border-slate-100 dark:border-white/5 pl-4">"{n.rationale}"</p>
                     </div>
                     <div className="shrink-0 p-4 rounded-full bg-slate-50 dark:bg-white/5 text-slate-400"><ChevronRight size={24} /></div>
                  </div>
                ))}
                {narratives.length === 0 && !isLoading && (
                  <div className="text-center py-20 opacity-40">
                    <p className="font-mono text-xs uppercase tracking-widest">No active narratives found in this cycle.</p>
                  </div>
                )}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};