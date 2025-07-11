export interface SubscriptionLimits {
  monthlyDownloads: number // -1 for unlimited
  aiAnalysis: number // -1 for unlimited
  storageGB: number // -1 for unlimited
  playlists: number // -1 for unlimited
  collaborators: number // -1 for unlimited
  apiAccess: boolean
  whiteLabel: boolean
  prioritySupport: boolean
  advancedAnalytics: boolean
  customBranding: boolean
}

export interface PayAsYouGoRates {
  extraDownloads: number // price per download
  extraAiAnalysis: number // price per analysis
  extraStorage: number // price per GB
}

export interface SubscriptionTier {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: "month" | "year"
  limits: SubscriptionLimits
  payAsYouGo: PayAsYouGoRates
  features: string[]
  targetAudience: string
  popular?: boolean
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: "seeker",
    name: "Sonic Seeker",
    description: "Perfect for music discovery enthusiasts",
    price: 0,
    currency: "USD",
    interval: "month",
    limits: {
      monthlyDownloads: 10,
      aiAnalysis: 5,
      storageGB: 1,
      playlists: 5,
      collaborators: 0,
      apiAccess: false,
      whiteLabel: false,
      prioritySupport: false,
      advancedAnalytics: false,
      customBranding: false,
    },
    payAsYouGo: {
      extraDownloads: 0.99,
      extraAiAnalysis: 1.99,
      extraStorage: 2.99,
    },
    features: [
      "10 monthly downloads",
      "5 AI mood analyses",
      "1GB storage",
      "Basic playlist creation",
      "Community access",
    ],
    targetAudience: "Music lovers and casual listeners",
  },
  {
    id: "curator",
    name: "Genesis Curator",
    description: "For DJs and music curators",
    price: 19.99,
    currency: "USD",
    interval: "month",
    limits: {
      monthlyDownloads: 100,
      aiAnalysis: 50,
      storageGB: 10,
      playlists: 25,
      collaborators: 3,
      apiAccess: false,
      whiteLabel: false,
      prioritySupport: false,
      advancedAnalytics: true,
      customBranding: false,
    },
    payAsYouGo: {
      extraDownloads: 0.79,
      extraAiAnalysis: 1.49,
      extraStorage: 2.49,
    },
    features: [
      "100 monthly downloads",
      "50 AI mood analyses",
      "10GB storage",
      "Advanced playlist tools",
      "Collaboration with 3 users",
      "Advanced analytics",
      "Curator dashboard",
    ],
    targetAudience: "DJs, curators, and music enthusiasts",
    popular: true,
  },
  {
    id: "producer",
    name: "Sonic Producer",
    description: "Professional tools for music producers",
    price: 49.99,
    currency: "USD",
    interval: "month",
    limits: {
      monthlyDownloads: 500,
      aiAnalysis: 200,
      storageGB: 50,
      playlists: 100,
      collaborators: 10,
      apiAccess: true,
      whiteLabel: false,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
    },
    payAsYouGo: {
      extraDownloads: 0.59,
      extraAiAnalysis: 0.99,
      extraStorage: 1.99,
    },
    features: [
      "500 monthly downloads",
      "200 AI mood analyses",
      "50GB storage",
      "Unlimited playlists",
      "Team collaboration (10 users)",
      "API access",
      "Priority support",
      "Custom branding",
      "Producer tools",
    ],
    targetAudience: "Music producers and audio professionals",
  },
  {
    id: "label",
    name: "Mythic Label",
    description: "Enterprise solution for record labels",
    price: 149.99,
    currency: "USD",
    interval: "month",
    limits: {
      monthlyDownloads: -1, // unlimited
      aiAnalysis: -1, // unlimited
      storageGB: 500,
      playlists: -1, // unlimited
      collaborators: -1, // unlimited
      apiAccess: true,
      whiteLabel: true,
      prioritySupport: true,
      advancedAnalytics: true,
      customBranding: true,
    },
    payAsYouGo: {
      extraDownloads: 0.39,
      extraAiAnalysis: 0.69,
      extraStorage: 1.49,
    },
    features: [
      "Unlimited downloads",
      "Unlimited AI analyses",
      "500GB storage",
      "Unlimited playlists",
      "Unlimited collaborators",
      "Full API access",
      "White-label solution",
      "24/7 priority support",
      "Advanced analytics suite",
      "Custom branding",
      "Label management tools",
    ],
    targetAudience: "Record labels and music enterprises",
  },
]

export function getTierById(id: string): SubscriptionTier | null {
  return SUBSCRIPTION_TIERS.find((tier) => tier.id === id) || null
}

export function getTierByPrice(price: number): SubscriptionTier | null {
  return SUBSCRIPTION_TIERS.find((tier) => tier.price === price) || null
}

export function getNextTier(currentTierId: string): SubscriptionTier | null {
  const currentIndex = SUBSCRIPTION_TIERS.findIndex((tier) => tier.id === currentTierId)
  if (currentIndex === -1 || currentIndex === SUBSCRIPTION_TIERS.length - 1) {
    return null
  }
  return SUBSCRIPTION_TIERS[currentIndex + 1]
}
