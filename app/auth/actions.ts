"use server"

import { createSupabaseClient } from "@/lib/supabase/server"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createSupabaseClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return redirect("/login?message=Could not authenticate user")
  }

  return redirect("/")
}

export async function signUp(formData: FormData) {
  const origin = headers().get("origin")
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string
  const supabase = createSupabaseClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: username,
        // You can add more metadata here
      },
    },
  })

  if (error) {
    console.error("Sign up error:", error)
    return redirect("/login?message=Could not authenticate user. " + error.message)
  }

  // For this demo, we'll just redirect to a page that tells the user to check their email.
  // In a real app, you might want to automatically sign them in or handle it differently.
  return redirect("/login?message=Check email to continue sign in process")
}
