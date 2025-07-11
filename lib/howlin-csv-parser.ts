import { slugify } from "@/lib/utils" // Assuming slugify is in utils or define it here

// --- Data Structures and Types ---
export interface RawArtifactData {
  genre: string
  artist: string
  title: string
  discogs_url: string
}

export interface Artifact {
  artist: string
  title: string
  album: string | null
  format: string
  price: number
  currency: string
  stock: number
  inventory: number
  slug: string
  category: string // e.g., "Deck A", "Deck B" - can be refined
  keywords: string[]
  discogs_url?: string
  product_type: string // e.g., "artifact", "merch"
  // Stripe related fields, will be populated after Stripe processing
  product_id?: string | null
  price_id?: string | null
  active: boolean
}

// --- Genre Taxonomy and Pricing (from your Python script) ---
const expanded_genres: Record<string, Set<string> | string[]> = {
  "German & Minimal Dance": new Set([
    "Neue Deutsche Welle",
    "Tanzmusik",
    "Minimal Synth Funk",
    "DIY Euro Wave",
    "Obskürer Taktpop",
  ]),
  "Synth-Pop & Odd Electronics": new Set([
    "Minimal Wave",
    "Cold Wave",
    "Oddball Synth",
    "Bedroom Electronics",
    "Synthpop",
    "Analog Drum Meditations",
  ]),
  "Dubwise & Reggae Mutants": new Set([
    "New Wave Dub",
    "Fake Reggae",
    "Cod Reggae",
    "Post-Punk Reggae",
    "Dub Ambient",
    "Dub Techno",
  ]),
  "Krautrock & Psychedelic Prog": new Set([
    "Krautrock",
    "Progressive Rock",
    "Spaced Folk-Rock",
    "Jazz-tinged Rock",
    "Experimental Psych",
  ]),
  "Kosmische & Old Electronics": new Set([
    "Kosmische Musik",
    "Berlin School",
    "Leftfield Techno",
    "Modular Synth",
    "Electroacoustic Hybrids",
  ]),
  "Ambient & Esoteric": new Set([
    "Mystical Ambient",
    "Trance Ambient",
    "New Age Minimalism",
    "Meditative Electronics",
    "Healing Ambient",
  ]),
  "Organic & Ethnic Fusion": new Set([
    "Tribal Ambient",
    "World-Inspired Minimal",
    "Spiritual Folk",
    "Ethnic Percussion Fusion",
    "Acoustic Ritual Music",
  ]),
  "Obscure Pop & Private Press": new Set([
    "Private Press Songwriter",
    "Lo-Fi Funk",
    "DIY Jazz-Pop",
    "Weird Lounge",
    "Outsider AOR",
  ]),
  "Balearic, AOR & Riviera Lounge": new Set([
    "Balearic Soft Pop",
    "AOR Funk",
    "Adriatic Disco",
    "FM Pop Italiano",
    "Resort Boogie",
  ]),
  "MPB & Brazilian Vibes": new Set(["MPB", "Bossa Nova", "Tropicalia", "Brazilian Jazz Fusion", "Afro-Brazilian Jazz"]),
  "Jazz-Funk & Spiritual": new Set(["Jazz-Funk", "Spiritual Jazz", "Fusion", "Free Jazz", "Modern Soul Jazz"]),
  "Afro, Island & World Funk": new Set(["Afrobeat", "Highlife", "Tropical Psych", "Island Funk", "World Groove"]),
  "Boogie, Soul & Street Funk": new Set(["Boogie", "Street Soul", "UK Modern Soul", "80s Funk", "Electro-Funk"]),
  "Hip Hop, Rap & Electro": new Set([
    "Old School Rap",
    "Boom Bap",
    "French Rap",
    "Graffiti Beats",
    "Electro (Hip Hop)",
  ]),
  "Euro Grooves & Continental Funk": new Set([
    "Swiss Boogie",
    "Euro Jazz-Funk",
    "Dutch Disco",
    "Scandi Soul",
    "Teutonic Funk",
  ]),
  "Funk, Soul & Rare Grooves": new Set(["Rare Groove", "Deep Funk", "Modern Soul", "Crossover Soul", "Warehouse Soul"]),
  "Disco, Cosmic & Italo": new Set([
    "Italo Disco",
    "Cosmic Disco",
    "Synthy Disco",
    "Proto-House",
    "Introverted Dance Rituals",
  ]),
  "House, Breaks & Club Roots": new Set(["New Beat", "House", "UK Garage", "Breakbeat", "Tech House"]),
  "Electronic & Machine Music": [
    "AI Music That Feels Human",
    "DSP Studies",
    "Early Electronica",
    "Electro (Non-Hip Hop)",
    "Electroacoustic Hybrids",
    "Glitch & Microhouse",
    "Industrial Ambient",
    "Laptop Folk",
    "Leftfield Techno",
    "Machine Soul",
    "Minimal Tech Experiments",
    "Modular Synth Experiments",
    "Post-Rave Introspection",
    "Techno not Techno",
    "acid techno",
    "ambient techno",
    "bass music",
    "breakbeat",
    "chill techno",
    "clicks & cuts",
    "cold minimal",
    "deep house",
    "deep minimal tech",
    "dub ambient",
    "dub techno",
    "electroclash",
    "experimental club",
    "future garage",
    "idm",
    "leftfield house",
    "machine funk",
    "microhouse",
    "minimal techno",
    "modular synth",
    "synthpop",
    "uk bass",
  ],
}

const pricing_tiers: Record<string, [number, number]> = {
  "German & Minimal Dance": [60, 90],
  "Synth-Pop & Odd Electronics": [60, 100],
  "Dubwise & Reggae Mutants": [50, 80],
  "Krautrock & Psychedelic Prog": [90, 140],
  "Kosmische & Old Electronics": [100, 150],
  "Ambient & Esoteric": [70, 120],
  "Organic & Ethnic Fusion": [60, 110],
  "Obscure Pop & Private Press": [70, 120],
  "Balearic, AOR & Riviera Lounge": [50, 85],
  "MPB & Brazilian Vibes": [60, 100],
  "Jazz-Funk & Spiritual": [70, 110],
  "Afro, Island & World Funk": [65, 100],
  "Boogie, Soul & Street Funk": [45, 75],
  "Hip Hop, Rap & Electro": [35, 65],
  "Euro Grooves & Continental Funk": [45, 75],
  "Funk, Soul & Rare Grooves": [50, 85],
  "Disco, Cosmic & Italo": [50, 80],
  "House, Breaks & Club Roots": [40, 70],
  "Electronic & Machine Music": [65, 125],
  DEFAULT: [35, 45],
}

function assignDynamicPrice(genre: string): number {
  const normalizedGenre = genre.trim().toLowerCase()
  for (const [category, subgenres] of Object.entries(expanded_genres)) {
    const subgenreArray = Array.isArray(subgenres) ? subgenres : Array.from(subgenres)
    if (subgenreArray.some((g) => normalizedGenre.includes(g.toLowerCase()))) {
      const [low, high] = pricing_tiers[category] || pricing_tiers["DEFAULT"]
      return Number.parseFloat((Math.random() * (high - low) + low).toFixed(2))
    }
  }
  const [low, high] = pricing_tiers["DEFAULT"]
  return Number.parseFloat((Math.random() * (high - low) + low).toFixed(2))
}

// --- CSV Parsing Function ---
export function parseCsvToArtifacts(csvContent: string): Artifact[] {
  const artifacts: Artifact[] = []
  const rows = csvContent.trim().split("\n")

  console.log(`Parsing ${rows.length} CSV rows.`)

  for (let i = 0; i < rows.length; i++) {
    const rowContent = rows[i]
    // Basic CSV split, assumes commas are not within fields.
    // For more robust parsing, consider a library like PapaParse.
    const columns = rowContent.split(",").map((col) => col.trim().replace(/^"|"$/g, "")) // Trim and remove surrounding quotes

    if (columns.length < 3) {
      // Expecting at least genre, artist, title
      console.warn(`Skipping row ${i + 1} due to insufficient columns: ${rowContent}`)
      continue
    }

    const rawData: RawArtifactData = {
      genre: columns[0] || "",
      artist: columns[1] || "",
      title: columns[2] || "",
      discogs_url: columns[3] || "",
    }

    if (!rawData.artist && !rawData.title) {
      console.warn(`Skipping row ${i + 1} due to missing artist and title: ${rowContent}`)
      continue
    }

    const price = assignDynamicPrice(rawData.genre)
    const stock = Math.floor(Math.random() * (20 - 3 + 1)) + 3 // Random int between 3 and 20

    const artifact: Artifact = {
      artist: rawData.artist || "Unknown Artist",
      title: rawData.title || "Untitled",
      album: null, // Or attempt to parse from title if applicable
      format: "Vinyl",
      price: price,
      currency: "eur",
      stock: stock,
      inventory: stock,
      slug: slugify(`${rawData.artist}-${rawData.title}`),
      category: "Deck A", // Default category, can be refined
      keywords: rawData.genre ? [rawData.genre] : [],
      discogs_url: rawData.discogs_url,
      product_type: "artifact",
      product_id: null,
      price_id: null,
      active: false, // Will be set to true after Stripe processing
    }
    artifacts.push(artifact)
  }
  console.log(`Successfully parsed ${artifacts.length} artifacts.`)
  return artifacts
}
