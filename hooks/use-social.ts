"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"

interface Friend {
  id: string
  userId: string
  friendId: string
  status: string
  friendProfile: any
  mutualFriends?: number
  sharedInterests?: string[]
}

interface FriendRequest {
  id: string
  fromUserId: string
  toUserId: string
  message?: string
  status: string
  fromProfile?: any
  toProfile?: any
}

interface SocialActivity {
  id: string
  userId: string
  type: string
  data: any
  isPublic: boolean
  createdAt: string
  likes: number
  comments: number
  isLiked?: boolean
  userProfile?: any
}

export function useSocial() {
  const { user } = useAuth()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<{
    incoming: FriendRequest[]
    outgoing: FriendRequest[]
  }>({ incoming: [], outgoing: [] })
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [activities, setActivities] = useState<SocialActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchFriends = useCallback(async () => {
    if (!user?.id) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/social/friends?userId=${user.id}&type=friends`)
      if (!response.ok) throw new Error("Failed to fetch friends")

      const data = await response.json()
      setFriends(data.friends || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch friends")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  const fetchFriendRequests = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/social/friends?userId=${user.id}&type=requests`)
      if (!response.ok) throw new Error("Failed to fetch friend requests")

      const data = await response.json()
      setFriendRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch friend requests")
    }
  }, [user?.id])

  const fetchSuggestions = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/social/friends?userId=${user.id}&type=suggestions`)
      if (!response.ok) throw new Error("Failed to fetch suggestions")

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch suggestions")
    }
  }, [user?.id])

  const fetchActivityFeed = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/social/activity?userId=${user.id}&type=feed`)
      if (!response.ok) throw new Error("Failed to fetch activity feed")

      const data = await response.json()
      setActivities(data.activities || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch activity feed")
    }
  }, [user?.id])

  const sendFriendRequest = useCallback(
    async (targetUserId: string, message?: string) => {
      if (!user?.id) return false

      try {
        const response = await fetch(`/api/social/friends?userId=${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "send_request",
            targetUserId,
            message,
          }),
        })

        if (!response.ok) throw new Error("Failed to send friend request")

        await fetchSuggestions() // Refresh suggestions
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to send friend request")
        return false
      }
    },
    [user?.id, fetchSuggestions],
  )

  const respondToFriendRequest = useCallback(
    async (fromUserId: string, action: "accept" | "decline") => {
      if (!user?.id) return false

      try {
        const response = await fetch(`/api/social/friends?userId=${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: action === "accept" ? "accept_request" : "decline_request",
            targetUserId: fromUserId,
          }),
        })

        if (!response.ok) throw new Error(`Failed to ${action} friend request`)

        await fetchFriendRequests()
        if (action === "accept") {
          await fetchFriends()
        }
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : `Failed to ${action} friend request`)
        return false
      }
    },
    [user?.id, fetchFriendRequests, fetchFriends],
  )

  const removeFriend = useCallback(
    async (friendId: string) => {
      if (!user?.id) return false

      try {
        const response = await fetch(`/api/social/friends?userId=${user.id}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "remove_friend",
            targetUserId: friendId,
          }),
        })

        if (!response.ok) throw new Error("Failed to remove friend")

        await fetchFriends()
        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to remove friend")
        return false
      }
    },
    [user?.id, fetchFriends],
  )

  const likeActivity = useCallback(
    async (activityId: string) => {
      try {
        const response = await fetch("/api/social/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "like",
            activityId,
            userId: user?.id,
          }),
        })

        if (!response.ok) throw new Error("Failed to like activity")

        const data = await response.json()

        // Update local state
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === activityId ? { ...activity, isLiked: data.isLiked, likes: data.likes } : activity,
          ),
        )

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to like activity")
        return false
      }
    },
    [user?.id],
  )

  const commentOnActivity = useCallback(
    async (activityId: string, content: string) => {
      try {
        const response = await fetch("/api/social/activity", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "comment",
            activityId,
            userId: user?.id,
            content,
          }),
        })

        if (!response.ok) throw new Error("Failed to comment on activity")

        // Update local state
        setActivities((prev) =>
          prev.map((activity) =>
            activity.id === activityId ? { ...activity, comments: activity.comments + 1 } : activity,
          ),
        )

        return true
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to comment on activity")
        return false
      }
    },
    [user?.id],
  )

  const shareProfile = useCallback(
    async (shareType: string, shareData: any, expiresIn?: number) => {
      try {
        const response = await fetch("/api/social/share", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user?.id,
            shareType,
            shareData,
            expiresIn,
          }),
        })

        if (!response.ok) throw new Error("Failed to create share")

        const data = await response.json()
        return data.share
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create share")
        return null
      }
    },
    [user?.id],
  )

  useEffect(() => {
    if (user?.id) {
      fetchFriends()
      fetchFriendRequests()
      fetchSuggestions()
      fetchActivityFeed()
    }
  }, [user?.id, fetchFriends, fetchFriendRequests, fetchSuggestions, fetchActivityFeed])

  return {
    friends,
    friendRequests,
    suggestions,
    activities,
    isLoading,
    error,
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    likeActivity,
    commentOnActivity,
    shareProfile,
    refetch: {
      friends: fetchFriends,
      requests: fetchFriendRequests,
      suggestions: fetchSuggestions,
      activities: fetchActivityFeed,
    },
  }
}
