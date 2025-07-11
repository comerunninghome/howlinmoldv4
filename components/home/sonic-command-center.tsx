"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, ChevronRight, RadioTower, Waves } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context" // Assuming you have this for click sounds

export default function SonicCommandCenter() {
  const { playSound } = useSound()

  const handleEnterCoreClick = () => {
    playSound("ui-success") // Or a more specific "core-activate" sound
    // Navigation will be handled by the Link component
  }

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-black via-gray-900/80 to-black text-foreground overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2 }}
      >
        {/* Subtle background animated grid or particles if desired */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 gap-0">
          {Array.from({ length: 400 }).map((_, i) => (
            <motion.div
              key={i}
              className="border border-primary/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: Math.random() * 0.3 }}
              transition={{ duration: 0.5 + Math.random() * 2, delay: Math.random() * 1 }}
            />
          ))}
        </div>
      </motion.div>

      <div className="container mx-auto relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <RadioTower className="w-16 h-16 mx-auto mb-6 text-primary bb-static-glow" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-orbitron tracking-wider mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-accent subtle-hero-glow responsive-text-overlay-hero">
            Your Sonic Command Center
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 font-poetic max-w-3xl mx-auto leading-relaxed mb-12 responsive-text-overlay">
            Welcome to your Sonic Command Center.
            <br className="hidden sm:block" />
            From here, you can navigate through frequencies, uncover hidden connections, and orchestrate your own
            musical journey — deck by deck, signal by signal.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        >
          <Card className="max-w-2xl mx-auto bg-black/60 backdrop-blur-md border-primary/20 shadow-2xl shadow-primary/10 bb-interactive-border-accent overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-3">
                <Waves className="w-10 h-10 text-accent animate-pulse" style={{ animationDuration: "3s" }} />
              </div>
              <CardTitle className="text-3xl font-orbitron text-accent bb-interactive-link-glow">
                🌀 Activate Core Mode
              </CardTitle>
              <CardDescription className="text-slate-400 pt-2 font-poetic text-base">
                Tap the "Enter Core" button to strip away all distractions and access the raw interface — a ritual-grade
                control panel of decks, sigils, and sacred pathways.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-8">
              <Button
                asChild
                size="lg"
                className={cn(
                  "w-full sm:w-auto text-lg px-10 py-6 font-semibold",
                  "bg-gradient-to-r from-primary via-amber-500 to-primary hover:from-primary/90 hover:via-amber-400 hover:to-primary/90",
                  "text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-primary/40",
                  "bb-interactive-pulse-glow bb-interactive-bg-shimmer transition-all duration-300 transform hover:scale-105",
                )}
                onClick={handleEnterCoreClick}
              >
                <Link href="/core-interface">
                  {" "}
                  {/* Assuming /core-interface is the target path */}
                  <Zap className="w-5 h-5 mr-2.5" />
                  Enter Core
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <p className="mt-4 text-xs text-muted-foreground font-mono tracking-wider">
                — One click. Full control. —
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
