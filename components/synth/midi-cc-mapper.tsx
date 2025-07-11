"use client"

import { useState } from "react"
import { useAudioEngine } from "@/contexts/audio-engine-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Link, Trash2 } from "lucide-react"

const mappableParameters = [
  { id: "filterCutoff", name: "Filter Cutoff" },
  { id: "filterQ", name: "Filter Resonance" },
  { id: "lfoRate", name: "LFO Rate" },
  { id: "lfoDepth", name: "LFO Depth" },
  { id: "attack", name: "Attack" },
  { id: "decay", name: "Decay" },
  { id: "sustain", name: "Sustain" },
  { id: "release", name: "Release" },
  { id: "gain", name: "Master Gain" },
]

export const MidiCCMapper = () => {
  const {
    ccMappings,
    learnTarget,
    startLearning,
    midiMappingPresets,
    activePresetName,
    saveCurrentMidiMapping,
    loadMidiMapping,
    deleteMidiMapping,
  } = useAudioEngine()

  const [newPresetName, setNewPresetName] = useState("")

  const handleSave = () => {
    if (newPresetName.trim()) {
      saveCurrentMidiMapping(newPresetName.trim())
      setNewPresetName("")
    }
  }

  const handleDelete = () => {
    if (activePresetName && window.confirm(`Are you sure you want to delete the preset "${activePresetName}"?`)) {
      deleteMidiMapping(activePresetName)
    }
  }

  const reverseMappings: Record<string, string> = {}
  Object.entries(ccMappings).forEach(([cc, param]) => {
    reverseMappings[param] = cc
  })

  return (
    <Card className="bg-black/20 border-primary/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Link className="w-5 h-5" /> MIDI CC Presets & Learn
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Select onValueChange={loadMidiMapping} value={activePresetName ?? ""}>
              <SelectTrigger>
                <SelectValue placeholder="Load Preset..." />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(midiMappingPresets).length === 0 && (
                  <SelectItem value="no-presets" disabled>
                    No presets saved
                  </SelectItem>
                )}
                {Object.keys(midiMappingPresets).map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDelete}
              disabled={!activePresetName}
              aria-label="Delete selected preset"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="New preset name..."
              value={newPresetName}
              onChange={(e) => setNewPresetName(e.target.value)}
              className="bg-background/50"
            />
            <Button onClick={handleSave} disabled={!newPresetName.trim()}>
              Save
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {activePresetName ? `Loaded: ${activePresetName}` : "Custom unsaved mapping"}
          </p>
        </div>

        <div className="space-y-2 pt-2 border-t border-primary/10">
          {mappableParameters.map((param) => (
            <div key={param.id} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{param.name}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary/80 w-8 text-center">
                  {reverseMappings[param.id] ? `CC ${reverseMappings[param.id]}` : "-"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className={cn("w-20", learnTarget === param.id && "bg-primary/20 animate-pulse")}
                  onClick={() => startLearning(param.id)}
                >
                  {learnTarget === param.id ? "Listening..." : "Learn"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
