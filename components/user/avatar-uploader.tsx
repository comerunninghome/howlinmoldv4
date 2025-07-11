"use client"

import type React from "react"

import { useState } from "react"
import { createSupabaseClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { UserAvatar } from "./user-avatar"

export function AvatarUploader() {
  const supabase = createSupabaseClient()
  const { user } = useAuth()
  const { data, updateProfile } = useUserProfile()
  const { toast } = useToast()
  const [uploading, setUploading] = useState(false)

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload an avatar.",
        variant: "destructive",
      })
      return
    }

    try {
      setUploading(true)
      const file = event.target.files?.[0]
      if (!file) {
        throw new Error("You must select an image to upload.")
      }

      const fileExt = file.name.split(".").pop()
      const filePath = `${user.id}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const success = await updateProfile({ avatar_url: filePath })
      if (success) {
        toast({ title: "Avatar Updated", description: "Your new avatar has been saved." })
      } else {
        throw new Error("Failed to update profile with new avatar.")
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <UserAvatar path={data?.profile?.avatar_url ?? null} className="h-20 w-20" />
      <div className="flex flex-col gap-2">
        <Button asChild variant="outline" disabled={uploading}>
          <label htmlFor="avatar-upload">
            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {uploading ? "Uploading..." : "Change Avatar"}
          </label>
        </Button>
        <Input
          id="avatar-upload"
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">PNG or JPG, up to 2MB.</p>
      </div>
    </div>
  )
}
