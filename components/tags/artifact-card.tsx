import type { Artifact } from "@/lib/artifacts"
import { deepTags, type Tag } from "@/lib/tags"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import { MythicText } from "@/components/brand/mythic-brand-system"

interface ArtifactCardProps {
  artifact: Artifact
}

const getTagById = (tagId: string): Tag | undefined => deepTags.find((t) => t.id === tagId)

const categoryColors: { [key: string]: string } = {
  genre: "border-primary/50 text-primary bg-primary/10",
  mood: "border-accent/50 text-accent bg-accent/10",
  era: "border-secondary/50 text-secondary-foreground bg-secondary/20",
  instrumentation: "border-teal-300/50 text-teal-300 bg-teal-300/10",
  concept: "border-amber-400/50 text-amber-400 bg-amber-400/10",
  origin: "border-cyan-400/50 text-cyan-400 bg-cyan-400/10",
}

export function ArtifactCard({ artifact }: ArtifactCardProps) {
  return (
    <Card className="bg-card/70 border-border hover:border-primary/40 transition-all duration-300 flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="aspect-w-1 aspect-h-1 mb-3">
          <img
            src={artifact.image || "/placeholder.svg"}
            alt={artifact.name}
            className="rounded-md object-cover w-full h-full"
          />
        </div>
        <CardTitle className="font-orbitron text-lg leading-tight">
          <MythicText variant="heading" className="text-foreground">
            {artifact.name}
          </MythicText>
        </CardTitle>
        <MythicText variant="caption" className="text-foreground/70">
          {artifact.artist} ({artifact.year})
        </MythicText>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="font-poetic text-sm text-foreground/80 leading-relaxed line-clamp-3">{artifact.description}</p>
      </CardContent>
      <CardFooter className="flex-col items-start pt-3">
        <div className="flex flex-wrap gap-1 mb-3">
          {artifact.tags.slice(0, 4).map((tagId) => {
            const tag = getTagById(tagId)
            if (!tag) return null
            return (
              <Badge
                key={tag.id}
                variant="outline"
                className={`text-xs ${categoryColors[tag.category] || "border-border text-foreground"}`}
              >
                {tag.name}
              </Badge>
            )
          })}
          {artifact.tags.length > 4 && (
            <Badge variant="outline" className="text-xs border-border text-foreground">
              +{artifact.tags.length - 4} more
            </Badge>
          )}
        </div>
        <Button variant="outline" size="sm" className="w-full border-primary/50 text-primary hover:bg-primary/10">
          <Play className="w-4 h-4 mr-2" />
          Engage
        </Button>
      </CardFooter>
    </Card>
  )
}
