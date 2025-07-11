import { Archive, Dna, Layers, Edit3 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MythicText } from "@/components/ui/mythic-text"
import { Navigation } from "@/components/navigation"
import { SigilOverlayDisplay } from "@/components/sigil-matching/sigil-overlay-display"
import { ArtistSonicFingerprintDisplay } from "@/components/sonic-fingerprinting/artist-sonic-fingerprint-display"
import { SampleCrossmatchUI } from "@/components/sonic-fingerprinting/sample-crossmatch-ui"
import { SigilMatch, type SigilOverlay } from "@/lib/sigil-matching"
import { getArtistFingerprintByArtistName, type ArtistSonicFingerprint } from "@/lib/sonic-fingerprinting"
import { type Artifact as BaseArtifact, mockArtifacts } from "@/lib/artifacts"
import { ProvenanceDisplay, type ProvenanceSource } from "@/components/brand/provenance-display"

interface ProductPageArtifact extends BaseArtifact {
  audioUrl?: string
  provenance?: ProvenanceSource[]
}

interface ProductPageProps {
  params: {
    id: string
  }
}

// Enhance mock data with provenance information
const mockArtifactsWithProvenance: ProductPageArtifact[] = mockArtifacts.map((artifact, index) => {
  const baseProvenance: ProvenanceSource = {
    name: "CC0 Discogs Data",
    type: "base",
    description: "Base metadata sourced from the public Discogs database.",
    url: "https://www.discogs.com/",
  }
  const enhancementProvenance: ProvenanceSource = {
    name: "Howlin' Mold Telemetry",
    type: "enhancement",
    description: "Enriched with genre, mood, and sonic analysis by the SigilMatch Engine.",
  }

  if (index % 2 === 0) {
    // Simulate some having user contributions
    return {
      ...artifact,
      provenance: [
        baseProvenance,
        enhancementProvenance,
        {
          name: "Keeper Contributions",
          type: "user",
          description: "Tags and context provided by trusted community members.",
        },
      ],
    }
  }
  return { ...artifact, provenance: [baseProvenance, enhancementProvenance] }
})

export default async function ProductPage({ params }: ProductPageProps) {
  const artifactId = params.id
  const artifact: ProductPageArtifact | undefined = mockArtifactsWithProvenance.find((a) => a.id === artifactId)

  if (!artifact) {
    return (
      <>
        <Navigation />
        <main className="min-h-screen pt-20 px-4 py-8 bg-gradient-to-br from-black via-slate-900 to-black text-center">
          <MythicText variant="heading" className="text-4xl text-red-500">
            Artifact Not Found
          </MythicText>
          <p className="text-slate-400 mt-4">The requested sonic artifact could not be located in our archives.</p>
        </main>
      </>
    )
  }

  const artistFingerprint: ArtistSonicFingerprint | undefined = getArtistFingerprintByArtistName(artifact.artist)
  const sigilOverlayData: SigilOverlay = SigilMatch(artifact as any)

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-black via-slate-900/50 to-black">
        <div className="container mx-auto max-w-4xl space-y-12">
          {/* Product Details Card */}
          <Card className="bg-black/50 border-slate-700/50 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-slate-300 font-orbitron">{artifact.name}</CardTitle>
              <CardDescription className="text-md text-slate-400 font-poetic">
                By {artifact.artist} ({artifact.year})
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <img
                src={artifact.imageUrl || "/placeholder.svg?height=300&width=300&query=album+art"}
                alt={artifact.name}
                className="rounded-md w-full h-auto object-cover aspect-square"
              />
              <p className="text-slate-500 font-poetic">{artifact.description}</p>
              <div>
                <Label className="text-slate-400">Formats</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {artifact.formats?.map((format) => (
                    <Badge key={format} variant="secondary">
                      {format}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-400">General Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {artifact.tags?.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <Button>Add to Archive</Button>
              <div className="w-full border-t border-slate-800 pt-3">
                <ProvenanceDisplay sources={artifact.provenance || []} />
              </div>
            </CardFooter>
          </Card>

          {/* Howlin' Genres & Vault Status (Derived from SigilMatch) */}
          <Card className="bg-black/40 border-teal-500/30 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Layers className="w-7 h-7 text-teal-400" />
                <MythicText variant="title" className="text-xl text-teal-300 font-orbitron">
                  Howlin' Genre Classification
                </MythicText>
              </div>
              <p className="font-poetic text-sm text-slate-400 pt-1">
                Categorization by the SigilMatch Engine using Howlin' Mold Taxonomy.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {sigilOverlayData.genreStack.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="border-teal-400/70 bg-teal-900/40 text-teal-300 text-sm px-3 py-1"
                  >
                    {genre}
                  </Badge>
                ))}
                {sigilOverlayData.genreStack.length === 0 ||
                  (sigilOverlayData.genreStack.length === 1 && sigilOverlayData.genreStack[0] === "Unclassified" && (
                    <p className="text-slate-500 italic">No specific Howlin' Genres matched. Needs curation.</p>
                  ))}
              </div>
              {sigilOverlayData.vaultEligibility && (
                <div className="mt-4 p-3 rounded-md bg-amber-800/30 border border-amber-600/50 flex items-center gap-2">
                  <Archive className="w-5 h-5 text-amber-400" />
                  <span className="font-semibold text-amber-300">Flagged for Vault Eligibility</span>
                </div>
              )}
              <div className="mt-4 text-xs text-slate-500/70 border-t border-slate-700/50 pt-3 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>Admin Note: Genre overrides & custom tag additions would be managed here.</span>
              </div>
            </CardContent>
          </Card>

          {/* Sigil Overlay Display */}
          <SigilOverlayDisplay overlay={sigilOverlayData} />

          {/* Artist Sonic Fingerprint Display */}
          {artistFingerprint && <ArtistSonicFingerprintDisplay fingerprint={artistFingerprint} />}

          {/* Sample Crossmatch UI */}
          {artistFingerprint && <SampleCrossmatchUI artistFingerprint={artistFingerprint} />}

          {!artistFingerprint && (
            <Alert variant="default" className="bg-slate-800/70 border-slate-700">
              <Dna className="h-5 w-5 text-slate-500" />
              <AlertTitle className="font-orbitron text-slate-400">Sonic DNA Unavailable</AlertTitle>
              <AlertDescription className="font-poetic text-slate-500">
                A detailed sonic fingerprint for {artifact.artist} is not yet available in our archives.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </>
  )
}
