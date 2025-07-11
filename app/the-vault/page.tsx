import { ProtectedRoute } from "@/components/protected-route"
import { Navigation } from "@/components/navigation"

function TheVaultPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-cyan-900/30 to-black">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 sacred-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            The Vault of Whispers
          </h1>
          <p className="text-xl text-emerald-400/80 mb-8 max-w-2xl mx-auto">
            Discover rare, unreleased, and archived sonic treasures. The Vault protects the most elusive signals.
          </p>
          <div className="p-6 bg-black/50 border border-cyan-500/30 rounded-lg inline-block">
            <p className="text-cyan-300">Content for The Vault will be curated and displayed here.</p>
          </div>
        </div>
      </main>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <TheVaultPage />
    </ProtectedRoute>
  )
}
