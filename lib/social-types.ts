export interface Friend {
  id: string
  userId: string
  friendId: string
  status: "pending" | "accepted" | "blocked"
  createdAt: string
  acceptedAt?: string
  mutualFriends?: number
  sharedInterests?: string[]
}

export interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  message?: string
  status: "pending" | "accepted" | "declined"
  createdAt: string
  respondedAt?: string
}

export interface UserSocial {
  id: string
  userId: string
  displayName: string
  bio?: string
  avatar?: string
  isPublic: boolean
  allowFriendRequests: boolean
  showActivity: boolean
  showArtifacts: boolean
  showRituals: boolean
  socialLinks?: {
    soundcloud?: string
    bandcamp?: string
    spotify?: string
    instagram?: string
  }
  stats: {
    friendsCount: number
    followersCount: number
    followingCount: number
  }
}

export interface SocialActivity {
  id: string
  userId: string
  type: "ritual_completed" | "artifact_acquired" | "achievement_unlocked" | "tier_advanced" | "friend_added"
  data: any
  isPublic: boolean
  createdAt: string
  likes: number
  comments: number
  isLiked?: boolean
}

export interface SocialComment {
  id: string
  activityId: string
  userId: string
  content: string
  createdAt: string
  likes: number
  isLiked?: boolean
}

export interface ProfileShare {
  id: string
  userId: string
  shareType: "profile" | "ritual" | "artifact" | "achievement"
  shareData: any
  shareUrl: string
  expiresAt?: string
  viewCount: number
  createdAt: string
}
