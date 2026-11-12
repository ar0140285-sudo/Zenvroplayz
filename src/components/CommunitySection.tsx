import React, { useState } from 'react';
import { 
  MessageSquare, Heart, Pin, Send, CornerDownRight, 
  Sparkles, Check, ShieldCheck, User, MessageCircle, Lock
} from 'lucide-react';
import { CommunityPost, CommunityReply, ChannelProfile } from '../types';
import { soundManager } from '../utils/sound';

interface CommunitySectionProps {
  channel: ChannelProfile;
  posts: CommunityPost[];
  onAddPost: (post: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => void;
  onAddReply: (postId: string, reply: Omit<CommunityReply, 'id' | 'timestamp' | 'likes'>) => void;
  onToggleLikePost: (postId: string) => void;
  onToggleLikeReply: (postId: string, replyId: string) => void;
  onTogglePinPost: (postId: string) => void;
}

export const CommunitySection: React.FC<CommunitySectionProps> = ({
  channel,
  posts,
  onAddPost,
  onAddReply,
  onToggleLikePost,
  onToggleLikeReply,
  onTogglePinPost
}) => {
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);

  // New Post Form State
  const [isCreatorVerified, setIsCreatorVerified] = useState<boolean>(() => {
    return localStorage.getItem('zenvro_is_creator_verified') === 'true';
  });
  const [showCreatorPinPrompt, setShowCreatorPinPrompt] = useState<boolean>(false);
  const [creatorPinInput, setCreatorPinInput] = useState<string>('');
  const [creatorPinError, setCreatorPinError] = useState<string>('');

  const [postAsCreator, setPostAsCreator] = useState<boolean>(isCreatorVerified);
  const [authorName, setAuthorName] = useState<string>('');
  const [postCategory, setPostCategory] = useState<CommunityPost['category']>('General');
  const [postTitle, setPostTitle] = useState<string>('');
  const [postContent, setPostContent] = useState<string>('');
  const [postSuccess, setPostSuccess] = useState<boolean>(false);

  // Reply Form State
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [replyAuthorMap, setReplyAuthorMap] = useState<Record<string, string>>({});

  const categories: ('All' | CommunityPost['category'])[] = [
    'All',
    'General',
    'Mod Ideas',
    'SMP Server',
    'Fan Art',
    'Video Feedback'
  ];

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

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    soundManager.playXpChime();

    const isCreator = postAsCreator && isCreatorVerified;
    const finalAuthor = isCreator ? channel.name : (authorName.trim() || 'Minecraft Miner');

    onAddPost({
      authorName: finalAuthor,
      authorHandle: isCreator ? channel.handle : `@${finalAuthor.toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: isCreator 
        ? channel.avatarUrl 
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(finalAuthor)}`,
      isCreator: isCreator,
      isPinned: isCreator,
      category: postCategory,
      title: postTitle.trim(),
      content: postContent.trim()
    });

    setPostTitle('');
    setPostContent('');
    if (!isCreator) setAuthorName('');
    setPostSuccess(true);
    setTimeout(() => setPostSuccess(false), 3000);
  };

  const handleReplySubmit = (postId: string) => {
    const text = replyTextMap[postId];
    if (!text || !text.trim()) return;

    soundManager.playClick();
    const isCreator = isCreatorVerified;
    const author = replyAuthorMap[postId]?.trim() || (isCreator ? channel.name : 'Gamer Fan');

    onAddReply(postId, {
      authorName: isCreator ? channel.name : author,
      authorHandle: isCreator ? channel.handle : `@${author.toLowerCase().replace(/\s+/g, '')}`,
      authorAvatar: isCreator 
        ? channel.avatarUrl 
        : `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(author)}`,
      isCreator: isCreator,
      content: text.trim()
    });

    setReplyTextMap(prev => ({ ...prev, [postId]: '' }));
    if (!isCreator) setReplyAuthorMap(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(post => {
    if (selectedCategory === 'All') return true;
    return post.category === selectedCategory;
  });

  return (
    <section id="community" className="py-10 sm:py-12 border-b border-slate-800/80 bg-[#0a0e14]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-1.5 sm:space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
            <MessageCircle className="w-4 h-4" />
            <span>Official Viewer Community</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            {channel.name} Community Lounge
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">
            Sabhi viewers aur subscribers yaha comment, questions aur ideas post kar sakte hai. Har koi in discussions ko dekh sakta hai aur reply kar sakta hai!
          </p>
        </div>

        {/* Create New Post Box (Mobile Friendly) */}
        <div className="bg-slate-900/90 rounded-2xl border-2 border-emerald-500/30 p-4 sm:p-6 shadow-xl mc-block-border space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="font-display font-bold text-sm sm:text-base text-white">
                Write a Post or Discussion
              </h3>
            </div>

            {/* Creator Security Mode Toggle */}
            <div className="flex items-center gap-2 text-xs">
              {isCreatorVerified ? (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 rounded-lg font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Creator</span>
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
            <div className="p-3.5 bg-slate-950 rounded-xl border border-amber-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Zenvroplayz PIN verification</span>
                </span>
                <button
                  onClick={() => setShowCreatorPinPrompt(false)}
                  className="text-xs text-slate-400 hover:text-white py-1"
                >
                  Cancel
                </button>
              </div>
              <form onSubmit={handleVerifyCreatorPin} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
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
              {creatorPinError && (
                <p className="text-[11px] text-red-400">{creatorPinError}</p>
              )}
            </div>
          )}

          <form onSubmit={handlePostSubmit} className="space-y-3.5 sm:space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    <span className="text-[11px] text-emerald-400 font-semibold">Official Channel Creator</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Gamer Tag / Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MinerPro99"
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
                  onChange={(e) => setPostCategory(e.target.value as CommunityPost['category'])}
                  className="w-full px-3 py-2.5 bg-slate-950 text-white text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer min-h-[42px]"
                >
                  <option value="General">General Discussion</option>
                  <option value="Mod Ideas">Mod Ideas & Requests</option>
                  <option value="SMP Server">SMP Server & Recruitment</option>
                  <option value="Fan Art">Fan Art & Builds</option>
                  <option value="Video Feedback">Video Feedback & Suggestions</option>
                </select>
              </div>
            </div>

            {/* Post Title */}
            <div>
              <input
                type="text"
                required
                placeholder="Topic Title (e.g. Bhai agle episode me Warden fight challenge karo!)"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-sm font-semibold rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors min-h-[44px]"
              />
            </div>

            {/* Post Content */}
            <div>
              <textarea
                required
                rows={3}
                placeholder="Apna message, question ya suggestion yaha likhiye..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 text-white placeholder-slate-500 text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Submit Action */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
              <span className="text-[11px] text-slate-500">
                100% Free & Open discussion. Everyone can see and reply.
              </span>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {postSuccess && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-fade-in">
                    <Check className="w-4 h-4" />
                    <span>Published!</span>
                  </span>
                )}
                <button
                  type="submit"
                  className="mc-block-btn w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition-all cursor-pointer min-h-[44px]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Post</span>
                </button>
              </div>
            </div>

          </form>
        </div>

        {/* Category Filters Bar with Horizontal Touch Swipe */}
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
            {filteredPosts.length} Discussions
          </span>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4 sm:space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10 bg-slate-900/30 rounded-xl border border-slate-800/80">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No posts in this category yet. Be the first to start one!</p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className={`rounded-2xl border transition-all shadow-md ${
                  post.isPinned
                    ? 'bg-slate-900/95 border-emerald-500/60 shadow-emerald-950/20'
                    : 'bg-slate-900/85 border-slate-800 hover:border-slate-700'
                } p-4 sm:p-5 space-y-3.5 sm:space-y-4`}
              >
                {/* Post Author & Header Metadata */}
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
                        <span className="font-bold text-xs sm:text-sm text-white">{post.authorName}</span>
                        {post.isCreator && (
                          <span className="px-1.5 py-0.5 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-[9px] sm:text-[10px] font-black rounded uppercase">
                            Official Creator
                          </span>
                        )}
                        <span className="text-[11px] text-slate-500">{post.authorHandle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 mt-0.5">
                        <span className="text-emerald-400 font-medium">{post.category}</span>
                        <span>·</span>
                        <span>{post.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pinned Tag */}
                  <div className="flex items-center gap-1 shrink-0">
                    {post.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] sm:text-[11px] font-bold rounded">
                        <Pin className="w-3 h-3 text-amber-400" />
                        <span>Pinned</span>
                      </span>
                    )}

                    {isCreatorVerified && (
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          onTogglePinPost(post.id);
                        }}
                        title={post.isPinned ? "Unpin post" : "Pin post to top"}
                        className="p-1.5 text-slate-500 hover:text-amber-400 transition-colors rounded hover:bg-slate-800 min-h-[36px] min-w-[36px] flex items-center justify-center"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-sm sm:text-base text-white">
                    {post.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                </div>

                {/* Post Actions: Like & Reply Toggle (Touch Optimized) */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 sm:gap-3">
                    
                    {/* Like / Heart Button */}
                    <button
                      onClick={() => {
                        soundManager.playLikePop();
                        onToggleLikePost(post.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] ${
                        post.hasLiked
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'text-slate-400 hover:text-red-400 hover:bg-slate-800 active:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-current' : ''}`} />
                      <span className="font-bold tabular-nums">{post.likes}</span>
                    </button>

                    {/* Reply Toggle Button */}
                    <button
                      onClick={() => {
                        soundManager.playClick();
                        setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id);
                      }}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-colors cursor-pointer min-h-[40px] ${
                        activeReplyPostId === post.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800 active:bg-slate-800'
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-bold tabular-nums">{post.replies.length} Replies</span>
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      soundManager.playClick();
                      setActiveReplyPostId(post.id);
                    }}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 hover:underline cursor-pointer py-2 px-1"
                  >
                    + Reply
                  </button>
                </div>

                {/* Threaded Replies Section */}
                {(post.replies.length > 0 || activeReplyPostId === post.id) && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2.5 sm:pl-3">
                    
                    {/* Render Existing Nested Replies */}
                    {post.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className="flex items-start gap-2.5 p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800/80"
                      >
                        <CornerDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0 mt-1" />
                        <img
                          src={reply.authorAvatar}
                          alt={reply.authorName}
                          className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold text-xs text-white truncate">{reply.authorName}</span>
                              {reply.isCreator && (
                                <span className="px-1 py-0.2 bg-emerald-500/20 text-emerald-300 text-[8px] font-black rounded uppercase border border-emerald-500/40 shrink-0">
                                  Creator
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-500 shrink-0">{reply.timestamp}</span>
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
                              className={`flex items-center gap-1 text-[11px] transition-colors py-1 ${
                                reply.hasLiked ? 'text-red-400 font-bold' : 'text-slate-500 hover:text-red-400'
                              }`}
                            >
                              <Heart className={`w-3 h-3 ${reply.hasLiked ? 'fill-current' : ''}`} />
                              <span>{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Inline Reply Composer */}
                    <div className="p-3 bg-slate-950 rounded-xl border border-emerald-900/50 space-y-2 mt-2">
                      <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                        <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Reply to {post.authorName}:</span>
                      </span>

                      {!isCreatorVerified && (
                        <input
                          type="text"
                          placeholder="Your Gamer Name..."
                          value={replyAuthorMap[post.id] || ''}
                          onChange={(e) => setReplyAuthorMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                          className="w-full px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 min-h-[40px]"
                        />
                      )}

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          placeholder="Type your reply..."
                          value={replyTextMap[post.id] || ''}
                          onChange={(e) => setReplyTextMap(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleReplySubmit(post.id);
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-slate-900 text-white placeholder-slate-500 text-sm sm:text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 min-h-[40px]"
                        />
                        <button
                          type="button"
                          onClick={() => handleReplySubmit(post.id)}
                          className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer min-h-[40px]"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
