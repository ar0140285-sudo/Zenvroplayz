import React, { useState } from 'react';
import { Play, Download, Copy, Check, Sparkles, Youtube, Users, Eye, Package } from 'lucide-react';
import { ChannelProfile, VideoItem } from '../types';
import { soundManager } from '../utils/sound';

interface HeroSectionProps {
  channel: ChannelProfile;
  featuredVideo: VideoItem;
  totalDownloads?: number;
  onPlayVideo: (video: VideoItem) => void;
  onNavigateTab: (tab: 'videos' | 'mods' | 'community' | 'updates') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  channel,
  featuredVideo,
  totalDownloads = 8,
  onPlayVideo,
  onNavigateTab
}) => {
  const [copiedIp, setCopiedIp] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(channel.serverIp);
    soundManager.playXpChime();
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2500);
  };

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-8 pb-10 sm:pb-14 border-b border-slate-800/80">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={channel.bannerUrl}
          alt="Minecraft World Background"
          className="w-full h-full object-cover object-center filter brightness-45 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient overlays for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f15] via-[#0b0f15]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f15] via-[#0b0f15]/75 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Channel Verified Badge */}
        <div className="mb-4 sm:mb-6 inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 backdrop-blur-sm max-w-full">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Official Gaming HQ · <strong>{channel.name}</strong></span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          
          {/* Left Column: Creator Identity & Value Proposition */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="space-y-2.5 sm:space-y-3">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span>Minecraft Hardcore</span>
                <span>·</span>
                <span>Custom Mods</span>
                <span>·</span>
                <span>SMP Server</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
                {channel.name} Minecraft Gaming & Modding Hub
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {channel.bio}
              </p>
            </div>

            {/* Quick Action CTAs - Responsive Touch Stacking */}
            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-1">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPlayVideo(featuredVideo);
                }}
                className="mc-block-btn flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/60 transition-all cursor-pointer min-h-[48px]"
              >
                <Play className="w-4 h-4 fill-current shrink-0" />
                <span>Watch Latest Episode</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTab('mods');
                }}
                className="mc-block-btn flex items-center justify-center gap-2.5 px-5 py-3.5 bg-slate-900/95 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm tracking-wide rounded-xl border border-slate-700 transition-colors cursor-pointer min-h-[48px]"
              >
                <Download className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Download Mods & Shaders</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTab('community');
                }}
                className="mc-block-btn flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs sm:text-sm rounded-xl border border-slate-700/60 transition-colors cursor-pointer min-h-[48px]"
              >
                <Users className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Community Chat</span>
              </button>
            </div>

            {/* Server IP 1-Click Copy Box (Touch Optimized) */}
            <div className="pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 rounded-xl bg-slate-900/90 border border-emerald-900/60 shadow-inner">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Server IP:</span>
                  <code className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 truncate">
                    {channel.serverIp}
                  </code>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
                  <span className="text-[11px] text-slate-500">({channel.serverVersion})</span>
                  <button
                    onClick={handleCopyIp}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-900/50 hover:bg-emerald-800/60 active:scale-95 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-700/50 transition-colors cursor-pointer min-h-[36px]"
                  >
                    {copiedIp ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy IP</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Channel Stat Strip */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 border-t border-slate-800/80 max-w-lg">
              <div className="p-2 sm:p-0 rounded-lg bg-slate-900/40 sm:bg-transparent">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs font-medium">
                  <Youtube className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  <span className="truncate">Subs</span>
                </div>
                <div className="text-lg sm:text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  {channel.subscribers}
                </div>
              </div>

              <div className="p-2 sm:p-0 rounded-lg bg-slate-900/40 sm:bg-transparent">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Views</span>
                </div>
                <div className="text-lg sm:text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  {channel.totalViews}
                </div>
              </div>

              <div className="p-2 sm:p-0 rounded-lg bg-slate-900/40 sm:bg-transparent">
                <div className="flex items-center gap-1.5 text-slate-400 text-[11px] sm:text-xs font-medium">
                  <Package className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Downloads</span>
                </div>
                <div className="text-lg sm:text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  {totalDownloads}+
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Video Card */}
          <div className="lg:col-span-5 mt-2 lg:mt-0">
            <div className="relative group rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900/90 shadow-2xl mc-block-border">
              
              {/* Featured Badge */}
              <div className="absolute top-2.5 left-2.5 z-20 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-emerald-500 text-slate-950 font-black text-[10px] sm:text-xs uppercase tracking-wider rounded shadow">
                Featured Episode
              </div>

              {/* Video Duration */}
              <div className="absolute bottom-2.5 right-2.5 z-20 px-2 py-0.5 bg-black/85 text-white text-[11px] font-mono font-bold rounded">
                {featuredVideo.duration}
              </div>

              {/* Thumbnail with Hover/Touch Zoom */}
              <div 
                onClick={() => {
                  soundManager.playClick();
                  onPlayVideo(featuredVideo);
                }}
                className="relative aspect-video cursor-pointer overflow-hidden"
              >
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-xl transform group-active:scale-95 transition-transform">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info Card */}
              <div className="p-3.5 sm:p-4 space-y-1.5 sm:space-y-2 bg-[#121824]">
                <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">{featuredVideo.series}</span>
                  <span>·</span>
                  <span>{featuredVideo.views}</span>
                  <span>·</span>
                  <span>{featuredVideo.uploadDate}</span>
                </div>
                <h3 className="font-display font-bold text-sm sm:text-base text-white line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer"
                  onClick={() => onPlayVideo(featuredVideo)}
                >
                  {featuredVideo.title}
                </h3>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
