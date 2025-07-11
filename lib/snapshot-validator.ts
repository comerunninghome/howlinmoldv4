import type { Snapshot, SynthState } from "@/contexts/audio-engine-context"

type ValidationResult = {
  isValid: boolean
  error?: string
  data?: Record<string, Snapshot>
}

// A simplified check for the structure of a single SynthState object
const isSynthState = (obj: any): obj is SynthState => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.gain === "number" &&
    typeof obj.oscillatorType === "string" &&
    typeof obj.filterCutoff === "number" &&
    typeof obj.filterQ === "number" &&
    typeof obj.filterType === "string" &&
    typeof obj.attack === "number" &&
    typeof obj.decay === "number" &&
    typeof obj.sustain === "number" &&
    typeof obj.release === "number" &&
    typeof obj.lfoRate === "number" &&
    typeof obj.lfoDepth === "number" &&
    typeof obj.lfoWaveform === "string" &&
    typeof obj.bpm === "number" &&
    typeof obj.swing === "number" &&
    typeof obj.sequenceLength === "number" &&
    typeof obj.rootNote === "number" &&
    typeof obj.scaleType === "string" &&
    Array.isArray(obj.patterns) &&
    typeof obj.currentPatternIndex === "number" &&
    typeof obj.playbackMode === "string"
    // Not checking all fields to keep it concise, but more could be added.
  )
}

// A simplified check for the structure of a single Snapshot object
const isSnapshot = (obj: any): obj is Snapshot => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj.timestamp === "number" &&
    typeof obj.description === "string" &&
    Array.isArray(obj.tags) &&
    isSynthState(obj.state)
  )
}

export const validateSnapshotsData = (data: any): ValidationResult => {
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { isValid: false, error: "Invalid format: Data must be an object of snapshots." }
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const snapshot = data[key]
      if (!isSnapshot(snapshot)) {
        return {
          isValid: false,
          error: `Invalid structure for snapshot "${key}". Please check the file format.`,
        }
      }
    }
  }

  return { isValid: true, data: data as Record<string, Snapshot> }
}
