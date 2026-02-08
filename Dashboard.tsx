
import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  ShieldCheck, 
  Rocket, 
  ArrowLeft, 
  MoreHorizontal, 
  MessageSquare, 
  Heart, 
  Camera, 
  Send,
  Layers,
  Edit2,
  Trash2,
  Lock,
  Smartphone,
  Crown,
  AlertCircle,
  Image as ImageIcon,
  LayoutGrid,
  History,
  Sparkles,
  ExternalLink,
  Info,
  Phone,
  Video,
  User,
  Settings as SettingsIcon,
  Bell,
  Menu,
  PlusCircle,
  Play,
  // Fix: Added missing Home icon import
  Home
} from 'lucide-react';
import { AppItem } from '../types.ts';

const LIBRARY_APPS: AppItem[] = [
  { id: 'lib-1', name: 'WhatsApp', packageName: 'com.whatsapp', icon: 'https://cdn-icons-png.flaticon.com/512/124/124034.png', category: 'social', clonedCount: 0 },
  { id: 'lib-2', name: 'Facebook', packageName: 'com.facebook.katana', icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', category: 'social', clonedCount: 0 },
  { id: 'lib-3', name: 'Instagram', packageName: 'com.instagram.android', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111463.png', category: 'social', clonedCount: 0 },
  { id: 'lib-4', name: 'Telegram', packageName: 'org.telegram.messenger', icon: 'https://cdn-icons-png.flaticon.com/512/2111/2111646.png', category: 'social', clonedCount: 0 },
  { id: 'lib-5', name: 'Messenger', packageName: 'com.facebook.orca', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968771.png', category: 'social', clonedCount: 0 },
  { id: 'lib-6', name: 'Snapchat', packageName: 'com.snapchat.android', icon: 'https://cdn-icons-png.flaticon.com/512/3670/3670166.png', category: 'social', clonedCount: 0 },
  { id: 'lib-7', name: 'TikTok', packageName: 'com.ss.android.ugc.trill', icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png', category: 'social', clonedCount: 0 },
  { id: 'lib-8', name: 'Twitter', packageName: 'com.twitter.android', icon: 'https://cdn-icons-png.flaticon.com/512/3256/3256013.png', category: 'social', clonedCount: 0 },
  { id: 'lib-9', name: 'Discord', packageName: 'com.discord', icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968756.png', category: 'social', clonedCount: 0 },
];

export const Dashboard: React.FC = () => {
  const [clones, setClones] = useState<AppItem[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [launchingApp, setLaunchingApp] = useState<AppItem | null>(null);
  const [activeSession, setActiveSession] = useState<AppItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isStealth, setIsStealth] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [userProfile, setUserProfile] = useState({ 
    name: 'DualSpace User', 
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' 
  });
  
  const [customIcon, setCustomIcon] = useState<string | null>(null);
  const [customName, setCustomName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contextMenuApp, setContextMenuApp] = useState<AppItem | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const longPressTimer = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('dualspace_clones');
    const premium = localStorage.getItem('dualspace_premium') === 'true';
    const profile = localStorage.getItem('dualspace_profile');
    
    setIsPremium(premium);
    if (profile) setUserProfile(JSON.parse(profile));
    
    if (saved) {
      setClones(JSON.parse(saved));
    } else {
      const initial: AppItem[] = [
        { ...LIBRARY_APPS[0], id: 'clone-1', clonedCount: 1, name: 'WhatsApp' },
        { ...LIBRARY_APPS[2], id: 'clone-2', clonedCount: 1, name: 'Instagram' }
      ];
      setClones(initial);
      localStorage.setItem('dualspace_clones', JSON.stringify(initial));
    }

    const loadData = () => {
      const currentSettings = JSON.parse(localStorage.getItem('dualspace_settings') || '{}');
      setIsStealth(currentSettings.stealth ?? currentSettings.stealthMode ?? false);
      setIsPremium(localStorage.getItem('dualspace_premium') === 'true');
      const p = localStorage.getItem('dualspace_profile');
      if (p) setUserProfile(JSON.parse(p));
    };

    loadData();
    window.addEventListener('settingsUpdated', loadData);
    window.addEventListener('premiumUpdated', loadData);
    window.addEventListener('profileUpdated', loadData);
    return () => {
      window.removeEventListener('settingsUpdated', loadData);
      window.removeEventListener('premiumUpdated', loadData);
      window.removeEventListener('profileUpdated', loadData);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('dualspace_clones', JSON.stringify(clones));
  }, [clones]);

  const handleClone = (app: AppItem) => {
    const samePackageClones = clones.filter(c => c.packageName === app.packageName);
    const usedIndices = samePackageClones.map(c => c.clonedCount);
    const nextNumber = usedIndices.length > 0 ? Math.max(...usedIndices) + 1 : 1;
    
    const newClone: AppItem = {
      ...app,
      id: `clone-${Date.now()}`,
      clonedCount: nextNumber,
      name: nextNumber === 1 ? app.name : `${app.name} ${nextNumber}`
    };

    setClones([...clones, newClone]);
    setIsPickerOpen(false);
  };

  const handleGalleryPicker = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createCustomClone = () => {
    if (!customIcon || !customName.trim()) return;
    
    const newClone: AppItem = {
      id: `clone-${Date.now()}`,
      name: customName,
      packageName: 'custom.app.' + Date.now(),
      icon: customIcon,
      category: 'productivity',
      clonedCount: 1
    };

    setClones([...clones, newClone]);
    setCustomIcon(null);
    setCustomName('');
    setIsPickerOpen(false);
  };

  const attemptLaunch = (app: AppItem) => {
    if (contextMenuApp) return;
    performLaunch(app);
  };

  const performLaunch = (app: AppItem) => {
    setLaunchingApp(app);
    // Simulation of professional boot sequence
    setTimeout(() => {
      setLaunchingApp(null);
      setActiveSession(app);
    }, 1800);
  };

  const handleUninstall = (id: string) => {
    setClones(clones.filter(c => c.id !== id));
    setContextMenuApp(null);
  };

  const handleRename = () => {
    if (!contextMenuApp || !renameValue.trim()) return;
    setClones(clones.map(c => c.id === contextMenuApp.id ? { ...c, name: renameValue } : c));
    setIsRenameModalOpen(false);
    setContextMenuApp(null);
  };

  const startLongPress = (app: AppItem) => {
    longPressTimer.current = window.setTimeout(() => setContextMenuApp(app), 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const filteredLibrary = LIBRARY_APPS.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAppGlow = (index: number) => {
    const glows = ['glow-blue', 'glow-purple', 'glow-pink'];
    return glows[index % glows.length];
  };

  // PROFESSIONAL MOCK APP UI ENGINE
  const MockAppUI = ({ app }: { app: AppItem }) => {
    const appName = app.name.toLowerCase();
    
    if (appName.includes('whatsapp')) {
      return (
        <div className="flex-1 flex flex-col bg-[#0b141a] text-white overflow-hidden">
          {/* WhatsApp Header */}
          <div className="bg-[#1f2c34] p-4 flex items-center justify-between shadow-md">
            <span className="text-xl font-bold text-[#8696a0]">WhatsApp</span>
            <div className="flex gap-5 text-[#8696a0]">
              <Camera size={20} />
              <Search size={20} />
              <MoreHorizontal size={20} />
            </div>
          </div>
          {/* Tabs */}
          <div className="bg-[#1f2c34] flex border-b border-[#2a3942]">
            {['CHATS', 'STATUS', 'CALLS'].map((tab, i) => (
              <div key={tab} className={`flex-1 text-center py-3 text-xs font-black tracking-widest ${i === 0 ? 'text-[#00a884] border-b-2 border-[#00a884]' : 'text-[#8696a0]'}`}>
                {tab}
              </div>
            ))}
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-4 p-4 active:bg-[#1f2c34] transition-colors border-b border-white/5">
                <div className="w-12 h-12 rounded-full bg-[#1f2c34] flex-shrink-0 flex items-center justify-center">
                  <User size={24} className="text-[#8696a0]" />
                </div>
                <div className="flex-1 border-b border-white/5 pb-2">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-slate-100">Contact {i}</span>
                    <span className="text-[10px] text-[#8696a0]">12:30 PM</span>
                  </div>
                  <p className="text-sm text-[#8696a0] truncate">Hey, check out this dual app!</p>
                </div>
              </div>
            ))}
          </div>
          {/* FAB */}
          <div className="absolute bottom-6 right-6">
            <div className="w-14 h-14 bg-[#00a884] rounded-2xl flex items-center justify-center text-white shadow-2xl active:scale-90 transition-transform">
              <MessageSquare size={24} />
            </div>
          </div>
        </div>
      );
    }

    if (appName.includes('instagram')) {
      return (
        <div className="flex-1 flex flex-col bg-black text-white">
          {/* IG Header */}
          <div className="p-4 flex items-center justify-between border-b border-white/10">
            <span className="text-xl font-serif italic font-bold">Instagram</span>
            <div className="flex gap-5">
              <Heart size={24} />
              <Send size={24} className="-rotate-12" />
            </div>
          </div>
          {/* Stories */}
          <div className="flex gap-4 p-4 overflow-x-auto border-b border-white/5 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] p-[2px]">
                  <div className="w-full h-full rounded-full bg-black p-[2px]">
                    <div className="w-full h-full bg-slate-800 rounded-full" />
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">User_{i}</span>
              </div>
            ))}
          </div>
          {/* Feed */}
          <div className="flex-1 overflow-y-auto">
            {[1, 2].map(i => (
              <div key={i} className="mb-4">
                <div className="p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800" />
                  <span className="text-xs font-bold">official_cloner</span>
                </div>
                <div className="aspect-square bg-slate-900 flex items-center justify-center relative">
                   <ImageIcon size={48} className="text-white/10" />
                   <div className="absolute bottom-4 left-4 flex gap-4">
                      <Heart size={24} />
                      <MessageSquare size={24} />
                      <Send size={24} />
                   </div>
                </div>
              </div>
            ))}
          </div>
          {/* Bottom Bar */}
          <div className="p-4 border-t border-white/10 flex justify-around">
            <Home size={24} />
            <Search size={24} />
            <PlusCircle size={24} />
            <Play size={24} />
            <User size={24} />
          </div>
        </div>
      );
    }

    if (appName.includes('telegram')) {
      return (
        <div className="flex-1 flex flex-col bg-[#1c242f] text-white">
          {/* TG Header */}
          <div className="bg-[#242f3d] p-4 flex items-center gap-6">
            <Menu size={24} className="text-slate-400" />
            <span className="text-xl font-bold flex-1">Telegram</span>
            <Search size={22} className="text-slate-400" />
          </div>
          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {[1, 2, 3, 4, 5, 6, 7].map(i => (
              <div key={i} className="flex gap-4 p-4 active:bg-[#2b3541] transition-colors">
                <div className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-lg ${
                  i % 3 === 0 ? 'bg-blue-500' : i % 2 === 0 ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  {String.fromCharCode(64 + i)}
                </div>
                <div className="flex-1 border-b border-white/5 pb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">Group Admin {i}</span>
                    <span className="text-xs text-slate-500">12:30</span>
                  </div>
                  <p className="text-sm text-slate-400 truncate">Secret chat protocol initialized...</p>
                </div>
              </div>
            ))}
          </div>
          {/* TG FAB */}
          <div className="absolute bottom-6 right-6">
             <div className="w-14 h-14 bg-[#2b97d3] rounded-full flex items-center justify-center text-white shadow-xl">
                <Edit2 size={24} />
             </div>
          </div>
        </div>
      );
    }

    if (appName.includes('facebook')) {
       return (
          <div className="flex-1 flex flex-col bg-[#18191a] text-[#b0b3b8]">
            {/* FB Header */}
            <div className="p-4 flex items-center justify-between">
               <span className="text-2xl font-black text-blue-500">facebook</span>
               <div className="flex gap-3">
                  <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white"><Search size={18} /></div>
                  <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white"><MessageSquare size={18} /></div>
               </div>
            </div>
            {/* FB Tabs */}
            <div className="flex border-b border-white/10">
               {[Home, User, Video, Bell, Menu].map((Icon, i) => (
                  <div key={i} className={`flex-1 py-3 flex justify-center ${i === 0 ? 'text-blue-500 border-b-2 border-blue-500' : ''}`}>
                     <Icon size={24} />
                  </div>
               ))}
            </div>
            {/* FB Feed */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
               <div className="bg-[#242526] p-4 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-800" />
                  <div className="bg-[#3a3b3c] flex-1 py-2 px-4 rounded-full text-xs">What's on your mind?</div>
               </div>
               {[1, 2].map(i => (
                  <div key={i} className="bg-[#242526] rounded-xl overflow-hidden">
                     <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800" />
                        <div className="flex flex-col"><span className="text-white text-sm font-bold">Facebook User {i}</span><span className="text-[10px]">2h</span></div>
                     </div>
                     <div className="aspect-video bg-slate-900" />
                     <div className="p-4 flex gap-4 text-xs font-bold border-t border-white/5 mt-2">
                        <span>Like</span><span>Comment</span><span>Share</span>
                     </div>
                  </div>
               ))}
            </div>
          </div>
       );
    }

    // Default Fallback UI
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 bg-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500/30 blur-3xl animate-pulse" />
          <ShieldCheck size={80} className="text-blue-500 relative" />
        </div>
        <div>
          <h3 className="text-2xl font-black italic tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 uppercase">Sandbox Active</h3>
          <p className="text-sm text-slate-400 mt-2 font-medium italic">Memory Protocol 0x{app.id.slice(-4)} Loaded</p>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
           <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-[shimmer_2s_infinite]" style={{width: '60%'}}></div>
           </div>
           <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Virtualized OS Layer Active</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      {!isPremium && (
        <div className="glass p-4 rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-900/30 to-slate-900 border border-white/5 flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
             <div className="px-1.5 py-0.5 bg-slate-700 rounded text-[8px] font-black text-white">AD</div>
             <div>
               <p className="text-[10px] font-black text-slate-200">Remove these ads with Pro</p>
               <p className="text-[8px] text-slate-500 font-bold">Ad-free experience just $2.99</p>
             </div>
          </div>
          <button onClick={() => window.dispatchEvent(new Event('openPremiumModal'))} className="p-2 text-indigo-400 hover:text-white transition-colors">
            <ExternalLink size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500/30 p-0.5 overflow-hidden shadow-lg">
            <img src={userProfile.avatar} className="w-full h-full rounded-full object-cover" alt="Profile" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-white italic uppercase"><span className="text-blue-500">Dual</span>Space</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest opacity-80">Encryption: Level 5 Active</p>
          </div>
        </div>
        <button 
          onClick={() => setIsPickerOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 active:scale-90 transition-all hover:brightness-110 group"
        >
          <Plus size={28} className="text-white group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-y-12 gap-x-6">
        {clones.map((app, idx) => (
          <div key={app.id} className="flex flex-col items-center group relative">
            <button 
              onPointerDown={() => startLongPress(app)}
              onPointerUp={endLongPress}
              onPointerLeave={endLongPress}
              onContextMenu={(e) => { e.preventDefault(); setContextMenuApp(app); }}
              onClick={() => attemptLaunch(app)}
              className={`relative w-20 h-20 rounded-[2.5rem] glass p-4.5 transition-all active:scale-90 flex items-center justify-center mb-3 shadow-lg overflow-visible group-hover:border-blue-500/40 ${getAppGlow(idx)}`}
            >
              <div className={`w-12 h-12 relative transition-all duration-500 ${isStealth ? 'opacity-30 grayscale blur-[4px]' : 'opacity-100 blur-0'}`}>
                <img 
                  src={app.icon} 
                  alt={app.name} 
                  className="w-full h-full object-contain animate-float rounded-xl"
                  style={{ animationDelay: `${idx * 0.2}s` }}
                />
              </div>
              <div className={`absolute -top-2 -right-2 flex items-center justify-center min-w-[24px] h-[24px] px-2 ${isStealth ? 'bg-slate-700' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} text-[10px] font-black text-white rounded-full border-2 border-slate-950 shadow-xl z-20`}>
                {app.clonedCount}
              </div>
            </button>
            <span className={`text-[11px] font-black truncate w-full text-center tracking-tight ${isStealth ? 'text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
              {isStealth ? `ID: ${app.clonedCount}` : app.name}
            </span>
          </div>
        ))}
      </div>

      {contextMenuApp && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setContextMenuApp(null)} />
          <div className="relative w-full max-w-[300px] glass rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 animate-in zoom-in-95">
            <div className="p-8 flex flex-col items-center border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
               <div className="w-20 h-20 mb-4 flex items-center justify-center bg-slate-800/50 rounded-3xl p-3 shadow-inner">
                 <img src={contextMenuApp.icon} className="w-full h-full object-contain rounded-xl" />
               </div>
               <h3 className="font-black text-xl text-white italic">{contextMenuApp.name}</h3>
               <span className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mt-2">Instance Config</span>
            </div>
            <div className="flex flex-col p-2">
               <button onClick={() => { setRenameValue(contextMenuApp.name); setIsRenameModalOpen(true); }} className="flex items-center gap-4 w-full p-5 hover:bg-white/5 text-white rounded-2xl transition-all">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400"><Edit2 size={20} /></div>
                 <span className="font-bold text-sm">Rename Clone</span>
               </button>
               <button onClick={() => handleUninstall(contextMenuApp.id)} className="flex items-center gap-4 w-full p-5 hover:bg-red-500/10 text-red-500 rounded-2xl transition-all">
                 <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500"><Trash2 size={20} /></div>
                 <span className="font-bold text-sm">Uninstall Instance</span>
               </button>
            </div>
            <button onClick={() => setContextMenuApp(null)} className="w-full p-5 text-slate-500 text-xs font-black uppercase tracking-[0.2em] bg-slate-950/40 hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {isRenameModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={() => setIsRenameModalOpen(false)} />
          <div className="relative w-full max-w-sm glass rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 border border-white/10">
            <h3 className="text-2xl font-black mb-6 text-white italic">Rename Instance</h3>
            <input 
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full bg-slate-900/50 border-2 border-white/5 focus:border-blue-500 rounded-2xl py-5 px-6 text-white outline-none transition-all mb-8 font-black text-lg"
              placeholder="New name..."
              onKeyDown={(e) => e.key === 'Enter' && handleRename()}
            />
            <div className="flex gap-4">
              <button onClick={() => setIsRenameModalOpen(false)} className="flex-1 py-5 bg-slate-800/50 text-slate-400 font-black uppercase tracking-widest text-xs rounded-2xl">Cancel</button>
              <button onClick={handleRename} className="flex-1 py-5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20">Update</button>
            </div>
          </div>
        </div>
      )}

      {isPickerOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-slate-950 animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center p-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl">
            <button onClick={() => setIsPickerOpen(false)} className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={28} /></button>
            <div className="flex-1 ml-4">
              <h2 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600 italic uppercase">App Gallery</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Select Apps to Duplicate</p>
            </div>
            <button onClick={handleGalleryPicker} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 hover:bg-white/10 transition-all border border-white/5">
               <ImageIcon size={22} />
            </button>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
          </div>
          
          <div className="p-6">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search mobile apps..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)} 
                className="w-full bg-slate-900 border-2 border-transparent focus:border-blue-500/30 rounded-2xl py-5 pl-14 pr-6 text-sm outline-none transition-all placeholder:text-slate-600 font-bold" 
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-24">
            {customIcon && (
              <div className="px-2 mb-8 animate-in zoom-in-95">
                 <div className="p-6 glass rounded-[2.5rem] border border-green-500/30 flex items-center gap-6">
                    <img src={customIcon} className="w-20 h-20 rounded-[2rem] object-cover shadow-2xl ring-4 ring-white/5" />
                    <div className="flex-1 space-y-4">
                       <input 
                          autoFocus
                          type="text" 
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="Name your clone..." 
                          className="w-full bg-slate-800/50 border border-white/5 rounded-xl py-3 px-4 text-xs text-white outline-none focus:border-blue-500 font-black"
                       />
                       <div className="flex gap-3">
                          <button onClick={() => setCustomIcon(null)} className="flex-1 py-3 bg-slate-800 text-[9px] font-black uppercase text-slate-400 rounded-xl">Cancel</button>
                          <button onClick={createCustomClone} className="flex-1 py-3 bg-blue-600 text-[9px] font-black uppercase text-white rounded-xl shadow-lg">Install Clone</button>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            <div className="space-y-8">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <History size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Recommended</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 px-2">
                    {LIBRARY_APPS.slice(0, 4).map(app => (
                      <button key={`recent-${app.id}`} onClick={() => handleClone(app)} className="flex flex-col items-center gap-2 group">
                        <div className="w-14 h-14 bg-slate-900/50 rounded-2xl flex items-center justify-center p-3 group-active:scale-90 transition-all border border-white/5">
                          <img src={app.icon} className="w-full h-full object-contain" />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400 truncate w-full text-center">{app.name}</span>
                      </button>
                    ))}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 px-2">
                    <LayoutGrid size={14} className="text-slate-500" />
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">System Gallery</span>
                  </div>
                  <div className="grid grid-cols-3 gap-5 px-2 pb-6">
                    {filteredLibrary.map(app => (
                      <button key={app.id} onClick={() => handleClone(app)} className="flex flex-col items-center gap-3 p-4 glass hover:bg-white/5 rounded-[2rem] border border-white/5 group relative">
                        <div className="w-16 h-16 bg-slate-800/80 rounded-[1.8rem] flex items-center justify-center p-3 group-active:scale-90 transition-all shadow-inner">
                          <img src={app.icon} className="w-full h-full object-contain" />
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-black text-white">{app.name}</span>
                          <span className="text-[8px] text-blue-500 font-bold uppercase tracking-widest mt-0.5">{app.category}</span>
                        </div>
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-white/5 bg-slate-950 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
             <div className="flex items-center gap-3">
                <Info size={14} className="text-blue-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Clone Limit: <span className="text-blue-500">Unlimited (Free)</span></span>
             </div>
             <button onClick={() => setIsPickerOpen(false)} className="px-6 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full border border-white/5">Done</button>
          </div>
        </div>
      )}

      {/* Launching Simulation with Splash Screens */}
      {launchingApp && (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center animate-in fade-in duration-500 ${
          launchingApp.name.toLowerCase().includes('whatsapp') ? 'bg-[#128c7e]' :
          launchingApp.name.toLowerCase().includes('facebook') ? 'bg-[#1877f2]' :
          launchingApp.name.toLowerCase().includes('instagram') ? 'bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]' :
          launchingApp.name.toLowerCase().includes('telegram') ? 'bg-[#242f3d]' :
          'bg-slate-950'
        }`}>
          <div className="flex flex-col items-center space-y-12">
            <div className="w-32 h-32 p-6 glass rounded-[3rem] flex items-center justify-center animate-pulse shadow-2xl">
               <img src={launchingApp.icon} className="w-20 h-20 object-contain rounded-xl" />
            </div>
            <div className="flex flex-col items-center space-y-4">
              <h2 className="text-3xl font-black text-white italic drop-shadow-lg">{launchingApp.name}</h2>
              <div className="flex flex-col items-center gap-2">
                <span className="text-[9px] text-white/50 font-black uppercase tracking-[0.4em]">Initializing Virtual Engine</span>
                <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-white animate-[shimmer_1.5s_infinite]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 flex flex-col items-center">
             <ShieldCheck size={24} className="text-white/30 mb-2" />
             <p className="text-[8px] text-white/30 font-black uppercase tracking-[0.2em]">Protected by DualSpace Pro</p>
          </div>
        </div>
      )}

      {/* Active Session Simulation */}
      {activeSession && (
        <div className="fixed inset-0 z-[110] bg-slate-950 flex flex-col animate-in slide-in-from-right duration-500">
          <div className="h-14 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-4 border-b border-white/5">
            <button onClick={() => setActiveSession(null)} className="p-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={24} /></button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 p-1.5 bg-slate-800 rounded-lg"><img src={activeSession.icon} className="w-full h-full object-contain rounded" /></div>
              <span className="font-black text-sm text-white tracking-tight italic">{activeSession.name}</span>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <MoreHorizontal size={22} className="text-slate-600" />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <MockAppUI app={activeSession} />
          </div>
        </div>
      )}
    </div>
  );
};
