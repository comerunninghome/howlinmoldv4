"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { Zap, Users, Sparkles, Loader2, Search, Radio, Waves, Archive, ArrowRight, Brain, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import HeroSporeAnimation from "@/components/home/hero-spore-animation"
import type { SonicData, TasteProfiles } from "@/lib/scorer"
import SigilMatchCoreSection from "@/components/home/sigilmatch-core-section"
import SonicCommandCenter from "@/components/home/sonic-command-center"
import { SacredHierarchy } from "@/components/brand/sacred-hierarchy"
import { ErrorBoundary } from "@/components/debug/error-boundary"

// Lazy load components
const EnhancedNavigation = dynamic(
  () => import("@/components/enhanced-navigation").then((mod) => mod.EnhancedNavigation),
  {
    loading: () => <div className="h-16 bg-card/50 animate-pulse" />,
    ssr: false,
  },
)

const RitualDashboard = dynamic(() => import("@/components/ritual-dashboard"), {
  loading: () => (
    <Card className="h-96 bg-card/50">
      <CardContent className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </CardContent>
    </Card>
  ),
  ssr: false,
})

const BrandManifesto = dynamic(
  () => import("@/components/brand/brand-manifesto").then((mod) => ({ default: mod.BrandManifesto })),
  {
    loading: () => <div className="h-96 bg-card/50 animate-pulse rounded-lg" />,
    ssr: false,
  },
)

const SubconsciousMoodInput = dynamic(
  () =>
    import("@/components/mood-matching/subconscious-mood-input").then((mod) => ({
      default: mod.SubconsciousMoodInput,
    })),
  {
    loading: () => <div className="h-48 bg-card/50 animate-pulse rounded-lg" />,
    ssr: false,
  },
)

const CuratedTagDisplay = dynamic(
  () => import("@/components/tags/curated-tag-display").then((mod) => ({ default: mod.CuratedTagDisplay })),
  {
    loading: () => <div className="h-64 bg-card/50 animate-pulse rounded-lg" />,
    ssr: false,
  },
)

const SvgInteractiveSynth = dynamic(
  () => import("@/components/synth/svg-interactive-synth").then((mod) => mod.SvgInteractiveSynth),
  {
    loading: () => (
      <div className="my-12 p-6 bg-black/30 backdrop-blur-sm rounded-xl text-center">
        <Zap className="w-12 h-12 mx-auto mb-4 text-primary animate-pulse" />
        <p className="text-slate-400">Conjuring Sonic Altar...</p>
      </div>
    ),
    ssr: false,
  },
)

const SectionFallback = ({ sectionName }: { sectionName: string }) => (
  <Card className="border-yellow-500/50 bg-yellow-500/10">
    <CardContent className="p-8 text-center">
      <p className="text-yellow-400 mb-4">⚠️ {sectionName} temporarily unavailable</p>
      <Button asChild variant="outline">
        <Link href="/discover">Continue Exploring</Link>
      </Button>
    </CardContent>
  </Card>
)

const ecosystemNodes = [
  {
    title: "Sonic Radar",
    description: "AI-powered discovery engine that learns your taste and reveals hidden musical connections.",
    href: "/discover",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    stats: "12.5K discoveries",
  },
  {
    title: "Ritual Chamber",
    description: "Craft your unique sonic rituals and attune your senses to deeper frequencies.",
    href: "/ritual-mix",
    icon: Zap,
    color: "from-indigo-500 to-purple-500",
    stats: "789 rituals active",
  },
  {
    title: "Spore Network",
    description: "Connect with fellow sonic explorers and share your musical DNA across the ecosystem.",
    href: "/community",
    icon: Users,
    color: "from-green-500 to-emerald-500",
    stats: "3.2K active nodes",
  },
  {
    title: "Sonic Shrine",
    description: "Deep meditation space for sonic analysis and frequency attunement.",
    href: "/sonic-shrine",
    icon: Waves,
    color: "from-emerald-500 to-teal-500",
    stats: "2.1K sessions",
  },
  {
    title: "Mix Laboratory",
    description: "Professional-grade tools for creating and sharing your sonic experiments.",
    href: "/booth",
    icon: Radio,
    color: "from-red-500 to-pink-500",
    stats: "847 mixes created",
  },
  {
    title: "Artifact Vault",
    description: "Curated collection of rare sonic artifacts and treasures.",
    href: "/shop",
    icon: Archive,
    color: "from-amber-500 to-orange-500",
    stats: "1.5K artifacts",
  },
  {
    title: "Synth Temple",
    description: "Modular synthesis altar for ritual sound creation and frequency manipulation.",
    href: "/synth-temple",
    icon: Settings,
    color: "from-cyan-500 to-blue-500",
    stats: "∞ frequencies",
  },
]

function EcosystemGrid() {
  const router = useRouter()
  const { playSound } = useSound()

  const handleNodeClick = (href: string) => {
    playSound("click")
    router.push(href)
  }

  return (
    <section className="py-16 px-4 bg-black/40 backdrop-blur-md">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold font-orbitron mb-4 text-primary responsive-text-overlay">
            Explore the Spore Nodes
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed responsive-text-overlay">
            Each node in the Howlin Mold ecosystem is a gateway to unique sonic experiences and tools. Dive in and
            attune your senses.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {ecosystemNodes.map((node) => {
            const Icon = node.icon
            return (
              <Card
                key={node.title}
                className={cn(
                  "group cursor-pointer transition-all duration-300 hover:scale-105",
                  "bg-black/70 backdrop-blur-md border-primary/20 hover:border-primary/40",
                  "hover:shadow-[0_0_30px_hsl(var(--primary),0.2)] ecosystem-node spore-node-glow",
                )}
                onClick={() => handleNodeClick(node.href)}
              >
                <CardHeader className="flex flex-row items-center space-x-4 pb-3">
                  <div
                    className={cn(
                      "p-3 rounded-xl bg-gradient-to-br transition-all duration-300 group-hover:scale-110",
                      node.color,
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-foreground group-hover:text-primary transition-colors">
                    {node.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm text-muted-foreground group-hover:text-slate-300 transition-colors mb-3">
                    {node.description}
                  </CardDescription>
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="border-primary/30 text-primary/70">
                      <Sparkles className="w-3 h-3 mr-1.5" />
                      {node.stats}
                    </Badge>
                    <span className="flex items-center text-primary/70 group-hover:text-primary transition-colors">
                      Enter Node{" "}
                      <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-8">
    <Loader2 className="w-8 h-8 animate-spin text-primary" />
  </div>
)

const defaultTasteProfiles: TasteProfiles = {
  electronicPreference: true,
  electronicPreference_weight: 1.5,
  highBPMBoost: false,
  complexityAppreciation: true,
  complexityAppreciation_weight: 1.1,
  canonicalGenre: "Ambient",
  obscurityFactor: 0.5,
  experimentalTolerance: 0.7,
}

function IntelligentDecisionMakingSection() {
  const [results, setResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentNexus, setCurrentNexus] = useState<any | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).IntelligentDecisionMakingNexus) {
      setCurrentNexus(new (window as any).IntelligentDecisionMakingNexus(defaultTasteProfiles))
    }
  }, [])

  const runSimulation = async () => {
    if (!currentNexus) {
      setResults(["Error: Nexus not initialized. Please wait or refresh."])
      return
    }
    setIsLoading(true)
    setResults([])

    const logBuffer: string[] = []
    const originalConsoleLog = console.log
    const originalConsoleError = console.error
    const originalConsoleWarn = console.warn

    const captureLog = (type: string, ...args: any[]) => {
      const message = args
        .map((arg) => (typeof arg === "object" ? JSON.stringify(arg, null, 2) : String(arg)))
        .join(" ")
      logBuffer.push(`${type.toUpperCase()}: ${message}`)
      if (type === "log") originalConsoleLog(...args)
      if (type === "error") originalConsoleError(...args)
      if (type === "warn") originalConsoleWarn(...args)
    }

    console.log = (...args: any[]) => captureLog("log", ...args)
    console.error = (...args: any[]) => captureLog("error", ...args)
    console.warn = (...args: any[]) => captureLog("warn", ...args)

    const testCases: SonicData[] = [
      { genre: "Electronic", bpm: 128, key: "C Minor", melodicComplexity: "high", energyLevel: 0.8, danceability: 0.7 },
      { genre: "Rock", bpm: 90, key: "G Major", melodicComplexity: "low", energyLevel: 0.6, danceability: 0.3 },
      { genre: "Ambient", bpm: 70, key: "A Minor", melodicComplexity: "medium", energyLevel: 0.2, danceability: 0.1 },
      {
        genre: "Classical",
        bpm: 0,
        key: "D Major",
        melodicComplexity: "very high",
        energyLevel: 0.1,
        danceability: 0.05,
      },
      {
        genre: "Jazz",
        bpm: 110,
        key: "F# Minor",
        melodicComplexity: "high",
        improvisationLevel: "expert",
        energyLevel: 0.5,
        danceability: 0.4,
      },
      {
        genre: "Minimal Wave",
        bpm: 115,
        key: "E Minor",
        melodicComplexity: "low",
        energyLevel: 0.4,
        danceability: 0.6,
        obscurity: 0.9,
      },
      {
        genre: "Krautrock",
        bpm: 130,
        key: "D Major",
        melodicComplexity: "medium",
        energyLevel: 0.7,
        danceability: 0.5,
        experimentalScore: 0.8,
      },
    ]

    logBuffer.push("--- Starting Simulation ---")
    for (const testCase of testCases) {
      logBuffer.push(`\n--- Processing Test Case: ${JSON.stringify(testCase, null, 2)} ---`)
      try {
        await currentNexus.makeDecision(testCase)
      } catch (e: any) {
        console.error("Error during Nexus decision:", e.message, e.stack)
      }
      logBuffer.push("--- End Test Case ---")
      setResults([...logBuffer])
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
    logBuffer.push("\n--- Simulation Complete ---")

    console.log = originalConsoleLog
    console.error = originalConsoleError
    console.warn = originalConsoleWarn

    setResults(logBuffer)
    setIsLoading(false)
  }

  return (
    <section className="py-16 px-4 bg-black/50 backdrop-blur-sm">
      <div className="container mx-auto">
        <Card className="w-full max-w-4xl mx-auto shadow-2xl bg-card/80 border-primary/20">
          <CardHeader className="text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle className="text-3xl font-mythic tracking-wider text-primary responsive-text-overlay">
              Intelligent Decision Nexus
            </CardTitle>
            <CardDescription className="text-slate-300 responsive-text-overlay">
              Simulate the taste-based sonic scoring engine with dynamic feedback from ProphecyOracle & Canonizer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runSimulation}
              disabled={isLoading || !currentNexus}
              className="w-full mb-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3 bb-interactive-pulse-glow"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Conjuring Insights...
                </>
              ) : (
                "Run Sonic Scoring Simulation"
              )}
            </Button>
            <p className="text-sm text-muted-foreground mb-2">Simulation Log:</p>
            <ScrollArea className="h-[500px] w-full rounded-md border border-primary/30 p-4 bg-black/50 text-slate-300 text-xs font-mono shadow-inner">
              {results.length === 0 && !isLoading && (
                <div className="text-center text-slate-400 py-4">Click button to start simulation.</div>
              )}
              {results.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    line.startsWith("ERROR:")
                      ? "text-red-400"
                      : line.startsWith("WARN:")
                        ? "text-yellow-400"
                        : line.includes("Final Interpreted Decision:")
                          ? "text-primary font-bold mt-1"
                          : "text-slate-300",
                    "whitespace-pre-wrap break-all",
                  )}
                  dangerouslySetInnerHTML={{ __html: line.replace(/ /g, "&nbsp;").replace(/\n/g, "<br/>") }}
                />
              ))}
              {isLoading && !results.length && (
                <div className="text-center text-slate-400 py-4">Initializing simulation... Please wait.</div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground mx-auto text-center">
              This system demonstrates dynamic weighting of sonic scores based on predictive and canonical feedback.
              <br />
              Taste profiles, oracle predictions, and canonization rules are simulated.
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}

function SynthTempleCTA() {
  const { playSound } = useSound()

  const handleSynthTempleClick = () => {
    playSound("click")
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-cyan-900/20 via-blue-900/20 to-purple-900/20 backdrop-blur-sm border-y border-primary/10">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 mb-6 shadow-[0_0_40px_hsl(180,100%,50%,0.3)]">
              <Settings className="w-10 h-10 text-white animate-spin" style={{ animationDuration: "8s" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold font-orbitron mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 responsive-text-overlay">
              Enter the Synth Temple
            </h2>
            <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed responsive-text-overlay">
              Ascend to the sacred altar of modular synthesis. The{" "}
              <strong className="text-cyan-400">Vault Ritual Booth</strong> awaits your command— where frequencies bend
              to your will and sonic rituals are born from pure intention.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-orbitron text-cyan-400 mb-2">Modular Control</h3>
              <p className="text-sm text-slate-400">
                Three active decks with effect modules for infinite sonic possibilities
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-blue-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                <Waves className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-orbitron text-blue-400 mb-2">Canonization Core</h3>
              <p className="text-sm text-slate-400">
                Central processing hub with reverb, saturation, and master controls
              </p>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-purple-500/20">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-orbitron text-purple-400 mb-2">Sealing Reel</h3>
              <p className="text-sm text-slate-400">Capture and preserve your sonic rituals for eternity</p>
            </div>
          </div>

          <Button
            asChild
            size="lg"
            className="bb-interactive-border-accent bb-interactive-pulse-glow text-lg px-12 py-6 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white shadow-[0_0_30px_hsl(200,100%,50%,0.3)] hover:shadow-[0_0_40px_hsl(200,100%,50%,0.5)] transition-all duration-300"
            onClick={handleSynthTempleClick}
          >
            <Link href="/synth-temple">
              <Settings className="w-6 h-6 mr-3" />
              Ascend to the Synth Temple
              <ArrowRight className="w-6 h-6 ml-3" />
            </Link>
          </Button>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              <Sparkles className="w-3 h-3 mr-1" />
              Vault Ritual Booth
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10">
              <Waves className="w-3 h-3 mr-1" />
              Resonarium Integration
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-400 bg-purple-500/10">
              <Settings className="w-3 h-3 mr-1" />
              Modular Synthesis
            </Badge>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <ErrorBoundary componentName="HomePage">
        <HeroSporeAnimation />
        <main className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
          <div className="space-y-24 md:space-y-32 lg:space-y-48">
            <SigilMatchCoreSection />
            <SonicCommandCenter />
            <SacredHierarchy />
            <IntelligentDecisionMakingSection />
            <SynthTempleCTA />
          </div>
        </main>
      </ErrorBoundary>
    </div>
  )
}
