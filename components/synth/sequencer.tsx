"use client"

import { useEffect } from "react"
import {
  Play,
  Pause,
  Copy,
  ClipboardPaste,
  Trash2,
  Plus,
  Link,
  Unlink,
  Undo2,
  Redo2,
  Sparkles,
  RepeatIcon as Record,
} from "lucide-react"
import { useAudioEngine, type Step, type PlaybackMode } from "@/contexts/audio-engine-context"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scales } from "@/lib/scales"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical } from "lucide-react"
import { SnapshotManager } from "./snapshot-manager"

const StepButton = ({
  step,
  noteIndex,
  stepIndex,
}: {
  step: Step
  noteIndex: number
  stepIndex: number
}) => {
  const { updateStep, currentStep, sequenceLength } = useAudioEngine()
  const isActive = step.active
  const isCurrent = currentStep === stepIndex
  const isDimmed = stepIndex >= sequenceLength

  const handleClick = () => {
    if (isDimmed) return
    const newStep = { ...step, active: !isActive }
    updateStep(noteIndex, stepIndex, newStep)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "w-full h-6 rounded-sm transition-all duration-150 ease-in-out border border-primary/20",
        isActive ? "bg-primary" : "bg-primary/10 hover:bg-primary/30",
        isCurrent && "ring-2 ring-offset-2 ring-offset-background ring-accent",
        isDimmed && "opacity-30 cursor-not-allowed",
      )}
      style={{
        boxShadow: isActive ? `0 0 8px 1px hsl(var(--primary))}` : "none",
        opacity: isActive ? step.velocity : undefined,
      }}
    />
  )
}

const PatternTab = ({ index }: { index: number }) => {
  const { currentPatternIndex, setPatternIndex, deletePattern, copyPattern, pastePattern, patterns } = useAudioEngine()
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: index })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const isOnlyPattern = patterns.length <= 1

  return (
    <div ref={setNodeRef} style={style} className="flex items-center group">
      <div
        {...attributes}
        {...listeners}
        className="p-1 cursor-grab touch-none text-muted-foreground hover:text-foreground"
      >
        <GripVertical className="h-4 w-4" />
      </div>
      <Button
        onClick={() => setPatternIndex(index)}
        variant={currentPatternIndex === index ? "secondary" : "ghost"}
        size="sm"
        className="flex-grow justify-start"
      >
        Pattern {index + 1}
      </Button>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => copyPattern(index)} variant="ghost" size="icon" className="h-7 w-7">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => pastePattern(index)} variant="ghost" size="icon" className="h-7 w-7">
                <ClipboardPaste className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Paste</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => deletePattern(index)}
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-destructive"
                disabled={isOnlyPattern}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export const Sequencer = () => {
  const {
    isSequencerPlaying,
    toggleSequencer,
    isRecording,
    toggleRecording,
    bpm,
    setBpm,
    swing,
    setSwing,
    sequenceLength,
    setSequenceLength,
    patterns,
    currentPatternIndex,
    clearCurrentPattern,
    humanizeCurrentPattern,
    rootNote,
    setRootNote,
    scaleType,
    setScaleType,
    addPattern,
    reorderPatterns,
    isChainModeActive,
    toggleChainMode,
    patternChain,
    setPatternChain,
    playbackMode,
    setPlaybackMode,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAudioEngine()

  const currentSequence = patterns[currentPatternIndex]

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent shortcuts from firing if an input is focused
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return
      }

      const isModifier = event.metaKey || event.ctrlKey

      if (isModifier && event.key.toLowerCase() === "z") {
        event.preventDefault()
        if (event.shiftKey) {
          if (canRedo) redo()
        } else {
          if (canUndo) undo()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [undo, redo, canUndo, canRedo])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = patterns.findIndex((_, i) => i === active.id)
      const newIndex = patterns.findIndex((_, i) => i === over.id)
      reorderPatterns(oldIndex, newIndex)
    }
  }

  const handleChainToggle = (index: number) => {
    const newChain = patternChain.includes(index) ? patternChain.filter((i) => i !== index) : [...patternChain, index]
    setPatternChain(newChain.sort((a, b) => a - b))
  }

  return (
    <div className="space-y-4 rounded-lg bg-black/20 p-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Button onClick={toggleSequencer} variant="outline" size="icon" title={isSequencerPlaying ? "Pause" : "Play"}>
            {isSequencerPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            onClick={toggleRecording}
            variant="outline"
            size="icon"
            title="Record MIDI Input"
            className={cn(isRecording && "bg-red-500/50 text-red-200 hover:bg-red-500/70")}
          >
            <Record className="h-4 w-4" />
          </Button>
          <Button onClick={undo} disabled={!canUndo} variant="outline" size="icon" title="Undo (Cmd+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button onClick={redo} disabled={!canRedo} variant="outline" size="icon" title="Redo (Cmd+Shift+Z)">
            <Redo2 className="h-4 w-4" />
          </Button>
          <SnapshotManager />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono w-20">BPM: {bpm.toFixed(0)}</span>
          <Slider value={[bpm]} onValueChange={(v) => setBpm(v[0])} min={40} max={240} step={1} className="w-32" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono w-24">Swing: {(swing * 100).toFixed(0)}%</span>
          <Slider
            value={[swing]}
            onValueChange={(v) => setSwing(v[0])}
            min={0}
            max={0.75}
            step={0.01}
            className="w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono w-24">Length: {sequenceLength}</span>
          <Slider
            value={[sequenceLength]}
            onValueChange={(v) => setSequenceLength(v[0])}
            min={1}
            max={16}
            step={1}
            className="w-32"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-48 space-y-2">
          <div className="flex items-center gap-2">
            <Button onClick={toggleChainMode} variant="outline" size="icon" title="Chain Mode">
              {isChainModeActive ? <Link className="h-4 w-4" /> : <Unlink className="h-4 w-4" />}
            </Button>
            <Button onClick={addPattern} variant="outline" size="icon" title="Add Pattern">
              <Plus className="h-4 w-4" />
            </Button>
            <Button onClick={clearCurrentPattern} variant="outline" size="icon" title="Clear Pattern">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button onClick={humanizeCurrentPattern} variant="outline" size="icon" title="Humanize">
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={patterns.map((_, i) => i)} strategy={verticalListSortingStrategy}>
                {patterns.map((_, index) =>
                  isChainModeActive ? (
                    <div key={index} className="flex items-center">
                      <Button
                        onClick={() => handleChainToggle(index)}
                        variant={patternChain.includes(index) ? "secondary" : "ghost"}
                        size="sm"
                        className="flex-grow justify-start"
                      >
                        Pattern {index + 1}
                      </Button>
                    </div>
                  ) : (
                    <PatternTab key={index} index={index} />
                  ),
                )}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        <div className="flex-grow space-y-1">
          {currentSequence &&
            currentSequence.map((row, noteIndex) => (
              <div key={noteIndex} className="grid grid-cols-16 gap-1 items-center">
                {row.map((step, stepIndex) => (
                  <StepButton key={stepIndex} step={step} noteIndex={noteIndex} stepIndex={stepIndex} />
                ))}
              </div>
            ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm">Root:</span>
          <Select value={String(rootNote)} onValueChange={(v) => setRootNote(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={String(60 + i)}>
                  {["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][i]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Scale:</span>
          <Select value={scaleType} onValueChange={(v) => setScaleType(v)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(scales).map((scaleName) => (
                <SelectItem key={scaleName} value={scaleName}>
                  {scaleName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Mode:</span>
          <ToggleGroup
            type="single"
            variant="outline"
            value={playbackMode}
            onValueChange={(v: PlaybackMode) => v && setPlaybackMode(v)}
          >
            <ToggleGroupItem value="forward">Forward</ToggleGroupItem>
            <ToggleGroupItem value="backward">Backward</ToggleGroupItem>
            <ToggleGroupItem value="pendulum">Pendulum</ToggleGroupItem>
            <ToggleGroupItem value="random">Random</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </div>
  )
}
