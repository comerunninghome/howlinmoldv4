"use client"

import { useAudioEngine } from "@/contexts/audio-engine-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Usb } from "lucide-react"

export const MidiController = () => {
  const { midiInputs, selectedMidiInputId, setMidiInput } = useAudioEngine()

  return (
    <div className="rounded-lg bg-black/20 p-4 space-y-4">
      <div className="text-center font-semibold text-primary/80 flex items-center justify-center gap-2">
        <Usb className="w-5 h-5" /> MIDI INPUT
      </div>
      {midiInputs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center">No MIDI devices found.</p>
      ) : (
        <Select
          value={selectedMidiInputId ?? "none"}
          onValueChange={(value) => setMidiInput(value === "none" ? null : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a MIDI device..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {midiInputs.map((input) => (
              <SelectItem key={input.id} value={input.id}>
                {input.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
