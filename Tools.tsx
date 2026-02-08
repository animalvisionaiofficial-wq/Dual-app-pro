
import React, { useState, useEffect } from 'react';
import { Zap, Trash2, Cpu, CheckCircle2, Shield, Crown } from 'lucide-react';

export const Tools: React.FC = () => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
    const loadPremium = () => setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
    window.addEventListener('premiumUpdated', loadPremium);
    return () => window.removeEventListener('premiumUpdated', loadPremium);
  }, []);

  const handleOptimize = () => {
    // OPTIMIZED FREE: Everyone can boost now
    setIsOptimizing(true);
    setFinished(false);
    setTimeout(() => {
      setIsOptimizing(false);
      setFinished(true);
    }, 2500);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="text-center space-y-3 mt-4">
        <h1 className="text-4xl font-black italic tracking-tighter text-white">Hyper <span className="text-amber-500">Boost</span></h1>
        <p className="text-slate-500 text-sm font-medium">Performance engine for isolated apps</p>
      </div>

      <div className="relative flex justify-center py-12">
        <div className={`absolute inset-0 bg-amber-500/10 blur-[120px] rounded-full transition-all duration-1000 ${isOptimizing ? 'scale-150 opacity-100' : 'scale-100 opacity-40'}`}></div>
        <div className={`absolute inset-0 bg-blue-500/5 blur-[80px] rounded-full transition-all duration-1000 ${isOptimizing ? 'scale-125 opacity-100 translate-x-10' : 'scale-100 opacity-20'}`}></div>
        
        <button 
          onClick={handleOptimize}
          disabled={isOptimizing}
          className={`relative w-48 h-48 rounded-full flex flex-col items-center justify-center gap-3 border-4 transition-all active:scale-95 shadow-2xl ${
            isOptimizing 
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' 
              : finished 
                ? 'border-green-500 bg-green-500/10 text-green-400' 
                : 'border-white/5 bg-slate-900/50 text-slate-300 hover:border-amber-500'
          }`}
        >
          {isOptimizing ? (
            <Zap size={64} className="animate-pulse fill-current" />
          ) : finished ? (
            <CheckCircle2 size={64} className="animate-in zoom-in" />
          ) : (
            <Zap size={64} className="text-amber-500" />
          )}

          <span className="text-xs font-black uppercase tracking-[0.3em]">
            {isOptimizing ? 'Working' : finished ? 'Optimized' : 'Boost Now'}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-amber-400">
            <Cpu size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">RAM Freed</span>
          </div>
          <p className="text-3xl font-black text-white">{finished ? '742 MB' : '0 MB'}</p>
        </div>
        <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3 text-blue-400">
            <Trash2 size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Junk Clear</span>
          </div>
          <p className="text-3xl font-black text-white">{finished ? '2.4 GB' : '0 GB'}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[11px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">Automation Layer</h3>
        <div className="glass border border-white/5 rounded-[2rem] p-6 flex items-center justify-between group transition-all hover:bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400"><Shield size={20} /></div>
            <div>
              <span className="text-sm font-black text-white">Auto-Clear</span>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">On sandbox termination</p>
            </div>
          </div>
          <button className="w-12 h-7 rounded-full relative p-1 transition-all bg-blue-600">
            <div className="w-5 h-5 bg-white rounded-full transition-all ml-auto shadow-md" />
          </button>
        </div>
      </div>
      
      {!isPremium && (
        <div className="p-6 bg-gradient-to-br from-indigo-900/30 to-slate-900 border border-white/10 rounded-3xl text-center space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Go Pro to support development and remove ads!</p>
          <button 
            onClick={() => window.dispatchEvent(new Event('openPremiumModal'))}
            className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-indigo-500/20"
          >
            Upgrade Ad-Free
          </button>
        </div>
      )}
    </div>
  );
};
