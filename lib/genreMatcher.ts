const ADAPTIVE_MATCH_SCORE_THRESHOLD = 0.9 // Adjust this to fine-tune sensitivity.
// Lower values (e.g., 0.4) make it easier for genres to match (more sensitive).
// Higher values (e.g., 1.5) require stronger keyword matches (less sensitive).

export interface RecordMetadata {
  artist: string
  title: string
  description?: string
  year?: number
  country?: string
  tags?: string[] // General descriptive tags, not the Howlin' Taxonomy genres themselves
  formats?: string[]
  // Potentially add other fields if your CSV/scraped data has them (e.g., label, style_from_source)
}

// Your Howlin' Genre Taxonomy
const genreMap: Record<string, string[]> = {
  "Jazz-Funk / Fusion": [
    "fusion",
    "jazz funk",
    "electric piano",
    "miles davis",
    "herbie hancock",
    "weather report",
    "cruise",
    "rhodes",
    "groove",
    "jazz-rock",
  ],
  "Dancing for Mental Health": [
    "therapy",
    "spoken word",
    "outsider",
    "new age",
    "hypnosis",
    "guided meditation",
    "healing music",
    "self-help",
  ],
  "Private Pressing": ["private press", "vanity", "self released", "small label", "handmade", "diy", "limited edition"],
  "House / New Beat / Techno": [
    "new beat",
    "house",
    "techno",
    "acid",
    "rave",
    "90s house",
    "detroit techno",
    "chicago house",
    "belgian new beat",
  ],
  "Disco / Cosmic": ["cosmic", "space disco", "italo", "electro disco", "boogie", "post-disco", "daniele baldelli"],
  "Fräulein Funk / Teutonic Funk": [
    "german funk",
    "kraut funk",
    "ndw funk",
    "euro groove",
    "german groove",
    "teutonic beats",
  ],
  "Balearic Hybrids": [
    "balearic",
    "sunset",
    "café del mar",
    "dreamy funk",
    "ibiza chill",
    "chillwave",
    "balearic beat",
  ],
  "Spiritual / Ritual / Vault": [
    "spiritual jazz",
    "ritual music",
    "ethno jazz",
    "devotional",
    "vault",
    "sacred",
    "tribal ambient",
    "deep listening",
  ],
  "Casio Sleaze": ["casio", "cheap synth", "bedroom pop", "sleazy", "lo-fi synth", "minimal wave", "toy keyboard"],
  "Synth Pop / NDW": [
    "minimal synth",
    "ndw",
    "neue deutsche welle",
    "synth pop",
    "drum machine",
    "cold wave",
    "80s synth",
  ],
  "Tristeza Funk / Brazilian Jazz": [
    "brazil",
    "tristeza",
    "sad funk",
    "mpb",
    "melancholy",
    "bossa nova",
    "samba jazz",
    "brazilian soul",
  ],
  "Bossa Dreamers": ["bossa nova", "dream pop", "beach", "vintage mpb", "brazilian chill", "soft pop"],
  "Library Grooves": [
    "library music",
    "soundtrack",
    "production music",
    "instrumental funk",
    "mood music",
    "tv themes",
  ],
  "Musica Italiana (Balearic / AOR / Boogie)": [
    "italian aor",
    "italo boogie",
    "napoli funk",
    "italian balearic",
    "canzone d'autore",
    "italian soul",
  ],
  "Afro-Cosmic / Italo-Jazz": [
    "afro funk",
    "cosmic disco",
    "tribal funk",
    "cameroon",
    "nigerian funk",
    "italo jazz",
    "afrobeat",
  ],
  "Outsider Pop / Comedy Funk": [
    "weird pop",
    "private pop",
    "avant pop",
    "awkward funk",
    "comedy record",
    "novelty song",
    "outsider music",
  ],
  "Fake Reggae / Post-Kraut": [
    "fake reggae",
    "dub adjacent",
    "weird ska",
    "post-krautrock",
    "experimental dub",
    "not reggae",
  ],
  "Experimental Ambient / Ghost Lounge": [
    "ambient",
    "lounge",
    "ghostly",
    "hauntology",
    "kankyo ongaku",
    "dark ambient",
    "experimental electronic",
  ],
  "Japanese Electronics / Mood Kankyo": [
    "kankyo ongaku",
    "japanese ambient",
    "environmental music",
    "80s japan synth",
    "city pop instrumental",
    "yoshimura",
    "sakamoto",
  ],
  // Add more genres and keywords as your taxonomy expands
}

export function matchGenre(record: RecordMetadata): string[] {
  const data = `${record.artist} ${record.title} ${record.description || ""} ${record.country || ""}`.toLowerCase()
  const tags = record.tags?.map((t) => t.toLowerCase()) || []
  const formats = record.formats?.map((f) => f.toLowerCase()) || []

  const matched: string[] = []

  for (const [genre, keywords] of Object.entries(genreMap)) {
    const genreKey = genre.toLowerCase() // For direct tag matching
    if (tags.includes(genreKey) || formats.includes(genreKey)) {
      matched.push(genre)
      continue // Prioritize direct tag/format match
    }
    const found = keywords.some((kw) => data.includes(kw) || tags.includes(kw) || formats.includes(kw))
    if (found) {
      matched.push(genre)
    }
  }

  // If specific "Vault" genre is matched, ensure it's prominent
  if (matched.includes("Spiritual / Ritual / Vault") && !matched.find((g) => g.toLowerCase().includes("vault"))) {
    // This case is already handled by the genre name itself.
  }

  return matched.length ? [...new Set(matched)] : ["Unclassified"] // Return unique genres
}

export function isVaultEligible(matchedGenres: string[]): boolean {
  return matchedGenres.some((genre) => genre.toLowerCase().includes("spiritual / ritual / vault"))
}
