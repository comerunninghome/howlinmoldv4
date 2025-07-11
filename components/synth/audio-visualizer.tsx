"use client"

import type React from "react"

import { useRef, useEffect } from "react"
import { useAudioEngine } from "@/contexts/audio-engine-context"
import { cn } from "@/lib/utils"

interface AudioVisualizerProps {
  className?: string
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { analyserNode, isPlaying } = useAudioEngine()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !analyserNode) return

    const canvasCtx = canvas.getContext("2d")
    if (!canvasCtx) return

    analyserNode.fftSize = 256
    const bufferLength = analyserNode.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    let animationFrameId: number

    const draw = () => {
      animationFrameId = requestAnimationFrame(draw)

      analyserNode.getByteFrequencyData(dataArray)

      canvasCtx.fillStyle = "rgb(0 0 0 / 0.1)" // Fading effect
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let barHeight
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i]

        const r = barHeight + 25 * (i / bufferLength)
        const g = 250 * (i / bufferLength)
        const b = 50
        canvasCtx.fillStyle = `rgb(${r},${g},${b})`
        canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2)

        x += barWidth + 1
      }
    }

    if (isPlaying) {
      draw()
    } else {
      // Clear canvas when not playing
      canvasCtx.clearRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [analyserNode, isPlaying])

  return <canvas ref={canvasRef} className={cn("w-full h-48", className)} />
}
