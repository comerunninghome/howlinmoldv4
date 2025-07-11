import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Radio, Disc3, Zap, Users, Settings, Archive } from "lucide-react"
import Link from "next/link"

export default function CoreInterfacePage() {
  const modules = [
    {
      title: "Broadcast Booth",
      description: "Professional DJ interface with Deck A/B/C controls",
      icon: Radio,
      href: "/broadcast-booth",
      status: "Active",
    },
    {
      title: "Ritual Chamber",
      description: "Sacred mixing space for ceremonial sessions",
      icon: Disc3,
      href: "/ritual-mix",
      status: "Beta",
    },
    {
      title: "Synth Temple",
      description: "Interactive synthesizer and sound design tools",
      icon: Zap,
      href: "/synth-temple",
      status: "Active",
    },
    {
      title: "Community Hub",
      description: "Connect with other seekers and share discoveries",
      icon: Users,
      href: "/community",
      status: "Active",
    },
    {
      title: "The Vault",
      description: "Exclusive artifacts and rare recordings",
      icon: Archive,
      href: "/the-vault",
      status: "Premium",
    },
    {
      title: "System Settings",
      description: "Configure your ritual preferences and themes",
      icon: Settings,
      href: "/settings",
      status: "Active",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Core Interface</h1>
            <p className="text-muted-foreground">Access all system modules and advanced features</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.title} href={module.href}>
              <Card className="h-full transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-primary" />
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        module.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : module.status === "Beta"
                            ? "bg-yellow-100 text-yellow-800"
                            : module.status === "Premium"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {module.status}
                    </span>
                  </div>
                  <CardTitle className="text-xl">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full bg-transparent">
                    Enter Module
                  </Button>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
