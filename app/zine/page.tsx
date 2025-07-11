import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EnhancedNavigation } from "@/components/enhanced-navigation"

const articles = [
  {
    id: 1,
    title: "The Archaeology of Sound",
    author: "Echo Keeper",
    date: "2024-01-15",
    excerpt:
      "Every record is a time capsule. When we drop the needle, we're not just playing music—we're conducting séances with the past.",
    category: "Philosophy",
    readTime: "8 min",
  },
  {
    id: 2,
    title: "Ritual Listening in the Digital Age",
    author: "Frequency Shaman",
    date: "2024-01-10",
    excerpt:
      "In an era of infinite streams, the act of choosing a single album becomes sacred. The ritual of physical media as resistance.",
    category: "Culture",
    readTime: "12 min",
  },
  {
    id: 3,
    title: "The Mythology of Ambient Music",
    author: "Void Walker",
    date: "2024-01-05",
    excerpt:
      "From Eno's airports to today's algorithmic soundscapes—how ambient music became the soundtrack to our collective unconscious.",
    category: "History",
    readTime: "15 min",
  },
]

function ZinePage() {
  return (
    <>
      <EnhancedNavigation />
      <div className="min-h-screen pt-24 px-4 pb-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold mb-4 sacred-text text-transparent text-gradient-primary">THE ZINE</h1>
            <p className="text-foreground/80 mb-6 max-w-2xl mx-auto font-poetic text-lg">
              Digital artifacts and written transmissions. Stories from the sonic underground.
            </p>
          </div>

          <div className="space-y-8">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="bg-card/80 border-border hover:border-primary transition-all duration-300 shadow-lg hover:shadow-primary/20 group cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="font-orbitron text-2xl text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-foreground/60 mb-3">
                        <span className="font-poetic">by {article.author}</span>
                        <span>•</span>
                        <span>{article.date}</span>
                        <span>•</span>
                        <span>{article.readTime} read</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10">
                      {article.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="font-poetic text-foreground/80 leading-relaxed">{article.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Featured section */}
          <div className="mt-16">
            <Card className="bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-primary/30 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-bold sacred-text text-primary mb-4">CONTRIBUTE TO THE ZINE</h2>
                <p className="font-poetic text-foreground/80 mb-6 max-w-xl mx-auto">
                  Share your sonic archaeology. We seek writings on music, ritual, technology, and the spaces between
                  sound and silence.
                </p>
                <div className="flex justify-center space-x-4">
                  <Badge variant="outline" className="border-primary/50 text-primary">
                    Essays Welcome
                  </Badge>
                  <Badge variant="outline" className="border-accent/50 text-accent">
                    Reviews Sought
                  </Badge>
                  <Badge variant="outline" className="border-secondary/50 text-secondary">
                    Interviews Desired
                  </Badge>
                </div>
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
      <ZinePage />
    </ProtectedRoute>
  )
}
