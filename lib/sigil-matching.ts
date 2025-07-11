import type { Artifact } from "./artifacts"
import { matchGenre as matchHowlinGenres, type RecordMetadata } from "./genreMatcher" // Import the new matcher

export interface AudioArtifact extends Artifact {}

export type GenreStack = string[]

export interface EmotionalCoordinates {
  valence: number
  arousal: number
  dominance?: number
  clarity?: number
}

export interface SigilOverlay {
  genreStack: GenreStack // This will now be populated by the new Howlin Taxonomy matcher
  description: string
  vaultEligibility: boolean // This will also use the new logic
  emotionalCoordinates: EmotionalCoordinates
}

// --- Mock Sub-Functions (extractMood, analyzeMetadata etc. remain the same for now) ---
const extractMood = (
  audioProfile?: AudioArtifact["audioProfile"],
  lyrics?: string,
  timbre?: AudioArtifact["timbre"],
): string => {
  if (audioProfile?.energy && audioProfile.energy < 0.3) return "Contemplative"
  if (lyrics?.toLowerCase().includes("love") && audioProfile?.key?.includes("Major")) return "Euphoric"
  if (timbre?.roughness && timbre.roughness > 0.7) return "Aggressive"
  if (lyrics?.toLowerCase().includes("dark") || lyrics?.toLowerCase().includes("night")) return "Nocturnal"
  return "Enigmatic"
}

const analyzeMetadata = (title?: string, artist?: string, album?: string): { keywords: string[]; themes: string[] } => {
  const keywords: string[] = []
  if (title) keywords.push(...title.toLowerCase().split(" ").slice(0, 2))
  if (artist) keywords.push(artist.split(" ")[0].toLowerCase())

  const themes: string[] = []
  if (album?.toLowerCase().includes("ambient")) themes.push("Atmospheric Exploration")
  if (title?.toLowerCase().includes("shadow")) themes.push("Confrontation with the Unknown")
  return {
    keywords: [...new Set(keywords)],
    themes: themes.length > 0 ? themes : ["Sonic Alchemy"],
  }
}

const lookupInUserTrainedArchives = (track: AudioArtifact): { relatedArtists: string[]; similarTags: string[] } => {
  const related: { relatedArtists: string[]; similarTags: string[] } = {
    relatedArtists: [],
    similarTags: [],
  }
  if (track.artist === "Brian Eno") {
    related.relatedArtists.push("Harold Budd", "Cluster")
    related.similarTags.push("Minimalism", "Generative")
  }
  if (track.tags?.includes("post-punk")) {
    // Check if tags exist
    related.relatedArtists.push("The Cure", "Siouxsie and the Banshees")
    related.similarTags.push("Coldwave")
  }
  return related
}

// generatePoeticBlurb remains the same for now, but uses the new genreStack
const generatePoeticBlurb = (
  track: AudioArtifact,
  genreStack: GenreStack,
  mood: string,
  metadata: { keywords: string[]; themes: string[] },
): string => {
  return `A ${mood.toLowerCase()} journey through ${genreStack.join(", ")}. Echoes of ${
    metadata.keywords.join(" & ") || "the unknown"
  } resonate, exploring themes of ${metadata.themes.join(" and ")}. This artifact, "${
    track.name
  }", invites introspection.`
}

// checkVaultLogic is now simplified as the main logic is in genreMatcher.ts
const checkVaultEligibilityFromStack = (genreStack: GenreStack): boolean => {
  return genreStack.some((genre) => genre.toLowerCase().includes("spiritual / ritual / vault"))
}

const mapToEmotions = (mood: string): EmotionalCoordinates => {
  switch (mood) {
    case "Contemplative":
      return { valence: 0.2, arousal: 0.1, clarity: 0.8 }
    case "Euphoric":
      return { valence: 0.8, arousal: 0.7, dominance: 0.6 }
    case "Aggressive":
      return { valence: -0.7, arousal: 0.8, dominance: 0.7 }
    case "Nocturnal":
      return { valence: -0.3, arousal: 0.3, clarity: 0.4 }
    default:
      return { valence: 0, arousal: 0.2, clarity: 0.5 }
  }
}

// --- The Main SigilMatch Function ---
export function SigilMatch(track: AudioArtifact): SigilOverlay {
  const mood = extractMood(track.audioProfile, track.lyrics, track.timbre)
  const metadataAnalysis = analyzeMetadata(track.name, track.artist, track.album)
  // const references = lookupInUserTrainedArchives(track) // This could feed into a more advanced matchGenre if needed

  // Prepare RecordMetadata for the new genre matcher
  const recordForMatcher: RecordMetadata = {
    artist: track.artist,
    title: track.name,
    description: track.description,
    year: track.year,
    country: track.country,
    tags: track.tags, // Pass general tags
    formats: track.formats,
  }
  const howlinGenreStack = matchHowlinGenres(recordForMatcher)

  const poeticDescription = generatePoeticBlurb(track, howlinGenreStack, mood, metadataAnalysis)
  const isEligibleForVault = checkVaultEligibilityFromStack(howlinGenreStack)

  return {
    genreStack: howlinGenreStack,
    description: poeticDescription,
    vaultEligibility: isEligibleForVault,
    emotionalCoordinates: mapToEmotions(mood),
  }
}
