import { redirect } from "next/navigation"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { ArtifactDataTable } from "@/components/admin/artifact-data-table"
import type { RitualArtifact } from "@/lib/types"
import { Navigation } from "@/components/navigation"

async function getArtifacts(): Promise<RitualArtifact[]> {
  const supabase = createSupabaseServerClient()
  const { data, error } = await supabase
    .from("ritual_artifacts")
    .select("*")
    .order("dateCanonized", { ascending: false })

  if (error) {
    console.error("Error fetching artifacts:", error)
    return []
  }
  return data as RitualArtifact[]
}

export default async function AdminPage() {
  const supabase = createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Secure the route to only allow admin users
  if (!user || user.user_metadata?.role !== "admin") {
    redirect("/") // Or redirect to a dedicated 'unauthorized' page
  }

  const artifacts = await getArtifacts()

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-20 px-4 py-8 bg-black text-gray-200">
        <div className="container mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 sacred-text tracking-wider text-teal-300">RITUAL CONTROL CONSOLE</h1>
            <p className="text-teal-200/80">Manage the sacred artifacts of the canon.</p>
          </div>
          <div className="p-6 bg-black/30 border border-teal-500/20 rounded-lg shadow-2xl shadow-teal-900/50">
            <ArtifactDataTable initialData={artifacts} />
          </div>
        </div>
      </main>
    </>
  )
}
