"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react"
import { Howl } from "howler"
import type { Artifact } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

interface AudioPlayerContextType {
  isPlaying: boolean
  currentTrack: Artifact | null
  progress: number
  duration: number
  volume: number
  isMuted: boolean
  isShuffled: boolean
  repeatMode: "off" | "all" | "one"
  play: (track?: Artifact, queue?: Artifact[]) => void
  pause: () => void
  togglePlayPause: () => void
  next: () => void
  previous: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

const AudioPlayerContext = createContext<AudioPlayerContextType | undefined>(undefined)

export const AudioPlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<Artifact | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const [volume, setVolumeState] = useLocalStorage("audio-volume", 1)
  const [isMuted, setIsMutedState] = useLocalStorage("audio-muted", false)
  const [isShuffled, setIsShuffledState] = useLocalStorage("audio-shuffled", false)
  const [repeatMode, setRepeatModeState] = useLocalStorage<"off" | "all" | "one">("audio-repeat", "off")

  const [queue, setQueue] = useState<Artifact[]>([])
  const [originalQueue, setOriginalQueue] = useState<Artifact[]>([])
  const [currentIndex, setCurrentIndex] = useState(-1)

  const soundRef = useRef<Howl | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const cleanup = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.unload()
      soundRef.current = null
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsPlaying(false)
    setProgress(0)
    setDuration(0)
  }, [])

  const playNextTrack = useCallback(() => {
    if (queue.length === 0) return
    let nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0
      } else {
        cleanup()
        setCurrentTrack(null)
        return
      }
    }
    setCurrentIndex(nextIndex)
    const nextTrack = queue[nextIndex]
    if (nextTrack) {
      // We need to call the main play function here.
      // This will be handled by `onend` calling `next`.
    }
  }, [queue, currentIndex, repeatMode, cleanup])

  const handleTrackEnd = useCallback(() => {
    if (repeatMode === "one" && soundRef.current) {
      soundRef.current.seek(0)
      soundRef.current.play()
    } else {
      playNextTrack()
    }
  }, [repeatMode, playNextTrack])

  const play = useCallback(
    (track?: Artifact, newQueue?: Artifact[]) => {
      const trackToPlay = track || currentTrack || (queue.length > 0 ? queue[currentIndex] : undefined)
      if (!trackToPlay) return

      if (newQueue && newQueue.length > 0 && JSON.stringify(newQueue) !== JSON.stringify(originalQueue)) {
        const newOriginalQueue = newQueue
        const finalQueue = isShuffled ? shuffleArray(newOriginalQueue) : newOriginalQueue

        setOriginalQueue(newOriginalQueue)
        setQueue(finalQueue)

        const newIndex = finalQueue.findIndex((t) => t.id === trackToPlay.id)
        setCurrentIndex(newIndex)
      }

      if (soundRef.current && currentTrack?.id === trackToPlay.id && !isPlaying) {
        soundRef.current.play()
        return
      }

      cleanup()
      setCurrentTrack(trackToPlay)

      const newSound = new Howl({
        src: [trackToPlay.audio_url],
        html5: true,
        volume: isMuted ? 0 : volume,
        onplay: () => {
          setIsPlaying(true)
          setDuration(newSound.duration())
          if (intervalRef.current) clearInterval(intervalRef.current)
          intervalRef.current = setInterval(() => {
            setProgress(newSound.seek() as number)
          }, 500)
        },
        onpause: () => {
          setIsPlaying(false)
          if (intervalRef.current) clearInterval(intervalRef.current)
        },
        onend: () => {
          if (repeatMode === "one") {
            newSound.seek(0)
            newSound.play()
          } else {
            next()
          }
        },
        onseek: (seekPos) => {
          setProgress(seekPos as number)
        },
        onloaderror: (id, err) => console.error("Howl load error:", err),
        onplayerror: (id, err) => console.error("Howl play error:", err),
      })
      soundRef.current = newSound
      soundRef.current.play()
    },
    [cleanup, currentTrack, isPlaying, isMuted, volume, isShuffled, queue, currentIndex, originalQueue, repeatMode],
  )

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause()
    }
  }, [])

  const togglePlayPause = useCallback(() => {
    if (!currentTrack && queue.length > 0) {
      play(queue[0], queue)
    } else if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, pause, play, currentTrack, queue])

  const next = useCallback(() => {
    if (queue.length === 0) return
    let nextIndex = currentIndex + 1
    if (nextIndex >= queue.length) {
      if (repeatMode === "all") {
        nextIndex = 0
      } else {
        cleanup()
        setCurrentTrack(null)
        return
      }
    }
    play(queue[nextIndex])
    setCurrentIndex(nextIndex)
  }, [queue, currentIndex, repeatMode, play, cleanup])

  const previous = useCallback(() => {
    if (queue.length === 0) return
    if (progress > 3 && soundRef.current) {
      soundRef.current.seek(0)
      return
    }

    let prevIndex = currentIndex - 1
    if (prevIndex < 0) {
      if (repeatMode === "all") {
        prevIndex = queue.length - 1
      } else {
        if (soundRef.current) soundRef.current.seek(0)
        return
      }
    }
    play(queue[prevIndex])
    setCurrentIndex(prevIndex)
  }, [queue, currentIndex, repeatMode, play, progress])

  const seek = useCallback((time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time)
      setProgress(time)
    }
  }, [])

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume))
      setVolumeState(clampedVolume)
      if (soundRef.current) {
        soundRef.current.volume(clampedVolume)
      }
      if (clampedVolume > 0 && isMuted) {
        setIsMutedState(false)
        if (soundRef.current) soundRef.current.mute(false)
      }
    },
    [isMuted, setIsMutedState],
  )

  const toggleMute = useCallback(() => {
    setIsMutedState((prev) => {
      const newState = !prev
      if (soundRef.current) {
        soundRef.current.mute(newState)
      }
      return newState
    })
  }, [setIsMutedState])

  const toggleShuffle = useCallback(() => {
    const newShuffleState = !isShuffled
    setIsShuffledState(newShuffleState)

    const currentId = currentTrack?.id
    const newQueue = newShuffleState ? shuffleArray(originalQueue) : originalQueue
    setQueue(newQueue)

    const newIndex = newQueue.findIndex((t) => t.id === currentId)
    if (newIndex !== -1) setCurrentIndex(newIndex)
  }, [isShuffled, setIsShuffledState, originalQueue, currentTrack])

  const toggleRepeat = useCallback(() => {
    const modes: ("off" | "all" | "one")[] = ["off", "all", "one"]
    const currentModeIndex = modes.indexOf(repeatMode)
    const nextMode = modes[(currentModeIndex + 1) % modes.length]
    setRepeatModeState(nextMode)
  }, [repeatMode, setRepeatModeState])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const value = {
    isPlaying,
    currentTrack,
    progress,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    play,
    pause,
    togglePlayPause,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    toggleRepeat,
  }

  return <AudioPlayerContext.Provider value={value}>{children}</AudioPlayerContext.Provider>
}

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext)
  if (!context) {
    throw new Error("useAudioPlayer must be used within an AudioPlayerProvider")
  }
  return context
}
