"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Monitor, Smartphone, Tablet } from "lucide-react"

export function ResponsiveIndicator() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
  const [breakpoint, setBreakpoint] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setWindowSize({ width, height })

      // Determine breakpoint based on Tailwind CSS defaults
      if (width < 640) setBreakpoint("sm")
      else if (width < 768) setBreakpoint("md")
      else if (width < 1024) setBreakpoint("lg")
      else if (width < 1280) setBreakpoint("xl")
      else setBreakpoint("2xl")
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Show/hide with keyboard shortcut
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "R") {
        setIsVisible(!isVisible)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isVisible])

  const getDeviceIcon = () => {
    if (windowSize.width < 768) return Smartphone
    if (windowSize.width < 1024) return Tablet
    return Monitor
  }

  const getDeviceType = () => {
    if (windowSize.width < 768) return "Mobile"
    if (windowSize.width < 1024) return "Tablet"
    return "Desktop"
  }

  const DeviceIcon = getDeviceIcon()

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 rounded-full p-2 transition-all duration-200"
          title="Show responsive info (Ctrl+Shift+R)"
        >
          <DeviceIcon className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 bg-black/90 backdrop-blur-sm border-primary/30 p-3 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <DeviceIcon className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{getDeviceType()}</span>
        </div>
        <button onClick={() => setIsVisible(false)} className="text-muted-foreground hover:text-foreground text-xs">
          ×
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Size:</span>
          <span className="font-mono">
            {windowSize.width} × {windowSize.height}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Breakpoint:</span>
          <Badge variant="outline" className="text-xs">
            {breakpoint}
          </Badge>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">Orientation:</span>
          <span>{windowSize.width > windowSize.height ? "Landscape" : "Portrait"}</span>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t border-primary/20 text-xs text-muted-foreground">
        Press Ctrl+Shift+R to toggle
      </div>
    </Card>
  )
}
