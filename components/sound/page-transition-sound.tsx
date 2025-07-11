"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useSound } from "@/contexts/sound-context"

export function PageTransitionSound() {
  const pathname = usePathname()
  const { playSound, isLoading } = useSound()
  const initialLoadRef = useRef(true)

  useEffect(() => {
    if (isLoading || initialLoadRef.current) {
      if (!isLoading) {
        // Only set initialLoadRef to false once sounds are loaded
        initialLoadRef.current = false
      }
      return
    }
    playSound("transition")
  }, [pathname, playSound, isLoading])

  return null
}
