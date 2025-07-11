import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    // NOTE: Rituals and artifacts fetching can be added here from their respective tables
    // For now, returning empty arrays as placeholders.
    const rituals: any[] = []
    const artifacts: any[] = []

    return NextResponse.json({
      profile,
      rituals,
      artifacts,
      stats: {
        totalPlayTimeHours: Math.round(profile.total_play_time / 3600),
        averageRitualDuration: 0, // Placeholder
        favoriteGenre: profile.favorite_genres?.[0] || "Unknown",
        memberSince: new Date(profile.created_at).toLocaleDateString(), // Assuming created_at on profile
      },
    })
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const updates = await request.json()

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Prevent updating primary key or protected fields
    delete updates.id
    delete updates.created_at

    const { data: profile, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single()

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile,
    })
  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
