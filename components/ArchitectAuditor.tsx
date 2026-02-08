
import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { 
  ShieldAlert, 
  Search, 
  Loader2, 
  ChevronRight, 
  Terminal, 
  Zap, 
  AlertTriangle,
  CheckCircle2,
  FileSearch,
  Activity,
  Cpu
} from 'lucide-react';

interface AuditResult {
  projectName: string;
  utilityScore: number;
  hypeDensity: number;
  bullshitMeter: string; // "CRITICAL", "MODERATE", "LOW"
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
    addLog(`Target identified: ${input}`);
    addLog("Accessing Intelligence Node 01...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `You are a world-class Project Architect and Onchain Systems Auditor for Shizzy Unchained.
      Your job is to perform a cynical, high-signal audit of a project/narrative. 
      You are looking for "Bullshit-Wrappers"—projects that use AI/Crypto buzzwords without structural utility.

      Target: "${input}"

      Structure your analysis as JSON:
      - projectName: Name of the project
      - utilityScore: 0-100 (Be harsh)
      - hypeDensity: 0-100 (How much marketing noise?)
      - bullshitMeter: "CRITICAL", "MODERATE", "LOW"
      - verdict: One paragraph provocative summary of why it will succeed or fail.
      - weaknesses: Array of 3 specific technical or structural flaws.
      - strengths: Array of 2 actual innovations or valid points.
      - recommendation: Final clinical advice for a strategic player.

      Tone: Provocative, analytical, clinical, no fluff.`;

      addLog("Scrubbing narrative for hype patterns...");
      
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

      addLog("Analysis complete. Compiling structural report.");
      const data = JSON.parse(response.text || '{}') as AuditResult;
      setResult(data);
    } catch (error) {
      addLog("CRITICAL ERROR: Data stream interrupted.");
      console.error(error);
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-1000 pb-20">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 border-b border-slate-200 dark:border-white/10 pb-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-600/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest rounded-md border border-orange-600/20">
            <ShieldAlert size={10} strokeWidth={3} className="animate-pulse" />
            PROJECT ARCHITECT AUDITOR ACTIVE
          </div>
          <h1 className="text-5xl md:text-8xl font-black font-space text-slate-900 dark:text-white uppercase tracking-tighter leading-none italic">
            STRUCTURAL <span className="text-orange-600">STRESS TEST</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.3em] max-w-xl leading-relaxed italic">
            Audit the architecture. Strip the hype. This terminal performs clinical roasts of AI-Crypto infrastructure to find real utility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Input & Terminal Sidebar */}
        <div className="lg:col-span-5 space-y-8">
           <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 space-y-6 shadow-xl">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] font-mono">TARGET INPUT</h3>
              <div className="relative">
                <Search className="absolute left-4 top-4 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runAudit()}
                  placeholder="Enter project name or whitepaper link..."
                  className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold placeholder:opacity-50 focus:border-orange-500 outline-none transition-all"
                />
              </div>
              <button 
                onClick={runAudit}
                disabled={isAuditing || !input}
                className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-orange-600/20 disabled:opacity-50 disabled:grayscale"
              >
                {isAuditing ? 'AUDITING ARCHITECTURE...' : 'EXECUTE STRESS TEST'}
              </button>
           </div>

           <div className="bg-black rounded-[2rem] p-6 h-64 overflow-y-auto font-mono text-[10px] space-y-2 border border-white/5 shadow-inner custom-scrollbar">
              <div className="flex items-center gap-2 text-emerald-500 mb-4">
                 <Terminal size={12} />
                 <span className="font-bold uppercase tracking-widest">System Logs</span>
              </div>
              {logs.map((log, i) => (
                <div key={i} className="text-slate-400 leading-relaxed">
                  <span className="text-orange-500/50 mr-2">{'>'}</span> {log}
                </div>
              ))}
              {logs.length === 0 && <div className="text-slate-700 italic">Waiting for target input...</div>}
              <div ref={scrollRef} />
           </div>
        </div>

        {/* Audit Output */}
        <div className="lg:col-span-7">
           {!result && !isAuditing ? (
             <div className="h-full border border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-8 bg-white/30 dark:bg-white/[0.01]">
                <div className="p-8 bg-orange-600/10 rounded-full text-orange-600">
                  <FileSearch size={48} />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic font-space">Audit Ready</h2>
                  <p className="text-slate-500 dark:text-slate-400 font-mono text-xs uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                    Provide a project target to initiate a structural scan. The auditor filters for long-term viability over marketing hype.
                  </p>
                </div>
             </div>
           ) : isAuditing ? (
             <div className="h-full border border-slate-200 dark:border-white/10 rounded-[3rem] bg-white dark:bg-[#0b0e14] p-12 flex flex-col items-center justify-center space-y-12">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <Activity size={64} className="text-orange-600 animate-pulse opacity-20" />
                  <Cpu size={40} className="text-orange-600 absolute animate-spin-slow" />
                </div>
                <div className="text-center space-y-4">
                   <h3 className="text-xl font-black text-orange-600 uppercase tracking-widest font-space">Analyzing Infrastructure</h3>
                   <div className="flex gap-2 justify-center">
                      <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-75"></div>
                      <div className="w-2 h-2 rounded-full bg-orange-600 animate-bounce delay-150"></div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-white dark:bg-[#0b0e14] border-2 border-orange-600/30 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-right-8 duration-700">
                <div className="bg-orange-600 px-10 py-6 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <ShieldAlert size={20} className="text-white" />
                      <h3 className="text-white text-lg font-black uppercase tracking-widest font-space italic">AUDIT REPORT: {result?.projectName}</h3>
                   </div>
                   <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20 ${
                     result?.bullshitMeter === 'CRITICAL' ? 'bg-red-500 text-white' : 
                     result?.bullshitMeter === 'MODERATE' ? 'bg-orange-500 text-white' : 
                     'bg-emerald-500 text-white'
                   }`}>
                      {result?.bullshitMeter} BULLSHIT
                   </div>
                </div>

                <div className="p-10 space-y-12">
                   {/* Scores Grid */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Structural Utility</span>
                            <span className="text-2xl font-black font-space text-slate-900 dark:text-white italic">{result?.utilityScore}/100</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 transition-all duration-1000" style={{ width: `${result?.utilityScore}%` }}></div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <div className="flex justify-between items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Hype Density</span>
                            <span className="text-2xl font-black font-space text-slate-900 dark:text-white italic">{result?.hypeDensity}/100</span>
                         </div>
                         <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-orange-600 transition-all duration-1000" style={{ width: `${result?.hypeDensity}%` }}></div>
                         </div>
                      </div>
                   </div>

                   {/* Verdict */}
                   <div className="space-y-6">
                      <h4 className="text-xs font-black text-orange-600 uppercase tracking-[0.4em] font-mono flex items-center gap-3">
                         <div className="w-6 h-[1px] bg-orange-600/30"></div> ARCHITECT VERDICT
                      </h4>
                      <p className="text-xl md:text-2xl font-medium text-slate-700 dark:text-slate-200 leading-relaxed font-inter italic border-l-4 border-orange-600 pl-8">
                         "{result?.verdict}"
                      </p>
                   </div>

                   {/* Strengths & Weaknesses */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-widest font-mono flex items-center gap-2">
                            <CheckCircle2 size={14} /> VALID INNOVATIONS
                         </h4>
                         <ul className="space-y-4">
                            {result?.strengths.map((s, i) => (
                              <li key={i} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-start gap-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></div> {s}
                              </li>
                            ))}
                         </ul>
                      </div>
                      <div className="space-y-6">
                         <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest font-mono flex items-center gap-2">
                            <AlertTriangle size={14} /> STRUCTURAL FLAWS
                         </h4>
                         <ul className="space-y-4">
                            {result?.weaknesses.map((w, i) => (
                              <li key={i} className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-start gap-3">
                                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div> {w}
                              </li>
                            ))}
                         </ul>
                      </div>
                   </div>

                   {/* Final Recommendation */}
                   <div className="pt-10 border-t border-slate-100 dark:border-white/5 space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-xl">
                            <Zap size={16} fill="currentColor" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">CLINICAL RECOMMENDATION</div>
                            <div className="text-xs font-mono text-slate-500 uppercase italic">Actionable Strategy Locked</div>
                         </div>
                      </div>
                      <p className="text-base text-slate-600 dark:text-slate-400 font-inter leading-relaxed">
                         {result?.recommendation}
                      </p>
                   </div>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Footer Diagnostic */}
      <div className="pt-10 flex flex-col items-center justify-center gap-8 opacity-40">
        <div className="flex items-center gap-6 font-mono text-[10px] font-bold uppercase tracking-[0.5em] text-slate-400 text-center">
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
          INTELLIGENCE TRANSMISSION PROTOCOL: V3.4 (CYNICAL MODE)
          <div className="w-20 h-[1px] bg-slate-200 dark:bg-white/10"></div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
