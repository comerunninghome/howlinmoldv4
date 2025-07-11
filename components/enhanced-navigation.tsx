"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
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
  UserIcon,
  LogOut,
  Settings,
  Home,
  Search,
  Users,
  Star,
  BookOpen,
  Radio,
  Zap,
  Grid3X3,
  Archive,
  Waves,
  RadioTower,
  SlidersHorizontal,
  Crown,
  Menu,
  X,
  ChevronDown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context"
import Image from "next/image"

const sporeNodes = [
  {
    category: "Discovery Core",
    items: [
      {
        href: "/",
        label: "Signal Hub",
        icon: Home,
        description: "Central command for your sonic journey",
        color: "from-blue-500 to-cyan-500",
      },
      {
        href: "/discover",
        label: "Sonic Radar",
        icon: Search,
        description: "AI-powered music discovery engine",
        color: "from-purple-500 to-pink-500",
      },
      {
        href: "/shop",
        label: "Artifact Vault",
        icon: Archive,
        description: "Curated collection of sonic artifacts",
        color: "from-amber-500 to-orange-500",
      },
    ],
  },
  {
    category: "Community Nodes",
    items: [
      {
        href: "/community",
        label: "Spore Network",
        icon: Users,
        description: "Connect with fellow sonic explorers",
        color: "from-green-500 to-emerald-500",
      },
      {
        href: "/exclusives",
        label: "Inner Circle",
        icon: Star,
        description: "Exclusive content for dedicated members",
        color: "from-violet-500 to-purple-500",
      },
      {
        href: "/zine",
        label: "Sonic Chronicles",
        icon: BookOpen,
        description: "Stories from the musical underground",
        color: "from-teal-500 to-cyan-500",
      },
    ],
  },
  {
    category: "Creation Tools",
    items: [
      {
        href: "/booth",
        label: "Mix Laboratory",
        icon: Radio,
        description: "Professional mixing and creation tools",
        color: "from-red-500 to-pink-500",
      },
      {
        href: "/ritual-mix",
        label: "Ritual Chamber",
        icon: Zap,
        description: "Sacred space for sonic rituals",
        color: "from-indigo-500 to-purple-500",
      },
      {
        href: "/vinyl-grid",
        label: "Grid Matrix",
        icon: Grid3X3,
        description: "Visual organization of your collection",
        color: "from-cyan-500 to-blue-500",
      },
      {
        href: "/synth-temple",
        label: "Synth Temple",
        icon: Settings,
        description: "Modular synthesis altar for ritual sound creation",
        color: "from-cyan-500 to-blue-500",
      },
    ],
  },
  {
    category: "Advanced Nodes",
    items: [
      {
        href: "/sonic-shrine",
        label: "Sonic Shrine",
        icon: Waves,
        description: "Deep sonic meditation and analysis",
        color: "from-emerald-500 to-teal-500",
      },
      {
        href: "/broadcast-booth",
        label: "Transmission Hub",
        icon: RadioTower,
        description: "Broadcast your discoveries to the world",
        color: "from-orange-500 to-red-500",
      },
      {
        href: "/decks-ab",
        label: "Dual Resonance",
        icon: SlidersHorizontal,
        description: "Advanced A/B comparison tools",
        color: "from-pink-500 to-rose-500",
      },
    ],
  },
]

export const EnhancedNavigation = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const { playSound } = useSound()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavClick = (href: string, label: string) => {
    playSound("click")
    console.log(`Navigating to: ${href} (${label})`)
    try {
      router.push(href)
      setIsExpanded(false)
      setActiveCategory(null)
    } catch (error) {
      console.error(`Navigation failed for ${href}:`, error)
      playSound("error")
    }
  }

  const handleLogout = () => {
    playSound("click")
    logout()
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-black/95 backdrop-blur-xl border-b border-primary/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            : "bg-black/80 backdrop-blur-md border-b border-primary/20",
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Button asChild variant="ghost" className="flex items-center space-x-3 hover:bg-transparent px-0 group">
              <Link href="/">
                <div className="relative">
                  <Image
                    src="/howlin-mold-logo.png"
                    alt="Howlin Mold Logo"
                    width={40}
                    height={40}
                    className="rounded-full shadow-[0_0_20px_hsl(var(--primary),0.3)] group-hover:shadow-[0_0_30px_hsl(var(--primary),0.5)] transition-all duration-300"
                    priority
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold sacred-text text-primary-foreground tracking-wider group-hover:text-primary transition-colors duration-300">
                    HOWLIN MOLD
                  </span>
                  <span className="text-xs text-primary/70 font-mono tracking-widest group-hover:text-primary/90 transition-colors duration-300">
                    SPORE NETWORK
                  </span>
                </div>
              </Link>
            </Button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {sporeNodes.map((category) => (
                <DropdownMenu key={category.category}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300 relative group",
                        "before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-primary before:transition-all before:duration-300",
                        "hover:before:w-full",
                      )}
                      onMouseEnter={() => setActiveCategory(category.category)}
                      onMouseLeave={() => setActiveCategory(null)}
                    >
                      {category.category}
                      <ChevronDown className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:rotate-180" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-80 bg-black/95 backdrop-blur-xl border-primary/30 p-2 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                  >
                    <div className="grid gap-2">
                      {category.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                        return (
                          <DropdownMenuItem
                            key={item.href}
                            className="p-0 focus:bg-transparent"
                            onSelect={() => handleNavClick(item.href, item.label)}
                          >
                            <div
                              className={cn(
                                "w-full p-3 rounded-lg transition-all duration-300 cursor-pointer group relative overflow-hidden",
                                isActive
                                  ? "bg-primary/20 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary),0.1)]"
                                  : "hover:bg-primary/10 border border-transparent hover:border-primary/20",
                              )}
                            >
                              <div className="flex items-start space-x-3 relative z-10">
                                <div
                                  className={cn(
                                    "p-2 rounded-lg bg-gradient-to-br flex-shrink-0",
                                    item.color,
                                    "group-hover:scale-110 transition-transform duration-300 shadow-lg",
                                  )}
                                >
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground group-hover:text-primary transition-colors font-orbitron">
                                    {item.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                                    {item.description}
                                  </div>
                                </div>
                              </div>
                              {/* Hover effect background */}
                              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-foreground/70 hover:text-primary relative group"
              >
                <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                  {isExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </div>
              </Button>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                    "border-primary/30 bg-black/20 backdrop-blur-sm text-foreground/80 transition-all duration-300 relative group overflow-hidden",
                    "hover:bg-primary/10 hover:text-primary hover:border-primary/50 hover:shadow-[0_0_20px_hsl(var(--primary),0.2)]",
                  )}
                >
                  <UserIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline font-medium">{user?.name}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-black/95 backdrop-blur-xl border-primary/30 shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <DropdownMenuItem className="focus:bg-primary/20 cursor-default">
                  <UserIcon className="w-4 h-4 mr-2" />
                  <div className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem asChild className="focus:bg-primary/20 cursor-pointer">
                  <Link href="/subscription">
                    <Crown className="w-4 h-4 mr-2" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-primary/20 cursor-pointer">
                  <Link href="/settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-primary/20" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:!text-red-300 focus:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Expanded Menu */}
        {isExpanded && (
          <div className="lg:hidden border-t border-primary/20 bg-black/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-6">
                {sporeNodes.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-semibold text-primary mb-3 tracking-wider font-orbitron">
                      {category.category}
                    </h3>
                    <div className="grid gap-2">
                      {category.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                        return (
                          <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href, item.label)}
                            className={cn(
                              "w-full p-3 rounded-lg transition-all duration-300 text-left group relative overflow-hidden",
                              isActive
                                ? "bg-primary/20 border border-primary/30 shadow-[0_0_20px_hsl(var(--primary),0.1)]"
                                : "hover:bg-primary/10 border border-transparent hover:border-primary/20",
                            )}
                          >
                            <div className="flex items-center space-x-3 relative z-10">
                              <div className={cn("p-2 rounded-lg bg-gradient-to-br flex-shrink-0", item.color)}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground group-hover:text-primary transition-colors font-orbitron">
                                  {item.label}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from hiding behind fixed nav */}
      <div className="h-16" />
    </>
  )
}
