"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Crown, Zap } from "lucide-react"
import { MythicText } from "@/components/brand/mythic-brand-system"

interface FeaturedInitiate {
  id: string
  name: string
  avatar: string
  level: number
  achievement: string
  timestamp: string
}

const mockInitiates: FeaturedInitiate[] = [
  {
    id: "1",
    name: "Echo Keeper",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 12,
    achievement: "Unlocked the Sigil of Echoes",
    timestamp: "2 hours ago",
  },
  {
    id: "2",
    name: "Frequency Shaman",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 8,
    achievement: "First to complete the Solstice Ritual",
    timestamp: "8 hours ago",
  },
  {
    id: "3",
    name: "Void Walker",
    avatar: "/placeholder.svg?height=40&width=40",
    level: 15,
    achievement: "Secured Mythic Pressing #1",
    timestamp: "1 day ago",
  },
]

export function KeepersOfGenesis() {
  return (
    <Card className="bg-card/80 border-border sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="w-5 h-5 text-amber-400" />
          <MythicText variant="subtitle" className="text-amber-400">
            Keepers of the Genesis Signal
          </MythicText>
        </CardTitle>
        <p className="text-sm text-foreground/70 font-poetic">Honoring the first to answer the call.</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockInitiates.map((initiate) => (
            <div
              key={initiate.id}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={initiate.avatar || "/placeholder.svg"} />
                <AvatarFallback>{initiate.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-orbitron font-semibold text-foreground">{initiate.name}</span>
                  <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                    Lv.{initiate.level}
                  </Badge>
                </div>
                <p className="text-xs text-accent flex items-center space-x-1">
                  <Zap className="w-3 h-3" />
                  <span>{initiate.achievement}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
