import { ProtectedRoute } from "@/components/protected-route"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { BrandManifesto } from "@/components/brand/brand-manifesto"
import { SacredHierarchy } from "@/components/brand/sacred-hierarchy"
import { MythicText } from "@/components/brand/mythic-brand-system"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Crown, Scroll, Eye, Zap } from "lucide-react"

function BrandPage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <MythicText variant="hero" className="text-transparent text-gradient-primary mb-6">
              THE SACRED BRAND
            </MythicText>
            <MythicText variant="body" className="text-foreground/80 max-w-2xl mx-auto text-lg">
              Discover the mythic identity that transforms music consumption into spiritual archaeology. This is not a
              brand—it is a movement, a frequency, a way of being.
            </MythicText>
          </div>

          <Tabs defaultValue="manifesto" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border">
              <TabsTrigger
                value="manifesto"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Scroll className="w-4 h-4 mr-2" />
                Manifesto
              </TabsTrigger>
              <TabsTrigger
                value="hierarchy"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Crown className="w-4 h-4 mr-2" />
                Sacred Hierarchy
              </TabsTrigger>
              <TabsTrigger
                value="identity"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Eye className="w-4 h-4 mr-2" />
                Visual Identity
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Zap className="w-4 h-4 mr-2" />
                Brand Experience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manifesto" className="space-y-8">
              <BrandManifesto />
            </TabsContent>

            <TabsContent value="hierarchy" className="space-y-8">
              <SacredHierarchy />
            </TabsContent>

            <TabsContent value="identity" className="space-y-8">
              <div className="text-center text-foreground/60 py-16">
                <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <MythicText variant="title" className="text-foreground/40 mb-4">
                  Visual Identity System
                </MythicText>
                <MythicText variant="body" className="text-foreground/60">
                  Sacred geometry, sigils, and visual language coming soon...
                </MythicText>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-8">
              <div className="text-center text-foreground/60 py-16">
                <Zap className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <MythicText variant="title" className="text-foreground/40 mb-4">
                  Brand Experience Design
                </MythicText>
                <MythicText variant="body" className="text-foreground/60">
                  Ritualistic user journeys and sacred touchpoints coming soon...
                </MythicText>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <BrandPage />
    </ProtectedRoute>
  )
}
