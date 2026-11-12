import React, { useState, useEffect } from 'react';
import { X, Youtube, Play, Pause, Volume2, VolumeX, Sparkles, ArrowLeft } from 'lucide-react';
import { VideoItem, ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';

interface VideoModalProps {
  video: VideoItem | null;
  channel: ChannelProfile;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, channel, onClose }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(18);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        soundManager.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Simulated playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 98 ? 10 : prev + 0.4));
    }, 300);
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!video) return null;

  const togglePlay = () => {
    soundManager.playClick();
    setIsPlaying(!isPlaying);
  };

  const handleBack = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div 
      onClick={handleBack}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-fade-in cursor-pointer overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-[#0f141d] border-2 border-emerald-500/50 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl relative space-y-4 mc-block-border cursor-default my-auto"
      >
        
        {/* Top Header with Prominent BACK Button */}
        <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-slate-800 bg-[#0a0e15]">
          <div className="flex items-center gap-3">
            {/* Primary Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all shadow cursor-pointer active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Back</span>
            </button>

            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded border border-emerald-500/40 hidden sm:inline">
              {video.series}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden md:inline">
              {channel.name} Video Theater
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Press [ESC] or click outside to exit
            </span>
            <button
              onClick={handleBack}
              title="Close and return back"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Custom Minecraft Episode Theater Player */}
        <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group select-none">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

          {/* Floating Voxel Ambient Particles */}
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-emerald-400/80 rounded-sm animate-ping" />
              <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-amber-400/60 rounded-sm animate-pulse" />
              <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-400/70 rounded-sm animate-ping" />
            </div>
          )}

          {/* Watermark Logo */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-display font-extrabold text-xs text-white tracking-wider uppercase">
              {channel.name} HD 60FPS
            </span>
          </div>

          {/* Center Play/Pause Overlay */}
          <div 
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
          >
            {!isPlaying && (
              <div className="w-16 h-16 rounded-full bg-emerald-500/90 text-slate-950 flex items-center justify-center shadow-2xl transform scale-110 transition-transform">
                <Play className="w-8 h-8 fill-current translate-x-0.5" />
              </div>
            )}
          </div>

          {/* Bottom Custom Playback Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent flex flex-col gap-2 z-20">
            {/* Progress Slider Bar */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const newPct = (clickX / rect.width) * 100;
                setProgress(Math.max(0, Math.min(100, newPct)));
              }}
              className="w-full h-1.5 bg-slate-700/80 rounded-full overflow-hidden cursor-pointer group/bar relative"
            >
              <div
                className="h-full bg-emerald-400 rounded-full relative transition-all"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover/bar:opacity-100 shadow" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white pt-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-1 text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => setIsAudioOn(!isAudioOn)}
                  className="p-1 text-slate-200 hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-red-400" />}
                </button>
                <span className="font-mono text-[11px] text-slate-300">
                  {Math.floor((progress * 0.32))}m : {Math.floor((progress * 1.5) % 60)}s / {video.duration}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  1080p60 Ultra
                </span>
                <span className="text-[11px] text-slate-400">
                  {video.views}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Details & Meta */}
        <div className="p-5 pt-1 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display font-black text-lg sm:text-xl text-white leading-snug">
                {video.title}
              </h3>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="text-emerald-400 font-semibold">{channel.name} Official Channel</span>
                <span>·</span>
                <span>{video.uploadDate}</span>
                <span>·</span>
                <span>{video.views}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Secondary Back Button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors border border-slate-700 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Hub</span>
              </button>

              {/* Direct Link to Zenvroplayz YouTube */}
              <a
                href={channel.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playXpChime()}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow cursor-pointer"
              >
                <Youtube className="w-4 h-4" />
                <span>YouTube Channel</span>
              </a>
            </div>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Episode Overview:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
