"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"

// Sacred Geometry Patterns
export const SacredGeometry = {
  FlowerOfLife: ({ className = "w-24 h-24", animate = false }: { className?: string; animate?: boolean }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <defs>
        <pattern id="flowerPattern" patternUnits="userSpaceOnUse" width="20" height="20">
          <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
        </pattern>
      </defs>
      <g className={animate ? "animate-spin" : ""} style={{ animationDuration: "60s" }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.7"
            transform={`rotate(${i * 60} 50 50) translate(15 0)`}
          />
        ))}
        <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  ),

  Metatron: ({ className = "w-24 h-24", animate = false }: { className?: string; animate?: boolean }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <g className={animate ? "animate-pulse" : ""}>
        {/* Outer hexagon */}
        <polygon
          points="50,10 80,30 80,70 50,90 20,70 20,30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.6"
        />
        {/* Inner connections */}
        <g opacity="0.8">
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="30" x2="80" y2="70" stroke="currentColor" strokeWidth="0.5" />
          <line x1="20" y1="70" x2="80" y2="30" stroke="currentColor" strokeWidth="0.5" />
        </g>
        {/* Central circle */}
        <circle cx="50" cy="50" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </g>
    </svg>
  ),

  SriYantra: ({ className = "w-24 h-24", animate = false }: { className?: string; animate?: boolean }) => (
    <svg viewBox="0 0 100 100" className={className}>
      <g className={animate ? "animate-spin" : ""} style={{ animationDuration: "120s" }}>
        {/* Outer triangles */}
        <polygon points="50,15 25,75 75,75" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        <polygon points="50,85 25,25 75,25" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
        {/* Inner triangles */}
        <polygon points="50,25 35,65 65,65" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
        <polygon points="50,75 35,35 65,35" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
        {/* Center point */}
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </g>
    </svg>
  ),
}

// Howlin Mold Primary Sigil
export const HowlinMoldSigil = ({
  className = "w-32 h-32",
  animate = false,
  variant = "primary",
}: {
  className?: string
  animate?: boolean
  variant?: "primary" | "minimal" | "complex"
}) => {
  const baseProps = {
    viewBox: "0 0 120 120",
    className: `${className} ${animate ? "animate-pulse" : ""}`,
  }

  if (variant === "minimal") {
    return (
      <svg {...baseProps}>
        <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="60" r="3" fill="currentColor" />
      </svg>
    )
  }

  if (variant === "complex") {
    return (
      <svg {...baseProps}>
        <defs>
          <radialGradient id="sigilGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </radialGradient>
        </defs>

        {/* Outer ring with notches */}
        <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="8,4" />

        {/* Sacred geometry base */}
        <g transform="translate(60,60)">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <g key={i} transform={`rotate(${angle})`}>
              <line x1="0" y1="-45" x2="0" y2="-35" stroke="currentColor" strokeWidth="2" />
              <line x1="0" y1="-25" x2="0" y2="-15" stroke="currentColor" strokeWidth="1" />
            </g>
          ))}
        </g>

        {/* Inner hexagon */}
        <polygon
          points="60,20 90,35 90,85 60,100 30,85 30,35"
          fill="url(#sigilGradient)"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Central trinity */}
        <circle cx="60" cy="45" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="45" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="75" cy="75" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" />

        {/* Core */}
        <circle cx="60" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="60" cy="60" r="4" fill="currentColor" />

        {/* Connecting lines */}
        <line x1="60" y1="45" x2="45" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="60" y1="45" x2="75" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
        <line x1="45" y1="75" x2="75" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.6" />
      </svg>
    )
  }

  // Primary variant
  return (
    <svg {...baseProps}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer protective circle */}
      <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4" />

      {/* Energy waves */}
      <circle
        cx="60"
        cy="60"
        r="45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
        strokeDasharray="5,5"
      />
      <circle
        cx="60"
        cy="60"
        r="35"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.8"
        strokeDasharray="3,3"
      />

      {/* Core sigil */}
      <g transform="translate(60,60)" filter="url(#glow)">
        {/* Cardinal directions */}
        <line x1="0" y1="-25" x2="0" y2="-15" stroke="currentColor" strokeWidth="3" />
        <line x1="0" y1="15" x2="0" y2="25" stroke="currentColor" strokeWidth="3" />
        <line x1="-25" y1="0" x2="-15" y2="0" stroke="currentColor" strokeWidth="3" />
        <line x1="15" y1="0" x2="25" y2="0" stroke="currentColor" strokeWidth="3" />

        {/* Diagonal rays */}
        <line x1="-18" y1="-18" x2="-10" y2="-10" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="-10" x2="18" y2="-18" stroke="currentColor" strokeWidth="2" />
        <line x1="-18" y1="18" x2="-10" y2="10" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="10" x2="18" y2="18" stroke="currentColor" strokeWidth="2" />

        {/* Central core */}
        <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="0" cy="0" r="3" fill="currentColor" />
      </g>
    </svg>
  )
}

// Ritual Phases Visualization
export const RitualPhases = ({ currentPhase = 0 }: { currentPhase?: number }) => {
  const phases = [
    { name: "Preparation", symbol: "◯", color: "text-blue-400" },
    { name: "Invocation", symbol: "◐", color: "text-purple-400" },
    { name: "Communion", symbol: "●", color: "text-amber-400" },
    { name: "Integration", symbol: "◑", color: "text-green-400" },
    { name: "Transcendence", symbol: "◉", color: "text-red-400" },
  ]

  return (
    <div className="flex items-center justify-center space-x-6">
      {phases.map((phase, index) => (
        <motion.div
          key={phase.name}
          className={`
        flex flex-col items-center space-y-2 transition-all duration-500
        ${index === currentPhase ? "scale-110" : "scale-90 opacity-60"}
      `}
          animate={{
            scale: index === currentPhase ? 1.1 : 0.9,
            opacity: index === currentPhase ? 1 : 0.6,
          }}
        >
          <div className={`text-3xl ${phase.color} ${index === currentPhase ? "animate-pulse" : ""}`}>
            {phase.symbol}
          </div>
          <span className={`text-xs font-orbitron tracking-wider ${phase.color}`}>{phase.name.toUpperCase()}</span>
        </motion.div>
      ))}
    </div>
  )
}

// Brand Manifesto Component
export const BrandManifesto = () => {
  const [currentLine, setCurrentLine] = useState(0)

  const manifestoLines = [
    "Music is not entertainment.",
    "It is archaeology of the soul.",
    "Every record holds a frequency.",
    "Every frequency holds a truth.",
    "We are not consumers.",
    "We are sonic archaeologists.",
    "This is not a platform.",
    "This is a ritual space.",
    "Welcome to the frequency.",
    "Welcome to Howlin Mold.",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentLine((prev) => (prev + 1) % manifestoLines.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [manifestoLines.length])

  return (
    <Card className="bg-black/80 border-primary/30 backdrop-blur-md">
      <CardContent className="p-8 text-center">
        <div className="mb-6">
          <HowlinMoldSigil className="w-16 h-16 mx-auto text-primary" animate />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentLine}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="h-16 flex items-center justify-center"
          >
            <p className="text-xl font-orbitron text-primary tracking-wider">{manifestoLines[currentLine]}</p>
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex justify-center space-x-1">
          {manifestoLines.map((_, index) => (
            <div
              key={index}
              className={`
            w-2 h-2 rounded-full transition-all duration-300
            ${index === currentLine ? "bg-primary scale-125" : "bg-primary/30"}
          `}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Mythic Typography System
export const MythicText = ({
  children,
  variant = "body",
  className = "",
}: {
  children: React.ReactNode
  variant?: "hero" | "title" | "subtitle" | "body" | "caption" | "sigil"
  className?: string
}) => {
  const variants = {
    hero: "text-6xl md:text-8xl font-orbitron font-bold tracking-wider sacred-text",
    title: "text-4xl md:text-5xl font-orbitron font-bold tracking-wide sacred-text",
    subtitle: "text-2xl md:text-3xl font-sans font-semibold tracking-wide",
    body: "text-base font-sans leading-relaxed", // Updated to font-sans (Inter)
    caption: "text-sm font-sans tracking-wider uppercase opacity-70",
    sigil: "text-xs font-sans tracking-[0.2em] uppercase font-bold",
  }

  return <div className={`${variants[variant]} ${className}`}>{children}</div>
}
