import React from 'react';
import { MessageSquare, ArrowRight, Pin, Clock, Sparkles } from 'lucide-react';
import { ChannelProfile, CommunityPost } from '../types';
import { soundManager } from '../utils/sound';

interface CommunityPreviewCardProps {
  channel: ChannelProfile;
  posts: CommunityPost[];
  onOpenChat: () => void;
}

export const CommunityPreviewCard: React.FC<CommunityPreviewCardProps> = ({
  channel,
  posts,
  onOpenChat,
}) => {
  const pinnedPost = posts.find((p) => p.isPinned) || posts[0];

  return (
    <section
      id="community"
      className="py-10 sm:py-12 border-b border-slate-800/80 bg-[#0a0e14]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900/95 via-[#0f1622] to-emerald-950/30 p-6 sm:p-8 shadow-xl mc-block-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Info */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>Dedicated Live Chat Webpage</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {channel.name} Community Lounge & Live Chat
              </h2>

              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                Viewers aur {channel.name} ke saath real-time me baat karne, mod ideas dene aur replies dekhne ke liye hamara alag Community Chat page open karein.
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] sm:text-xs text-slate-300 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    <strong className="text-white">{posts.length}</strong> Active Discussions
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>35-Day Auto-Delete</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                  <Pin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pinned Messages Safe Forever</span>
                </span>
              </div>
            </div>

            {/* Right Pinned Preview + CTA */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {pinnedPost && (
                <div className="p-3.5 rounded-xl bg-slate-950/85 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 font-bold text-amber-300">
                      <Pin className="w-3 h-3 text-amber-400" />
                      <span>{pinnedPost.isPinned ? 'Pinned Highlight' : 'Latest Chat'}</span>
                    </span>
                    <span className="text-slate-500">{pinnedPost.authorName}</span>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {pinnedPost.content}
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  soundManager.playClick();
                  onOpenChat();
                }}
                className="mc-block-btn w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer min-h-[48px]"
              >
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>Open Community Chat Page</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
