
import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Bell, 
  CreditCard, 
  ChevronRight, 
  Lock, 
  Crown, 
  EyeOff, 
  Camera, 
  Edit3, 
  ArrowLeft,
  Check,
  Smartphone,
  Shield,
  Trash2,
  RefreshCw
} from 'lucide-react';

const DEFAULT_AVATAR = 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export const SettingsView: React.FC = () => {
  const [toggles, setToggles] = useState({
    notifications: true,
    darkMode: true,
    stealth: false,
    appLock: true
  });
  const [isPremium, setIsPremium] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Profile State
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'DualSpace User',
    avatar: DEFAULT_AVATAR
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dualspace_settings');
    const premium = localStorage.getItem('dualspace_premium') === 'true';
    const savedProfile = localStorage.getItem('dualspace_profile');

    setIsPremium(premium);

    if (saved) {
      setToggles(JSON.parse(saved));
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    const loadPremium = () => setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
    window.addEventListener('premiumUpdated', loadPremium);
    return () => window.removeEventListener('premiumUpdated', loadPremium);
  }, []);

  const showToast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleToggle = (key: keyof typeof toggles) => {
    const newState = { ...toggles, [key]: !toggles[key] };
    setToggles(newState);
    localStorage.setItem('dualspace_settings', JSON.stringify(newState));
    showToast(`${key.charAt(0).toUpperCase() + key.slice(1)} updated`);
    window.dispatchEvent(new Event('settingsUpdated'));
  };

  const handleSaveProfile = () => {
    localStorage.setItem('dualspace_profile', JSON.stringify(profile));
    showToast("Profile Updated Successfully");
    setIsProfileOpen(false);
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, avatar: reader.result as string });
        showToast("Image Uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (profile.avatar === DEFAULT_AVATAR) {
      showToast("Already using default image");
      return;
    }
    setProfile({ ...profile, avatar: DEFAULT_AVATAR });
    showToast("Profile image removed");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-2 duration-300">
      <div className="pb-2">
        <h1 className="text-3xl font-black italic tracking-tighter text-white">Settings</h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Preferences & Core Config</p>
      </div>

      {/* Premium Banner */}
      <div className={`p-6 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden flex items-center justify-between ${
        isPremium 
          ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border-blue-500/20' 
          : 'bg-gradient-to-r from-yellow-500/10 to-amber-600/10 border-yellow-500/20'
      }`}>
        <div className="flex items-center gap-4 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
            isPremium ? 'bg-blue-500 text-white' : 'bg-yellow-500 text-slate-900'
          }`}>
            <Crown size={24} className={isPremium ? 'fill-white' : 'fill-slate-900'} />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {isPremium ? 'Lifetime VIP' : 'Ad-Supported Free'}
            </h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
              {isPremium ? 'No advertisements • VIP Access' : 'Ads active • Basic Support'}
            </p>
          </div>
        </div>
        {!isPremium && (
          <button 
            onClick={() => window.dispatchEvent(new Event('openPremiumModal'))}
            className="relative z-10 px-6 py-2 bg-yellow-500 text-slate-900 text-[10px] font-black rounded-full uppercase tracking-widest shadow-xl shadow-yellow-500/20 hover:scale-105 active:scale-95 transition-all"
          >
            Ad-Free
          </button>
        )}
        <Crown size={100} className="absolute -right-6 -bottom-6 text-white/5 -rotate-12 opacity-40" />
      </div>

      <div className="glass border border-white/5 rounded-[2rem] overflow-hidden divide-y divide-white/5">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center"><Bell size={20} /></div>
            <span className="text-sm font-black text-slate-200">Push Notifications</span>
          </div>
          <button 
            onClick={() => handleToggle('notifications')}
            className={`w-12 h-7 rounded-full p-1 transition-all ${toggles.notifications ? 'bg-blue-600' : 'bg-slate-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggles.notifications ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center"><EyeOff size={20} /></div>
            <span className="text-sm font-black text-slate-200">Stealth Mode</span>
          </div>
          <button 
            onClick={() => handleToggle('stealth')}
            className={`w-12 h-7 rounded-full p-1 transition-all ${toggles.stealth ? 'bg-blue-600' : 'bg-slate-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggles.stealth ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-red-500/10 text-red-400 rounded-xl flex items-center justify-center"><Lock size={20} /></div>
            <span className="text-sm font-black text-slate-200">Security Lock</span>
          </div>
          <button 
            onClick={() => handleToggle('appLock')}
            className={`w-12 h-7 rounded-full p-1 transition-all ${toggles.appLock ? 'bg-blue-600' : 'bg-slate-800'}`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transition-transform ${toggles.appLock ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-[10px] font-black uppercase text-slate-600 tracking-[0.2em] px-4">Account & Support</h2>
        <div className="glass border border-white/5 rounded-[2rem] divide-y divide-white/5 overflow-hidden">
          <button onClick={() => setIsProfileOpen(true)} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group">
            <div className="flex items-center gap-4">
              <User size={20} className="text-slate-500 group-hover:text-white transition-colors" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Profile Details</span>
                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tight">{profile.name}</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-all" />
          </button>
          
          <button onClick={() => isPremium ? showToast("Already VIP") : window.dispatchEvent(new Event('openPremiumModal'))} className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-all text-left group">
            <div className="flex items-center gap-4">
              <CreditCard size={20} className="text-slate-500 group-hover:text-white transition-colors" />
              <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Subscription Manager</span>
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                 isPremium ? 'text-blue-500 bg-blue-500/10' : 'text-yellow-500 bg-yellow-500/10'
               }`}>
                 {isPremium ? 'LIFETIME' : 'FREE'}
               </span>
               <ChevronRight size={18} className="text-slate-600 group-hover:translate-x-1 transition-all" />
            </div>
          </button>
        </div>
      </div>

      <button 
        onClick={() => {
            if (confirm("This will erase all clones and settings. Continue?")) {
              localStorage.clear();
              window.location.reload();
            }
        }}
        className="w-full p-5 text-red-500 text-xs font-black uppercase tracking-[0.2em] bg-red-500/5 border border-red-500/10 rounded-2xl hover:bg-red-500/10 transition-colors"
      >
        Factory Reset Suite
      </button>

      {/* Profile Detail View (Modal) */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-400">
          <div className="h-20 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-6 border-b border-white/5">
            <button onClick={() => setIsProfileOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={28} />
            </button>
            <h2 className="text-lg font-black italic text-white uppercase tracking-widest">Profile Editor</h2>
            <button onClick={handleSaveProfile} className="p-2 text-blue-500 hover:text-blue-400 transition-colors font-black uppercase text-xs tracking-widest">
              Save
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-6">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-blue-600/20 p-1 relative overflow-hidden bg-slate-900 shadow-2xl transition-transform group-hover:scale-105">
                  <img src={profile.avatar} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  className="hidden" 
                  accept="image/*" 
                />
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-slate-950 shadow-lg pointer-events-none">
                  <Edit3 size={16} />
                </div>
              </div>
              
              <div className="flex gap-4">
                 <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20 hover:bg-blue-600/20 transition-all"
                >
                  <RefreshCw size={14} />
                  Change
                </button>
                {profile.avatar !== DEFAULT_AVATAR && (
                  <button 
                    onClick={handleDeleteAvatar}
                    className="flex items-center gap-2 px-6 py-2 bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/20 hover:bg-red-600/20 transition-all"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Input Section */}
            <div className="w-full space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest px-1">Display Nickname</label>
                <input 
                  type="text" 
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-900 border-2 border-white/5 focus:border-blue-600 rounded-2xl py-5 px-6 text-white text-lg font-black transition-all outline-none"
                  placeholder="Enter your name..."
                />
              </div>

              <div className="glass p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-500/10 text-purple-400 rounded-xl flex items-center justify-center"><Smartphone size={20} /></div>
                  <div>
                    <span className="text-sm font-black text-white">Device Instance</span>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Android 14 (Sandbox Layer)</p>
                  </div>
                </div>
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
              </div>
            </div>

            <div className="mt-auto w-full pt-10">
               <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl flex items-center gap-4">
                  <Shield className="text-blue-500 shrink-0" size={24} />
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest leading-relaxed">Your profile data is stored locally in the isolated sandbox and never shared.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center pb-12">
        <p className="text-[10px] text-slate-700 uppercase font-black tracking-[0.3em]">DualSpace Pro Engine v5.2.0</p>
        <p className="text-[8px] text-slate-800 uppercase font-black tracking-widest mt-2 opacity-50">Build: 092025-SANDBOX</p>
      </div>

      {message && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 px-6 py-3 bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-6 z-[200]">
          {message}
        </div>
      )}
    </div>
  );
};
