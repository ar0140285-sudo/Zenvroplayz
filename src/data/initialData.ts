import { ChannelProfile, VideoItem, ModItem, CommunityPost, UpdateItem } from '../types';

export const INITIAL_CHANNEL_PROFILE: ChannelProfile = {
  name: "Zenvroplayz",
  handle: "@zenvroplayz",
  subscribers: "50K+",
  videoCount: 86,
  totalViews: "4.8M",
  serverIp: "play.zenvroplayz.net",
  serverVersion: "1.21.1 Java & Bedrock",
  discordUrl: "https://discord.gg/zenvroplayz",
  youtubeUrl: "https://youtube.com/@zenvroplayz",
  avatarUrl: "/src/assets/images/minecraft_channel_avatar_1794487063805.jpg",
  bannerUrl: "/src/assets/images/hero_minecraft_epic_1794487062764.jpg",
  bio: "Welcome to the official Zenvroplayz Gaming Hub! Yaha pe Minecraft ke daily hardcore adventures, custom modpacks, SMP updates aur gaming videos milenge. Subscribe karo aur community join karo!",
};

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: "vid-1",
    title: "100 DAYS In Ancient Nether Fortress (Hardcore Minecraft Adventure)",
    series: "100 Days Challenge",
    thumbnailUrl: "/src/assets/images/minecraft_survival_thumb_1794487063551.jpg",
    youtubeId: "zenvro-ep-101",
    duration: "32:15",
    views: "145K views",
    uploadDate: "Recently Uploaded",
    featured: true,
    description: "Hardcore mode me Nether ke deepest fortress chambers me 100 days survive kiya! Custom Wither skeletons aur no shield challenge!"
  },
  {
    id: "vid-2",
    title: "Testing Insane Custom RPG Modpack in Minecraft 1.21 (Enchanted Biomes)",
    series: "Modded SMP",
    thumbnailUrl: "/src/assets/images/minecraft_mod_showcase_1794487063339.jpg",
    youtubeId: "zenvro-ep-102",
    duration: "21:40",
    views: "98K views",
    uploadDate: "3 days ago",
    featured: false,
    description: "Zenvroplayz custom RPG modpack testing! 20+ mythical weapons, ancient rune altars aur magical dungeons showcase!"
  },
  {
    id: "vid-3",
    title: "Building A Mega Emerald Fortress in Minecraft Survival",
    series: "Hardcore Survival",
    thumbnailUrl: "/src/assets/images/hero_minecraft_epic_1794487062764.jpg",
    youtubeId: "zenvro-ep-103",
    duration: "26:10",
    views: "112K views",
    uploadDate: "1 week ago",
    featured: false,
    description: "Emerald blocks aur chiseled deepslate se banaya sabse bada kingdom fortress with automated defense traps!"
  },
  {
    id: "vid-4",
    title: "Top 10 Secret Redstone Defense Traps That Actually Work",
    series: "Building & Redstone",
    thumbnailUrl: "/src/assets/images/minecraft_survival_thumb_1794487063551.jpg",
    youtubeId: "zenvro-ep-104",
    duration: "17:25",
    views: "64K views",
    uploadDate: "2 weeks ago",
    featured: false,
    description: "In undetectable traps se koi bhi intruder aapke base ke chest room tak nahi pahuch sakta. Full easy tutorial!"
  },
  {
    id: "vid-5",
    title: "Minecraft 1.21 Tricky Trials: Testing Every Single Mace Enchantment",
    series: "Hardcore Survival",
    thumbnailUrl: "/src/assets/images/minecraft_mod_showcase_1794487063339.jpg",
    youtubeId: "zenvro-ep-105",
    duration: "14:50",
    views: "89K views",
    uploadDate: "3 weeks ago",
    featured: false,
    description: "Wind Burst + Density mace testing against Wardens and boss mobs! Results are unbelievable!"
  }
];

export const INITIAL_MODS: ModItem[] = [
  {
    id: "mod-1",
    name: "Zenvro Runecraft RPG",
    tagline: "Overhauls weapon enchanting with mythical runes, elemental spells, and glowing runes.",
    version: "v2.4.1",
    mcVersion: "1.21.1",
    loader: "Fabric",
    downloads: 14850,
    rating: 4.9,
    fileSize: "14.2 MB",
    imageUrl: "/src/assets/images/minecraft_mod_showcase_1794487063339.jpg",
    description: "Custom combat and magic overhaul adding 24 runic spells, elemental infusions (Thunder, Frost, Netherfire), and animated combat mechanics.",
    features: [
      "24 Unique Craftable Runic Tablets",
      "Dynamic Particle Aura on Netherite Weapons",
      "Boss Enchantment Altar in Ancient Cities",
      "Full Server Multiplayer Compatibility"
    ],
    installGuide: "Place the downloaded package inside your `.minecraft/mods` folder. Requires Fabric API 0.98+ and Java 21.",
    downloadUrl: "https://zenvroplayz.net/downloads/ZenvroRunecraft-1.21.1.jar",
    changelog: [
      {
        version: "v2.4.1",
        date: "Latest Release",
        changes: ["Fixed rune duplication glitch with hoppers", "Buffed Frost Nova freeze duration", "Added Hindi / English tooltips"]
      }
    ]
  },
  {
    id: "mod-2",
    name: "Zenvro Horizon Shaders (Ultra Low-Lag)",
    tagline: "Ray-traced water reflections and soft voxel godrays optimized for 60+ FPS.",
    version: "v3.1",
    mcVersion: "1.20 - 1.21.x",
    loader: "Fabric",
    downloads: 32400,
    rating: 4.8,
    fileSize: "6.8 MB",
    imageUrl: "/src/assets/images/hero_minecraft_epic_1794487062764.jpg",
    description: "Custom shader preset used across Zenvroplayz YouTube videos! Delivers vibrant emerald grass colors, crisp volumetric clouds, and smooth lighting without lag.",
    features: [
      "Custom Emerald & Gold lighting presets",
      "Supports Iris Shaders and OptiFine",
      "Dynamic hand-held item glow (Torches, Glowberries)",
      "Zero screen-space jitter on budget GPUs"
    ],
    installGuide: "Drop into your `.minecraft/shaderpacks` directory. Select it under Video Settings -> Shader Packs.",
    downloadUrl: "https://zenvroplayz.net/downloads/ZenvroHorizon_Shaders.zip",
    changelog: [
      {
        version: "v3.1",
        date: "Latest Release",
        changes: ["Water reflections enhanced", "Nether fog customization added", "15% performance boost on Iris"]
      }
    ]
  },
  {
    id: "mod-3",
    name: "Zenvro SMP Waystones & Graves",
    tagline: "Teleport between player bases and recover your lost items without breaking balance.",
    version: "v1.8.2",
    mcVersion: "1.21",
    loader: "NeoForge",
    downloads: 18200,
    rating: 4.7,
    fileSize: "3.5 MB",
    imageUrl: "/src/assets/images/minecraft_survival_thumb_1794487063551.jpg",
    description: "The mod we run on our viewer SMP server! Craft waystones using obsidian and ender pearls, and activate warp anchors.",
    features: [
      "XP-cost teleport balance system",
      "Grave totem preserves items on defeat",
      "Custom sound effects when teleporting",
      "Full server administration commands"
    ],
    installGuide: "Drop into `.minecraft/mods`. Compatible with NeoForge & Forge 1.21.",
    downloadUrl: "https://zenvroplayz.net/downloads/ZenvroSMPWaystones-1.21.jar",
    changelog: [
      {
        version: "v1.8.2",
        date: "Latest Release",
        changes: ["Prevents mobs from camping teleport points", "Bedrock parity hooks added"]
      }
    ]
  }
];

// Clean initial community post from Zenvroplayz (no fake random users)
export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: "post-welcome",
    authorName: "Zenvroplayz",
    authorHandle: "@zenvroplayz",
    authorAvatar: "/src/assets/images/minecraft_channel_avatar_1794487063805.jpg",
    isCreator: true,
    isPinned: true,
    category: "General",
    title: "🔥 Welcome to the Official Zenvroplayz Community Lounge!",
    content: "Bhai log swagat hai! Yaha pe aap sabhi log apne Minecraft doubts, mod suggestions aur agle video ke ideas comment karke bata sakte ho. Sabhi ke comments yaha real time me dikhenge aur sab ek doosre ko reply de sakte hai!",
    timestamp: "Official Welcome Post",
    likes: 124,
    hasLiked: false,
    replies: []
  }
];

export const INITIAL_UPDATES: UpdateItem[] = [
  {
    id: "up-1",
    title: "Zenvroplayz Viewer SMP: Server IP Live for All Subscribers",
    date: "Current Season",
    type: "SERVER_UPDATE",
    versionTag: "SMP v3.0",
    summary: "Our official Java & Bedrock crossplay server is running with 128-tick hosting.",
    details: [
      "Server IP: play.zenvroplayz.net (Port: 25565 Java / 19132 Bedrock)",
      "Anti-grief land claiming enabled with gold shovel",
      "Custom Nether Hub connections and player trading town"
    ]
  },
  {
    id: "up-2",
    title: "Next YouTube Video Premiere Schedule",
    date: "Upcoming Drop",
    type: "STREAM_ANNOUNCEMENT",
    versionTag: "Premiere",
    summary: "New hardcore survival challenge episode is being edited and will premiere soon on YouTube.",
    details: [
      "Watch party with live chat discussion",
      "Modpack download link unlocks right after the premiere",
      "Subscribe on YouTube to get notified immediately"
    ]
  },
  {
    id: "up-3",
    title: "Zenvro Runecraft RPG Mod v2.4.1 Released",
    date: "Latest Patch",
    type: "MOD_RELEASE",
    versionTag: "v2.4.1",
    summary: "Updated for Minecraft 1.21.1 Tricky Trials with enchanted weapons and rune altars.",
    details: [
      "Enhanced spell particle performance",
      "Full changelog available in the Mods Vault tab"
    ]
  }
];
