"use client"

import React, { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search, AlertTriangle } from "lucide-react"
import {
  interpretAbstractMood,
  findMatchingArtifacts,
  type MoodMatchArtifact,
  type MoodSearchParams,
} from "@/lib/mood-matcher"
import { ArtifactCard } from "@/components/tags/artifact-card"
import { MythicText } from "@/components/ui/mythic-text"
import type { Artifact } from "@/lib/artifacts"
import { SigilMatch } from "@/lib/sigil-matching"

interface SubconsciousMoodInputProps {
  allArtifacts: Artifact[] // Pass all available artifacts
}

export const SubconsciousMoodInput: React.FC<SubconsciousMoodInputProps> = ({ allArtifacts }) => {
  const [moodQuery, setMoodQuery] = useState("")
  const [matchingArtifacts, setMatchingArtifacts] = useState<MoodMatchArtifact[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [isPending, startTransition] = useTransition()

  // Pre-compute SigilOverlays for all artifacts to avoid doing it on every search
  const artifactsWithSigils: MoodMatchArtifact[] = React.useMemo(() => {
    return allArtifacts.map((artifact) => ({
      ...artifact,
      sigilOverlay: SigilMatch(artifact as any),
    }))
  }, [allArtifacts])

  const handleSearch = async () => {
    setHasSearched(true)
    if (!moodQuery.trim()) {
      setError("Please enter a mood or atmosphere to search for.")
      setMatchingArtifacts([])
      return
    }
    setError(null)
    setIsLoading(true)
    setMatchingArtifacts([])

    startTransition(() => {
      try {
        const searchParams: MoodSearchParams = interpretAbstractMood(moodQuery)
        const results = findMatchingArtifacts(searchParams, artifactsWithSigils)
        setMatchingArtifacts(results)
      } catch (e) {
        console.error("Mood matching error:", e)
        setError("An unexpected error occurred while searching for your mood.")
      } finally {
        setIsLoading(false)
      }
    })
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="space-y-4 p-6 bg-slate-900/50 border border-purple-500/30 rounded-lg shadow-xl shadow-purple-700/10">
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            value={moodQuery}
            onChange={(e) => setMoodQuery(e.target.value)}
            placeholder="e.g., drifting above a swamp at dusk..."
            className="bg-slate-800/70 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:ring-purple-500 focus:border-purple-500 flex-grow text-base p-3"
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading || isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 text-base"
          >
            {isLoading || isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="ml-2">Evoke</span>
          </Button>
        </div>
        {error && (
          <p className="text-red-400 text-sm flex items-center gap-2 pt-2">
            <AlertTriangle className="w-4 h-4" /> {error}
          </p>
        )}
      </div>

      {(isLoading || isPending) && (
        <div className="text-center py-10">
          <Loader2 className="w-12 h-12 text-purple-400 animate-spin mx-auto" />
          <MythicText variant="body" className="mt-4 text-slate-400">
            Conjuring sonic matches...
          </MythicText>
        </div>
      )}

      {hasSearched && !isLoading && !isPending && (
        <div className="space-y-6 animate-fade-in">
          <MythicText variant="subtitle" className="text-slate-300">
            {matchingArtifacts.length > 0
              ? "Artifacts Resonating with Your Mood:"
              : `No specific artifacts found for "${moodQuery}". Try a different evocation.`}
          </MythicText>
          {matchingArtifacts.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingArtifacts.map((artifact) => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
