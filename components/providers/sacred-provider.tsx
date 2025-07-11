"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface SacredContextType {
  currentDeck: string
  setCurrentDeck: (deck: string) => void
  resonanceLevel: number
  setResonanceLevel: (level: number) => void
  isRitualMode: boolean
  toggleRitualMode: () => void
}

const SacredContext = createContext<SacredContextType | undefined>(undefined)

export function SacredProvider({ children }: { children: React.ReactNode }) {
  const [currentDeck, setCurrentDeck] = useState("home")
  const [resonanceLevel, setResonanceLevel] = useState(0)
  const [isRitualMode, setIsRitualMode] = useState(false)

  const toggleRitualMode = () => setIsRitualMode(!isRitualMode)

  useEffect(() => {
    if (typeof window === "undefined") return

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth
      const y = e.clientY / window.innerHeight
      const newResonance = Math.floor((x + y) * 50)
      setResonanceLevel(newResonance)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <SacredContext.Provider
      value={{
        currentDeck,
        setCurrentDeck,
        resonanceLevel,
        setResonanceLevel,
        isRitualMode,
        toggleRitualMode,
      }}
    >
      {children}
    </SacredContext.Provider>
  )
}

export function useSacred() {
  const context = useContext(SacredContext)
  if (context === undefined) {
    throw new Error("useSacred must be used within a SacredProvider")
  }
  return context
}
