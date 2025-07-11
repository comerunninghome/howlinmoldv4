import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"

function BroadcastBoothPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-red-900/30 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent">
            Broadcast Booth
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            Live transmissions, DJ sets, and special Howlin Mold radio streams. Tune in to the signal.
          </p>
          <div className="p-6 bg-black/50 border border-red-500/30 rounded-lg inline-block">
            <p className="text-red-300">Live streaming and broadcast features will be integrated here.</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <BroadcastBoothPage />
    </ProtectedRoute>
  )
}
