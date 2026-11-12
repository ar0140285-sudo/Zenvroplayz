import React from 'react';
import { Youtube, Swords } from 'lucide-react';
import { ChannelProfile } from '../types';

interface FooterProps {
  channel: ChannelProfile;
  onNavigateTab: (tab: 'videos' | 'mods' | 'community' | 'updates') => void;
}

export const Footer: React.FC<FooterProps> = ({ channel, onNavigateTab }) => {
  return (
    <footer className="bg-[#080c12] border-t border-slate-800/80 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-display font-black text-lg text-white flex items-center gap-2">
                {channel.name}
                <Swords className="w-4 h-4 text-emerald-400" />
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-md">
              Official Minecraft Gaming, Modpacks, Tutorials & SMP Community Hub for {channel.name}. Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.
            </p>
          </div>

          {/* Nav links mirror */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-300">
            <button
              onClick={() => onNavigateTab('videos')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Videos
            </button>
            <button
              onClick={() => onNavigateTab('mods')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Mods Vault
            </button>
            <button
              onClick={() => onNavigateTab('community')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Community Lounge
            </button>
            <button
              onClick={() => onNavigateTab('updates')}
              className="hover:text-emerald-400 transition-colors cursor-pointer"
            >
              Server & Updates
            </button>
          </div>

          {/* YouTube Channel CTA */}
          <div className="flex items-center gap-3">
            <a
              href={channel.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900 hover:bg-red-600/20 text-slate-300 hover:text-red-400 transition-colors border border-slate-800"
              title="YouTube"
            >
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="font-semibold text-xs">@{channel.name}</span>
            </a>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} {channel.name}. All Rights Reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for {channel.name} Minecraft Gaming Community</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
