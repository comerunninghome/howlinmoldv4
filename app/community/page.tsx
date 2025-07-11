import { ProtectedRoute } from "@/components/protected-route"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { DiscoveryFeed } from "@/components/community/discovery-feed"
import { AchievementSystem } from "@/components/gamification/achievement-system"
import { ExclusiveContentEngine } from "@/components/marketing/exclusive-content-engine"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Trophy, Flame, TrendingUp } from "lucide-react"

function CommunityPage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold mb-4 sacred-text text-transparent text-gradient-primary">
              COMMUNITY NEXUS
            </h1>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-poetic text-lg">
              Where sonic archaeologists gather. Share discoveries, complete rituals, and ascend through the ranks of
              musical enlightenment.
            </p>
            <div className="flex justify-center space-x-4">
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                <Users className="w-4 h-4 mr-2" />
                1,247 Active Members
              </Badge>
              <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10">
                <TrendingUp className="w-4 h-4 mr-2" />
                89 Discoveries Today
              </Badge>
            </div>
          </div>

          <Tabs defaultValue="feed" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border">
              <TabsTrigger
                value="feed"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="w-4 h-4 mr-2" />
                Discovery Feed
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Flame className="w-4 h-4 mr-2" />
                Live Events
              </TabsTrigger>
              <TabsTrigger
                value="leaderboard"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              <DiscoveryFeed />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <AchievementSystem />
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <ExclusiveContentEngine />
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card className="bg-card/80 border-border">
                <CardHeader>
                  <CardTitle className="sacred-text">Top Sonic Archaeologists</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center text-foreground/60 py-8">
                    <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="font-poetic">Leaderboard coming soon...</p>
                  </div>
                </CardContent>
              </Card>
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
      <CommunityPage />
    </ProtectedRoute>
  )
}
