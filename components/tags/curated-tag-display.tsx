"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { deepTags as allEvolvingTags, type EvolvingTag, getCurrentEvolution } from "@/lib/tags" // Use EvolvingTag
import { mockArtifacts } from "@/lib/artifacts" // Assuming Artifact has a `deepTagIds: string[]`
import { TagCloud } from "./tag-cloud"
import { ArtifactCard } from "./artifact-card"
import { MythicText } from "@/components/brand/mythic-brand-system"
import { AnimatePresence, motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { XCircle, History } from "lucide-react"

const tagCategories: EvolvingTag["category"][] = ["genre", "mood", "concept", "era", "instrumentation"]

export function CuratedTagDisplay() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    const tagsFromUrl = searchParams.get("tags")
    if (tagsFromUrl) {
      const validTagIds = tagsFromUrl.split(",").filter((id) => allEvolvingTags.some((tag) => tag.id === id))
      setSelectedTagIds(validTagIds)
    }
    setIsInitialLoad(false)
  }, [searchParams])

  useEffect(() => {
    if (isInitialLoad) return

    const currentParams = new URLSearchParams(Array.from(searchParams.entries()))
    if (selectedTagIds.length > 0) {
      currentParams.set("tags", selectedTagIds.join(","))
    } else {
      currentParams.delete("tags")
    }
    const newSearch = currentParams.toString()
    const newUrl = `${pathname}${newSearch ? `?${newSearch}` : ""}`
    if (window.location.search !== (newSearch ? `?${newSearch}` : "")) {
      router.replace(newUrl, { scroll: false })
    }
  }, [selectedTagIds, router, pathname, searchParams, isInitialLoad])

  const handleTagSelect = useCallback((tagId: string) => {
    setSelectedTagIds((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }, [])

  const clearSelectedTags = useCallback(() => {
    setSelectedTagIds([])
  }, [])

  const filteredArtifacts = useMemo(() => {
    if (selectedTagIds.length === 0) {
      return mockArtifacts // Assuming mockArtifacts are of type Artifact[]
    }
    return mockArtifacts.filter((artifact) =>
      selectedTagIds.every(
        (selectedTagId) =>
          // Ensure artifact.deepTagIds exists and is an array before calling .includes
          artifact.deepTagIds && Array.isArray(artifact.deepTagIds) && artifact.deepTagIds.includes(selectedTagId),
      ),
    )
  }, [selectedTagIds])

  const getCategoryTitle = (category: EvolvingTag["category"]): string => {
    // ... (switch case remains the same)
    switch (category) {
      case "genre":
        return "Sonic Architectures (Genres)"
      case "mood":
        return "Emotional Resonances (Moods)"
      case "concept":
        return "Abstract Frequencies (Concepts)"
      case "era":
        return "Temporal Echoes (Eras)"
      case "instrumentation":
        return "Timbral Palettes (Instrumentation)"
      default:
        return "Other Glyphs"
    }
  }

  return (
    <div className="space-y-12">
      {tagCategories.map((category) => {
        const tagsForCategory = allEvolvingTags.filter((tag) => tag.category === category)
        if (tagsForCategory.length === 0) return null
        return (
          <section
            key={category}
            className="border border-dashed border-primary/20 p-6 rounded-lg bg-card/30 shadow-lg"
          >
            <MythicText variant="heading" className="text-center mb-6 text-transparent text-gradient-accent">
              {getCategoryTitle(category)}
            </MythicText>
            <TagCloud tags={tagsForCategory} selectedTags={selectedTagIds} onTagSelect={handleTagSelect} />
          </section>
        )
      })}

      <section className="mt-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <MythicText variant="title" className="text-foreground mb-4 sm:mb-0">
            Filtered Artifacts ({filteredArtifacts.length})
          </MythicText>
          {selectedTagIds.length > 0 && (
            <Button
              variant="outline"
              onClick={clearSelectedTags}
              className="border-accent/50 text-accent hover:bg-accent/10"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Clear Selection ({selectedTagIds.length})
            </Button>
          )}
        </div>

        {selectedTagIds.length > 0 && (
          <div className="mb-6 p-4 border border-primary/30 rounded-lg bg-card/50">
            <MythicText variant="caption" className="text-foreground/70 mb-2">
              Currently filtering by:
            </MythicText>
            <div className="flex flex-wrap gap-2">
              {selectedTagIds.map((tagId) => {
                const tag = allEvolvingTags.find((t) => t.id === tagId)
                if (!tag) return null
                const currentEvolution = getCurrentEvolution(tag)
                const hasEvolved = tag.evolutionPoints && tag.evolutionPoints.length > 1
                return (
                  <Badge key={tagId} variant="default" className="bg-primary/80 text-primary-foreground items-center">
                    {tag.name}
                    {hasEvolved && <History className="w-3 h-3 ml-1.5 opacity-70" title="Meaning has evolved" />}
                    <button
                      onClick={() => handleTagSelect(tagId)}
                      className="ml-2 opacity-70 hover:opacity-100"
                      aria-label={`Remove ${tag.name} filter`}
                    >
                      <XCircle size={14} />
                    </button>
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {filteredArtifacts.length > 0 ? (
            <motion.div
              key={selectedTagIds.join("-") || "all"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredArtifacts.map((artifact) => (
                <ArtifactCard key={artifact.id} artifact={artifact} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="no-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-12"
            >
              <MythicText variant="subtitle" className="text-foreground/70">
                No artifacts match the current sigil combination.
              </MythicText>
              <MythicText variant="body" className="text-foreground/50 mt-2">
                Try deselecting some tags or explore a different constellation.
              </MythicText>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}
