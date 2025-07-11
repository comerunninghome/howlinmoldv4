"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SvgKnob } from "@/components/synth/svg-knob"
import { cn } from "@/lib/utils"
import { SvgInteractiveSynth } from "@/components/synth/svg-interactive-synth"

interface DeckState {
  id: string
  name: string
  active: boolean
  level: number
}

interface EffectModule {
  id: string
  name: string
  active: boolean
  parameters: Record<string, number>
}

interface CanonizationState {
  reverb: number
  saturate: number
  master: number
  inputA: boolean
  inputB: boolean
  inputG: boolean
}

interface SealingReelState {
  zoomMix: number
  sealed: boolean
}

export default function SynthTemplePage() {
  // Deck states
  const [decks, setDecks] = useState<DeckState[]>([
    { id: "A", name: "Deck Alpha", active: false, level: 0.5 },
    { id: "B", name: "Deck Beta", active: false, level: 0.5 },
    { id: "G", name: "Deck Gamma", active: false, level: 0.5 },
  ])

  // Effect modules
  const [effects, setEffects] = useState<EffectModule[]>([
    {
      id: "vidiot",
      name: "Vidiot Alpha Core",
      active: false,
      parameters: { intensity: 0.3, frequency: 0.5, resonance: 0.4 },
    },
    {
      id: "feedback",
      name: "Feedback Beta Lens",
      active: false,
      parameters: { feedback: 0.6, delay: 0.3, modulation: 0.2 },
    },
    {
      id: "splitter",
      name: "Ritual Gamma Splitter",
      active: false,
      parameters: { split: 0.5, phase: 0.0, width: 0.7 },
    },
  ])

  // Canonization state
  const [canonization, setCanonicalization] = useState<CanonizationState>({
    reverb: 0.2,
    saturate: 0.6,
    master: 0.75,
    inputA: true,
    inputB: true,
    inputG: true,
  })

  // Sealing Reel state
  const [sealingReel, setSealingReel] = useState<SealingReelState>({
    zoomMix: 0.5,
    sealed: false,
  })

  // Patch Bay state
  const [patchBay, setPatchBay] = useState({
    sealsDetected: 0,
    connections: [],
  })

  const toggleDeck = (deckId: string) => {
    setDecks((prev) => prev.map((deck) => (deck.id === deckId ? { ...deck, active: !deck.active } : deck)))
  }

  const updateDeckLevel = (deckId: string, level: number) => {
    setDecks((prev) => prev.map((deck) => (deck.id === deckId ? { ...deck, level } : deck)))
  }

  const toggleEffect = (effectId: string) => {
    setEffects((prev) =>
      prev.map((effect) => (effect.id === effectId ? { ...effect, active: !effect.active } : effect)),
    )
  }

  const updateEffectParameter = (effectId: string, param: string, value: number) => {
    setEffects((prev) =>
      prev.map((effect) =>
        effect.id === effectId ? { ...effect, parameters: { ...effect.parameters, [param]: value } } : effect,
      ),
    )
  }

  const updateCanonicalization = (param: keyof CanonizationState, value: number | boolean) => {
    setCanonicalization((prev) => ({ ...prev, [param]: value }))
  }

  const sealCurrentState = () => {
    setSealingReel((prev) => ({ ...prev, sealed: !prev.sealed }))
    setPatchBay((prev) => ({
      ...prev,
      sealsDetected: prev.sealsDetected + (sealingReel.sealed ? -1 : 1),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text mb-2">
            Synth Temple
          </h1>
          <p className="text-gray-300 text-lg">Vault Ritual Booth • Resonarium Integration</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Decks */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">Active Decks</h2>
            {decks.map((deck) => (
              <Card
                key={deck.id}
                className={cn(
                  "bg-gray-800/50 border-2 transition-all duration-300",
                  deck.active
                    ? "border-cyan-400 shadow-lg shadow-cyan-400/20"
                    : "border-gray-600 hover:border-gray-500",
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{deck.name}</CardTitle>
                    <Button
                      onClick={() => toggleDeck(deck.id)}
                      variant={deck.active ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "transition-all duration-200",
                        deck.active
                          ? "bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
                          : "border-cyan-400 text-cyan-400 hover:bg-cyan-400/10",
                      )}
                    >
                      {deck.id}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-400 min-w-[40px]">Level</span>
                    <SvgKnob
                      value={deck.level}
                      onChange={(value) => updateDeckLevel(deck.id, value)}
                      size={60}
                      color={deck.active ? "#06b6d4" : "#6b7280"}
                    />
                    <span className="text-sm text-white font-mono">{(deck.level * 100).toFixed(0)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Center Column - Effects & Canonization */}
          <div className="space-y-6">
            {/* Effect Modules */}
            <div>
              <h2 className="text-xl font-semibold text-purple-400 mb-4">Effect Modules</h2>
              <div className="space-y-3">
                {effects.map((effect) => (
                  <Card
                    key={effect.id}
                    className={cn(
                      "bg-gray-800/50 border-2 transition-all duration-300",
                      effect.active
                        ? "border-purple-400 shadow-lg shadow-purple-400/20"
                        : "border-gray-600 hover:border-gray-500",
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm text-white">{effect.name}</CardTitle>
                        <Button
                          onClick={() => toggleEffect(effect.id)}
                          variant={effect.active ? "default" : "outline"}
                          size="sm"
                          className={cn(
                            "h-6 px-2 text-xs transition-all duration-200",
                            effect.active
                              ? "bg-purple-500 hover:bg-purple-600 text-white"
                              : "border-purple-400 text-purple-400 hover:bg-purple-400/10",
                          )}
                        >
                          {effect.active ? "ON" : "OFF"}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(effect.parameters).map(([param, value]) => (
                          <div key={param} className="text-center">
                            <SvgKnob
                              value={value}
                              onChange={(newValue) => updateEffectParameter(effect.id, param, newValue)}
                              size={40}
                              color={effect.active ? "#a855f7" : "#6b7280"}
                            />
                            <p className="text-xs text-gray-400 mt-1 capitalize">{param}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Canonization Section */}
            <Card className="bg-gray-800/50 border-2 border-yellow-500 shadow-lg shadow-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400 text-center">Canonization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <SvgKnob
                      value={canonization.reverb}
                      onChange={(value) => updateCanonicalization("reverb", value)}
                      size={60}
                      color="#eab308"
                    />
                    <p className="text-sm text-yellow-400 mt-2">Reverb</p>
                    <p className="text-xs text-gray-400">{canonization.reverb.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <SvgKnob
                      value={canonization.saturate}
                      onChange={(value) => updateCanonicalization("saturate", value)}
                      size={60}
                      color="#eab308"
                    />
                    <p className="text-sm text-yellow-400 mt-2">Saturate</p>
                    <p className="text-xs text-gray-400">{canonization.saturate.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <SvgKnob
                      value={canonization.master}
                      onChange={(value) => updateCanonicalization("master", value)}
                      size={60}
                      color="#eab308"
                    />
                    <p className="text-sm text-yellow-400 mt-2">Master</p>
                    <p className="text-xs text-gray-400">{canonization.master.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  {["A", "B", "G"].map((input) => (
                    <Badge
                      key={input}
                      variant={canonization[`input${input}` as keyof CanonizationState] ? "default" : "outline"}
                      className={cn(
                        "cursor-pointer transition-all duration-200",
                        canonization[`input${input}` as keyof CanonizationState]
                          ? "bg-yellow-500 text-black hover:bg-yellow-600"
                          : "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10",
                      )}
                      onClick={() =>
                        updateCanonicalization(
                          `input${input}` as keyof CanonizationState,
                          !canonization[`input${input}` as keyof CanonizationState],
                        )
                      }
                    >
                      Input {input}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sealing Reel & Patch Bay */}
          <div className="space-y-6">
            {/* Sealing Reel */}
            <Card className="bg-gray-800/50 border-2 border-green-500 shadow-lg shadow-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400 text-center">Sealing Reel</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div>
                  <SvgKnob
                    value={sealingReel.zoomMix}
                    onChange={(value) => setSealingReel((prev) => ({ ...prev, zoomMix: value }))}
                    size={80}
                    color="#22c55e"
                  />
                  <p className="text-sm text-green-400 mt-2">Zoom Mix</p>
                  <p className="text-xs text-gray-400">{sealingReel.zoomMix.toFixed(2)}</p>
                </div>
                <Button
                  onClick={sealCurrentState}
                  className={cn(
                    "w-full transition-all duration-300",
                    sealingReel.sealed
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-black font-bold",
                  )}
                >
                  {sealingReel.sealed ? "Unseal State" : "Seal Current State"}
                </Button>
              </CardContent>
            </Card>

            {/* Patch Bay */}
            <Card className="bg-gray-800/50 border-2 border-orange-500 shadow-lg shadow-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-400 text-center">Patch Bay</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-gray-900/50 rounded-lg p-4 border border-orange-500/30">
                  <p className="text-orange-400 text-sm">
                    {patchBay.sealsDetected > 0
                      ? `${patchBay.sealsDetected} seal${patchBay.sealsDetected > 1 ? "s" : ""} detected`
                      : "No seals detected"}
                  </p>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {Array.from({ length: 8 }, (_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all duration-200",
                          i < patchBay.sealsDetected
                            ? "bg-orange-500 border-orange-400 shadow-lg shadow-orange-500/50"
                            : "border-orange-500/30 bg-gray-700",
                        )}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resonarium Integration */}
            <Card className="bg-gray-800/50 border-2 border-pink-500 shadow-lg shadow-pink-500/20">
              <CardHeader>
                <CardTitle className="text-pink-400 text-center">Resonarium Core</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <SvgInteractiveSynth />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-8 bg-gray-800/30 rounded-lg p-4 border border-gray-600">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <span className="text-cyan-400">Active Decks: {decks.filter((d) => d.active).length}/3</span>
              <span className="text-purple-400">Effects: {effects.filter((e) => e.active).length}/3</span>
              <span className="text-green-400">Sealed: {sealingReel.sealed ? "Yes" : "No"}</span>
            </div>
            <div className="flex space-x-4">
              <span className="text-orange-400">Patches: {patchBay.sealsDetected}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
