"use server"

import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export interface FormState {
  message: string
  success: boolean
}

export async function uploadAvatar(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { message: "Authentication required.", success: false }
  }

  const file = formData.get("avatar") as File
  if (!file || file.size === 0) {
    return { message: "Please select a file to upload.", success: false }
  }

  try {
    // Get current avatar URL to delete it after successful upload
    const { data: profile } = await supabase.from("profiles").select("avatar_url").eq("id", user.id).single()

    const oldAvatarUrl = profile?.avatar_url

    // Upload the new file to Vercel Blob
    const blob = await put(file.name, file, {
      access: "public",
    })

    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: blob.url }).eq("id", user.id)

    if (updateError) {
      // If profile update fails, try to delete the newly uploaded blob to avoid orphans
      await del(blob.url)
      throw updateError
    }

    // Delete the old avatar from Vercel Blob if it existed
    if (oldAvatarUrl) {
      try {
        await del(oldAvatarUrl)
      } catch (delError) {
        console.warn("Failed to delete old avatar. It may have already been removed.", delError)
      }
    }

    revalidatePath("/profile")
    return { message: "Avatar updated successfully.", success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
    console.error("Avatar upload failed:", errorMessage)
    return { message: errorMessage, success: false }
  }
}
