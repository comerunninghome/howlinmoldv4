import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-20 px-4 py-8 flex items-center justify-center bg-gradient-to-br from-black via-blue-900/30 to-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-xl text-blue-400 sacred-text animate-pulse">Mapping Sonic Constellations...</p>
        </div>
      </div>
    </>
  )
}
