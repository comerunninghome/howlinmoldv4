"use client"

import type React from "react"
import { useState, useMemo } from "react"

import { useAuth } from "@/lib/auth-context"
import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { MythicText } from "@/components/ui/mythic-text"
import {
  InfinityIcon,
  Sparkles,
  Archive,
  Eye,
  Star,
  Brain,
  Gem,
  ShieldCheck,
  Clock,
  Calendar,
  TrendingUp,
  AlertCircle,
  Edit,
} from "lucide-react"
import { EditProfileForm } from "@/components/user/edit-profile-form"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useUserProfile } from "@/hooks/use-user-profile"
import { UserAvatar } from "@/components/user/user-avatar"

// Re-defining Tier for clarity within this component
interface Tier {
  id: string
  name: string
  mysticalName: string
  title: string
  color: string
  bgColor: string
  borderColor: string
  icon: React.ElementType
  levelRequirement: number
  requirements: {
    destiny: number
    relics: number
    aura: number
  }
}

const TIERS_DATA: Tier[] = [
  {
    id: "initiate",
    name: "Initiate",
    mysticalName: "The Spark",
    title: "The Unknowing",
    color: "text-slate-300",
    bgColor: "bg-slate-800/70",
    borderColor: "border-slate-700/50",
    icon: Star,
    levelRequirement: 0,
    requirements: { destiny: 0, relics: 0, aura: 0 },
  },
  {
    id: "seeker",
    name: "Seeker",
    mysticalName: "The Echo Listener",
    title: "The Awakened",
    color: "text-teal-300",
    bgColor: "bg-teal-800/70",
    borderColor: "border-teal-700/50",
    icon: Brain,
    levelRequirement: 5,
    requirements: { destiny: 3, relics: 5, aura: 100 },
  },
  {
    id: "adept",
    name: "Adept",
    mysticalName: "The Pattern Weaver",
    title: "The Harmonized",
    color: "text-purple-300",
    bgColor: "bg-purple-800/70",
    borderColor: "border-purple-700/50",
    icon: Gem,
    levelRequirement: 15,
    requirements: { destiny: 10, relics: 15, aura: 500 },
  },
  {
    id: "keeper",
    name: "Keeper",
    mysticalName: "The Resonance Guardian",
    title: "The Custodian",
    color: "text-amber-300",
    bgColor: "bg-amber-800/70",
    borderColor: "border-amber-700/50",
    icon: ShieldCheck,
    levelRequirement: 30,
    requirements: { destiny: 25, relics: 40, aura: 1500 },
  },
]

const MYTHIC_DESCRIPTIONS = {
  resonance: {
    label: "Resonance",
    description: "Carries a resonance beyond recognition.",
    cosmicTarget: "∞ / 99,999",
    icon: InfinityIcon,
  },
  destiny: {
    label: "Destiny",
    description: "Encoded with a future too vast to predict.",
    cosmicTarget: "77,777",
    icon: Sparkles,
  },
  relics: {
    label: "Relics",
    description: "Stacked with relics worthy of reverence.",
    cosmicTarget: "55,555",
    icon: Archive,
  },
  aura: {
    label: "Aura",
    description: "Radiates a visual and sonic aura.",
    cosmicTarget: "33,333",
    icon: Eye,
  },
}

interface StatDisplayProps {
  mythicKey: keyof typeof MYTHIC_DESCRIPTIONS
  value: number
  target?: number
  isNextTierRequirement?: boolean
}

const StatDisplay: React.FC<StatDisplayProps> = ({ mythicKey, value, target, isNextTierRequirement = false }) => {
  const mythicInfo = MYTHIC_DESCRIPTIONS[mythicKey]
  const Icon = mythicInfo.icon
  const displayValue = mythicKey === "resonance" && value === Number.POSITIVE_INFINITY ? "∞" : value
  const targetDisplay = target !== undefined ? ` / ${target}` : ""
  const tooltipText = `${mythicInfo.label}: ${value}${targetDisplay} (Cosmic Target: ${mythicInfo.cosmicTarget}). ${mythicInfo.description}`

  return (
    <div
      className="flex items-center gap-2 p-3 bg-black/20 rounded-lg border border-primary/10 shadow-inner"
      title={tooltipText}
    >
      <Icon className="w-6 h-6 text-primary/70 flex-shrink-0" />
      <div>
        <MythicText type="h4" className="text-sm font-orbitron text-primary/90">
          {mythicInfo.label}
        </MythicText>
        <p className={cn("text-lg font-bold", isNextTierRequirement ? "text-teal-300" : "text-foreground/90")}>
          {displayValue}
          {target !== undefined && <span className="text-sm text-foreground/60 font-normal"> /{target}</span>}
        </p>
      </div>
    </div>
  )
}

const CurrentTierIcon = ({ className }: { className?: string }) => {
  return <Star className={className} />
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: profileData, isLoading: profileLoading, error, refetch } = useUserProfile()

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const safeProfileData = useMemo(() => {
    if (!profileData?.profile) return null

    const profile = profileData.profile
    const stats = profileData.stats

    return {
      profile: {
        ...profile,
        current_level: profile.current_level || 1,
        completed_rituals: profile.completed_rituals || 0,
        collected_artifacts: profile.collected_artifacts || 0,
        community_score: profile.community_score || 0,
        ritual_streak: profile.ritual_streak || 0,
      },
      rituals: profileData.rituals || [],
      artifacts: profileData.artifacts || [],
      stats: {
        ...stats,
        totalPlayTimeHours: stats.totalPlayTimeHours || 0,
        favoriteGenre: stats.favorite_genres?.join(", ") || "N/A",
        memberSince: stats.memberSince || "Ancient",
      },
    }
  }, [profileData])

  const currentTierIndex = useMemo(() => {
    if (!safeProfileData?.profile) return 0
    const tierId = safeProfileData.profile.current_tier_id || "initiate"
    return TIERS_DATA.findIndex((tier) => tier.id === tierId)
  }, [safeProfileData?.profile])

  const currentTier = TIERS_DATA[currentTierIndex >= 0 ? currentTierIndex : 0]
  const nextTier =
    currentTierIndex >= 0 && currentTierIndex < TIERS_DATA.length - 1 ? TIERS_DATA[currentTierIndex + 1] : null

  const overallProgress = useMemo(() => {
    if (!nextTier || !safeProfileData?.profile) return 100

    const profile = safeProfileData.profile
    const criteria = [
      { current: profile.current_level, target: nextTier.levelRequirement },
      { current: profile.completed_rituals, target: nextTier.requirements.destiny },
      { current: profile.collected_artifacts, target: nextTier.requirements.relics },
      { current: profile.community_score, target: nextTier.requirements.aura },
    ]

    let totalWeightedProgress = 0
    let totalWeight = 0

    criteria.forEach((crit) => {
      const weight = 1
      if (crit.target > 0) {
        totalWeightedProgress += Math.min(crit.current / crit.target, 1) * weight
        totalWeight += weight
      } else if (crit.current >= crit.target) {
        totalWeightedProgress += weight
        totalWeight += weight
      } else {
        totalWeight += weight
      }
    })

    return totalWeight > 0 ? Math.min((totalWeightedProgress / totalWeight) * 100, 100) : 0
  }, [safeProfileData?.profile, nextTier])

  if (authLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] text-primary-foreground">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading your nexus data...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Alert className="border-red-500/50 bg-red-900/20">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load profile data: {error}
            <button onClick={() => refetch()} className="ml-2 text-primary hover:underline">
              Try again
            </button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!safeProfileData) {
    return (
      <div className="container mx-auto px-4 py-8 pt-20">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No profile data found. Please contact support if this issue persists.</AlertDescription>
        </Alert>
      </div>
    )
  }

  const { profile, rituals, artifacts, stats } = safeProfileData

  return (
    <ProtectedRoute>
      <main className="container mx-auto px-4 py-8 pt-20 min-h-screen">
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-6">
            <UserAvatar path={profile.avatar_url} className="h-24 w-24" />
            <div>
              <h1 className="text-4xl font-bold text-left sacred-text text-primary-foreground">
                {profile.full_name || profile.username || "Anonymous"}'s Nexus
              </h1>
              {profile.username && <p className="text-lg text-muted-foreground">@{profile.username}</p>}
            </div>
          </div>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="bg-black/30 border-primary/30 hover:bg-primary/20">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-background border-primary/20">
              <DialogHeader>
                <DialogTitle className="sacred-text text-primary">Edit Your Nexus</DialogTitle>
              </DialogHeader>
              <EditProfileForm onSuccess={() => setIsEditDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-primary/20 bg-black/30">
            <CardContent className="p-4 text-center">
              <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{stats.totalPlayTimeHours}h</p>
              <p className="text-xs text-foreground/60">Total Play Time</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-black/30">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{profile.ritual_streak}</p>
              <p className="text-xs text-foreground/60">Ritual Streak</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-black/30">
            <CardContent className="p-4 text-center">
              <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-bold text-primary">{stats.memberSince}</p>
              <p className="text-xs text-foreground/60">Member Since</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 bg-black/30">
            <CardContent className="p-4 text-center">
              <Archive className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-sm font-bold text-primary">{stats.favoriteGenre}</p>
              <p className="text-xs text-foreground/60">Favorite Genre</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Tier Card */}
          <Card className={cn("border-2", currentTier.borderColor, currentTier.bgColor, "shadow-lg")}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={cn("text-sm font-medium", currentTier.color)}>Current Attunement</CardTitle>
              <currentTier.icon className={cn("w-6 h-6", currentTier.color)} />
            </CardHeader>
            <CardContent>
              <MythicText type="h3" className={cn("text-2xl font-bold", currentTier.color)}>
                {currentTier.name}
              </MythicText>
              <Badge
                variant="secondary"
                className={cn("mt-1 text-xs px-2 py-0.5", currentTier.bgColor.replace("/70", "/85"), currentTier.color)}
              >
                {currentTier.title}
              </Badge>
              <p className="text-xs text-foreground/70 mt-2">Mystical Name: {currentTier.mysticalName}</p>
            </CardContent>
          </Card>

          {/* Next Tier Progress Card */}
          <Card className="col-span-1 lg:col-span-2 border-2 border-primary/20 bg-black/30 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-primary-foreground/80">
                Progression to Next Attunement
              </CardTitle>
              {nextTier && <nextTier.icon className={cn("w-6 h-6", nextTier.color)} />}
            </CardHeader>
            <CardContent>
              {nextTier ? (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <MythicText type="h3" className={cn("text-2xl font-bold", nextTier.color)}>
                      {nextTier.name}
                    </MythicText>
                    <span className={cn("text-xl font-bold", nextTier.color)}>{overallProgress.toFixed(0)}%</span>
                  </div>
                  <Progress
                    value={overallProgress}
                    className={cn("h-3 [&>*]", nextTier.color.replace("text-", "bg-"), "opacity-80")}
                  />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <StatDisplay
                      mythicKey="resonance"
                      value={profile.current_level}
                      target={nextTier.levelRequirement}
                      isNextTierRequirement={profile.current_level < nextTier.levelRequirement}
                    />
                    <StatDisplay
                      mythicKey="destiny"
                      value={profile.completed_rituals}
                      target={nextTier.requirements.destiny}
                      isNextTierRequirement={profile.completed_rituals < nextTier.requirements.destiny}
                    />
                    <StatDisplay
                      mythicKey="relics"
                      value={profile.collected_artifacts}
                      target={nextTier.requirements.relics}
                      isNextTierRequirement={profile.collected_artifacts < nextTier.requirements.relics}
                    />
                    <StatDisplay
                      mythicKey="aura"
                      value={profile.community_score}
                      target={nextTier.requirements.aura}
                      isNextTierRequirement={profile.community_score < nextTier.requirements.aura}
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <MythicText type="h3" className={cn("text-2xl font-bold", currentTier.color)}>
                    Max Attunement Reached!
                  </MythicText>
                  <p className="text-foreground/70 mt-2">You have achieved the highest level of attunement.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Artifacts and Rituals */}
        <Tabs defaultValue="artifacts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/30 border border-primary/20">
            <TabsTrigger
              value="artifacts"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-inner text-primary-foreground/70 hover:text-primary transition-colors"
            >
              Collected Artifacts ({artifacts.length})
            </TabsTrigger>
            <TabsTrigger
              value="rituals"
              className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-inner text-primary-foreground/70 hover:text-primary transition-colors"
            >
              Ritual History ({rituals.length})
            </TabsTrigger>
          </TabsList>
          <TabsContent value="artifacts" className="mt-4">
            <Card className="border-2 border-primary/20 bg-black/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary-foreground">Your Relics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 mb-4">You have collected {artifacts.length} artifacts.</p>
                {artifacts.length > 0 ? (
                  <div className="space-y-3">
                    {artifacts.slice(0, 5).map((artifact) => (
                      <div
                        key={artifact.id}
                        className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-primary/10"
                      >
                        <div>
                          <p className="font-medium text-primary-foreground">Artifact #{artifact.artifactId}</p>
                          <p className="text-sm text-foreground/60">
                            Acquired: {new Date(artifact.acquiredAt).toLocaleDateString()}
                          </p>
                          {artifact.notes && <p className="text-xs text-foreground/50 italic mt-1">{artifact.notes}</p>}
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-primary">Played {artifact.playCount} times</p>
                          {artifact.rating && <p className="text-xs text-foreground/60">Rating: {artifact.rating}/5</p>}
                        </div>
                      </div>
                    ))}
                    {artifacts.length > 5 && (
                      <p className="text-center text-foreground/60 text-sm">
                        ...and {artifacts.length - 5} more artifacts
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-foreground/60 italic">
                    <p>No artifacts collected yet.</p>
                    <p className="text-sm mt-2">
                      Explore the{" "}
                      <a href="/shop" className="text-primary hover:underline">
                        Artifacts Shop
                      </a>{" "}
                      to discover more.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="rituals" className="mt-4">
            <Card className="border-2 border-primary/20 bg-black/30 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-primary-foreground">Your Destiny Path</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70 mb-4">You have a completed {rituals.length} rituals.</p>
                {rituals.length > 0 ? (
                  <div className="space-y-4">
                    {rituals.map((ritual) => (
                      <div key={ritual.id} className="p-4 bg-black/20 rounded-lg border border-primary/10">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-primary-foreground">{ritual.name}</h4>
                            <p className="text-sm text-foreground/70">{ritual.description}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            +{ritual.resonanceGained} Resonance
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-foreground/60">
                          <div>
                            <p>
                              <strong>Mood:</strong> {ritual.mood}
                            </p>
                            <p>
                              <strong>Intention:</strong> {ritual.intention}
                            </p>
                          </div>
                          <div>
                            <p>
                              <strong>Duration:</strong> {Math.round(ritual.duration / 60)} minutes
                            </p>
                            <p>
                              <strong>Completed:</strong> {new Date(ritual.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-foreground/50">
                            <strong>Artifacts used:</strong> {ritual.artifactIds.length} artifacts
                          </p>
                          <p className="text-xs text-foreground/50">
                            <strong>Sigil overlays:</strong> {ritual.sigilOverlays.join(", ")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-foreground/60 italic">
                    <p>No rituals completed yet.</p>
                    <p className="text-sm mt-2">
                      Visit the{" "}
                      <a href="/ritual-mix" className="text-primary hover:underline">
                        Ritual Mix Chamber
                      </a>{" "}
                      to perform your first ritual.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </ProtectedRoute>
  )
}
