/**
 * Scorer.ts – Taste-based Sonic Scoring Engine
 * Enhanced to introduce dynamic weighting based on ProphecyOracle and Canonizer feedback.
 */
export interface SonicData {
  genre?: string
  bpm?: number
  key?: string
  melodicComplexity?: string
  // Add other relevant sonic data properties
  [key: string]: any // Allow for other properties
}

export interface WeightingFeedback {
  prophecyInfluence?: number // e.g., 0.0 - 1.0, general influence score
  canonInfluence?: {
    [category: string]: number // e.g., { genre: 0.9, era: 0.7, structure: 0.8 }
  }
}

export class Scorer {
  private tasteProfiles: any // Represents existing taste profiles/rules

  constructor(tasteProfiles: any = {}) {
    this.tasteProfiles = tasteProfiles
    console.log("Scorer: Initialized with taste profiles:", this.tasteProfiles)
  }

  /**
   * Calculates a sonic score, dynamically weighted by external feedback.
   * @param sonicData The raw sonic input data.
   * @param weightingFeedback An object containing feedback from ProphecyOracle and Canonizer.
   * @returns A dynamically weighted sonic score.
   */
  public async calculateSonicScore(sonicData: SonicData, weightingFeedback: WeightingFeedback): Promise<number> {
    console.log("Scorer: Calculating sonic score for:", sonicData)
    console.log("Scorer: Received weighting feedback:", weightingFeedback)

    const rawScore = await this.applyTasteBasedAlgorithms(sonicData)
    const dynamicWeight = this.calculateDynamicWeight(
      sonicData,
      rawScore, // Pass rawScore to potentially influence weight calculation
      weightingFeedback,
    )

    // Apply the dynamic weight to the raw score
    let finalScore = rawScore * dynamicWeight

    // Ensure score is within a standard range, e.g., 0-100
    finalScore = Math.max(0, Math.min(finalScore, 100))

    console.log(
      `Scorer: Raw Score = ${rawScore.toFixed(2)}, Dynamic Weight = ${dynamicWeight.toFixed(2)}, Final Weighted Score = ${finalScore.toFixed(2)}`,
    )

    return finalScore
  }

  /**
   * Applies existing taste-based algorithms to the sonic data.
   * This is where your original scoring logic resides.
   * @param sonicData The raw sonic input data.
   * @returns An initial, unweighted score (e.g., between 0 and 100).
   */
  private async applyTasteBasedAlgorithms(sonicData: SonicData): Promise<number> {
    // [EXISTING FUNCTIONALITY SIMULATION]
    // This should replicate your Python script's core scoring logic.
    // For demonstration, let's simulate a score based on some criteria.
    console.log("Scorer: Applying existing taste-based algorithms...")
    let score = 50 // Base score

    if (sonicData.genre === "Electronic" && this.tasteProfiles.electronicPreference) {
      score += 10 * (this.tasteProfiles.electronicPreference_weight || 1)
    }
    if (sonicData.bpm && sonicData.bpm > 120 && this.tasteProfiles.highBPMBoost) {
      score += 5 * (this.tasteProfiles.highBPMBoost_weight || 1)
    }
    if (sonicData.melodicComplexity === "high" && this.tasteProfiles.complexityAppreciation) {
      score += 15 * (this.tasteProfiles.complexityAppreciation_weight || 1)
    }

    // Simulate some processing time
    await new Promise((resolve) => setTimeout(resolve, 50))

    console.log("Scorer: Raw score from taste algorithms:", score)
    return Math.max(0, Math.min(score, 100)) // Ensure score is 0-100
  }

  /**
   * Calculates a dynamic weight based on feedback from ProphecyOracle and Canonizer.
   * @param sonicData The raw sonic input data.
   * @param rawScore The initial score from taste-based algorithms.
   * @param weightingFeedback Feedback from external modules.
   * @returns A dynamic weight multiplier.
   */
  private calculateDynamicWeight(sonicData: SonicData, rawScore: number, weightingFeedback: WeightingFeedback): number {
    let weight = 1.0 // Start with a neutral weight

    // ProphecyOracle influence
    if (weightingFeedback.prophecyInfluence !== undefined) {
      // Example: Prophecy influence directly scales the weight.
      // A prophecyInfluence of 0.5 means 50% of its potential positive impact.
      // A prophecyInfluence of 1.0 means 100% of its potential positive impact.
      // We can define a max boost, e.g., prophecy can boost weight up to 50% (1.5x)
      const prophecyEffect = weightingFeedback.prophecyInfluence * 0.5 // Max 0.5 boost
      weight *= 1 + prophecyEffect
      console.log(
        `Scorer: Prophecy influence (${weightingFeedback.prophecyInfluence.toFixed(2)}) applied. Current weight: ${weight.toFixed(2)}`,
      )
    }

    // Canonizer influence
    if (weightingFeedback.canonInfluence) {
      let canonFactor = 0
      let factorsApplied = 0

      for (const category in weightingFeedback.canonInfluence) {
        const influenceScore = weightingFeedback.canonInfluence[category]
        // Example: If sonicData has a genre and canonInfluence has a score for that genre
        if (sonicData.genre && category === "genre" && sonicData.genre === this.tasteProfiles.canonicalGenre) {
          // Stronger impact if it matches a predefined canonical genre in taste profiles
          canonFactor += influenceScore * 0.3 // Max 0.3 boost per matching category
          factorsApplied++
          console.log(
            `Scorer: Canonizer influence for matching canonical genre '${sonicData.genre}' (${influenceScore.toFixed(2)}) applied.`,
          )
        } else if (category === "overallStructure" && influenceScore > 0.7) {
          // Example: High overall structure alignment gives a boost
          canonFactor += influenceScore * 0.2
          factorsApplied++
          console.log(`Scorer: Canonizer influence for overall structure (${influenceScore.toFixed(2)}) applied.`)
        }
        // Add more specific canon influences based on sonicData properties and canonInfluence categories
      }

      if (factorsApplied > 0) {
        weight *= 1 + canonFactor / factorsApplied // Average the boost from canon factors
        console.log(`Scorer: Total Canonizer influence applied. Current weight: ${weight.toFixed(2)}`)
      }
    }

    // Ensure weight remains within reasonable bounds (e.g., not negative, not excessively high)
    // Let's say weight can range from 0.5x to 2.0x
    const finalWeight = Math.max(0.5, Math.min(weight, 2.0))
    console.log(`Scorer: Final dynamic weight calculated: ${finalWeight.toFixed(2)} (Initial: ${weight.toFixed(2)})`)
    return finalWeight
  }
}
