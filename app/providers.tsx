"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

// Providers
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { UserProfileProvider } from "@/contexts/user-profile-context"

// UI Components
import { Toaster } from "@/components/ui/sonner"
import { ResponsiveIndicator } from "@/components/debug/responsive-indicator"
import { EnhancedNavigation } from "@/components/navigation/enhanced-navigation"
import { GlobalPlayer } from "@/components/simple-mode/global-player"

// Correctly load components with default exports using next/dynamic
const SoundProvider = dynamic(() => import("@/contexts/sound-context"), { ssr: false })
const AudioPlayerProvider = dynamic(() => import("@/contexts/audio-player-context"), { ssr: false })

/**
 * This internal component contains the actual layout logic.
 */
function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/brand/ritual-onboarding"

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {!isAuthPage && isAuthenticated && <EnhancedNavigation />}
      <main className="flex-grow">{children}</main>
      {isAuthenticated && <GlobalPlayer />}
      <Toaster />
      <ResponsiveIndicator />
    </div>
  )
}

/**
 * This is the main providers component that wraps the entire application.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <UserProfileProvider>
          <SoundProvider>
            <AudioPlayerProvider>
              <AppLayout>{children}</AppLayout>
            </AudioPlayerProvider>
          </SoundProvider>
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
