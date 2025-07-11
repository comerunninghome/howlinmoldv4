"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function signUp(formData: FormData) {
  const origin = headers().get("origin")
  const supabase = createSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const username = formData.get("username") as string

  if (!email || !password || !username) {
    return redirect("/login?message=Email, password, and username are required.")
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Sign up error:", error)
    return redirect(`/login?message=Could not authenticate user: ${error.message}`)
  }

  return redirect("/login?message=Check your email to continue the sign-up process.")
}

export async function signIn(formData: FormData) {
  const supabase = createSupabaseServerClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return redirect("/login?message=Email and password are required.")
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("Sign in error:", error)
    return redirect(`/login?message=Invalid credentials. Please try again.`)
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signOut() {
  const supabase = createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
