"use client"

import type React from "react"
import { createContext, useContext, useRef, useCallback, useEffect, useState } from "react"

type SoundName = "click" | "success" | "error" | "transition" | "ritualStep"

interface SoundContextType {
  playSound: (soundName: SoundName) => void
  isMuted: boolean
  toggleMute: () => void
  isLoading: boolean
  volume: number
  setVolume: (volume: number) => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

const soundFiles: Record<SoundName, string> = {
  click: "/sounds/ui-click.mp3",
  success: "/sounds/ui-success.mp3",
  error: "/sounds/ui-error.mp3",
  transition: "/sounds/page-transition.mp3",
  ritualStep: "/sounds/ritual-step.mp3",
}

const FALLBACK_SOUND_SRC = "/sounds/ui-click.mp3"

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioCache = useRef<Record<string, HTMLAudioElement>>({})
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [volume, setVolumeState] = useState(1)

  useEffect(() => {
    let isMounted = true

    const storedMuteState = localStorage.getItem("howlinMoldMuted")
    if (storedMuteState) {
      setIsMuted(JSON.parse(storedMuteState))
    }
    const storedVolume = localStorage.getItem("howlinMoldVolume")
    if (storedVolume) {
      const parsedVolume = Number.parseFloat(storedVolume)
      if (!isNaN(parsedVolume)) {
        setVolumeState(parsedVolume)
      }
    }

    const uniqueSoundUrls = [...new Set([...Object.values(soundFiles), FALLBACK_SOUND_SRC])]
    let processedSoundsCount = 0
    const totalSoundsToLoad = uniqueSoundUrls.length

    if (totalSoundsToLoad === 0) {
      setIsLoading(false)
      return
    }

    console.log(`SoundProvider: Pre-loading ${totalSoundsToLoad} unique sound files.`)

    uniqueSoundUrls.forEach((src) => {
      if (audioCache.current[src]) {
        processedSoundsCount++
        if (processedSoundsCount === totalSoundsToLoad) setIsLoading(false)
        return
      }

      const audio = new Audio()

      const onDone = () => {
        if (!isMounted) return
        processedSoundsCount++
        if (processedSoundsCount === totalSoundsToLoad) {
          console.log("SoundProvider: All sound files processed. Loading complete.")
          setIsLoading(false)
        }
      }

      const handleLoad = () => {
        console.log(`SoundProvider: Successfully loaded ${src}`)
        audioCache.current[src] = audio
        cleanup()
        onDone()
      }

      const handleError = () => {
        console.warn(
          `SoundProvider: Could not load sound from ${src}. This may be a 404 Not Found error. The system will attempt to use a fallback sound.`,
        )
        cleanup()
        onDone()
      }

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", handleLoad)
        audio.removeEventListener("error", handleError)
      }

      audio.addEventListener("canplaythrough", handleLoad)
      audio.addEventListener("error", handleError)

      audio.src = src
      audio.load()
    })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    Object.values(audioCache.current).forEach((audio) => {
      if (audio) {
        audio.volume = volume
      }
    })
  }, [volume])

  const playSound = useCallback(
    (soundName: SoundName) => {
      if (isMuted || isLoading) return

      const desiredSrc = soundFiles[soundName]
      let audio = audioCache.current[desiredSrc]

      if (!audio) {
        audio = audioCache.current[FALLBACK_SOUND_SRC]
      }

      if (!audio) {
        console.warn(`SoundProvider: Cannot play sound for '${soundName}'. No loaded audio source available.`)
        return
      }

      audio.volume = volume

      if (audio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        audio.currentTime = 0
        audio.play().catch((error) => console.error(`SoundProvider: Error during playback of ${soundName}:`, error))
      }
    },
    [isMuted, isLoading, volume],
  )

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const newState = !prev
      localStorage.setItem("howlinMoldMuted", JSON.stringify(newState))
      if (newState) {
        Object.values(audioCache.current).forEach((audio) => {
          if (audio && !audio.paused) {
            audio.pause()
          }
        })
      }
      return newState
    })
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    localStorage.setItem("howlinMoldVolume", clampedVolume.toString())
  }, [])

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute, isLoading, volume, setVolume }}>
      {children}
    </SoundContext.Provider>
  )
}

export const useSound = () => {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error("useSound must be used within a SoundProvider")
  }
  return context
}
