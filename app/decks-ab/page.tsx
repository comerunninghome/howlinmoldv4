import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function DecksABPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-yellow-900/30 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
            Decks A/B Control
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            Interface for controlling and interacting with Deck A (Foundation) and Deck B (Spotify/External). Sculpt
            your soundscapes across temporal dimensions.
          </p>
          <div className="p-6 bg-black/50 border border-yellow-500/30 rounded-lg inline-block space-y-4">
            <p className="text-yellow-300">Deck A & B controls and interfaces will be developed here.</p>
            <Button
              asChild
              variant="outline"
              className="border-yellow-400 text-yellow-300 hover:bg-yellow-500/10 hover:text-yellow-200"
            >
              <Link href="/decks-ab/ritual">Enter Deck A/B Ritual Chamber</Link>
            </Button>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <DecksABPage />
    </ProtectedRoute>
  )
}
