"use client"

import { useEffect, useCallback, useRef } from "react"

const EVENTS_TO_LISTEN = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"]
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000

export function useSessionTimeout(onTimeout: () => void, timeoutInMs: number = FIFTEEN_MINUTES_IN_MS) {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current)
    }
    timeoutIdRef.current = setTimeout(onTimeout, timeoutInMs)
  }, [onTimeout, timeoutInMs])

  const eventHandler = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  useEffect(() => {
    resetTimer() // Start timer on mount

    EVENTS_TO_LISTEN.forEach((event) => {
      window.addEventListener(event, eventHandler, { passive: true })
    })

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current)
      }
      EVENTS_TO_LISTEN.forEach((event) => {
        window.removeEventListener(event, eventHandler)
      })
    }
  }, [resetTimer, eventHandler]) // Add eventHandler to dependencies
}
