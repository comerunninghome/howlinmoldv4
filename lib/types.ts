import type { Database } from "./database-types"

export type Artifact = Database["public"]["Tables"]["artifacts"]["Row"]
export type Profile = Database["public"]["Tables"]["profiles"]["Row"]

export type CuratedTag = {
  id: string
  name: string
  category: "genre" | "mood" | "instrument" | "era" | "region"
  description?: string
}

export type SocialPost = {
  id: string
  userId: string
  userHandle: string
  userAvatar: string
  content: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  relatedArtifact?: {
    id: string
    name: string
    artist: string
  }
}
