"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { AuthSession, User } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"

type AuthContextType = {
  user: User | null
  session: AuthSession | null
  isAuthenticated: boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const getSessionAndListen = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false) // Also set loading to false on auth state change
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getSessionAndListen()
  }, [])

  // Restore redirection logic
  useEffect(() => {
    if (isLoading) return
    const isAuthPage = pathname === "/login" || pathname === "/brand/ritual-onboarding"

    if (!user && !isAuthPage) {
      router.push("/login")
    } else if (user && isAuthPage) {
      router.push("/")
    }
  }, [user, pathname, isLoading, router])

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
