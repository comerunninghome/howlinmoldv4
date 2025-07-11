"use client"

import { SacredProvider } from "@/components/providers/sacred-provider"
import { SonicShrineVisual } from "@/components/sonic-shrine-visual"
import { EnhancedNavigation } from "@/components/enhanced-navigation"
import { ShrineStatus } from "@/components/sonic-shrine/shrine-status"

export default function SonicShrineClientPage() {
  const handleEnterShrine = () => {
    console.log("Entering Sonic Shrine...")
    // Add entrance animation or navigation here
  }

  return (
    <SacredProvider>
      <EnhancedNavigation />
      <main className="relative min-h-screen w-full overflow-hidden">
        {/* Background Visual */}
        <div className="absolute inset-0 z-0">
          <SonicShrineVisual />
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex flex-col min-h-screen">
          {/* Header */}
          <div className="flex-shrink-0 pt-20 md:pt-24 pb-8 px-4 text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 sacred-text bg-gradient-to-r from-teal-400 via-cyan-500 to-sky-500 bg-clip-text text-transparent responsive-text-overlay">
              Sonic Shrine
            </h1>
            <p className="text-base md:text-xl text-teal-200/80 max-w-2xl mx-auto responsive-text-overlay font-poetic px-4">
              A place for reflection, inspiration, and deep listening.
            </p>
          </div>

          {/* Center Content Area */}
          <div className="flex-grow flex items-center justify-center px-4 pb-24 md:pb-8">
            <div className="hidden md:block">
              <ShrineStatus onEnter={handleEnterShrine} />
            </div>
          </div>

          {/* Mobile Status (Fixed Position) */}
          <div className="md:hidden">
            <ShrineStatus onEnter={handleEnterShrine} />
          </div>

          {/* Instructions */}
          <div className="flex-shrink-0 pb-6 md:pb-8 px-4 text-center">
            <p className="text-xs md:text-sm text-teal-300/60 max-w-lg mx-auto responsive-text-overlay">
              Move your cursor to alter the resonance
            </p>
          </div>
        </div>

        {/* Mobile Backdrop Gradient */}
        <div className="absolute inset-0 z-5 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-black/40 md:from-black/30 md:to-black/20" />
      </main>
    </SacredProvider>
  )
}
