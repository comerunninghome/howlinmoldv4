"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share2, Play, Users, TrendingUp, Zap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DiscoveryPost {
  id: string
  user: {
    name: string
    avatar: string
    level: number
    badge: string
  }
  type: "discovery" | "ritual" | "collection" | "review"
  content: {
    title: string
    description: string
    artifact?: {
      name: string
      artist: string
      image: string
      rarity: "Common" | "Rare" | "Legendary" | "Mythic"
    }
    tags: string[]
  }
  engagement: {
    likes: number
    comments: number
    shares: number
    isLiked: boolean
  }
  timestamp: string
  trending: boolean
}

const mockPosts: DiscoveryPost[] = [
  {
    id: "1",
    user: {
      name: "Echo Keeper",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 12,
      badge: "Sonic Archaeologist",
    },
    type: "discovery",
    content: {
      title: "Unearthed a Hidden Gem",
      description: "Found this obscure ambient piece from 1978. The way it captures urban isolation is haunting.",
      artifact: {
        name: "Music for Airports",
        artist: "Brian Eno",
        image: "/placeholder.svg?height=200&width=200",
        rarity: "Legendary",
      },
      tags: ["ambient", "experimental", "1970s", "eno"],
    },
    engagement: {
      likes: 47,
      comments: 12,
      shares: 8,
      isLiked: false,
    },
    timestamp: "2 hours ago",
    trending: true,
  },
  {
    id: "2",
    user: {
      name: "Frequency Shaman",
      avatar: "/placeholder.svg?height=40&width=40",
      level: 8,
      badge: "Ritual Master",
    },
    type: "ritual",
    content: {
      title: "Midnight Listening Ritual Complete",
      description: "3 hours of deep listening to modal jazz. The consciousness shift was profound.",
      tags: ["ritual", "jazz", "meditation", "consciousness"],
    },
    engagement: {
      likes: 23,
      comments: 6,
      shares: 3,
      isLiked: true,
    },
    timestamp: "4 hours ago",
    trending: false,
  },
]

export function DiscoveryFeed() {
  const [posts, setPosts] = useState<DiscoveryPost[]>(mockPosts)
  const [filter, setFilter] = useState<"all" | "trending" | "following">("all")

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              engagement: {
                ...post.engagement,
                likes: post.engagement.isLiked ? post.engagement.likes - 1 : post.engagement.likes + 1,
                isLiked: !post.engagement.isLiked,
              },
            }
          : post,
      ),
    )
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "Mythic":
        return "text-purple-400 border-purple-400/50"
      case "Legendary":
        return "text-amber-400 border-amber-400/50"
      case "Rare":
        return "text-blue-400 border-blue-400/50"
      default:
        return "text-gray-400 border-gray-400/50"
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Filter Tabs - Better spacing and layout */}
      <div className="flex flex-wrap gap-3 mb-8 p-4 bg-card/30 rounded-lg border border-border/50">
        {["all", "trending", "following"].map((filterType) => (
          <Button
            key={filterType}
            variant={filter === filterType ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(filterType as any)}
            className={`capitalize min-w-[100px] ${filter === filterType ? "bg-primary" : "border-primary/30"}`}
          >
            {filterType === "trending" && <TrendingUp className="w-4 h-4 mr-2" />}
            {filterType === "following" && <Users className="w-4 h-4 mr-2" />}
            {filterType}
          </Button>
        ))}
      </div>

      {/* Posts Feed - Improved spacing */}
      <AnimatePresence>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="bg-card/80 border-border hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-grow min-w-0">
                    <Avatar className="w-12 h-12 flex-shrink-0">
                      <AvatarImage src={post.user.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{post.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-grow">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-orbitron font-semibold text-foreground">{post.user.name}</span>
                        <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                          Lv.{post.user.level}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-foreground/60">
                        <span>{post.user.badge}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                        {post.trending && (
                          <>
                            <span>•</span>
                            <div className="flex items-center text-amber-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              <span>Trending</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`capitalize flex-shrink-0 ${post.type === "discovery" ? "border-green-400/50 text-green-400" : "border-purple-400/50 text-purple-400"}`}
                  >
                    {post.type}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Post Content - Better spacing */}
                <div className="space-y-3">
                  <h3 className="font-orbitron font-bold text-xl text-foreground leading-tight">
                    {post.content.title}
                  </h3>
                  <p className="font-poetic text-foreground/80 leading-relaxed text-base">{post.content.description}</p>
                </div>

                {/* Artifact Display - Improved layout */}
                {post.content.artifact && (
                  <Card className="bg-black/30 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <img
                          src={post.content.artifact.image || "/placeholder.svg"}
                          alt={post.content.artifact.name}
                          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 mx-auto sm:mx-0"
                        />
                        <div className="flex-grow min-w-0 text-center sm:text-left">
                          <h4 className="font-orbitron font-semibold text-foreground mb-1">
                            {post.content.artifact.name}
                          </h4>
                          <p className="text-foreground/70 text-sm mb-2">{post.content.artifact.artist}</p>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getRarityColor(post.content.artifact.rarity)}`}
                          >
                            {post.content.artifact.rarity}
                          </Badge>
                        </div>
                        <Button size="sm" variant="outline" className="border-primary/50 text-primary flex-shrink-0">
                          <Play className="w-4 h-4 mr-2" />
                          Listen
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Tags - Better wrapping */}
                <div className="flex flex-wrap gap-2">
                  {post.content.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-accent/50 text-accent bg-accent/10">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Engagement Actions - Better responsive layout */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={`${post.engagement.isLiked ? "text-red-400" : "text-foreground/60"} hover:text-red-400 p-2`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${post.engagement.isLiked ? "fill-current" : ""}`} />
                      <span className="font-semibold">{post.engagement.likes}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-primary p-2">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{post.engagement.comments}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-accent p-2">
                      <Share2 className="w-5 h-5 mr-2" />
                      <span className="font-semibold">{post.engagement.shares}</span>
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" className="border-primary/50 text-primary min-w-[100px]">
                    <Zap className="w-4 h-4 mr-2" />
                    Boost
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
