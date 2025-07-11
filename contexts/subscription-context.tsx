"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { SUBSCRIPTION_TIERS, getTierById, type SubscriptionTier } from "@/lib/subscription-tiers"

interface UsageStats {
  downloads: number
  aiAnalysis: number
  storageUsed: number
  resetDate: string
}

interface SubscriptionContextType {
  currentTier: SubscriptionTier
  usage: UsageStats
  isLoading: boolean
  canUseFeature: (feature: keyof SubscriptionTier["limits"]) => boolean
  getRemainingUsage: (feature: keyof SubscriptionTier["limits"]) => number
  upgradeToTier: (tierId: string) => Promise<boolean>
  purchaseCredits: (type: "downloads" | "aiAnalysis" | "storage", amount: number) => Promise<boolean>
  refreshUsage: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>(SUBSCRIPTION_TIERS[0]) // Default to Seeker
  const [usage, setUsage] = useState<UsageStats>({
    downloads: 0,
    aiAnalysis: 0,
    storageUsed: 0,
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserSubscription()
    } else {
      // For non-authenticated users, use the free tier
      setCurrentTier(SUBSCRIPTION_TIERS[0])
      setIsLoading(false)
    }
  }, [isAuthenticated, user])

  const loadUserSubscription = async () => {
    try {
      setIsLoading(true)

      // Mock subscription data based on user role
      let tierIndex = 0
      if (user?.role === "admin") {
        tierIndex = 3 // Mythic Label
      } else if (user?.email?.includes("producer")) {
        tierIndex = 2 // Sonic Producer
      } else if (user?.email?.includes("curator")) {
        tierIndex = 1 // Genesis Curator
      }

      setCurrentTier(SUBSCRIPTION_TIERS[tierIndex])

      // Mock usage data
      setUsage({
        downloads: Math.floor(Math.random() * 50),
        aiAnalysis: Math.floor(Math.random() * 20),
        storageUsed: Math.floor(Math.random() * 10),
        resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      })
    } catch (error) {
      console.error("Failed to load subscription:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canUseFeature = (feature: keyof SubscriptionTier["limits"]): boolean => {
    const limit = currentTier.limits[feature]

    if (typeof limit === "boolean") return limit
    if (typeof limit === "number") {
      if (limit === -1) return true // unlimited

      // Check usage against limits
      switch (feature) {
        case "monthlyDownloads":
          return usage.downloads < limit
        case "aiAnalysis":
          return usage.aiAnalysis < limit
        case "storageGB":
          return usage.storageUsed < limit
        default:
          return limit > 0
      }
    }

    return false
  }

  const getRemainingUsage = (feature: keyof SubscriptionTier["limits"]): number => {
    const limit = currentTier.limits[feature]

    if (typeof limit === "number") {
      if (limit === -1) return Number.POSITIVE_INFINITY

      switch (feature) {
        case "monthlyDownloads":
          return Math.max(0, limit - usage.downloads)
        case "aiAnalysis":
          return Math.max(0, limit - usage.aiAnalysis)
        case "storageGB":
          return Math.max(0, limit - usage.storageUsed)
        default:
          return limit
      }
    }

    return 0
  }

  const upgradeToTier = async (tierId: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // In a real app, this would integrate with Stripe or another payment processor
      const tier = getTierById(tierId)
      if (!tier) return false

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setCurrentTier(tier)

      return true
    } catch (error) {
      console.error("Failed to upgrade tier:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const purchaseCredits = async (type: "downloads" | "aiAnalysis" | "storage", amount: number): Promise<boolean> => {
    try {
      setIsLoading(true)

      // Calculate cost based on tier's pay-as-you-go rates
      let cost = 0
      switch (type) {
        case "downloads":
          cost = amount * currentTier.payAsYouGo.extraDownloads
          break
        case "aiAnalysis":
          cost = amount * currentTier.payAsYouGo.extraAiAnalysis
          break
        case "storage":
          cost = amount * currentTier.payAsYouGo.extraStorage
          break
      }

      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return true
    } catch (error) {
      console.error("Failed to purchase credits:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const refreshUsage = async () => {
    await loadUserSubscription()
  }

  const value: SubscriptionContextType = {
    currentTier,
    usage,
    isLoading,
    canUseFeature,
    getRemainingUsage,
    upgradeToTier,
    purchaseCredits,
    refreshUsage,
  }

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
