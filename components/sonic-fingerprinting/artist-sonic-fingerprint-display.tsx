import type { ArtistSonicFingerprint } from "@/lib/sonic-fingerprinting"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dna, Album, TagIcon } from "lucide-react"
import { MythicText } from "@/components/brand/mythic-brand-system"

interface ArtistSonicFingerprintDisplayProps {
  fingerprint: ArtistSonicFingerprint
}

export function ArtistSonicFingerprintDisplay({ fingerprint }: ArtistSonicFingerprintDisplayProps) {
  return (
    <Card className="bg-black/30 border-cyan-500/30 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Dna className="w-8 h-8 text-cyan-400" />
          <CardTitle className="font-orbitron text-2xl text-cyan-300">
            <MythicText variant="heading" className="text-cyan-300">
              Artist Sonic DNA: {fingerprint.artistName}
            </MythicText>
          </CardTitle>
        </div>
        <CardDescription className="font-poetic text-emerald-400/80">{fingerprint.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <img
            src={fingerprint.visualDnaUrl || "/placeholder.svg"}
            alt={`${fingerprint.artistName} Sonic DNA Visualization`}
            className="w-full rounded-md border border-cyan-700/50 shadow-lg shadow-cyan-900/30"
          />
          <p className="text-xs text-cyan-400/70 mt-1 text-center font-orbitron">
            Conceptual representation of spectral signature
          </p>
        </div>

        <div>
          <h4 className="font-orbitron text-lg text-emerald-300 mb-2 flex items-center">
            <Album className="w-5 h-5 mr-2 text-emerald-400" />
            Key Rare Releases Used for Fingerprinting:
          </h4>
          <ul className="list-disc list-inside pl-2 space-y-1 font-poetic text-sm text-emerald-400/90">
            {fingerprint.keyReleasesUsed.map((release) => (
              <li key={release.name}>
                {release.name} ({release.year})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-orbitron text-lg text-emerald-300 mb-2 flex items-center">
            <TagIcon className="w-5 h-5 mr-2 text-emerald-400" />
            Characteristic Sonic Tags:
          </h4>
          <div className="flex flex-wrap gap-2">
            {fingerprint.characteristicTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="border-emerald-500/50 text-emerald-300 bg-emerald-900/30 font-poetic"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
