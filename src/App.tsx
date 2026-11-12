/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoSection } from './components/VideoSection';
import { ModVaultSection } from './components/ModVaultSection';
import { CommunitySection } from './components/CommunitySection';
import { UpdatesSection } from './components/UpdatesSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { 
  INITIAL_CHANNEL_PROFILE, 
  INITIAL_VIDEOS, 
  INITIAL_MODS, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_UPDATES 
} from './data/initialData';
import { ChannelProfile, VideoItem, ModItem, CommunityPost, CommunityReply } from './types';
import { soundManager } from './utils/sound';

export default function App() {
  // Channel Profile is permanently fixed to Zenvroplayz (no public customization)
  const channel: ChannelProfile = INITIAL_CHANNEL_PROFILE;

  // Videos State
  const [videos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  // Mods State (with persistent download counts)
  const [mods, setMods] = useState<ModItem[]>(() => {
    const saved = localStorage.getItem('zenvro_mods_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MODS;
      }
    }
    return INITIAL_MODS;
  });

  // Community Posts State (clean without fake comments)
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    const saved = localStorage.getItem('zenvro_community_posts_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch {
        return INITIAL_COMMUNITY_POSTS;
      }
    }
    return INITIAL_COMMUNITY_POSTS;
  });

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'videos' | 'mods' | 'community' | 'updates'>('videos');

  // Video Player Modal
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  // Sound SFX Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem('zenvro_mods_v2', JSON.stringify(mods));
  }, [mods]);

  useEffect(() => {
    localStorage.setItem('zenvro_community_posts_v2', JSON.stringify(communityPosts));
  }, [communityPosts]);

  // Handlers
  const handleToggleMute = () => {
    const muted = soundManager.toggleMute();
    setIsMuted(muted);
  };

  const handleDownloadMod = (modId: string) => {
    setMods(prevMods =>
      prevMods.map(m =>
        m.id === modId ? { ...m, downloads: m.downloads + 1 } : m
      )
    );
  };

  const handleAddPost = (newPostData: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      timestamp: 'Just now',
      likes: 1,
      hasLiked: true,
      replies: []
    };
    setCommunityPosts(prev => [newPost, ...prev]);
  };

  const handleAddReply = (postId: string, replyData: Omit<CommunityReply, 'id' | 'timestamp' | 'likes'>) => {
    const newReply: CommunityReply = {
      ...replyData,
      id: `reply-${Date.now()}`,
      timestamp: 'Just now',
      likes: 0
    };

    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, newReply]
          };
        }
        return post;
      })
    );
  };

  const handleToggleLikePost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.hasLiked;
          return {
            ...post,
            hasLiked: isLiked,
            likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1)
          };
        }
        return post;
      })
    );
  };

  const handleToggleLikeReply = (postId: string, replyId: string) => {
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: post.replies.map(rep => {
              if (rep.id === replyId) {
                const isLiked = !rep.hasLiked;
                return {
                  ...rep,
                  hasLiked: isLiked,
                  likes: isLiked ? rep.likes + 1 : Math.max(0, rep.likes - 1)
                };
              }
              return rep;
            })
          };
        }
        return post;
      })
    );
  };

  const handleTogglePinPost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(post =>
        post.id === postId ? { ...post, isPinned: !post.isPinned } : post
      )
    );
  };

  const scrollToCommunity = () => {
    setActiveTab('community');
    const el = document.getElementById('community');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f15] text-slate-100 flex flex-col font-sans">
      
      {/* Top Bar Navigation */}
      <Navbar
        channel={channel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          channel={channel}
          featuredVideo={videos[0]}
          onPlayVideo={(video) => setPlayingVideo(video)}
          onNavigateTab={setActiveTab}
        />

        {/* Video Vault Section */}
        <VideoSection
          channel={channel}
          videos={videos}
          onPlayVideo={(video) => setPlayingVideo(video)}
          onSuggestIdea={scrollToCommunity}
        />

        {/* Mods & Shaders Vault Section */}
        <ModVaultSection
          mods={mods}
          onDownloadMod={handleDownloadMod}
        />

        {/* Community Lounge & Discussions */}
        <CommunitySection
          channel={channel}
          posts={communityPosts}
          onAddPost={handleAddPost}
          onAddReply={handleAddReply}
          onToggleLikePost={handleToggleLikePost}
          onToggleLikeReply={handleToggleLikeReply}
          onTogglePinPost={handleTogglePinPost}
        />

        {/* Server & Updates Section */}
        <UpdatesSection
          channel={channel}
          updates={INITIAL_UPDATES}
        />

      </main>

      {/* Quiet Footer */}
      <Footer
        channel={channel}
        onNavigateTab={setActiveTab}
      />

      {/* Video Modal Player (Dedicated to Zenvroplayz with 0 third-party embeds) */}
      <VideoModal
        video={playingVideo}
        channel={channel}
        onClose={() => setPlayingVideo(null)}
      />

    </div>
  );
}
