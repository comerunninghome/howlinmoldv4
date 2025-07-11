"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Trophy, Crown, Gem, Flame, Eye } from "lucide-react"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  rarity: "Common" | "Rare" | "Epic" | "Legendary" | "Mythic"
  progress: number
  maxProgress: number
  unlocked: boolean
  reward: {
    xp: number
    title?: string
    badge?: string
  }
}

interface UserStats {
  level: number
  xp: number
  nextLevelXp: number
  totalListeningTime: number
  artifactsDiscovered: number
  ritualsCompleted: number
  communityContributions: number
  currentTitle: string
  badges: string[]
}

const mockAchievements: Achievement[] = [
  {
    id: "first_discovery",
    title: "First Discovery",
    description: "Discover your first artifact",
    icon: <Eye className="w-6 h-6" />,
    rarity: "Common",
    progress: 1,
    maxProgress: 1,
    unlocked: true,
    reward: { xp: 100, title: "Seeker" },
  },
  {
    id: "ritual_master",
    title: "Ritual Master",
    description: "Complete 10 listening rituals",
    icon: <Flame className="w-6 h-6" />,
    rarity: "Epic",
    progress: 7,
    maxProgress: 10,
    unlocked: false,
    reward: { xp: 500, title: "Ritual Master", badge: "🔥" },
  },
  {
    id: "sonic_archaeologist",
    title: "Sonic Archaeologist",
    description: "Discover 50 rare artifacts",
    icon: <Gem className="w-6 h-6" />,
    rarity: "Legendary",
    progress: 23,
    maxProgress: 50,
    unlocked: false,
    reward: { xp: 1000, title: "Sonic Archaeologist", badge: "💎" },
  },
  {
    id: "community_leader",
    title: "Community Leader",
    description: "Get 100 likes on your discoveries",
    icon: <Crown className="w-6 h-6" />,
    rarity: "Mythic",
    progress: 47,
    maxProgress: 100,
    unlocked: false,
    reward: { xp: 2000, title: "Echo Keeper", badge: "👑" },
  },
]

const mockUserStats: UserStats = {
  level: 12,
  xp: 2847,
  nextLevelXp: 3200,
  totalListeningTime: 127,
  artifactsDiscovered: 23,
  ritualsCompleted: 7,
  communityContributions: 15,
  currentTitle: "Frequency Shaman",
  badges: ["🎵", "⚡", "🔮"],
}

export function AchievementSystem() {
  const [userStats, setUserStats] = useState<UserStats>(mockUserStats)
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements)
  const [showNewAchievement, setShowNewAchievement] = useState<Achievement | null>(null)

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Mythic":
        return "from-purple-500 to-pink-500"
      case "Legendary":
        return "from-amber-500 to-orange-500"
      case "Epic":
        return "from-blue-500 to-purple-500"
      case "Rare":
        return "from-green-500 to-blue-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case "Mythic":
        return "border-purple-400/50"
      case "Legendary":
        return "border-amber-400/50"
      case "Epic":
        return "border-blue-400/50"
      case "Rare":
        return "border-green-400/50"
      default:
        return "border-gray-400/50"
    }
  }

  const xpProgress = (userStats.xp / userStats.nextLevelXp) * 100

  return (
    <div className="space-y-6">
      {/* User Level & Progress */}
      <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="sacred-text text-2xl">Level {userStats.level}</span>
                <Badge variant="outline" className="border-primary/50 text-primary">
                  {userStats.currentTitle}
                </Badge>
              </div>
              <div className="flex items-center space-x-2 mt-1">
                {userStats.badges.map((badge, index) => (
                  <span key={index} className="text-lg">
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground/70">Experience</span>
                <span className="text-foreground">
                  {userStats.xp} / {userStats.nextLevelXp} XP
                </span>
              </div>
              <Progress value={xpProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userStats.totalListeningTime}h</div>
                <div className="text-xs text-foreground/60">Listening Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{userStats.artifactsDiscovered}</div>
                <div className="text-xs text-foreground/60">Artifacts Found</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{userStats.ritualsCompleted}</div>
                <div className="text-xs text-foreground/60">Rituals Complete</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{userStats.communityContributions}</div>
                <div className="text-xs text-foreground/60">Community Posts</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <div>
        <h2 className="text-2xl font-bold sacred-text mb-6">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <Card
              key={achievement.id}
              className={`
                ${achievement.unlocked ? "bg-card/80" : "bg-card/40"} 
                border transition-all duration-300 hover:scale-105
                ${getRarityBorder(achievement.rarity)}
                ${achievement.unlocked ? "shadow-lg" : ""}
              `}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`
                    w-12 h-12 rounded-lg flex items-center justify-center
                    bg-gradient-to-br ${getRarityColor(achievement.rarity)}
                    ${achievement.unlocked ? "" : "grayscale opacity-50"}
                  `}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={`font-orbitron font-semibold ${achievement.unlocked ? "text-foreground" : "text-foreground/50"}`}
                      >
                        {achievement.title}
                      </h3>
                      <Badge variant="outline" className={`text-xs ${getRarityBorder(achievement.rarity)}`}>
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p
                      className={`text-sm font-poetic ${achievement.unlocked ? "text-foreground/80" : "text-foreground/40"}`}
                    >
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground/60">Progress</span>
                          <span className="text-foreground">
                            {achievement.progress} / {achievement.maxProgress}
                          </span>
                        </div>
                        <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-2" />
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div className="mt-2 flex items-center space-x-2">
                        <Badge variant="outline" className="border-green-400/50 text-green-400 bg-green-400/10">
                          <Trophy className="w-3 h-3 mr-1" />
                          Unlocked
                        </Badge>
                        <span className="text-xs text-foreground/60">+{achievement.reward.xp} XP</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Achievement Notification */}
      <AnimatePresence>
        {showNewAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Card className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border-amber-400/50 shadow-2xl">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-orbitron font-bold text-amber-400">Achievement Unlocked!</h4>
                    <p className="text-sm text-foreground/80">{showNewAchievement.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
