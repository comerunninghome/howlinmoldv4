"use client"

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import type { Profile } from "@/lib/types"

type UserProfileContextType = {
  profile: Profile | null
  isLoading: boolean
  refetchProfile: () => void
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error) {
        console.error("Error fetching profile:", error.message)
        setProfile(null)
      } else {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
      setProfile(null)
    } finally {
      setIsLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!isAuthLoading) {
      fetchProfile()
    }
  }, [user, isAuthLoading, fetchProfile])

  const value = {
    profile,
    isLoading: isAuthLoading || isLoading,
    refetchProfile: fetchProfile,
  }

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>
}

export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext)
  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider")
  }
  return context
}
