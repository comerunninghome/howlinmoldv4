"use client"

import { useEffect, useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { UserIcon } from "lucide-react"

interface UserAvatarProps {
  path: string | null
  className?: string
}

export function UserAvatar({ path, className }: UserAvatarProps) {
  const supabase = createSupabaseClient()
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    let objectUrl: string | null = null

    async function downloadImage() {
      if (!path) {
        setImageUrl(null)
        return
      }

      try {
        const { data, error } = await supabase.storage.from("avatars").download(path)
        if (error) {
          console.error("Error downloading image:", error)
          setImageUrl(null)
          return
        }
        objectUrl = URL.createObjectURL(data)
        setImageUrl(objectUrl)
      } catch (error) {
        console.error("Error downloading image:", error)
        setImageUrl(null)
      }
    }

    downloadImage()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [path, supabase.storage])

  return (
    <Avatar className={className}>
      <AvatarImage src={imageUrl ?? undefined} alt="User avatar" />
      <AvatarFallback>
        <UserIcon className="h-1/2 w-1/2 text-muted-foreground" />
      </AvatarFallback>
    </Avatar>
  )
}
