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
import { MobileBottomNav } from './components/MobileBottomNav';
import { 
  INITIAL_CHANNEL_PROFILE, 
  INITIAL_VIDEOS, 
  INITIAL_MODS, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_UPDATES 
} from './data/initialData';
import { ChannelProfile, VideoItem, ModItem, CommunityPost, CommunityReply } from './types';
import { soundManager } from './utils/sound';
import { testFirestoreConnection } from './firebase';
import { 
  subscribeToCommunityPosts, 
  publishPostToCloud, 
  addReplyToCloud, 
  togglePostLikeInCloud, 
  toggleReplyLikeInCloud,
  togglePostPinInCloud 
} from './services/communityService';

export default function App() {
  // Channel Profile is permanently fixed to Zenvroplayz
  const channel: ChannelProfile = INITIAL_CHANNEL_PROFILE;

  // Videos State
  const [videos] = useState<VideoItem[]>(INITIAL_VIDEOS);

  // Mods State (with persistent download counts)
  const [mods, setMods] = useState<ModItem[]>(() => {
    const saved = localStorage.getItem('zenvro_mods_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_MODS;
      }
    }
    return INITIAL_MODS;
  });

  const totalDownloads = mods.reduce((sum, m) => sum + m.downloads, 0);

  // Community Posts State: Synchronized with Cloud Firestore
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'videos' | 'mods' | 'community' | 'updates'>('videos');

  // Video Player Modal
  const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);

  // Sound SFX Mute State
  const [isMuted, setIsMuted] = useState<boolean>(() => soundManager.getIsMuted());

  // Connect to Cloud Firestore on boot
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to real-time live community updates across the internet
    const unsubscribe = subscribeToCommunityPosts((cloudPosts) => {
      setCommunityPosts(cloudPosts);
    });

    return () => unsubscribe();
  }, []);

  // Synchronize mods to localStorage
  useEffect(() => {
    localStorage.setItem('zenvro_mods_v3', JSON.stringify(mods));
  }, [mods]);

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

  const handleAddPost = async (newPostData: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>) => {
    // Optimistic UI update
    const tempId = `temp_${Date.now()}`;
    const optimisticPost: CommunityPost = {
      ...newPostData,
      id: tempId,
      timestamp: 'Just now',
      likes: 1,
      hasLiked: true,
      replies: []
    };
    setCommunityPosts(prev => [optimisticPost, ...prev]);

    // Send to Cloud Firestore
    try {
      await publishPostToCloud(newPostData);
    } catch (err) {
      console.warn("Could not sync to cloud, stored locally:", err);
    }
  };

  const handleAddReply = async (postId: string, replyData: Omit<CommunityReply, 'id' | 'timestamp' | 'likes'>) => {
    const targetPost = communityPosts.find(p => p.id === postId);
    if (!targetPost) return;

    // Optimistic update
    const tempReply: CommunityReply = {
      ...replyData,
      id: `temp_reply_${Date.now()}`,
      timestamp: 'Just now',
      likes: 0
    };

    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            replies: [...post.replies, tempReply]
          };
        }
        return post;
      })
    );

    // Send to Cloud Firestore
    try {
      await addReplyToCloud(postId, targetPost.replies, replyData);
    } catch (err) {
      console.warn("Could not sync reply to cloud:", err);
    }
  };

  const handleToggleLikePost = async (postId: string) => {
    let newLikes = 0;
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          const isLiked = !post.hasLiked;
          newLikes = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);
          return {
            ...post,
            hasLiked: isLiked,
            likes: newLikes
          };
        }
        return post;
      })
    );

    try {
      await togglePostLikeInCloud(postId, newLikes);
    } catch (err) {
      console.warn("Could not update like in cloud:", err);
    }
  };

  const handleToggleLikeReply = async (postId: string, replyId: string) => {
    let updatedReplies: CommunityReply[] = [];
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          updatedReplies = post.replies.map(rep => {
            if (rep.id === replyId) {
              const isLiked = !rep.hasLiked;
              return {
                ...rep,
                hasLiked: isLiked,
                likes: isLiked ? rep.likes + 1 : Math.max(0, rep.likes - 1)
              };
            }
            return rep;
          });
          return {
            ...post,
            replies: updatedReplies
          };
        }
        return post;
      })
    );

    try {
      await toggleReplyLikeInCloud(postId, updatedReplies);
    } catch (err) {
      console.warn("Could not update reply like in cloud:", err);
    }
  };

  const handleTogglePinPost = async (postId: string) => {
    let newPinned = false;
    setCommunityPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          newPinned = !post.isPinned;
          return { ...post, isPinned: newPinned };
        }
        return post;
      })
    );

    try {
      await togglePostPinInCloud(postId, newPinned);
    } catch (err) {
      console.warn("Could not update pin in cloud:", err);
    }
  };

  const scrollToCommunity = () => {
    setActiveTab('community');
    const el = document.getElementById('community');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0b0f15] text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      
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
          totalDownloads={totalDownloads}
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

        {/* Community Lounge & Live Cloud Chat */}
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

      {/* Dedicated Video Modal Player */}
      <VideoModal
        video={playingVideo}
        channel={channel}
        onClose={() => setPlayingVideo(null)}
      />

      {/* Mobile-Only Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

    </div>
  );
}
