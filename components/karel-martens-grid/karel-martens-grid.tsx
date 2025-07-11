"use client"

import { useState, useEffect, useMemo } from "react"
import type { Artifact } from "@/lib/artifacts"
import { mockArtifacts } from "@/lib/artifacts" // Using mock for now
import { GridItem } from "./grid-item"
import { calculateVisualProperties, type ArtifactVisualProperties } from "@/lib/karel-martens-visuals"
import { Button } from "@/components/ui/button"
import { RefreshCw, Palette, Clock } from "lucide-react"

// Define a few layout structures. Each number could represent a relative size or priority.
const layouts = {
  temporalFocus: [
    // Emphasizes items with strong temporal weight
    { id: "l1", colSpan: 3, rowSpan: 2 },
    { id: "l2", colSpan: 1, rowSpan: 1 },
    { id: "l3", colSpan: 1, rowSpan: 1 },
    { id: "l4", colSpan: 2, rowSpan: 2 },
    { id: "l5", colSpan: 1, rowSpan: 1 },
    { id: "l6", colSpan: 3, rowSpan: 1 },
    { id: "l7", colSpan: 2, rowSpan: 1 },
    { id: "l8", colSpan: 2, rowSpan: 2 },
  ],
  genreFocus: [
    // Emphasizes items with strong genre weight
    { id: "g1", colSpan: 1, rowSpan: 2 },
    { id: "g2", colSpan: 3, rowSpan: 1 },
    { id: "g3", colSpan: 2, rowSpan: 2 },
    { id: "g4", colSpan: 1, rowSpan: 1 },
    { id: "g5", colSpan: 2, rowSpan: 1 },
    { id: "g6", colSpan: 1, rowSpan: 2 },
    { id: "g7", colSpan: 3, rowSpan: 2 },
    { id: "g8", colSpan: 1, rowSpan: 1 },
  ],
  balanced: [
    { id: "b1", colSpan: 2, rowSpan: 2 },
    { id: "b2", colSpan: 2, rowSpan: 1 },
    { id: "b3", colSpan: 1, rowSpan: 1 },
    { id: "b4", colSpan: 1, rowSpan: 2 },
    { id: "b5", colSpan: 2, rowSpan: 1 },
    { id: "b6", colSpan: 2, rowSpan: 2 },
    { id: "b7", colSpan: 1, rowSpan: 1 },
    { id: "b8", colSpan: 3, rowSpan: 1 },
  ],
}

type LayoutType = keyof typeof layouts

export function KarelMartensGrid() {
  const [artifacts, setArtifacts] = useState<Artifact[]>([])
  const [visuals, setVisuals] = useState<Record<string, ArtifactVisualProperties>>({})
  const [currentLayout, setCurrentLayout] = useState<LayoutType>("balanced")
  const [opacityFilter, setOpacityFilter] = useState<number>(0.1) // Min opacity to show

  useEffect(() => {
    // In a real app, fetch artifacts. Using mock for now.
    // Shuffle mock artifacts for variety on refresh/layout change
    const shuffledArtifacts = [...mockArtifacts].sort(() => 0.5 - Math.random())
    setArtifacts(shuffledArtifacts.slice(0, 8)) // Take first 8 for the defined layout slots
  }, [currentLayout]) // Re-shuffle when layout changes for demo purposes

  useEffect(() => {
    const newVisuals: Record<string, ArtifactVisualProperties> = {}
    artifacts.forEach((artifact, index) => {
      const layoutConfig = layouts[currentLayout][index % layouts[currentLayout].length]
      newVisuals[artifact.id] = calculateVisualProperties(
        artifact,
        currentLayout,
        layoutConfig.colSpan,
        layoutConfig.rowSpan,
      )
    })
    setVisuals(newVisuals)
  }, [artifacts, currentLayout])

  const gridItems = useMemo(() => {
    return artifacts
      .map((artifact, index) => {
        const visualProps = visuals[artifact.id]
        if (!visualProps || visualProps.opacity < opacityFilter) return null

        const gridColumn = `span ${visualProps.colSpan || 1} / span ${visualProps.colSpan || 1}`
        const gridRow = `span ${visualProps.rowSpan || 1} / span ${visualProps.rowSpan || 1}`

        return (
          <div
            key={artifact.id}
            style={{
              gridColumn,
              gridRow,
              // backgroundColor: `hsla(${index * 40}, 70%, 50%, 0.1)`, // For debugging layout
            }}
            className="relative transition-all duration-1000 ease-in-out"
          >
            <GridItem artifact={artifact} visualProperties={visualProps} />
          </div>
        )
      })
      .filter(Boolean)
  }, [artifacts, visuals, opacityFilter])

  const regenerateLayout = () => {
    // Cycle through layouts or pick randomly for a more dynamic "refresh"
    const layoutKeys = Object.keys(layouts) as LayoutType[]
    const currentIndex = layoutKeys.indexOf(currentLayout)
    const nextIndex = (currentIndex + 1) % layoutKeys.length
    setCurrentLayout(layoutKeys[nextIndex])
  }

  return (
    <div className="p-4 md:p-8 bg-slate-900 min-h-screen">
      <div className="mb-8 p-4 bg-slate-800/50 rounded-lg shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-orbitron text-purple-300">Glyphic Resonance Grid</h2>
          <p className="text-slate-400 text-sm">
            Inspired by Karel Martens. Current Focus:{" "}
            <span className="font-semibold text-amber-400">{currentLayout}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={regenerateLayout}
            variant="outline"
            size="sm"
            className="border-purple-400 text-purple-300 hover:bg-purple-400/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Shift Focus
          </Button>
          <Button
            onClick={() => setCurrentLayout("temporalFocus")}
            variant="outline"
            size="sm"
            className="border-sky-400 text-sky-300 hover:bg-sky-400/10"
          >
            <Clock className="w-4 h-4 mr-2" /> Temporal
          </Button>
          <Button
            onClick={() => setCurrentLayout("genreFocus")}
            variant="outline"
            size="sm"
            className="border-emerald-400 text-emerald-300 hover:bg-emerald-400/10"
          >
            <Palette className="w-4 h-4 mr-2" /> Genre
          </Button>
        </div>
        <div className="w-full mt-2">
          <label htmlFor="opacityFilter" className="text-sm text-slate-400 mr-2">
            Min. Opacity:
          </label>
          <input
            type="range"
            id="opacityFilter"
            min="0"
            max="1"
            step="0.05"
            value={opacityFilter}
            onChange={(e) => setOpacityFilter(Number.parseFloat(e.target.value))}
            className="w-48 accent-purple-500"
          />
          <span className="ml-2 text-slate-300 text-xs">{opacityFilter.toFixed(2)}</span>
        </div>
      </div>

      {artifacts.length > 0 ? (
        <div
          className="grid grid-cols-4 md:grid-cols-6 gap-2 md:gap-4 transition-all duration-1000 ease-in-out"
          style={
            {
              // aspectRatio: '16/9', // Maintain aspect ratio for the grid
            }
          }
        >
          {gridItems}
        </div>
      ) : (
        <p className="text-center text-slate-500">Loading glyphs...</p>
      )}
    </div>
  )
}
