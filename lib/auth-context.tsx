"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { createSupabaseClient } from "@/lib/supabase/client"

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createSupabaseClient()

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setIsLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      setIsLoading(false)

      if (currentUser && pathname === "/login") {
        router.push("/")
      } else if (!currentUser && pathname !== "/login") {
        router.push("/login")
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [supabase.auth, pathname, router])

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setIsLoading(false)

      if (error) {
        console.error("Login error:", error.message)
        return false
      }
      return true
    },
    [supabase.auth],
  )

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push("/login")
  }, [router, supabase.auth])

  useEffect(() => {
    if (!isLoading && !user && pathname !== "/login") {
      router.push("/login")
    }
  }, [user, isLoading, pathname, router])

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
