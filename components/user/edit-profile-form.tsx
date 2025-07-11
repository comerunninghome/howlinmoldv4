"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useToast } from "@/hooks/use-toast"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { profileSchema } from "@/lib/types"
import { AvatarUploader } from "./avatar-uploader"

const formSchema = profileSchema.pick({
  username: true,
  full_name: true,
  favorite_genres: true,
})

interface EditProfileFormProps {
  onOpenChange: (open: boolean) => void
}

export function EditProfileForm({ onOpenChange }: EditProfileFormProps) {
  const { data, updateProfile } = useUserProfile()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: data?.profile?.username ?? "",
      full_name: data?.profile?.full_name ?? "",
      favorite_genres: data?.profile?.favorite_genres ?? [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const success = await updateProfile(values)
    if (success) {
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully.",
      })
      onOpenChange(false)
    } else {
      toast({
        title: "Update Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogDescription>Make changes to your profile here. Click save when you're done.</DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        <AvatarUploader currentAvatarUrl={data?.profile?.avatar_url ?? null} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Your unique username" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="favorite_genres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favorite Genres</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Cosmic Ambient, Teutonic Sleaze"
                      {...field}
                      onChange={(e) => {
                        const genres = e.target.value.split(",").map((g) => g.trim())
                        field.onChange(genres)
                      }}
                      value={Array.isArray(field.value) ? field.value.join(", ") : ""}
                    />
                  </FormControl>
                  <FormDescription>A comma-separated list of your resonant frequencies.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </div>
    </>
  )
}
