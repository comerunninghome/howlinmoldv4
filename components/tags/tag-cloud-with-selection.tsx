"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TagCloud } from "./tag-cloud"
import { MythicText } from "@/components/brand/mythic-brand-system"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Sparkles } from "lucide-react"
import type { EvolvingTag } from "@/lib/tags"

interface TagCloudWithSelectionProps {
  tags: EvolvingTag[]
  maxTags?: number
  showSearch?: boolean
  showCategoryFilter?: boolean
}

export function TagCloudWithSelection({
  tags,
  maxTags = 100,
  showSearch = true,
  showCategoryFilter = true,
}: TagCloudWithSelectionProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get selected tags from URL params
  const urlTags = searchParams.get("tags")
  const [selectedTags, setSelectedTags] = useState<string[]>(urlTags ? urlTags.split(",").filter(Boolean) : [])

  // Handle tag selection
  const handleTagSelect = useCallback(
    (tagId: string) => {
      setSelectedTags((prev) => {
        const newSelection = prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]

        // Update URL with new selection
        const params = new URLSearchParams(searchParams.toString())
        if (newSelection.length > 0) {
          params.set("tags", newSelection.join(","))
        } else {
          params.delete("tags")
        }

        // Use replace to avoid cluttering browser history
        router.replace(`/discover?${params.toString()}`, { scroll: false })

        return newSelection
      })
    },
    [router, searchParams],
  )

  // Clear all selected tags
  const clearSelection = useCallback(() => {
    setSelectedTags([])
    const params = new URLSearchParams(searchParams.toString())
    params.delete("tags")
    router.replace(`/discover?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  // Remove individual tag
  const removeTag = useCallback(
    (tagId: string) => {
      handleTagSelect(tagId) // This will toggle it off
    },
    [handleTagSelect],
  )

  // Get selected tag objects for display
  const selectedTagObjects = tags.filter((tag) => selectedTags.includes(tag.id))

  return (
    <div className="space-y-6">
      {/* Selected Tags Display */}
      {selectedTags.length > 0 && (
        <div className="bg-background/30 border border-border/50 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <MythicText variant="subtitle" className="text-primary">
                Active Sigils ({selectedTags.length})
              </MythicText>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSelection}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear All
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedTagObjects.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 transition-colors"
              >
                <span className="capitalize">{tag.category}</span>
                <span className="text-primary/70">•</span>
                <span>{tag.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTag(tag.id)}
                  className="h-4 w-4 p-0 ml-1 hover:bg-primary/20"
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>

          {/* Future: Add artifact filtering results here */}
          <div className="text-sm text-muted-foreground italic">
            Artifact filtering based on selected sigils will be implemented in a future update.
          </div>
        </div>
      )}

      {/* Tag Cloud */}
      <TagCloud
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        maxTags={maxTags}
        showSearch={showSearch}
        showCategoryFilter={showCategoryFilter}
      />
    </div>
  )
}
