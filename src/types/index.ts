export interface VideoItem {
  id: string;
  title: string;
  series: 'Hardcore Survival' | '100 Days Challenge' | 'Modded SMP' | 'Building & Redstone' | 'Shorts & Clips';
  thumbnailUrl: string;
  youtubeId: string; // real YouTube video ID or demo embed
  duration: string;
  views: string;
  uploadDate: string;
  description: string;
  featured?: boolean;
}

export interface ModItem {
  id: string;
  name: string;
  tagline: string;
  version: string;
  mcVersion: string; // e.g. 1.20.4, 1.21
  loader: 'Fabric' | 'Forge' | 'NeoForge' | 'Datapack';
  downloads: number;
  rating: number;
  fileSize: string;
  imageUrl: string;
  description: string;
  features: string[];
  installGuide: string;
  downloadUrl: string;
  changelog: { version: string; date: string; changes: string[] }[];
}

export interface CommunityReply {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCreator?: boolean;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  isCreator?: boolean;
  isPinned?: boolean;
  category: 'General' | 'Mod Ideas' | 'SMP Server' | 'Fan Art' | 'Video Feedback';
  title: string;
  content: string;
  attachmentUrl?: string;
  timestamp: string;
  createdAt?: number;
  likes: number;
  hasLiked?: boolean;
  replies: CommunityReply[];
}

export interface ChannelProfile {
  name: string;
  handle: string;
  subscribers: string;
  videoCount: number;
  totalViews: string;
  serverIp: string;
  serverVersion: string;
  discordUrl: string;
  youtubeUrl: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
}

export interface UpdateItem {
  id: string;
  title: string;
  date: string;
  type: 'SERVER_UPDATE' | 'MOD_RELEASE' | 'STREAM_ANNOUNCEMENT' | 'MILESTONE';
  summary: string;
  details: string[];
  versionTag?: string;
}
