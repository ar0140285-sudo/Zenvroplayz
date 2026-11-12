import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { CommunityPost, CommunityReply } from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/initialData';

const COLLECTION_NAME = 'community_posts';

/**
 * Real-time listener for community posts from cloud Firestore
 */
export function subscribeToCommunityPosts(
  onUpdate: (posts: CommunityPost[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    // Order by createdAt or fallback
    const q = query(postsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed with the welcome post
          seedInitialPost();
          onUpdate(INITIAL_COMMUNITY_POSTS);
          return;
        }

        const cloudPosts: CommunityPost[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          cloudPosts.push({
            id: docSnap.id,
            authorName: data.authorName || 'Viewer',
            authorHandle: data.authorHandle || '@viewer',
            authorAvatar: data.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=viewer',
            isCreator: Boolean(data.isCreator),
            isPinned: Boolean(data.isPinned),
            category: data.category || 'General',
            title: data.title || '',
            content: data.content || '',
            timestamp: data.timestamp || 'Just now',
            likes: typeof data.likes === 'number' ? data.likes : 0,
            hasLiked: false,
            replies: Array.isArray(data.replies) ? data.replies : []
          });
        });

        // Sort pinned posts first, then newest first
        cloudPosts.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return 0;
        });

        onUpdate(cloudPosts);
      },
      (error) => {
        console.error("Firestore onSnapshot error:", error);
        if (onError) onError(error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error("Failed to subscribe to Firestore:", err);
    return () => {};
  }
}

/**
 * Seeds the welcome post into cloud Firestore on first launch
 */
async function seedInitialPost() {
  try {
    const welcome = INITIAL_COMMUNITY_POSTS[0];
    if (!welcome) return;
    const postRef = doc(db, COLLECTION_NAME, welcome.id);
    await setDoc(postRef, {
      ...welcome,
      createdAt: Date.now()
    });
  } catch (err) {
    console.warn("Could not seed initial post to Firestore:", err);
  }
}

/**
 * Publish a new community post to cloud Firestore
 */
export async function publishPostToCloud(
  newPost: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>
): Promise<string> {
  const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const postRef = doc(db, COLLECTION_NAME, postId);

  const payload = {
    ...newPost,
    timestamp: 'Just now',
    createdAt: Date.now(),
    likes: 1,
    replies: []
  };

  await setDoc(postRef, payload);
  return postId;
}

/**
 * Add a reply to a post in cloud Firestore
 */
export async function addReplyToCloud(
  postId: string,
  existingReplies: CommunityReply[],
  newReply: Omit<CommunityReply, 'id' | 'timestamp' | 'likes'>
) {
  const reply: CommunityReply = {
    ...newReply,
    id: `reply_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: 'Just now',
    likes: 0
  };

  const postRef = doc(db, COLLECTION_NAME, postId);
  await updateDoc(postRef, {
    replies: [...existingReplies, reply]
  });
}

/**
 * Toggle like count on a post in cloud Firestore
 */
export async function togglePostLikeInCloud(
  postId: string,
  newLikesCount: number
) {
  const postRef = doc(db, COLLECTION_NAME, postId);
  await updateDoc(postRef, {
    likes: newLikesCount
  });
}

/**
 * Toggle reply like in cloud Firestore
 */
export async function toggleReplyLikeInCloud(
  postId: string,
  updatedReplies: CommunityReply[]
) {
  const postRef = doc(db, COLLECTION_NAME, postId);
  await updateDoc(postRef, {
    replies: updatedReplies
  });
}

/**
 * Toggle pin state in cloud Firestore
 */
export async function togglePostPinInCloud(
  postId: string,
  newPinnedState: boolean
) {
  const postRef = doc(db, COLLECTION_NAME, postId);
  await updateDoc(postRef, {
    isPinned: newPinnedState
  });
}
