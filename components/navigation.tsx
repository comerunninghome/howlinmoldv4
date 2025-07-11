"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  Radio,
  BookOpen,
  Settings,
  Zap,
  Combine,
  Grid3X3,
  Archive,
  Waves,
  RadioTower,
  SlidersHorizontal,
  UserIcon,
  LogOut,
} from "lucide-react"
import Image from "next/image"

const navItems = [
  { href: "/", label: "Signal", icon: Home },
  { href: "/shop", label: "Artifacts", icon: Radio },
  { href: "/zine", label: "Zine", icon: BookOpen },
  { href: "/booth", label: "Booth", icon: Zap },
  { href: "/ritual-mix", label: "Ritual Mix", icon: Combine }, // Replaced Blend with Combine
  { href: "/vinyl-grid", label: "Vinyl Grid", icon: Grid3X3 },
  { href: "/the-vault", label: "The Vault", icon: Archive },
  { href: "/sonic-shrine", label: "Sonic Shrine", icon: Waves },
  { href: "/broadcast-booth", label: "Broadcast Booth", icon: RadioTower },
  { href: "/decks-ab", label: "Decks A/B", icon: SlidersHorizontal },
  { href: "/admin", label: "Control", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()

  const handleNavClick = (href: string, label: string) => {
    console.log(`Navigating to: ${href} (${label})`)
    try {
      router.push(href)
    } catch (error) {
      console.error(`Navigation failed for ${href}:`, error)
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-primary/30">
      {" "}
      {/* Use primary for border */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Button asChild variant="ghost" className="flex items-center space-x-2 hover:bg-transparent px-0">
            <Link href="/">
              {/* Gradient for logo could be primary to accent */}
              <Image
                src="/howlin-mold-logo.png"
                alt="Howlin Mold Logo"
                width={32}
                height={32}
                className="rounded-full"
                priority // Added priority to suggest preloading for LCP
              />
              <span className="text-xl font-bold sacred-text text-primary-foreground tracking-wider">HOWLIN MOLD</span>
            </Link>
          </Button>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

              if (item.href === "/admin" && user?.role !== "admin") {
                return null
              }

              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className={`
                transition-colors duration-200
                ${isActive ? "bg-primary/30 text-primary-foreground" : "text-teal-200 hover:bg-primary/20 hover:text-primary-foreground"}
              `} // Using teal-200 for inactive, primary-foreground for active/hover
                  onClick={() => handleNavClick(item.href, item.label)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              )
            })}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="border-primary/50 text-teal-200 hover:bg-primary/20 hover:text-primary-foreground bg-transparent" // Adjusted colors
              >
                <UserIcon className="w-4 h-4 mr-2" />
                {user?.name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/90 border-primary/40 text-teal-100">
              {" "}
              {/* Adjusted colors */}
              <DropdownMenuItem className="focus:bg-primary/20 focus:text-primary-foreground">
                <UserIcon className="w-4 h-4 mr-2" />
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-primary/30" />
              <DropdownMenuItem
                onClick={logout}
                className="text-red-400 hover:!text-red-300 focus:bg-red-500/10 focus:!text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
