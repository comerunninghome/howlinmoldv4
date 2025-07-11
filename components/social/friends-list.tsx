"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSocial } from "@/hooks/use-social"
import { Users, UserPlus, UserMinus, MessageCircle, Search, Check, X, AlertCircle, Heart, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FriendsList() {
  const {
    friends,
    friendRequests,
    suggestions,
    activities,
    isLoading,
    error,
    sendFriendRequest,
    respondToFriendRequest,
    removeFriend,
    likeActivity,
    shareProfile,
  } = useSocial()

  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("friends")

  const filteredFriends = friends.filter((friend) =>
    friend.friendProfile?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendRequest = async (userId: string) => {
    const success = await sendFriendRequest(userId, "Hey! Would love to connect and share sonic discoveries!")
    if (success) {
      // Show success feedback
    }
  }

  const handleAcceptRequest = async (fromUserId: string) => {
    await respondToFriendRequest(fromUserId, "accept")
  }

  const handleDeclineRequest = async (fromUserId: string) => {
    await respondToFriendRequest(fromUserId, "decline")
  }

  const handleRemoveFriend = async (friendId: string) => {
    if (confirm("Are you sure you want to remove this friend?")) {
      await removeFriend(friendId)
    }
  }

  const handleShareProfile = async () => {
    const share = await shareProfile("profile", { userId: "current" }, 86400) // 24 hours
    if (share) {
      navigator.clipboard.writeText(share.shareUrl)
      alert("Profile link copied to clipboard!")
    }
  }

  if (error) {
    return (
      <Alert className="border-red-500/50 bg-red-900/20">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Share Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold sacred-text text-primary-foreground">Social Nexus</h2>
        <Button onClick={handleShareProfile} variant="outline" size="sm" className="border-primary/50 text-primary">
          <Share2 className="w-4 h-4 mr-2" />
          Share Profile
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-primary/20">
          <TabsTrigger value="friends" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Users className="w-4 h-4 mr-2" />
            Friends ({friends.length})
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <UserPlus className="w-4 h-4 mr-2" />
            Requests ({friendRequests.incoming.length})
          </TabsTrigger>
          <TabsTrigger
            value="suggestions"
            className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
          >
            <Search className="w-4 h-4 mr-2" />
            Discover
          </TabsTrigger>
          <TabsTrigger value="feed" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Heart className="w-4 h-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="friends" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4 text-foreground/60" />
            <Input
              placeholder="Search friends..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 border-primary/30"
            />
          </div>

          <div className="grid gap-4">
            <AnimatePresence>
              {filteredFriends.map((friend) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="bg-card/80 border-border hover:border-primary/50 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={friend.friendProfile?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{friend.friendProfile?.displayName?.[0] || "?"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{friend.friendProfile?.displayName}</h3>
                            <p className="text-sm text-foreground/60">{friend.friendProfile?.bio}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              {friend.mutualFriends && friend.mutualFriends > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {friend.mutualFriends} mutual friends
                                </Badge>
                              )}
                              {friend.sharedInterests && friend.sharedInterests.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {friend.sharedInterests.join(", ")}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveFriend(friend.friendId)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <UserMinus className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredFriends.length === 0 && !isLoading && (
              <div className="text-center py-8 text-foreground/60">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No friends found.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Incoming Requests</h3>
            {friendRequests.incoming.map((request) => (
              <Card key={request.id} className="bg-card/80 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={request.fromProfile?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{request.fromProfile?.displayName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{request.fromProfile?.displayName}</h3>
                        {request.message && <p className="text-sm text-foreground/70 mt-1">"{request.message}"</p>}
                        <p className="text-xs text-foreground/50 mt-1">
                          {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAcceptRequest(request.fromUserId)}
                        className="text-green-400 hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeclineRequest(request.fromUserId)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {friendRequests.incoming.length === 0 && (
              <div className="text-center py-8 text-foreground/60">
                <UserPlus className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No pending friend requests.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid gap-4">
            {suggestions.map((suggestion) => (
              <Card
                key={suggestion.userId}
                className="bg-card/80 border-border hover:border-primary/50 transition-colors"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={suggestion.profile?.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{suggestion.profile?.displayName?.[0] || "?"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{suggestion.profile?.displayName}</h3>
                        <p className="text-sm text-foreground/60">{suggestion.profile?.bio}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {suggestion.mutualFriends > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.mutualFriends} mutual friends
                            </Badge>
                          )}
                          {suggestion.sharedInterests.length > 0 && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.sharedInterests.join(", ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendRequest(suggestion.userId)}
                      className="text-primary hover:text-primary"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Friend
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {suggestions.length === 0 && !isLoading && (
              <div className="text-center py-8 text-foreground/60">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No suggestions available.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="feed" className="space-y-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <Card key={activity.id} className="bg-card/80 border-border">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={activity.userProfile?.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{activity.userProfile?.displayName?.[0] || "?"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-foreground">{activity.userProfile?.displayName}</span>
                        <span className="text-sm text-foreground/60">
                          {activity.type.replace("_", " ")} • {new Date(activity.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="mb-3">
                        {activity.type === "ritual_completed" && (
                          <p className="text-foreground/80">
                            Completed ritual "{activity.data.ritualName}" and gained {activity.data.resonanceGained}{" "}
                            resonance
                          </p>
                        )}
                        {activity.type === "artifact_acquired" && (
                          <p className="text-foreground/80">
                            Acquired {activity.data.rarity} artifact "{activity.data.artifactName}" by{" "}
                            {activity.data.artist}
                          </p>
                        )}
                        {activity.type === "achievement_unlocked" && (
                          <p className="text-foreground/80">
                            Unlocked {activity.data.rarity} achievement "{activity.data.achievementName}"
                          </p>
                        )}
                        {activity.type === "tier_advanced" && (
                          <p className="text-foreground/80">
                            Advanced from {activity.data.fromTier} to {activity.data.toTier} - {activity.data.newTitle}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-foreground/60">
                        <button
                          onClick={() => likeActivity(activity.id)}
                          className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${
                            activity.isLiked ? "text-red-400" : ""
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${activity.isLiked ? "fill-current" : ""}`} />
                          <span>{activity.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 hover:text-primary transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          <span>{activity.comments}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activities.length === 0 && !isLoading && (
              <div className="text-center py-8 text-foreground/60">
                <Heart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No recent activity from friends.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      )}
    </div>
  )
}
