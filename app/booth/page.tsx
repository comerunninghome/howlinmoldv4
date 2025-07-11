import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Play, Square, Volume2, Disc3 } from "lucide-react"
import SpotifyPlaylistImporter from "@/components/spotify-playlist-importer"

function BoothPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-16 px-4 py-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 sacred-text">RITUAL DJ BOOTH</h1>
            <p className="text-teal-200/80">
              Multi-deck sonic archaeology. Mix across temporal dimensions. Canonize the eternal.
            </p>
          </div>

          <Card className="mb-8 bg-black/70 border-primary/30">
            <CardHeader>
              <CardTitle className="sacred-text">MASTER CONTROL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4">
                <Button variant="outline" className="border-red-500/50 text-red-400">
                  <Square className="w-4 h-4 mr-2" />
                  RECORD
                </Button>
                <Badge variant="outline" className="border-primary/50 text-teal-300">
                  READY
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-black/50 border-amber-500/30">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Disc3 className="w-6 h-6 text-amber-400" />
                  <span className="text-secondary">DECK A: Foundation</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-16 bg-gray-900/50 rounded-lg flex items-center justify-center">
                  <div className="text-secondary/50">Waveform Visualization</div>
                </div>

                <div className="flex items-center justify-center space-x-4">
                  <Button variant="outline" size="lg" className="border-secondary/50 text-secondary">
                    <Play className="w-6 h-6" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Volume2 className="w-4 h-4 text-secondary" />
                  <div className="flex-1 h-2 bg-secondary/10 rounded-full">
                    <div className="w-3/4 h-full bg-secondary rounded-full" />
                  </div>
                  <span className="text-xs text-secondary">75</span>
                </div>
              </CardContent>
            </Card>

            <SpotifyPlaylistImporter />
          </div>
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <BoothPage />
    </ProtectedRoute>
  )
}
