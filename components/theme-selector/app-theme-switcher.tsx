"use client"

import { useAppTheme } from "@/hooks/use-app-theme"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

export function AppThemeSwitcher() {
  const { themes, activeThemeId, setActiveThemeAndApply } = useAppTheme()

  const activeTheme = themes.find((t) => t.id === activeThemeId)
  const activeThemeName = activeTheme?.name || "Select Theme"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full max-w-sm justify-between text-base p-5 bb-interactive-border-accent bb-interactive-pulse-glow",
          )}
        >
          <span>{activeThemeName}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-black/80 backdrop-blur-md border-primary/30" align="start">
        {themes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setActiveThemeAndApply(theme.id)}
            className="bb-interactive-link-glow cursor-pointer focus:bg-primary/20 focus:text-primary"
          >
            <Palette className="w-4 h-4 mr-2" />
            {theme.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
