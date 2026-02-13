import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ShieldAlert, 
  Terminal, 
  Activity,
  FileSearch
} from 'lucide-react';

interface AuditResult {
  projectName: string;
  utilityScore: number;
  hypeDensity: number;
  bullshitMeter: string;
  verdict: string;
  weaknesses: string[];
  strengths: string[];
  recommendation: string;
}

export const ArchitectAuditor: React.FC = () => {
  const [input, setInput] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const runAudit = async () => {
    if (!input.trim()) return;

    setIsAuditing(true);
    setResult(null);
    setLogs([]);
    addLog("Initializing Structural Scan...");
    addLog(`Target: ${input}`);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Perform a cynical structural audit of: "${input}". Output JSON with projectName, utilityScore (0-100), hypeDensity (0-100), bullshitMeter (CRITICAL, MODERATE, LOW), verdict, weaknesses, strengths, recommendation.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              projectName: { type: Type.STRING },
              utilityScore: { type: Type.NUMBER },
              hypeDensity: { type: Type.NUMBER },
              bullshitMeter: { type: Type.STRING },
              verdict: { type: Type.STRING },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              recommendation: { type: Type.STRING },
            },
            required: ["projectName", "utilityScore", "hypeDensity", "bullshitMeter", "verdict", "weaknesses", "strengths", "recommendation"]
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Data stream interrupted by intelligence node.");
      const data = JSON.parse(text.trim()) as AuditResult;
      setResult(data);
      addLog("Structural scan complete. Intelligence logged.");
    } catch (err: any) {
      console.error("Auditor failed:", err);
      addLog(`FATAL ERROR: Connection interrupted.`);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <ShieldAlert size={10} strokeWidth={3} className="animate-pulse" />
            AUDITOR ACTIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            STRESS <span className="text-orange-600">TEST</span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                placeholder="Enter project name..."
                className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-6 py-4 text-sm font-bold placeholder:opacity-50 outline-none focus:border-orange-500/50 transition-all"
              />
              <button 
                onClick={runAudit}
                disabled={isAuditing || !input}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] disabled:opacity-50 hover:bg-orange-500 transition-colors shadow-lg active:scale-95"
              >
                {isAuditing ? 'AUDITING...' : 'EXECUTE SCAN'}
              </button>
           </div>
           <div className="bg-black rounded-[2rem] p-6 h-64 overflow-y-auto font-mono text-[10px] space-y-2 border border-white/5 shadow-2xl">
              <div className="text-emerald-500 uppercase tracking-widest font-bold mb-2 flex items-center gap-2 border-b border-white/10 pb-2"><Terminal size={12} /> System Logs</div>
              {logs.map((log, i) => <div key={i} className="text-slate-400"> {log} </div>)}
              {logs.length === 0 && <div className="text-slate-600">Waiting for target input...</div>}
              <div ref={scrollRef} />
           </div>
        </div>

        <div className="lg:col-span-7">
           {!result && !isAuditing ? (
             <div className="h-full border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 bg-white/30 dark:bg-white/[0.01]">
                <FileSearch size={48} className="text-orange-600 mb-4 opacity-50" />
                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space opacity-50">Audit Ready</h2>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2">Enter project identifier to begin analysis</p>
             </div>
           ) : isAuditing ? (
             <div className="h-full border border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-[#0b0e14] p-12 flex flex-col items-center justify-center">
                <Activity size={64} className="text-orange-600 animate-pulse" />
                <h3 className="mt-8 text-xl font-black text-orange-600 uppercase tracking-widest font-space">Analyzing Infrastructure</h3>
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-4">Cross-referencing narrative vectors...</p>
             </div>
           ) : (
             <div className="bg-white dark:bg-[#0b0e14] border-2 border-orange-600/30 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-700">
                <div className="bg-orange-600 px-10 py-6 flex items-center justify-between text-white">
                   <h3 className="text-lg font-black uppercase tracking-widest font-space italic">REPORT: {result?.projectName}</h3>
                   <div className="px-4 py-1.5 rounded-full text-[10px] font-black bg-black/20 border border-white/20 uppercase tracking-widest">{result?.bullshitMeter} BULLSHIT</div>
                </div>
                <div className="p-10 space-y-12">
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase font-mono"><span>Utility</span><span>{result?.utilityScore}%</span></div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-blue-600" style={{ width: `${result?.utilityScore}%` }}></div></div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase font-mono"><span>Hype</span><span>{result?.hypeDensity}%</span></div>
                        <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-orange-600" style={{ width: `${result?.hypeDensity}%` }}></div></div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.4em] font-mono">VERDICT</h4>
                      <p className="text-xl italic text-slate-700 dark:text-slate-200 leading-relaxed border-l-4 border-orange-600 pl-6">"{result?.verdict}"</p>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-white/5">
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono">STRENGTHS</h4>
                         <ul className="text-sm text-slate-500 space-y-2">{result?.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
                      </div>
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest font-mono">FLAWS</h4>
                         <ul className="text-sm text-slate-500 space-y-2">{result?.weaknesses.map((w, i) => <li key={i}>• {w}</li>)}</ul>
                      </div>
                   </div>
                   <div className="pt-6 border-t border-slate-100 dark:border-white/5">
                      <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest font-mono mb-2">RECOMMENDATION</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 italic font-medium">"{result?.recommendation}"</p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};