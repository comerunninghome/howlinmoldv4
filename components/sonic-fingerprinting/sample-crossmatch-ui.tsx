"use client"

import type { ArtistSonicFingerprint, MatchResult } from "@/lib/sonic-fingerprinting"
import { mockCrossmatchSample } from "@/lib/sonic-fingerprinting"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, SearchCode, FileAudio } from "lucide-react"
import { MythicText } from "@/components/brand/mythic-brand-system"

interface SampleCrossmatchUIProps {
  artistFingerprint: ArtistSonicFingerprint
}

export function SampleCrossmatchUI({ artistFingerprint }: SampleCrossmatchUIProps) {
  const [sampleName, setSampleName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null)

  const handleAnalyze = async () => {
    if (!sampleName.trim()) {
      setMatchResult({ isMatch: false, message: "Please provide a sample name or identifier." })
      return
    }
    setIsLoading(true)
    setMatchResult(null)
    // Simulate API call / processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const result = mockCrossmatchSample(sampleName, artistFingerprint)
    setMatchResult(result)
    setIsLoading(false)
  }

  // This simulates a file input. In a real scenario, you'd use <input type="file" />
  // and handle file uploads, sending data to a backend for analysis.
  const handleMockFileUpload = () => {
    const mockFileNames = [
      "unknown_ambient_piece.wav",
      "distorted_rhythm_loop.mp3",
      `${artistFingerprint.artistName.split(" ")[0]}_archive_snippet.flac`,
      "random_sound.ogg",
    ]
    const randomFileName = mockFileNames[Math.floor(Math.random() * mockFileNames.length)]
    setSampleName(randomFileName)
    setMatchResult(null) // Clear previous result
  }

  return (
    <Card className="bg-black/30 border-emerald-500/30 backdrop-blur-sm mt-8">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <SearchCode className="w-8 h-8 text-emerald-400" />
          <CardTitle className="font-orbitron text-2xl text-emerald-300">
            <MythicText variant="heading" className="text-emerald-300">
              Crossmatch Unknown Sample
            </MythicText>
          </CardTitle>
        </div>
        <CardDescription className="font-poetic text-cyan-400/80">
          Test an unknown audio sample against {artistFingerprint.artistName}'s sonic DNA. Enter a sample identifier or
          use the mock upload.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            placeholder="Enter sample name (e.g., my_mystery_track.wav)"
            value={sampleName}
            onChange={(e) => setSampleName(e.target.value)}
            className="bg-black/50 border-slate-700 text-slate-300 focus:border-emerald-500 flex-grow"
            disabled={isLoading}
          />
          <Button
            onClick={handleMockFileUpload}
            variant="outline"
            className="border-cyan-500/70 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200"
            disabled={isLoading}
          >
            <FileAudio className="w-4 h-4 mr-2" />
            Mock Upload Sample
          </Button>
        </div>
        <Button
          onClick={handleAnalyze}
          disabled={isLoading || !sampleName.trim()}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-orbitron"
        >
          {isLoading ? "Analyzing Sonic Signature..." : "Analyze Sample"}
        </Button>

        {matchResult && (
          <Alert
            variant={matchResult.isMatch ? "default" : "destructive"}
            className={`${matchResult.isMatch ? "bg-green-900/30 border-green-500/50" : "bg-red-900/30 border-red-500/50"} mt-4`}
          >
            {matchResult.isMatch ? (
              <CheckCircle className="h-5 w-5 text-green-400" />
            ) : (
              <XCircle className="h-5 w-5 text-red-400" />
            )}
            <AlertTitle className={`font-orbitron ${matchResult.isMatch ? "text-green-300" : "text-red-300"}`}>
              Analysis Complete
            </AlertTitle>
            <AlertDescription
              className={`font-poetic ${matchResult.isMatch ? "text-green-400/90" : "text-red-400/90"}`}
            >
              {matchResult.message}
              {matchResult.confidence !== undefined && (
                <div className="mt-2">
                  <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${matchResult.isMatch ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${matchResult.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
