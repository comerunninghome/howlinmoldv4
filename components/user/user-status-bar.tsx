"use client"

import { useUserProfile } from "@/hooks/use-user-profile"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Gem, ShieldCheck, Brain } from "lucide-react"
import { MythicText } from "@/components/ui/mythic-text"

export function UserStatusBar() {
  const { data, isLoading } = useUserProfile()

  if (isLoading) {
    return (
      <div className="w-full bg-black/30 p-4 rounded-lg border border-primary/20">
        <div className="h-4 bg-primary/20 rounded-full animate-pulse w-1/2 mx-auto"></div>
      </div>
    )
  }

  if (!data || !data.profile) {
    return null
  }

  const { profile } = data

  // Safely handle potential null/undefined/zero values to prevent NaN
  const xp = profile.xp || 0
  const xpToNextLevel = profile.xp_to_next_level || 100
  const levelProgress = xpToNextLevel > 0 ? (xp / xpToNextLevel) * 100 : 0

  const currentLevel = profile.current_level || 1
  const completedRituals = profile.completed_rituals || 0
  const collectedArtifacts = profile.collected_artifacts || 0
  const communityScore = profile.community_score || 0
  const ritualStreak = profile.ritual_streak || 0

  return (
    <div className="w-full bg-black/30 p-4 rounded-lg border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex-grow w-full md:w-auto">
        <div className="flex justify-between items-center mb-1">
          <MythicText type="h4" className="text-lg text-primary">
            Level {currentLevel}
          </MythicText>
          <span className="text-sm text-foreground/70">
            {xp} / {xpToNextLevel} XP
          </span>
        </div>
        <Progress value={levelProgress} className="h-3 [&>*]:bg-primary" />
      </div>
      <div className="flex items-center gap-4 text-foreground/80">
        <div className="flex items-center gap-1" title="Completed Rituals (Destiny)">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>{completedRituals}</span>
        </div>
        <div className="flex items-center gap-1" title="Collected Artifacts (Relics)">
          <Gem className="w-5 h-5 text-purple-400" />
          <span>{collectedArtifacts}</span>
        </div>
        <div className="flex items-center gap-1" title="Community Score (Aura)">
          <Brain className="w-5 h-5 text-teal-400" />
          <span>{communityScore}</span>
        </div>
        <div className="flex items-center gap-1" title="Ritual Streak">
          <ShieldCheck className="w-5 h-5 text-amber-400" />
          <span>{ritualStreak}</span>
        </div>
      </div>
    </div>
  )
}
