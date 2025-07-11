import { type NextRequest, NextResponse } from "next/server"

// Mock social data
const MOCK_FRIENDS: Record<string, any[]> = {
  "1": [
    {
      id: "friend_1_1",
      userId: "1",
      friendId: "2",
      status: "accepted",
      createdAt: "2024-11-15T10:30:00Z",
      acceptedAt: "2024-11-15T11:00:00Z",
      mutualFriends: 3,
      sharedInterests: ["Ambient Techno", "Ritual Bass"],
    },
    {
      id: "friend_1_2",
      userId: "1",
      friendId: "3",
      status: "accepted",
      createdAt: "2024-12-01T14:20:00Z",
      acceptedAt: "2024-12-01T15:30:00Z",
      mutualFriends: 1,
      sharedInterests: ["Experimental Bass"],
    },
  ],
  "2": [
    {
      id: "friend_2_1",
      userId: "2",
      friendId: "1",
      status: "accepted",
      createdAt: "2024-11-15T10:30:00Z",
      acceptedAt: "2024-11-15T11:00:00Z",
      mutualFriends: 3,
      sharedInterests: ["Ambient Techno", "Ritual Bass"],
    },
    {
      id: "friend_2_2",
      userId: "2",
      friendId: "4",
      status: "accepted",
      createdAt: "2024-10-20T09:15:00Z",
      acceptedAt: "2024-10-20T10:45:00Z",
      mutualFriends: 5,
      sharedInterests: ["Label Curations", "Artist Collaborations"],
    },
  ],
}

const MOCK_FRIEND_REQUESTS: Record<string, any[]> = {
  "1": [
    {
      id: "request_1_1",
      fromUserId: "5",
      toUserId: "1",
      message: "Hey! Love your ritual mixes, would love to connect!",
      status: "pending",
      createdAt: "2024-12-20T16:30:00Z",
    },
  ],
  "2": [
    {
      id: "request_2_1",
      fromUserId: "3",
      toUserId: "2",
      message: "Found some amazing artifacts you might like!",
      status: "pending",
      createdAt: "2024-12-21T09:15:00Z",
    },
  ],
}

const MOCK_USER_SOCIAL: Record<string, any> = {
  "1": {
    id: "social_1",
    userId: "1",
    displayName: "Echo Keeper",
    bio: "Sonic archaeologist exploring the depths of ambient consciousness. Curator of forgotten frequencies.",
    avatar: "/placeholder.svg?height=100&width=100",
    isPublic: true,
    allowFriendRequests: true,
    showActivity: true,
    showArtifacts: true,
    showRituals: true,
    socialLinks: {
      soundcloud: "https://soundcloud.com/echo-keeper",
      bandcamp: "https://echokeeper.bandcamp.com",
    },
    stats: {
      friendsCount: 12,
      followersCount: 45,
      followingCount: 23,
    },
  },
  "2": {
    id: "social_2",
    userId: "2",
    displayName: "Frequency Shaman",
    bio: "Ritual master and pattern weaver. Channeling cosmic vibrations through sacred sound design.",
    avatar: "/placeholder.svg?height=100&width=100",
    isPublic: true,
    allowFriendRequests: true,
    showActivity: true,
    showArtifacts: false,
    showRituals: true,
    socialLinks: {
      spotify: "https://open.spotify.com/artist/frequency-shaman",
      instagram: "https://instagram.com/frequency_shaman",
    },
    stats: {
      friendsCount: 28,
      followersCount: 156,
      followingCount: 67,
    },
  },
  "3": {
    id: "social_3",
    userId: "3",
    displayName: "Bass Alchemist",
    bio: "Transmuting low frequencies into higher consciousness. Industrial ambient explorer.",
    avatar: "/placeholder.svg?height=100&width=100",
    isPublic: true,
    allowFriendRequests: true,
    showActivity: true,
    showArtifacts: true,
    showRituals: false,
    socialLinks: {
      bandcamp: "https://bassalchemist.bandcamp.com",
    },
    stats: {
      friendsCount: 19,
      followersCount: 78,
      followingCount: 34,
    },
  },
  "4": {
    id: "social_4",
    userId: "4",
    displayName: "Label Curator Supreme",
    bio: "Architect of sonic experiences. Connecting artists with their destined audiences through mystical curation.",
    avatar: "/placeholder.svg?height=100&width=100",
    isPublic: true,
    allowFriendRequests: false,
    showActivity: true,
    showArtifacts: true,
    showRituals: true,
    socialLinks: {
      soundcloud: "https://soundcloud.com/label-curator",
      spotify: "https://open.spotify.com/user/labelcurator",
      bandcamp: "https://labelcurator.bandcamp.com",
      instagram: "https://instagram.com/label_curator",
    },
    stats: {
      friendsCount: 89,
      followersCount: 234,
      followingCount: 156,
    },
  },
  "5": {
    id: "social_5",
    userId: "5",
    displayName: "Ambient Wanderer",
    bio: "New to the sonic realm, seeking guidance from fellow travelers on this mystical journey.",
    avatar: "/placeholder.svg?height=100&width=100",
    isPublic: true,
    allowFriendRequests: true,
    showActivity: true,
    showArtifacts: true,
    showRituals: true,
    socialLinks: {},
    stats: {
      friendsCount: 3,
      followersCount: 8,
      followingCount: 15,
    },
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const type = searchParams.get("type") || "friends" // friends, requests, suggestions

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 200))

    switch (type) {
      case "friends":
        const friends = MOCK_FRIENDS[userId] || []
        const friendsWithProfiles = friends.map((friend) => ({
          ...friend,
          friendProfile: MOCK_USER_SOCIAL[friend.friendId],
        }))
        return NextResponse.json({ friends: friendsWithProfiles })

      case "requests":
        const incomingRequests = MOCK_FRIEND_REQUESTS[userId] || []
        const outgoingRequests = Object.values(MOCK_FRIEND_REQUESTS)
          .flat()
          .filter((req) => req.fromUserId === userId)

        const requestsWithProfiles = {
          incoming: incomingRequests.map((req) => ({
            ...req,
            fromProfile: MOCK_USER_SOCIAL[req.fromUserId],
          })),
          outgoing: outgoingRequests.map((req) => ({
            ...req,
            toProfile: MOCK_USER_SOCIAL[req.toUserId],
          })),
        }
        return NextResponse.json(requestsWithProfiles)

      case "suggestions":
        // Simple suggestion logic - users not already friends
        const currentFriends = (MOCK_FRIENDS[userId] || []).map((f) => f.friendId)
        const suggestions = Object.entries(MOCK_USER_SOCIAL)
          .filter(([id]) => id !== userId && !currentFriends.includes(id))
          .slice(0, 5)
          .map(([id, profile]) => ({
            userId: id,
            profile,
            mutualFriends: Math.floor(Math.random() * 5),
            sharedInterests: ["Ambient", "Experimental"].slice(0, Math.floor(Math.random() * 2) + 1),
          }))

        return NextResponse.json({ suggestions })

      default:
        return NextResponse.json({ error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error fetching social data:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const body = await request.json()
    const { action, targetUserId, message } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await new Promise((resolve) => setTimeout(resolve, 300))

    switch (action) {
      case "send_request":
        const newRequest = {
          id: `request_${Date.now()}`,
          fromUserId: userId,
          toUserId: targetUserId,
          message: message || "",
          status: "pending",
          createdAt: new Date().toISOString(),
        }

        if (!MOCK_FRIEND_REQUESTS[targetUserId]) {
          MOCK_FRIEND_REQUESTS[targetUserId] = []
        }
        MOCK_FRIEND_REQUESTS[targetUserId].push(newRequest)

        return NextResponse.json({ success: true, request: newRequest })

      case "accept_request":
        // Find and update the request
        const requests = MOCK_FRIEND_REQUESTS[userId] || []
        const requestIndex = requests.findIndex((r) => r.fromUserId === targetUserId && r.status === "pending")

        if (requestIndex === -1) {
          return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        requests[requestIndex].status = "accepted"
        requests[requestIndex].respondedAt = new Date().toISOString()

        // Add friendship both ways
        const friendship1 = {
          id: `friend_${Date.now()}_1`,
          userId: userId,
          friendId: targetUserId,
          status: "accepted",
          createdAt: new Date().toISOString(),
          acceptedAt: new Date().toISOString(),
          mutualFriends: 0,
          sharedInterests: [],
        }

        const friendship2 = {
          id: `friend_${Date.now()}_2`,
          userId: targetUserId,
          friendId: userId,
          status: "accepted",
          createdAt: new Date().toISOString(),
          acceptedAt: new Date().toISOString(),
          mutualFriends: 0,
          sharedInterests: [],
        }

        if (!MOCK_FRIENDS[userId]) MOCK_FRIENDS[userId] = []
        if (!MOCK_FRIENDS[targetUserId]) MOCK_FRIENDS[targetUserId] = []

        MOCK_FRIENDS[userId].push(friendship1)
        MOCK_FRIENDS[targetUserId].push(friendship2)

        return NextResponse.json({ success: true, friendship: friendship1 })

      case "decline_request":
        const declineRequests = MOCK_FRIEND_REQUESTS[userId] || []
        const declineIndex = declineRequests.findIndex((r) => r.fromUserId === targetUserId && r.status === "pending")

        if (declineIndex === -1) {
          return NextResponse.json({ error: "Request not found" }, { status: 404 })
        }

        declineRequests[declineIndex].status = "declined"
        declineRequests[declineIndex].respondedAt = new Date().toISOString()

        return NextResponse.json({ success: true })

      case "remove_friend":
        // Remove friendship both ways
        if (MOCK_FRIENDS[userId]) {
          MOCK_FRIENDS[userId] = MOCK_FRIENDS[userId].filter((f) => f.friendId !== targetUserId)
        }
        if (MOCK_FRIENDS[targetUserId]) {
          MOCK_FRIENDS[targetUserId] = MOCK_FRIENDS[targetUserId].filter((f) => f.friendId !== userId)
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error processing social action:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
