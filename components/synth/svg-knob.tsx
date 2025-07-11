"use client"

import type React from "react"
import { useState, useCallback, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface SvgKnobProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  size?: number
  label?: string
  className?: string
  disabled?: boolean
}

export function SvgKnob({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  size = 60,
  label,
  className,
  disabled = false,
}: SvgKnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const [startValue, setStartValue] = useState(0)
  const knobRef = useRef<SVGSVGElement>(null)

  // Calculate angle based on value (270 degrees range, starting from -135 degrees)
  const normalizedValue = (value - min) / (max - min)
  const angle = -135 + normalizedValue * 270

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return
      e.preventDefault()
      setIsDragging(true)
      setStartY(e.clientY)
      setStartValue(value)
    },
    [disabled, value],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return
      e.preventDefault()

      const deltaY = startY - e.clientY // Inverted for natural feel
      const sensitivity = 0.5
      const deltaValue = deltaY * sensitivity
      const newValue = Math.max(min, Math.min(max, startValue + deltaValue))
      const steppedValue = Math.round(newValue / step) * step

      onChange(steppedValue)
    },
    [isDragging, disabled, startY, startValue, min, max, step, onChange],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (disabled) return
      e.preventDefault()
      const delta = e.deltaY > 0 ? -step : step
      const newValue = Math.max(min, Math.min(max, value + delta))
      onChange(newValue)
    },
    [disabled, step, min, max, value, onChange],
  )

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      <svg
        ref={knobRef}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        className={cn(
          "cursor-pointer select-none transition-transform",
          isDragging && "scale-105",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground/30"
        />

        {/* Value arc */}
        <path
          d={`M 15 65 A 35 35 0 ${normalizedValue > 0.5 ? 1 : 0} 1 ${
            50 + 35 * Math.cos((angle * Math.PI) / 180)
          } ${50 + 35 * Math.sin((angle * Math.PI) / 180)}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />

        {/* Center circle */}
        <circle cx="50" cy="50" r="8" fill="currentColor" className="text-foreground" />

        {/* Indicator line */}
        <line
          x1="50"
          y1="50"
          x2={50 + 25 * Math.cos((angle * Math.PI) / 180)}
          y2={50 + 25 * Math.sin((angle * Math.PI) / 180)}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-primary"
        />
      </svg>

      {label && (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-sm font-mono">{value.toFixed(1)}</div>
        </div>
      )}
    </div>
  )
}
