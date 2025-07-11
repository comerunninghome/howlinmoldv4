"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HowlinMoldSigil, MythicText } from "./mythic-brand-system"
import { Volume2, VolumeX, Play, Pause } from "lucide-react"

const manifestoSections = [
  {
    title: "The Awakening",
    content: [
      "Music is not entertainment.",
      "It is archaeology of the soul.",
      "Every record holds a frequency.",
      "Every frequency holds a truth.",
    ],
    frequency: "432 Hz",
  },
  {
    title: "The Recognition",
    content: [
      "We are not consumers.",
      "We are sonic archaeologists.",
      "We do not buy music.",
      "We rescue frequencies from oblivion.",
    ],
    frequency: "528 Hz",
  },
  {
    title: "The Transformation",
    content: [
      "This is not a platform.",
      "This is a ritual space.",
      "This is not a marketplace.",
      "This is a sacred archive.",
    ],
    frequency: "741 Hz",
  },
  {
    title: "The Invitation",
    content: [
      "Welcome to the frequency.",
      "Welcome to the collective unconscious.",
      "Welcome to Howlin Mold.",
      "A sonic journey beyond sound—discover what was always inside you.",
    ],
    frequency: "963 Hz",
  },
]

const taglines = [
  "A Sonic Journey Beyond Sound—Discover What Was Always Inside You.",
  "Where Music Becomes Memory, Memory Becomes Myth.",
  "Rescue Frequencies. Preserve Consciousness. Transcend Reality.",
  "Not a Platform. A Portal.",
  "The Archaeology of Sound Begins Here.",
  "Frequency is Reality. Reality is Frequency.",
  "Join the Collective Unconscious.",
  "Music is Memory. Memory is Sacred.",
]

export function BrandManifesto() {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentLine, setCurrentLine] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [currentTagline, setCurrentTagline] = useState(0)

  const currentSectionData = manifestoSections[currentSection]

  useEffect(() => {
    if (isPlaying) {
      const timer = setInterval(() => {
        setCurrentLine((prev) => {
          if (prev >= currentSectionData.content.length - 1) {
            setCurrentSection((prevSection) => {
              if (prevSection >= manifestoSections.length - 1) {
                setIsPlaying(false)
                return 0
              }
              return prevSection + 1
            })
            return 0
          }
          return prev + 1
        })
      }, 3000)
      return () => clearInterval(timer)
    }
  }, [isPlaying, currentSection, currentSectionData.content.length])

  useEffect(() => {
    const taglineTimer = setInterval(() => {
      setCurrentTagline((prev) => (prev + 1) % taglines.length)
    }, 5000)
    return () => clearInterval(taglineTimer)
  }, [])

  const startManifesto = () => {
    setCurrentSection(0)
    setCurrentLine(0)
    setIsPlaying(true)
  }

  const pauseManifesto = () => {
    setIsPlaying(false)
  }

  return (
    <div className="space-y-8">
      {/* Main Manifesto Display */}
      <Card className="bg-gradient-to-br from-black via-purple-950/30 to-black border-primary/30 backdrop-blur-xl shadow-[0_0_50px_hsl(var(--primary),0.2)]">
        <CardContent className="p-8 md:p-12">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <HowlinMoldSigil
                className="w-24 h-24 md:w-32 md:h-32 mx-auto text-primary"
                animate={isPlaying}
                variant="complex"
              />
            </div>
            <MythicText variant="title" className="text-primary mb-4 text-2xl md:text-3xl">
              The Sacred Manifesto
            </MythicText>
          </div>

          {/* Section Header */}
          <div className="text-center mb-8">
            <MythicText variant="subtitle" className="text-accent mb-3 text-xl md:text-2xl">
              {currentSectionData.title}
            </MythicText>
            <MythicText variant="caption" className="text-secondary text-sm md:text-base">
              Resonating at {currentSectionData.frequency}
            </MythicText>
          </div>

          {/* Main Content Display */}
          <div className="mb-10">
            <div className="min-h-[120px] md:min-h-[140px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentSection}-${currentLine}`}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 1.1 }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="max-w-2xl text-center px-4"
                >
                  <MythicText
                    variant="hero"
                    className="text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-xl md:text-2xl lg:text-3xl leading-relaxed"
                  >
                    {currentSectionData.content[currentLine]}
                  </MythicText>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
            <Button
              onClick={isPlaying ? pauseManifesto : startManifesto}
              className="bg-primary hover:bg-primary/80 text-primary-foreground font-orbitron tracking-wider px-6 py-3 w-full sm:w-auto"
              size="lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause Transmission
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Begin Transmission
                </>
              )}
            </Button>

            <Button
              onClick={() => setAudioEnabled(!audioEnabled)}
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 w-full sm:w-auto"
              size="lg"
            >
              {audioEnabled ? (
                <>
                  <Volume2 className="w-5 h-5 mr-2" />
                  Audio On
                </>
              ) : (
                <>
                  <VolumeX className="w-5 h-5 mr-2" />
                  Audio Off
                </>
              )}
            </Button>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {manifestoSections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="flex items-center gap-1">
                  {section.content.map((_, lineIndex) => (
                    <div
                      key={`${sectionIndex}-${lineIndex}`}
                      className={`
                        w-2 h-2 rounded-full transition-all duration-300
                        ${
                          sectionIndex === currentSection && lineIndex === currentLine
                            ? "bg-primary scale-125 shadow-[0_0_10px_hsl(var(--primary),0.8)]"
                            : sectionIndex < currentSection ||
                                (sectionIndex === currentSection && lineIndex < currentLine)
                              ? "bg-accent"
                              : "bg-primary/30"
                        }
                      `}
                    />
                  ))}
                  {sectionIndex < manifestoSections.length - 1 && (
                    <div className="w-3 h-2 flex items-center justify-center mx-1">
                      <div className="w-2 h-px bg-primary/30" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rotating Taglines */}
      <Card className="bg-card/60 border-accent/30 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="text-center">
            <MythicText variant="caption" className="text-accent mb-4 text-sm">
              Sacred Taglines
            </MythicText>

            <div className="min-h-[80px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTagline}
                  initial={{ opacity: 0, rotateX: 90 }}
                  animate={{ opacity: 1, rotateX: 0 }}
                  exit={{ opacity: 0, rotateX: -90 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-3xl"
                >
                  <MythicText
                    variant="subtitle"
                    className="text-foreground italic text-base md:text-lg leading-relaxed"
                  >
                    "{taglines[currentTagline]}"
                  </MythicText>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-2 mt-4 flex-wrap">
              {taglines.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTagline(index)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300
                    ${index === currentTagline ? "bg-accent scale-125" : "bg-accent/30 hover:bg-accent/60"}
                  `}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Brand Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Frequency", description: "Everything is vibration", icon: "◯" },
          { title: "Memory", description: "Music preserves consciousness", icon: "◐" },
          { title: "Ritual", description: "Sacred acts create meaning", icon: "●" },
          { title: "Transcendence", description: "Beyond the physical realm", icon: "◉" },
        ].map((principle, index) => (
          <Card
            key={principle.title}
            className="bg-card/40 border-border/50 hover:border-primary/50 transition-all duration-300"
          >
            <CardContent className="p-4 md:p-6 text-center">
              <div className="text-3xl md:text-4xl text-primary mb-3 md:mb-4">{principle.icon}</div>
              <MythicText variant="subtitle" className="text-primary mb-2 text-sm md:text-base">
                {principle.title}
              </MythicText>
              <MythicText variant="body" className="text-foreground/70 text-xs md:text-sm">
                {principle.description}
              </MythicText>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
