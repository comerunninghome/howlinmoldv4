"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Disc3, Loader2 } from "lucide-react"

// --- Mock Data & Types ---
// This simulates the structure of a track from the Spotify API
type MockSpotifyTrack = {
  track: {
    id: string
    name: string
    artists: { name: string }[]
    album: {
      name: string
      release_date: string
      images: { url: string }[]
    }
  }
}

// This is the format for our shop's products (`artifacts`)
type Artifact = {
  id: string
  title: string
  artist: string
  year: string
  price: number
  format: "Vinyl" | "CD"
  condition: "Pristine" | "New"
  image: string
  significance: string
  inStock: number
}

// --- Mock API Call ---
// Simulates fetching a playlist from Spotify. Resolves with mock data after a delay.
const mockFetchSpotifyPlaylist = (url: string): Promise<MockSpotifyTrack[]> => {
  console.log(`Simulating fetch for playlist: ${url}`)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          track: {
            id: "4cOdK2wGLETOMsV3g9NGDP",
            name: "So What",
            artists: [{ name: "Miles Davis" }],
            album: {
              name: "Kind of Blue",
              release_date: "1959-08-17",
              images: [{ url: "/placeholder.svg?height=300&width=300" }],
            },
          },
        },
        {
          track: {
            id: "2IqjKEztwnFhr104dnM6m8",
            name: "Disorder",
            artists: [{ name: "Joy Division" }],
            album: {
              name: "Unknown Pleasures",
              release_date: "1979-06-15",
              images: [{ url: "/placeholder.svg?height=300&width=300" }],
            },
          },
        },
        {
          track: {
            id: "0a2EAUaI3sFFdM0de73g2z",
            name: "1/1",
            artists: [{ name: "Brian Eno" }],
            album: {
              name: "Ambient 1: Music for Airports",
              release_date: "1978-03-01",
              images: [{ url: "/placeholder.svg?height=300&width=300" }],
            },
          },
        },
        {
          track: {
            id: "3a9OlJt3b3v3J4TzG63fB4",
            name: "Heliosphan",
            artists: [{ name: "Aphex Twin" }],
            album: {
              name: "Selected Ambient Works 85-92",
              release_date: "1992-11-09",
              images: [{ url: "/placeholder.svg?height=300&width=300" }],
            },
          },
        },
      ])
    }, 1500)
  })
}

export default function SpotifyPlaylistImporter() {
  const [playlistUrl, setPlaylistUrl] = useState("https://open.spotify.com/playlist/37i9dQZF1DX4sWSpwq3LiO")
  const [importedArtifacts, setImportedArtifacts] = useState<Artifact[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // This is the core handler function
  const handleImportPlaylist = async () => {
    if (!playlistUrl) return
    setIsLoading(true)
    setImportedArtifacts([])

    const spotifyTracks = await mockFetchSpotifyPlaylist(playlistUrl)

    // Transform Spotify data into our product (`Artifact`) format
    const newArtifacts = spotifyTracks.map((item, index): Artifact => {
      const format = Math.random() > 0.5 ? "Vinyl" : "CD"
      return {
        id: item.track.id,
        title: item.track.name,
        artist: item.track.artists.map((a) => a.name).join(", "),
        year: item.track.album.release_date.substring(0, 4),
        price: Math.floor(Math.random() * 80) + 20, // Random price for demo
        format: format,
        condition: "New",
        image: item.track.album.images[0]?.url || "/placeholder.svg",
        significance: `A new artifact generated from playlist import. Format: ${format}.`,
        inStock: Math.floor(Math.random() * 10) + 1,
      }
    })

    setImportedArtifacts(newArtifacts)
    setIsLoading(false)
  }

  return (
    <Card className="bg-black/50 border-primary/40 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Disc3 className="w-6 h-6 text-primary" />
          <span className="text-primary-foreground">Deck B: Create from Spotify</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex-grow flex flex-col">
        <p className="text-sm text-teal-200/70">
          Paste a Spotify playlist link to generate purchasable Vinyl/CD artifacts for the shop grid.
        </p>
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Spotify Playlist URL"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
            className="bg-gray-900/50 border-primary/50 text-teal-100"
          />
          <Button
            onClick={handleImportPlaylist}
            disabled={isLoading}
            className="bg-primary hover:bg-accent text-primary-foreground"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Import"}
          </Button>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-4">
          {isLoading && (
            <div className="flex items-center justify-center h-full text-teal-300/60">
              <Loader2 className="w-8 h-8 animate-spin mr-4" />
              <span>Generating artifacts from playlist...</span>
            </div>
          )}

          {/* This grid reuses the exact structure and styling from your shop page */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {importedArtifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="bg-black/50 border-primary/40 hover:border-accent transition-all duration-300"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={artifact.image || "/placeholder.svg"}
                      alt={`${artifact.title} by ${artifact.artist}`}
                      className="w-full h-48 object-cover"
                    />
                    <Badge variant="outline" className="absolute top-2 right-2 border-amber-500/50 text-amber-400">
                      {artifact.condition}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-teal-200 mb-1">{artifact.title}</h3>
                    <p className="text-teal-300/70 text-sm">{artifact.artist}</p>
                    <p className="text-teal-400/60 text-xs font-mono">{artifact.year}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-teal-100">${artifact.price}</div>
                    <Badge variant="outline" className="border-primary/50 text-teal-300">
                      {artifact.format}
                    </Badge>
                  </div>

                  <Button className="w-full bg-primary hover:bg-accent text-primary-foreground" size="sm">
                    Add to Shop
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
