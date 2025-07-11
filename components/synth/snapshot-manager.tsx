"use client"

import React, { useState, useMemo, useRef } from "react"
import { useAudioEngine, type Snapshot, type SynthState } from "@/contexts/audio-engine-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Camera, ArrowUp, ArrowDown, Pencil, Save, Trash2, FileDown, FileUp, Undo2 } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { validateSnapshotsData } from "@/lib/snapshot-validator"

type Conflict = {
  name: string
  imported: Snapshot
  existing: Snapshot
}

type Resolution = {
  action: "overwrite" | "skip" | "rename"
  newName: string
}

const SequenceDiffView = ({
  existingPatterns,
  importedPatterns,
}: {
  existingPatterns: SynthState["patterns"]
  importedPatterns: SynthState["patterns"]
}) => {
  const existingLength = existingPatterns.length
  const importedLength = importedPatterns.length
  const isLengthDifferent = existingLength !== importedLength

  const getActiveSteps = (pattern: SynthState["patterns"][number]) => {
    if (!pattern) return 0
    return pattern.flat().filter((step) => step && step.active).length
  }

  return (
    <div className="mt-3 pt-3 border-t border-muted-foreground/20">
      <h5 className="font-semibold mb-1">Sequences</h5>
      <div className="grid grid-cols-3 gap-x-2 gap-y-1">
        <div className="truncate">Patterns</div>
        <div className="text-right">{existingLength}</div>
        <div className={`text-right ${isLengthDifferent ? "text-amber-400 font-bold" : ""}`}>{importedLength}</div>
      </div>
      {Array.from({ length: Math.max(existingLength, importedLength) }).map((_, i) => {
        const existingPattern = existingPatterns[i]
        const importedPattern = importedPatterns[i]
        const isDifferent = JSON.stringify(existingPattern) !== JSON.stringify(importedPattern)

        if (!existingPattern) {
          return (
            <div key={i} className="grid grid-cols-3 gap-x-2 gap-y-1 col-span-3 text-green-400">
              <div>Pattern {i + 1}</div>
              <div className="text-right col-span-2">(New) Active Steps: {getActiveSteps(importedPattern)}</div>
            </div>
          )
        }
        if (!importedPattern) {
          return (
            <div key={i} className="grid grid-cols-3 gap-x-2 gap-y-1 col-span-3 text-red-400">
              <div>Pattern {i + 1}</div>
              <div className="text-right col-span-2">(Removed)</div>
            </div>
          )
        }

        return (
          <div key={i} className="grid grid-cols-3 gap-x-2 gap-y-1 col-span-3">
            <div>Pattern {i + 1}</div>
            <div className="text-right col-span-2">
              {isDifferent ? (
                <span className="text-amber-400 font-bold">
                  Modified (Steps: {getActiveSteps(existingPattern)} vs {getActiveSteps(importedPattern)})
                </span>
              ) : (
                <span>Identical</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const ConflictDiffView = ({
  existingState,
  importedState,
}: {
  existingState: SynthState
  importedState: SynthState
}) => {
  const paramsToCompare: (keyof SynthState)[] = [
    "oscillatorType",
    "filterCutoff",
    "filterQ",
    "filterType",
    "attack",
    "decay",
    "sustain",
    "release",
    "lfoRate",
    "lfoDepth",
    "lfoWaveform",
    "bpm",
    "swing",
    "sequenceLength",
    "playbackMode",
  ]

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toFixed(2)
    }
    return String(value)
  }

  return (
    <div className="mt-2 p-2 bg-background/50 rounded-md text-xs">
      <div className="grid grid-cols-3 gap-x-2 gap-y-1 font-mono">
        <div className="font-semibold text-muted-foreground">Parameter</div>
        <div className="font-semibold text-muted-foreground text-right">Existing</div>
        <div className="font-semibold text-muted-foreground text-right">Imported</div>
        {paramsToCompare.map((key) => {
          const existingValue = existingState[key]
          const importedValue = importedState[key]
          const isDifferent = JSON.stringify(existingValue) !== JSON.stringify(importedValue)

          return (
            <React.Fragment key={key}>
              <div className="truncate">{key}</div>
              <div className="text-right">{formatValue(existingValue)}</div>
              <div className={`text-right ${isDifferent ? "text-amber-400 font-bold" : ""}`}>
                {formatValue(importedValue)}
              </div>
            </React.Fragment>
          )
        })}
      </div>
      <SequenceDiffView existingPatterns={existingState.patterns} importedPatterns={importedState.patterns} />
    </div>
  )
}

const SnapshotItem = ({
  name,
  onLoad,
  onDelete,
}: {
  name: string
  onLoad: (name: string) => void
  onDelete: (name: string) => void
}) => {
  const { snapshots, updateSnapshotDescription, updateSnapshotTags } = useAudioEngine()
  const snapshot = snapshots[name]
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(snapshot.description)
  const [tags, setTags] = useState((snapshot.tags || []).join(", "))

  const handleSave = () => {
    updateSnapshotDescription(name, description)
    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    updateSnapshotTags(name, tagArray)
    setIsEditing(false)
  }

  if (!snapshot) return null

  return (
    <div className="flex flex-col gap-2 p-2 rounded-md border border-transparent hover:border-muted-foreground/20 hover:bg-muted/50">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="font-mono text-sm font-semibold truncate">{name}</span>
          <span className="text-xs text-muted-foreground">{new Date(snapshot.timestamp).toLocaleString()}</span>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Button size="sm" variant="outline" onClick={() => onLoad(name)}>
            Load
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete(name)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {snapshot.tags && snapshot.tags.length > 0 && !isEditing && (
        <div className="flex flex-wrap gap-1 pt-1">
          {snapshot.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {isEditing ? (
        <div className="space-y-2 pt-2">
          <Label htmlFor={`desc-${name}`} className="text-xs font-semibold">
            Description
          </Label>
          <Textarea
            id={`desc-${name}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Snapshot description..."
            rows={2}
          />
          <Label htmlFor={`tags-${name}`} className="text-xs font-semibold">
            Tags (comma-separated)
          </Label>
          <Input
            id={`tags-${name}`}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g. ambient, pad, lead"
          />
          <Button size="sm" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      ) : (
        snapshot.description && (
          <p className="text-sm text-muted-foreground italic pl-1 border-l-2 border-muted-foreground/20">
            {snapshot.description}
          </p>
        )
      )}
    </div>
  )
}

export const SnapshotManager = () => {
  const { snapshots, saveSnapshot, loadSnapshot, deleteSnapshot, importSnapshots, addSnapshot, setAllSnapshots } =
    useAudioEngine()
  const [snapshotName, setSnapshotName] = useState("")
  const [snapshotDescription, setSnapshotDescription] = useState("")
  const [snapshotTags, setSnapshotTags] = useState("")
  const [open, setOpen] = useState(false)
  const [sortKey, setSortKey] = useState<"name" | "date">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [filterTerm, setFilterTerm] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // State for conflict resolution
  const [conflicts, setConflicts] = useState<Conflict[]>([])
  const [resolutions, setResolutions] = useState<Record<string, Resolution>>({})
  const [pendingNonConflicts, setPendingNonConflicts] = useState<Record<string, Snapshot>>({})
  const [isConflictDialogOpen, setIsConflictDialogOpen] = useState(false)
  const [renameSuffix, setRenameSuffix] = useState("_imported")

  // State for undo actions
  const [recentlyDeleted, setRecentlyDeleted] = useState<{ name: string; snapshot: Snapshot } | null>(null)
  const undoDeleteTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [lastImport, setLastImport] = useState<{ previousState: Record<string, Snapshot> } | null>(null)
  const undoImportTimerRef = useRef<NodeJS.Timeout | null>(null)

  const handleSave = () => {
    if (snapshotName.trim()) {
      const tagArray = snapshotTags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
      saveSnapshot(snapshotName.trim(), snapshotDescription, tagArray)
      setSnapshotName("")
      setSnapshotDescription("")
      setSnapshotTags("")
    }
  }

  const handleLoad = (name: string) => {
    loadSnapshot(name)
    setOpen(false)
  }

  const handleDelete = (name: string) => {
    if (undoDeleteTimerRef.current) {
      clearTimeout(undoDeleteTimerRef.current)
    }
    const snapshotToDelete = snapshots[name]
    if (snapshotToDelete) {
      deleteSnapshot(name)
      setRecentlyDeleted({ name, snapshot: snapshotToDelete })
      undoDeleteTimerRef.current = setTimeout(() => {
        setRecentlyDeleted(null)
      }, 5000) // 5 seconds to undo
    }
  }

  const handleUndoDelete = () => {
    if (recentlyDeleted) {
      addSnapshot(recentlyDeleted.name, recentlyDeleted.snapshot)
      setRecentlyDeleted(null)
      if (undoDeleteTimerRef.current) {
        clearTimeout(undoDeleteTimerRef.current)
        undoDeleteTimerRef.current = null
      }
    }
  }

  const handleUndoImport = () => {
    if (lastImport) {
      setAllSnapshots(lastImport.previousState)
      setLastImport(null)
      if (undoImportTimerRef.current) {
        clearTimeout(undoImportTimerRef.current)
        undoImportTimerRef.current = null
      }
    }
  }

  const handleExport = () => {
    if (Object.keys(snapshots).length === 0) {
      alert("No snapshots to export.")
      return
    }
    const jsonString = JSON.stringify(snapshots, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `howlin-snapshots-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result
        if (typeof text !== "string") throw new Error("File content is not a string.")

        const parsedJson = JSON.parse(text)
        const validationResult = validateSnapshotsData(parsedJson)

        if (!validationResult.isValid || !validationResult.data) {
          throw new Error(validationResult.error || "Unknown validation error")
        }

        const importedData = validationResult.data

        const foundConflicts: Conflict[] = []
        const nonConflicts: Record<string, Snapshot> = {}
        const initialResolutions: Record<string, Resolution> = {}

        for (const name in importedData) {
          if (Object.prototype.hasOwnProperty.call(snapshots, name)) {
            foundConflicts.push({ name, imported: importedData[name], existing: snapshots[name] })
            initialResolutions[name] = { action: "skip", newName: `${name}${renameSuffix}` }
          } else {
            nonConflicts[name] = importedData[name]
          }
        }

        if (foundConflicts.length > 0) {
          setConflicts(foundConflicts)
          setResolutions(initialResolutions)
          setPendingNonConflicts(nonConflicts)
          setIsConflictDialogOpen(true)
        } else {
          setLastImport({ previousState: { ...snapshots } })
          importSnapshots(nonConflicts)
          if (undoImportTimerRef.current) clearTimeout(undoImportTimerRef.current)
          undoImportTimerRef.current = setTimeout(() => setLastImport(null), 10000)
        }
      } catch (error) {
        console.error("Failed to import snapshots:", error)
        alert(`Failed to import snapshots: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }
    reader.readAsText(file)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleConfirmImport = () => {
    const finalSnapshots: Record<string, Snapshot> = { ...pendingNonConflicts }
    let hasError = false

    for (const conflict of conflicts) {
      const resolution = resolutions[conflict.name]
      if (resolution.action === "overwrite") {
        finalSnapshots[conflict.name] = conflict.imported
      } else if (resolution.action === "rename") {
        const newName = resolution.newName.trim()
        if (!newName) {
          alert(`Please provide a new name for "${conflict.name}".`)
          hasError = true
          break
        }
        if (snapshots[newName] || finalSnapshots[newName]) {
          alert(`The new name "${newName}" already exists. Please choose another name.`)
          hasError = true
          break
        }
        finalSnapshots[newName] = conflict.imported
      }
    }

    if (hasError) return

    setLastImport({ previousState: { ...snapshots } })
    importSnapshots(finalSnapshots)
    if (undoImportTimerRef.current) clearTimeout(undoImportTimerRef.current)
    undoImportTimerRef.current = setTimeout(() => setLastImport(null), 10000)

    setIsConflictDialogOpen(false)
    setConflicts([])
    setResolutions({})
    setPendingNonConflicts({})
  }

  const handleSetAllResolutions = (action: "overwrite" | "skip") => {
    setResolutions((prev) => {
      const newResolutions = { ...prev }
      conflicts.forEach((conflict) => {
        newResolutions[conflict.name] = { ...newResolutions[conflict.name], action }
      })
      return newResolutions
    })
  }

  const handleRenameAll = () => {
    if (!renameSuffix.trim()) {
      alert("Please provide a suffix for renaming.")
      return
    }
    setResolutions((prev) => {
      const newResolutions = { ...prev }
      conflicts.forEach((conflict) => {
        newResolutions[conflict.name] = { action: "rename", newName: `${conflict.name}${renameSuffix}` }
      })
      return newResolutions
    })
  }

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    Object.values(snapshots).forEach((snapshot) => {
      ;(snapshot.tags || []).forEach((tag) => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [snapshots])

  const sortedAndFilteredSnapshots = useMemo(() => {
    return Object.entries(snapshots)
      .filter(([name, snapshot]) => {
        if (selectedTag && !(snapshot.tags || []).includes(selectedTag)) return false
        const term = filterTerm.toLowerCase()
        if (!term) return true
        const tagsMatch = (snapshot.tags || []).some((tag) => tag.toLowerCase().includes(term))
        return name.toLowerCase().includes(term) || snapshot.description.toLowerCase().includes(term) || tagsMatch
      })
      .sort(([nameA, a], [nameB, b]) => {
        if (sortKey === "name") return sortOrder === "asc" ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
        return sortOrder === "asc" ? a.timestamp - b.timestamp : b.timestamp - a.timestamp
      })
  }, [snapshots, filterTerm, sortKey, sortOrder, selectedTag])

  const handleTagClick = (tag: string) => {
    setSelectedTag((currentTag) => (currentTag === tag ? null : tag))
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="Snapshots">
                  <Camera className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>Manage Snapshots</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-md bg-background/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>State Snapshots</DialogTitle>
            <DialogDescription>Save and load the complete state of the synthesizer.</DialogDescription>
          </DialogHeader>
          {lastImport && !isConflictDialogOpen && (
            <div className="p-2 my-2 rounded-md bg-green-900/50 text-green-200 flex justify-between items-center text-sm">
              <span>Import successful.</span>
              <Button variant="ghost" size="sm" onClick={handleUndoImport}>
                <Undo2 className="mr-2 h-4 w-4" />
                Undo
              </Button>
            </div>
          )}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="snapshot-name">New Snapshot</Label>
              <Input
                id="snapshot-name"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="Snapshot name..."
              />
              <Textarea
                id="snapshot-description"
                value={snapshotDescription}
                onChange={(e) => setSnapshotDescription(e.target.value)}
                placeholder="Optional description..."
                rows={2}
              />
              <Input
                id="snapshot-tags"
                value={snapshotTags}
                onChange={(e) => setSnapshotTags(e.target.value)}
                placeholder="Tags, comma-separated..."
              />
              <Button
                onClick={handleSave}
                disabled={!snapshotName.trim()}
                className="w-full"
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
              >
                Save Current State
              </Button>
            </div>
            <Separator className="my-2" />
            <div className="space-y-2">
              <Label>Saved Snapshots</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Filter by name, desc, or tag..."
                  value={filterTerm}
                  onChange={(e) => setFilterTerm(e.target.value)}
                  className="flex-grow"
                />
                <ToggleGroup
                  type="single"
                  value={sortKey}
                  onValueChange={(value: "name" | "date") => value && setSortKey(value)}
                >
                  <ToggleGroupItem value="date">Date</ToggleGroupItem>
                  <ToggleGroupItem value="name">Name</ToggleGroupItem>
                </ToggleGroup>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                >
                  {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                </Button>
              </div>
              {allTags.length > 0 && (
                <div className="space-y-2 pt-2">
                  <Label className="text-xs font-semibold">Filter by Tag</Label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => handleTagClick(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <ScrollArea className="h-64 w-full rounded-md border">
              <div className="p-2 space-y-2">
                {recentlyDeleted && (
                  <div className="p-2 rounded-md bg-yellow-900/50 text-yellow-200 flex justify-between items-center text-sm">
                    <span>
                      Snapshot "<strong>{recentlyDeleted.name}</strong>" deleted.
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleUndoDelete}>
                      <Undo2 className="mr-2 h-4 w-4" />
                      Undo
                    </Button>
                  </div>
                )}
                {sortedAndFilteredSnapshots.length > 0 ? (
                  sortedAndFilteredSnapshots.map(([name]) => (
                    <SnapshotItem key={name} name={name} onLoad={handleLoad} onDelete={handleDelete} />
                  ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">No snapshots found.</div>
                )}
              </div>
            </ScrollArea>
          </div>
          <DialogFooter className="sm:justify-between">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".json"
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileUp className="mr-2 h-4 w-4" />
                Import
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <FileDown className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isConflictDialogOpen} onOpenChange={setIsConflictDialogOpen}>
        <DialogContent className="max-w-2xl bg-background/90 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Resolve Import Conflicts</DialogTitle>
            <DialogDescription>
              Some snapshots in the file you are importing already exist. Choose an action for each conflict.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 border-b space-y-3 bg-muted/30">
            <h4 className="font-semibold text-sm">Bulk Actions</h4>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => handleSetAllResolutions("skip")}>
                Skip All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleSetAllResolutions("overwrite")}>
                Overwrite All
              </Button>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleRenameAll}>
                  Rename All with Suffix
                </Button>
                <Input
                  value={renameSuffix}
                  onChange={(e) => setRenameSuffix(e.target.value)}
                  className="h-8 w-32"
                  placeholder="e.g. _imported"
                />
              </div>
            </div>
          </div>
          <ScrollArea className="h-[50vh] w-full rounded-md border">
            <div className="p-4 space-y-4">
              {conflicts.map((conflict) => (
                <div key={conflict.name} className="p-3 rounded-lg border bg-muted/50">
                  <h4 className="font-semibold font-mono">{conflict.name}</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-1 mb-3">
                    <div>
                      <strong>Existing:</strong> {new Date(conflict.existing.timestamp).toLocaleString()}
                    </div>
                    <div>
                      <strong>Imported:</strong> {new Date(conflict.imported.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <RadioGroup
                    value={resolutions[conflict.name]?.action}
                    onValueChange={(action: "overwrite" | "skip" | "rename") =>
                      setResolutions((prev) => ({
                        ...prev,
                        [conflict.name]: { ...prev[conflict.name], action },
                      }))
                    }
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="skip" id={`${conflict.name}-skip`} />
                      <Label htmlFor={`${conflict.name}-skip`}>Skip (keep existing version)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="overwrite" id={`${conflict.name}-overwrite`} />
                      <Label htmlFor={`${conflict.name}-overwrite`}>Overwrite with imported version</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rename" id={`${conflict.name}-rename`} />
                      <Label htmlFor={`${conflict.name}-rename`}>Rename imported version</Label>
                    </div>
                  </RadioGroup>
                  {resolutions[conflict.name]?.action === "rename" && (
                    <Input
                      value={resolutions[conflict.name].newName}
                      onChange={(e) =>
                        setResolutions((prev) => ({
                          ...prev,
                          [conflict.name]: { ...prev[conflict.name], newName: e.target.value },
                        }))
                      }
                      className="mt-2 h-8"
                      placeholder="Enter new name..."
                    />
                  )}
                  <Accordion type="single" collapsible className="w-full mt-2">
                    <AccordionItem value="item-1" className="border-b-0">
                      <AccordionTrigger className="text-xs py-1 hover:no-underline [&[data-state=open]>svg]:text-accent-foreground">
                        Show/Hide Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <ConflictDiffView
                          existingState={conflict.existing.state}
                          importedState={conflict.imported.state}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConflictDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmImport}>Confirm Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
