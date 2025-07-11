"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ShrineStatusProps {
  onEnter?: () => void
}

export function ShrineStatus({ onEnter }: ShrineStatusProps) {
  const [isActive, setIsActive] = useState(false)
  const [showEnterPrompt, setShowEnterPrompt] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsActive(true)
      setShowEnterPrompt(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleEnter = () => {
    setShowEnterPrompt(false)
    onEnter?.()
  }

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-sm px-4 md:relative md:bottom-auto md:left-auto md:transform-none md:max-w-md">
      {/* Status Card */}
      <div className="bg-black/60 md:bg-black/40 backdrop-blur-md border border-teal-500/30 rounded-lg p-4 md:p-6 text-center mobile-text-backdrop">
        {/* Connection Status */}
        <div className="flex items-center justify-center mb-3">
          <div
            className={`w-2 h-2 md:w-3 md:h-3 rounded-full mr-2 md:mr-3 transition-colors duration-500 ${
              isActive ? "bg-green-400 animate-pulse" : "bg-yellow-400"
            }`}
          />
          <span className="text-teal-200 font-medium text-sm md:text-base">
            {isActive ? "Signal Active" : "Tuning In..."}
          </span>
        </div>

        {/* Status Description */}
        <p className="text-xs md:text-sm text-teal-300/70 mb-4">Sonic Shrine {isActive ? "Connected" : "Connecting"}</p>

        {/* Enter Button */}
        {showEnterPrompt && (
          <div className="animate-fade-in">
            <Button
              onClick={handleEnter}
              className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white font-medium py-2 md:py-3 text-sm md:text-base bb-interactive-pulse-glow"
            >
              Enter the Shrine
            </Button>
            <p className="text-xs text-teal-400/60 mt-2 leading-relaxed">Enter the sacred space of deep listening</p>
          </div>
        )}
      </div>
    </div>
  )
}
