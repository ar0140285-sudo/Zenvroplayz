import React, { useState } from 'react';
import { Play, Download, Copy, Check, Sparkles, Youtube, Users, Eye, Package } from 'lucide-react';
import { ChannelProfile, VideoItem } from '../types';
import { soundManager } from '../utils/sound';

interface HeroSectionProps {
  channel: ChannelProfile;
  featuredVideo: VideoItem;
  onPlayVideo: (video: VideoItem) => void;
  onNavigateTab: (tab: 'videos' | 'mods' | 'community' | 'updates') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  channel,
  featuredVideo,
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
    <section className="relative overflow-hidden pt-8 pb-14 border-b border-slate-800/80">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src={channel.bannerUrl}
          alt="Minecraft World Background"
          className="w-full h-full object-cover object-center filter brightness-45 contrast-110"
          referrerPolicy="no-referrer"
        />
        {/* Measured dark gradient overlays for 4.5:1 text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f15] via-[#0b0f15]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b0f15] via-[#0b0f15]/70 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Channel Verified Badge */}
        <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-xs text-emerald-300 backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Official Gaming HQ for <strong>{channel.name}</strong></span>
          <span className="text-emerald-500">·</span>
          <span className="text-slate-300 font-medium">Daily Minecraft Content & Mods</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Creator Identity & Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <span>Minecraft Hardcore</span>
                <span>·</span>
                <span>Custom Modpacks</span>
                <span>·</span>
                <span>Community SMP</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] text-balance">
                {channel.name} Minecraft Gaming & Modding Hub
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                {channel.bio}
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundManager.playClick();
                  onPlayVideo(featuredVideo);
                }}
                className="mc-block-btn flex items-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Latest Episode</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTab('mods');
                }}
                className="mc-block-btn flex items-center gap-2.5 px-5 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm tracking-wide rounded-lg border border-slate-700 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Mods & Shaders</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  onNavigateTab('community');
                }}
                className="mc-block-btn flex items-center gap-2 px-4 py-3.5 bg-slate-900/70 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-sm rounded-lg border border-slate-700/60 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Community Chat</span>
              </button>
            </div>

            {/* Server IP 1-Click Copy Box */}
            <div className="pt-2">
              <div className="inline-flex flex-wrap items-center gap-3 p-2.5 rounded-lg bg-slate-900/90 border border-emerald-900/60 shadow-inner">
                <span className="text-xs font-semibold text-slate-400 pl-2">Minecraft Server IP:</span>
                <code className="text-xs font-mono font-bold text-emerald-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                  {channel.serverIp}
                </code>
                <button
                  onClick={handleCopyIp}
                  className="flex items-center gap-1.5 px-3 py-1 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 text-xs font-semibold rounded border border-emerald-700/50 transition-colors cursor-pointer"
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
                <span className="text-xs text-slate-500 pr-2">({channel.serverVersion})</span>
              </div>
            </div>

            {/* Claim to Proof Channel Stat Strip */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800/80 max-w-lg">
              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>Subscribers</span>
                </div>
                <div className="text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  {channel.subscribers}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Total Views</span>
                </div>
                <div className="text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  {channel.totalViews}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mod Downloads</span>
                </div>
                <div className="text-2xl font-black text-white tabular-nums tracking-tight mt-0.5">
                  65K+
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured Video Card */}
          <div className="lg:col-span-5">
            <div className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-900/90 shadow-2xl mc-block-border">
              
              {/* Featured Badge */}
              <div className="absolute top-3 left-3 z-20 px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded shadow">
                Featured Episode
              </div>

              {/* Video Duration */}
              <div className="absolute bottom-3 right-3 z-20 px-2 py-0.5 bg-black/80 text-white text-xs font-mono font-bold rounded">
                {featuredVideo.duration}
              </div>

              {/* Thumbnail with Hover Zoom */}
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
                  <div className="w-16 h-16 rounded-full bg-emerald-500/90 group-hover:bg-emerald-400 flex items-center justify-center text-slate-950 shadow-xl transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-current translate-x-0.5" />
                  </div>
                </div>
              </div>

              {/* Video Info Card */}
              <div className="p-4 space-y-2 bg-[#121824]">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-semibold">{featuredVideo.series}</span>
                  <span>·</span>
                  <span>{featuredVideo.views}</span>
                  <span>·</span>
                  <span>{featuredVideo.uploadDate}</span>
                </div>
                <h3 className="font-display font-bold text-base text-white line-clamp-2 hover:text-emerald-300 transition-colors cursor-pointer"
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
