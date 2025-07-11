"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HowlinMoldSigil, SacredGeometry, RitualPhases, MythicText } from "./mythic-brand-system"
import { Eye, Headphones, Heart, Zap, Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context" // Import useSound

interface InitiationStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  ritual: string
  frequency: string
}

const initiationSteps: InitiationStep[] = [
  {
    id: "awakening",
    title: "The Awakening",
    description: "Recognize that music is more than sound—it is frequency, memory, and consciousness.",
    icon: <Eye className="w-8 h-8" />,
    ritual: "Close your eyes. Listen to the silence. What do you hear?",
    frequency: "432 Hz - The Universal Frequency",
  },
  {
    id: "attunement",
    title: "The Attunement",
    description: "Align your consciousness with the sacred frequencies that connect all sonic experience.",
    icon: <Headphones className="w-8 h-8" />,
    ritual: "Place your hands over your heart. Feel the rhythm within.",
    frequency: "528 Hz - The Love Frequency",
  },
  {
    id: "communion",
    title: "The Communion",
    description: "Join the collective consciousness of sonic archaeologists across time and space.",
    icon: <Heart className="w-8 h-8" />,
    ritual: "Speak your intention: 'I seek the frequencies that shape reality.'",
    frequency: "741 Hz - The Awakening Frequency",
  },
  {
    id: "transformation",
    title: "The Transformation",
    description: "Shed your identity as a consumer. Emerge as a curator of consciousness. Claim your unique resonance.",
    icon: <Zap className="w-8 h-8" />,
    ritual: "Choose your sacred name—the identity you carry in this realm.",
    frequency: "852 Hz - The Intuition Frequency",
  },
  {
    id: "initiation",
    title: "The Initiation",
    description: "Cross the threshold. You are no longer a visitor—you are a keeper of the frequencies.",
    icon: <Crown className="w-8 h-8" />,
    ritual: "Receive your sigil. Carry it as a symbol of your commitment to the path.",
    frequency: "963 Hz - The Divine Frequency",
  },
]

export function RitualOnboarding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [sacredName, setSacredName] = useState("")
  const { playSound } = useSound() // Use the hook

  const currentStepData = initiationSteps[currentStep]

  const handleNextStep = () => {
    playSound("ritualStep") // Play sound on step progression
    if (currentStep < initiationSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      localStorage.setItem("howlinMoldSacredName", sacredName.trim() || "Anonymous Seeker")
      localStorage.setItem("howlinMoldInitiated", "true")
      onComplete()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/30 to-black flex items-center justify-center p-4 overflow-hidden">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 1.02 }}
            transition={{ duration: 0.6, ease: [0.42, 0, 0.58, 1] }}
          >
            <Card className="bg-black/80 border-primary/30 backdrop-blur-xl shadow-[0_0_60px_hsl(var(--primary),0.25)]">
              <CardContent className="p-6 md:p-8">
                {/* ... (rest of the card header and content) ... */}
                <div className="text-center mb-6 md:mb-8">
                  <div className="mb-4 md:mb-6">
                    <HowlinMoldSigil
                      key={`sigil-${currentStep}`}
                      className="w-20 h-20 md:w-24 md:h-24 mx-auto text-primary"
                      animate
                      variant="complex"
                    />
                  </div>
                  <MythicText variant="title" className="text-primary mb-1 md:mb-2 font-poetic text-2xl md:text-3xl">
                    {currentStepData.title}
                  </MythicText>
                  <MythicText variant="caption" className="text-accent text-sm">
                    Step {currentStep + 1} of {initiationSteps.length}
                  </MythicText>
                </div>

                <div className="mb-6 md:mb-8">
                  <RitualPhases currentPhase={currentStep} />
                </div>

                <div className="text-center mb-6 md:mb-8">
                  <div className="mb-4 md:mb-6 flex justify-center">
                    <motion.div
                      key={`icon-container-${currentStep}`}
                      initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: "circOut" }}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-lg"
                    >
                      {currentStepData.icon}
                    </motion.div>
                  </div>

                  <MythicText
                    variant="body"
                    className="text-foreground/90 mb-4 md:mb-6 max-w-lg mx-auto text-base md:text-lg leading-relaxed"
                  >
                    {currentStepData.description}
                  </MythicText>

                  <motion.div
                    key={`details-${currentStep}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.5 }}
                    className="bg-primary/10 border border-primary/30 rounded-lg p-4 md:p-6 mb-6 md:mb-8"
                  >
                    <MythicText
                      variant="body"
                      className="text-primary mb-1 text-xs uppercase tracking-normal opacity-90 font-semibold"
                    >
                      Sacred Frequency
                    </MythicText>
                    <MythicText
                      variant="body"
                      className="text-accent mb-2 md:mb-4 text-lg md:text-xl font-medium tracking-tight"
                    >
                      {currentStepData.frequency}
                    </MythicText>
                    <MythicText variant="body" className="text-foreground/80 italic text-sm md:text-base">
                      "{currentStepData.ritual}"
                    </MythicText>
                  </motion.div>

                  {currentStepData.id === "transformation" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="mb-6 md:mb-8"
                    >
                      <MythicText variant="caption" className="text-primary mb-2 md:mb-3 text-md">
                        Claim Your Sonic Alias
                      </MythicText>
                      <Input
                        value={sacredName}
                        onChange={(e) => setSacredName(e.target.value)}
                        placeholder="Enter your alias (optional)"
                        className={cn(
                          "bg-black/50 border-primary/50 text-center font-orbitron tracking-wider text-base md:text-lg p-3",
                          "focus:bb-interactive-border-accent",
                        )}
                      />
                      <MythicText variant="caption" className="text-foreground/60 mt-2 text-xs px-4">
                        This name will mark your unique journey within the Howlin Mold. Leave blank for "Anonymous
                        Seeker".
                      </MythicText>
                    </motion.div>
                  )}

                  <div className="mb-6 md:mb-8 flex justify-center space-x-6 md:space-x-8">
                    <SacredGeometry.FlowerOfLife
                      key={`flower-${currentStep}`}
                      className="w-10 h-10 md:w-12 md:h-12 text-primary/40"
                      animate={true}
                    />
                    <SacredGeometry.Metatron
                      key={`metatron-${currentStep}`}
                      className="w-10 h-10 md:w-12 md:h-12 text-accent/40"
                      animate={true}
                    />
                    <SacredGeometry.SriYantra
                      key={`sriyantra-${currentStep}`}
                      className="w-10 h-10 md:w-12 md:h-12 text-secondary/40"
                      animate={true}
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleNextStep} // Use the new handler
                    className={cn(
                      "bg-accent hover:bg-accent/80 text-accent-foreground font-orbitron tracking-wider px-10 py-3 text-base md:text-lg",
                      "bb-interactive-border-accent bb-interactive-pulse-glow",
                    )}
                    size="lg"
                  >
                    {currentStep === initiationSteps.length - 1 ? "Complete Initiation" : "Continue Journey"}
                  </Button>
                </div>
                {/* ... (rest of the card content, progress indicator) ... */}
                <div className="mt-6 md:mt-8 flex justify-center space-x-2">
                  {initiationSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`
                        w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 ease-in-out
                        ${
                          index === currentStep
                            ? "bg-primary scale-125 shadow-[0_0_12px_hsl(var(--primary),0.9)]"
                            : index < currentStep
                              ? "bg-accent opacity-75"
                              : "bg-primary/30 opacity-50"
                        }
                      `}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
