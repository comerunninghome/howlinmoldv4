"use client"

import type React from "react"
import Image from "next/image"
import { Play, Pause, Heart } from "lucide-react"
import { useAudioPlayer } from "@/contexts/audio-player-context"
import { useUserProfile } from "@/contexts/user-profile-context"
import type { Artifact } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SimpleArtifactCardProps {
  artifact: Artifact
  allArtifacts: Artifact[]
}

export function SimpleArtifactCard({ artifact, allArtifacts }: SimpleArtifactCardProps) {
  const { play, pause, currentTrack, isPlaying } = useAudioPlayer()
  const { isLiked, toggleLike } = useUserProfile()

  const isActive = currentTrack?.id === artifact.id
  const isCurrentlyPlaying = isActive && isPlaying

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isCurrentlyPlaying) {
      pause()
    } else {
      play(artifact, allArtifacts)
    }
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(artifact.id)
  }

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center gap-4 rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm transition-all hover:bg-muted/50",
        isActive && "border-primary bg-muted/80",
      )}
      onClick={handlePlayPause}
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={artifact.album_art_url || "/placeholder.svg"} alt={artifact.title} fill className="object-cover" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold tracking-tight">{artifact.title}</h3>
        <p className="text-sm text-muted-foreground">{artifact.artist}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={handleLike} className="rounded-full">
          <Heart
            className={cn(
              "h-5 w-5 text-muted-foreground transition-colors hover:text-primary",
              isLiked(artifact.id) && "fill-primary text-primary",
            )}
          />
          <span className="sr-only">Like</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={handlePlayPause} className="rounded-full">
          {isCurrentlyPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          <span className="sr-only">{isCurrentlyPlaying ? "Pause" : "Play"}</span>
        </Button>
      </div>
    </div>
  )
}
