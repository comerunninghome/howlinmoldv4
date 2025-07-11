import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EnhancedNavigation } from "@/components/enhanced-navigation"

const artifacts = [
  {
    id: 1,
    title: "Kind of Blue",
    artist: "Miles Davis",
    year: 1959,
    price: 89,
    format: "Vinyl",
    condition: "Sacred",
    image: "/placeholder.svg?height=300&width=300&text=Kind+of+Blue",
    significance: "Modal jazz genesis. The blueprint.",
    inStock: 1,
  },
  {
    id: 2,
    title: "Unknown Pleasures",
    artist: "Joy Division",
    year: 1979,
    price: 156,
    format: "Vinyl",
    condition: "Mythic",
    image: "/placeholder.svg?height=300&width=300&text=Unknown+Pleasures",
    significance: "Post-punk transmission. The void speaks.",
    inStock: 2,
  },
  {
    id: 3,
    title: "Ambient 1: Music for Airports",
    artist: "Brian Eno",
    year: 1978,
    price: 67,
    format: "Vinyl",
    condition: "Pristine",
    image: "/placeholder.svg?height=300&width=300&text=Music+for+Airports",
    significance: "Ambient architecture. Space between notes.",
    inStock: 3,
  },
  {
    id: 4,
    title: "Selected Ambient Works 85-92",
    artist: "Aphex Twin",
    year: 1992,
    price: 134,
    format: "Vinyl",
    condition: "Legendary",
    image: "/placeholder.svg?height=300&width=300&text=Selected+Ambient+Works",
    significance: "Electronic consciousness. Machine dreams.",
    inStock: 1,
  },
  {
    id: 5,
    title: "The Velvet Underground & Nico",
    artist: "The Velvet Underground",
    year: 1967,
    price: 245,
    format: "Vinyl",
    condition: "Artifact",
    image: "/placeholder.svg?height=300&width=300&text=Velvet+Underground",
    significance: "Underground genesis. Warhol's sonic canvas.",
    inStock: 1,
  },
  {
    id: 6,
    title: "Discreet Music",
    artist: "Brian Eno",
    year: 1975,
    price: 78,
    format: "Vinyl",
    condition: "Sacred",
    image: "/placeholder.svg?height=300&width=300&text=Discreet+Music",
    significance: "Generative ambient. The first algorithm.",
    inStock: 2,
  },
]

function ShopPage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 sacred-text text-transparent text-gradient-primary">
              SACRED ARTIFACTS
            </h1>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-poetic text-lg">
              Records are not products—they are vessels. Each carries the DNA of its era. Pricing based on significance,
              not scarcity.
            </p>
            <div className="flex justify-center space-x-4 mb-8">
              <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                {artifacts.length} Artifacts Available
              </Badge>
              <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10">
                Curated Collection
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artifacts.map((artifact) => (
              <Card
                key={artifact.id}
                className="bg-card/80 border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20 group"
              >
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={artifact.image || "/placeholder.svg"}
                      alt={`${artifact.title} by ${artifact.artist}`}
                      className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 border-primary/50 text-primary bg-black/80 backdrop-blur-sm"
                    >
                      {artifact.condition}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5">
                  <div className="mb-4">
                    <h3 className="font-orbitron font-bold text-xl text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      {artifact.title}
                    </h3>
                    <p className="text-foreground/80 text-sm">{artifact.artist}</p>
                    <p className="text-foreground/60 text-xs font-mono">{artifact.year}</p>
                  </div>

                  <p className="font-poetic text-foreground/70 text-sm mb-5 leading-relaxed h-12 overflow-hidden">
                    {artifact.significance}
                  </p>

                  <div className="flex items-center justify-between mb-5">
                    <div className="text-2xl font-bold text-primary">${artifact.price}</div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="border-border text-foreground/70 bg-black/30 px-2 py-1 text-xs"
                      >
                        {artifact.format}
                      </Badge>
                      <Badge variant="outline" className="border-accent/50 text-accent bg-accent/10 px-2 py-1 text-xs">
                        {artifact.inStock} left
                      </Badge>
                    </div>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-semibold py-3 shadow-[0_0_15px_hsl(var(--primary),0.3)] hover:shadow-[0_0_25px_hsl(var(--primary),0.5)] transition-shadow duration-300">
                    Secure Artifact
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to action section */}
          <div className="mt-16 text-center">
            <Card className="bg-card/60 border-primary/30 backdrop-blur-sm max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold sacred-text text-primary mb-4">SEEKING SPECIFIC ARTIFACTS?</h2>
                <p className="font-poetic text-foreground/80 mb-6">
                  Our collection extends beyond what's displayed. Contact us for rare finds, custom curation, or to
                  discuss trades.
                </p>
                <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">
                  Contact the Curator
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

export default function Page() {
  return (
    <ProtectedRoute>
      <ShopPage />
    </ProtectedRoute>
  )
}
