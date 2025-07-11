"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"
import { Howl } from "howler"
import type { Artifact } from "@/lib/types"

type AudioPlayerContextType = {
  play: (artifact: Artifact) => void
  pause: () => void
  togglePlayPause: () => void
  seek: (position: number) => void
  currentTrack: Artifact | null
  isPlaying: boolean
  progress: number
  duration: number
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Artifact | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const soundRef = useRef<Howl | null>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const cleanup = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.unload()
      soundRef.current = null
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [])

  const play = useCallback(
    (artifact: Artifact) => {
      if (soundRef.current && currentTrack?.id === artifact.id) {
        soundRef.current.play()
        setIsPlaying(true)
        return
      }

      cleanup()
      setCurrentTrack(artifact)
      const newSound = new Howl({
        src: [artifact.audioUrl],
        html5: true,
        onload: () => {
          setDuration(newSound.duration())
          newSound.play()
          setIsPlaying(true)
        },
        onplay: () => {
          setIsPlaying(true)
          progressIntervalRef.current = setInterval(() => {
            setProgress(newSound.seek())
          }, 100)
        },
        onpause: () => setIsPlaying(false),
        onend: () => {
          cleanup()
          setCurrentTrack(null)
        },
        onstop: () => setIsPlaying(false),
      })
      soundRef.current = newSound
    },
    [cleanup, currentTrack],
  )

  const pause = useCallback(() => {
    soundRef.current?.pause()
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!soundRef.current) return
    if (isPlaying) {
      pause()
    } else {
      soundRef.current.play()
    }
  }, [isPlaying, pause])

  const seek = useCallback((position: number) => {
    soundRef.current?.seek(position)
    setProgress(position)
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  const value = {
    play,
    pause,
    togglePlayPause,
    seek,
    currentTrack,
    isPlaying,
    progress,
    duration,
  }

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

// Use default export for the provider
export default AudioPlayerProvider

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (context === undefined) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
