"use client"

import { useMemo } from "react"
import Image from "next/image"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart } from "lucide-react"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function GlobalPlayer() {
  const {
    currentTrack,
    isPlaying,
    togglePlayPause,
    next,
    previous,
    seek,
    duration,
    progress,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = useAudioPlayer()

  const { isLiked, toggleLike } = useUserProfile()

  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds) || timeInSeconds < 0) return "0:00"
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const RepeatIcon = useMemo(() => {
    if (repeatMode === "one") return Repeat1
    if (repeatMode === "all") return Repeat
    return Repeat
  }, [repeatMode])

  if (!currentTrack) {
    return null
  }

  return (
    <footer className="sticky bottom-0 z-50 mt-auto border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-4" style={{ minWidth: "200px" }}>
          <div className="relative h-12 w-12 overflow-hidden rounded-md">
            <Image
              src={currentTrack.album_art_url || "/placeholder.svg"}
              alt={currentTrack.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-semibold">{currentTrack.title}</p>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
          </div>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={() => toggleLike(currentTrack.id)}>
            <Heart
              className={cn(
                "h-5 w-5 text-muted-foreground transition-colors hover:text-primary",
                isLiked(currentTrack.id) && "fill-primary text-primary",
              )}
            />
          </Button>
        </div>

        <div className="flex flex-grow flex-col items-center justify-center gap-2 px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleShuffle}>
              <Shuffle className={cn("h-5 w-5 text-muted-foreground", isShuffled && "text-primary")} />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={previous}>
              <SkipBack className="h-6 w-6" />
            </Button>
            <Button variant="default" size="icon" className="h-12 w-12 rounded-full" onClick={togglePlayPause}>
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={next}>
              <SkipForward className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleRepeat}>
              <RepeatIcon className={cn("h-5 w-5 text-muted-foreground", repeatMode !== "off" && "text-primary")} />
            </Button>
          </div>
          <div className="flex w-full items-center gap-2">
            <span className="text-xs text-muted-foreground">{formatTime(progress)}</span>
            <Slider
              value={[progress]}
              max={duration}
              step={1}
              onValueChange={(value) => seek(value[0])}
              className="w-full"
            />
            <span className="text-xs text-muted-foreground">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2" style={{ minWidth: "200px" }}>
          <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleMute}>
            {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={(value) => setVolume(value[0])}
            className="w-24"
          />
        </div>
      </div>
    </footer>
  )
}
