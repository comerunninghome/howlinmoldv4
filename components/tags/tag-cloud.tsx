"use client"

import type { EvolvingTag } from "@/lib/tags"
import { getCurrentEvolution } from "@/lib/tags"
import { motion } from "framer-motion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MythicText } from "@/components/brand/mythic-brand-system"
import { cn } from "@/lib/utils"
import { History, Search, Filter, X } from "lucide-react"
import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TagCloudProps {
  tags: EvolvingTag[]
  selectedTags?: string[]
  onTagSelect?: (tagId: string) => void
  maxTags?: number
  showSearch?: boolean
  showCategoryFilter?: boolean
}

const categoryColors: { [key: string]: string } = {
  genre: "text-primary border-primary/50 bg-primary/10 hover:bg-primary/20",
  mood: "text-accent border-accent/50 bg-accent/10 hover:bg-accent/20",
  era: "text-secondary-foreground border-secondary/50 bg-secondary/20 hover:bg-secondary/30",
  instrumentation: "text-teal-300 border-teal-300/50 bg-teal-300/10 hover:bg-teal-300/20",
  concept: "text-amber-400 border-amber-400/50 bg-amber-400/10 hover:bg-amber-400/20",
  origin: "text-cyan-400 border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20",
  experimental: "text-purple-400 border-purple-400/50 bg-purple-400/10 hover:bg-purple-400/20",
  underground: "text-red-400 border-red-400/50 bg-red-400/10 hover:bg-red-400/20",
  atmospheric: "text-blue-400 border-blue-400/50 bg-blue-400/10 hover:bg-blue-400/20",
}

const selectedCategoryColors: { [key: string]: string } = {
  genre: "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
  mood: "bg-accent text-accent-foreground ring-2 ring-accent ring-offset-2 ring-offset-background",
  era: "bg-secondary text-secondary-foreground ring-2 ring-secondary ring-offset-2 ring-offset-background",
  instrumentation: "bg-teal-400 text-black ring-2 ring-teal-400 ring-offset-2 ring-offset-background",
  concept: "bg-amber-500 text-black ring-2 ring-amber-500 ring-offset-2 ring-offset-background",
  origin: "bg-cyan-500 text-black ring-2 ring-cyan-500 ring-offset-2 ring-offset-background",
  experimental: "bg-purple-500 text-white ring-2 ring-purple-500 ring-offset-2 ring-offset-background",
  underground: "bg-red-500 text-white ring-2 ring-red-500 ring-offset-2 ring-offset-background",
  atmospheric: "bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2 ring-offset-background",
}

export function TagCloud({
  tags,
  selectedTags = [],
  onTagSelect = () => {},
  maxTags = 100,
  showSearch = true,
  showCategoryFilter = true,
}: TagCloudProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Get unique categories from tags
  const availableCategories = useMemo(() => {
    const categories = Array.from(new Set(tags.map((tag) => tag.category)))
    return categories.sort()
  }, [tags])

  // Filter and sort tags based on search and category filters
  const filteredTags = useMemo(() => {
    let filtered = tags

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(query) ||
          tag.baseDescription.toLowerCase().includes(query) ||
          getCurrentEvolution(tag).keywords?.some((keyword) => keyword.toLowerCase().includes(query)),
      )
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((tag) => selectedCategories.includes(tag.category))
    }

    // Sort by weight (descending) and then by name
    filtered.sort((a, b) => {
      if (b.weight !== a.weight) {
        return b.weight - a.weight
      }
      return a.name.localeCompare(b.name)
    })

    // Limit number of tags
    return filtered.slice(0, maxTags)
  }, [tags, searchQuery, selectedCategories, maxTags])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        {(showSearch || showCategoryFilter) && (
          <div className="space-y-4">
            {showSearch && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tags, descriptions, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50 border-border/50"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}

            {showCategoryFilter && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <MythicText variant="caption" className="text-muted-foreground">
                    Filter by Category
                  </MythicText>
                  {selectedCategories.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 px-2 text-xs">
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategories.includes(category) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleCategory(category)}
                      className={cn(
                        "h-7 px-3 text-xs capitalize transition-all",
                        selectedCategories.includes(category)
                          ? selectedCategoryColors[category] || "bg-foreground text-background"
                          : categoryColors[category] || "text-foreground border-border",
                      )}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Results Summary */}
            <div className="text-sm text-muted-foreground">
              Showing {filteredTags.length} of {tags.length} tags
              {searchQuery && ` matching "${searchQuery}"`}
              {selectedCategories.length > 0 && ` in ${selectedCategories.join(", ")}`}
            </div>
          </div>
        )}

        {/* Tag Cloud */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-x-4 gap-y-5 p-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTags.length === 0 ? (
            <div className="text-center py-8">
              <MythicText variant="body" className="text-muted-foreground">
                No tags found matching your criteria
              </MythicText>
            </div>
          ) : (
            filteredTags.map((tag) => {
              const isSelected = selectedTags.includes(tag.id)
              const currentEvolution = getCurrentEvolution(tag)
              const hasEvolved = tag.evolutionPoints && tag.evolutionPoints.length > 1

              return (
                <Tooltip key={tag.id} delayDuration={isSelected ? 100000 : 300}>
                  <TooltipTrigger asChild>
                    <motion.button
                      variants={itemVariants}
                      whileHover={{ scale: isSelected ? 1 : 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onTagSelect(tag.id)}
                      className={cn(
                        `rounded-full border px-4 py-2 transition-all duration-300 cursor-pointer focus:outline-none relative`,
                        isSelected
                          ? selectedCategoryColors[tag.category] ||
                              "bg-foreground text-background ring-2 ring-foreground"
                          : categoryColors[tag.category] || "text-foreground border-border",
                      )}
                      style={{
                        fontSize: `${12 + Math.min(tag.weight * 1.2, 8)}px`,
                        opacity: isSelected ? 1 : 0.6 + Math.min(tag.weight * 0.04, 0.4),
                      }}
                      aria-pressed={isSelected}
                    >
                      {tag.name}
                      {hasEvolved && !isSelected && (
                        <History className="w-3 h-3 absolute top-1 right-1 text-foreground/50" />
                      )}
                    </motion.button>
                  </TooltipTrigger>
                  {!isSelected && (
                    <TooltipContent className="bg-black/90 border-primary/30 text-foreground max-w-xs">
                      <div className="flex justify-between items-center">
                        <MythicText
                          variant="subtitle"
                          className={`text-lg ${categoryColors[tag.category]?.split(" ")[0]}`}
                        >
                          {tag.name}
                        </MythicText>
                        {hasEvolved && <History className="w-4 h-4 text-foreground/70" title="This tag has evolved" />}
                      </div>
                      <MythicText variant="caption" className="capitalize mb-1">
                        {tag.category}
                      </MythicText>
                      <p className="text-sm font-poetic mb-1">
                        <span className="text-foreground/70 font-semibold">Currently: </span>
                        {currentEvolution.description}
                      </p>
                      {currentEvolution.keywords && currentEvolution.keywords.length > 0 && (
                        <p className="text-xs text-foreground/60">
                          <span className="font-semibold">Keywords:</span> {currentEvolution.keywords.join(", ")}
                        </p>
                      )}
                      {hasEvolved && (
                        <p className="text-xs text-accent/80 mt-2 italic">
                          This sigil's meaning has shifted over time.
                        </p>
                      )}
                      {!hasEvolved && tag.baseDescription !== currentEvolution.description && (
                        <p className="text-sm font-poetic mb-1">
                          <span className="text-foreground/70 font-semibold">Originally: </span>
                          {tag.baseDescription}
                        </p>
                      )}
                    </TooltipContent>
                  )}
                </Tooltip>
              )
            })
          )}
        </motion.div>
      </div>
    </TooltipProvider>
  )
}
