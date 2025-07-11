import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import { Play, Volume2 } from "lucide-react"

export default function DecksPage() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-16 px-4 py-8">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4 sacred-text">RITUAL DECKS</h1>
            <p className="text-emerald-400/70">
              Four chambers of sonic archaeology. Each deck operates on its own temporal frequency.
            </p>
          </div>

          <Card className="mb-8 bg-black/50 border-amber-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-amber-300">DECK A: The Foundation</CardTitle>
                  <p className="text-amber-400/70 font-mono">1920—1987</p>
                </div>
                <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                  ACTIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-amber-500/20 border border-amber-400/50">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="text-amber-400">
                      <Play className="w-4 h-4" />
                    </Button>
                    <div>
                      <h4 className="font-medium text-amber-300">Blue Train</h4>
                      <p className="text-sm text-amber-400/70">John Coltrane</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-amber-400/60">
                    <span>1957</span>
                    <span>10:42</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-950/20 rounded-lg border border-amber-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-amber-400" />
                      <div className="w-24 h-2 bg-amber-950 rounded-full">
                        <div className="w-3/4 h-full bg-amber-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-amber-400/70 font-mono">RESONANCE: 847 Hz</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
