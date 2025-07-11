"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { FriendsList } from "@/components/social/friends-list"

function SocialPage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 sacred-text text-transparent text-gradient-primary">SOCIAL NEXUS</h1>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-poetic text-lg">
              Connect with fellow sonic archaeologists. Share discoveries, build friendships, and explore the mystical
              realm together.
            </p>
          </div>

          <FriendsList />
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <SocialPage />
    </ProtectedRoute>
  )
}
