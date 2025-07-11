import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/lib/database-types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase client credentials are not set. Please add the Supabase integration to your project and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are available.",
  )
}

// Export a single, initialized client instance as a named export.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
