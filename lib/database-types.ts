import type { SynthState } from "@/lib/types"

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      artifacts: {
        Row: {
          artist: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          title: string | null
        }
        Insert: {
          artist?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Update: {
          artist?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
          liked_artifacts: string[] | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
          liked_artifacts?: string[] | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
          liked_artifacts?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_snapshots: {
        Row: {
          created_at: string
          id: number
          snapshot_data: Json
          snapshot_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          snapshot_data: Json
          snapshot_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          snapshot_data?: Json
          snapshot_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_snapshots_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      toggle_like: {
        Args: {
          artifact_id: string
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface UserProfile {
  id: string // This is the user_id from auth.users
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  current_level: number
  completed_rituals: number
  collected_artifacts: number
  community_score: number
  current_tier_id: string
  total_play_time: number
  favorite_genres: string[] | null
  ritual_streak: number
  achievements: string[] | null
  created_at: string
  updated_at: string | null
  liked_artifacts: string[] | null
}

export interface UserRitual {
  id: string
  userId: string
  name: string
  description: string
  artifactIds: string[]
  sigilOverlays: string[]
  mood: string
  intention: string
  duration: number
  completedAt: string
  resonanceGained: number
  createdAt: string
}

export interface UserArtifact {
  id: string
  userId: string
  artifactId: string
  acquiredAt: string
  playCount: number
  lastPlayed: string
  rating?: number
  notes?: string
}

export interface UserAchievement {
  id: string
  userId: string
  achievementId: string
  unlockedAt: string
  progress: number
  isCompleted: boolean
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  category: "ritual" | "collection" | "community" | "exploration" | "mastery"
  requirements: {
    type: string
    target: number
    current?: number
  }[]
  rewards: {
    resonance?: number
    destiny?: number
    relics?: number
    aura?: number
  }
  rarity: "common" | "rare" | "epic" | "legendary" | "mythic"
}

export interface UserSnapshot {
  id: number
  user_id: string
  name: string
  description?: string | null
  tags?: string[] | null
  state: SynthState
  created_at: string
  updated_at?: string | null
}
