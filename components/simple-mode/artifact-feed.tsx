"use client"

import { SimpleArtifactCard } from "./simple-artifact-card"
import { mockArtifacts } from "@/lib/artifacts"

export function ArtifactFeed() {
  return (
    <div className="space-y-4">
      {mockArtifacts.map((artifact) => (
        <SimpleArtifactCard key={artifact.id} artifact={artifact} allArtifacts={mockArtifacts} />
      ))}
    </div>
  )
}
