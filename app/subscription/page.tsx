import { SubscriptionDashboard } from "@/components/subscription/subscription-dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Zap, TrendingUp } from "lucide-react"

export default function SubscriptionPage() {
  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg shadow-primary/20">
            <Crown className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-orbitron text-primary-foreground">Subscription Management</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Manage your Howlin Mold subscription, track usage, and unlock the full potential of our mystical music
          platform.
        </p>
      </div>

      {/* Benefits Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bb-interactive-bg-shimmer border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Zap className="w-6 h-6 text-primary" />
              <CardTitle className="font-orbitron">Flexible Pricing</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Pay only for what you use with our innovative pay-as-you-go model, combined with subscription tiers.
            </p>
          </CardContent>
        </Card>

        <Card className="bb-interactive-bg-shimmer border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <CardTitle className="font-orbitron">Scale with Growth</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              From casual listeners to major labels, our tiers grow with your needs and ambitions.
            </p>
          </CardContent>
        </Card>

        <Card className="bb-interactive-bg-shimmer border-primary/20">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Crown className="w-6 h-6 text-primary" />
              <CardTitle className="font-orbitron">Industry Focus</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Built specifically for music industry professionals and serious music discovery enthusiasts.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <SubscriptionDashboard />
    </div>
  )
}
