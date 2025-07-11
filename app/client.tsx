"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { SoundProvider } from "@/contexts/sound-context"
import { AudioPlayerProvider } from "@/contexts/audio-player-context"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { Toaster } from "@/components/ui/toaster"
import { ResponsiveIndicator } from "@/components/debug/responsive-indicator"
import { ErrorBoundary } from "@/components/debug/error-boundary"
import { AppThemeSwitcherInitializer } from "@/components/theme-selector/app-theme-switcher-initializer"
import { PageTransitionSound } from "@/components/sound/page-transition-sound"
import { GlobalPlayer } from "@/components/simple-mode/global-player"
import { UserProfileProvider } from "@/contexts/user-profile-context"

function AppContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const pathname = usePathname()

  const showNav = isAuthenticated && !["/login", "/brand/ritual-onboarding"].includes(pathname)
  const showPlayer = isAuthenticated && pathname.startsWith("/simple-mode")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-primary animate-pulse font-orbitron">Loading Spore Network...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppThemeSwitcherInitializer />
      <PageTransitionSound />
      {showNav && <EnhancedNavigation />}
      <main className="flex-grow">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      {showPlayer && <GlobalPlayer />}
      <Toaster />
      <ResponsiveIndicator />
    </div>
  )
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <AuthProvider>
        <UserProfileProvider>
          <SoundProvider>
            <AudioPlayerProvider>
              <AppContent>{children}</AppContent>
            </AudioPlayerProvider>
          </SoundProvider>
        </UserProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
