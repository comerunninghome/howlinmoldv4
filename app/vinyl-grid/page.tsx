import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"

function VinylGridPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-pink-900/30 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
            Vinyl Grid Matrix
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            Explore the collection of vinyl artifacts. This grid will showcase records with rich details and playback
            options.
          </p>
          <div className="p-6 bg-black/50 border border-pink-500/30 rounded-lg inline-block">
            <p className="text-pink-300">Vinyl grid display and interaction features will be built here.</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <VinylGridPage />
    </ProtectedRoute>
  )
}
