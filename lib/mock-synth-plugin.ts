// lib/mock-synth-plugin.ts
import type { OscillatorType } from "@/components/synth/svg-interactive-synth"

export interface PluginParameterDescriptor {
  id: string
  name: string
  min: number
  max: number
  step: number
  defaultValue: number | string
  type: "knob" | "slider" | "select"
  options?: { value: string | number; label: string }[]
  unit?: string
  section: string
}

interface ActiveVoice {
  osc: OscillatorNode
  subOsc?: OscillatorNode
  subGain?: GainNode
  gain: GainNode
  filter: BiquadFilterNode
  midiNote: number
}

export class MockSynthPlugin {
  private audioContext: AudioContext
  private outputNode: AudioNode
  private activeVoices: Map<number, ActiveVoice> = new Map()

  private params: Record<string, number | string> = {
    mainOscType: "sine", // Defaulted to sine
    mainOscDetune: 0,
    subOscOctave: -1,
    subOscMix: 0.3,
    filterCutoff: 8000,
    filterResonance: 1,
    filterEnvAmount: 0.5,
    ampAttack: 0.05,
    ampDecay: 0.1,
    ampSustain: 0.7,
    ampRelease: 0.3,
    lfoRate: 5,
    lfoToFilterCutoff: 0,
    lfoToPitch: 0,
    delayTime: 0.3,
    delayFeedback: 0.4,
    delayMix: 0.3,
  }

  private lfoNode?: OscillatorNode
  private lfoGainPitch?: GainNode
  private lfoGainFilter?: GainNode
  private delayNode?: DelayNode
  private delayFeedbackNode?: GainNode
  private delayWetGain?: GainNode
  private delayDryGain?: GainNode

  private readonly parameterDescriptors: PluginParameterDescriptor[] = [
    // Oscillator Section
    {
      id: "mainOscType",
      name: "Osc Type",
      min: 0,
      max: 3,
      step: 1,
      defaultValue: "sine", // Defaulted to sine
      type: "select",
      options: [
        { value: "sine", label: "Sine" },
        { value: "square", label: "Square" },
        { value: "sawtooth", label: "Sawtooth" },
        { value: "triangle", label: "Triangle" },
      ],
      section: "Oscillator",
    },
    {
      id: "mainOscDetune",
      name: "Detune",
      min: -100,
      max: 100,
      step: 1,
      defaultValue: 0,
      type: "knob",
      unit: "cents",
      section: "Oscillator",
    },
    {
      id: "subOscOctave",
      name: "Sub Oct",
      min: -2,
      max: 0,
      step: 1,
      defaultValue: -1,
      type: "select",
      options: [
        { value: -2, label: "-2 Oct" },
        { value: -1, label: "-1 Oct" },
        { value: 0, label: "Same Oct" },
      ],
      section: "Oscillator",
    },
    {
      id: "subOscMix",
      name: "Sub Mix",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.3,
      type: "knob",
      section: "Oscillator",
    },

    // Filter Section
    {
      id: "filterCutoff",
      name: "Cutoff",
      min: 20,
      max: 20000,
      step: 1,
      defaultValue: 8000,
      type: "knob",
      unit: "Hz",
      section: "Filter",
    },
    {
      id: "filterResonance",
      name: "Resonance",
      min: 0.1,
      max: 30,
      step: 0.1,
      defaultValue: 1,
      type: "knob",
      unit: "Q",
      section: "Filter",
    },
    {
      id: "filterEnvAmount",
      name: "Flt Env Amt",
      min: -1,
      max: 1,
      step: 0.01,
      defaultValue: 0.5,
      type: "knob",
      section: "Filter",
    },

    // Amplifier Envelope Section
    {
      id: "ampAttack",
      name: "Attack",
      min: 0.01,
      max: 2,
      step: 0.01,
      defaultValue: 0.05,
      type: "slider",
      unit: "s",
      section: "Amplifier Envelope",
    },
    {
      id: "ampDecay",
      name: "Decay",
      min: 0.01,
      max: 2,
      step: 0.01,
      defaultValue: 0.1,
      type: "slider",
      unit: "s",
      section: "Amplifier Envelope",
    },
    {
      id: "ampSustain",
      name: "Sustain",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.7,
      type: "slider",
      section: "Amplifier Envelope",
    },
    {
      id: "ampRelease",
      name: "Release",
      min: 0.01,
      max: 5,
      step: 0.01,
      defaultValue: 0.3,
      type: "slider",
      unit: "s",
      section: "Amplifier Envelope",
    },

    // LFO Section
    {
      id: "lfoRate",
      name: "LFO Rate",
      min: 0.1,
      max: 20,
      step: 0.1,
      defaultValue: 5,
      type: "knob",
      unit: "Hz",
      section: "LFO",
    },
    {
      id: "lfoToFilterCutoff",
      name: "LFO>Filter",
      min: 0,
      max: 5000,
      step: 10,
      defaultValue: 0,
      type: "knob",
      unit: "Hz",
      section: "LFO",
    },
    {
      id: "lfoToPitch",
      name: "LFO>Pitch",
      min: 0,
      max: 1200,
      step: 10,
      defaultValue: 0,
      type: "knob",
      unit: "cents",
      section: "LFO",
    },

    // Effects Section
    {
      id: "delayTime",
      name: "Delay Time",
      min: 0.01,
      max: 1,
      step: 0.01,
      defaultValue: 0.3,
      type: "knob",
      unit: "s",
      section: "Effects",
    },
    {
      id: "delayFeedback",
      name: "Delay Fbk",
      min: 0,
      max: 0.95,
      step: 0.01,
      defaultValue: 0.4,
      type: "knob",
      section: "Effects",
    },
    {
      id: "delayMix",
      name: "Delay Mix",
      min: 0,
      max: 1,
      step: 0.01,
      defaultValue: 0.3,
      type: "knob",
      section: "Effects",
    },
  ]

  constructor(audioContext: AudioContext, outputNode: AudioNode) {
    this.audioContext = audioContext
    this.outputNode = outputNode
    this.setupLFO()
    this.setupDelay()
    this.syncAllParamsToAudioGraph()
  }

  private setupLFO() {
    if (!this.audioContext) return
    this.lfoNode = this.audioContext.createOscillator()
    this.lfoNode.type = "triangle"

    this.lfoGainPitch = this.audioContext.createGain()
    this.lfoGainFilter = this.audioContext.createGain()

    this.lfoNode.connect(this.lfoGainPitch)
    this.lfoNode.connect(this.lfoGainFilter)

    this.lfoNode.start()
    this.updateLFOParams()
  }

  private updateLFOParams() {
    if (!this.lfoNode || !this.lfoGainPitch || !this.lfoGainFilter || !this.audioContext) return
    const now = this.audioContext.currentTime
    this.lfoNode.frequency.setValueAtTime(this.params.lfoRate as number, now)
    this.lfoGainPitch.gain.setValueAtTime(this.params.lfoToPitch as number, now)
    this.lfoGainFilter.gain.setValueAtTime(this.params.lfoToFilterCutoff as number, now)
  }

  private setupDelay() {
    if (!this.audioContext) return
    this.delayNode = this.audioContext.createDelay(1.0)
    this.delayFeedbackNode = this.audioContext.createGain()
    this.delayWetGain = this.audioContext.createGain()
    this.delayDryGain = this.audioContext.createGain()

    this.delayNode.connect(this.delayFeedbackNode)
    this.delayFeedbackNode.connect(this.delayNode)

    this.delayNode.connect(this.delayWetGain)
    this.delayWetGain.connect(this.outputNode)
    this.delayDryGain.connect(this.outputNode)

    this.updateDelayParams()
  }

  private updateDelayParams() {
    if (!this.delayNode || !this.delayFeedbackNode || !this.delayWetGain || !this.delayDryGain || !this.audioContext)
      return
    const now = this.audioContext.currentTime
    this.delayNode.delayTime.setValueAtTime(this.params.delayTime as number, now)
    this.delayFeedbackNode.gain.setValueAtTime(this.params.delayFeedback as number, now)
    this.delayWetGain.gain.setValueAtTime(this.params.delayMix as number, now)
    this.delayDryGain.gain.setValueAtTime(1 - (this.params.delayMix as number), now)
  }

  getDescriptor(): PluginParameterDescriptor[] {
    return this.parameterDescriptors
  }

  setParameter(id: string, value: number | string) {
    if (this.params[id] !== undefined) {
      if (id === "mainOscType" && !["sine", "square", "sawtooth", "triangle"].includes(value as string)) {
        console.warn(`Invalid oscillator type: ${value}. Defaulting to sine.`)
        this.params[id] = "sine" // Default to sine if invalid
      } else {
        this.params[id] = value
      }
      this.syncParamToAudioGraph(id)
    }
  }

  getParameter(id: string): number | string | undefined {
    return this.params[id]
  }

  private midiToFrequency(midiNote: number): number {
    return 440 * Math.pow(2, (midiNote - 69) / 12)
  }

  noteOn(midiNote: number, velocity: number, time?: number) {
    if (!this.audioContext) return
    if (this.activeVoices.has(midiNote)) {
      this.noteOff(midiNote, time)
    }

    const now = time || this.audioContext.currentTime
    const frequency = this.midiToFrequency(midiNote)
    const gainValue = velocity / 127

    const osc = this.audioContext.createOscillator()
    osc.type = this.params.mainOscType as OscillatorType
    osc.frequency.setValueAtTime(frequency, now)
    osc.detune.setValueAtTime(this.params.mainOscDetune as number, now)
    if (this.lfoGainPitch) {
      this.lfoGainPitch.connect(osc.detune)
    }

    let subOsc: OscillatorNode | undefined
    let subGainNode: GainNode | undefined
    if ((this.params.subOscMix as number) > 0) {
      subOsc = this.audioContext.createOscillator()
      subOsc.type =
        this.params.mainOscType === "sine" || this.params.mainOscType === "triangle"
          ? (this.params.mainOscType as OscillatorType)
          : "sine"
      const subOctaveShift = this.params.subOscOctave as number
      subOsc.frequency.setValueAtTime(frequency * Math.pow(2, subOctaveShift), now)

      subGainNode = this.audioContext.createGain()
      subGainNode.gain.setValueAtTime(this.params.subOscMix as number, now)
      subOsc.connect(subGainNode)
    }

    const filter = this.audioContext.createBiquadFilter()
    filter.type = "lowpass"
    filter.frequency.setValueAtTime(this.params.filterCutoff as number, now)
    filter.Q.setValueAtTime(this.params.filterResonance as number, now)
    if (this.lfoGainFilter) {
      this.lfoGainFilter.connect(filter.frequency)
    }

    const envelopeGain = this.audioContext.createGain()
    envelopeGain.gain.setValueAtTime(0, now)

    osc.connect(filter)
    if (subGainNode) subGainNode.connect(filter)
    filter.connect(envelopeGain)

    if (this.delayNode && this.delayDryGain) {
      envelopeGain.connect(this.delayNode)
      envelopeGain.connect(this.delayDryGain)
    } else {
      envelopeGain.connect(this.outputNode)
    }

    osc.start(now)
    if (subOsc) subOsc.start(now)

    envelopeGain.gain.linearRampToValueAtTime(gainValue, now + (this.params.ampAttack as number))
    envelopeGain.gain.linearRampToValueAtTime(
      gainValue * (this.params.ampSustain as number),
      now + (this.params.ampAttack as number) + (this.params.ampDecay as number),
    )

    const filterEnvTarget = (this.params.filterCutoff as number) + (this.params.filterEnvAmount as number) * 5000
    filter.frequency.linearRampToValueAtTime(
      Math.max(20, Math.min(20000, filterEnvTarget)),
      now + (this.params.ampAttack as number),
    )
    filter.frequency.linearRampToValueAtTime(
      this.params.filterCutoff as number,
      now + (this.params.ampAttack as number) + (this.params.ampDecay as number),
    )

    this.activeVoices.set(midiNote, { osc, subOsc, subGain: subGainNode, gain: envelopeGain, filter, midiNote })
  }

  noteOff(midiNote: number, time?: number) {
    if (!this.audioContext || !this.activeVoices.has(midiNote)) return

    const voice = this.activeVoices.get(midiNote)!
    const now = time || this.audioContext.currentTime
    const releaseTime = now + (this.params.ampRelease as number)

    voice.gain.gain.cancelScheduledValues(now)
    voice.gain.gain.setValueAtTime(voice.gain.gain.value, now)
    voice.gain.gain.linearRampToValueAtTime(0, releaseTime)

    voice.filter.frequency.linearRampToValueAtTime(this.params.filterCutoff as number, releaseTime)

    voice.osc.stop(releaseTime + 0.1)
    if (voice.subOsc) voice.subOsc.stop(releaseTime + 0.1)

    setTimeout(
      () => {
        if (this.lfoGainPitch && voice.osc.detune) this.lfoGainPitch.disconnect(voice.osc.detune)
        if (this.lfoGainFilter && voice.filter.frequency) this.lfoGainFilter.disconnect(voice.filter.frequency)
        voice.osc.disconnect()
        if (voice.subOsc) voice.subOsc.disconnect()
        if (voice.subGain) voice.subGain.disconnect()
        voice.gain.disconnect()
        voice.filter.disconnect()
      },
      (releaseTime - now + 0.2) * 1000,
    )

    this.activeVoices.delete(midiNote)
  }

  allNotesOff() {
    if (!this.audioContext) return
    const now = this.audioContext.currentTime
    this.activeVoices.forEach((voice) => {
      this.noteOff(voice.midiNote, now)
    })
    this.activeVoices.clear()
  }

  getPreset(): Record<string, number | string> {
    return { ...this.params }
  }

  setPreset(preset: Record<string, number | string>) {
    for (const id in preset) {
      if (this.params[id] !== undefined) {
        if (id === "mainOscType" && !["sine", "square", "sawtooth", "triangle"].includes(preset[id] as string)) {
          this.params[id] = "sine" // Default to sine if invalid
        } else {
          this.params[id] = preset[id]
        }
      }
    }
    this.syncAllParamsToAudioGraph()
  }

  private syncParamToAudioGraph(id: string) {
    if (!this.audioContext) return

    if (id.startsWith("lfo")) this.updateLFOParams()
    if (id.startsWith("delay")) this.updateDelayParams()

    const now = this.audioContext.currentTime
    this.activeVoices.forEach((voice) => {
      switch (id) {
        case "mainOscType":
          voice.osc.type = this.params.mainOscType as OscillatorType
          if (voice.subOsc) {
            voice.subOsc.type =
              this.params.mainOscType === "sine" || this.params.mainOscType === "triangle"
                ? (this.params.mainOscType as OscillatorType)
                : "sine"
          }
          break
        case "mainOscDetune":
          voice.osc.detune.setValueAtTime(this.params.mainOscDetune as number, now)
          break
        case "subOscMix":
          if (voice.subGain) {
            voice.subGain.gain.setValueAtTime(this.params.subOscMix as number, now)
          }
          break
        case "subOscOctave":
          if (voice.subOsc) {
            const frequency = this.midiToFrequency(voice.midiNote)
            const subOctaveShift = this.params.subOscOctave as number
            voice.subOsc.frequency.setValueAtTime(frequency * Math.pow(2, subOctaveShift), now)
          }
          break
        case "filterCutoff":
          voice.filter.frequency.setValueAtTime(this.params.filterCutoff as number, now)
          break
        case "filterResonance":
          voice.filter.Q.setValueAtTime(this.params.filterResonance as number, now)
          break
      }
    })
  }

  private syncAllParamsToAudioGraph() {
    this.updateLFOParams()
    this.updateDelayParams()
    this.parameterDescriptors.forEach((p) => this.syncParamToAudioGraph(p.id))
  }

  connect(destinationNode: AudioNode) {
    this.outputNode = destinationNode
    if (this.delayDryGain) this.delayDryGain.connect(this.outputNode)
    if (this.delayWetGain) this.delayWetGain.connect(this.outputNode)
  }

  disconnect() {
    if (this.lfoGainPitch) this.lfoGainPitch.disconnect()
    if (this.lfoGainFilter) this.lfoGainFilter.disconnect()
    if (this.lfoNode) this.lfoNode.disconnect()

    if (this.delayDryGain) this.delayDryGain.disconnect()
    if (this.delayWetGain) this.delayWetGain.disconnect()

    this.allNotesOff()
    console.log("MockSynthPlugin disconnected and all voices stopped.")
  }
}
