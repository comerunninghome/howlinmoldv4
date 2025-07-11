"use client"

import type React from "react"

import { useState, useEffect, type FormEvent } from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import type { UserProfile } from "@/lib/database-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { AvatarUploader } from "./avatar-uploader"
import { Separator } from "@/components/ui/separator"

interface EditProfileFormProps {
  onSuccess: () => void
}

export function EditProfileForm({ onSuccess }: EditProfileFormProps) {
  const { data, updateProfile } = useUserProfile()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    website: "",
    favorite_genres: "",
  })

  useEffect(() => {
    if (data?.profile) {
      setFormData({
        full_name: data.profile.full_name || "",
        username: data.profile.username || "",
        website: data.profile.website || "",
        favorite_genres: data.profile.favorite_genres?.join(", ") || "",
      })
    }
  }, [data])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const updates: Partial<UserProfile> = {
      full_name: formData.full_name,
      username: formData.username,
      website: formData.website,
      favorite_genres: formData.favorite_genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
    }

    const success = await updateProfile(updates)

    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      onSuccess()
    } else {
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      })
    }
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <AvatarUploader />
      <Separator />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="A unique username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://your-website.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="favorite_genres">Favorite Genres</Label>
          <Textarea
            id="favorite_genres"
            name="favorite_genres"
            value={formData.favorite_genres}
            onChange={handleChange}
            placeholder="Ambient, Techno, Ritual Bass..."
            rows={3}
          />
          <p className="text-xs text-muted-foreground">Enter genres separated by commas.</p>
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  )
}
