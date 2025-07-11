"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import type { UserProfile } from "@/lib/database-types"

type UserProfileContextType = {
  profile: UserProfile | null
  isLoading: boolean
  isLiked: (artifactId: string) => boolean
  toggleLike: (artifactId: string) => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) return
    try {
      setIsLoading(true)
      const response = await fetch("/api/user/profile")
      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }
      const data = await response.json()
      setProfile(data)
    } catch (error) {
      console.error("Error fetching profile:", error)
      toast({
        title: "Error",
        description: "Could not load your user profile.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [user, toast])

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfile()
    } else {
      setIsLoading(false)
      setProfile(null)
    }
  }, [isAuthenticated, user, fetchProfile])

  const isLiked = (artifactId: string) => {
    return profile?.liked_artifacts?.includes(artifactId) ?? false
  }

  const toggleLike = async (artifactId: string) => {
    if (!profile) return

    const oldProfile = { ...profile }
    const currentlyLiked = isLiked(artifactId)
    const newLikes = currentlyLiked
      ? (profile.liked_artifacts ?? []).filter((id) => id !== artifactId)
      : [...(profile.liked_artifacts ?? []), artifactId]

    // Optimistic update
    setProfile({ ...profile, liked_artifacts: newLikes })

    try {
      const response = await fetch("/api/user/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artifactId }),
      })

      if (!response.ok) {
        throw new Error("Failed to update like status")
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      // Revert optimistic update
      setProfile(oldProfile)
      toast({
        title: "Error",
        description: "Could not save your preference. Please try again.",
        variant: "destructive",
      })
    }
  }

  const value = { profile, isLoading, isLiked, toggleLike }

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
}

export function useUserProfile() {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
