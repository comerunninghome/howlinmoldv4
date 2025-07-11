import type React from "react"
import type { FC } from "react"
import { Database, Sparkles, Wand2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export type ProvenanceSourceType = "base" | "enhancement" | "user"

export interface ProvenanceSource {
  name: string
  type: ProvenanceSourceType
  description?: string
  url?: string
}

interface ProvenanceDisplayProps {
  sources: ProvenanceSource[]
  className?: string
}

const SourceIcons: Record<ProvenanceSourceType, React.ReactNode> = {
  base: <Database className="h-3 w-3 text-slate-500" />,
  enhancement: <Wand2 className="h-3 w-3 text-purple-400" />,
  user: <Sparkles className="h-3 w-3 text-amber-400" />,
}

const SourceTooltips: Record<ProvenanceSourceType, string> = {
  base: "Base discographical data source.",
  enhancement: "Data enriched by Howlin' Mold's internal analysis.",
  user: "Data enhanced by community contributions.",
}

export const ProvenanceDisplay: FC<ProvenanceDisplayProps> = ({ sources, className }) => {
  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className={`flex items-center gap-x-3 text-xs text-slate-500 ${className}`}>
        {sources.map((source, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 transition-colors ${source.url ? "hover:text-slate-300" : "cursor-default"}`}
              >
                {SourceIcons[source.type]}
                <span>{source.name}</span>
              </a>
            </TooltipTrigger>
            <TooltipContent className="bg-slate-800 border-slate-700 text-slate-300">
              <p>{source.description || SourceTooltips[source.type]}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
