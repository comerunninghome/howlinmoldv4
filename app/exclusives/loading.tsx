import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-20 px-4 py-8 flex items-center justify-center bg-gradient-to-br from-black via-red-900/30 to-black">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-red-400 mx-auto mb-4" />
          <p className="text-xl text-red-400 sacred-text animate-pulse">Accessing Inner Sanctum...</p>
        </div>
      </div>
    </>
  )
}
