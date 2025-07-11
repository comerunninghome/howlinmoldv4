import { createSupabaseServerClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import type { UserSnapshot } from "@/lib/database-types"

// Get all snapshots for the current user
export async function GET() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data, error } = await supabase.from("user_snapshots").select("*").eq("user_id", user.id)

  if (error) {
    console.error("Error fetching snapshots:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Create a new snapshot
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name, description, tags, state } = (await request.json()) as Omit<
    UserSnapshot,
    "id" | "user_id" | "created_at"
  >

  const { data, error } = await supabase
    .from("user_snapshots")
    .insert({ user_id: user.id, name, description, tags, state })
    .select()
    .single()

  if (error) {
    console.error("Error creating snapshot:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Update a snapshot
export async function PUT(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id, ...updates } = (await request.json()) as Partial<UserSnapshot> & { id: number }

  const { data, error } = await supabase
    .from("user_snapshots")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single()

  if (error) {
    console.error("Error updating snapshot:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Delete a snapshot
export async function DELETE(request: NextRequest) {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await request.json()

  const { error } = await supabase.from("user_snapshots").delete().eq("id", id).eq("user_id", user.id)

  if (error) {
    console.error("Error deleting snapshot:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
