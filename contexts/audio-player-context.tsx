"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Artifact } from "@/lib/artifacts"
import { toast } from "@/hooks/use-toast"

export interface AudioPlayerState {
  currentTrack: Artifact | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  isLoading: boolean
  queue: Artifact[]
  currentIndex: number
  isShuffled: boolean
  repeatMode: "off" | "all" | "one"
}

export interface AudioPlayerActions {
  play: (track?: Artifact) => void
  pause: () => void
  stop: () => void
  seekTo: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  next: () => void
  previous: () => void
  setQueue: (tracks: Artifact[], startIndex?: number) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

const AudioPlayerContext = createContext<(AudioPlayerState & AudioPlayerActions) | null>(null)

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentTrack, setCurrentTrack] = useState<Artifact | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [queue, setQueueState] = useState<Artifact[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Persisted settings
  const [volume, setVolumeState] = useLocalStorage("audio-volume", 0.7)
  const [isMuted, setIsMutedState] = useLocalStorage("audio-muted", false)
  const [isShuffled, setIsShuffledState] = useLocalStorage("audio-shuffled", false)
  const [repeatMode, setRepeatModeState] = useLocalStorage<"off" | "all" | "one">("audio-repeat", "off")

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio()
      const audio = audioRef.current

      const handleLoadStart = () => setIsLoading(true)
      const handleCanPlay = () => setIsLoading(false)
      const handleLoadedMetadata = () => {
        setDuration(audio.duration || 0)
        setIsLoading(false)
      }
      const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0)
      const handleEnded = () => {
        setIsPlaying(false)
        handleTrackEnd()
      }
      const handleError = () => {
        setIsLoading(false)
        console.error("Audio playback error")
        toast({
          variant: "destructive",
          title: "Playback Error",
          description: `Could not play "${currentTrack?.name || "the track"}". It may be unavailable.`,
        })
      }

      audio.addEventListener("loadstart", handleLoadStart)
      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("loadedmetadata", handleLoadedMetadata)
      audio.addEventListener("timeupdate", handleTimeUpdate)
      audio.addEventListener("ended", handleEnded)
      audio.addEventListener("error", handleError)

      return () => {
        audio.removeEventListener("loadstart", handleLoadStart)
        audio.removeEventListener("canplay", handleCanPlay)
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
        audio.removeEventListener("timeupdate", handleTimeUpdate)
        audio.removeEventListener("ended", handleEnded)
        audio.removeEventListener("error", handleError)
      }
    }
  }, [currentTrack]) // Add currentTrack dependency to re-attach listener with correct track name in closure

  // Update audio volume when volume or mute state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === "one") {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
        setIsPlaying(true)
      }
    } else if (repeatMode === "all" || currentIndex < queue.length - 1) {
      // Play next track
      next()
    } else {
      // End of queue
      setIsPlaying(false)
    }
  }, [repeatMode, currentIndex, queue.length])

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const play = useCallback((track?: Artifact) => {
    if (!audioRef.current) return

    if (track) {
      // Play specific track
      setCurrentTrack(track)
      audioRef.current.src = track.audioUrl || ""
      audioRef.current.load()
    }

    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
      })
      .catch((error) => {
        console.error("Playback failed:", error)
        setIsLoading(false)
      })
  }, [])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [])

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }, [])

  const setVolume = useCallback(
    (newVolume: number) => {
      setVolumeState(newVolume)
      if (audioRef.current) {
        audioRef.current.volume = isMuted ? 0 : newVolume
      }
    },
    [isMuted, setVolumeState],
  )

  const toggleMute = useCallback(() => {
    setIsMutedState(!isMuted)
  }, [isMuted, setIsMutedState])

  const setQueue = useCallback(
    (tracks: Artifact[], startIndex = 0) => {
      const finalTracks = isShuffled ? shuffleArray(tracks) : tracks
      setQueueState(finalTracks)
      setCurrentIndex(startIndex)

      if (finalTracks[startIndex]) {
        setCurrentTrack(finalTracks[startIndex])
      }
    },
    [isShuffled],
  )

  const next = useCallback(() => {
    if (queue.length === 0) return

    let nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0
      } else {
        return // End of queue
      }
    }

    setCurrentIndex(nextIndex)
    const nextTrack = queue[nextIndex]
    if (nextTrack) {
      play(nextTrack)
    }
  }, [queue, currentIndex, repeatMode])

  const previous = useCallback(() => {
    if (queue.length === 0) return

    let prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      if (repeatMode === "all") {
        prevIndex = queue.length - 1
      } else {
        prevIndex = 0
      }
    }

    setCurrentIndex(prevIndex)
    const prevTrack = queue[prevIndex]
    if (prevTrack) {
      play(prevTrack)
    }
  }, [queue, currentIndex, repeatMode])

  const toggleShuffle = useCallback(() => {
    const newShuffled = !isShuffled
    setIsShuffledState(newShuffled)

    if (queue.length > 0) {
      const currentTrackId = currentTrack?.id
      const newQueue = newShuffled ? shuffleArray(queue) : [...queue].sort((a, b) => a.name.localeCompare(b.name))
      setQueueState(newQueue)

      // Find current track in new queue
      const newIndex = newQueue.findIndex((track) => track.id === currentTrackId)
      if (newIndex !== -1) {
        setCurrentIndex(newIndex)
      }
    }
  }, [isShuffled, setIsShuffledState, queue, currentTrack])

  const toggleRepeat = useCallback(() => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"]
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    setRepeatModeState(nextMode)
  }, [repeatMode, setRepeatModeState])

  // Keyboard shortcuts handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore shortcuts if user is typing in an input field, textarea, or select
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return
      }

      // Handle seek shortcuts with Shift key
      if (event.shiftKey) {
        switch (event.key) {
          case "ArrowRight":
            event.preventDefault()
            if (currentTrack) {
              const forwardTime = Math.min(currentTime + 5, duration)
              seekTo(forwardTime)
              toast({ title: "Seek Forward +5s" })
            }
            return // Exit after handling
          case "ArrowLeft":
            event.preventDefault()
            if (currentTrack) {
              const backwardTime = Math.max(currentTime - 5, 0)
              seekTo(backwardTime)
              toast({ title: "Seek Backward -5s" })
            }
            return // Exit after handling
        }
      }

      // Handle other shortcuts
      switch (event.key) {
        case " ":
          event.preventDefault() // Prevent scrolling the page
          if (currentTrack) {
            if (isPlaying) {
              pause()
              toast({ title: "Paused" })
            } else {
              play()
              toast({ title: "Playing" })
            }
          }
          break
        case "ArrowRight":
          next()
          toast({ title: "Next Track" })
          break
        case "ArrowLeft":
          previous()
          toast({ title: "Previous Track" })
          break
        case "m":
          toggleMute()
          toast({ title: !isMuted ? "Muted" : "Unmuted" })
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isPlaying, pause, play, next, previous, toggleMute, currentTrack, isMuted, seekTo, currentTime, duration])

  const value = {
    // State
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLoading,
    queue,
    currentIndex,
    isShuffled,
    repeatMode,
    // Actions
    play,
    pause,
    stop,
    seekTo,
    setVolume,
    toggleMute,
    next,
    previous,
    setQueue,
    toggleShuffle,
    toggleRepeat,
  }

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
