import React, { useState } from 'react';
import { Play, Search, Youtube, Clapperboard, Flame } from 'lucide-react';
import { VideoItem, ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';

interface VideoSectionProps {
  channel: ChannelProfile;
  videos: VideoItem[];
  onPlayVideo: (video: VideoItem) => void;
  onSuggestIdea: () => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({
  channel,
  videos,
  onPlayVideo,
  onSuggestIdea
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const seriesOptions = [
    'All',
    'Hardcore Survival',
    '100 Days Challenge',
    'Modded SMP',
    'Building & Redstone'
  ];

  const filteredVideos = videos.filter((video) => {
    const matchesSeries = selectedSeries === 'All' || video.series === selectedSeries;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSeries && matchesSearch;
  });

  return (
    <section id="videos" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Clapperboard className="w-4 h-4" />
              <span>{channel.name} Video Vault</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">
              Latest Episodes & Series
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">
              Catch up on all hardcore survival challenges, modded SMP adventures, and build timelapses in 4K 60FPS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onSuggestIdea();
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-emerald-900/60 rounded-lg transition-colors cursor-pointer"
            >
              + Suggest Video Topic
            </button>
            <a
              href={channel.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              <Youtube className="w-4 h-4" />
              <span>Zenvroplayz YouTube</span>
            </a>
          </div>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          
          {/* Series Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {seriesOptions.map((series) => (
              <button
                key={series}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSeries(series);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedSeries === series
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {series}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search episodes & guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 text-white placeholder-slate-500 text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/30 rounded-xl border border-slate-800/80">
            <Flame className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No episodes found matching your filter.</p>
            <button
              onClick={() => {
                setSelectedSeries('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-emerald-400 hover:underline font-semibold"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="group flex flex-col bg-slate-900/80 hover:bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all shadow-md hover:shadow-xl"
              >
                {/* Thumbnail Container */}
                <div
                  onClick={() => {
                    soundManager.playClick();
                    onPlayVideo(video);
                  }}
                  className="relative aspect-video overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/90 group-hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current translate-x-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/85 text-white font-mono text-[11px] font-bold rounded">
                    {video.duration}
                  </div>
                </div>

                {/* Video Info Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-emerald-400 font-semibold">{video.series}</span>
                      <span>·</span>
                      <span>{video.views}</span>
                      <span>·</span>
                      <span>{video.uploadDate}</span>
                    </div>
                    <h3
                      onClick={() => {
                        soundManager.playClick();
                        onPlayVideo(video);
                      }}
                      className="font-display font-bold text-base text-white hover:text-emerald-300 transition-colors cursor-pointer line-clamp-2"
                    >
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        onPlayVideo(video);
                      }}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch Episode</span>
                    </button>
                    <a
                      href={channel.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-red-400 transition-colors flex items-center gap-1"
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>@{channel.name}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
