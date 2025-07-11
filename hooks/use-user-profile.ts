"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase/client"
import type { UserProfile, Ritual, Artifact } from "@/lib/database-types"

export interface FullUserProfile {
  profile: UserProfile
  rituals: Ritual[]
  artifacts: Artifact[]
  stats: {
    totalPlayTimeHours: number
    favorite_genres: string[]
    memberSince: string
  }
}

export function useUserProfile() {
  const { user } = useAuth()
  const [data, setData] = useState<FullUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // In a production app, this would be a single RPC call for performance.
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (profileError && profileError.code !== "PGRST116") {
        // PGRST116 means "exact one row not found", which is okay for new users.
        throw new Error(profileError.message)
      }

      // If no profile exists, create a default one.
      if (!profileData) {
        const { data: newProfileData, error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, username: user.email?.split("@")[0] })
          .select()
          .single()
        if (insertError) throw insertError
        // Use the newly created profile
        Object.assign(profileData, newProfileData)
      }

      // Mock data for demonstration purposes. Replace with actual fetches.
      const ritualsData: Ritual[] = [
        {
          id: "ritual-1",
          name: "First Resonance",
          description: "An introductory journey into the sonic ether.",
          resonanceGained: 150,
          mood: "Contemplative",
          intention: "Discovery",
          duration: 1800,
          completedAt: new Date().toISOString(),
          artifactIds: ["artifact-101", "artifact-102"],
          sigilOverlays: ["Alpha Wave", "Theta Sync"],
        },
      ]
      const artifactsData: Artifact[] = [
        {
          id: "artifact-1",
          artifactId: "HM-001",
          acquiredAt: new Date().toISOString(),
          notes: "Found during a deep listening session.",
          playCount: 42,
          rating: 5,
        },
        {
          id: "artifact-2",
          artifactId: "HM-007",
          acquiredAt: new Date().toISOString(),
          notes: "A gift from another seeker.",
          playCount: 12,
          rating: 4,
        },
      ]

      const stats = {
        totalPlayTimeHours: Math.floor(Math.random() * 100),
        favorite_genres: profileData.favorite_genres || ["N/A"],
        memberSince: profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : "Just Now",
      }

      setData({
        profile: profileData,
        rituals: ritualsData,
        artifacts: artifactsData,
        stats: stats,
      })
    } catch (err: any) {
      setError(err.message)
      console.error("Error fetching user profile:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setIsLoading(false)
    }
  }, [user, fetchProfile])

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) {
        console.error("No user session found to update profile.")
        return false
      }

      try {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", user.id)

        if (updateError) throw updateError

        await fetchProfile() // Refetch data to show updated profile
        return true
      } catch (err: any) {
        console.error("Error updating profile:", err)
        setError(err.message)
        return false
      }
    },
    [user, fetchProfile],
  )

  return { data, isLoading, error, refetch: fetchProfile, updateProfile }
}
