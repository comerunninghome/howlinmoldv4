"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { ChevronDown, ChevronUp, TrendingUp, ShieldCheck, Zap, Users, BarChart3, Gem, Brain, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { MythicText } from "@/components/ui/mythic-text" // Assuming this exists

// Mock data - replace with actual data fetching and types
interface Tier {
  id: string
  name: string
  mysticalName: string
  title: string
  description: string
  mantra: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ElementType
  levelRequirement: number
  requirements: {
    rituals: number
    artifacts: number
    communityScore: number
  }
  features: string[]
}

const TIERS_DATA: Tier[] = [
  {
    id: "initiate",
    name: "Initiate",
    mysticalName: "The Spark",
    title: "The Unknowing",
    description:
      "A nascent soul, yet to perceive the echoes of the Howlin' Mold. The journey begins with a single, unheard whisper.",
    mantra: "I open my senses to the unseen currents.",
    color: "text-slate-400",
    bgColor: "bg-slate-800/10",
    borderColor: "border-slate-700/50",
    icon: Star,
    levelRequirement: 0,
    requirements: { rituals: 0, artifacts: 0, communityScore: 0 },
    features: ["Basic Access", "Community Forums (Read-only)"],
  },
  {
    id: "seeker",
    name: "Seeker",
    mysticalName: "The Echo Listener",
    title: "The Awakened",
    description:
      "Awareness dawns. The Seeker actively searches for the resonant frequencies, collecting fragments of sonic truth.",
    mantra: "I seek the echoes that shape the silence.",
    color: "text-teal-400",
    bgColor: "bg-teal-900/20",
    borderColor: "border-teal-600/50",
    icon: Brain,
    levelRequirement: 5,
    requirements: { rituals: 3, artifacts: 5, communityScore: 100 },
    features: ["Submit Artifacts", "Participate in Rituals", "Basic Profile Customization"],
  },
  {
    id: "adept",
    name: "Adept",
    mysticalName: "The Pattern Weaver",
    title: "The Harmonized",
    description:
      "Understanding deepens. The Adept discerns patterns in the Mold, weaving disparate sounds into coherent rituals.",
    mantra: "I weave the threads of sound into meaning.",
    color: "text-purple-400",
    bgColor: "bg-purple-900/20",
    borderColor: "border-purple-600/50",
    icon: Gem,
    levelRequirement: 15,
    requirements: { rituals: 10, artifacts: 15, communityScore: 500 },
    features: ["Curate Playlists", "Host Minor Rituals", "Advanced Profile Features"],
  },
  {
    id: "keeper",
    name: "Keeper",
    mysticalName: "The Resonance Guardian",
    title: "The Custodian",
    description:
      "Mastery achieved. The Keeper safeguards the core frequencies, guiding others and shaping the evolving soundscape.",
    mantra: "I am a guardian of the sacred resonance.",
    color: "text-amber-400",
    bgColor: "bg-amber-900/20",
    borderColor: "border-amber-600/50",
    icon: ShieldCheck,
    levelRequirement: 30,
    requirements: { rituals: 25, artifacts: 40, communityScore: 1500 },
    features: ["Moderate Community", "Host Major Rituals", "Exclusive Content Access", "Shape Platform Features"],
  },
]

// Mock user data - replace with actual user data
const MOCK_USER_DATA = {
  currentLevel: 7,
  completedRituals: 2,
  collectedArtifacts: 6,
  communityScore: 120,
  currentTierId: "seeker",
}

interface UserStats {
  currentLevel: number
  completedRituals: number
  collectedArtifacts: number
  communityScore: number
  currentTierId: string
}

interface StatDisplayItemProps {
  icon: React.ElementType
  label: string
  value: string | number
  className?: string
}

const CompactStatDisplayItem: React.FC<StatDisplayItemProps> = ({ icon: Icon, label, value, className }) => (
  <div className={cn("flex items-center space-x-2 p-2 bg-black/10 rounded-md", className)}>
    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-1">
      <span className="text-xs font-medium text-slate-300 whitespace-nowrap">{label}:</span>
      <span className="text-sm font-semibold text-primary-foreground whitespace-nowrap">{value}</span>
    </div>
  </div>
)

interface CompactProgressItemProps {
  label: string
  current: number
  target: number
  icon?: React.ElementType
}

const CompactProgressItem: React.FC<CompactProgressItemProps> = ({ label, current, target, icon: Icon }) => {
  const isComplete = current >= target
  const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0

  return (
    <div className="py-2">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center space-x-2">
          {Icon && <Icon className={cn("w-4 h-4", isComplete ? "text-green-400" : "text-primary")} />}
          <span className={cn("text-xs font-medium", isComplete ? "text-green-300" : "text-slate-300")}>{label}</span>
        </div>
        <span className={cn("text-xs font-semibold", isComplete ? "text-green-400" : "text-primary-foreground")}>
          {current} / {target}
        </span>
      </div>
      <Progress value={percentage} className={cn("h-1.5", isComplete ? "[&>*]:bg-green-500" : "[&>*]:bg-primary")} />
    </div>
  )
}

export function SacredHierarchy() {
  const [expandedTier, setExpandedTier] = useState<string | null>(null)
  const [userData] = useState<UserStats>(MOCK_USER_DATA) // Use actual user data

  const currentTierIndex = useMemo(
    () => TIERS_DATA.findIndex((tier) => tier.id === userData.currentTierId),
    [userData.currentTierId],
  )
  const currentTier = TIERS_DATA[currentTierIndex]
  const nextTier = TIERS_DATA[currentTierIndex + 1]

  const overallProgress = useMemo(() => {
    if (!nextTier) return 100

    const levelProgress = (userData.currentLevel / nextTier.levelRequirement) * 100
    const ritualProgress = (userData.completedRituals / nextTier.requirements.rituals) * 100
    const artifactProgress = (userData.collectedArtifacts / nextTier.requirements.artifacts) * 100
    const communityProgress = (userData.communityScore / nextTier.requirements.communityScore) * 100

    const totalPossibleProgress = 400 // 100 for each category
    const currentTotalProgress =
      Math.min(levelProgress, 100) +
      Math.min(ritualProgress, 100) +
      Math.min(artifactProgress, 100) +
      Math.min(communityProgress, 100)

    return Math.min((currentTotalProgress / totalPossibleProgress) * 100, 100)
  }, [userData, nextTier])

  const toggleTierExpansion = (tierId: string) => {
    setExpandedTier(expandedTier === tierId ? null : tierId)
  }

  if (!currentTier) {
    return <div className="text-center py-10">Loading user data or tier not found...</div>
  }

  const CurrentTierIcon = currentTier.icon

  return (
    <div className="space-y-8 p-4 md:p-6 bg-black/50 rounded-lg">
      {/* Current Status & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Current Tier Status Card */}
        <Card
          className={cn(
            "lg:col-span-3 shadow-xl bb-interactive-bg-shimmer",
            currentTier.bgColor,
            currentTier.borderColor,
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <CurrentTierIcon className={cn("w-10 h-10 sm:w-12 sm:h-12", currentTier.color)} />
                <div>
                  <CardTitle className={cn("text-2xl sm:text-3xl font-orbitron", currentTier.color)}>
                    {currentTier.name}
                  </CardTitle>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs sm:text-sm",
                      currentTier.bgColor.replace("/10", "/30").replace("/20", "/40"),
                      currentTier.color,
                      `border-${currentTier.color.split("-")[1]}-500/50`,
                    )}
                  >
                    {currentTier.title}
                  </Badge>
                </div>
              </div>
              <MythicText
                type="h3"
                className={cn("text-lg sm:text-xl font-orbitron self-start sm:self-center", currentTier.color)}
              >
                {currentTier.mysticalName}
              </MythicText>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <p className="text-sm text-slate-300 leading-relaxed line-clamp-3 sm:line-clamp-none">
              {currentTier.description}
            </p>

            {/* Condensed Stats Display */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <CompactStatDisplayItem icon={TrendingUp} label="Level" value={userData.currentLevel} />
              <CompactStatDisplayItem icon={Zap} label="Rituals" value={userData.completedRituals} />
              <CompactStatDisplayItem icon={Gem} label="Artifacts" value={userData.collectedArtifacts} />
              <CompactStatDisplayItem icon={Users} label="Community" value={userData.communityScore} />
            </div>

            <div className={cn("p-3 rounded-md", currentTier.bgColor.replace("/10", "/5").replace("/20", "/10"))}>
              <p className="text-xs font-semibold text-slate-400 mb-1">Sacred Mantra:</p>
              <MythicText type="p" className={cn("italic text-sm", currentTier.color, "opacity-80")}>
                "{currentTier.mantra}"
              </MythicText>
            </div>
          </CardContent>
        </Card>

        {/* Progress to Next Tier Card */}
        {nextTier && (
          <Card
            className={cn("lg:col-span-2 shadow-xl bb-interactive-bg-shimmer", nextTier.bgColor, nextTier.borderColor)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className={cn("w-6 h-6", nextTier.color)} />
                <CardTitle className={cn("text-xl font-orbitron", nextTier.color)}>Ascension Path</CardTitle>
              </div>
              <CardDescription className="text-sm text-slate-400">
                Your journey towards{" "}
                <span className={cn("font-semibold", nextTier.color)}>
                  {nextTier.name} ({nextTier.mysticalName})
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-slate-300">Overall Progress</span>
                  <span className={cn("text-sm font-bold", nextTier.color)}>{overallProgress.toFixed(0)}%</span>
                </div>
                <Progress
                  value={overallProgress}
                  className={cn("h-2.5 sm:h-3 [&>*]", nextTier.color.replace("text-", "bg-"))}
                />
              </div>

              {/* Condensed Progress Items */}
              <div className="space-y-1 pt-2 border-t border-black/20">
                <CompactProgressItem
                  label="Level"
                  current={userData.currentLevel}
                  target={nextTier.levelRequirement}
                  icon={TrendingUp}
                />
                <CompactProgressItem
                  label="Rituals"
                  current={userData.completedRituals}
                  target={nextTier.requirements.rituals}
                  icon={Zap}
                />
                <CompactProgressItem
                  label="Artifacts"
                  current={userData.collectedArtifacts}
                  target={nextTier.requirements.artifacts}
                  icon={Gem}
                />
                <CompactProgressItem
                  label="Community Score"
                  current={userData.communityScore}
                  target={nextTier.requirements.communityScore}
                  icon={Users}
                />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Hierarchy Overview Section */}
      <div className="mt-8">
        <MythicText type="h2" className="text-2xl font-orbitron text-center mb-6 text-primary-foreground">
          The Sacred Hierarchy
        </MythicText>
        <div className="space-y-3">
          {TIERS_DATA.map((tier, index) => {
            const TierIcon = tier.icon
            const isCurrent = tier.id === userData.currentTierId
            const isUnlocked = index <= currentTierIndex
            const isExpanded = expandedTier === tier.id

            return (
              <Card
                key={tier.id}
                className={cn(
                  "transition-all duration-300 ease-in-out bb-interactive-border-accent",
                  tier.bgColor,
                  isCurrent ? tier.borderColor : isUnlocked ? "border-slate-600/70" : "border-slate-800/50",
                  isCurrent && `shadow-lg ${tier.borderColor.replace("border-", "shadow-")}/30`,
                  !isUnlocked && "opacity-60 hover:opacity-80",
                )}
              >
                <CardHeader
                  className="flex flex-row items-center justify-between p-3 sm:p-4 cursor-pointer"
                  onClick={() => toggleTierExpansion(tier.id)}
                >
                  <div className="flex items-center space-x-3">
                    <TierIcon className={cn("w-7 h-7 sm:w-8 sm:h-8", isUnlocked ? tier.color : "text-slate-500")} />
                    <div>
                      <CardTitle
                        className={cn("text-base sm:text-lg font-orbitron", isUnlocked ? tier.color : "text-slate-400")}
                      >
                        {tier.name}
                      </CardTitle>
                      <p className={cn("text-xs sm:text-sm", isUnlocked ? tier.color : "text-slate-500", "opacity-70")}>
                        {tier.mysticalName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    {isCurrent && (
                      <Badge
                        className={cn(
                          tier.bgColor.replace("/10", "/30").replace("/20", "/40"),
                          tier.color,
                          `border-${tier.color.split("-")[1]}-500/50`,
                        )}
                      >
                        Current
                      </Badge>
                    )}
                    {isUnlocked && !isCurrent && (
                      <Badge variant="outline" className={cn(tier.color, tier.borderColor)}>
                        Unlocked
                      </Badge>
                    )}
                    {!isUnlocked && (
                      <Badge variant="outline" className="border-slate-700 text-slate-500">
                        Locked
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn("p-1 h-auto", isUnlocked ? tier.color : "text-slate-500")}
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      ) : (
                        <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="p-3 sm:p-4 border-t border-black/20">
                    <p
                      className={cn(
                        "text-xs sm:text-sm mb-2 text-slate-300 line-clamp-3",
                        isUnlocked ? tier.color : "text-slate-500",
                        "opacity-80",
                      )}
                    >
                      {tier.description}
                    </p>
                    <p className={cn("text-xs italic mb-3", isUnlocked ? tier.color : "text-slate-500", "opacity-70")}>
                      Mantra: "{tier.mantra}"
                    </p>
                    <div className="mb-2">
                      <p className="text-xs font-semibold text-slate-400 mb-1">Features:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className={cn(
                              "text-xs text-slate-300",
                              isUnlocked ? tier.color : "text-slate-500",
                              "opacity-75",
                            )}
                          >
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {!isCurrent && (
                      <div>
                        <p className="text-xs font-semibold text-slate-400 mb-1">Requirements:</p>
                        <ul className="list-none space-y-0.5 text-xs">
                          <li className={cn(isUnlocked ? tier.color : "text-slate-500", "opacity-75")}>
                            Level: {tier.levelRequirement}
                          </li>
                          <li className={cn(isUnlocked ? tier.color : "text-slate-500", "opacity-75")}>
                            Rituals: {tier.requirements.rituals}
                          </li>
                          <li className={cn(isUnlocked ? tier.color : "text-slate-500", "opacity-75")}>
                            Artifacts: {tier.requirements.artifacts}
                          </li>
                          <li className={cn(isUnlocked ? tier.color : "text-slate-500", "opacity-75")}>
                            Community Score: {tier.requirements.communityScore}
                          </li>
                        </ul>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
