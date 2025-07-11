"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@supabase/supabase-js"
import type { RitualArtifact } from "@/lib/types"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Helper function to verify admin role
async function verifyAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.role !== "admin") {
    throw new Error("Unauthorized: You must be an admin to perform this action.")
  }
  return user
}

export async function updateArtifact(
  artifact: RitualArtifact,
): Promise<{ data: RitualArtifact | null; error: string | null }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabase
      .from("ritual_artifacts")
      .update({
        title: artifact.title,
        tags: artifact.tags,
        deck: artifact.deck,
      })
      .eq("id", artifact.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error.message)
      return { data: null, error: error.message }
    }

    revalidatePath("/admin")
    return { data, error: null }
  } catch (e: any) {
    return { data: null, error: e.message }
  }
}

export async function deleteArtifact(id: string): Promise<{ success: boolean; message: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabase.from("ritual_artifacts").delete().eq("id", id)

    if (error) {
      throw error
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: "Artifact deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting artifact:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function processCsvAndCreateProducts(
  csvData: string,
): Promise<{ success: boolean; message: string; data?: any }> {
  try {
    await verifyAdmin()

    // Parse CSV data
    const lines = csvData.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.trim())

    const products = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim())
      const product: any = {}

      headers.forEach((header, index) => {
        product[header] = values[index] || ""
      })

      products.push(product)
    }

    // Insert products into Supabase
    const { data, error } = await supabase.from("ritual_artifacts").insert(products).select()

    if (error) {
      throw error
    }

    revalidatePath("/admin")

    return {
      success: true,
      message: `Successfully processed ${products.length} products`,
      data,
    }
  } catch (error) {
    console.error("Error processing CSV:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
