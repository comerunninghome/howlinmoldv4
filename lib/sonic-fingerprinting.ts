export interface ArtistSonicFingerprint {
  id: string
  artistName: string
  description: string // A blurb about their sonic signature
  visualDnaUrl: string // URL to a visual representation (e.g., spectrogram placeholder)
  keyReleasesUsed: { name: string; year: number }[] // Rare releases used for fingerprinting
  characteristicTags: string[] // Tags derived from the sonic DNA
}

export interface AudioSample {
  id: string
  name: string // e.g., "unknown_track_1.mp3"
  // In a real system, this would include actual audio data or features
  mockSpectralFeatures?: Record<string, number>
}

export interface MatchResult {
  isMatch: boolean
  confidence?: number // e.g., 0.0 to 1.0
  matchedArtistName?: string
  message: string
}

// Mock database of artist sonic fingerprints
export const mockArtistFingerprints: ArtistSonicFingerprint[] = [
  {
    id: "fp-eno",
    artistName: "Brian Eno",
    description:
      "Characterized by evolving ambient textures, minimalist structures, and ethereal soundscapes. Often incorporates generative techniques.",
    visualDnaUrl: "/placeholder.svg?width=400&height=150&text=Brian+Eno+Sonic+DNA",
    keyReleasesUsed: [
      { name: "Discreet Music", year: 1975 },
      { name: "Ambient 4: On Land", year: 1982 },
    ],
    characteristicTags: ["Ethereal", "Generative", "Minimalist", "Textural", "Ambient"],
  },
  {
    id: "fp-joy-division",
    artistName: "Joy Division",
    description:
      "Defined by sparse, atmospheric instrumentation, Ian Curtis's distinctive baritone, and melancholic, introspective themes. A cornerstone of post-punk.",
    visualDnaUrl: "/placeholder.svg?width=400&height=150&text=Joy+Division+Sonic+DNA",
    keyReleasesUsed: [
      { name: "An Ideal for Living (EP)", year: 1978 },
      { name: "Still (Compilation with rarities)", year: 1981 },
    ],
    characteristicTags: ["Post-Punk", "Melancholic", "Sparse", "Atmospheric", "Baritone Vocals"],
  },
  {
    id: "fp-aphex-twin",
    artistName: "Aphex Twin",
    description:
      "Known for complex rhythmic structures, unconventional melodies, and a wide range of styles from ambient to abrasive acid techno. Master of analog and digital synthesis.",
    visualDnaUrl: "/placeholder.svg?width=400&height=150&text=Aphex+Twin+Sonic+DNA",
    keyReleasesUsed: [
      { name: "Analogue Bubblebath", year: 1991 },
      { name: "Caustic Window Compilation", year: 1998 },
    ],
    characteristicTags: ["IDM", "Complex Rhythms", "Experimental", "Acid", "Synthesizer-heavy"],
  },
]

export const getArtistFingerprintByArtistName = (artistName: string): ArtistSonicFingerprint | undefined => {
  return mockArtistFingerprints.find((fp) => fp.artistName === artistName)
}

// Mock crossmatching function
export const mockCrossmatchSample = (
  sampleName: string, // In reality, this would be audio data/features
  artistFingerprint: ArtistSonicFingerprint,
): MatchResult => {
  // Super simple mock logic: if sample name contains part of artist name, it's a potential match
  const normalizedSampleName = sampleName.toLowerCase()
  const normalizedArtistName = artistFingerprint.artistName.toLowerCase()

  if (normalizedSampleName.includes(normalizedArtistName.split(" ")[0])) {
    const confidence = Math.random() * 0.3 + 0.7 // High confidence: 0.7 - 1.0
    return {
      isMatch: true,
      confidence: Number.parseFloat(confidence.toFixed(2)),
      matchedArtistName: artistFingerprint.artistName,
      message: `Strong spectral resemblance detected. High probability of being ${artistFingerprint.artistName}. Confidence: ${(confidence * 100).toFixed(0)}%`,
    }
  } else if (normalizedSampleName.includes("ambient") && artistFingerprint.characteristicTags.includes("Ambient")) {
    const confidence = Math.random() * 0.2 + 0.5 // Medium confidence: 0.5 - 0.7
    return {
      isMatch: true,
      confidence: Number.parseFloat(confidence.toFixed(2)),
      matchedArtistName: artistFingerprint.artistName,
      message: `Some spectral characteristics align with ${artistFingerprint.artistName}. Confidence: ${(confidence * 100).toFixed(0)}%`,
    }
  }

  const confidence = Math.random() * 0.4 // Low confidence: 0.0 - 0.4
  return {
    isMatch: false,
    confidence: Number.parseFloat(confidence.toFixed(2)),
    message: `Low spectral resemblance to ${artistFingerprint.artistName}. Unlikely match. Confidence: ${(confidence * 100).toFixed(0)}%`,
  }
}
