import type React from "react"
import type { SigilOverlay, EmotionalCoordinates } from "@/lib/sigil-matching"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Sparkles, Brain, BarChart3, Layers } from "lucide-react"
import { MythicText } from "@/components/brand/mythic-brand-system"

interface SigilOverlayDisplayProps {
  overlay: SigilOverlay
}

const EmotionDisplay: React.FC<{ coords: EmotionalCoordinates }> = ({ coords }) => {
  const getValenceColor = (v: number) => (v > 0 ? "text-green-400" : v < 0 ? "text-red-400" : "text-slate-400")
  const getArousalColor = (a: number) => (a > 0.6 ? "text-amber-400" : a > 0.3 ? "text-yellow-400" : "text-sky-400")

  return (
    <div className="space-y-1 text-sm">
      <p>
        <span className="font-semibold text-slate-300">Valence:</span>{" "}
        <span className={getValenceColor(coords.valence)}>{coords.valence.toFixed(2)}</span>
      </p>
      <p>
        <span className="font-semibold text-slate-300">Arousal:</span>{" "}
        <span className={getArousalColor(coords.arousal)}>{coords.arousal.toFixed(2)}</span>
      </p>
      {coords.dominance !== undefined && (
        <p>
          <span className="font-semibold text-slate-300">Dominance:</span>{" "}
          <span className="text-purple-400">{coords.dominance.toFixed(2)}</span>
        </p>
      )}
      {coords.clarity !== undefined && (
        <p>
          <span className="font-semibold text-slate-300">Clarity:</span>{" "}
          <span className="text-cyan-400">{coords.clarity.toFixed(2)}</span>
        </p>
      )}
    </div>
  )
}

export const SigilOverlayDisplay: React.FC<SigilOverlayDisplayProps> = ({ overlay }) => {
  return (
    <Card className="bg-slate-900/60 border-purple-500/30 backdrop-blur-sm shadow-xl shadow-purple-700/10">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-400" />
          <MythicText variant="title" className="text-2xl text-purple-300 font-orbitron">
            Sigil Overlay
          </MythicText>
        </div>
        <p className="font-poetic text-sm text-slate-400 pt-1">
          A synthesized resonance pattern derived from the artifact's essence.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h4 className="font-orbitron text-lg text-slate-200">Genre Stack</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {overlay.genreStack.map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="border-purple-400/70 bg-purple-900/30 text-purple-300 text-sm px-3 py-1"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <h4 className="font-orbitron text-lg text-slate-200">Poetic Blurb</h4>
          </div>
          <p className="font-poetic text-slate-300 italic leading-relaxed">"{overlay.description}"</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h4 className="font-orbitron text-lg text-slate-200">Emotional Coordinates</h4>
          </div>
          <EmotionDisplay coords={overlay.emotionalCoordinates} />
        </div>

        <div>
          <h4 className="font-orbitron text-lg text-slate-200 mb-2">Vault Eligibility</h4>
          <div
            className={`flex items-center gap-2 p-3 rounded-md ${overlay.vaultEligibility ? "bg-green-800/30 border border-green-600/50" : "bg-red-800/30 border border-red-600/50"}`}
          >
            {overlay.vaultEligibility ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <XCircle className="w-6 h-6 text-red-400" />
            )}
            <span className={`font-semibold ${overlay.vaultEligibility ? "text-green-300" : "text-red-300"}`}>
              {overlay.vaultEligibility ? "Eligible for The Vault" : "Not Currently Vault Eligible"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
