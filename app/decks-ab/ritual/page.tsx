import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function DecksABRitualPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-orange-900/40 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 bg-clip-text text-transparent">
            Decks A/B - Ritual Chamber
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            This is the dedicated sub-space for advanced ritualistic sound manipulation using Decks A and B.
          </p>
          <div className="p-6 bg-black/50 border border-orange-500/30 rounded-lg inline-block space-y-4">
            <p className="text-orange-300">Advanced ritual features for Decks A/B will be here.</p>
            <Button
              asChild
              variant="outline"
              className="border-orange-400 text-orange-300 hover:bg-orange-500/10 hover:text-orange-200"
            >
              <Link href="/decks-ab">Back to Decks A/B Control</Link>
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
      <DecksABRitualPage />
    </ProtectedRoute>
  )
}
