export interface Artifact {
  id: string
  name: string
  artist: string
  description: string
  tags: string[]
  imageUrl?: string
  audioUrl: string
  price?: number
  stock?: number
  rarity?: "Common" | "Uncommon" | "Rare" | "Mythic"
  // For SigilMatch
  genres?: string[]
  moods?: string[]
  instrumentation?: string[]
  bpm?: number
}
