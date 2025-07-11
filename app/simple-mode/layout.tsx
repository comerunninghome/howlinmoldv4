"use client"

import type React from "react"
import SimpleHeader from "@/components/simple-mode/simple-header"
import { AudioPlayerProvider } from "@/contexts/audio-player-context"
import GlobalPlayer from "@/components/simple-mode/global-player"

export default function SimpleModeLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioPlayerProvider>
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <div className="pb-24">
          {" "}
          {/* Add padding for the global player */}
          {children}
        </div>
        <GlobalPlayer />
      </div>
    </AudioPlayerProvider>
  )
}
