import { Navigation } from "@/components/navigation"
import { MythicText } from "@/components/ui/mythic-text"
import { CuratedTagDisplay } from "@/components/tags/curated-tag-display"
import { TagCloudWithSelection } from "@/components/tags/tag-cloud-with-selection"
import { SubconsciousMoodInput } from "@/components/mood-matching/subconscious-mood-input"
import { mockArtifacts, type Artifact } from "@/lib/artifacts"
import { getCuratedTags, getDeepTags } from "@/lib/tags"

export default async function DiscoverPage() {
  // In a real app, you'd fetch all artifacts or a relevant subset for matching
  const allAvailableArtifacts: Artifact[] = mockArtifacts

  // Fetch tag data for existing discovery components
  const curatedTags = await getCuratedTags()
  const deepTags = await getDeepTags()

  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-black via-slate-900/70 to-black">
        <div className="container mx-auto space-y-16">
          {/* Section 1: Subconscious Mood Matching - The new core feature */}
          <section className="text-center">
            <MythicText variant="hero" className="text-transparent text-gradient-primary mb-4">
              Evoke a Sonic Atmosphere
            </MythicText>
            <MythicText variant="body" className="text-slate-400 max-w-3xl mx-auto mb-8">
              Translate your ineffable feelings into sound. Describe an abstract emotional state, a fleeting scene, or a
              synesthetic vision, and let the Howlin' Mold Telemetry Engine unearth resonant artifacts from the
              archives.
            </MythicText>
            <SubconsciousMoodInput allArtifacts={allAvailableArtifacts} />
          </section>

          {/* Section 2: Existing Tag-Based Discovery */}
          <div className="space-y-16">
            <section>
              <MythicText variant="title" className="text-slate-300 mb-6 text-center">
                Explore Curated Tag Clouds
              </MythicText>
              <CuratedTagDisplay curatedTags={curatedTags} />
            </section>

            <section>
              <MythicText variant="title" className="text-slate-300 mb-8 text-center">
                Dive into the Deep Static
              </MythicText>
              <div className="max-w-4xl mx-auto">
                <TagCloudWithSelection tags={deepTags} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}
