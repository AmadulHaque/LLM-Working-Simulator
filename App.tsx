
import React, { useState, useRef, useEffect } from 'react';
import { geminiService } from './services/geminiService';
import { StepCard } from './components/StepCard';
import { SimulationStatus } from './types';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<SimulationStatus>(SimulationStatus.IDLE);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSimulate = async () => {
    if (!input.trim()) return;

    setStatus(SimulationStatus.TOKENIZING);
    setError(null);
    setResult(null);

    try {
      // Simulate visual progress for better UX
      setTimeout(() => setStatus(SimulationStatus.BUILDING_CONTEXT), 1500);
      setTimeout(() => setStatus(SimulationStatus.REASONING), 3000);

      const response = await geminiService.simulate(input);
      setResult(response);
      setStatus(SimulationStatus.COMPLETED);
    } catch (err: any) {
      setError(err.message || 'An error occurred during simulation.');
      setStatus(SimulationStatus.ERROR);
    }
  };

  useEffect(() => {
    if (status !== SimulationStatus.IDLE && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [status, result]);

  const parseSteps = (text: string) => {
    const sections = text.split(/(?=1️⃣|2️⃣|3️⃣|4️⃣|5️⃣|6️⃣)/g);
    return sections.filter(s => s.trim().length > 0).map(section => {
      const titleMatch = section.match(/[1-6]️⃣\s*(.*)\n?/);
      const title = titleMatch ? titleMatch[1].trim() : "Unknown Step";
      const content = section.replace(/[1-6]️⃣\s*.*\n?/, '').trim();
      const number = section.match(/([1-6])️⃣/)?.[1] || "0";
      return { number, title, content };
    });
  };

  const steps = result ? parseSteps(result) : [];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-blue-500/30">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="inline-block px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-4 uppercase tracking-widest">
            Experimental LLM Engine
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            LLM Internals <span className="text-blue-500">Simulator</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Deconstruct the machine intelligence. Visualize how neural networks parse, reason, and generate responses in real-time.
          </p>
        </header>

        {/* Input Section */}
        <section className="glass rounded-2xl p-6 mb-12 shadow-2xl">
          <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">User Input Query</label>
          <textarea
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none min-h-[120px] mono text-sm"
            placeholder="e.g., Explain quantum entanglement using a cat metaphor..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
            </div>
            <button
              onClick={handleSimulate}
              disabled={status !== SimulationStatus.IDLE && status !== SimulationStatus.COMPLETED && status !== SimulationStatus.ERROR}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                input.trim() 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {status === SimulationStatus.IDLE || status === SimulationStatus.COMPLETED || status === SimulationStatus.ERROR ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4-4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>
                  Simulate Logic
                </>
              ) : (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Synthesizing...
                </>
              )}
            </button>
          </div>
        </section>

        {/* Loading State */}
        {(status !== SimulationStatus.IDLE && status !== SimulationStatus.COMPLETED && status !== SimulationStatus.ERROR) && (
          <div className="space-y-4 animate-pulse-slow mb-12" ref={scrollRef}>
            <div className="h-1 bg-slate-800 w-full rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/3 animate-[loading_2s_infinite]"></div>
            </div>
            <p className="text-center text-blue-400 font-mono text-sm tracking-widest uppercase">
              {status === SimulationStatus.TOKENIZING && "Mapping lexical vectors..."}
              {status === SimulationStatus.BUILDING_CONTEXT && "Activating transformer layers..."}
              {status === SimulationStatus.REASONING && "Performing cross-attention analysis..."}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-center gap-3">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
             {error}
          </div>
        )}

        {/* Result Display */}
        {result && (
          <div className="space-y-4" ref={scrollRef}>
            <div className="flex items-center gap-3 mb-8">
              <div className="h-[1px] flex-grow bg-slate-800"></div>
              <h2 className="text-sm font-mono text-slate-500 uppercase tracking-[0.2em]">Simulation Trace</h2>
              <div className="h-[1px] flex-grow bg-slate-800"></div>
            </div>

            <div className="max-w-3xl mx-auto">
              {steps.map((step, idx) => (
                <StepCard
                  key={idx}
                  number={step.number}
                  title={step.title}
                  content={step.content}
                  isLast={idx === steps.length - 1}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="py-12 border-t border-slate-800/50 text-center text-slate-500 text-sm">
        <p>© {new Date().getFullYear()} LLM Simulator • Powered by Gemini 3 Pro Engine</p>
      </footer>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
};

export default App;
