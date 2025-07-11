import type React from "react"
import { cn } from "@/lib/utils"

interface MythicTextProps {
  variant?: "title" | "subtitle" | "body" | "caption"
  className?: string
  children: React.ReactNode
}

export const MythicText: React.FC<MythicTextProps> = ({ variant = "body", className, children }) => {
  const baseClasses = "font-poetic"

  const variantClasses = {
    title: "text-3xl md:text-4xl font-bold tracking-wide",
    subtitle: "text-xl md:text-2xl font-semibold tracking-wide",
    body: "text-base md:text-lg",
    caption: "text-sm md:text-base opacity-80",
  }

  return <div className={cn(baseClasses, variantClasses[variant], className)}>{children}</div>
}
