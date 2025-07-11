import { Navigation } from "@/components/navigation"

export default function Loading() {
  return (
    <>
      <Navigation />
      <div className="min-h-screen pt-20 px-4 py-8 flex items-center justify-center bg-gradient-to-br from-black via-cyan-900/30 to-black">
        <p className="text-xl text-cyan-400 sacred-text animate-pulse">Unsealing The Vault...</p>
      </div>
    </>
  )
}
