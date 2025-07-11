"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Flame, Eye, TrendingUp, Star, Key, ShieldCheck } from "lucide-react"

interface ExclusiveEvent {
  id: string
  type: "limited_drop" | "ritual_unlock" | "sigil_unlock" | "trending_now"
  title: string
  description: string
  timeLeft: number // in seconds
  participants: number
  claimedCount?: number
  totalAvailable?: number
  unlockCondition: string
  urgencyLevel: "low" | "medium" | "high" | "critical"
  reward: {
    type: "artifact" | "ritual" | "sigil"
    name: string
    image: string
  }
}

const mockExclusiveEvents: ExclusiveEvent[] = [
  {
    id: "1",
    type: "sigil_unlock",
    title: "Unlock the Sigil of Echoes",
    description:
      "Discover hidden tracks and rare records—available only to the first 100 users to complete the ritual!",
    timeLeft: 86400, // 24 hours
    participants: 482,
    claimedCount: 34,
    totalAvailable: 100,
    unlockCondition: "First 100 users",
    urgencyLevel: "high",
    reward: {
      type: "sigil",
      name: "Sigil of Echoes",
      image: "/placeholder.svg?height=100&width=100&text=Sigil",
    },
  },
  {
    id: "2",
    type: "ritual_unlock",
    title: "The Solstice Listening Ritual",
    description: "A 3-hour deep listening experience, available only during the solstice window.",
    timeLeft: 172800, // 48 hours
    participants: 198,
    claimedCount: 78,
    totalAvailable: 250,
    unlockCondition: "Level 5+ Initiates",
    urgencyLevel: "medium",
    reward: {
      type: "ritual",
      name: "Solstice Ritual Access",
      image: "/placeholder.svg?height=100&width=100&text=Ritual",
    },
  },
  {
    id: "3",
    type: "limited_drop",
    title: "Mythic Pressing: 'Discreet Music'",
    description: "A legendary artifact, unearthed from the vault. Only 25 exist in this reality.",
    timeLeft: 3600, // 1 hour
    participants: 843,
    claimedCount: 21,
    totalAvailable: 25,
    unlockCondition: "Open to all",
    urgencyLevel: "critical",
    reward: {
      type: "artifact",
      name: "Discreet Music",
      image: "/placeholder.svg?height=100&width=100&text=Discreet+Music",
    },
  },
]

export function ExclusiveContentEngine() {
  const [events, setEvents] = useState<ExclusiveEvent[]>(mockExclusiveEvents)

  useEffect(() => {
    const timer = setInterval(() => {
      setEvents((prev) =>
        prev.map((event) => ({
          ...event,
          timeLeft: Math.max(0, event.timeLeft - 1),
          participants:
            event.timeLeft > 0 ? event.participants + Math.floor(Math.random() * 3) - 1 : event.participants,
        })),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTimeLeft = (seconds: number) => {
    if (seconds <= 0) return "Ended"
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    if (d > 0) return `${d}d ${h}h ${m}m`
    if (h > 0) return `${h}h ${m}m ${s}s`
    return `${m}m ${s}s`
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "critical":
        return "border-red-500/50 bg-red-500/10"
      case "high":
        return "border-orange-500/50 bg-orange-500/10"
      case "medium":
        return "border-yellow-500/50 bg-yellow-500/10"
      default:
        return "border-green-500/50 bg-green-500/10"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "limited_drop":
        return <Flame className="w-5 h-5" />
      case "ritual_unlock":
        return <ShieldCheck className="w-5 h-5" />
      case "sigil_unlock":
        return <Key className="w-5 h-5" />
      case "trending_now":
        return <TrendingUp className="w-5 h-5" />
      default:
        return <Star className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`${getUrgencyColor(event.urgencyLevel)} border-2 relative overflow-hidden`}>
              {event.urgencyLevel === "critical" && (
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 animate-pulse" />
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center bg-black/30 ${getUrgencyColor(event.urgencyLevel).split(" ")[1]}`}
                    >
                      {getTypeIcon(event.type)}
                    </div>
                    <div>
                      <CardTitle className="font-orbitron text-lg">{event.title}</CardTitle>
                      <p className="text-sm text-foreground/70 font-poetic">{event.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`capitalize border-current text-current`}>
                    {event.type.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-3 bg-black/30 rounded-lg">
                  <img
                    src={event.reward.image || "/placeholder.svg"}
                    alt={event.reward.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-foreground/60">Reward</p>
                    <h4 className="font-orbitron font-semibold text-primary">{event.reward.name}</h4>
                    <Badge
                      variant="outline"
                      className="text-xs mt-1 capitalize border-accent/50 text-accent bg-accent/10"
                    >
                      {event.reward.type}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-foreground/60">Condition</p>
                    <p className="font-semibold text-foreground">{event.unlockCondition}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-lg font-bold text-primary">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeLeft(event.timeLeft)}</span>
                    </div>
                    <div className="text-xs text-foreground/60">Time Left</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-center space-x-1 text-lg font-bold text-accent">
                      <Eye className="w-4 h-4" />
                      <span>{event.participants}</span>
                    </div>
                    <div className="text-xs text-foreground/60">Participants</div>
                  </div>
                  {event.totalAvailable != null && event.claimedCount != null && (
                    <div>
                      <div className="text-lg font-bold text-secondary">
                        {event.claimedCount} / {event.totalAvailable}
                      </div>
                      <div className="text-xs text-foreground/60">Claimed</div>
                    </div>
                  )}
                </div>

                {event.totalAvailable != null && event.claimedCount != null && (
                  <Progress value={(event.claimedCount / event.totalAvailable) * 100} className="h-2" />
                )}

                <Button
                  disabled={event.timeLeft <= 0}
                  className={`w-full font-semibold py-3 shadow-lg transition-all duration-300 ${
                    event.timeLeft <= 0
                      ? "bg-gray-600/50 text-gray-400"
                      : event.urgencyLevel === "critical"
                        ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 hover:shadow-red-500/50"
                        : "bg-primary hover:bg-primary/80 shadow-primary/30 hover:shadow-primary/50"
                  }`}
                  size="lg"
                >
                  {event.timeLeft <= 0 ? "Transmission Ended" : "Participate Now"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
