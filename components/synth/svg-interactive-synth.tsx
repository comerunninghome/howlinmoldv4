"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import SvgKnob from "./svg-knob"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Volume2,
  VolumeX,
  Power,
  KeyboardIcon,
  Save,
  Upload,
  Trash2,
  Settings2,
  Zap,
  ChevronsUp,
  ChevronsDown,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"
import { useSound } from "@/contexts/sound-context"
import { MockSynthPlugin, type PluginParameterDescriptor } from "@/lib/mock-synth-plugin"
import { toast } from "sonner"

declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext
  }
}

declare namespace WebMidi {
  interface MIDIAccess {
    inputs: any
    outputs: any
    onstatechange: any
  }
  interface MIDIMessageEvent {
    data: Uint8Array
  }
  interface MIDIInput {
    onmidimessage: ((event: MIDIMessageEvent) => void) | null
    name: string
    manufacturer: string
    id: string
    state: string
  }
  interface MIDIOptions {
    sysex: boolean
  }
}

declare global {
  interface Navigator {
    requestMIDIAccess: (options?: WebMidi.MIDIOptions) => Promise<WebMidi.MIDIAccess>
  }
}

export type OscillatorType = "sine" | "square" | "sawtooth" | "triangle"

const KEYBOARD_NOTE_MAP: Record<string, { note: string; midi: number; type: "white" | "black" }> = {
  a: { note: "C4", midi: 60, type: "white" },
  s: { note: "D4", midi: 62, type: "white" },
  d: { note: "E4", midi: 64, type: "white" },
  f: { note: "F4", midi: 65, type: "white" },
  g: { note: "G4", midi: 67, type: "white" },
  h: { note: "A4", midi: 69, type: "white" },
  j: { note: "B4", midi: 71, type: "white" },
  k: { note: "C5", midi: 72, type: "white" },
  l: { note: "D5", midi: 74, type: "white" },
  ";": { note: "E5", midi: 76, type: "white" },
  "'": { note: "F5", midi: 77, type: "white" },
  w: { note: "C#4", midi: 61, type: "black" },
  e: { note: "D#4", midi: 63, type: "black" },
  t: { note: "F#4", midi: 66, type: "black" },
  y: { note: "G#4", midi: 68, type: "black" },
  u: { note: "A#4", midi: 70, type: "black" },
  o: { note: "C#5", midi: 73, type: "black" },
  p: { note: "D#5", midi: 75, type: "black" },
}
const SVG_KEY_ORDER = ["a", "w", "s", "e", "d", "f", "t", "g", "y", "h", "u", "j", "k", "o", "l", "p", ";", "'"]

const OCTAVE_STEP = 12
const MIN_OCTAVE_SEMITONES = -24
const MAX_OCTAVE_SEMITONES = 24

// Mock synth engine
const useMockSynth = () => {
  const [params, setParams] = useState({
    osc1: 50,
    osc2: 30,
    filter: 70,
    resonance: 40,
    attack: 10,
    release: 60,
  })

  const { playSound } = useSound()

  useEffect(() => {
    // In a real app, this would interact with the Web Audio API
    console.log("Synth params changed:", params)
  }, [params])

  const updateParam = (param: keyof typeof params) => (value: number) => {
    setParams((prev) => ({ ...prev, [param]: value }))
    playSound("ritual-step")
  }

  const triggerNote = () => {
    console.log("Triggering note with params:", params)
    playSound("ui-success")
  }

  return { params, updateParam, triggerNote }
}

export const SvgInteractiveSynth: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const masterGainRef = useRef<GainNode | null>(null)
  const pluginInstanceRef = useRef<MockSynthPlugin | null>(null)
  const [pluginParameters, setPluginParameters] = useState<PluginParameterDescriptor[]>([])
  const [pluginParamValues, setPluginParamValues] = useState<Record<string, number | string>>({})
  const [isPowered, setIsPowered] = useState(false)
  const [masterVolume, setMasterVolume] = useState(0.5)
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set())
  const [activeMidiNotes, setActiveMidiNotes] = useState<Set<number>>(new Set())
  const { playSound } = useSound()
  const synthContainerRef = useRef<HTMLDivElement>(null)
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null)
  const [midiInputs, setMidiInputs] = useState<WebMidi.MIDIInput[]>([])
  const [selectedMidiInputId, setSelectedMidiInputId] = useState<string | null>(null)
  const [presets, setPresets] = useState<Record<string, Record<string, number | string>>>({})
  const [currentPresetName, setCurrentPresetName] = useState<string>("")
  const [selectedPresetToLoad, setSelectedPresetToLoad] = useState<string>("")
  const activeKeysRef = useRef<Set<string>>(new Set())
  const [octaveOffset, setOctaveOffset] = useState(0)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const { params, updateParam, triggerNote } = useMockSynth()

  const initializeAudio = useCallback(() => {
    if (!audioContextRef.current) {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = context
      masterGainRef.current = context.createGain()
      masterGainRef.current.gain.setValueAtTime(masterVolume, context.currentTime)
      masterGainRef.current.connect(context.destination)
      pluginInstanceRef.current = new MockSynthPlugin(context, masterGainRef.current)
      const params = pluginInstanceRef.current.getDescriptor()
      setPluginParameters(params)
      const initialValues: Record<string, number | string> = {}
      params.forEach((p) => (initialValues[p.id] = p.defaultValue))
      setPluginParamValues(initialValues)
      pluginInstanceRef.current.setPreset(initialValues)
      console.log("Audio and Mock Plugin Initialized")
    }
  }, [masterVolume])

  const debouncedSetPluginParamValues = useCallback((id: string, value: number | string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      setPluginParamValues((prev) => {
        if (prev[id] === value) return prev
        return { ...prev, [id]: value }
      })
    }, 50)
  }, [])

  const handlePluginParamChange = useCallback(
    (id: string, value: number | string) => {
      if (!pluginInstanceRef.current) return
      pluginInstanceRef.current.setParameter(id, value)
      debouncedSetPluginParamValues(id, value)
    },
    [debouncedSetPluginParamValues],
  )

  const loadPresetsFromStorage = useCallback(() => {
    const storedPresets = localStorage.getItem("howlinMoldSynthPresets")
    if (storedPresets) {
      try {
        setPresets(JSON.parse(storedPresets))
      } catch (e) {
        console.error("Failed to parse presets from localStorage", e)
        setPresets({})
      }
    }
  }, [])

  const powerToggle = useCallback(() => {
    playSound(isPowered ? "error" : "success")
    if (!isPowered) {
      initializeAudio()
      setIsPowered(true)
      synthContainerRef.current?.focus()
      setupMidi()
      loadPresetsFromStorage()
    } else {
      pluginInstanceRef.current?.allNotesOff()
      pluginInstanceRef.current?.disconnect()
      setIsPowered(false)
      setActiveKeys(new Set())
      setActiveMidiNotes(new Set())
      setOctaveOffset(0)
      if (midiAccess) {
        midiInputs.forEach((input) => (input.onmidimessage = null))
      }
    }
  }, [isPowered, initializeAudio, playSound, midiAccess, midiInputs, loadPresetsFromStorage])

  const setupMidi = useCallback(async () => {
    if (navigator.requestMIDIAccess) {
      try {
        const access = await navigator.requestMIDIAccess({ sysex: false })
        setMidiAccess(access)
        const inputs = Array.from(access.inputs.values())
        setMidiInputs(inputs)
        access.onstatechange = (event) => {
          setMidiInputs(Array.from((event.currentTarget as WebMidi.MIDIAccess).inputs.values()))
        }
      } catch (error) {
        console.error("Failed to get MIDI access", error)
        toast.error("Failed to access MIDI devices.")
      }
    } else {
      toast.warning("Web MIDI API not supported in this browser.")
    }
  }, [])

  useEffect(() => {
    if (!selectedMidiInputId || !midiAccess || !isPowered) {
      midiInputs.forEach((input) => {
        if (input.state === "connected") input.onmidimessage = null
      })
      return
    }
    const selectedInput = midiInputs.find((input) => input.id === selectedMidiInputId)
    if (selectedInput) {
      selectedInput.onmidimessage = (event: WebMidi.MIDIMessageEvent) => {
        if (!pluginInstanceRef.current) return
        const [command, note, velocity] = event.data
        if (command === 144 && velocity > 0) {
          pluginInstanceRef.current.noteOn(note, velocity)
          setActiveMidiNotes((prev) => new Set(prev).add(note))
        } else if (command === 128 || (command === 144 && velocity === 0)) {
          pluginInstanceRef.current.noteOff(note)
          setActiveMidiNotes((prev) => {
            const next = new Set(prev)
            next.delete(note)
            return next
          })
        }
      }
      toast.success(`MIDI Input "${selectedInput.name}" connected.`)
    }
    return () => {
      if (selectedInput) selectedInput.onmidimessage = null
    }
  }, [selectedMidiInputId, midiAccess, midiInputs, isPowered])

  useEffect(() => {
    if (!isPowered) {
      if (activeKeysRef.current.size > 0 && pluginInstanceRef.current) {
        activeKeysRef.current.forEach((key) => {
          const keyData = KEYBOARD_NOTE_MAP[key]
          if (keyData) pluginInstanceRef.current?.noteOff(keyData.midi + octaveOffset)
        })
        activeKeysRef.current.clear()
        setActiveKeys(new Set())
      }
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || !pluginInstanceRef.current) return
      const key = event.key.toLowerCase()

      if (key === "z" || key === "x") {
        playSound("click")
        setOctaveOffset((currentGlobalOctaveOffset) => {
          let newOctaveOffset = currentGlobalOctaveOffset
          if (key === "x") {
            newOctaveOffset = Math.min(MAX_OCTAVE_SEMITONES, currentGlobalOctaveOffset + OCTAVE_STEP)
          } else if (key === "z") {
            newOctaveOffset = Math.max(MIN_OCTAVE_SEMITONES, currentGlobalOctaveOffset - OCTAVE_STEP)
          }

          if (newOctaveOffset !== currentGlobalOctaveOffset) {
            activeKeysRef.current.forEach((heldKeyChar) => {
              const keyData = KEYBOARD_NOTE_MAP[heldKeyChar]
              if (keyData) {
                pluginInstanceRef.current?.noteOff(keyData.midi + currentGlobalOctaveOffset)
                pluginInstanceRef.current?.noteOn(keyData.midi + newOctaveOffset, 100)
              }
            })
          }
          return newOctaveOffset
        })
        return
      }

      const keyData = KEYBOARD_NOTE_MAP[key]
      if (keyData && !activeKeysRef.current.has(key)) {
        activeKeysRef.current.add(key)
        setActiveKeys(new Set(activeKeysRef.current))
        pluginInstanceRef.current.noteOn(keyData.midi + octaveOffset, 100)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!pluginInstanceRef.current) return
      const key = event.key.toLowerCase()
      if (key === "z" || key === "x") return

      const keyData = KEYBOARD_NOTE_MAP[key]
      if (keyData && activeKeysRef.current.has(key)) {
        activeKeysRef.current.delete(key)
        setActiveKeys(new Set(activeKeysRef.current))
        pluginInstanceRef.current.noteOff(keyData.midi + octaveOffset)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      if (pluginInstanceRef.current) {
        activeKeysRef.current.forEach((key) => {
          const keyData = KEYBOARD_NOTE_MAP[key]
          if (keyData) pluginInstanceRef.current?.noteOff(keyData.midi + octaveOffset)
        })
      }
    }
  }, [isPowered, octaveOffset, playSound])

  useEffect(() => {
    if (isPowered && masterGainRef.current && audioContextRef.current) {
      masterGainRef.current.gain.linearRampToValueAtTime(masterVolume, audioContextRef.current.currentTime + 0.05)
    }
  }, [masterVolume, isPowered])

  const savePreset = useCallback(() => {
    if (!pluginInstanceRef.current || !currentPresetName.trim()) {
      toast.error("Please enter a preset name.")
      return
    }
    const presetData = pluginInstanceRef.current.getPreset()
    const newPresets = { ...presets, [currentPresetName.trim()]: presetData }
    setPresets(newPresets)
    localStorage.setItem("howlinMoldSynthPresets", JSON.stringify(newPresets))
    toast.success(`Preset "${currentPresetName.trim()}" saved!`)
    setCurrentPresetName("")
  }, [currentPresetName, presets])

  const loadPreset = useCallback(() => {
    if (!pluginInstanceRef.current || !selectedPresetToLoad || !presets[selectedPresetToLoad]) {
      toast.error("Please select a valid preset to load.")
      return
    }
    const presetData = presets[selectedPresetToLoad]
    pluginInstanceRef.current.setPreset(presetData)
    setPluginParamValues(presetData)
    toast.success(`Preset "${selectedPresetToLoad}" loaded!`)
  }, [selectedPresetToLoad, presets])

  const deletePreset = useCallback(() => {
    if (!selectedPresetToLoad || !presets[selectedPresetToLoad]) {
      toast.error("Please select a valid preset to delete.")
      return
    }
    const newPresets = { ...presets }
    delete newPresets[selectedPresetToLoad]
    setPresets(newPresets)
    localStorage.setItem("howlinMoldSynthPresets", JSON.stringify(newPresets))
    toast.success(`Preset "${selectedPresetToLoad}" deleted.`)
    setSelectedPresetToLoad("")
  }, [selectedPresetToLoad, presets])

  const renderKeyboard = () => {
    const whiteKeyWidth = 35,
      blackKeyWidth = whiteKeyWidth * 0.6
    const whiteKeyHeight = 120,
      blackKeyHeight = whiteKeyHeight * 0.65
    const keyStroke = "hsl(var(--border))"
    const whiteFill = "hsl(var(--secondary-foreground) / 0.7)"
    const blackFill = "hsl(var(--secondary))"
    const activeWhiteFill = "hsl(var(--primary))"
    const activeBlackFill = "hsl(var(--primary) / 0.8)"
    let currentX = 0
    const keyElements: React.ReactNode[] = []

    SVG_KEY_ORDER.forEach((keyChar) => {
      const keyData = KEYBOARD_NOTE_MAP[keyChar]
      if (!keyData) return
      const isPhysicallyActive = activeKeys.has(keyChar)
      const isMidiActive =
        activeMidiNotes.has(keyData.midi) ||
        activeMidiNotes.has(keyData.midi + OCTAVE_STEP) ||
        activeMidiNotes.has(keyData.midi - OCTAVE_STEP)
      const isActive = isPhysicallyActive || isMidiActive

      const handleMouseDown = () => {
        if (!isPowered || !pluginInstanceRef.current) return
        pluginInstanceRef.current.noteOn(keyData.midi + octaveOffset, 100)
        activeKeysRef.current.add(keyChar)
        setActiveKeys(new Set(activeKeysRef.current))
      }
      const handleMouseUpOrLeave = () => {
        if (!pluginInstanceRef.current || !activeKeysRef.current.has(keyChar)) return
        pluginInstanceRef.current.noteOff(keyData.midi + octaveOffset)
        activeKeysRef.current.delete(keyChar)
        setActiveKeys(new Set(activeKeysRef.current))
      }

      if (keyData.type === "white") {
        keyElements.push(
          <rect
            key={keyChar}
            x={currentX}
            y="0"
            width={whiteKeyWidth}
            height={whiteKeyHeight}
            fill={isActive ? activeWhiteFill : whiteFill}
            stroke={keyStroke}
            strokeWidth="1"
            className="cursor-pointer transition-colors duration-50"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUpOrLeave}
          />,
        )
        currentX += whiteKeyWidth
      }
    })
    currentX = 0
    SVG_KEY_ORDER.forEach((keyChar) => {
      const keyData = KEYBOARD_NOTE_MAP[keyChar]
      if (!keyData) return
      const isPhysicallyActive = activeKeys.has(keyChar)
      const isMidiActive =
        activeMidiNotes.has(keyData.midi) ||
        activeMidiNotes.has(keyData.midi + OCTAVE_STEP) ||
        activeMidiNotes.has(keyData.midi - OCTAVE_STEP)
      const isActive = isPhysicallyActive || isMidiActive

      const handleMouseDown = () => {
        if (!isPowered || !pluginInstanceRef.current) return
        pluginInstanceRef.current.noteOn(keyData.midi + octaveOffset, 100)
        activeKeysRef.current.add(keyChar)
        setActiveKeys(new Set(activeKeysRef.current))
      }
      const handleMouseUpOrLeave = () => {
        if (!pluginInstanceRef.current || !activeKeysRef.current.has(keyChar)) return
        pluginInstanceRef.current.noteOff(keyData.midi + octaveOffset)
        activeKeysRef.current.delete(keyChar)
        setActiveKeys(new Set(activeKeysRef.current))
      }

      if (keyData.type === "white") {
        currentX += whiteKeyWidth
      } else if (keyData.type === "black") {
        let blackKeyX = 0
        if (keyChar === "w") blackKeyX = whiteKeyWidth * 0.65
        else if (keyChar === "e") blackKeyX = whiteKeyWidth * 1.65
        else if (keyChar === "t") blackKeyX = whiteKeyWidth * 3.65
        else if (keyChar === "y") blackKeyX = whiteKeyWidth * 4.65
        else if (keyChar === "u") blackKeyX = whiteKeyWidth * 5.65
        else if (keyChar === "o") blackKeyX = whiteKeyWidth * 7.65
        else if (keyChar === "p") blackKeyX = whiteKeyWidth * 8.65
        keyElements.push(
          <rect
            key={keyChar}
            x={blackKeyX}
            y="0"
            width={blackKeyWidth}
            height={blackKeyHeight}
            fill={isActive ? activeBlackFill : blackFill}
            stroke={keyStroke}
            strokeWidth="1"
            className="cursor-pointer transition-colors duration-50"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUpOrLeave}
          />,
        )
      }
    })
    const totalWidth = SVG_KEY_ORDER.filter((k) => KEYBOARD_NOTE_MAP[k]?.type === "white").length * whiteKeyWidth
    return (
      <svg
        width={totalWidth}
        height={whiteKeyHeight}
        className="rounded-md overflow-hidden shadow-md border border-primary/20 select-none"
        aria-label="Interactive synthesizer keyboard"
      >
        {keyElements}
      </svg>
    )
  }

  const renderSinglePluginControl = useCallback(
    (param: PluginParameterDescriptor) => {
      const currentValue = pluginParamValues[param.id]
      if (param.type === "knob") {
        return (
          <SvgKnob
            id={`plugin-${param.id}`}
            label={`${param.name}${param.unit ? ` (${param.unit})` : ""}`}
            min={param.min}
            max={param.max}
            step={param.step}
            initialValue={(currentValue as number) ?? (param.defaultValue as number)}
            onChange={(v) => handlePluginParamChange(param.id, v)}
            size={60}
          />
        )
      }
      if (param.type === "slider") {
        return (
          <div className="w-full px-1">
            <Label
              htmlFor={`plugin-${param.id}`}
              className="text-xs text-slate-400 mb-1 block text-center truncate"
              title={param.name}
            >
              {param.name}:{" "}
              {((currentValue as number) ?? (param.defaultValue as number)).toFixed(
                param.step < 0.1 ? 2 : param.step < 1 ? 1 : 0,
              )}
              {param.unit || ""}
            </Label>
            <Slider
              id={`plugin-${param.id}`}
              value={[(currentValue as number) ?? (param.defaultValue as number)]}
              onValueChange={(v) => handlePluginParamChange(param.id, v[0])}
              min={param.min}
              max={param.max}
              step={param.step}
              className="[&>span:first-child]:h-1"
              aria-label={param.name}
            />
          </div>
        )
      }
      if (param.type === "select" && param.options) {
        return (
          <div className="w-full px-1">
            <Label
              htmlFor={`plugin-${param.id}`}
              className="text-xs text-slate-400 mb-1 block text-center truncate"
              title={param.name}
            >
              {param.name}
            </Label>
            <Select
              value={String(currentValue ?? param.defaultValue)}
              onValueChange={(v) =>
                handlePluginParamChange(param.id, param.options.find((opt) => String(opt.value) === v)?.value ?? v)
              }
            >
              <SelectTrigger id={`plugin-${param.id}`} className="w-full bg-background text-xs h-8">
                <SelectValue placeholder={`Select ${param.name}`} />
              </SelectTrigger>
              <SelectContent>
                {param.options.map((opt) => (
                  <SelectItem key={String(opt.value)} value={String(opt.value)} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      }
      return null
    },
    [pluginParamValues, handlePluginParamChange],
  )

  const groupedParameters = useMemo(() => {
    const groups: Record<string, PluginParameterDescriptor[]> = {}
    pluginParameters.forEach((param) => {
      if (!groups[param.section]) {
        groups[param.section] = []
      }
      groups[param.section].push(param)
    })
    const sectionOrder = ["Oscillator", "Filter", "Amplifier Envelope", "LFO", "Effects"]
    const orderedGroups: Record<string, PluginParameterDescriptor[]> = {}
    sectionOrder.forEach((sectionName) => {
      if (groups[sectionName]) {
        orderedGroups[sectionName] = groups[sectionName]
      }
    })
    Object.keys(groups).forEach((sectionName) => {
      if (!orderedGroups[sectionName]) {
        orderedGroups[sectionName] = groups[sectionName]
      }
    })
    return orderedGroups
  }, [pluginParameters])

  return (
    <div
      ref={synthContainerRef}
      className="p-4 sm:p-6 bg-black/60 backdrop-blur-lg border border-primary/40 rounded-xl shadow-2xl shadow-primary/20 my-12 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      tabIndex={-1}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-orbitron text-primary flex items-center">
          <Zap className="w-7 h-7 mr-3 text-amber-400" />
          Plugin Altar
        </h3>
        <Button
          onClick={powerToggle}
          variant="outline"
          size="icon"
          className={`border-2 ${isPowered ? "border-green-500 text-green-500 hover:bg-green-500/10" : "border-red-500 text-red-500 hover:bg-red-500/10"}`}
          aria-pressed={isPowered}
          aria-label={isPowered ? "Power off synth" : "Power on synth"}
        >
          <Power className="w-5 h-5" />
        </Button>
      </div>
      {isPowered ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 rounded-lg bg-card/60 border border-primary/20">
            <div>
              <Label htmlFor="midi-input-select" className="text-sm text-amber-300">
                MIDI Input Device
              </Label>
              <Select
                value={selectedMidiInputId || ""}
                onValueChange={setSelectedMidiInputId}
                disabled={midiInputs.length === 0}
              >
                <SelectTrigger id="midi-input-select" className="w-full bg-background mt-1">
                  <SelectValue placeholder="Select MIDI Input..." />
                </SelectTrigger>
                <SelectContent>
                  {midiInputs.length > 0 ? (
                    midiInputs.map((input) => (
                      <SelectItem key={input.id} value={input.id}>
                        {input.name} ({input.manufacturer})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No MIDI devices found
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm text-amber-300">Preset Management</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Preset Name"
                  value={currentPresetName}
                  onChange={(e) => setCurrentPresetName(e.target.value)}
                  className="bg-background flex-grow"
                />
                <Button onClick={savePreset} variant="outline" size="icon" title="Save Preset">
                  <Save className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Select
                  value={selectedPresetToLoad}
                  onValueChange={setSelectedPresetToLoad}
                  disabled={Object.keys(presets).length === 0}
                >
                  <SelectTrigger className="w-full bg-background flex-grow">
                    <SelectValue placeholder="Load Preset..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(presets).length > 0 ? (
                      Object.keys(presets).map((name) => (
                        <SelectItem key={name} value={name}>
                          {name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        No presets saved
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <Button
                  onClick={loadPreset}
                  variant="outline"
                  size="icon"
                  title="Load Preset"
                  disabled={!selectedPresetToLoad}
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <Button
                  onClick={deletePreset}
                  variant="destructive"
                  size="icon"
                  title="Delete Preset"
                  disabled={!selectedPresetToLoad}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-8 mb-6 p-4 rounded-lg bg-card/60 border border-primary/20">
            <h4 className="text-xl font-syne text-center text-amber-300 mb-2 flex items-center justify-center">
              <Settings2 className="w-6 h-6 mr-2" />
              MockSynth v1.0 Controls
            </h4>
            {Object.entries(groupedParameters).map(([sectionName, paramsInSection]) => (
              <div key={sectionName} className="border border-primary/10 p-3 rounded-md bg-background/30">
                <h5 className="text-md font-semibold text-amber-400 mb-4 flex items-center">
                  <SlidersHorizontal size={18} className="mr-2 opacity-70" /> {sectionName}
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 gap-y-5 items-start justify-center">
                  {paramsInSection.map((param) => (
                    <div key={param.id} className="flex flex-col items-center">
                      {renderSinglePluginControl(param)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 items-end">
            {/* Oscillators */}
            <div className="p-3 bg-black/30 rounded-lg border border-border col-span-2 sm:col-span-3 md:col-span-2 flex flex-col items-center space-y-4">
              <h4 className="text-xs font-mono uppercase text-muted-foreground">Oscillators</h4>
              <div className="flex justify-around w-full">
                <SvgKnob
                  label="Waveform 1"
                  value={params.osc1}
                  onChange={updateParam("osc1")}
                  color="hsl(var(--primary))"
                />
                <SvgKnob
                  label="Waveform 2"
                  value={params.osc2}
                  onChange={updateParam("osc2")}
                  color="hsl(var(--primary))"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="p-3 bg-black/30 rounded-lg border border-border col-span-2 sm:col-span-3 md:col-span-2 flex flex-col items-center space-y-4">
              <h4 className="text-xs font-mono uppercase text-muted-foreground">Filter</h4>
              <div className="flex justify-around w-full">
                <SvgKnob
                  label="Cutoff"
                  value={params.filter}
                  onChange={updateParam("filter")}
                  color="hsl(260, 80%, 70%)"
                />
                <SvgKnob
                  label="Resonance"
                  value={params.resonance}
                  onChange={updateParam("resonance")}
                  color="hsl(260, 80%, 70%)"
                />
              </div>
            </div>

            {/* Envelope */}
            <div className="p-3 bg-black/30 rounded-lg border border-border col-span-2 sm:col-span-3 md:col-span-2 flex flex-col items-center space-y-4">
              <h4 className="text-xs font-mono uppercase text-muted-foreground">Envelope</h4>
              <div className="flex justify-around w-full">
                <SvgKnob
                  label="Attack"
                  value={params.attack}
                  onChange={updateParam("attack")}
                  color="hsl(160, 80%, 60%)"
                />
                <SvgKnob
                  label="Release"
                  value={params.release}
                  onChange={updateParam("release")}
                  color="hsl(160, 80%, 60%)"
                />
              </div>
            </div>

            {/* Master Control */}
            <div className="p-3 bg-black/30 rounded-lg border border-border col-span-2 sm:col-span-3 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center space-y-4">
              <h4 className="text-xs font-mono uppercase text-muted-foreground">Trigger</h4>
              <Button
                onClick={triggerNote}
                size="lg"
                className="w-16 h-16 rounded-full bg-primary/80 hover:bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-primary/50 flex flex-col"
              >
                <Zap className="w-6 h-6" />
                <span className="text-xs mt-1">Play</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4 my-8">
            <div className="flex items-center space-x-3 text-sm text-slate-300">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  playSound("click")
                  setOctaveOffset((prev) => Math.max(MIN_OCTAVE_SEMITONES, prev - OCTAVE_STEP))
                }}
                title="Octave Down (Z)"
              >
                <ChevronsDown className="w-4 h-4" />
              </Button>
              <span className="font-mono w-20 text-center tabular-nums bg-background/50 px-2 py-1 rounded">
                Octave: {octaveOffset / OCTAVE_STEP >= 0 ? "+" : ""}
                {octaveOffset / OCTAVE_STEP}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  playSound("click")
                  setOctaveOffset((prev) => Math.min(MAX_OCTAVE_SEMITONES, prev + OCTAVE_STEP))
                }}
                title="Octave Up (X)"
              >
                <ChevronsUp className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  playSound("click")
                  setOctaveOffset(0)
                }}
                title="Reset Octave"
                disabled={octaveOffset === 0}
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
            </div>
            {renderKeyboard()}
            <p className="text-xs text-slate-500 mt-2">
              Use Z / X keys to shift octaves. Click buttons or use keyboard.
            </p>
          </div>

          <div className="pt-3 space-y-1 mb-8">
            <Label htmlFor="master-volume" className="text-xs text-slate-400 flex items-center justify-center">
              {masterVolume > 0 ? <Volume2 className="w-4 h-4 mr-1" /> : <VolumeX className="w-4 h-4 mr-1" />}Master
              Vol: {(masterVolume * 100).toFixed(0)}%
            </Label>
            <Slider
              id="master-volume"
              value={[masterVolume]}
              onValueChange={(v) => setMasterVolume(v[0])}
              min={0}
              max={1}
              step={0.01}
              aria-label="Master volume"
            />
          </div>
        </>
      ) : (
        <div className="text-center py-10 text-slate-500">
          <KeyboardIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Power up the Plugin Altar to begin transmutation.</p>
          <p className="text-xs mt-2">
            (Use A,S,D,F,G,H,J,K,L,; and W,E,T,Y,U,O,P keys, or connect a MIDI keyboard. Z/X for octaves.)
          </p>
        </div>
      )}
    </div>
  )
}
