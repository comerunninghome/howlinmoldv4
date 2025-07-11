"use client"

import { useFormState, useFormStatus } from "react-dom"
import type React from "react"
import { useEffect, useRef } from "react"
import { uploadAvatar } from "@/app/profile/actions"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { UserAvatar } from "./user-avatar"

interface AvatarUploaderProps {
  currentAvatarUrl: string | null
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button asChild variant="outline" disabled={pending}>
      <label htmlFor="avatar-upload">
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {pending ? "Uploading..." : "Change Avatar"}
      </label>
    </Button>
  )
}

export function AvatarUploader({ currentAvatarUrl }: AvatarUploaderProps) {
  const initialState = { message: "", success: false }
  const [state, formAction] = useFormState(uploadAvatar, initialState)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      })
    }
  }, [state, toast])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      formRef.current?.requestSubmit()
    }
  }

  return (
    <div className="flex items-center gap-4">
      <UserAvatar path={currentAvatarUrl} className="h-20 w-20" />
      <form ref={formRef} action={formAction} className="flex flex-col gap-2">
        <SubmitButton />
        <Input
          id="avatar-upload"
          name="avatar"
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg"
          onChange={handleFileChange}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground">PNG or JPG, up to 4.5MB.</p>
      </form>
    </div>
  )
}
