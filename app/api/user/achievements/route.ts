import { type NextRequest, NextResponse } from "next/server"
import type { Achievement } from "@/lib/database-types"

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_steps",
    name: "First Steps",
    description: "Welcome to the Howlin Mold universe",
    icon: "👶",
    category: "exploration",
    requirements: [{ type: "join", target: 1 }],
    rewards: { resonance: 10, aura: 5 },
    rarity: "common",
  },
  {
    id: "first_ritual",
    name: "Ritual Initiate",
    description: "Complete your first sonic ritual",
    icon: "🔮",
    category: "ritual",
    requirements: [{ type: "rituals_completed", target: 1 }],
    rewards: { resonance: 25, destiny: 1 },
    rarity: "common",
  },
  {
    id: "collector_novice",
    name: "Collector Novice",
    description: "Acquire 10 artifacts",
    icon: "📦",
    category: "collection",
    requirements: [{ type: "artifacts_collected", target: 10 }],
    rewards: { relics: 5, aura: 10 },
    rarity: "common",
  },
  {
    id: "ritual_master",
    name: "Ritual Master",
    description: "Complete 50 sonic rituals",
    icon: "🎭",
    category: "ritual",
    requirements: [{ type: "rituals_completed", target: 50 }],
    rewards: { resonance: 100, destiny: 10 },
    rarity: "epic",
  },
  {
    id: "sonic_archaeologist",
    name: "Sonic Archaeologist",
    description: "Discover rare patterns in 100+ artifacts",
    icon: "🏺",
    category: "mastery",
    requirements: [{ type: "artifacts_analyzed", target: 100 }],
    rewards: { resonance: 200, destiny: 15, aura: 50 },
    rarity: "legendary",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    // Simulate database query delay
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Mock user achievements progress
    const userAchievements = ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      isUnlocked: Math.random() > 0.6, // Random for demo
      progress: Math.floor(Math.random() * achievement.requirements[0].target),
      unlockedAt: Math.random() > 0.7 ? new Date().toISOString() : null,
    }))

    return NextResponse.json({
      achievements: userAchievements,
      totalUnlocked: userAchievements.filter((a) => a.isUnlocked).length,
      totalAvailable: ACHIEVEMENTS.length,
    })
  } catch (error) {
    console.error("Error fetching achievements:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
