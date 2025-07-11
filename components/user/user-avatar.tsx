"use client"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"

interface UserAvatarProps {
  path: string | null
  className?: string
}

export function UserAvatar({ path, className }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={path ?? undefined} alt="User avatar" />
      <AvatarFallback>
        <UserIcon className="h-1/2 w-1/2 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  )
}
