import { SimpleHeader } from "@/components/simple-mode/simple-header"
import { ArtifactFeed } from "@/components/simple-mode/artifact-feed"

export default function SimpleModePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <SimpleHeader />
      <div className="mt-8">
        <ArtifactFeed />
      </div>
    </div>
  )
}
