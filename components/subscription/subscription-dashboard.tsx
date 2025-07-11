"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useSubscription } from "@/contexts/subscription-context"
import { SUBSCRIPTION_TIERS } from "@/lib/subscription-tiers"
import { Crown, Download, Brain, HardDrive, Zap, CreditCard, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export function SubscriptionDashboard() {
  const { currentTier, usage, getRemainingUsage, canUseFeature } = useSubscription()
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null)

  const usageItems = [
    {
      key: "monthlyDownloads" as const,
      label: "Downloads",
      icon: Download,
      current: usage.downloads,
      limit: currentTier.limits.monthlyDownloads,
      remaining: getRemainingUsage("monthlyDownloads"),
      color: "from-blue-500 to-cyan-500",
    },
    {
      key: "aiAnalysis" as const,
      label: "AI Analysis",
      icon: Brain,
      current: usage.aiAnalysis,
      limit: currentTier.limits.aiAnalysis,
      remaining: getRemainingUsage("aiAnalysis"),
      color: "from-purple-500 to-pink-500",
    },
    {
      key: "storageGB" as const,
      label: "Storage (GB)",
      icon: HardDrive,
      current: usage.storageUsed,
      limit: currentTier.limits.storageGB,
      remaining: getRemainingUsage("storageGB"),
      color: "from-green-500 to-emerald-500",
    },
  ]

  const getProgressPercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((current / limit) * 100, 100)
  }

  const formatLimit = (limit: number) => {
    return limit === -1 ? "∞" : limit.toString()
  }

  return (
    <div className="space-y-8">
      {/* Current Tier Overview */}
      <Card className="bb-interactive-bg-shimmer border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={cn(
                  "w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center",
                  currentTier.color,
                )}
              >
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-orbitron text-primary-foreground">
                  {currentTier.mysticalName}
                </CardTitle>
                <p className="text-muted-foreground">
                  ${currentTier.price}/{currentTier.interval}
                </p>
              </div>
            </div>
            {currentTier.popular && (
              <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {usageItems.map((item) => {
              const Icon = item.icon
              const percentage = getProgressPercentage(item.current, item.limit)
              const isUnlimited = item.limit === -1

              return (
                <div key={item.key} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {item.current} / {formatLimit(item.limit)}
                    </span>
                  </div>

                  {!isUnlimited && (
                    <div className="space-y-1">
                      <Progress value={percentage} className="h-2" />
                      <p className="text-xs text-muted-foreground">{item.remaining} remaining</p>
                    </div>
                  )}

                  {isUnlimited && (
                    <div className="flex items-center space-x-1 text-primary">
                      <Zap className="w-3 h-3" />
                      <span className="text-xs font-medium">Unlimited</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upgrade Options */}
      <div className="space-y-4">
        <h3 className="text-xl font-orbitron text-primary-foreground">Upgrade Your Experience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBSCRIPTION_TIERS.filter((tier) => tier.id !== currentTier.id).map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                "bb-interactive-border-accent cursor-pointer transition-all duration-300",
                selectedUpgrade === tier.id && "ring-2 ring-primary shadow-lg shadow-primary/20",
                tier.popular && "border-amber-500/50",
              )}
              onClick={() => setSelectedUpgrade(tier.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-br flex items-center justify-center",
                      tier.color,
                    )}
                  >
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  {tier.popular && (
                    <Badge variant="secondary" className="text-xs">
                      Popular
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg font-orbitron">{tier.name}</CardTitle>
                <p className="text-2xl font-bold text-primary">
                  ${tier.price}
                  <span className="text-sm text-muted-foreground">/{tier.interval}</span>
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {tier.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  {tier.features.length > 3 && (
                    <p className="text-xs text-muted-foreground">+{tier.features.length - 3} more features</p>
                  )}
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground mb-2">Target Audience:</p>
                  <div className="flex flex-wrap gap-1">
                    {tier.targetAudience.slice(0, 2).map((audience, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedUpgrade && (
          <div className="flex justify-center pt-4">
            <UpgradeButton tierId={selectedUpgrade} />
          </div>
        )}
      </div>

      {/* Pay-as-you-go Credits */}
      <Card className="bb-interactive-bg-shimmer border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-orbitron">Pay-as-you-go Credits</span>
          </CardTitle>
          <p className="text-muted-foreground">
            Need more resources? Purchase additional credits at your tier's rates.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CreditPurchaseCard
              type="downloads"
              title="Extra Downloads"
              price={currentTier.payAsYouGo.extraDownloads}
              icon={Download}
            />
            <CreditPurchaseCard
              type="aiAnalysis"
              title="AI Analysis"
              price={currentTier.payAsYouGo.extraAiAnalysis}
              icon={Brain}
            />
            <CreditPurchaseCard
              type="storage"
              title="Storage (per GB)"
              price={currentTier.payAsYouGo.extraStorage}
              icon={HardDrive}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function UpgradeButton({ tierId }: { tierId: string }) {
  const { upgradeToTier, isLoading } = useSubscription()
  const [upgrading, setUpgrading] = useState(false)

  const handleUpgrade = async () => {
    setUpgrading(true)
    const success = await upgradeToTier(tierId)
    if (success) {
      // Show success message
    }
    setUpgrading(false)
  }

  return (
    <Button onClick={handleUpgrade} disabled={isLoading || upgrading} className="bb-interactive-pulse-glow">
      {upgrading ? "Processing..." : "Upgrade Now"}
    </Button>
  )
}

function CreditPurchaseCard({
  type,
  title,
  price,
  icon: Icon,
}: {
  type: "downloads" | "aiAnalysis" | "storage"
  title: string
  price: number
  icon: any
}) {
  const { purchaseCredits } = useSubscription()
  const [purchasing, setPurchasing] = useState(false)
  const [amount, setAmount] = useState(1)

  const handlePurchase = async () => {
    setPurchasing(true)
    await purchaseCredits(type, amount)
    setPurchasing(false)
  }

  return (
    <div className="p-4 border border-primary/20 rounded-lg space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className="w-4 h-4 text-primary" />
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-lg font-bold text-primary">${price.toFixed(2)} each</p>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          min="1"
          max="100"
          value={amount}
          onChange={(e) => setAmount(Number.parseInt(e.target.value) || 1)}
          className="w-16 px-2 py-1 text-sm border border-primary/30 rounded bg-background"
        />
        <Button size="sm" onClick={handlePurchase} disabled={purchasing} className="flex-1">
          {purchasing ? "Processing..." : `Buy ${amount}`}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">Total: ${(price * amount).toFixed(2)}</p>
    </div>
  )
}
