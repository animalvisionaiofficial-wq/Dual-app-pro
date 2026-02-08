
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  ShieldCheck, 
  Zap, 
  Settings, 
  LayoutGrid,
  Sparkles,
  X,
  Check,
  Crown
} from 'lucide-react';
import { Dashboard } from './views/Dashboard.tsx';
import { Tools } from './views/Tools.tsx';
import { Security } from './views/Security.tsx';
import { SettingsView } from './views/SettingsView.tsx';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'security' | 'tools' | 'settings'>('home');
  const [isPremium, setIsPremium] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    const premiumStatus = localStorage.getItem('dualspace_premium') === 'true';
    setIsPremium(premiumStatus);

    const handlePremiumUpdate = () => {
      setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
    };

    const handleOpenPremium = () => setShowUpgradeModal(true);

    window.addEventListener('premiumUpdated', handlePremiumUpdate);
    window.addEventListener('openPremiumModal', handleOpenPremium);
    return () => {
      window.removeEventListener('premiumUpdated', handlePremiumUpdate);
      window.removeEventListener('openPremiumModal', handleOpenPremium);
    };
  }, []);

  const handleUpgrade = () => {
    localStorage.setItem('dualspace_premium', 'true');
    setIsPremium(true);
    window.dispatchEvent(new Event('premiumUpdated'));
    setShowUpgradeModal(false);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-blue-400' },
    { id: 'security', label: 'Privacy', icon: ShieldCheck, color: 'text-purple-400' },
    { id: 'tools', label: 'Optimize', icon: Zap, color: 'text-amber-400' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-teal-400' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-blue-500/30 overflow-hidden">
      {/* Colorful Header */}
      <header className="sticky top-0 z-30 w-full h-16 border-b border-white/5 bg-slate-950/60 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <LayoutGrid size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            DualSpace <span className="text-blue-400">Pro</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
           {isPremium ? (
             <div className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/20 border border-white/10">
               <Crown size={12} className="text-yellow-400 fill-yellow-400" />
               <span className="text-[10px] font-black text-white uppercase tracking-widest">VIP</span>
             </div>
           ) : (
             <button 
               onClick={() => setShowUpgradeModal(true)}
               className="text-[10px] font-black px-3 py-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-900 rounded-full shadow-lg shadow-yellow-500/20 animate-pulse"
             >
              GO PREMIUM
            </button>
           )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto w-full p-6 pb-28">
          {activeTab === 'home' && <Dashboard />}
          {activeTab === 'security' && <Security />}
          {activeTab === 'tools' && <Tools />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Modern Colorful Bottom Navigation */}
      <nav className="fixed bottom-4 left-4 right-4 z-50 h-20 glass rounded-[2.5rem] flex items-center justify-around px-4 shadow-2xl border border-white/10">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
                isActive ? item.color + ' scale-110' : 'text-slate-500'
              }`}
            >
              {isActive && (
                <div className={`absolute -top-3 w-1 h-1 rounded-full bg-current shadow-[0_0_10px_rgba(255,255,255,0.8)]`} />
              )}
              <item.icon size={isActive ? 26 : 22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-black uppercase tracking-tighter">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Premium Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" onClick={() => setShowUpgradeModal(false)} />
          <div className="relative w-full max-w-sm glass rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(59,130,246,0.3)] animate-in zoom-in-95">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-slate-400 hover:text-white z-10"
            >
              <X size={20} />
            </button>
            
            <div className="relative p-8 pt-12 text-center bg-gradient-to-b from-blue-600/20 to-transparent">
              <div className="inline-flex p-4 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-3xl shadow-2xl shadow-yellow-500/30 mb-6 scale-125">
                <Crown size={32} className="text-white" />
              </div>
              <h2 className="text-3xl font-black italic text-white tracking-tighter mb-2">DualSpace <span className="text-blue-400">Pro</span></h2>
              <p className="text-slate-400 text-sm font-medium">Remove advertisements & Unlock VIP tools</p>
            </div>

            <div className="p-8 space-y-4">
              {[
                { label: "Zero Advertisements", sub: "Enjoy a clean, ad-free environment" },
                { label: "Custom App Icons", sub: "Personalize any clone with your photos" },
                { label: "Unlimited Kernel Boosts", sub: "Maximum performance for every app" },
                { label: "VIP Support Access", sub: "Direct line to our technical team" }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">{feature.label}</h4>
                    <p className="text-[10px] text-slate-500 font-bold">{feature.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 pt-0">
              <button 
                onClick={handleUpgrade}
                className="w-full py-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/30 hover:brightness-110 active:scale-95 transition-all text-xs"
              >
                Go Ad-Free - $2.99
              </button>
              <p className="text-[8px] text-slate-600 text-center mt-4 uppercase font-black tracking-widest">Lifetime premium access</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
