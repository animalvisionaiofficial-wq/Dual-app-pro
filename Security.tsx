
import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, EyeOff, ShieldAlert, ChevronRight, ShieldCheck, Sparkles, Crown } from 'lucide-react';

export const Security: React.FC = () => {
  const [settings, setSettings] = useState({
    appLock: true,
    stealthMode: false,
    fingerprint: true,
    intruder: false
  });
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dualspace_settings');
    const premium = localStorage.getItem('dualspace_premium') === 'true';
    setIsPremium(premium);

    if (saved) {
      const parsed = JSON.parse(saved);
      setSettings({
        appLock: parsed.appLock ?? true,
        stealthMode: parsed.stealth ?? false,
        fingerprint: parsed.fingerprint ?? true,
        intruder: parsed.intruder ?? false
      });
    }

    const loadPremium = () => setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
    window.addEventListener('premiumUpdated', loadPremium);
    return () => window.removeEventListener('premiumUpdated', loadPremium);
  }, []);

  const handleToggle = (key: keyof typeof settings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    
    const globalSettings = JSON.parse(localStorage.getItem('dualspace_settings') || '{}');
    const updatedGlobal = {
      ...globalSettings,
      appLock: newSettings.appLock,
      stealth: newSettings.stealthMode,
      fingerprint: newSettings.fingerprint,
      intruder: newSettings.intruder
    };
    
    localStorage.setItem('dualspace_settings', JSON.stringify(updatedGlobal));
    window.dispatchEvent(new Event('settingsUpdated'));
    
    setMessage(`${key.replace(/([A-Z])/g, ' $1').trim()} Updated`);
    setTimeout(() => setMessage(null), 2000);
  };

  const features = [
    { id: 'appLock', label: 'Master App Lock', icon: Lock, enabled: settings.appLock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'stealthMode', label: 'Invisibility Mode', icon: EyeOff, enabled: settings.stealthMode, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'fingerprint', label: 'Biometric Access', icon: Fingerprint, enabled: settings.fingerprint, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { id: 'intruder', label: 'Intruder Detection', icon: ShieldAlert, enabled: settings.intruder, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center gap-4 mt-2">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-lg shadow-purple-500/20">
            <ShieldCheck className="text-white" size={28} />
        </div>
        <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white">Privacy <span className="text-purple-500">Armor</span></h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Multi-Layer Encryption</p>
        </div>
      </div>

      <div className="glass border border-white/5 rounded-[2.5rem] overflow-hidden">
        {features.map((item, idx) => (
          <div 
            key={item.label}
            className={`flex items-center justify-between p-6 ${idx !== features.length - 1 ? 'border-b border-white/5' : ''}`}
          >
            <div className="flex items-center gap-5">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-inner`}>
                <item.icon size={24} />
              </div>
              <div>
                <span className="text-base font-black text-white">{item.label}</span>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter opacity-70">Sandbox Shield Active</p>
              </div>
            </div>
            <button 
              onClick={() => handleToggle(item.id as any)}
              className={`w-14 h-8 rounded-full transition-all flex items-center p-1.5 cursor-pointer ${item.enabled ? 'bg-gradient-to-r from-purple-500 to-blue-500 shadow-lg shadow-purple-500/20' : 'bg-slate-800'}`}
            >
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${item.enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </button>
          </div>
        ))}
      </div>

      <div className="p-8 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-950 border border-white/10 rounded-[3rem] relative overflow-hidden group cursor-pointer active:scale-95 transition-all shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-amber-400 animate-pulse" />
            <h2 className="text-2xl font-black italic text-white">Phantom Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mb-6 font-medium max-w-[180px]">Encrypted storage for high-security media and logs.</p>
          <button className="flex items-center gap-3 text-white bg-white/10 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-white/20 transition-all border border-white/10 group">
            Unlock Vault <ChevronRight size={16} className="group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </div>
        <Lock size={120} className="absolute -bottom-6 -right-6 text-white/5 -rotate-12 group-hover:rotate-0 transition-transform duration-700 opacity-20" />
      </div>

      {message && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-slate-900 text-[11px] font-black uppercase tracking-widest rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 z-[200]">
          {message}
        </div>
      )}
    </div>
  );
};
