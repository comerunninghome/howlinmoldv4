export type TagCategory = "genre" | "mood" | "era" | "instrumentation" | "concept" | "origin"

export interface TagEvolutionPoint {
  effectiveDate: string // ISO Date string (e.g., "2022-01-01") or a descriptive period like "Early 2022"
  description: string
  keywords?: string[] // Keywords prominent during this phase
  definingArtifactIds?: string[] // Example artifact IDs that exemplified the tag at this time
}

export interface EvolvingTag {
  id: string
  name: string
  category: TagCategory
  baseDescription: string // The original or foundational description
  evolutionPoints: TagEvolutionPoint[]
  weight: number // Current overall weight, could also be dynamic in a more complex system

  // Helper to get the most current (or a specific) evolution point
  // For simplicity, we'll sort by date in components or assume latest is last
}

// Helper function to get the current definition of a tag
export const getCurrentEvolution = (tag: EvolvingTag): TagEvolutionPoint => {
  if (!tag.evolutionPoints || tag.evolutionPoints.length === 0) {
    // Fallback to a structure mimicking TagEvolutionPoint if no evolution points exist
    return {
      effectiveDate: "Initial",
      description: tag.baseDescription,
      keywords: [],
    }
  }
  // Sort by date descending and take the first one (most recent)
  // A more robust solution would parse dates properly. For now, assumes YYYY-MM-DD or similar sortable strings.
  const sortedEvolutions = [...tag.evolutionPoints].sort(
    (a, b) => new Date(b.effectiveDate).getTime() - new Date(a.effectiveDate).getTime(),
  )
  return sortedEvolutions[0]
}

export const deepTags: EvolvingTag[] = [
  {
    id: "ambient",
    name: "Ambient",
    category: "genre",
    baseDescription: "Music that prioritizes tone and atmosphere over traditional musical structure.",
    weight: 8,
    evolutionPoints: [
      {
        effectiveDate: "1978-01-01",
        description: "Expansive soundscapes, often electronic, designed for active or passive listening. Eno-esque.",
        keywords: ["eno", "soundscapes", "minimalism"],
      },
      {
        effectiveDate: "2020-01-01",
        description:
          "Revivalist forms incorporating granular synthesis, field recordings, and a focus on deep listening or 'background' presence. Often tied to wellness or focus.",
        keywords: ["deep listening", "granular", "field recordings", "wellness"],
        definingArtifactIds: ["artifact-1"], // Example
      },
    ],
  },
  {
    id: "desert-pop", // New example tag
    name: "Desert Pop",
    category: "mood",
    baseDescription: "Pop sensibilities filtered through a sun-baked, arid landscape.",
    weight: 7,
    evolutionPoints: [
      {
        effectiveDate: "2022-03-01",
        description: "Washed-out guitars, reverb-heavy vocals, themes of isolation and vastness. Lo-fi aesthetic.",
        keywords: ["reverb", "lo-fi", "isolation", "psych-folk"],
      },
      {
        effectiveDate: "2025-06-15", // Future projection
        description:
          "Incorporates more electronic textures, Tuareg guitar influences, and lyrical themes of climate migration. Higher fidelity but still spacious.",
        keywords: ["electronic", "tuareg", "climate", "worldbeat-infused"],
      },
    ],
  },
  {
    id: "modal-jazz",
    name: "Modal Jazz",
    category: "genre",
    baseDescription: "Jazz that uses musical modes rather than chord progressions as a harmonic framework.",
    weight: 7,
    evolutionPoints: [
      {
        effectiveDate: "1959-01-01",
        description:
          "Cool, spacious improvisations over modes, emphasizing melody and atmosphere. Pioneered by Miles Davis.",
        keywords: ["miles davis", "kind of blue", "cool jazz"],
        definingArtifactIds: ["artifact-2"],
      },
    ],
  },
  {
    id: "post-punk",
    name: "Post-Punk",
    category: "genre",
    baseDescription:
      "A diverse genre that emerged from the punk movement, exploring more complex and experimental sounds.",
    weight: 6,
    evolutionPoints: [
      {
        effectiveDate: "1979-01-01",
        description:
          "Angular, atmospheric, and introspective. Often characterized by stark rhythms and detached vocals.",
        keywords: ["joy division", "the cure", "bauhaus", "goth"],
        definingArtifactIds: ["artifact-3"],
      },
      {
        effectiveDate: "2024-01-01",
        description:
          "Neo-post-punk revival with a greater emphasis on synthesizers, spoken word, and socio-political commentary. Often blended with art-rock.",
        keywords: ["dry cleaning", "squid", "black country new road", "art-rock"],
      },
    ],
  },
  // Add more tags or more evolution points to existing tags as needed
  // For tags without specific evolution points, their baseDescription will be used.
  {
    id: "minimalism",
    name: "Minimalism",
    category: "genre",
    baseDescription: "A form of art music that employs limited or minimal musical materials.",
    weight: 5,
    evolutionPoints: [],
  },
  {
    id: "krautrock",
    name: "Krautrock",
    category: "genre",
    baseDescription: "A broad genre of experimental rock that developed in West Germany in the late 1960s.",
    weight: 6,
    evolutionPoints: [],
  },
  {
    id: "melancholic",
    name: "Melancholic",
    category: "mood",
    baseDescription: "Evoking a feeling of pensive sadness.",
    weight: 7,
    evolutionPoints: [],
  },
  {
    id: "hypnotic",
    name: "Hypnotic",
    category: "mood",
    baseDescription: "Producing a trance-like state; mesmerizing.",
    weight: 9,
    evolutionPoints: [],
  },
  {
    id: "ritualistic",
    name: "Ritualistic",
    category: "concept",
    baseDescription: "Relating to or characteristic of a ritual; music as a ceremony.",
    weight: 10,
    evolutionPoints: [],
  },
]

// Example of how you might get all tags for the UI, ensuring they have the helper
export const getAllEvolvingTags = (): EvolvingTag[] => {
  return deepTags.map((tag) => ({
    ...tag,
    // If we had a more complex way to determine current evolution, it would be here.
    // For now, getCurrentEvolution(tag) can be called directly in components.
  }))
}

export interface CuratedTag {
  id: string
  name: string
  category: TagCategory
  description: string
  weight: number
  color?: string // Optional color for UI theming
}

export const getCuratedTags = async (): Promise<CuratedTag[]> => {
  // Curated selection of tags that fit the Howlin' Mold aesthetic
  // Drawing from the extensive genre list but focusing on atmospheric, experimental, and underground sounds
  return [
    {
      id: "ambient",
      name: "Ambient",
      category: "genre",
      description: "Expansive soundscapes designed for deep listening",
      weight: 9,
      color: "#4A5568",
    },
    {
      id: "post-punk",
      name: "Post-Punk",
      category: "genre",
      description: "Angular, atmospheric, and introspective explorations",
      weight: 8,
      color: "#2D3748",
    },
    {
      id: "krautrock",
      name: "Krautrock",
      category: "genre",
      description: "Experimental German rock with hypnotic rhythms",
      weight: 7,
      color: "#1A202C",
    },
    {
      id: "shoegaze",
      name: "Shoegaze",
      category: "genre",
      description: "Wall of sound with ethereal vocals and heavy reverb",
      weight: 8,
      color: "#553C9A",
    },
    {
      id: "drone",
      name: "Drone",
      category: "genre",
      description: "Sustained tones and minimal harmonic progression",
      weight: 6,
      color: "#2B6CB0",
    },
    {
      id: "dark-ambient",
      name: "Dark Ambient",
      category: "mood",
      description: "Ominous atmospheric textures and shadowy soundscapes",
      weight: 7,
      color: "#1A1A1A",
    },
    {
      id: "hypnotic",
      name: "Hypnotic",
      category: "mood",
      description: "Trance-inducing repetitive patterns",
      weight: 9,
      color: "#805AD5",
    },
    {
      id: "ritualistic",
      name: "Ritualistic",
      category: "concept",
      description: "Music as ceremony and sacred practice",
      weight: 10,
      color: "#C53030",
    },
    {
      id: "industrial",
      name: "Industrial",
      category: "genre",
      description: "Mechanical rhythms and harsh electronic textures",
      weight: 6,
      color: "#4A5568",
    },
    {
      id: "psychedelic",
      name: "Psychedelic",
      category: "mood",
      description: "Mind-expanding sonic explorations",
      weight: 8,
      color: "#9F7AEA",
    },
    {
      id: "minimal-techno",
      name: "Minimal Techno",
      category: "genre",
      description: "Stripped-down electronic rhythms and subtle progression",
      weight: 7,
      color: "#2D3748",
    },
    {
      id: "dub-techno",
      name: "Dub Techno",
      category: "genre",
      description: "Spacious electronic music with echo and delay",
      weight: 6,
      color: "#2B6CB0",
    },
  ]
}

export const getDeepTags = async (): Promise<EvolvingTag[]> => {
  // This returns all available tags for the "deep dive" cloud.
  // In a real app, this might fetch from a database or API
  return Promise.resolve(deepTags)
}
