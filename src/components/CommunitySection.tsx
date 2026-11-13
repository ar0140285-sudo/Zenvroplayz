import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Heart,
  Pin,
  Send,
  CornerDownRight,
  Sparkles,
  Check,
  ShieldCheck,
  MessageCircle,
  Lock,
  Smile,
  ArrowLeft,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { CommunityPost, CommunityReply, ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';
import { getDaysRemaining } from '../services/communityService';

interface CommunitySectionProps {
  channel: ChannelProfile;
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => void;
  onAddReply: (postId: string, reply: Omit<CommunityReply, 'id' | 'timestamp' | 'likes'>) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleLikeReply: (postId: string, replyId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onBackHome?: () => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  channel,
  posts,
  onAddPost,
  onAddReply,
  onToggleLikePost,
  onToggleLikeReply,
  onTogglePinPost,
  onBackHome,
}) => {
  // Category filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);

  // Persistent user name so viewers only type it once
  const [authorName, setAuthorName] = useState<string>(() => {
    return localStorage.getItem('zenvro_user_name') || '';
  });

  // Creator Verification
  const [isCreatorVerified, setIsCreatorVerified] = useState<boolean>(() => {
    return localStorage.getItem('zenvro_is_creator_verified') === 'true';
  });
  const [showCreatorPinPrompt, setShowCreatorPinPrompt] = useState<boolean>(false);
  const [creatorPinInput, setCreatorPinInput] = useState<string>('');
  const [creatorPinError, setCreatorPinError] = useState<string>('');
  const [postAsCreator, setPostAsCreator] = useState<boolean>(isCreatorVerified);

  // Chat message & topic state
  const [postContent, setPostContent] = useState<string>('');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('General');
  const [postSuccess, setPostSuccess] = useState<boolean>(false);

  // Reply states
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const replyInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const categories: ('All' | CommunityPost['category'])[] = [
    'All',
    'General',
    'Mod Ideas',
    'SMP Server',
    'Fan Art',
    'Video Feedback',
  ];

  const quickEmojis = ['🔥', '⚔️', '💎', '⛏️', '🛡️', '❤️', '👑', '🚀'];

  // Save author name to localStorage
  useEffect(() => {
    if (authorName.trim()) {
      localStorage.setItem('zenvro_user_name', authorName.trim());
    }
  }, [authorName]);

  const handleVerifyCreatorPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (creatorPinInput === '1234' || creatorPinInput.toLowerCase() === 'zenvro') {
      soundManager.playXpChime();
      setIsCreatorVerified(true);
      setPostAsCreator(true);
      localStorage.setItem('zenvro_is_creator_verified', 'true');
      setShowCreatorPinPrompt(false);
      setCreatorPinError('');
    } else {
      setCreatorPinError('Wrong PIN! Default creator PIN is 1234 or zenvro');
    }
  };

  const handleAddEmoji = (emoji: string) => {
    soundManager.playClick();
    setPostContent((prev) => prev + emoji);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanContent = postContent.trim();
    if (!cleanContent) return;

    soundManager.playXpChime();

    const isCreator = postAsCreator && isCreatorVerified;
    const finalAuthor = isCreator ? channel.name : authorName.trim() || 'Minecraft Miner';

    let finalTitle = postTitle.trim();
    if (!finalTitle) {
      finalTitle =
        cleanContent.length > 50 ? `${cleanContent.slice(0, 48)}...` : cleanContent;
    }

    onAddPost({
      authorName: finalAuthor,
      authorHandle: isCreator
        ? channel.handle
        : `@${finalAuthor.toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: isCreator
        ? channel.avatarUrl
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalAuthor)}`,
      isCreator: isCreator,
      isPinned: isCreator,
      category: postCategory,
      title: finalTitle,
      content: cleanContent,
    });

    setPostContent('');
    setPostTitle('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3500);
  };

  const handleReplySubmit = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    soundManager.playClick();
    const isCreator = isCreatorVerified;
    const author = isCreator ? channel.name : authorName.trim() || 'Gamer Fan';

    onAddReply(postId, {
      authorName: isCreator ? channel.name : author,
      authorHandle: isCreator
        ? channel.handle
        : `@${author.toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: isCreator
        ? channel.avatarUrl
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author)}`,
      isCreator: isCreator,
      content: text.trim(),
    });

    setReplyTextMap((prev) => ({ ...prev, [postId]: '' }));
  };

  const handleOpenReplyBox = (postId: string) => {
    soundManager.playClick();
    setActiveReplyPostId(postId);
    setTimeout(() => {
      const input = replyInputRefs.current[postId];
      if (input) input.focus();
    }, 100);
  };

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  const pinnedCount = posts.filter((p) => p.isPinned).length;

  return (
    <section
      id="community"
      className="min-h-[calc(100vh-4rem)] py-6 sm:py-10 bg-[#0a0e14]"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Top Bar with Back to Home Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {onBackHome && (
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                onBackHome();
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-bold transition-colors cursor-pointer min-h-[40px]"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span>Back to Home</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300 ml-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Cloud Sync · {posts.length} Active Posts</span>
          </div>
        </div>

        {/* Dedicated Page Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <MessageCircle className="w-4 h-4" />
            <span>Dedicated Community Webpage</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {channel.name} Community Lounge & Live Chat
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sabhi viewers yaha comment, mod ideas aur Minecraft doubts share kar sakte hai. Messages real-time me sabko live dikhte hai!
          </p>
        </div>

        {/* 35-Day Auto-Delete & Pinned Message Notice */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs">
          <div className="flex items-start sm:items-center gap-2.5 text-slate-300">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong className="text-white">Auto-Cleanup Active:</strong> Normal chat messages{' '}
              <span className="text-amber-300 font-semibold">35 din</span> baad automatically delete ho jate hai.
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-300 font-semibold shrink-0 pl-6 sm:pl-0">
            <Pin className="w-3.5 h-3.5 text-amber-400" />
            <span>Pinned ({pinnedCount}) kabhi delete nahi honge</span>
          </div>
        </div>

        {/* Live Chat & Discussion Composer Box */}
        <div className="bg-slate-900/90 rounded-2xl border-2 border-emerald-500/40 p-4 sm:p-6 shadow-xl mc-block-border space-y-4">
          {/* Header Row: Title & Creator Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h2 className="font-display font-bold text-sm sm:text-base text-white">
                Share a Message or Discussion
              </h2>
            </div>

            {/* Creator Security Mode Toggle */}
            <div className="flex items-center gap-2 text-xs">
              {isCreatorVerified ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Creator ({channel.name})</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowCreatorPinPrompt(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors cursor-pointer min-h-[36px]"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Creator Sign-In</span>
                </button>
              )}
            </div>
          </div>

          {/* Creator Pin Verification Modal */}
          {showCreatorPinPrompt && (
            <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Zenvroplayz PIN verification</span>
                </span>
                <button
                  onClick={() => setShowCreatorPinPrompt(false)}
                  className="text-xs text-slate-400 hover:text-white py-1 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
              <form
                onSubmit={handleVerifyCreatorPin}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2"
              >
                <input
                  type="password"
                  placeholder="Enter Creator PIN (Default: 1234)"
                  value={creatorPinInput}
                  onChange={(e) => setCreatorPinInput(e.target.value)}
                  className="px-3 py-2 bg-slate-900 text-white text-xs rounded-lg border border-slate-800 focus:outline-none focus:border-amber-400 flex-1 min-h-[40px]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg cursor-pointer min-h-[40px]"
                >
                  Unlock Creator Mode
                </button>
              </form>
              {creatorPinError && <p className="text-[11px] text-red-400">{creatorPinError}</p>}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePostSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Author Name */}
              {isCreatorVerified && postAsCreator ? (
                <div className="flex items-center gap-3 py-1.5 px-3 bg-slate-950/70 rounded-xl border border-slate-800">
                  <img
                    src={channel.avatarUrl}
                    alt={channel.name}
                    className="w-8 h-8 rounded-full border border-emerald-500/50 object-cover"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-white block">{channel.name}</span>
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      Official Channel Creator (Auto-Pinned)
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name / Gamer Tag:
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    placeholder="Enter your name (e.g. GamerPro99)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors min-h-[42px]"
                  />
                </div>
              )}

              {/* Category Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Topic Category:
                </label>
                <select
                  value={postCategory}
                  onChange={(e) =>
                    setPostCategory(e.target.value as CommunityPost['category'])
                  }
                  className="w-full px-3 py-2.5 bg-slate-950 text-white text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer min-h-[42px]"
                >
                  <option value="General">💬 General Chat</option>
                  <option value="Mod Ideas">💡 Mod Ideas & Requests</option>
                  <option value="SMP Server">⚔️ SMP Server & Teaming</option>
                  <option value="Fan Art">🎨 Fan Art & Builds</option>
                  <option value="Video Feedback">🎬 Video Feedback</option>
                </select>
              </div>
            </div>

            {/* Optional Topic Title */}
            <div>
              <input
                type="text"
                maxLength={140}
                placeholder="Topic Title (Optional - leave empty for quick chat message)"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950/70 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800/80 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            {/* Main Message Textarea (Required) */}
            <div>
              <textarea
                required
                rows={3}
                maxLength={1800}
                placeholder="Type your message, question, or comment here (Press 'Send Message' to post)..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Quick Emoji Bar & Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              {/* Quick Emojis */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                  <Smile className="w-3.5 h-3.5 text-amber-400" />
                  <span>Add:</span>
                </span>
                {quickEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleAddEmoji(emoji)}
                    className="px-2 py-1 bg-slate-950 hover:bg-slate-800 rounded-lg text-sm border border-slate-800 transition-colors cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="flex items-center gap-2 justify-end">
                {postSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in mr-2">
                    <Check className="w-4 h-4" />
                    <span>Live Posted!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="mc-block-btn flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer min-h-[42px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1.5 no-scrollbar touch-pan-x -mx-1 px-1">
          <div className="flex items-center gap-1.5 shrink-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 min-h-[38px] flex items-center ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 font-mono shrink-0 hidden sm:inline">
            {filteredPosts.length} Active Conversations
          </span>
        </div>

        {/* Posts & Chat Stream */}
        <div className="space-y-4 sm:space-y-5">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-slate-800/80">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">
                No messages in this topic yet. Be the first to start the chat!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const daysLeft = getDaysRemaining(post.createdAt);

              return (
                <div
                  key={post.id}
                  className={`rounded-2xl border transition-all shadow-md ${
                    post.isPinned
                      ? 'bg-slate-900/95 border-amber-500/50 shadow-amber-950/20'
                      : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
                  } p-4 sm:p-5 space-y-3`}
                >
                  {/* Author Info & Header */}
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <img
                        src={post.authorAvatar}
                        alt={post.authorName}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-700 bg-slate-950 object-cover shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white">
                            {post.authorName}
                          </span>
                          {post.isCreator && (
                            <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[9px] sm:text-[10px] font-black rounded uppercase">
                              Official Creator
                            </span>
                          )}
                          <span className="text-[11px] text-slate-500">
                            {post.authorHandle}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                          <span className="text-emerald-400 font-medium">{post.category}</span>
                          <span>·</span>
                          <span>{post.timestamp}</span>
                          {!post.isPinned && (
                            <>
                              <span>·</span>
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <Clock className="w-3 h-3 text-slate-500" />
                                <span>Deletes in {daysLeft}d</span>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pinned Tag & Pin Toggle */}
                    <div className="flex items-center gap-1 shrink-0">
                      {post.isPinned && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-bold rounded">
                          <Pin className="w-3 h-3 text-amber-400" />
                          <span>Pinned · Saved</span>
                        </span>
                      )}

                      {isCreatorVerified && (
                        <button
                          onClick={() => {
                            soundManager.playClick();
                            onTogglePinPost(post.id);
                          }}
                          title={
                            post.isPinned
                              ? 'Unpin post (35-day auto-delete will apply)'
                              : 'Pin post (Protected from 35-day auto-delete)'
                          }
                          className={`p-1.5 transition-colors rounded hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer ${
                            post.isPinned
                              ? 'text-amber-400 hover:text-amber-300'
                              : 'text-slate-500 hover:text-amber-400'
                          }`}
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="space-y-1">
                    {post.title !== post.content && (
                      <h4 className="font-display font-bold text-sm sm:text-base text-white">
                        {post.title}
                      </h4>
                    )}
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                      {post.content}
                    </p>
                  </div>

                  {/* Actions: Like & Reply Toggle */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Like / Heart Button */}
                      <button
                        onClick={() => {
                          soundManager.playLikePop();
                          onToggleLikePost(post.id);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                          post.hasLiked
                            ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                            : 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                        <span className="font-bold tabular-nums">{post.likes}</span>
                      </button>

                      {/* Reply Toggle Button */}
                      <button
                        onClick={() => handleOpenReplyBox(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer min-h-[38px] ${
                          activeReplyPostId === post.id
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-bold tabular-nums">{post.replies.length} Replies</span>
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenReplyBox(post.id)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer py-1.5 px-2"
                    >
                      + Reply
                    </button>
                  </div>

                  {/* Threaded Nested Replies */}
                  <div className="mt-2 pt-2 border-t border-slate-800/70 space-y-2.5 sm:pl-3">
                    {post.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/80"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-1" />
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-xs text-white truncate">
                                {reply.authorName}
                              </span>
                              {reply.isCreator && (
                                <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8px] font-black rounded uppercase border border-emerald-500/40 shrink-0">
                                  Creator
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">
                              {reply.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap break-words">
                            {reply.content}
                          </p>

                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                soundManager.playLikePop();
                                onToggleLikeReply(post.id, reply.id);
                              }}
                              className={`flex items-center gap-1 text-[11px] transition-colors py-0.5 cursor-pointer ${
                                reply.hasLiked
                                  ? 'text-red-400 font-bold'
                                  : 'text-slate-500 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${reply.hasLiked ? 'fill-current' : ''}`} />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {(post.replies.length > 0 || activeReplyPostId === post.id) && (
                      <div className="p-2.5 sm:p-3 bg-slate-950 rounded-xl border border-emerald-900/60 space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs text-slate-300">
                          <span className="flex items-center gap-1">
                            <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
                            <span>
                              Reply as{' '}
                              <strong>
                                {isCreatorVerified ? channel.name : authorName.trim() || 'Viewer'}
                              </strong>
                              :
                            </span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            ref={(el) => {
                              replyInputRefs.current[post.id] = el;
                            }}
                            type="text"
                            maxLength={1000}
                            placeholder="Type your reply and press Enter..."
                            value={replyTextMap[post.id] || ''}
                            onChange={(e) =>
                              setReplyTextMap((prev) => ({
                                ...prev,
                                [post.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleReplySubmit(post.id);
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 min-h-[40px]"
                          />
                          <button
                            type="button"
                            onClick={() => handleReplySubmit(post.id)}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer min-h-[40px] whitespace-nowrap"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer reminder note on Chat page */}
        <div className="pt-2 text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>
            Unpinned messages automatically expire after 35 days. Creator pinned announcements stay saved permanently.
          </span>
        </div>
      </div>
    </section>
  );
};
