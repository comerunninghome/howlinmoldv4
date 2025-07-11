"use client"

import type React from "react"
import { createContext, useContext, useEffect } from "react"

const ThemeContext = createContext({})

export function useTheme() {
  return useContext(ThemeContext)
}

function generateSessionTheme() {
  const goldHue = 45 + (Math.random() - 0.5) * 10
  const amethystHue = 270 + (Math.random() - 0.5) * 20
  const cyanHue = 195 + (Math.random() - 0.5) * 20

  const theme = {
    "--background": `0 0% 2%`,
    "--background-start": `${amethystHue} 15% 8%`,
    "--foreground": `234 43% 94%`,

    "--card": `0 0% 6%`,
    "--card-glow": `${goldHue} 50% 60%`,

    "--primary": `${goldHue} 38% 54%`,
    "--primary-foreground": `${goldHue} 20% 10%`,

    "--secondary": `${amethystHue} 20% 30%`,
    "--secondary-foreground": `${amethystHue} 20% 85%`,

    "--accent": `${cyanHue} 80% 80%`,
    "--accent-foreground": `${cyanHue} 90% 15%`,

    "--border": `${goldHue} 20% 30%`,
    "--ring": `${goldHue} 40% 60%`,
  }

  return theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sessionTheme = generateSessionTheme()

    const root = document.documentElement
    for (const [key, value] of Object.entries(sessionTheme)) {
      root.style.setProperty(key, value)
    }
  }, [])

  return <ThemeContext.Provider value={{}}>{children}</ThemeContext.Provider>
}
