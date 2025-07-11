"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
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
  Volume2,
  VolumeX,
  Volume1,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSound } from "@/contexts/sound-context"
import Image from "next/image"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

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

export function SporeNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const { playSound, isMuted, toggleMute, volume, setVolume } = useSound()

  const handleNavClick = (href: string, label: string) => {
    playSound("click")
    console.log(`Navigating to: ${href} (${label})`)
    try {
      router.push(href)
      setIsExpanded(false)
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
    <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Button asChild variant="ghost" className="flex items-center space-x-3 hover:bg-transparent px-0 group">
              <Link href="/">
                <Image
                  src="/howlin-mold-logo.png"
                  alt="Howlin Mold Logo"
                  width={40}
                  height={40}
                  className="rounded-full shadow-[0_0_20px_hsl(var(--primary),0.3)] group-hover:shadow-[0_0_30px_hsl(var(--primary),0.5)] transition-shadow duration-300"
                  priority
                />
                <div className="flex flex-col">
                  <span className="text-xl font-bold sacred-text text-primary-foreground tracking-wider">
                    HOWLIN MOLD
                  </span>
                  <span className="text-xs text-primary/70 font-mono tracking-widest">SPORE NETWORK</span>
                </div>
              </Link>
            </Button>

            <div className="hidden lg:flex items-center space-x-1">
              {sporeNodes.map((category) => (
                <DropdownMenu key={category.category}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-foreground/70 hover:text-primary hover:bg-primary/10 transition-all duration-300"
                    >
                      {category.category}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="w-80 bg-black/95 backdrop-blur-xl border-primary/30 p-2"
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
                                "w-full p-3 rounded-lg transition-all duration-300 cursor-pointer group",
                                isActive
                                  ? "bg-primary/20 border border-primary/30"
                                  : "hover:bg-primary/10 border border-transparent hover:border-primary/20",
                              )}
                            >
                              <div className="flex items-start space-x-3">
                                <div
                                  className={cn(
                                    "p-2 rounded-lg bg-gradient-to-br",
                                    item.color,
                                    "group-hover:scale-110 transition-transform duration-300",
                                  )}
                                >
                                  <Icon className="w-4 h-4 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                    {item.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        )
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <div className="lg:hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-foreground/70 hover:text-primary"
                >
                  <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
                    <span
                      className={cn(
                        "block h-0.5 w-6 bg-current transition-all duration-300",
                        isExpanded ? "rotate-45 translate-y-1.5" : "",
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-6 bg-current transition-all duration-300",
                        isExpanded ? "opacity-0" : "",
                      )}
                    />
                    <span
                      className={cn(
                        "block h-0.5 w-6 bg-current transition-all duration-300",
                        isExpanded ? "-rotate-45 -translate-y-1.5" : "",
                      )}
                    />
                  </div>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </div>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    className="text-foreground/70 hover:text-primary hover:bg-primary/10"
                  >
                    {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-black/90 border-primary/30 text-foreground">
                  <p>{isMuted ? "Unmute" : "Mute"}</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary/30 bg-black/20 backdrop-blur-sm text-foreground/80 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all duration-300"
                  >
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="bg-black/95 backdrop-blur-xl border-primary/30 w-60"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  <DropdownMenuItem className="focus:bg-primary/20 cursor-default">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/20" />
                  <div className="px-2 py-1.5">
                    <Label htmlFor="volume-slider" className="text-sm text-muted-foreground pl-1">
                      Volume
                    </Label>
                    <div className="flex items-center gap-2 mt-2">
                      <Volume1 className="h-4 w-4 text-muted-foreground" />
                      <Slider
                        id="volume-slider"
                        min={0}
                        max={1}
                        step={0.01}
                        value={[volume]}
                        onValueChange={(value) => setVolume(value[0])}
                        disabled={isMuted}
                        className={cn(isMuted && "opacity-50")}
                      />
                      <Volume2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
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
        </div>

        {isExpanded && (
          <div className="lg:hidden border-t border-primary/20 bg-black/95 backdrop-blur-xl">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-6">
                {sporeNodes.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-sm font-semibold text-primary mb-3 tracking-wider">{category.category}</h3>
                    <div className="grid gap-2">
                      {category.items.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

                        return (
                          <button
                            key={item.href}
                            onClick={() => handleNavClick(item.href, item.label)}
                            className={cn(
                              "w-full p-3 rounded-lg transition-all duration-300 text-left group",
                              isActive
                                ? "bg-primary/20 border border-primary/30"
                                : "hover:bg-primary/10 border border-transparent hover:border-primary/20",
                            )}
                          >
                            <div className="flex items-center space-x-3">
                              <div className={cn("p-2 rounded-lg bg-gradient-to-br flex-shrink-0", item.color)}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                                  {item.label}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                              </div>
                            </div>
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

      <div className="h-16" />
    </TooltipProvider>
  )
}
