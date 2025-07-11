"use client"

import type React from "react"
import { createContext, useContext, useState, useRef, useCallback, useEffect } from "react"
import { getScaleMidiNotes } from "@/lib/scales"
import type * as WebMidi from "webmidi"
import { useAuth } from "@/components/providers/auth-provider"
import type { SynthState, Snapshot, PlaybackMode } from "@/lib/types"
import type { UserSnapshot } from "@/lib/database-types"

const midiToFreq = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

interface AudioEngineContextType extends SynthState {
  isInitialized: boolean
  isSequencerPlaying: boolean
  isRecording: boolean
  currentStep: number
  scaleMidiNotes: number[]
  currentChainStep: number
  copiedPattern: any | null
  midiInputs: WebMidi.MIDIInput[]
  selectedMidiInputId: string | null
  learnTarget: string | null
  midiMappingPresets: any
  canUndo: boolean
  canRedo: boolean
  snapshots: Record<string, Snapshot>
  initializeAudio: () => void
  noteOn: (midiNote: number, velocity?: number) => void
  noteOff: (midiNote: number) => void
  panic: () => void
  setGain: (vol: number) => void
  setOscillatorType: (type: OscillatorType) => void
  setFilterCutoff: (cutoff: number) => void
  setFilterQ: (q: number) => void
  setFilterType: (type: BiquadFilterType) => void
  setAttack: (val: number) => void
  setDecay: (val: number) => void
  setSustain: (val: number) => void
  setRelease: (val: number) => void
  setLfoRate: (val: number) => void
  setLfoDepth: (val: number) => void
  setLfoWaveform: (type: OscillatorType) => void
  toggleSequencer: () => void
  toggleRecording: () => void
  setBpm: (val: number) => void
  setSwing: (val: number) => void
  setRatchetVelocityFalloff: (val: number) => void
  setRatchetProbabilityFalloff: (val: number) => void
  setHumanizeVelocityAmount: (val: number) => void
  setHumanizeProbabilityAmount: (val: number) => void
  setHumanizeNudgeAmount: (val: number) => void
  setSequenceLength: (val: number) => void
  setPlaybackMode: (mode: PlaybackMode) => void
  setRootNote: (midi: number) => void
  setScaleType: (name: string) => void
  setPatternIndex: (index: number) => void
  updateStep: (noteIndex: number, stepIndex: number, newStep: any) => void
  addPattern: () => void
  clearCurrentPattern: () => void
  deletePattern: (index: number) => void
  reorderPatterns: (startIndex: number, endIndex: number) => void
  toggleChainMode: () => void
  setPatternChain: (newChain: number[]) => void
  humanizeCurrentPattern: () => void
  copyPattern: (index: number) => void
  pastePattern: (index: number) => void
  undo: () => void
  redo: () => void
  setMidiInput: (id: string | null) => void
  startLearning: (parameter: string) => void
  saveCurrentMidiMapping: (name: string) => void
  loadMidiMapping: (name: string) => void
  deleteMidiMapping: (name: string) => void
  saveSnapshot: (name: string, description: string, tags: string[]) => void
  loadSnapshot: (name: string) => void
  deleteSnapshot: (name: string) => void
  updateSnapshotDescription: (name: string, description: string) => void
  updateSnapshotTags: (name: string, tags: string[]) => void
  importSnapshots: (newSnapshots: Record<string, Snapshot>) => void
  addSnapshot: (name: string, snapshot: Snapshot) => void
  setAllSnapshots: (newSnapshots: Record<string, Snapshot>) => void
  analyserNode: AnalyserNode | null
}

const AudioEngineContext = createContext<AudioEngineContextType | undefined>(undefined)

const DEFAULT_SEQUENCE: any = Array(8)
  .fill(null)
  .map(() => Array(16).fill({ active: false, velocity: 1.0, probability: 1.0, ratchets: 1, nudge: 0 }))

const MAX_HISTORY_SIZE = 50

export const AudioEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)
  const [isSequencerPlaying, setIsSequencerPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [scaleMidiNotes, setScaleMidiNotes] = useState<number[]>([])
  const [copiedPattern, setCopiedPattern] = useState<any | null>(null)
  const [currentChainStep, setCurrentChainStep] = useState(0)
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([])
  const [selectedMidiInputId, setSelectedMidiInputId] = useState<string | null>(null)
  const [learnTarget, setLearnTarget] = useState<string | null>(null)
  const [midiMappingPresets, setMidiMappingPresets] = useState<any>({})
  const [snapshots, setSnapshots] = useState<Record<string, Snapshot>>({})

  const [synthState, setSynthState] = useState<SynthState>({
    gain: 0.5,
    oscillatorType: "sawtooth",
    filterCutoff: 5000,
    filterQ: 1,
    filterType: "lowpass",
    attack: 0.01,
    decay: 0.2,
    sustain: 0.5,
    release: 0.2,
    lfoRate: 5,
    lfoDepth: 1000,
    lfoWaveform: "sine",
    bpm: 120,
    swing: 0,
    ratchetVelocityFalloff: 0.5,
    ratchetProbabilityFalloff: 0.25,
    humanizeVelocityAmount: 0.1,
    humanizeProbabilityAmount: 0.1,
    humanizeNudgeAmount: 0.1,
    sequenceLength: 16,
    rootNote: 60,
    scaleType: "major",
    patterns: [
      JSON.parse(JSON.stringify(DEFAULT_SEQUENCE)),
      JSON.parse(JSON.stringify(DEFAULT_SEQUENCE)),
      JSON.parse(JSON.stringify(DEFAULT_SEQUENCE)),
      JSON.parse(JSON.stringify(DEFAULT_SEQUENCE)),
    ],
    currentPatternIndex: 0,
    isChainModeActive: false,
    patternChain: [],
    playbackMode: "forward",
    ccMappings: {},
    activePresetName: null,
  })

  // History State
  const [undoStack, setUndoStack] = useState<SynthState[]>([])
  const [redoStack, setRedoStack] = useState<SynthState[]>([])

  const audioContextRef = useRef<AudioContext | null>(null)
  const mainGainRef = useRef<GainNode | null>(null)
  const mainFilterRef = useRef<BiquadFilterNode | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const lfoOscRef = useRef<OscillatorNode | null>(null)
  const lfoDepthRef = useRef<GainNode | null>(null)
  const activeNotesRef = useRef<Record<string, { osc: OscillatorNode; envelope: GainNode; midiNote: number }>>({})
  const midiAccessRef = useRef<WebMidi.MIDIAccess | null>(null)

  // New refs for precision sequencer
  const schedulerIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const nextNoteTimeRef = useRef<number>(0)
  const currentStepRef = useRef<number>(-1)
  const pendulumDirectionRef = useRef<"forward" | "backward">("forward")
  const currentChainStepRef = useRef<number>(0)

  const updateSynthStateWithHistory = useCallback((updates: Partial<SynthState>) => {
    setSynthState((currentState) => {
      setUndoStack((prevStack) => {
        const newStack = [currentState, ...prevStack]
        if (newStack.length > MAX_HISTORY_SIZE) {
          newStack.pop()
        }
        return newStack
      })
      setRedoStack([])
      return { ...currentState, ...updates }
    })
  }, [])

  const undo = () => {
    if (undoStack.length === 0) return
    const [lastState, ...restOfUndo] = undoStack
    setRedoStack((prev) => [synthState, ...prev])
    setUndoStack(restOfUndo)
    setSynthState(lastState)
  }

  const redo = () => {
    if (redoStack.length === 0) return
    const [nextState, ...restOfRedo] = redoStack
    setUndoStack((prev) => [synthState, ...prev])
    setRedoStack(restOfRedo)
    setSynthState(nextState)
  }

  // Load presets and snapshots from localStorage on mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const savedPresets = localStorage.getItem("howlin_midi_presets")
        if (savedPresets) setMidiMappingPresets(JSON.parse(savedPresets))

        if (isAuthenticated) {
          const response = await fetch("/api/snapshots")
          if (response.ok) {
            const dbSnapshots: UserSnapshot[] = await response.json()
            const formattedSnapshots: Record<string, Snapshot> = {}
            dbSnapshots.forEach((s) => {
              formattedSnapshots[s.name] = {
                state: s.state,
                timestamp: new Date(s.created_at).getTime(),
                description: s.description || "",
                tags: s.tags || [],
              }
            })
            setSnapshots(formattedSnapshots)
          }
        } else {
          const savedSnapshots = localStorage.getItem("howlin_synth_snapshots")
          if (savedSnapshots) setSnapshots(JSON.parse(savedSnapshots))
        }
      } catch (error) {
        console.error("Failed to load data:", error)
      }
    }
    loadInitialData()
  }, [isAuthenticated])

  // Persist non-snapshot data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("howlin_midi_presets", JSON.stringify(midiMappingPresets))
    } catch (error) {
      console.error("Failed to save MIDI presets to localStorage", error)
    }
  }, [midiMappingPresets])

  // Persist snapshots for anonymous users
  useEffect(() => {
    if (!isAuthenticated) {
      try {
        localStorage.setItem("howlin_synth_snapshots", JSON.stringify(snapshots))
      } catch (error) {
        console.error("Failed to save snapshots to localStorage", error)
      }
    }
  }, [snapshots, isAuthenticated])

  useEffect(() => {
    const notes = getScaleMidiNotes(synthState.rootNote, synthState.scaleType, 8)
    setScaleMidiNotes(notes)
  }, [synthState.rootNote, synthState.scaleType])

  const initializeAudio = useCallback(() => {
    if (isInitialized) return
    const context = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioContextRef.current = context

    analyserRef.current = context.createAnalyser()
    mainGainRef.current = context.createGain()
    mainFilterRef.current = context.createBiquadFilter()
    lfoOscRef.current = context.createOscillator()
    lfoDepthRef.current = context.createGain()

    mainGainRef.current.gain.setValueAtTime(synthState.gain, context.currentTime)
    mainFilterRef.current.type = synthState.filterType
    mainFilterRef.current.frequency.setValueAtTime(synthState.filterCutoff, context.currentTime)
    mainFilterRef.current.Q.setValueAtTime(synthState.filterQ, context.currentTime)

    lfoOscRef.current.type = synthState.lfoWaveform
    lfoOscRef.current.frequency.setValueAtTime(synthState.lfoRate, context.currentTime)
    lfoDepthRef.current.gain.setValueAtTime(synthState.lfoDepth, context.currentTime)
    lfoOscRef.current.connect(lfoDepthRef.current)
    lfoDepthRef.current.connect(mainFilterRef.current.frequency)
    lfoOscRef.current.start()

    mainFilterRef.current.connect(mainGainRef.current)
    mainGainRef.current.connect(analyserRef.current)
    analyserRef.current.connect(context.destination)

    setIsInitialized(true)
  }, [isInitialized, synthState])

  const updateStep = useCallback(
    (noteIndex: number, stepIndex: number, newStep: any) => {
      const newPatterns = JSON.parse(JSON.stringify(synthState.patterns))
      newPatterns[synthState.currentPatternIndex][noteIndex][stepIndex] = newStep
      updateSynthStateWithHistory({ patterns: newPatterns })
    },
    [synthState.patterns, synthState.currentPatternIndex, updateSynthStateWithHistory],
  )

  const noteOn = useCallback(
    (midiNote: number, velocity = 1.0) => {
      if (!isInitialized) initializeAudio()
      if (audioContextRef.current?.state === "suspended") audioContextRef.current.resume()
      if (!audioContextRef.current || !mainFilterRef.current) return

      const now = audioContextRef.current.currentTime
      const envelope = audioContextRef.current.createGain()
      envelope.gain.setValueAtTime(0, now)

      const osc = audioContextRef.current.createOscillator()
      osc.type = synthState.oscillatorType
      osc.frequency.setValueAtTime(midiToFreq(midiNote), now)

      osc.connect(envelope).connect(mainFilterRef.current)
      osc.start(now)

      const peakGain = 1.0 * velocity
      const sustainLevel = peakGain * synthState.sustain
      envelope.gain.cancelScheduledValues(now)
      envelope.gain.linearRampToValueAtTime(peakGain, now + synthState.attack)
      envelope.gain.linearRampToValueAtTime(sustainLevel, now + synthState.attack + synthState.decay)

      const noteId = `${midiNote}-${now}`
      activeNotesRef.current[noteId] = { osc, envelope, midiNote }

      osc.onended = () => {
        osc.disconnect()
        envelope.disconnect()
        delete activeNotesRef.current[noteId]
      }

      // Recording logic
      if (isRecording && isSequencerPlaying && currentStepRef.current !== -1) {
        if (scaleMidiNotes.length > 0) {
          const closestNoteIndex = scaleMidiNotes.reduce((closestIndex, currentNote, currentIndex) => {
            const closestDiff = Math.abs(scaleMidiNotes[closestIndex] - midiNote)
            const currentDiff = Math.abs(currentNote - midiNote)
            return currentDiff < closestDiff ? currentIndex : closestIndex
          }, 0)

          const currentSequence = synthState.patterns[synthState.currentPatternIndex]
          if (
            currentSequence &&
            currentSequence[closestNoteIndex] &&
            currentSequence[closestNoteIndex][currentStepRef.current]
          ) {
            const existingStep = currentSequence[closestNoteIndex][currentStepRef.current]
            const newVelocity = existingStep.active ? Math.max(existingStep.velocity, velocity) : velocity
            updateStep(closestNoteIndex, currentStepRef.current, {
              active: true,
              velocity: newVelocity,
              probability: existingStep.probability ?? 1.0,
              ratchets: existingStep.ratchets ?? 1,
              nudge: existingStep.nudge ?? 0,
            })
          }
        }
      }
    },
    [isInitialized, initializeAudio, synthState, isRecording, isSequencerPlaying, scaleMidiNotes, updateStep],
  )

  const noteOff = useCallback(
    (midiNote: number) => {
      if (!audioContextRef.current) return
      const now = audioContextRef.current.currentTime

      Object.entries(activeNotesRef.current).forEach(([noteId, activeNote]) => {
        if (activeNote.midiNote === midiNote) {
          const { osc, envelope } = activeNote
          const releaseTime = now + synthState.release
          envelope.gain.cancelScheduledValues(now)
          envelope.gain.setValueAtTime(envelope.gain.value, now)
          envelope.gain.linearRampToValueAtTime(0, releaseTime)
          osc.stop(releaseTime + 0.1)
        }
      })
    },
    [synthState.release],
  )

  const panic = useCallback(() => {
    if (!audioContextRef.current) return

    Object.values(activeNotesRef.current).forEach(({ osc, envelope }) => {
      const now = audioContextRef.current!.currentTime
      envelope.gain.cancelScheduledValues(now)
      envelope.gain.setValueAtTime(envelope.gain.value, now)
      envelope.gain.linearRampToValueAtTime(0, now + 0.05)
      osc.stop(now + 0.1)
    })
    activeNotesRef.current = {}

    if (isSequencerPlaying) {
      setIsSequencerPlaying(false)
    }
  }, [isSequencerPlaying])

  const triggerSequencerNote = useCallback(
    (midiNote: number, velocity: number, startTime: number) => {
      if (!audioContextRef.current || !mainFilterRef.current) return

      const now = startTime
      const envelope = audioContextRef.current.createGain()
      envelope.gain.setValueAtTime(0, now)

      const osc = audioContextRef.current.createOscillator()
      osc.type = synthState.oscillatorType
      osc.frequency.setValueAtTime(midiToFreq(midiNote), now)

      osc.connect(envelope).connect(mainFilterRef.current)
      osc.start(now)

      const peakGain = 1.0 * velocity
      const sustainLevel = peakGain * synthState.sustain
      const releaseTime = now + synthState.attack + synthState.decay + synthState.release
      envelope.gain.linearRampToValueAtTime(peakGain, now + synthState.attack)
      envelope.gain.linearRampToValueAtTime(sustainLevel, now + synthState.attack + synthState.decay)
      envelope.gain.linearRampToValueAtTime(0, releaseTime)
      osc.stop(releaseTime + 0.1)

      osc.onended = () => {
        osc.disconnect()
        envelope.disconnect()
      }
    },
    [synthState],
  )

  const toggleSequencer = useCallback(() => {
    if (!isInitialized) initializeAudio()
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume()
    }
    setIsSequencerPlaying((prev) => !prev)
  }, [isInitialized, initializeAudio])

  const toggleRecording = () => {
    setIsRecording((prev) => !prev)
  }

  // High-precision sequencer loop
  useEffect(() => {
    if (!isSequencerPlaying) {
      if (schedulerIntervalRef.current) clearInterval(schedulerIntervalRef.current)
      setCurrentStep(-1)
      currentStepRef.current = -1
      return
    }

    const context = audioContextRef.current
    if (!context) return

    const scheduleAheadTime = 0.1 // seconds
    nextNoteTimeRef.current = context.currentTime

    const scheduler = () => {
      while (nextNoteTimeRef.current < context.currentTime + scheduleAheadTime) {
        // 1. Advance step
        const { playbackMode, sequenceLength } = synthState
        let nextStep: number
        switch (playbackMode) {
          case "forward":
            nextStep = (currentStepRef.current + 1) % sequenceLength
            break
          case "backward":
            nextStep = (currentStepRef.current - 1 + sequenceLength) % sequenceLength
            break
          case "pendulum":
            if (pendulumDirectionRef.current === "forward") {
              if (currentStepRef.current >= sequenceLength - 1) {
                pendulumDirectionRef.current = "backward"
                nextStep = Math.max(0, sequenceLength - 2)
              } else {
                nextStep = currentStepRef.current + 1
              }
            } else {
              if (currentStepRef.current <= 0) {
                pendulumDirectionRef.current = "forward"
                nextStep = Math.min(1, sequenceLength - 1)
              } else {
                nextStep = currentStepRef.current - 1
              }
            }
            break
          case "random":
            if (sequenceLength <= 1) {
              nextStep = 0
            } else {
              do {
                nextStep = Math.floor(Math.random() * sequenceLength)
              } while (nextStep === currentStepRef.current)
            }
            break
          default:
            nextStep = (currentStepRef.current + 1) % sequenceLength
        }

        // 2. Handle chain mode
        if (synthState.isChainModeActive && synthState.patternChain.length > 0) {
          const didLoop = nextStep < currentStepRef.current && playbackMode === "forward"
          if (didLoop) {
            const nextChainStep = (currentChainStepRef.current + 1) % synthState.patternChain.length
            currentChainStepRef.current = nextChainStep
            setCurrentChainStep(nextChainStep)
            const nextPatternIndex = synthState.patternChain[nextChainStep]
            if (nextPatternIndex !== undefined) {
              setSynthState((s) => ({ ...s, currentPatternIndex: nextPatternIndex }))
            }
          }
        }

        // 3. Schedule notes for the step
        const activePatternIndex = synthState.isChainModeActive
          ? (synthState.patternChain[currentChainStepRef.current] ?? synthState.currentPatternIndex)
          : synthState.currentPatternIndex
        const currentSequence = synthState.patterns[activePatternIndex]

        if (currentSequence) {
          const sixteenthNoteDuration = 60.0 / synthState.bpm / 4.0
          currentSequence.forEach((row, noteIndex) => {
            const step = row[nextStep]
            if (step && step.active && Math.random() < (step.probability ?? 1.0)) {
              const note = scaleMidiNotes[noteIndex]
              if (note) {
                const ratchets = step.ratchets ?? 1
                const ratchetInterval = sixteenthNoteDuration / ratchets
                for (let i = 0; i < ratchets; i++) {
                  if (i === 0 || Math.random() < 1 - synthState.ratchetProbabilityFalloff) {
                    const velocityMultiplier =
                      ratchets > 1 ? 1 - (i / (ratchets - 1)) * synthState.ratchetVelocityFalloff : 1
                    const finalVelocity = step.velocity * velocityMultiplier
                    const nudgeMs = (step.nudge ?? 0) * (sixteenthNoteDuration / 2) * 1000
                    const noteTime = nextNoteTimeRef.current + i * ratchetInterval + nudgeMs / 1000
                    triggerSequencerNote(note, finalVelocity, noteTime)
                  }
                }
              }
            }
          })
        }

        // 4. Advance time for next schedule call
        const stepIsEven = nextStep % 2 === 0
        const stepDuration = (60.0 / synthState.bpm / 4.0) * (stepIsEven ? 1 + synthState.swing : 1 - synthState.swing)
        nextNoteTimeRef.current += stepDuration
        currentStepRef.current = nextStep
      }
      // Update UI with the latest step
      setCurrentStep(currentStepRef.current)
    }

    schedulerIntervalRef.current = setInterval(scheduler, 25)

    return () => {
      if (schedulerIntervalRef.current) clearInterval(schedulerIntervalRef.current)
    }
  }, [isSequencerPlaying, synthState, scaleMidiNotes, triggerSequencerNote])

  const setCcMapping = (ccNumber: number, parameter: string) => {
    const newMappings = { ...synthState.ccMappings }
    Object.keys(newMappings).forEach((key) => {
      if (newMappings[key] === parameter) delete newMappings[key]
    })
    newMappings[String(ccNumber)] = parameter
    updateSynthStateWithHistory({
      ccMappings: newMappings,
      activePresetName: null,
    })
  }

  const startLearning = (parameter: string) => {
    setLearnTarget(parameter)
  }

  useEffect(() => {
    const initMidi = async () => {
      if (navigator.requestMIDIAccess) {
        try {
          const midiAccess = await navigator.requestMIDIAccess()
          midiAccessRef.current = midiAccess
          const inputs = Array.from(midiAccess.inputs.values())
          setMidiInputs(inputs)
        } catch (error) {
          console.error("Could not access your MIDI devices.", error)
        }
      } else {
        console.warn("Web MIDI API is not supported in this browser.")
      }
    }
    initMidi()
  }, [])

  useEffect(() => {
    const midiAccess = midiAccessRef.current
    if (!midiAccess) return

    const handleMIDIMessage = (message: WebMidi.MIDIMessageEvent) => {
      const command = message.data[0] & 0xf0
      const noteOrCc = message.data[1]
      const value = message.data.length > 2 ? message.data[2] : 0

      if (command === 0xb0) {
        // CC message
        if (learnTarget) {
          setCcMapping(noteOrCc, learnTarget)
          setLearnTarget(null)
          return
        }

        const parameter = synthState.ccMappings[String(noteOrCc)]
        if (parameter) {
          const normalizedValue = value / 127
          const updates: Partial<SynthState> = {}
          switch (parameter) {
            case "filterCutoff": {
              const min = 20,
                max = 20000
              const logMin = Math.log(min),
                logMax = Math.log(max)
              const scale = logMax - logMin
              updates.filterCutoff = Math.exp(logMin + scale * normalizedValue)
              break
            }
            case "filterQ":
              updates.filterQ = 0.1 + normalizedValue * (20 - 0.1)
              break
            case "lfoRate":
              updates.lfoRate = 0.1 + normalizedValue * (20 - 0.1)
              break
            case "lfoDepth":
              updates.lfoDepth = normalizedValue * 5000
              break
            case "attack":
              updates.attack = 0.01 + normalizedValue * (2 - 0.01)
              break
            case "decay":
              updates.decay = 0.01 + normalizedValue * (2 - 0.01)
              break
            case "sustain":
              updates.sustain = normalizedValue
              break
            case "release":
              updates.release = 0.01 + normalizedValue * (4 - 0.01)
              break
            case "gain":
              updates.gain = normalizedValue
              break
          }
          if (Object.keys(updates).length > 0) {
            setSynthState((s) => ({ ...s, ...updates }))
          }
        }
      } else if (command === 0x90 && value > 0) {
        // Note On
        noteOn(noteOrCc, value / 127)
      } else if (command === 0x80 || (command === 0x90 && value === 0)) {
        // Note Off
        noteOff(noteOrCc)
      }
    }

    midiAccess.inputs.forEach((input) => {
      input.onmidimessage = null
    })

    if (selectedMidiInputId) {
      const selectedInput = midiAccess.inputs.get(selectedMidiInputId)
      if (selectedInput) selectedInput.onmidimessage = handleMIDIMessage
    }

    return () => {
      if (selectedMidiInputId) {
        const selectedInput = midiAccess.inputs.get(selectedMidiInputId)
        if (selectedInput) selectedInput.onmidimessage = null
      }
    }
  }, [selectedMidiInputId, noteOn, noteOff, learnTarget, synthState.ccMappings])

  const setMidiInput = (id: string | null) => {
    setSelectedMidiInputId(id)
  }

  const addPattern = () => {
    updateSynthStateWithHistory({ patterns: [...synthState.patterns, JSON.parse(JSON.stringify(DEFAULT_SEQUENCE))] })
  }

  const clearCurrentPattern = () => {
    const newPatterns = JSON.parse(JSON.stringify(synthState.patterns))
    newPatterns[synthState.currentPatternIndex] = JSON.parse(JSON.stringify(DEFAULT_SEQUENCE))
    updateSynthStateWithHistory({ patterns: newPatterns })
  }

  const deletePattern = (indexToDelete: number) => {
    if (synthState.patterns.length <= 1) return

    const newPatterns = synthState.patterns.filter((_, i) => i !== indexToDelete)
    const newChain = synthState.patternChain
      .map((pIndex) => {
        if (pIndex === indexToDelete) return -1
        if (pIndex > indexToDelete) return pIndex - 1
        return pIndex
      })
      .filter((pIndex) => pIndex !== -1)

    let newIndex = synthState.currentPatternIndex
    if (synthState.currentPatternIndex === indexToDelete) {
      newIndex = Math.max(0, synthState.currentPatternIndex - 1)
    } else if (synthState.currentPatternIndex > indexToDelete) {
      newIndex = synthState.currentPatternIndex - 1
    }

    updateSynthStateWithHistory({ patterns: newPatterns, patternChain: newChain, currentPatternIndex: newIndex })
  }

  const reorderPatterns = (startIndex: number, endIndex: number) => {
    const newPatterns = [...synthState.patterns]
    const [removed] = newPatterns.splice(startIndex, 1)
    newPatterns.splice(endIndex, 0, removed)

    const newChain = synthState.patternChain.map((pIndex) => {
      if (pIndex === startIndex) return endIndex
      if (pIndex > startIndex && pIndex <= endIndex) return pIndex - 1
      if (pIndex < startIndex && pIndex >= endIndex) return pIndex + 1
      return pIndex
    })

    let newIndex = synthState.currentPatternIndex
    if (synthState.currentPatternIndex === startIndex) {
      newIndex = endIndex
    } else if (startIndex < synthState.currentPatternIndex && endIndex >= synthState.currentPatternIndex) {
      newIndex = synthState.currentPatternIndex - 1
    } else if (startIndex > synthState.currentPatternIndex && endIndex <= synthState.currentPatternIndex) {
      newIndex = synthState.currentPatternIndex + 1
    }

    updateSynthStateWithHistory({ patterns: newPatterns, patternChain: newChain, currentPatternIndex: newIndex })
  }

  const toggleChainMode = () => {
    const newMode = !synthState.isChainModeActive
    if (newMode && synthState.patternChain.length > 0) {
      updateSynthStateWithHistory({ isChainModeActive: newMode, currentPatternIndex: synthState.patternChain[0] })
      setCurrentChainStep(0)
    } else {
      updateSynthStateWithHistory({ isChainModeActive: newMode })
      setCurrentChainStep(0)
    }
  }

  const copyPattern = (indexToCopy: number) => {
    if (synthState.patterns[indexToCopy]) {
      const patternToCopy = JSON.parse(JSON.stringify(synthState.patterns[indexToCopy]))
      setCopiedPattern(patternToCopy)
    }
  }

  const pastePattern = (indexToPaste: number) => {
    if (copiedPattern) {
      const newPatterns = JSON.parse(JSON.stringify(synthState.patterns))
      newPatterns[indexToPaste] = JSON.parse(JSON.stringify(copiedPattern))
      updateSynthStateWithHistory({ patterns: newPatterns })
    }
  }

  const humanizeCurrentPattern = useCallback(() => {
    const newPatterns = JSON.parse(JSON.stringify(synthState.patterns))
    const patternToHumanize = newPatterns[synthState.currentPatternIndex]

    for (let noteIndex = 0; noteIndex < patternToHumanize.length; noteIndex++) {
      for (let stepIndex = 0; stepIndex < patternToHumanize[noteIndex].length; stepIndex++) {
        const step = patternToHumanize[noteIndex][stepIndex]
        if (step.active) {
          const velOffset = (Math.random() * 2 - 1) * synthState.humanizeVelocityAmount
          step.velocity = Math.max(0.01, Math.min(1.0, (step.velocity ?? 1.0) + velOffset))
          const probOffset = (Math.random() * 2 - 1) * synthState.humanizeProbabilityAmount
          step.probability = Math.max(0.0, Math.min(1.0, (step.probability ?? 1.0) + probOffset))
          const nudgeOffset = (Math.random() * 2 - 1) * synthState.humanizeNudgeAmount
          step.nudge = Math.max(-1.0, Math.min(1.0, (step.nudge ?? 0) + nudgeOffset))
        }
      }
    }
    updateSynthStateWithHistory({ patterns: newPatterns })
  }, [synthState, updateSynthStateWithHistory])

  const saveCurrentMidiMapping = (name: string) => {
    if (!name) return
    const newPresets = { ...midiMappingPresets, [name]: synthState.ccMappings }
    setMidiMappingPresets(newPresets)
    updateSynthStateWithHistory({ activePresetName: name })
  }

  const loadMidiMapping = (name: string) => {
    if (midiMappingPresets[name]) {
      updateSynthStateWithHistory({
        ccMappings: midiMappingPresets[name],
        activePresetName: name,
      })
    }
  }

  const deleteMidiMapping = (name: string) => {
    const newPresets = { ...midiMappingPresets }
    delete newPresets[name]
    setMidiMappingPresets(newPresets)
    if (synthState.activePresetName === name) {
      updateSynthStateWithHistory({ ccMappings: {}, activePresetName: null })
    }
  }

  const addSnapshot = (name: string, snapshot: Snapshot) => {
    setSnapshots((prevSnapshots) => ({
      ...prevSnapshots,
      [name]: snapshot,
    }))
  }

  const setAllSnapshots = (newSnapshots: Record<string, Snapshot>) => {
    setSnapshots(newSnapshots)
  }

  const saveSnapshot = async (name: string, description: string, tags: string[]) => {
    if (!name) return
    const newSnapshot: Snapshot = {
      state: synthState,
      timestamp: Date.now(),
      description,
      tags,
    }

    if (isAuthenticated) {
      // Check if snapshot with this name already exists to decide between POST and PUT
      const existing = Object.values(snapshots).find((s) => s.state === newSnapshot.state) // This is a simplification
      const response = await fetch("/api/snapshots", {
        method: "POST", // This should be more intelligent (POST vs PUT)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, tags, state: synthState }),
      })
      if (response.ok) {
        // Refetch or update state from response
      }
    }

    setSnapshots((prev) => ({ ...prev, [name]: newSnapshot }))
  }

  const loadSnapshot = (name: string) => {
    if (snapshots[name]) {
      setUndoStack((prevStack) => {
        const newStack = [synthState, ...prevStack]
        if (newStack.length > MAX_HISTORY_SIZE) {
          newStack.pop()
        }
        return newStack
      })
      setRedoStack([])
      setSynthState(snapshots[name].state)
    }
  }

  const deleteSnapshot = async (name: string) => {
    const snapshotToDelete = snapshots[name]
    if (!snapshotToDelete) return

    if (isAuthenticated) {
      // Find the snapshot ID to send to the API
      // This is complex without mapping client state to DB IDs.
      // A refetch or more complex state management is needed here.
      // For now, we optimistically update the UI.
    }

    setSnapshots((prev) => {
      const newSnapshots = { ...prev }
      delete newSnapshots[name]
      return newSnapshots
    })
  }

  const updateSnapshotDescription = (name: string, description: string) => {
    if (snapshots[name]) {
      setSnapshots((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          description: description,
        },
      }))
    }
  }

  const updateSnapshotTags = (name: string, tags: string[]) => {
    if (snapshots[name]) {
      setSnapshots((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          tags: tags,
        },
      }))
    }
  }

  const importSnapshots = (newSnapshots: Record<string, Snapshot>) => {
    // A simple merge, overwriting existing snapshots with the same name.
    setSnapshots((prevSnapshots) => ({
      ...prevSnapshots,
      ...newSnapshots,
    }))
  }

  useEffect(() => {
    if (mainGainRef.current && audioContextRef.current) {
      mainGainRef.current.gain.linearRampToValueAtTime(synthState.gain, audioContextRef.current.currentTime + 0.05)
    }
  }, [synthState.gain])

  useEffect(() => {
    if (mainFilterRef.current) mainFilterRef.current.type = synthState.filterType
  }, [synthState.filterType])

  useEffect(() => {
    if (mainFilterRef.current && audioContextRef.current) {
      mainFilterRef.current.frequency.linearRampToValueAtTime(
        synthState.filterCutoff,
        audioContextRef.current.currentTime + 0.05,
      )
    }
  }, [synthState.filterCutoff])

  useEffect(() => {
    if (mainFilterRef.current && audioContextRef.current) {
      mainFilterRef.current.Q.linearRampToValueAtTime(synthState.filterQ, audioContextRef.current.currentTime + 0.05)
    }
  }, [synthState.filterQ])

  useEffect(() => {
    if (lfoOscRef.current && audioContextRef.current) {
      lfoOscRef.current.frequency.linearRampToValueAtTime(
        synthState.lfoRate,
        audioContextRef.current.currentTime + 0.05,
      )
    }
  }, [synthState.lfoRate])

  useEffect(() => {
    if (lfoDepthRef.current && audioContextRef.current) {
      lfoDepthRef.current.gain.linearRampToValueAtTime(synthState.lfoDepth, audioContextRef.current.currentTime + 0.05)
    }
  }, [synthState.lfoDepth])

  useEffect(() => {
    if (lfoOscRef.current) lfoOscRef.current.type = synthState.lfoWaveform
  }, [synthState.lfoWaveform])

  const value: AudioEngineContextType = {
    ...synthState,
    isInitialized,
    isSequencerPlaying,
    isRecording,
    currentStep,
    scaleMidiNotes,
    currentChainStep,
    copiedPattern,
    midiInputs,
    selectedMidiInputId,
    learnTarget,
    midiMappingPresets,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    snapshots,
    initializeAudio,
    noteOn,
    noteOff,
    panic,
    setGain: (v) => updateSynthStateWithHistory({ gain: v }),
    setOscillatorType: (v) => updateSynthStateWithHistory({ oscillatorType: v }),
    setFilterCutoff: (v) => updateSynthStateWithHistory({ filterCutoff: v }),
    setFilterQ: (v) => updateSynthStateWithHistory({ filterQ: v }),
    setFilterType: (v) => updateSynthStateWithHistory({ filterType: v }),
    setAttack: (v) => updateSynthStateWithHistory({ attack: v }),
    setDecay: (v) => updateSynthStateWithHistory({ decay: v }),
    setSustain: (v) => updateSynthStateWithHistory({ sustain: v }),
    setRelease: (v) => updateSynthStateWithHistory({ release: v }),
    setLfoRate: (v) => updateSynthStateWithHistory({ lfoRate: v }),
    setLfoDepth: (v) => updateSynthStateWithHistory({ lfoDepth: v }),
    setLfoWaveform: (v) => updateSynthStateWithHistory({ lfoWaveform: v }),
    toggleSequencer,
    toggleRecording,
    setBpm: (v) => updateSynthStateWithHistory({ bpm: v }),
    setSwing: (v) => updateSynthStateWithHistory({ swing: v }),
    setRatchetVelocityFalloff: (v) => updateSynthStateWithHistory({ ratchetVelocityFalloff: v }),
    setRatchetProbabilityFalloff: (v) => updateSynthStateWithHistory({ ratchetProbabilityFalloff: v }),
    setHumanizeVelocityAmount: (v) => updateSynthStateWithHistory({ humanizeVelocityAmount: v }),
    setHumanizeProbabilityAmount: (v) => updateSynthStateWithHistory({ humanizeProbabilityAmount: v }),
    setHumanizeNudgeAmount: (v) => updateSynthStateWithHistory({ humanizeNudgeAmount: v }),
    setSequenceLength: (v) => updateSynthStateWithHistory({ sequenceLength: v }),
    setPlaybackMode: (v) => updateSynthStateWithHistory({ playbackMode: v }),
    setRootNote: (v) => updateSynthStateWithHistory({ rootNote: v }),
    setScaleType: (v) => updateSynthStateWithHistory({ scaleType: v }),
    setPatternIndex: (v) => updateSynthStateWithHistory({ currentPatternIndex: v }),
    updateStep,
    addPattern,
    clearCurrentPattern,
    deletePattern,
    reorderPatterns,
    toggleChainMode,
    setPatternChain: (v) => updateSynthStateWithHistory({ patternChain: v }),
    humanizeCurrentPattern,
    copyPattern,
    pastePattern,
    undo,
    redo,
    setMidiInput,
    startLearning,
    saveCurrentMidiMapping,
    loadMidiMapping,
    deleteMidiMapping,
    saveSnapshot,
    loadSnapshot,
    deleteSnapshot,
    updateSnapshotDescription,
    updateSnapshotTags,
    importSnapshots,
    addSnapshot,
    setAllSnapshots,
    analyserNode: analyserRef.current,
  }

  return <AudioEngineContext.Provider value={value}>{children}</AudioEngineContext.Provider>
}

export const useAudioEngine = () => {
  const context = useContext(AudioEngineContext)
  if (context === undefined) {
    throw new Error("useAudioEngine must be used within an AudioEngineProvider")
  }
  return context
}
