"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useAudioEngine } from "@/contexts/audio-engine-context"
import { ChevronsDown, ChevronsUp, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

const KEY_MAP: Record<string, { midi: number; type: "white" | "black" }> = {
  a: { midi: 60, type: "white" }, // C4
  w: { midi: 61, type: "black" }, // C#4
  s: { midi: 62, type: "white" }, // D4
  e: { midi: 63, type: "black" }, // D#4
  d: { midi: 64, type: "white" }, // E4
  f: { midi: 65, type: "white" }, // F4
  t: { midi: 66, type: "black" }, // F#4
  g: { midi: 67, type: "white" }, // G4
  y: { midi: 68, type: "black" }, // G#4
  h: { midi: 69, type: "white" }, // A4
  u: { midi: 70, type: "black" }, // A#4
  j: { midi: 71, type: "white" }, // B4
  k: { midi: 72, type: "white" }, // C5
  o: { midi: 73, type: "black" }, // C#5
  l: { midi: 74, type: "white" }, // D5
  p: { midi: 75, type: "black" }, // D#5
  ";": { midi: 76, type: "white" }, // E5
}
const KEY_ORDER = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";"]

export const KeyboardInterface: React.FC = () => {
  const { noteOn, noteOff, isInitialized } = useAudioEngine()
  const [octave, setOctave] = useState(0)
  const [activeKeys, setActiveKeys] = useState(new Set<string>())
  const pressedKeysRef = useRef(new Set<string>())

  const handleNoteOn = useCallback(
    (key: string) => {
      if (!isInitialized) return
      const keyData = KEY_MAP[key]
      if (keyData) {
        const midiNote = keyData.midi + octave * 12
        noteOn(midiNote)
        setActiveKeys((prev) => new Set(prev.add(key)))
      }
    },
    [noteOn, octave, isInitialized],
  )

  const handleNoteOff = useCallback(
    (key: string) => {
      if (!isInitialized) return
      const keyData = KEY_MAP[key]
      if (keyData) {
        const midiNote = keyData.midi + octave * 12
        noteOff(midiNote)
        setActiveKeys((prev) => {
          const newSet = new Set(prev)
          newSet.delete(key)
          return newSet
        })
      }
    },
    [noteOff, octave, isInitialized],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return
      const key = e.key.toLowerCase()

      if (key === "z") return setOctave((o) => Math.max(-2, o - 1))
      if (key === "x") return setOctave((o) => Math.min(2, o + 1))

      if (KEY_MAP[key] && !pressedKeysRef.current.has(key)) {
        handleNoteOn(key)
        pressedKeysRef.current.add(key)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      if (KEY_MAP[key]) {
        handleNoteOff(key)
        pressedKeysRef.current.delete(key)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [handleNoteOn, handleNoteOff])

  const renderKeyboard = () => {
    const whiteKeyWidth = 40,
      blackKeyWidth = whiteKeyWidth * 0.6
    const whiteKeyHeight = 150,
      blackKeyHeight = whiteKeyHeight * 0.65
    const keyStroke = "hsl(var(--border))"
    const whiteFill = "hsl(var(--secondary-foreground) / 0.7)"
    const blackFill = "hsl(var(--secondary))"
    const activeFill = "hsl(var(--primary))"
    let currentX = 0
    const whiteKeys: React.ReactNode[] = []
    const blackKeys: React.ReactNode[] = []

    KEY_ORDER.forEach((keyChar) => {
      const keyData = KEY_MAP[keyChar]
      if (keyData.type === "white") {
        whiteKeys.push(
          <rect
            key={keyChar}
            x={currentX}
            y="0"
            width={whiteKeyWidth}
            height={whiteKeyHeight}
            fill={activeKeys.has(keyChar) ? activeFill : whiteFill}
            stroke={keyStroke}
            strokeWidth="1"
            className="cursor-pointer transition-colors duration-50"
            onMouseDown={() => handleNoteOn(keyChar)}
            onMouseUp={() => handleNoteOff(keyChar)}
            onMouseLeave={() => handleNoteOff(keyChar)}
          />,
        )
        currentX += whiteKeyWidth
      }
    })

    KEY_ORDER.forEach((keyChar) => {
      const keyData = KEY_MAP[keyChar]
      if (keyData.type === "black") {
        const whiteKeyIndex = KEY_ORDER.filter((k) => KEY_MAP[k].type === "white").indexOf(
          KEY_ORDER[KEY_ORDER.indexOf(keyChar) - 1],
        )
        const blackKeyX = (whiteKeyIndex + 1) * whiteKeyWidth - blackKeyWidth / 2
        blackKeys.push(
          <rect
            key={keyChar}
            x={blackKeyX}
            y="0"
            width={blackKeyWidth}
            height={blackKeyHeight}
            fill={activeKeys.has(keyChar) ? activeFill : blackFill}
            stroke={keyStroke}
            strokeWidth="1"
            className="cursor-pointer transition-colors duration-50"
            onMouseDown={(e) => {
              e.stopPropagation()
              handleNoteOn(keyChar)
            }}
            onMouseUp={(e) => {
              e.stopPropagation()
              handleNoteOff(keyChar)
            }}
            onMouseLeave={(e) => {
              e.stopPropagation()
              handleNoteOff(keyChar)
            }}
          />,
        )
      }
    })

    return (
      <svg
        width={whiteKeys.length * whiteKeyWidth}
        height={whiteKeyHeight}
        className="rounded-md overflow-hidden shadow-md border border-primary/20 select-none mx-auto"
      >
        {whiteKeys}
        {blackKeys}
      </svg>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4 my-8">
      <div className="flex items-center space-x-3 text-sm text-slate-300">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOctave((o) => Math.max(-2, o - 1))}
          title="Octave Down (Z)"
        >
          <ChevronsDown className="w-4 h-4" />
        </Button>
        <span className="font-mono w-24 text-center tabular-nums bg-background/50 px-2 py-1 rounded">
          Octave: {octave >= 0 ? "+" : ""}
          {octave}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOctave((o) => Math.min(2, o + 1))}
          title="Octave Up (X)"
        >
          <ChevronsUp className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setOctave(0)} title="Reset Octave" disabled={octave === 0}>
          <RotateCcw className="w-4 h-4 mr-1" /> Reset
        </Button>
      </div>
      {renderKeyboard()}
      <p className="text-xs text-slate-500 mt-2">
        Use your keyboard (A, S, D...) or click to play. Use Z/X for octaves.
      </p>
    </div>
  )
}
