"use client"

import { motion } from "framer-motion"
import { Syne, Space_Grotesk } from "next/font/google"
import { cn } from "@/lib/utils"

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-syne",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export default function HeroSporeAnimation() {
  return (
    <div className="relative flex h-[calc(100vh-80px)] w-full items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {/* Placeholder for spore animation */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-primary/20"
            initial={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
              scale: 0,
              opacity: 0,
            }}
            animate={{
              x: Math.random() * 100 + "vw",
              y: Math.random() * 100 + "vh",
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: Math.random() * 5,
            }}
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
            }}
          />
        ))}
      </div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className={cn(
            "text-5xl font-extrabold tracking-tighter text-foreground sm:text-7xl md:text-8xl lg:text-9xl",
            syne.variable,
            "font-syne",
          )}
        >
          HOWLIN MOLD
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={cn(
            "mt-4 max-w-2xl text-lg text-muted-foreground md:text-xl",
            spaceGrotesk.variable,
            "font-space-grotesk",
          )}
        >
          A spore-node ecosystem for music discovery and sonic attunement. Connect, discover, create.
        </motion.p>
      </div>
    </div>
  )
}
