"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react"
import { Howler, Howl } from "howler"

type SoundName = "click" | "success" | "error" | "transition" | "ritualStep" | "hover" | "special"

interface SoundContextType {
  playSound: (soundName: SoundName) => void
  isMuted: boolean
  toggleMute: () => void
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const soundFiles: Record<SoundName, { src: string[]; volume: number }> = {
  click: { src: ["/sounds/click.wav"], volume: 0.5 },
  success: { src: ["/sounds/ui-success.mp3"], volume: 0.5 },
  error: { src: ["/sounds/ui-error.mp3"], volume: 0.5 },
  transition: { src: ["/sounds/transition.wav"], volume: 0.3 },
  ritualStep: { src: ["/sounds/ritual-step.mp3"], volume: 0.4 },
  hover: { src: ["/sounds/hover.wav"], volume: 0.2 },
  special: { src: ["/sounds/special.wav"], volume: 0.6 },
}

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolumeState] = useState(1)
  const soundsRef = useRef<Partial<Record<SoundName, Howl>>>({})

  useEffect(() => {
    for (const key in soundFiles) {
      const soundName = key as SoundName
      if (!soundsRef.current[soundName]) {
        const soundInfo = soundFiles[soundName]
        soundsRef.current[soundName] = new Howl({
          src: soundInfo.src,
          volume: soundInfo.volume * volume,
        })
      }
    }
    return () => {
      for (const key in soundsRef.current) {
        soundsRef.current[key as SoundName]?.unload()
      }
    }
  }, [])

  useEffect(() => {
    const storedMuteState = localStorage.getItem("howlinMoldMuted")
    if (storedMuteState) {
      const muted = JSON.parse(storedMuteState)
      setIsMuted(muted)
      Howler.mute(muted)
    }
    const storedVolume = localStorage.getItem("howlinMoldVolume")
    if (storedVolume) {
      const parsedVolume = Number.parseFloat(storedVolume)
      if (!isNaN(parsedVolume)) {
        setVolumeState(parsedVolume)
        Howler.volume(parsedVolume)
      }
    }
  }, [])

  const playSound = useCallback(
    (soundName: SoundName) => {
      if (isMuted) return
      const sound = soundsRef.current[soundName]
      if (sound) {
        sound.play()
      } else {
        console.warn(`SoundProvider: Sound '${soundName}' not initialized.`)
      }
    },
    [isMuted],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newState = !prev
      localStorage.setItem("howlinMoldMuted", JSON.stringify(newState))
      Howler.mute(newState)
      return newState
    })
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    localStorage.setItem("howlinMoldVolume", clampedVolume.toString())
    Howler.volume(clampedVolume)
    for (const key in soundsRef.current) {
      const soundName = key as SoundName
      const sound = soundsRef.current[soundName]
      const baseVolume = soundFiles[soundName]?.volume || 1
      sound?.volume(baseVolume * clampedVolume)
    }
  }, [])

  useEffect(() => {
    Howler.volume(volume)
  }, [volume])

  useEffect(() => {
    Howler.mute(isMuted)
  }, [isMuted])

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext)
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
