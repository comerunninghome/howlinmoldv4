import { ProtectedRoute } from "@/components/protected-route"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { ExclusiveContentEngine } from "@/components/marketing/exclusive-content-engine"
import { KeepersOfGenesis } from "@/components/community/keepers-of-genesis"
import { MythicText } from "@/components/brand/mythic-brand-system"

function ExclusivesPage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <MythicText variant="hero" className="text-transparent text-gradient-primary mb-6">
              THE INNER SANCTUM
            </MythicText>
            <MythicText variant="body" className="text-foreground/80 max-w-3xl mx-auto text-lg">
              Access time-limited rituals, claim mythic sigils, and secure rare artifacts. These transmissions are
              fleeting. Only the vigilant will be rewarded.
            </MythicText>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <ExclusiveContentEngine />
            </div>

            <div className="lg:col-span-1">
              <KeepersOfGenesis />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ExclusivesPage />
    </ProtectedRoute>
  )
}
