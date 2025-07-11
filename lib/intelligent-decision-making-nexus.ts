/**
 * IntelligentDecisionMakingNexus.ts
 * The central control point, orchestrating calls and data flow between
 * Scorer, ProphecyOracle, and Canonizer.
 */
import { Scorer, type SonicData, type WeightingFeedback } from "./scorer"
import { ProphecyOracle } from "./prophecy-oracle"
import { Canonizer, type CanonAlignmentScores } from "./canonizer"

// Define a default taste profile for the Scorer
const defaultTasteProfiles = {
  electronicPreference: true,
  electronicPreference_weight: 1.2,
  highBPMBoost: true,
  highBPMBoost_weight: 1.1,
  complexityAppreciation: true,
  complexityAppreciation_weight: 1.3,
  canonicalGenre: "Electronic", // Example: Scorer has a preference for this canonical genre
}

export class IntelligentDecisionMakingNexus {
  private scorer: Scorer
  private prophecyOracle: ProphecyOracle
  private canonizer: Canonizer

  constructor(tasteProfiles: any = defaultTasteProfiles) {
    this.scorer = new Scorer(tasteProfiles)
    this.prophecyOracle = new ProphecyOracle()
    this.canonizer = new Canonizer()
    console.log("IntelligentDecisionMakingNexus: Initialized with all modules.")
  }

  /**
   * The central decision-making method.
   * @param inputSonicData The primary data for which a decision is needed.
   * @returns The final weighted decision/score.
   */
  public async makeDecision(inputSonicData: SonicData): Promise<number> {
    console.log("\nNexus: Initiating decision-making process for:", inputSonicData)

    // 1. Get feedback from ProphecyOracle
    let prophecyInfluence: number
    try {
      prophecyInfluence = await this.prophecyOracle.predictSonicTrendInfluence(inputSonicData)
      console.log(`Nexus: ProphecyOracle feedback received: ${prophecyInfluence.toFixed(2)}`)
    } catch (error) {
      console.error("Nexus: Error getting ProphecyOracle feedback, defaulting to neutral (0.5).", error)
      prophecyInfluence = 0.5 // Default or fallback
    }

    // 2. Get feedback from Canonizer
    let canonInfluence: CanonAlignmentScores
    try {
      canonInfluence = await this.canonizer.analyzeCanonicalAlignment(inputSonicData)
      console.log("Nexus: Canonizer feedback received:", canonInfluence)
    } catch (error) {
      console.error("Nexus: Error getting Canonizer feedback, defaulting to empty.", error)
      canonInfluence = {} // Default or fallback
    }

    // 3. Prepare feedback for Scorer
    const weightingFeedback: WeightingFeedback = {
      prophecyInfluence: prophecyInfluence,
      canonInfluence: canonInfluence,
    }
    console.log("Nexus: Compiled weighting feedback for Scorer:", weightingFeedback)

    // 4. Get the dynamically weighted score from Scorer
    let finalWeightedScore: number
    try {
      finalWeightedScore = await this.scorer.calculateSonicScore(inputSonicData, weightingFeedback)
      console.log(`Nexus: Final weighted score from Scorer: ${finalWeightedScore.toFixed(2)}`)
    } catch (error) {
      console.error("Nexus: Error calculating sonic score. Defaulting to 0.", error)
      finalWeightedScore = 0 // Or throw, depending on desired error handling
    }

    const interpretation = this.interpretScore(finalWeightedScore)
    console.log(`Nexus: Interpreted Decision: ${interpretation} (Score: ${finalWeightedScore.toFixed(2)})`)

    return finalWeightedScore
  }

  private interpretScore(score: number): string {
    if (score > 85) return "Exceptional Alignment - Prime Candidate"
    if (score > 70) return "Strong Alignment - Recommended"
    if (score > 50) return "Moderate Alignment - Consider"
    if (score > 30) return "Weak Alignment - Caution"
    return "Poor Alignment - Not Recommended"
  }
}
