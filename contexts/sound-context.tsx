"use client"

import type React from "react"
import { createContext, useContext, useCallback, useMemo } from "react"
import { Howl } from "howler"

type SoundContextType = {
  playSound: (sound: "transition" | "click" | "hover") => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

function SoundProvider({ children }: { children: React.ReactNode }) {
  const sounds = useMemo(
    () => ({
      transition: new Howl({ src: ["/sounds/transition.wav"], volume: 0.5 }),
      click: new Howl({ src: ["/sounds/click.wav"], volume: 0.7 }),
      hover: new Howl({ src: ["/sounds/hover.wav"], volume: 0.3 }),
    }),
    [],
  )

  const playSound = useCallback(
    (sound: "transition" | "click" | "hover") => {
      sounds[sound].play()
    },
    [sounds],
  )

  return <SoundContext.Provider value={{ playSound }}>{children}</SoundContext.Provider>
}

// Use default export for the provider
export default SoundProvider

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
