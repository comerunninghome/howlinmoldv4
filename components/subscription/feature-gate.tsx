"use client"

import type { ReactNode } from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Lock, Crown, Zap } from "lucide-react"
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscription-tiers"
import Link from "next/link"

interface FeatureGateProps {
  feature: keyof SubscriptionTier["limits"]
  children: ReactNode
  fallback?: ReactNode
  requiredTier?: string
  showUpgrade?: boolean
}

export function FeatureGate({ feature, children, fallback, requiredTier, showUpgrade = true }: FeatureGateProps) {
  const { currentTier, canUseFeature, getRemainingUsage } = useSubscription()

  const hasAccess = canUseFeature(feature)
  const remaining = getRemainingUsage(feature)

  // If user has access and remaining usage, show the feature
  if (hasAccess && remaining > 0) {
    return <>{children}</>
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>
  }

  // Find the minimum tier that provides this feature
  const minTierForFeature = SUBSCRIPTION_TIERS.find((tier) => {
    const limit = tier.limits[feature]
    if (typeof limit === "boolean") return limit
    if (typeof limit === "number") return limit > 0 || limit === -1
    return false
  })

  const targetTier = requiredTier ? SUBSCRIPTION_TIERS.find((t) => t.id === requiredTier) : minTierForFeature

  if (!showUpgrade) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <Lock className="w-6 h-6 mr-2" />
        <span>This feature requires a higher subscription tier</span>
      </div>
    )
  }

  return (
    <Card className="bb-interactive-bg-shimmer border-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="font-orbitron text-primary-foreground">Feature Locked</CardTitle>
        <p className="text-muted-foreground">
          {remaining === 0
            ? `You've reached your ${feature} limit for this month`
            : `This feature requires ${targetTier?.name || "a higher"} tier access`}
        </p>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        {targetTier && (
          <div className="space-y-3">
            <div className="flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5 text-primary" />
              <span className="font-orbitron text-lg">{targetTier.mysticalName}</span>
              <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                ${targetTier.price}/{targetTier.interval}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Includes:</p>
              <div className="space-y-1">
                {targetTier.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Zap className="w-3 h-3 text-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="bb-interactive-pulse-glow">
            <Link href="/subscription">Upgrade Now</Link>
          </Button>

          {remaining === 0 && currentTier.payAsYouGo && (
            <Button variant="outline" asChild className="bb-interactive-border-accent">
              <Link href="/subscription#credits">Buy Credits</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Usage tracking hook for components that consume resources
export function useFeatureUsage() {
  const { usage, refreshUsage } = useSubscription()

  const trackUsage = async (feature: "downloads" | "aiAnalysis" | "storage", amount = 1) => {
    // In a real app, this would make an API call to track usage
    console.log(`Tracking ${feature} usage: ${amount}`)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Refresh usage data
    await refreshUsage()
  }

  return { usage, trackUsage }
}
