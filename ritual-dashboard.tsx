"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AudioEngineProvider, useAudioEngine } from "@/contexts/audio-engine-context"
import { Waves, Volume2, Filter, Zap, Siren } from "lucide-react"
import { AudioVisualizer } from "@/components/synth/audio-visualizer"
import { Sequencer } from "@/components/synth/sequencer"
import { KeyboardInterface } from "@/components/synth/keyboard-interface"
import { MidiController } from "@/components/synth/midi-controller"
import { MidiCCMapper } from "@/components/synth/midi-cc-mapper"
import { Button } from "@/components/ui/button"

const AudioController = () => {
  const {
    gain,
    oscillatorType,
    filterCutoff,
    filterQ,
    filterType,
    attack,
    decay,
    sustain,
    release,
    lfoRate,
    lfoDepth,
    lfoWaveform,
    panic,
    setGain,
    setOscillatorType,
    setFilterCutoff,
    setFilterQ,
    setFilterType,
    setAttack,
    setDecay,
    setSustain,
    setRelease,
    setLfoRate,
    setLfoDepth,
    setLfoWaveform,
  } = useAudioEngine()

  const handleOscillatorTypeChange = (value: OscillatorType) => {
    if (value) setOscillatorType(value)
  }

  const handleFilterTypeChange = (value: BiquadFilterType) => {
    if (value) setFilterType(value)
  }

  const handleLfoWaveformChange = (value: OscillatorType) => {
    if (value) setLfoWaveform(value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
      {/* Column 1: Oscillator & LFO */}
      <div className="space-y-4">
        <div className="rounded-lg bg-black/20 p-4 space-y-4">
          <div className="text-center font-semibold text-primary/80">OSCILLATOR</div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={oscillatorType}
            onValueChange={handleOscillatorTypeChange}
            className="grid grid-cols-2 gap-1"
          >
            <ToggleGroupItem value="sine">Sine</ToggleGroupItem>
            <ToggleGroupItem value="square">Square</ToggleGroupItem>
            <ToggleGroupItem value="sawtooth">Saw</ToggleGroupItem>
            <ToggleGroupItem value="triangle">Tri</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <div className="rounded-lg bg-black/20 p-4 space-y-4">
          <div className="text-center font-semibold text-primary/80">LFO</div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={lfoWaveform}
            onValueChange={handleLfoWaveformChange}
            className="grid grid-cols-2 gap-1"
          >
            <ToggleGroupItem value="sine">Sine</ToggleGroupItem>
            <ToggleGroupItem value="square">Square</ToggleGroupItem>
            <ToggleGroupItem value="sawtooth">Saw</ToggleGroupItem>
            <ToggleGroupItem value="triangle">Tri</ToggleGroupItem>
          </ToggleGroup>
          <div className="flex items-center gap-3 pt-2">
            <Zap className="text-primary" />
            <Slider value={[lfoRate]} onValueChange={(v) => setLfoRate(v[0])} min={0.1} max={20} step={0.1} />
          </div>
          <div className="text-center text-sm text-muted-foreground">Rate: {lfoRate.toFixed(1)} Hz</div>
          <div className="flex items-center gap-3 pt-2">
            <Waves className="text-primary" />
            <Slider value={[lfoDepth]} onValueChange={(v) => setLfoDepth(v[0])} min={0} max={5000} step={10} />
          </div>
          <div className="text-center text-sm text-muted-foreground">Depth: {lfoDepth.toFixed(0)}</div>
        </div>
      </div>

      {/* Column 2: Filter & MIDI */}
      <div className="space-y-4">
        <div className="space-y-4 rounded-lg bg-black/20 p-4">
          <div className="text-center font-semibold text-primary/80 mb-2">FILTER</div>
          <ToggleGroup
            type="single"
            variant="outline"
            value={filterType}
            onValueChange={handleFilterTypeChange}
            className="grid grid-cols-2 gap-1"
          >
            <ToggleGroupItem value="lowpass">LP</ToggleGroupItem>
            <ToggleGroupItem value="highpass">HP</ToggleGroupItem>
            <ToggleGroupItem value="bandpass">BP</ToggleGroupItem>
            <ToggleGroupItem value="notch">Notch</ToggleGroupItem>
          </ToggleGroup>
          <div className="flex items-center gap-3 pt-2">
            <Filter className="text-primary" />
            <Slider
              value={[filterCutoff]}
              onValueChange={(v) => setFilterCutoff(v[0])}
              min={20}
              max={20000}
              step={10}
            />
          </div>
          <div className="text-center text-sm text-muted-foreground">Cutoff: {filterCutoff.toFixed(0)} Hz</div>
          <div className="flex items-center gap-3 pt-4">
            <Waves className="text-primary" />
            <Slider value={[filterQ]} onValueChange={(v) => setFilterQ(v[0])} min={0.1} max={20} step={0.1} />
          </div>
          <div className="text-center text-sm text-muted-foreground">Resonance: {filterQ.toFixed(1)}</div>
        </div>
        <MidiController />
      </div>

      {/* Column 3: Envelope, Amp & CC Map */}
      <div className="space-y-4">
        <div className="space-y-2 rounded-lg bg-black/20 p-4">
          <div className="text-center font-semibold text-primary/80 mb-2">ENVELOPE</div>
          <div className="text-xs text-muted-foreground">Attack: {attack.toFixed(2)}s</div>
          <Slider value={[attack]} onValueChange={(v) => setAttack(v[0])} min={0.01} max={2} step={0.01} />
          <div className="text-xs text-muted-foreground pt-2">Decay: {decay.toFixed(2)}s</div>
          <Slider value={[decay]} onValueChange={(v) => setDecay(v[0])} min={0.01} max={2} step={0.01} />
          <div className="text-xs text-muted-foreground pt-2">Sustain: {(sustain * 100).toFixed(0)}%</div>
          <Slider value={[sustain]} onValueChange={(v) => setSustain(v[0])} min={0} max={1} step={0.01} />
          <div className="text-xs text-muted-foreground pt-2">Release: {release.toFixed(2)}s</div>
          <Slider value={[release]} onValueChange={(v) => setRelease(v[0])} min={0.01} max={4} step={0.01} />
        </div>
        <div className="space-y-4 rounded-lg bg-black/20 p-4">
          <div className="text-center font-semibold text-primary/80 mb-2">AMPLIFIER</div>
          <div className="flex items-center gap-3">
            <Volume2 className="text-primary" />
            <Slider value={[gain]} onValueChange={(v) => setGain(v[0])} min={0} max={1} step={0.01} />
          </div>
          <div className="text-center text-sm text-muted-foreground">Master Gain: {(gain * 100).toFixed(0)}%</div>
          <Button onClick={panic} variant="destructive" size="sm" className="w-full mt-2">
            <Siren className="mr-2 h-4 w-4" />
            Panic
          </Button>
        </div>
        <MidiCCMapper />
      </div>
    </div>
  )
}

const RitualDashboardContent = () => {
  return (
    <Card className="bg-black/50 border-primary/20">
      <CardHeader>
        <CardTitle className="text-primary text-center font-orbitron">Ritual Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <AudioVisualizer />
        <Sequencer />
        <AudioController />
        <KeyboardInterface />
      </CardContent>
    </Card>
  )
}

export default function RitualDashboard() {
  return (
    <AudioEngineProvider>
      <RitualDashboardContent />
    </AudioEngineProvider>
  )
}
