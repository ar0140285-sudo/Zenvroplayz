import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { CommunityPost, CommunityReply } from '../types';
import { INITIAL_COMMUNITY_POSTS } from '../data/initialData';

const COLLECTION_NAME = 'community_posts';

// 35 days in milliseconds (35 * 24 * 60 * 60 * 1000 = 3024000000 ms)
export const THIRTY_FIVE_DAYS_MS = 35 * 24 * 60 * 60 * 1000;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Returns remaining whole days before an unpinned message expires (0-35)
 */
export function getDaysRemaining(createdAt?: number): number {
  if (typeof createdAt !== 'number') return 35;
  const elapsed = Date.now() - createdAt;
  const remainingMs = Math.max(0, THIRTY_FIVE_DAYS_MS - elapsed);
  return Math.max(1, Math.ceil(remainingMs / (24 * 60 * 60 * 1000)));
}

/**
 * Formats createdAt epoch ms into clean relative time string
 */
export function formatRelativeTime(createdAt?: number, fallback?: string): string {
  if (typeof createdAt !== 'number') return fallback || 'Just now';
  const diffMs = Math.max(0, Date.now() - createdAt);
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return '1d ago';
  return `${days}d ago`;
}

/**
 * Real-time listener for community posts from cloud Firestore.
 * Automatically filters out and deletes unpinned posts older than 35 days.
 * Pinned posts (isPinned === true) are NEVER deleted.
 */
export function subscribeToCommunityPosts(
  onUpdate: (posts: CommunityPost[]) => void,
  onError?: (err: unknown) => void
) {
  try {
    const postsRef = collection(db, COLLECTION_NAME);
    const q = query(postsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          seedInitialPost();
          onUpdate(
            INITIAL_COMMUNITY_POSTS.map((p) => ({
              ...p,
              createdAt: p.createdAt ?? Date.now(),
            }))
          );
          return;
        }

        const now = Date.now();
        const cloudPosts: CommunityPost[] = [];

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const isPinned = Boolean(data.isPinned);
          const createdAt = typeof data.createdAt === 'number' ? data.createdAt : undefined;

          // 35-Day Auto-Delete Rule: Only delete UNPINNED messages older than 35 days
          if (!isPinned && createdAt !== undefined && now - createdAt >= THIRTY_FIVE_DAYS_MS) {
            deleteDoc(doc(db, COLLECTION_NAME, docSnap.id)).catch((delErr) => {
              console.warn(`Failed to auto-delete expired post ${docSnap.id}:`, delErr);
            });
            return;
          }

          cloudPosts.push({
            id: docSnap.id,
            authorName: data.authorName || 'Viewer',
            authorHandle: data.authorHandle || '@viewer',
            authorAvatar:
              data.authorAvatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=viewer',
            isCreator: Boolean(data.isCreator),
            isPinned,
            category: data.category || 'General',
            title: data.title || '',
            content: data.content || '',
            timestamp: isPinned
              ? data.timestamp || 'Pinned Message'
              : formatRelativeTime(createdAt, data.timestamp),
            createdAt: createdAt ?? now,
            likes: typeof data.likes === 'number' ? data.likes : 0,
            hasLiked: false,
            replies: Array.isArray(data.replies) ? data.replies : [],
          });
        });

        // Sort pinned posts first, then newest posts descending
        cloudPosts.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return (b.createdAt || 0) - (a.createdAt || 0);
        });

        onUpdate(cloudPosts);
      },
      (error) => {
        if (onError) onError(error);
        try {
          handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
        } catch {
          // Already logged inside handleFirestoreError
        }
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to Firestore:', err);
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
      createdAt: Date.now(),
    });
  } catch (err) {
    console.warn('Could not seed initial post to Firestore:', err);
  }
}

/**
 * Publish a new community post to cloud Firestore
 */
export async function publishPostToCloud(
  newPost: Omit<CommunityPost, 'id' | 'timestamp' | 'likes' | 'replies'>
): Promise<string> {
  const postId = `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const path = `${COLLECTION_NAME}/${postId}`;
  const postRef = doc(db, COLLECTION_NAME, postId);

  const payload = {
    ...newPost,
    timestamp: 'Just now',
    createdAt: Date.now(),
    likes: 1,
    replies: [],
  };

  try {
    await setDoc(postRef, payload);
    return postId;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
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
    likes: 0,
  };

  const path = `${COLLECTION_NAME}/${postId}`;
  const postRef = doc(db, COLLECTION_NAME, postId);
  try {
    await updateDoc(postRef, {
      replies: [...existingReplies, reply],
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Toggle like count on a post in cloud Firestore
 */
export async function togglePostLikeInCloud(postId: string, newLikesCount: number) {
  const path = `${COLLECTION_NAME}/${postId}`;
  const postRef = doc(db, COLLECTION_NAME, postId);
  try {
    await updateDoc(postRef, {
      likes: newLikesCount,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Toggle reply like in cloud Firestore
 */
export async function toggleReplyLikeInCloud(
  postId: string,
  updatedReplies: CommunityReply[]
) {
  const path = `${COLLECTION_NAME}/${postId}`;
  const postRef = doc(db, COLLECTION_NAME, postId);
  try {
    await updateDoc(postRef, {
      replies: updatedReplies,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Toggle pin state in cloud Firestore
 */
export async function togglePostPinInCloud(postId: string, newPinnedState: boolean) {
  const path = `${COLLECTION_NAME}/${postId}`;
  const postRef = doc(db, COLLECTION_NAME, postId);
  try {
    await updateDoc(postRef, {
      isPinned: newPinnedState,
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}
