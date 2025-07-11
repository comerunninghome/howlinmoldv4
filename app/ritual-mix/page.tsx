import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"

function RitualMixPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-purple-900/30 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Ritual Mix Chamber
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            This is the space for crafting unique audio blends and sonic rituals. Future enhancements will allow for
            deep audio manipulation and sequencing.
          </p>
          <div className="p-6 bg-black/50 border border-purple-500/30 rounded-lg inline-block">
            <p className="text-purple-300">Content for Ritual Mix will be developed here.</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <RitualMixPage />
    </ProtectedRoute>
  )
}
