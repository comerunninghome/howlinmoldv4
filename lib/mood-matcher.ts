import type { Artifact } from "./artifacts"
import type { SigilOverlay } from "./sigil-matching"

// Define a more specific type for artifacts used in mood matching, ensuring SigilOverlay is present
export interface MoodMatchArtifact extends Artifact {
  sigilOverlay: SigilOverlay
}

export interface MoodSearchParams {
  targetValenceRange?: [number, number]
  targetArousalRange?: [number, number]
  targetClarityRange?: [number, number] // Added for more nuance
  keywords?: string[] // To match against genreStack or description
  negativeKeywords?: string[] // To exclude certain themes
}

// Mock interpretation layer
export function interpretAbstractMood(moodQuery: string): MoodSearchParams {
  const query = moodQuery.toLowerCase()
  const params: MoodSearchParams = { keywords: [], negativeKeywords: [] }

  if (query.includes("swamp") || query.includes("dusk") || query.includes("mist")) {
    params.targetValenceRange = [-0.7, 0.1] // More negative to neutral
    params.targetArousalRange = [0.0, 0.4] // Calm to slightly low energy
    params.targetClarityRange = [0.1, 0.5] // Obscure to somewhat clear
    params.keywords?.push("ambient", "drone", "dark ambient", "experimental", "atmospheric", "nocturnal")
  }
  if (query.includes("drifting") || query.includes("floating")) {
    params.targetArousalRange = params.targetArousalRange
      ? [Math.min(0.0, params.targetArousalRange[0]), Math.min(0.3, params.targetArousalRange[1])]
      : [0.0, 0.3]
    params.keywords?.push("ethereal", "spacious")
  }
  if (query.includes("neon rain") || query.includes("cyberpunk city")) {
    params.targetValenceRange = [0.2, 0.8] // Neutral to positive
    params.targetArousalRange = [0.5, 0.9] // Medium to high energy
    params.keywords?.push("electronic", "synthwave", "cyberpunk", "synth pop", "futuristic")
  }
  if (query.includes("ancient ritual") || query.includes("chant")) {
    params.targetValenceRange = [-0.2, 0.5]
    params.targetArousalRange = [0.2, 0.6]
    params.keywords?.push("ritual", "tribal", "spiritual", "ethno", "chant")
  }
  if (query.includes("sunken cathedral") || query.includes("underwater")) {
    params.targetValenceRange = [-0.5, 0.2]
    params.targetArousalRange = [0.1, 0.4]
    params.targetClarityRange = [0.2, 0.6]
    params.keywords?.push("reverb", "deep", "echo", "ethereal", "ambient")
  }
  if (query.includes("empty space station") || query.includes("void")) {
    params.targetValenceRange = [-0.8, -0.2]
    params.targetArousalRange = [0.0, 0.3]
    params.targetClarityRange = [0.6, 0.9] // Can be very clear in its emptiness
    params.keywords?.push("space ambient", "isolation", "minimal", "drone")
  }

  // Add some default keywords if none are strongly matched
  if (params.keywords?.length === 0 && query.length > 5) {
    params.keywords.push(...query.split(" ").filter((w) => w.length > 3))
  }

  // Simple negative keyword example
  if (query.includes("not upbeat")) {
    params.negativeKeywords?.push("upbeat", "happy", "party")
    if (params.targetValenceRange && params.targetValenceRange[1] > 0.3) {
      params.targetValenceRange[1] = 0.3
    }
  }

  return params
}

// Mock matching engine
export function findMatchingArtifacts(
  params: MoodSearchParams,
  allArtifactsWithSigils: MoodMatchArtifact[],
): MoodMatchArtifact[] {
  const { targetValenceRange, targetArousalRange, targetClarityRange, keywords, negativeKeywords } = params

  return allArtifactsWithSigils
    .map((artifact) => {
      const sigil = artifact.sigilOverlay
      let score = 0

      // Emotional coordinates matching
      if (
        targetValenceRange &&
        sigil.emotionalCoordinates.valence >= targetValenceRange[0] &&
        sigil.emotionalCoordinates.valence <= targetValenceRange[1]
      ) {
        score += 2
      } else if (targetValenceRange) {
        // Penalize if out of range but range is specified
        score -= 1
      }
      if (
        targetArousalRange &&
        sigil.emotionalCoordinates.arousal >= targetArousalRange[0] &&
        sigil.emotionalCoordinates.arousal <= targetArousalRange[1]
      ) {
        score += 2
      } else if (targetArousalRange) {
        score -= 1
      }
      if (
        targetClarityRange &&
        sigil.emotionalCoordinates.clarity &&
        sigil.emotionalCoordinates.clarity >= targetClarityRange[0] &&
        sigil.emotionalCoordinates.clarity <= targetClarityRange[1]
      ) {
        score += 1 // Clarity is a bit more subtle
      } else if (targetClarityRange && sigil.emotionalCoordinates.clarity !== undefined) {
        score -= 0.5
      }

      // Keyword matching (genre and description)
      const combinedText = `${sigil.genreStack.join(" ")} ${sigil.description}`.toLowerCase()
      if (keywords && keywords.length > 0) {
        keywords.forEach((kw) => {
          if (combinedText.includes(kw.toLowerCase())) {
            score += 1.5
          }
        })
      }

      // Negative keyword penalization
      if (negativeKeywords && negativeKeywords.length > 0) {
        negativeKeywords.forEach((nkw) => {
          if (combinedText.includes(nkw.toLowerCase())) {
            score -= 3 // Strong penalty
          }
        })
      }

      // Bonus for "Unclassified" if no specific keywords, allowing for serendipity
      if ((!keywords || keywords.length === 0) && sigil.genreStack.includes("Unclassified")) {
        score += 0.5
      }

      // Penalize if score is too low to avoid irrelevant results
      if (score < 1 && (keywords?.length || 0) > 0) return { artifact, score: -100 } // Effectively filters out

      return { artifact, score }
    })
    .filter((item) => item.score > 0) // Only keep items with a positive score
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .map((item) => item.artifact)
    .slice(0, 15) // Limit results
}
