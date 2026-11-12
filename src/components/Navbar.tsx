import React from 'react';
import { Volume2, VolumeX, Youtube, Swords } from 'lucide-react';
import { ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  channel: ChannelProfile;
  activeTab: 'videos' | 'mods' | 'community' | 'updates';
  setActiveTab: (tab: 'videos' | 'mods' | 'community' | 'updates') => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  channel,
  activeTab,
  setActiveTab,
  isMuted,
  onToggleMute
}) => {
  const handleNavClick = (tab: 'videos' | 'mods' | 'community' | 'updates') => {
    soundManager.playClick();
    setActiveTab(tab);
    const element = document.getElementById(tab);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d121a]/95 backdrop-blur-md border-b border-emerald-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => handleNavClick('videos')}
            className="flex items-center gap-3 group text-left focus:outline-none cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded bg-emerald-950 border border-emerald-500/50 overflow-hidden shrink-0 group-hover:border-emerald-400 transition-colors">
              <img 
                src={channel.avatarUrl} 
                alt={channel.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-transparent transition-colors" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                {channel.name}
                <Swords className="w-4 h-4 text-emerald-400 inline" />
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold tracking-wide">
          <button
            onClick={() => handleNavClick('videos')}
            className={`whitespace-nowrap transition-colors pb-1 relative cursor-pointer ${
              activeTab === 'videos' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Videos & Series
            {activeTab === 'videos' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('mods')}
            className={`whitespace-nowrap transition-colors pb-1 relative cursor-pointer ${
              activeTab === 'mods' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Mods Vault
            {activeTab === 'mods' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('community')}
            className={`whitespace-nowrap transition-colors pb-1 relative cursor-pointer ${
              activeTab === 'community' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Community Lounge
            {activeTab === 'community' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('updates')}
            className={`whitespace-nowrap transition-colors pb-1 relative cursor-pointer ${
              activeTab === 'updates' 
                ? 'text-emerald-400 font-bold' 
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Server & Updates
            {activeTab === 'updates' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Sound Toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              onToggleMute();
              soundManager.playClick();
            }}
            title={isMuted ? "Unmute gaming SFX" : "Mute gaming SFX"}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/50 cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <a
            href={channel.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playXpChime()}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all transform active:scale-95 shadow-md shadow-red-950/40 whitespace-nowrap"
          >
            <Youtube className="w-4 h-4" />
            <span>Subscribe @{channel.name}</span>
          </a>
        </div>
      </div>
    </header>
  );
};
